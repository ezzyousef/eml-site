const SITE_ID = "a6418ab5-a865-4500-b559-2fd09b465cf5";
const NETLIFY_TOKEN = "nfp_v5A8syPCMZ5pPPVMJYM5wVyzMCTGsmANf7a0";
const STORE_NAME = "eml-data";
const BLOB_KEY = "overrides";

const ADMIN_HASH = "da25c5b5903cfd4b93885fe8a67aed43e871cc8b5cad8eb95988e49cb16da8d9";

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  // Use Netlify Blobs REST API
  // Docs: https://docs.netlify.com/blobs/overview/
  const url = `https://api.netlify.com/api/v1/blobs/${SITE_ID}/${STORE_NAME}/${BLOB_KEY}`;

  if (req.method === "GET") {
    try {
      const r = await fetch(url, {
        headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` }
      });
      const text = await r.text();
      return new Response(r.ok ? text : "{}", { status: 200, headers: cors });
    } catch {
      return new Response("{}", { status: 200, headers: cors });
    }
  }

  if (req.method === "POST") {
    try {
      const body = await req.json();
      const { token, ...data } = body;

      // Verify admin password
      const hash = await sha256(token || "");
      if (hash !== ADMIN_HASH) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
      }

      // Write to Netlify Blobs
      const r = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${NETLIFY_TOKEN}`,
          "Content-Type": "application/octet-stream",
        },
        body: JSON.stringify({ ...data, savedAt: new Date().toISOString() }),
      });

      if (r.ok) {
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
      }
      const errText = await r.text();
      return new Response(JSON.stringify({ error: `Blob API: ${r.status} ${errText}` }), { status: 500, headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: cors });
};

export const config = { path: "/api/save-overrides" };
