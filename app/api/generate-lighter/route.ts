import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai";

const STYLE_PROMPTS: Record<string, string> = {
    cyberpunk:
        "Neon cyberpunk style lighter wrap design. Electric neon cyan and magenta glitch effects, digital grid lines, holographic circuits, and cyberpunk city skyline. Bold 'DAVAY' text in electric font. Dark background with vivid neon lights. High quality product art, flat wrap layout.",
    anime:
        "Tokyo anime cel-shaded lighter wrap design. Vibrant Japanese anime art style, cherry blossom petals, dynamic action lines, manga ink outlines, pastel sakura pink and golden tones. Bold 'DAVAY' text in anime-style font. High quality product art, flat wrap layout.",
    streetart:
        "Gritty street art graffiti lighter wrap design. Raw spray paint drips, stencil graffiti textures, urban concrete wall texture, bold color blocking in orange, yellow and red. Street tag 'DAVAY' in graffiti letters. High quality product art, flat wrap layout.",
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const style = (formData.get("style") as string) ?? "cyberpunk";
        const imageFile = formData.get("image") as File | null;
        // Accept API key from request body (for client-side override) or fall back to server env
        const clientApiKey = (formData.get("apiKey") as string) ?? "";
        const apiKey = clientApiKey || process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "No OpenAI API key configured. Add it in .env.local or enter it in the studio." },
                { status: 400 }
            );
        }

        const openai = new OpenAI({ apiKey });
        const stylePrompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.cyberpunk;

        let imageUrl: string;

        if (imageFile && imageFile.size > 0) {
            // Use dall-e-2 image editing when a photo is uploaded
            const imageBytes = await imageFile.arrayBuffer();
            const imageBuffer = Buffer.from(imageBytes);
            // dall-e-2 edit requires a PNG file
            const oaiFile = await toFile(imageBuffer, "upload.png", { type: "image/png" });

            const prompt = `${stylePrompt} The central artwork is based on the provided portrait — stylize the subject in the described artistic style as the focal point of the lighter wrap design.`;

            const response = await openai.images.edit({
                model: "dall-e-2",
                image: oaiFile,
                prompt,
                n: 1,
                size: "1024x1024",
            });

            const imageData = response.data?.[0];
            if (!imageData) throw new Error("No image returned from API");
            imageUrl = imageData.url ?? "";
        } else {
            // Text-to-image with DALL-E 3 when no photo
            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: stylePrompt,
                size: "1024x1024",
                quality: "standard",
                n: 1,
            });

            imageUrl = response.data?.[0]?.url ?? "";
        }

        if (!imageUrl) throw new Error("Empty image URL from API");

        return NextResponse.json({ imageUrl });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[generate-lighter]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
