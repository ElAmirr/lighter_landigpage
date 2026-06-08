import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS: Record<string, string> = {
    graffiti:
        "Use the uploaded image as the primary reference. Preserve the person's facial identity, hairstyle, facial proportions, expression, and skin tone with high accuracy. The final artwork must clearly resemble the uploaded person. Transform the portrait into a bold urban graffiti illustration inspired by modern street culture. Style: Premium street art, Graffiti spray paint, Yellow, orange, black and white color palette, Paint splashes, Dynamic brush strokes, Bold outlines, High contrast, Modern urban aesthetic, Collectible designer artwork. The subject should occupy approximately 70% of the composition and be centered vertically. The background must be completely transparent. Leave the lower 20% of the image clean for adding a QR code, serial number, and brand logo. No text. No watermark. No border. Ultra-high resolution. PNG with transparent background. Designed specifically for printing on a disposable lighter.",
    cyberpunk:
        "Use the uploaded image as the reference. Maintain the person's identity while transforming them into a premium cyberpunk anime character. Requirements: Preserve facial recognition, Cinematic anime illustration, Neon yellow and orange lighting, Electric glow effects, Clean cel shading, Sharp line art, Modern Japanese illustration style, Dynamic energy around the subject, Stylish clothing enhancement, Confident pose. The composition must be vertical and optimized for a lighter print. Background must be fully transparent. Reserve the bottom portion for a QR code and logo placement. No text. No watermark. Ultra-detailed. High-resolution transparent PNG suitable for professional printing.",
    luxury:
        "Use the uploaded image as the primary reference. Preserve the person's identity with maximum accuracy while transforming the portrait into a luxury collector's edition artwork. Style: Premium black and gold theme, Metallic gold accents, Luxury editorial lighting, Elegant geometric shapes, Rich shadows, Minimalistic premium composition, Soft smoke effects, High-end fashion aesthetic, Premium collectible product design. The portrait should dominate the composition while keeping enough empty space near the bottom for a QR code, product serial number, and brand logo. Background must be completely transparent. No text. No watermark. No frame. Ultra-realistic digital artwork. 8K quality. Print-ready transparent PNG optimized for lighter manufacturing.",
};

// Extra style keys used by the frontend studio — keep these in sync with the client
STYLE_PROMPTS["urban-editorial"] = `
Use the uploaded image as the primary reference.

Preserve the person's identity, facial structure, hairstyle, skin tone and expression while transforming them into an editorial fashion artwork.

Create an ultra realistic urban street fashion collage featuring the uploaded person as the main model.

Style:
- Urban street fashion collage
- Young fashion model
- Graffiti textures
- Ripped posters
- Bold typography layers
- Vibrant colors
- Harsh dramatic lighting
- Editorial magazine cover style
- Dynamic composition
- High contrast shadows
- Gritty aesthetic
- Premium fashion photography
- Modern youth culture
- Designer campaign quality
- Contemporary luxury streetwear
- Hyper realistic details

The portrait should dominate the composition while remaining perfectly recognizable.

Vertical composition optimized for a lighter.

Transparent background.

Leave the bottom 20% clean for QR code and logo placement.

No watermark.

No text.

Ultra realistic.

8K quality.

PNG with transparent background.
`;

STYLE_PROMPTS["punk-zine"] = `
Use the uploaded image as the main subject.

Preserve the person's identity and facial recognition while integrating them into a handmade punk editorial collage.

Create a punk editorial collage poster in a handmade torn-paper zine style.

The uploaded portrait must become the central visual element.

Surround the portrait with:

- Vintage magazine cutouts
- Torn paper collage
- Handmade ransom-note typography
- Screen-print textures
- DIY protest poster aesthetics
- Underground magazine layout
- Dada-inspired cut-paper composition
- Editorial collage blocks
- Distressed paper textures
- Visible paper fibers
- Worn vintage print
- Print grain
- Rough edges
- Imperfect alignment
- Misprinted ink

Use bold color blocks:

- Burnt orange
- Muted red
- Teal blue
- Mustard yellow
- Black
- Cream

Include surrounding collage elements:

- Butterfly
- Black bird
- Eye
- Lightning bolts
- Tornado icon
- Barren tree
- Cracked dry earth
- Pollution imagery
- Garbage textures
- Light bulb
- Checkerboard patterns
- Abstract anarchic symbols

Mood:

- Rebellion
- Youth unrest
- Dream vs reality
- Social criticism
- Environmental anxiety
- Mental chaos
- Raw expressive energy

The uploaded person must remain the hero of the composition.

Vertical 4:5 composition suitable for lighter printing.

Transparent background.

Leave the lower section empty for QR code placement.

No watermark.

No readable text.

Ultra detailed.

Print-ready PNG.
`;

STYLE_PROMPTS["flash-nightlife"] = `
Use the uploaded image as the primary reference.

Preserve the person's identity with high facial accuracy.

Transform the portrait into a premium nightlife editorial photograph.

Scene:

- Crowded nightclub
- Colorful club lighting
- Strong direct camera flash overpowering ambient lighting
- Sweaty glowing skin
- Flash photography effect
- High ISO grain
- Candid chaotic energy
- Vibrant nightlife atmosphere
- Motion blur in background
- Cinematic nightlife photography
- Party aesthetic
- Editorial magazine quality
- Authentic flash photography
- Stylish youth fashion
- Modern club culture

The uploaded person should remain perfectly recognizable and be the main focus.

The background should feel alive while keeping the subject isolated.

Vertical composition optimized for lighter printing.

Transparent background.

Leave the bottom area clean for QR code and logo.

No text.

No watermark.

Ultra realistic.

8K quality.

PNG with transparent background.
`;

const APIMART_API_KEY = process.env.APIMART_API_KEY;
const APIMART_BASE_URL = process.env.APIMART_BASE_URL;

// Ensure this route runs in a Node.js runtime (Buffer usage and long polls require Node features)
export const runtime = "nodejs";

if (!APIMART_API_KEY || !APIMART_BASE_URL) {
    console.error("generate-lighter: missing APIMART_API_KEY or APIMART_BASE_URL environment variables");
}

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

        if (!APIMART_API_KEY || !APIMART_BASE_URL) {
            return NextResponse.json(
                { error: "Server misconfiguration: missing APIMART_API_KEY or APIMART_BASE_URL" },
                { status: 500 }
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