/**
 * Cloudflare Worker for AI Image Generation
 * Models available in free tier (up to 100k requests/day):
 * - @cf/stabilityai/stable-diffusion-xl-base-1.0
 * - @cf/bytedance/stable-diffusion-xl-lightning
 * 
 * Instructions:
 * 1. Deploy this code as a Cloudflare Worker
 * 2. Add Service Binding "AI" to Workers AI
 * 3. Set Environment Variable "API_KEY" to your secret key
 */

export default {
    async fetch(request, env) {
        // Handle CORS preflight requests
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
            });
        }

        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: { "Content-Type": "application/json" }
            });
        }

        const authHeader = request.headers.get("Authorization");
        if (!env.API_KEY || authHeader !== `Bearer ${env.API_KEY}`) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }

        try {
            const { prompt } = await request.json();
            const inputs = { prompt };

            // Using fast lightning model for generation
            const response = await env.AI.run(
                '@cf/bytedance/stable-diffusion-xl-lightning',
                inputs
            );

            return new Response(response, {
                headers: {
                    "Content-Type": "image/png",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }
    }
};
