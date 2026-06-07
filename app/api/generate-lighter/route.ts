import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS: Record<string, string> = {
    cyberpunk:
        "A neon cyberpunk style lighter wrap design. Electric neon cyan and magenta glitch effects, digital grid lines, holographic circuits, and a cyberpunk city skyline in the background. Bold 'DAVAY' text in an electric glitch font. Very dark background with vivid neon lights. High quality product wrap art, vertical composition.",
    anime:
        "A Tokyo anime cel-shaded lighter wrap design. Vibrant Japanese anime art style, cherry blossom petals cascading, dynamic action lines, bold manga ink outlines, pastel sakura pink and golden tones. Bold 'DAVAY' text in an anime-style font. High quality product wrap art, vertical composition.",
    streetart:
        "A gritty urban street art graffiti lighter wrap design. Raw spray paint drips, stencil graffiti textures, concrete wall texture visible, bold color blocking in orange, yellow and red. Street tag 'DAVAY' in large graffiti letters. High quality product wrap art, vertical composition.",
};

const PORTRAIT_SUFFIX =
    " In the center of the design, feature a stylized illustrated portrait of a person rendered in the described art style — abstract, artistic, and integrated into the overall composition.";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const style = (formData.get("style") as string) ?? "cyberpunk";
        const imageFile = formData.get("image") as File | null;

        // Using Cloudflare native REST API directly
        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const apiToken = process.env.CLOUDFLARE_API_TOKEN;

        if (!accountId || !apiToken) {
            return NextResponse.json(
                { error: "Cloudflare credentials missing. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN" },
                { status: 400 }
            );
        }

        const hasPhoto = imageFile && imageFile.size > 0;
        const prompt = STYLE_PROMPTS[style] + (hasPhoto ? PORTRAIT_SUFFIX : "");

        // We use the stable-diffusion-xl-lightning model for extremely fast, high-quality generation
        const restApiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/bytedance/stable-diffusion-xl-lightning`;

        const res = await fetch(restApiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
            const errText = await res.text();
            let parsedErr = errText;
            try {
                const json = JSON.parse(errText);
                parsedErr = json.errors?.[0]?.message || errText;
            } catch (e) {
                // If it's not JSON, use raw text
            }
            throw new Error(`Cloudflare API Error (${res.status}): ${parsedErr}`);
        }

        // Cloudflare returns the raw image blob natively
        const imageBuffer = await res.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString("base64");
        const imageUrl = `data:image/png;base64,${base64Image}`;

        return NextResponse.json({ imageUrl });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[generate-lighter]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
