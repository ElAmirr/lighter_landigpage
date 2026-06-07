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

        const workerUrl = process.env.CLOUDFLARE_WORKER_URL;
        const apiKey = process.env.CLOUDFLARE_API_KEY;

        if (!workerUrl || !apiKey) {
            return NextResponse.json(
                { error: "Cloudflare Worker URL or API Key missing. Please check .env.local" },
                { status: 400 }
            );
        }

        const hasPhoto = imageFile && imageFile.size > 0;
        const prompt = STYLE_PROMPTS[style] + (hasPhoto ? PORTRAIT_SUFFIX : "");

        // Cloudflare Workers AI call
        const res = await fetch(workerUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Cloudflare API Error (${res.status}): ${errText}`);
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
