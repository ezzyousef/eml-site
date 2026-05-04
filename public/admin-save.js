// Regular Netlify Function (CommonJS) - process.env works here
// Reads App.jsx from GitHub, patches it, commits back

const GH_REPO  = "ezzyousef/eml-site";
const ADMIN_HASH = "da25c5b5903cfd4b93885fe8a67aed43e871cc8b5cad8eb95988e49cb16da8d9";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getFile(path, token) {
  const res = await fetch(`https://api.github.com/repos/${GH_REPO}/contents/${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
  });
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf8");
  return { content, sha: data.sha };
}

async function putFile(path, content, sha, message, token) {
  const encoded = Buffer.from(content, "utf8").toString("base64");
  const res = await fetch(`https://api.github.com/repos/${GH_REPO}/contents/${path}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: encoded, sha })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${err}`);
  }
  return true;
}

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { password, action, data } = body;

    // Verify password
    const hash = await sha256(password || "");
    if (hash !== ADMIN_HASH) {
      return { statusCode: 401, headers: cors, body: JSON.stringify({ error: "Wrong password" }) };
    }

    // Handle check_token without needing GH_TOKEN
    if (action === "check_token") {
      const ghToken = process.env.GH_TOKEN || "";
      return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true, tokenOk: !!ghToken }) };
    }

    // Get GitHub token from environment
    const ghToken = process.env.GH_TOKEN || "";
    if (!ghToken) {
      return { statusCode: 500, headers: cors, body: JSON.stringify({ error: "Server not configured — set GH_TOKEN in Netlify environment variables" }) };
    }

    // Read current App.jsx
    const { content: appContent, sha } = await getFile("src/App.jsx", ghToken);

    let newContent = appContent;
    let commitMsg = "";

    // ── ADD PATENT ────────────────────────────────────────────────────────
    if (action === "add_patent") {
      const { number, title, inventors, assignee, filed, status, url } = data;
      const newPatent = `  { number: "${number}", title: "${title}", inventors: "${inventors}", assignee: "${assignee || "The American University in Cairo"}", filed: "${filed}", status: "${status}", url: "${url || ""}" },\n`;
      const marker = "const DEFAULT_PATENTS = [\n";
      if (!appContent.includes(marker)) throw new Error("Patent marker not found in App.jsx");
      newContent = appContent.replace(marker, marker + newPatent);
      commitMsg = `Add patent: ${title.slice(0, 50)}`;
    }

    // ── ADD PAPER ─────────────────────────────────────────────────────────
    else if (action === "add_paper") {
      const { year, title, authors, venue, doi } = data;
      const authorsArr = authors.split(",").map(a => `{ name: "${a.trim()}" }`).join(", ");
      const newPaper = `  { year: ${year}, citationCount: 0, title: "${title}", authors: [${authorsArr}], venue: "${venue}", externalIds: ${doi ? `{ DOI: "${doi}" }` : "{}"} },\n`;
      const marker = "const papers2026 = [\n";
      if (!appContent.includes(marker)) throw new Error("Papers marker not found in App.jsx");
      newContent = appContent.replace(marker, marker + newPaper);
      commitMsg = `Add paper: ${title.slice(0, 50)}`;
    }

    // ── ADD MEMBER ────────────────────────────────────────────────────────
    else if (action === "add_member") {
      const { name, role, note, interests, email, scholar, group } = data;
      const colorPairs = [["#dde8f5","#1e4080"],["#fef3d7","#7a5000"],["#d4f0e4","#1a6a3a"],["#f5dde8","#7a1e48"],["#e8e0f5","#4a1e80"]];
      const [bg, color] = colorPairs[Math.floor(Math.random() * colorPairs.length)];
      const initials = name.replace(/^(Dr\.|Prof\.)\s+/,"").split(" ").filter(Boolean).map(w=>w[0]).join("").toUpperCase().slice(0,2);
      const interestsArr = interests.split(",").map(i=>`"${i.trim()}"`).join(",");
      const photoStr = data.photo ? `, photo: "${data.photo}"` : "";
      const newMember = `      { ...mk("${name}", "${role}", [${interestsArr}], 17)${photoStr}, email: "${email}", scholar: "${scholar || ""}", note: "${note}", bg: "${bg}", color: "${color}", initials: "${initials}" },\n`;
      
      const groupMarker = `label: "${group}",\n    members: [\n`;
      if (!appContent.includes(groupMarker)) throw new Error(`Group "${group}" not found`);
      newContent = appContent.replace(groupMarker, groupMarker + newMember);
      commitMsg = `Add member: ${name}`;
    }

    // ── EDIT TEXT ─────────────────────────────────────────────────────────
    else if (action === "edit_text") {
      const { oldText, newText } = data;
      if (!appContent.includes(oldText)) throw new Error(`Text not found in App.jsx: "${oldText.slice(0,50)}"`);
      newContent = appContent.replaceAll(oldText, newText);
      commitMsg = `Edit text: ${oldText.slice(0, 40)}…`;
    }

    else {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ error: "Unknown action" }) };
    }

    // Commit to GitHub
    await putFile("src/App.jsx", newContent, sha, commitMsg, ghToken);

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true, message: "Done! Netlify will rebuild in ~30 seconds." }) };

  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) };
  }
};
