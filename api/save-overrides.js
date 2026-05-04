// Vercel Serverless Function
// Uses GitHub Gist as persistent storage (free, works anywhere)
// GH_TOKEN env var must have gist scope

const ADMIN_HASH = "da25c5b5903cfd4b93885fe8a67aed43e871cc8b5cad8eb95988e49cb16da8d9";
const GIST_FILENAME = "eml-overrides.json";
// We'll auto-create the gist on first save and store its ID here
// The gist ID is stored as a second file in the same gist
let GIST_ID_CACHE = null;

async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,"0")).join("");
}

async function findOrCreateGist(token) {
  // Search existing gists for our file
  const res = await fetch("https://api.github.com/gists", {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const gists = await res.json();
  const found = gists.find(g => g.files && g.files[GIST_FILENAME]);
  if (found) return found.id;

  // Create new gist
  const create = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      description: "EML Site Data Store",
      public: false,
      files: { [GIST_FILENAME]: { content: "{}" } }
    })
  });
  if (!create.ok) throw new Error(`Failed to create gist: ${create.status}`);
  const g = await create.json();
  return g.id;
}

async function readGist(token) {
  const gistId = GIST_ID_CACHE || await findOrCreateGist(token);
  GIST_ID_CACHE = gistId;
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return {};
  const g = await res.json();
  try { return JSON.parse(g.files[GIST_FILENAME].content) || {}; }
  catch { return {}; }
}

async function writeGist(token, data) {
  const gistId = GIST_ID_CACHE || await findOrCreateGist(token);
  GIST_ID_CACHE = gistId;
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ files: { [GIST_FILENAME]: { content: JSON.stringify(data) } } })
  });
  if (!res.ok) throw new Error(`Gist write failed: ${res.status}`);
  return true;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  const token = process.env.GH_TOKEN;
  if (!token) return res.status(500).json({ error: "GH_TOKEN not configured" });

  if (req.method === "GET") {
    try {
      const data = await readGist(token);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(200).json({});
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      const { token: pw, ...data } = body;

      const hash = await sha256(pw || "");
      if (hash !== ADMIN_HASH) return res.status(401).json({ error: "Unauthorized" });

      // Merge with existing
      let existing = {};
      try { existing = await readGist(token); } catch {}
      const merged = { ...existing, ...data, savedAt: new Date().toISOString() };

      await writeGist(token, merged);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
