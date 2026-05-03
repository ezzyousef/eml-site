import { getStore } from "@netlify/blobs";

const ADMIN_PASSWORD_HASH = "da25c5b5903cfd4b93885fe8a67aed43e871cc8b5cad8eb95988e49cb16da8d9";

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default async (request, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const store = getStore("eml-overrides");

  // ── GET: Load saved overrides ─────────────────────────────────────────
  if (request.method === "GET") {
    try {
      const data = await store.get("overrides", { type: "json" });
      return new Response(JSON.stringify(data || {}), { status: 200, headers });
    } catch {
      return new Response(JSON.stringify({}), { status: 200, headers });
    }
  }

  // ── POST: Save overrides ──────────────────────────────────────────────
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const { token, ...data } = body;

      // Verify admin token
      const hash = await sha256(token || "");
      if (hash !== ADMIN_PASSWORD_HASH) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
      }

      // Save to Netlify Blobs
      await store.setJSON("overrides", {
        ...data,
        savedAt: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
};

export const config = { path: "/api/save-overrides" };
