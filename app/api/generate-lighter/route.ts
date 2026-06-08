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

const AIML_API_KEY = process.env.AIML_API_KEY;
const AIML_URL = "https://api.aimlapi.com/v1/images/generations";

// Ensure this route runs in a Node.js runtime (Buffer usage and long polls require Node features)
export const runtime = "nodejs";

if (!AIML_API_KEY) {
    console.error("generate-lighter: missing AIML_API_KEY environment variable");
}

// Using AIML API endpoint directly — no background task polling required.

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const style = (formData.get("style") as string) ?? "graffiti";
        const imageFile = formData.get("image") as File | null;

        if (!AIML_API_KEY) {
            return NextResponse.json({ error: "Server misconfiguration: missing AIML_API_KEY" }, { status: 500 });
        }

        let prompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.graffiti;

        const hasPhoto = imageFile && imageFile.size > 0;

        if (!hasPhoto) {
            prompt = prompt.replace(
                /Use the uploaded image as the (primary )?reference\.\s*/i,
                "Create a striking, highly detailed original portrait of an urban youth. "
            );
        }

        // Build request payload for AIML API
        const requestPayload: Record<string, unknown> = {
            model: "openai/gpt-image-2",
            prompt,
            n: 1,
            size: "9:16",
            resolution: "2k",
        };

        if (hasPhoto) {
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            const base64Image = imageBuffer.toString("base64");
            const mimeType = imageFile.type || "image/jpeg";
            // Many image-generation endpoints accept data URLs in an `image_urls` or `image` field; include both
            // to increase compatibility.
            (requestPayload as any).image_urls = [`data:${mimeType};base64,${base64Image}`];
            (requestPayload as any).image = `data:${mimeType};base64,${base64Image}`;
        }

        async function submitToAIML(payload: Record<string, unknown>) {
            const res = await fetch(AIML_URL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${AIML_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            const text = await res.text();
            let json: any = null;
            try {
                json = JSON.parse(text);
            } catch {
                json = text;
            }
            return { res, json, text };
        }

        // First attempt with the richer payload
        let { res: submitRes, json: submitData, text: submitText } = await submitToAIML(requestPayload as any);

        // If the API rejected the payload as invalid, try a minimal payload (some providers are picky)
        if (!submitRes.ok && submitRes.status === 400 && typeof submitText === "string" && /invalid payload/i.test(submitText)) {
            console.warn("[generate-lighter] AIML returned 400 Invalid payload — retrying with minimal payload");
            const minimalPayload: Record<string, unknown> = { model: (requestPayload as any).model, prompt };
            if (hasPhoto) minimalPayload.image = (requestPayload as any).image;
            const retry = await submitToAIML(minimalPayload);
            submitRes = retry.res;
            submitData = retry.json;
            submitText = retry.text;
        }

        if (!submitRes.ok) {
            let parsedErr = submitText;
            try {
                parsedErr = submitData?.error?.message || submitData?.message || submitText;
            } catch {
                // fallback
            }

            // Payment required / out of funds — return actionable message and optional dev fallback
            if (submitRes.status === 403) {
                const billingUrl = "https://aimlapi.com/app/billing/";
                console.error("[generate-lighter] AIML out of funds:", parsedErr);

                // Optional developer fallback: return a simple SVG placeholder image so local dev can continue
                if (process.env.USE_PLACEHOLDER_IMAGE === "1") {
                    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1400'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='%23999'>Placeholder image\n(API out of funds)</text></svg>`;
                    const b64 = Buffer.from(svg).toString("base64");
                    return NextResponse.json({ imageUrl: `data:image/svg+xml;base64,${b64}`, note: "placeholder" });
                }

                return NextResponse.json({ error: parsedErr, billing_url: billingUrl }, { status: 402 });
            }

            if (submitRes.status === 402) {
                console.error("[generate-lighter] AIML insufficient balance:", parsedErr);
                return NextResponse.json({ error: `AIML insufficient balance: ${parsedErr}` }, { status: 402 });
            }

            console.error("[generate-lighter] AIML submission failed:", submitRes.status, parsedErr);
            throw new Error(`AIML submission error (${submitRes.status}): ${parsedErr}`);
        }

        // Try to extract common image outputs (url or base64)
        let imageUrl: string | null = null;
        const first = submitData?.data?.[0] ?? submitData?.output?.[0] ?? null;

        if (first) {
            if (first.url) imageUrl = Array.isArray(first.url) ? first.url[0] : first.url;
            else if (first.b64_json) imageUrl = `data:image/png;base64,${first.b64_json}`;
            else if (first.content) imageUrl = first.content;
        }

        // Fallbacks for other shapes
        if (!imageUrl && Array.isArray(submitData?.data)) {
            const candidate = submitData.data.find((d: any) => d?.url || d?.b64_json);
            if (candidate?.url) imageUrl = Array.isArray(candidate.url) ? candidate.url[0] : candidate.url;
            else if (candidate?.b64_json) imageUrl = `data:image/png;base64,${candidate.b64_json}`;
        }

        // If we found a remote URL, fetch and return base64 data URL to the client (so client doesn't need CORS)
        if (imageUrl && /^https?:\/\//i.test(imageUrl)) {
            const imageRes = await fetch(imageUrl as string);
            if (!imageRes.ok) throw new Error(`Failed to download generated image (${imageRes.status})`);
            const imageArrayBuffer = await imageRes.arrayBuffer();
            const base64Image = Buffer.from(imageArrayBuffer).toString("base64");
            imageUrl = `data:image/png;base64,${base64Image}`;
        }

        // If nothing usable found, return the raw API response for debugging
        if (!imageUrl) {
            return NextResponse.json({ result: submitData });
        }

        return NextResponse.json({ imageUrl });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[generate-lighter]", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}