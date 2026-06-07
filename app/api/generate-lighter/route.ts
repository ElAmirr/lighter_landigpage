import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS: Record<string, string> = {
    streetart:
        "Use the uploaded portrait as the primary subject. Preserve the person's facial identity, hairstyle, facial expression, and overall appearance with high accuracy. Transform the portrait into a bold urban street-art illustration inspired by modern graffiti culture. Style requirements: High contrast, Vibrant yellow, orange, black and white palette, Spray paint textures, Graffiti lettering, Paint splashes, Urban wall textures, Dynamic lighting, Bold outlines, Modern streetwear aesthetic, Premium collectible design. The background must be transparent. The composition must be vertical and centered to perfectly fit a standard disposable lighter. Leave a clean empty area near the bottom for adding a QR code and logo later. Do not crop the face. Do not distort facial features. The final artwork must feel like a premium collectible designer lighter rather than a simple portrait. Ultra-high detail. Print-ready. Transparent PNG.",
    anime:
        "Use the uploaded portrait as the reference. Maintain the person's identity while transforming them into a stylish anime-inspired character. Requirements: Modern anime illustration, Cinematic lighting, Neon yellow and orange glow, Black background elements, Dynamic energy effects, Clean line art, Soft gradients, Premium digital painting, Confident facial expression, Slightly exaggerated but recognizable features, Vibrant eyes, Stylish clothing enhancement. The design should look like a limited-edition collectible lighter. The artwork must be centered vertically with generous spacing. Background must be fully transparent. Leave empty space near the bottom for future QR code placement. No text. No watermark. No border. Ultra-high resolution. Print-ready PNG.",
    luxurygold:
        "Use the uploaded portrait while preserving the person's identity. Create a luxury collectible portrait suitable for printing on a premium lighter. Style: Black and gold, Elegant metallic reflections, Premium illustration, Luxury fashion editorial aesthetic, Gold geometric shapes, Minimalistic composition, Subtle smoke effects, Dramatic studio lighting, High-end product branding style, Rich shadows, Premium texture. The portrait should occupy approximately 70% of the lighter's printable area. The background must remain transparent. Reserve a clean area near the bottom for a QR code and brand logo. No text. No watermark. No frame. Ultra-realistic digital illustration. Premium collector edition. High-resolution transparent PNG optimized for physical printing.",
};

const STYLE_STRENGTHS: Record<string, number> = {
    streetart: 0.65, // Higher change to make it look like graffiti
    anime: 0.60, // Moderate change to look like anime
    luxurygold: 0.35, // Low change: keeps it mostly original, just adds gold lighting/effects
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const style = (formData.get("style") as string) ?? "streetart";
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

        let prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.streetart;

        // If the user didn't upload a photo, adjust the prompt slightly to avoid confusing the AI
        const hasPhoto = imageFile && imageFile.size > 0;
        if (!hasPhoto) {
            prompt = prompt.replace(
                /Use the uploaded portrait.*?identity(\.| )/ig,
                "Create a striking, highly detailed original portrait of an urban youth. "
            );
        }

        let modelId = "@cf/bytedance/stable-diffusion-xl-lightning";
        const requestPayload: Record<string, any> = { prompt };

        if (hasPhoto) {
            // Route to the true image-to-image model
            modelId = "@cf/runwayml/stable-diffusion-v1-5-img2img";
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            requestPayload.image_b64 = imageBuffer.toString("base64");
            // Add guidance strength to preserve image features (values range 0-1)
            requestPayload.strength = STYLE_STRENGTHS[style] || 0.6;
        }

        const restApiUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelId}`;

        const res = await fetch(restApiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestPayload),
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
