import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS: Record<string, string> = {
    graffiti:
        "Use the uploaded image as the primary reference. Preserve the person's facial identity, hairstyle, facial proportions, expression, and skin tone with high accuracy. The final artwork must clearly resemble the uploaded person. Transform the portrait into a bold urban graffiti illustration inspired by modern street culture. Style: Premium street art, Graffiti spray paint, Yellow, orange, black and white color palette, Paint splashes, Dynamic brush strokes, Bold outlines, High contrast, Modern urban aesthetic, Collectible designer artwork. The subject should occupy approximately 70% of the composition and be centered vertically. The background must be completely transparent. Leave the lower 20% of the image clean for adding a QR code, serial number, and brand logo. No text. No watermark. No border. Ultra-high resolution. PNG with transparent background. Designed specifically for printing on a disposable lighter.",
    cyberpunk:
        "Use the uploaded image as the reference. Maintain the person's identity while transforming them into a premium cyberpunk anime character. Requirements: Preserve facial recognition, Cinematic anime illustration, Neon yellow and orange lighting, Electric glow effects, Clean cel shading, Sharp line art, Modern Japanese illustration style, Dynamic energy around the subject, Stylish clothing enhancement, Confident pose. The composition must be vertical and optimized for a lighter print. Background must be fully transparent. Reserve the bottom portion for a QR code and logo placement. No text. No watermark. Ultra-detailed. High-resolution transparent PNG suitable for professional printing.",
    luxury:
        "Use the uploaded image as the primary reference. Preserve the person's identity with maximum accuracy while transforming the portrait into a luxury collector's edition artwork. Style: Premium black and gold theme, Metallic gold accents, Luxury editorial lighting, Elegant geometric shapes, Rich shadows, Minimalistic premium composition, Soft smoke effects, High-end fashion aesthetic, Premium collectible product design. The portrait should dominate the composition while keeping enough empty space near the bottom for a QR code, product serial number, and brand logo. Background must be completely transparent. No text. No watermark. No frame. Ultra-realistic digital artwork. 8K quality. Print-ready transparent PNG optimized for lighter manufacturing.",
};

const APIMART_API_KEY = process.env.APIMART_API_KEY;
const APIMART_BASE_URL = process.env.APIMART_BASE_URL;

async function pollTaskResult(taskId: string, maxAttempts = 20): Promise<string> {
    // Wait 15 seconds before first poll as recommended by the API docs
    await new Promise((resolve) => setTimeout(resolve, 15000));

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const res = await fetch(`${APIMART_BASE_URL}/tasks/${taskId}`, {
            headers: {
                Authorization: `Bearer ${APIMART_API_KEY}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Task poll failed (${res.status}): ${await res.text()}`);
        }

        const data = await res.json();
        const status = data?.data?.status;

        if (status === "completed") {
            const imageUrl = data?.data?.result?.images?.[0]?.url?.[0];
            if (!imageUrl) throw new Error("Task completed but no image URL found");
            return imageUrl;
        }

        if (status === "failed") {
            throw new Error(`Image generation failed: ${data?.data?.error?.message ?? "Unknown error"}`);
        }

        // Still processing — wait 4 seconds before next poll
        await new Promise((resolve) => setTimeout(resolve, 4000));
    }

    throw new Error("Image generation timed out after maximum polling attempts");
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const style = (formData.get("style") as string) ?? "graffiti";
        const imageFile = formData.get("image") as File | null;

        let prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.graffiti;

        const hasPhoto = imageFile && imageFile.size > 0;

        if (!hasPhoto) {
            prompt = prompt.replace(
                /Use the uploaded image as the (primary )?reference\.\s*/i,
                "Create a striking, highly detailed original portrait of an urban youth. "
            );
        }

        // Build request payload
        const requestPayload: Record<string, unknown> = {
            model: "gpt-image-2",
            prompt,
            n: 1,
            size: "9:16",   // Portrait orientation — ideal for lighter printing
            resolution: "2k",
        };

        // Add reference image if provided
        if (hasPhoto) {
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            const base64Image = imageBuffer.toString("base64");
            const mimeType = imageFile.type || "image/jpeg";
            requestPayload.image_urls = [`data:${mimeType};base64,${base64Image}`];
        }

        // Submit generation task
        const submitRes = await fetch(`${APIMART_BASE_URL}/images/generations`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${APIMART_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestPayload),
        });

        if (!submitRes.ok) {
            const errText = await submitRes.text();
            let parsedErr = errText;
            try {
                const json = JSON.parse(errText);
                parsedErr = json.error?.message || errText;
            } catch {
                // raw text fallback
            }
            throw new Error(`apimart.ai submission error (${submitRes.status}): ${parsedErr}`);
        }

        const submitData = await submitRes.json();
        const taskId = submitData?.data?.[0]?.task_id;

        if (!taskId) {
            throw new Error("No task_id returned from image generation API");
        }

        // Poll until the image is ready
        const hostedImageUrl = await pollTaskResult(taskId);

        // Fetch the image and convert to base64 so the client receives it directly
        const imageRes = await fetch(hostedImageUrl);
        if (!imageRes.ok) {
            throw new Error(`Failed to download generated image (${imageRes.status})`);
        }

        const imageArrayBuffer = await imageRes.arrayBuffer();
        const base64Image = Buffer.from(imageArrayBuffer).toString("base64");
        const imageUrl = `data:image/png;base64,${base64Image}`;

        return NextResponse.json({ imageUrl });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[generate-lighter]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}