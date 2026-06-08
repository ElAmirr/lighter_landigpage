import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS: Record<string, string> = {
    graffiti:
        "Use the uploaded image as the primary reference. Preserve the person's facial identity, hairstyle, facial proportions, expression, and skin tone with high accuracy. The final artwork must clearly resemble the uploaded person. Transform the portrait into a bold urban graffiti illustration inspired by modern street culture. Style: Premium street art, Graffiti spray paint, Yellow, orange, black and white color palette, Paint splashes, Dynamic brush strokes, Bold outlines, High contrast, Modern urban aesthetic, Collectible designer artwork. The subject should occupy approximately 70% of the composition and be centered vertically. The background must be completely transparent. Leave the lower 20% of the image clean for adding a QR code, serial number, and brand logo. No text. No watermark. No border. Ultra-high resolution. PNG with transparent background. Designed specifically for printing on a disposable lighter.",
    cyberpunk:
        "Use the uploaded image as the reference. Maintain the person's identity while transforming them into a premium cyberpunk anime character. Requirements: Preserve facial recognition, Cinematic anime illustration, Neon yellow and orange lighting, Electric glow effects, Clean cel shading, Sharp line art, Modern Japanese illustration style, Dynamic energy around the subject, Stylish clothing enhancement, Confident pose. The composition must be vertical and optimized for a lighter print. Background must be fully transparent. Reserve the bottom portion for a QR code and logo placement. No text. No watermark. Ultra-detailed. High-resolution transparent PNG suitable for professional printing.",
    luxury:
        "Use the uploaded image as the primary reference. Preserve the person's identity with maximum accuracy while transforming the portrait into a luxury collector's edition artwork. Style: Premium black and gold theme, Metallic gold accents, Luxury editorial lighting, Elegant geometric shapes, Rich shadows, Minimalistic premium composition, Soft smoke effects, High-end fashion aesthetic, Premium collectible product design. The portrait should dominate the composition while keeping enough empty space near the bottom for a QR code, product serial number, and brand logo. Background must be completely transparent. No text. No watermark. No frame. Ultra-realistic digital artwork. 8K quality. Print-ready transparent PNG optimized for lighter manufacturing.",
};

const STYLE_STRENGTHS: Record<string, number> = {
    graffiti: 0.65,
    cyberpunk: 0.60,
    luxury: 0.35,
};

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const style = (formData.get("style") as string) ?? "graffiti";
        const imageFile = formData.get("image") as File | null;

        const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
        const apiToken = process.env.CLOUDFLARE_API_TOKEN;

        if (!accountId || !apiToken) {
            return NextResponse.json(
                { error: "Cloudflare credentials missing. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN" },
                { status: 400 }
            );
        }

        let prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.graffiti;

        const hasPhoto = imageFile && imageFile.size > 0;
        if (!hasPhoto) {
            prompt = prompt.replace(
                /Use the uploaded image as the (primary )?reference\.\s*/i,
                "Create a striking, highly detailed original portrait of an urban youth. "
            );
        }

        let modelId = "@cf/bytedance/stable-diffusion-xl-lightning";
        const requestPayload: Record<string, unknown> = { prompt };

        if (hasPhoto) {
            modelId = "@cf/runwayml/stable-diffusion-v1-5-img2img";
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            requestPayload.image_b64 = imageBuffer.toString("base64");
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
            } catch {
                // raw text
            }
            throw new Error(`Cloudflare API Error (${res.status}): ${parsedErr}`);
        }

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
