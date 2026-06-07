// Run: node check-models.mjs
// Replace YOUR_KEY with your actual sk-... key

const key = "YOUR_KEY";

const res = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: "Bearer " + key },
});
const data = await res.json();

if (data.error) {
    console.error("❌ Auth error:", data.error.message);
} else {
    const imageModels = data.data
        .filter((m) => m.id.includes("dall") || m.id.includes("image") || m.id.includes("gpt-4o"))
        .map((m) => m.id)
        .sort();
    console.log("✅ Image-capable models available:");
    imageModels.forEach((id) => console.log(" -", id));
    if (imageModels.length === 0) {
        console.log("⚠️  No DALL-E or image models found — billing may not be set up.");
        console.log("→ Go to https://platform.openai.com/settings/organization/billing to add a payment method.");
    }
}
