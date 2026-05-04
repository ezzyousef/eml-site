import React, { useState, useEffect, useRef } from "react";
const { createContext, useContext } = React;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body { font-family: 'Outfit', sans-serif; background: #f4f6fa; color: #0d1b2a; }

.serif { font-family: 'Libre Baskerville', Georgia, serif; }
.mono  { font-family: 'Space Mono', monospace; }

/* NAV */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 64px;
  background: rgba(10, 22, 46, 0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.nav-brand { display: flex; align-items: center; gap: 14px; }
.nav-brand img { height: 38px; }
.nav-links { display: flex; gap: 32px; }
.nav-link {
  color: rgba(255,255,255,0.65); font-size: 13px; font-weight: 500;
  letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover { color: #f0b429; }

/* HERO */
.hero {
  min-height: 100vh;
  background: linear-gradient(160deg, #0a162e 0%, #0e2040 55%, #112a50 100%);
  display: flex; flex-direction: column; justify-content: center;
  padding: 120px 80px 80px;
  position: relative; overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 80% 30%, rgba(240,180,41,0.06) 0%, transparent 60%),
              radial-gradient(ellipse at 10% 80%, rgba(100,160,255,0.05) 0%, transparent 50%);
}
.hero-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 80px; align-items: center; max-width: 1200px; margin: 0 auto;
  position: relative; z-index: 1;
}
.hero-eyebrow {
  font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #f0b429; font-family: 'Space Mono', monospace;
  margin-bottom: 20px;
  display: flex; align-items: center; gap: 12px;
}
.hero-eyebrow::before { content: ''; width: 32px; height: 1px; background: #f0b429; }
.hero-title {
  font-family: 'Libre Baskerville', serif; font-size: 58px; font-weight: 700;
  line-height: 1.1; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 24px;
}
.hero-title span { color: #f0b429; }
.hero-subtitle {
  font-size: 17px; line-height: 1.75; color: rgba(255,255,255,0.62);
  font-weight: 300; max-width: 480px; margin-bottom: 40px;
}
.hero-btns { display: flex; gap: 14px; flex-wrap: wrap; }
.btn-primary {
  padding: 12px 28px; background: #f0b429; color: #0a162e;
  font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  text-decoration: none; border: none; cursor: pointer;
  transition: all 0.2s;
}
.btn-primary:hover { background: #ffc947; transform: translateY(-1px); }
.btn-outline {
  padding: 12px 28px; background: transparent;
  border: 1px solid rgba(255,255,255,0.25); color: rgba(255,255,255,0.75);
  font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
  text-decoration: none; cursor: pointer; transition: all 0.2s;
}
.btn-outline:hover { border-color: #f0b429; color: #f0b429; }

/* STATS STRIP */
.stats-strip {
  background: #0a162e; border-top: 1px solid rgba(240,180,41,0.2);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 32px 80px;
  display: grid; grid-template-columns: repeat(4, 1fr);
  max-width: 100%;
}
.stat-item { text-align: center; padding: 0 20px; }
.stat-item + .stat-item { border-left: 1px solid rgba(255,255,255,0.08); }
.stat-num {
  font-family: 'Libre Baskerville', serif;
  font-size: 40px; font-weight: 700; color: #f0b429; line-height: 1;
  margin-bottom: 6px;
}
.stat-label {
  font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
  color: rgba(255,255,255,0.45); font-family: 'Space Mono', monospace;
}

/* SECTION */
.section { padding: 96px 80px; max-width: 1200px; margin: 0 auto; }
.section-alt { background: #edf0f7; }
.section-alt > .section-inner { max-width: 1200px; margin: 0 auto; padding: 96px 80px; }

.section-label {
  font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: #1e4080; font-family: 'Space Mono', monospace; font-weight: 700;
  margin-bottom: 12px;
  display: flex; align-items: center; gap: 12px;
}
.section-label::after { content: ''; flex: 0 0 40px; height: 2px; background: #f0b429; }
.section-title {
  font-family: 'Libre Baskerville', serif; font-size: 38px; font-weight: 700;
  color: #0a162e; line-height: 1.2; margin-bottom: 48px;
}

/* ABOUT */
.about-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 64px; align-items: start; }
.about-text p { font-size: 16px; line-height: 1.85; color: #2c3e55; margin-bottom: 20px; font-weight: 300; }
.research-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.rtag {
  padding: 5px 14px; border: 1.5px solid #1e4080; color: #1e4080;
  font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
  font-family: 'Space Mono', monospace; cursor: default;
  transition: all 0.15s;
}
.rtag:hover { background: #1e4080; color: white; }

/* EQUIPMENT */
.equip-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.equip-card {
  padding: 18px 20px; background: white;
  border: 1px solid #d0d8e8; border-left: 3px solid #1e4080;
  transition: all 0.2s;
}
.equip-card:hover { border-left-color: #f0b429; transform: translateX(3px); }
.equip-name { font-size: 14px; font-weight: 600; color: #0a162e; margin-bottom: 4px; }
.equip-loc { font-size: 11px; color: #7a8ba0; font-family: 'Space Mono', monospace; }
.equip-status {
  display: inline-block; font-size: 10px; padding: 2px 8px;
  border-radius: 20px; font-weight: 600; letter-spacing: 0.06em; margin-top: 6px;
}
.status-available { background: #d4f4e2; color: #1a7a45; }
.status-under { background: #fde8d0; color: #a04010; }

/* PUBLICATIONS */
.pub-list { display: flex; flex-direction: column; gap: 0; }
.pub-card {
  padding: 24px 28px; background: white;
  border: 1px solid #d0d8e8; border-top: none;
  transition: all 0.2s; cursor: default;
}
.pub-card:first-child { border-top: 1px solid #d0d8e8; }
.pub-card:hover { background: #f0f4ff; border-left: 3px solid #1e4080; padding-left: 25px; }
.pub-year {
  font-size: 10px; font-family: 'Space Mono', monospace; color: #f0b429;
  font-weight: 700; letter-spacing: 0.1em; margin-bottom: 8px;
}
.pub-title { font-family: 'Libre Baskerville', serif; font-size: 16px; color: #0a162e; line-height: 1.45; margin-bottom: 8px; }
.pub-authors { font-size: 13px; color: #4a6080; margin-bottom: 10px; }
.pub-pi { font-weight: 700; color: #1e4080; }
.pub-venue { font-size: 12px; color: #8a9ab0; font-style: italic; margin-right: 12px; }
.pub-tags { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
.pub-tag {
  font-size: 10px; padding: 2px 10px; border: 1px solid #b0bdd0;
  color: #4a6080; font-family: 'Space Mono', monospace; cursor: pointer;
  transition: all 0.15s;
}
.pub-tag:hover { background: #1e4080; color: white; border-color: #1e4080; }

/* TEAM */
.team-pi { 
  display: grid; grid-template-columns: auto 1fr; gap: 32px;
  align-items: center; padding: 32px 36px; background: #0a162e;
  margin-bottom: 32px;
}
.pi-avatar {
  width: 100px; height: 100px; border-radius: 50%;
  background: linear-gradient(135deg, #1e4080, #2a5fba);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Libre Baskerville', serif; font-size: 32px; color: white; font-weight: 700;
  border: 3px solid #f0b429; flex-shrink: 0;
}
.pi-name { font-family: 'Libre Baskerville', serif; font-size: 26px; color: white; margin-bottom: 4px; }
.pi-title { font-size: 13px; color: #f0b429; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'Space Mono', monospace; margin-bottom: 12px; }
.pi-bio { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; max-width: 600px; }
.pi-links { display: flex; gap: 12px; margin-top: 16px; }
.pi-link {
  font-size: 11px; padding: 5px 14px; border: 1px solid rgba(240,180,41,0.4);
  color: #f0b429; text-decoration: none; font-family: 'Space Mono', monospace;
  transition: all 0.15s;
}
.pi-link:hover { background: #f0b429; color: #0a162e; }

.team-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.team-section-header {
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #1e4080; font-family: 'Space Mono', monospace; font-weight: 700;
  margin: 36px 0 16px; padding-bottom: 8px; border-bottom: 1px solid #d0d8e8;
}
.member-card {
  background: white; border: 1px solid #d0d8e8;
  display: grid; grid-template-columns: 160px 1fr;
  height: 200px; overflow: hidden;
  transition: all 0.2s;
}
.member-card:hover { border-color: #1e4080; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(30,64,128,0.12); }
.member-photo-half {
  width: 160px; height: 200px;
  object-fit: cover; object-position: center top;
  display: block; flex-shrink: 0;
}
.member-photo-fallback {
  width: 160px; height: 200px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Libre Baskerville', serif; font-size: 40px; font-weight: 700;
}
.member-text-half {
  padding: 14px 16px;
  display: flex; flex-direction: column; justify-content: center;
  border-left: 3px solid #f0b429;
  overflow: hidden;
  height: 200px; box-sizing: border-box;
}
.member-name { font-size: 13px; font-weight: 600; color: #0a162e; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.member-role { font-size: 9px; color: #f0b429; font-family: 'Space Mono', monospace; letter-spacing: 0.05em; margin-bottom: 6px; text-transform: uppercase; }
.member-interests { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 6px; }
.mint { font-size: 9px; color: #4a6080; background: #edf0f7; padding: 2px 6px; white-space: nowrap; }

/* ── EDIT MODE ─────────────────────────────────── */
.edit-toolbar {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  display: flex; gap: 8px; align-items: center;
  background: #0a162e; border: 1px solid #f0b429;
  padding: 10px 16px; border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.edit-btn {
  font-size: 11px; font-family: 'Space Mono', monospace;
  padding: 6px 14px; border: 1px solid;
  cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase;
  transition: all 0.15s; background: transparent;
}
.edit-btn-on  { border-color: #f0b429; color: #f0b429; }
.edit-btn-on:hover  { background: #f0b429; color: #0a162e; }
.edit-btn-off { border-color: #5a9e75; color: #5a9e75; }
.edit-btn-off:hover { background: #5a9e75; color: white; }
.edit-btn-dl  { border-color: #4a8adf; color: #4a8adf; }
.edit-btn-dl:hover  { background: #4a8adf; color: white; }
.edit-mode-banner {
  position: fixed; top: 64px; left: 0; right: 0; z-index: 9998;
  background: #f0b429; color: #0a162e; text-align: center; padding: 5px;
  font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.1em; font-weight: 700;
}
[contenteditable="true"] {
  outline: 2px dashed rgba(240,180,41,0.7) !important;
  outline-offset: 3px; cursor: text !important; border-radius: 2px;
}
[contenteditable="true"]:focus {
  outline: 2px solid #f0b429 !important;
  background: rgba(240,180,41,0.06);
}
.edit-login {
  position: fixed; inset: 0; z-index: 10000;
  background: rgba(10,22,46,0.97);
  display: flex; align-items: center; justify-content: center;
}
.edit-login-box {
  background: #0d1d38; border: 1px solid #f0b429;
  padding: 40px 48px; width: 320px; text-align: center; border-radius: 4px;
}

@media (max-width: 900px) {
  .team-grid { grid-template-columns: 1fr; }
  .member-card { grid-template-columns: 120px 1fr; height: 160px; }
  .member-photo-half { width: 120px; height: 160px; }
  .member-photo-fallback { width: 120px; height: 160px; font-size: 32px; }
  .member-text-half { height: 160px; padding: 10px 12px; }
}

/* FOOTER */
.footer { background: #060f1e; color: rgba(255,255,255,0.5); padding: 64px 80px 32px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; max-width: 1200px; margin-left: auto; margin-right: auto; }
.footer-brand img { height: 42px; margin-bottom: 16px; }
.footer-tagline { font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.4); max-width: 240px; }
.footer-heading { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #f0b429; font-family: 'Space Mono', monospace; margin-bottom: 16px; }
.footer-link { display: block; font-size: 13px; color: rgba(255,255,255,0.45); text-decoration: none; margin-bottom: 10px; transition: color 0.15s; }
.footer-link:hover { color: #f0b429; }
.footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 24px; font-size: 12px; text-align: center; max-width: 1200px; margin: 0 auto; }

/* FADE IN */
.fade { opacity: 0; transform: translateY(20px); transition: opacity 0.65s ease, transform 0.65s ease; }
.fade.in { opacity: 1; transform: none; }

/* SEARCH */
.search-bar {
  display: flex; gap: 10px; margin-bottom: 24px;
}
.search-input {
  flex: 1; padding: 10px 16px; border: 1px solid #d0d8e8;
  font-size: 14px; font-family: 'Outfit', sans-serif; outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #1e4080; }
.filter-btn {
  padding: 10px 18px; background: transparent; border: 1px solid #d0d8e8;
  font-size: 12px; font-family: 'Space Mono', monospace; cursor: pointer;
  transition: all 0.15s; color: #4a6080;
}
.filter-btn.active { background: #1e4080; color: white; border-color: #1e4080; }

/* PROJECTS */
.projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.project-card {
  background: white; border: 1px solid #d0d8e8;
  border-radius: 2px; padding: 24px;
  transition: all 0.25s; cursor: default; position: relative; overflow: hidden;
}
.project-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--proj-color);
}
.project-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(30,64,128,0.1); border-color: var(--proj-color); }
.proj-icon-wrap {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; margin-bottom: 14px;
}
.proj-tag {
  display: inline-block; font-size: 10px; letter-spacing: 0.12em;
  text-transform: uppercase; font-family: 'Space Mono', monospace;
  padding: 3px 10px; border-radius: 20px; margin-bottom: 10px;
  font-weight: 700;
}
.proj-title { font-family: 'Libre Baskerville', serif; font-size: 17px; color: #0a162e; margin-bottom: 10px; line-height: 1.3; }
.proj-desc { font-size: 13px; color: #4a6080; line-height: 1.75; margin-bottom: 14px; }
.proj-subgroup { background: #f4f6fa; border-left: 3px solid; padding: 10px 12px; margin-bottom: 8px; border-radius: 0 4px 4px 0; }
.proj-subgroup-label { font-size: 11px; font-weight: 700; font-family: 'Space Mono', monospace; margin-bottom: 4px; }
.proj-subgroup-text { font-size: 12px; color: #4a6080; line-height: 1.65; }
.proj-highlights { list-style: none; margin-bottom: 14px; }
.proj-highlights li { font-size: 12px; color: #2c3e55; padding: 3px 0 3px 16px; position: relative; }
.proj-highlights li::before { content: '→'; position: absolute; left: 0; color: var(--proj-color); font-size: 11px; }
.proj-paper { font-size: 11px; color: #8a9ab0; font-style: italic; border-top: 1px solid #edf0f7; padding-top: 10px; line-height: 1.5; }
.proj-paper strong { color: #4a6080; font-style: normal; }
.proj-num { position: absolute; top: 16px; right: 16px; font-family: 'Libre Baskerville', serif; font-size: 28px; font-weight: 700; opacity: 0.06; color: #0a162e; }

@media (max-width: 900px) {
  .projects-grid { grid-template-columns: 1fr; }
}
@media (min-width: 901px) and (max-width: 1100px) {
  .projects-grid { grid-template-columns: repeat(2, 1fr); }
}


  .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .hero-visual { display: none; }
  .hero-title { font-size: 38px; }
  .stats-strip { grid-template-columns: repeat(2, 1fr); padding: 24px 28px; gap: 24px; }
  .stat-item + .stat-item { border-left: none; }
  .section { padding: 64px 28px; }
  .section-alt > .section-inner { padding: 64px 28px; }
  .about-grid { grid-template-columns: 1fr; gap: 36px; }
  .equip-grid { grid-template-columns: repeat(2, 1fr); }
  .team-grid { grid-template-columns: repeat(2, 1fr); }
  .team-pi { grid-template-columns: 1fr; text-align: center; }
  .pi-links { justify-content: center; }
  .footer { padding: 48px 28px 24px; }
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  .nav { padding: 0 20px; }
  .nav-links { display: none; }
}
`;

const devices = [
  { name: "High speed centrifuge", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/n5yYUrXnwmBvdbJUXRmUsg/Y3MdsLv7cve5DgCZ3RTHuZ-_0pDz5le9wICUTCvnElp67mNE0kP-w4wbHO_nbPvu3s8fWsm9-sHuIsKmNsz4TW_WDj7MwHLgEanspgxpVRgj-T5WNATEHFCWJ-SBjjhXODONARRr5fLF0kEFi8KuGcTcWs7z7RSFVK5Gr81WnlU/oDXB4F0P72ub8XxuQIAQowYeeNEfabnnKZc5q9AnLww", loc: "Wet Chemistry lab", status: "available" },
  { name: "Rotary evaporator", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/PYWCinYVc-gbOUsLbAexEg/ihQnCUs-GIlH6ZKFZ5VJVOlUiiVYqzIAz20yT-bHWXKw0-imvLLVzRStgXVI952bEzwRIh3KGxhSH7Gua4-CB6o0h0dGK-jwL7IAYZtUzCdNJVTv6xB1YDGT33RoeKwqOfzslczfTmmG4seKh0yRLLUpMEF8n1Fn1Ih61A4r_II/Dywf-LIitNCElVqseaRWEAAwuElxx50pCDOqoUVq4Ek", loc: "Wet Chemistry lab", status: "available" },
  { name: "Centrifuge 2", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/9Op3PRwBsKeodHJHSiZUZw/3USj2lCUOiwNRezKBEsaHArrBx957Ss394TU76aF9eP9BcGQKx2q393xpfGhFGPhMKmdkaOVBLNEZfmmTfzdjhlVFgP6qeLoPOEBrW_OqCOFTkJoUL84xTHYKgpoGcAQHEwLIZy8q0uA7LolNi-rIVtDwAwVluCmkfBT-nHw0EE/cFKKahklhu8y_kKsc9QtF1sud-UF6T33-gyhcPcc1-U", loc: "Wet Chemistry lab", status: "available" },
  { name: "Vortex", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Di7M_YdhpF40LbSD7rbv3w/3iuqpIaLvr91b4DCA7BV2-CBDrj1hBQ4JieOe6RSRdx0qvnsUGZLY7rc9y6Jw6Y2LnQFTqwL53L7o6GbPYGOu32b0NK2J8uU4NRxQG9OjJJZKiw7Yk-qNvKp-8Z3Iq6GqeEFb8J7iVwqCAIJ63EDMAEgD-Jnfa0CrtdYOkqOfIQ/v9URblNKbWIokUGh3jErcgqRMPKnRTjYAk8SZlZUD9E", loc: "Wet Chemistry lab", status: "available" },
  { name: "Fume hood", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/NAr-eiBTBMDRmVqJBAuT0Q/n6xsoYXYtYCmxubQveIOhGkeKESABPRLfp3MkusNg2mo0aY-h1Ve9K6XbQsndIGcp_HXvy9BnPXZY7MI7_qfCAo9hfXdrSRbcbBeBG90crQiNezcpNhpYCjew4FUrzexTTP_yjX7AmlyVQmHebNi4mX30r58ddx0XURcJrnBFMg/3wTBBg2NSqY1Ro1NxgDgp0Hw_nXaPIUZ9BdGEgsCsT8", loc: "Wet Chemistry lab", status: "available" },
  { name: "Ultrasonic Bath", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/NTNJLURB1ni6F-ofz2q-HA/HziTnuofJLumsYW5r0zR32g0ZUvd-RsHdYN51P057QpJNoU3vsHGLXiS_fvmJFi2up_7v1J7N9TCTWTK_tvEYNQ0NaUM0YC94AQV8gzdBwIxABmDe--hn1Y9QqmCIu20MZVASvNVoeiosmpry8CiA57p6NHkQEcPugxJHjQN_is/n3hUifJAaF0PKXWi3yM5n9ar4Pt8_-6mTm2QVbRNPTE", loc: "Wet Chemistry lab", status: "available" },
  { name: "Freeze Dryer", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/r4CvoKrkKQusDFir6_5FXQ/sgNmXKjIuOGX3w57g9pFjQ9yltUGcrEQDRCw_Uh1Cn9JrYExGqGzeuP_vXzrHWc2bGqA8lag0QxSJe5hjgUngvJh09a1dj80UC8O_f7iS3qzX8YlvbTbmDHyaEtTPgwxZaYxCjQPuCu28Ss3rOwOkvcAc0UPcJpxnDuAFq55bCQ/LUsmSQZ1Nt-ZlZCLgcwXhfIJMGS0pjpSoLXx7-kQu9A", loc: "Wet Chemistry lab", status: "available" },
  { name: "Biogas reactor", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/LoUym6Hg4plZKnkyTU3ptQ/SfUbcL-S4TIhBLtLY5eMiTVaF_wdTvTF5n8egffSSq68RbE5osyRUqR689JouGV5NYz7AddhFUMbm3CIaOrg0su9ZwRfBEDixS4PzkA3N_Xfi6wA0ei3GqIaKa3dC8rrgymPu4jf9SirmZJk1JbZwoaw3zLC9uAQe2bbSVAnKrQ/oB7KtYgTDkcfSB7vGsIu1dzykVQ3x3Abui1TbGi7yKs", loc: "Wet Chemistry lab", status: "available" },
  { name: "Shaker", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/po4Exd5q8G3Xffu8ITGrfw/RLbVZUrSJKfLRoFp3xSLNikzqe0M5xLFz-ElSbguHgMpsytd7ogLLNhVWkfglDaBw9Xz6QN8hFMEastbTAGwKfQgGLfAs2mBPkVwuQiuL6Pk07aYtALwthIiTe6UWCR0I1x6BAMjoEprnT_HL3qNZxUUSLRSlBBGW53f-TKyrWU/EoCc95ggz2E17e-6yQYrE9w_3tKjCLgsZAn3PzO7Uu4", loc: "Wet Chemistry lab", status: "available" },
  { name: "Oven 1", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/MtXJa-1bhimGVdNXbKuwiw/3d7O-c3CTNg66eGQ2tZOCXvJ2Zijo0vKor_NpfEfdDIxXFGGa8n0RWVVkaE6bNCgBA5O4FG_O0dCFLiypfFmMCXSZq_U3-49B8_KVRnifjns72NW32BsAq0KyXkUqxj9vAhPrrL0mO4m50e4yrTuk2LqcGi8mikoxYRHqXriOuU/ySCWq7Zr-hl8MG1H8dYaJMe7pELgqAdR8mPgAL3a3NY", loc: "Wet Chemistry lab", status: "available" },
  { name: "Oven 2", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Aj6kdszJOSfc9eFTnVFMCg/1Z5o1tm2xortExthKBn9ShiZ8ojBG6YxOWDk_IY6G8h_cDqmNHK_z-i0SBB1nVQy3_nW0vnaugNcPaKQw5qFa007umq7oO9mepDUgOZtVwKZ_eYOOteP28pN3YweJEIq7nTzzwpshtxz0jMyEmLC9MJLfuy6O_zZM5XDa50tLX4/hojfqlKAjog_M9ZpOM-p0a03qfuK885zoBVZnb5h_0A", loc: "Wet Chemistry lab", status: "available" },
  { name: "Muffle furnace", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/j7sDxFc2EW7sDzG-uJIBqA/ZnekmViZhlsTNzMhN1l3N2eRu2P2tPfGf3KR6Pe3T35MXQVkzDtkGJb3-59sniB9eMRk0nGM-s_YwbQybMtwHVrymkG_SSgfFz5OGh3b3iLljXgutZ2T6qIgp950zUsV5571mjuHuGLflxrhr3sFb_tbfkDmdxNr--Uwiq8XQjg/8P1XWqihsBUVsayOOxmwnFTTAisDfvC5WyiJgZmwfJQ", loc: "Wet Chemistry lab", status: "available" },
  { name: "Flow Meter", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/uyVgFYRMxPiry6CvjQ_Qow/8o5r2kkSHn2iX8KG5WcpLBWvZB6yNCTVYu4wV5Yhz9_l6sXziPp7FunEYzQz-jLEi_OlH0gEmXiS8voh_RpFp59_pViajKEdpAEO8H4hMMjCyiRSCYrUYJSyG1OWR8PucWZ5oQw6BxjDSATATTl1xL2lNDeNYd8-cJg7Nk9iof8/ZfS8uCg3GjdlFXkdB35PX5K2QWqJozgUJ0I3Vp_Rz3w", loc: "Wet Chemistry lab", status: "available" },
  { name: "Vacuum Furnace", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/96hqO4G6UpTEIDx6RYVDkg/1N9h1YAleAO3693ZjpiSGMUmDcgAIFg3t3zJq6DzfDWoM3Ha8-igmdFnipk2PfbjY2hKhzIhb0v_xdkllavHpn4vJ24sUzKEXgv47OEr5rJovYwTY7aD2f7ayrPkLJRcFDGjDHO7zuCAh5SC8Uu8zgDvWM--FEoSk9N7mlQxcWo/_23SFWWmR7OJYpQ7r8x57X8fhY05TIsTFl7iwaixRRg", loc: "Wet Chemistry lab", status: "available" },
  { name: "Gas Tube Furnace 1", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/-8sF-N5qMX0LohCpAjywYw/4Ns_JpQU5Iu4dytHodPBoOIzo82kkw8cfJprNRsQZu0Wla4LPvcWMR0tAi3BFS7RqHsVYfClYzrtD0PG5clUipAO-w_z3Du2C0lFmgmub3v-VEW1oYhwydT1XH2q1gsbYUwLndpDl2hQeX20SWvTzeewm2T0_cDBTrZwywObf2Q/kX9IYFpcnDCvg9kQ5eoL67dX9EhNyMgwC_VpmWVgXRM", loc: "Wet Chemistry lab", status: "available" },
  { name: "Air Tube Furnace 2", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/oKxVWlGglUA9_ykdHalhYQ/Lr2TeVLe6cw88oE69o0pyb45yxx1XCVlnyyLGRdcJaeiy0Bl-Dvb6dNj_uYd4163kTLdAAumFDAEn4yEfYXhxqGGiDX3fKfZDCbwXnPW_VPmpommY3prE1PelXeSEuu-zlfxh7Y77_hQ8Lhk1iqnpw7379kJowanoV9O-G6-Ses/yjSqNhcbjte7EMDmSBcsTmkl28gj8HXVreeR2lN_7q0", loc: "Wet Chemistry lab", status: "available" },
  { name: "Air Tube Furnace 3", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/BBh1fxwqmrd-SJoYi28cqw/tznsMelkOd7SLKW0Ealm75sdqYQErziHrCuuYhAyZ0Q9psHmjulIeeeCka0RrcojgnV3m7cQVqrHBYuqlrPESDct4lESIn9PDxNdFaMcwENTqE6gpscmtrmuYag0EspgJiGScwMly4aPp1gvfAc2II11m4Pg7TIR61OV5_wE-Ew/F0aAai9jNzV-X6lmzpsp4TaIw5lOsvIoNwi1Ch20WhY", loc: "Wet Chemistry lab", status: "under" },
  { name: "Powder Balance", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/eLZk1xdnvBJ5llM1CqaC3w/HRwKsCdlfbSpw3DZX0TiiI2XL3UrXbfPfsTBMyM0owSrww6r_yxciM0wO734_rFy81mcm1Ikiq5ntfdhCrleUZ8NyYJLOIameumSg6Di2CSsLLTxanl7DSgeZc9TgAAlOeWmDMeuvefs69m0mldVZgEsmIyCWFhGwhHmB49Tfdg/f3Q80LeC0Hb5XGqNTlALp6gjB0ZvZJoPp50BvkSKBPg", loc: "Wet Chemistry lab", status: "available" },
  { name: "Microwave", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/ymQPuEAfiHQsqIqWQsK7bA/1y6GWOk9AJXcMFIdGspuAS_narUmnphy4wzSE1G7HlI7BKoKMQWPWnvqsmReD8tUFhC6anQbOX8r11_3coKHc4xnoqSuyYfTUbGAW9tu2m43A7GOCQBBiAfezTqqGmfPV2e8wiEw7w7EYEvAVJfGIewOZ49YZuKhPFBOHiDqRqg/pb62Yi1voEaq3n09qy_XZm0xQnEwfqg_SPwMwoMt2Kw", loc: "Wet Chemistry lab", status: "available" },
  { name: "Power Supply 7", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/KwuD7WfokXQ3z3G2Jr7XXA/bEgcZTo0j8VlGxJdxwyMXxpTeN3xwIVhT8-Um5iuGYS90jIfueAYuSZW3IYhk00P3IX4dyj2TgbfLjCffvynrM2mmeXsAesDw_owfGvtvQSzeqMH-D3asKRQj2XrpqTVUzR2uzX4aj0OK9WqzFwsPrfvzg3v-yqmofcmzVJztHc/oXX7TDLSqUem3-45Y--Gds8ztNnH9iSUGqnq0WrIVAU", loc: "Wet Chemistry lab", status: "available" },
  { name: "Power Supply  1", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/mV2TGY9ZyxHlrK5HfM_ZSw/w9WGatG5vJGHN5Inw5L3sKZyJFO72CeC1wToXQeQEM18mVfKMIMFgPHlvCwwviIvJ0_IQuGj7i698S5D_StJ2qenD_s1yhpR1dnRRtxL2piHoEeVpRCWAwAkrIqRCCgwZCqnkW1X9vA-p2aht3-egQ/_JMHb9_YEPBlVZCQzh-bRQ3wi2krIw1V07fXTvilVI8", loc: "Testing lab 1", status: "available" },
  { name: "Power Supply 2", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/6eJtNar-t-DCQeMJmbaf-Q/scFNTcfhmGnG3xb3lUPIKOq4j1ZpcCRCu9zzwE8ZMPTJYO6xPjrGjw94rd98_7wkIPQChP5jKxjhEho6A4pQKBRXskCA1kjH6Eesei9jYPwcyfWNDkqegZ6AksbsezPeFD5ZQJV1yXtLojz6y9tWt6HShgrKv7y7_3BjLBEZ3Vg/ZnraEXDG8J9Z1AgG6EFeKT4GMVQ28t9gSe2QaEMxMt8", loc: "Testing lab 1", status: "available" },
  { name: "Multicoater", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/M-7Ayim9gk8wSY6kRvc-jg/cAhTYuypOucd6pQHd1v8Cx5D4DK2BoecUWoi9bkljOjqg5A-jjUDy_QYK9P9-wcHoyUzAnvs_usfsEMCDXyg3lhOWcWNJ4MabHxYHcKN-mRrg9kkQbt5VI_hekUyhXhwLFS0RtxmZOdhx6nw401MaSak22I13rXnQLJNen1wotk/PorNng7kLRC9WT35h_9Wsl23Su7TBqFQcldoUC49bZQ", loc: "Wet Chemistry lab", status: "available" },
  { name: "Electrospinner", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Ge8vXyerTd4ftk_OjDudnA/U7mS40c2fHz11xUHCCdWO5r54XvUtn5Ct4HQhjJPWbzREe2o3dHIHBt6BqWfhE5fTLYB7e8brRWuJMZ5DjSBvWGUOYG_SsFMy6m4UFOWgsivf1mT9xYxbdpUTRxpIPrPxpJylT3irRHgKp3F92qIaijAM2BQDOp_u6yFjFWP0po/pBwihXmrRE-AWWhGHiGrkWmbGqYfY4G-zAHgZ95Px3Y", loc: "Wet Chemistry lab", status: "available" },
  { name: "Solar simulator", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/8TMOKI_gGrNxUi1eb0Wv0A/grSqlRMYqjB4z833BWRGOXfqdkzekPBrxCEBka7ESYAxxbKMn72RROUZWgX_VxwTONpQ6EUso-YTzQU-pyxFG8IlPAcBSu3qUlnkxOSV6w5nRfr7rzmrnQIwxeg-j6fcHApLlMq85Ni8D9zVkpXRDvp8ljkAh2s4C50vK_SpP1k/_XlJPGb39f5MTHJ3906wsbQQFMy6YAgeFQJIohNRI1A", loc: "Wet Chemistry lab", status: "available" },
  { name: "Water Bath", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/PzZmE7xcm8l2Io2W-nsUlA/Qt4LmZXzY_SOdgYP8zSM2PENhm7cSoXS84d-GkKKMK22hB-PG6r1NV8FlmCLSwUC0C5fqYnTXDXr1u6rCyuneERr6AHg_V6tanvDbyypBZU_yh6fdHqdxc-WzEDgPKzxhd5qhgiDjn8xXvLJf4OAMK3iKoHNEKYYX79CjIX8eaI/Slj_iRAO0Mf6h9TTRco37dOi-rCvch6ZYvX49Sm3Dgc", loc: "Wet Chemistry lab", status: "available" },
  { name: "Chemical refrigerator", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/4lQGpCu1yjFXOPzwPhsSlQ/bFnCPkxCjOVsJgqYyNBvSiFyPZCmcwVifk6FRN-MyAERMzP3xcWBdje1_T1CB0Bs5Bixx0XTKLaTI35PwIPb1LC0_9W1K0iDNrdsm6j2LUGH8ApfYAo8Ogywjawvdz1gvdIGV_azvwnrI3LuWo2YD3eDEzbzZwCKiCBfP1In5Fs/j5v_EJUbgte_Q_rRHEyIH9qhWqaTmX35EqT2SDe8PrI", loc: "Wet Chemistry lab", status: "available" },
  { name: "Spectrophotometer", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/UlbvLBANLA3fh9JuzJnmig/ysIp5GI8Ul7SUG0AP5BS0ge3ayT_xbzgCtyzyd5XiQqUiWLrvo61O5dokyvy0ccih8pQZOJk24DJZwPmdnChYLU9ePFRnGD8Ux4CjJs_tzNFLIvPtQF4-FrSVl-Yda1rtS_zxtdiXz8l0r9P7JdMGr5OEtxa3uZsfXA40OPfUV8/XNICm1sej0_L1zGlmjCQo_3cKU4IFC-9pUPtW9yVwHQ", loc: "Wet Chemistry lab", status: "available" },
  { name: "UV reactor", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/x8ibmAPZzXTPbxFlQiOTrw/8L3w3uiH2cZd63Gtw_TsAYmc0vx9Fu4-FOKCUFD7Yn9kYVqCSPNCZKEYyyri6um8b3fng5UEtRaaFLuSYCrg9ts1EmY_HRn13RElrQhplOue6TzZpNaqrU2YqKiLJcNEYnl8n7F5g-CQ2BAvq25Y5fQ4-rYXnB77AbtP3oD3hPg/vyTs9Gm-67TsWLOqFRJRL86WQtNaglQd3NjaCCgNAiE", loc: "Wet Chemistry lab", status: "available" },
  { name: "Stirrer 1 with heater", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Ae0eP-MEQUC_ARnApek6eQ/tt2VwQLUDaPQLB9U0L68B5C-ToKW02FrexG-XccgRziL1cCWcJ7G8m8d7C831syyF-sSw3TW7HNyaf4sezCJHAzYlSX4-wwOk5Quhp0QxcSzfCL6zTmvXsunXWs5cxbE4p3ETrfJ1Bjj8q1OPHiMkGgWsw53iq9mbE9cZ5P4hkY/cRWnCA2AfjIc71aJzFcUxllbsSi06SRX4T0qzOnRtME", loc: "Wet Chemistry lab", status: "available" },
  { name: "Stirrer 2", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/L811a1qug6I152xezfw8ZQ/dtMndzxKUZRWRJcp8vQV9nSPNbKqy_-rOqTKe2A0gBGUnjMM0Ty8SfNMLUSAViJD-pe7QdtEQVXqVlxutAmcNMQLvT6r370gcLcDsaKt02VWlNcka6u3L7mqJ667-y4mFMmPPR8oCcdt5HAD6aQICgCyaEvBA768XJ3ObbgHb74/6zipgkyBy4MCDss4erxad7rrq_dzLllxUqlBsztYTX8", loc: "Wet Chemistry lab", status: "available" },
  { name: "Stirrer 3 with heater", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/kH7a71x1A77rh6Am_blILA/8O9fS6ZFPSuWwAgjxqEYBH82CtvWZxhAhljz1j4jJTc961IwclZmu8OQeiJvTsPyKp0GrtNKdaJyWomjpmHsrGdlq4cFCNumaOaA1OTtiaImbVJ8PzYOGhgI0WWY9OIfhHg9YOZ4CJEfFYaSexaYXFzGebA61PBQ8qVpYv2GZa4/qf7e_kXKarWNDnO-tl3GpXD9z0d-oxcpEFkY6gxKdZ8", loc: "Wet Chemistry lab", status: "available" },
  { name: "Stirrer 4", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/ohjjycCONZxMKYjLCrtCFQ/C7p3n4BoOdLqAv1D-FfmlgaUJt2aBrYYnkhXZM6nOqZo5aMfzCU38KIAZQgIbyMARiH5DTsacQ5ortXVBzoGRFA-SsvEg5pmern5GKDchY1wH3iA3ltdwY40liwV1mO84C_QVLK_ZgxoHfFkVQFcI3Zrurjz4Wz3HRI-ivGZXvU/Eq43rVLoQUWFaZ6GmPZud1vNpU2F-RQYmV_HnEAp5cM", loc: "Wet Chemistry lab", status: "available" },
  { name: "Stirrer 5 with heater", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/GwkkMUHt__dLqCb029hFLg/8EW77b5PCkFlyMq-mkq0_YzOkJEU0NabBCsgVjBN00arkIVYPo0pLuxMyxdwp0TNlz5tZePp2fvM_oBk7_sXfeWhGi9jaO4cJ3iMsmi1w6cDFsdH_q2AJddfCJPhCY3SAke1x6crHyvYjho0cTPPt6Qlv84AQKBjNndNBQ70RY4/n9gf_mY1EDl-AP19u1gZjiSd6Dcknnp5yYIw87ny_i4", loc: "Wet Chemistry lab", status: "available" },
  { name: "Stirrer 7", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Urv1thwbdcCrDhNgtv7TAQ/x-MzTfzVUUChV3GvQsuz7b56voScfWoTjDhYkG6vYfqIoDjhiP-DymKSqmHrwCsQu9UZC5XKiym1peAJl6A6quACffmjg1nwY2oENY3FkW-U5So56meBIVCKOz9YaE6aI7kMY7-x6F_rCu9HU0gXG8SMKA19uoSH8ItD9Rp44HI/oSi_O8ScEUaosYXl0ck6MEXaCvMzg84mqh2g7Wy7gYE", loc: "Wet Chemistry lab", status: "under" },
  { name: "Electrode Balance", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/SxwwIDsXIWuy-YBVbP_Z6w/fa9w1A6XxEDdvQgBMOxFtuben7NFC7XSeFozBSpeOy-jz8vXl1VN-L3nhi08ykfHUdaohzzK_FC_JjH1gjKX2v8Q3NWZRp430PooPgF4WM-6qOlbA4Ur64RkiiWeamhodqkKKyBpbPy7-89mzvRqf1XTIVnedxCcgJwRmR1wOLQ/x1mpHHS8JBhiZslmq1Hc5TpstJqK2tajsNZhsUOj_kM", loc: "Testing lab 1", status: "available" },
  { name: "Admiral one channel", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/tqy6PDvBLf6e6arkTMgUIA/s8X0Un9vriVhg-OgmB8H_pxV_Tde9up88-psoFn3zcLpHTsi8vxFUKPWjvHKpBILTRJHfFV6MEfEmquMCjSnaO632dtHQDhb5EvdOz306-oKOXwTUAszehAYKXaaFVLGXYzAZLN0h6gFhaOCbV1rMbGO1OzLhWsFlEtXB38d5hE/I5CEQmfPbwbvK2rL7AO2YZzP9xWN9pEU1rk3Rxs4cu0),IMG-20241222-WA0044.jpg (https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Zdm219vSO02fDN_-FbJiaw/grarI9p64FXBzpZ0BO9dXXJ2QUBO_M3HUReQ1hRfvitkWGFQv1SWbeYw5myTyWqQ_mALIfO5MQun2_I53tQ5OiIR495Q8Vr3AMFsY9Gunq27su8Ta2-ZrAin8P6XFPZTITdEDcW6MbDtrAWRkdmoaZ1VXk1-v9BInMpLXecuLjk/rZ2I9ersw9Cj_Vyx_q5GItJ0_cwbOm9gT6hVJmI874M", loc: "Testing lab 1", status: "available" },
  { name: "Admiral four channels", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/CPmnxjLhSi-1zwAQi8-e8w/cD67VBGdbwx4M_TuhQulR5HprQZV77j2xW0pSFhPZ138C4awcZ7iLKApXQlyGTZE48wMrkcL-GcU8-F6X-y9whX_j3T5muJ3-S-cCq11KsXSIJ6_xVcr6yo_o7WdUtwGPzs4zsVJTFJKSYqc2a4OaH1JjUNls5OlldqDpVGbR4VQhqO-9VWuHsLrvRYMKxhFR26iQXrF4_2oHoTIm6ocTg/hzW4C-83JcHgNDej5JyyYGXx9hC3WCn2w-r2AxyVco0", loc: "Testing lab 1", status: "available" },
  { name: "3D Printer", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Vt-whNwtBFSvb_5Z5Im9xA/vw_DTUjv2ST0W5OKit8yUiJ_9xmFgHBSGCz-o8_NjIuLKNT16mDzOSa1Eq6EIDMblTVJTq8hq68hXL9mT7Zut37ML5NlUk2jfsk7uOPh4v-PJrtic7WPnMLMJ2Umdg0xxzROILsZIuC-D51pjmbHJCxaOWByOpqWSLJ5CRBkFdA/A9aXssPsfWAvu55dZQJqm2-zbYIgnAJTtPxAtBz7xOg", loc: "Testing lab 1", status: "available" },
  { name: "PH Meter", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/THGNwj7pF8XgFhDvTTHLtQ/6akxL3nBTr3to0FonVgoROlcIX95FpUhOo7nts1S-bcC8zuAdU8GkvWApNAo1-sRFmZ0HUefcMDMx3hvLN84y8bwgjB7ylO7ot6Nb-0nk95__zbQhNYaG_0GCAI4lqgv9g_fkZ9LRgCiBmXe38S0jxXohMRpoZgtHb015cR9bQY/9wGwYBAxc2UCLsqPZH9XfSp_-VD8E7GJfhE63qTgvy8", loc: "Testing lab 1", status: "available" },
  { name: "Pump", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Ng3HRxTHbwmlrePZJvKK2w/EjKF3upw30wdPNm9y_bDlOHaogPjlrujDXZEZwBPpoJ0-5tLdADD7eZPXJzJ2FQZKSLcvdsCtiejE-FF2FzWu_XmSDWtR_GTvYSkwyx3Ru6EwLXeR1GlyZRQkXN5eqMZ7EpkTm9xsm1MtUxGpMXNEmJJr4w92l2lHuxNxMTPK_M/FhOV2EsZfF9KxRaLQeDBeLuIOWR-fOxeYnmPPoD_OsM", loc: "Testing lab 1", status: "available" },
  { name: "Distiller", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/iRIdqIdUtua5Ug3o2dqcaA/c8OyPWJM5nkiTlRnTd4I9ZQUyYYZOPMtmEfj7upQWHiQlEGZKd8bEg2wB7Nz2ywwhKjUosHHF-EcfhfZoD8ZrySjvk9upCTX20GWYEkEPKP8wxuuzX0Jk9H8eEPAvm5mhTW2svz0cmkPg8voAw3dGhP3tK8nT4Tig5tGdGqVU18/Xoc7dBW4yd2mjtEf-VSvJxtkjOGbGnTN92yD3vN0SAU", loc: "Testing lab 1", status: "available" },
  { name: "IPCE", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/0gFBw2KbY6g9PdUjxwH6vA/FBfyKcFwtMqUNhK4rWGXPbXFUlgOP3elV-3lBhLQ8OO1GoG3jnzMDRwLEmxfD88OQjlTKAEOKnxmN3z8EWjka4m5GiefD1FO0sfj6uoR2jQ3IeNoXLG91YkW9mEZrqPCM2xwTcyHZy5S7EOdoXRQ3Qq4UPzCbtLmAn6vfO-wT_I/GRJ23CS3QPkAOJyPMGbhpPPWJjMzbVr8GSAx-ixlh5g", loc: "Testing lab 1", status: "available" },
  { name: "Potentiostat 1", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/DYInbzQepzk-Udpmvg7fUg/6wjV0vqS8lXb2mfO4a5LHjRIYOPMvU2-acjr5MRtGozDp9krMJzBcZfJlY00WkJyPvpWUHvIpvyIIY4H6cW3xOyzAqgdvDER0N0lmSF3A-aFej4gKTrMixpEHIIq6l4dbGdfNwbthToG9Hjp5AD70b_voy4e0Um23sG6Srk0OvI/wHCcg23PlgLL7VUCQhooorh_19-G9YXJbigt9rnCPfM),IMG-20241222-WA0040.jpg (https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/31XSnfTxpfjvE-ume5071Q/Vooiza943zsymnyZIYxdUu20LxhI3igK38UANMOUlAA5GE7IKqF3sQNHOC8TpRRz1DfPKqG3Nf_PtSWnD9bss22qUzXWkajW2-NW7zjftFxrSqQJlHRB_ukQUepJ7DjCtU-G10xPGJ3zJIWv_0Gz-9C7uPWQsv1t9hiqPCllubA/9JvJsG6IEzF4Vw2l6rGdb8PHp4C4PKFimB_qJngRobk", loc: "Testing lab 1", status: "available" },
  { name: "Potentiostat 3", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/cgDaQulj_rrB93oUdY1acQ/Xd22QrZovKPfHuslwO9bpuQCy3bZMOBNjneCaEGa9akp1lmuHGlxmMqMUEzpb9TGko3Pr8Ykh5Os4FOEnzPmJOXUHxSCUcLvKmQWyyBEJ43IwWfvuSmg3SUsR3M39P_S_rJHpQYgID0jE2Zbg7v_AjihcKX4ki1RjWTL3OOOgaE/ce9JFu1E48hPB3XNOQiZaLHhqkLXs0mxYBSxBeFRXc0", loc: "Testing lab 1", status: "available" },
  { name: "Potentiostat 4", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/MiKRXpHu8Z6oHdUtqkCnMQ/_1pj9Ka94QYroOUbrJ1FipEiST73n_FM59QXwkTDdG4Vno91st8DoIK8bTGAus_iwK7kLEePd5pb2oxVOhCNC0lBrUJZRbZOfCgHnMg97LmTjqtm1hcgJ_NxZ3xUMxWNaHDzDIKjBU0zlFcBaaLl3AcwP623sUjQ6mP6ItZdPxG6oU1vtri_p-8sdAM3Sd31z2N8Dp_j7QjwYYSK55AB8Q/JCxZHhJjy9u0_IztzzsaCO5O7i4l1Ypa9V-Ff1-aGgE", loc: "Testing lab 1", status: "available" },
  { name: "Stirrer 6 with heater", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/mhBO0ikFVHjtRKCv4mxM5w/fTSk6cVaMU_Hv5TgD_ivVoMQWtD4J2-xlERLImWMqvTsMHQybyUQFK8Nu8yf-Yoe5iiQiwMbmgSbe4GBhJMvG_rZr4HEwWQo-C32RMQaOnYD0mRtdRv5aIsnz8g1PM8szqgr0VwNgL8OMf6JSLxGj0jadOAtPhack8e66lfce8_L1eWqxsCj5p9ErjlKiSN-EWwOnEc01tPIHbgmVhBQJA/hIL8E-Ca0oVz2BM8RMpdAKEATTi0a_12ofF_JeNtBEA", loc: "Testing lab 1", status: "available" },
  { name: "Stirrer 9", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/lIUfdqNRTstP-iBPW561cA/cgcd_C-KoskGBwqvmO-eID47eYmaIgC9L9NnV27Sbk1TFzPspGq6jiapYF_InefumP_p5buWp2PPao5a80C9pswl8FhesGLoPnp1pOM1IbnKtuK5PwHes1v0VeMpfHkrA7hl1AvoOPyQbsBzb3mp-iYxeTf6pVH1uV6x_Qs4ejc/9s3NeW4iUfoo9BzioLxGqthf2AaWXxEl4FbBzDttjS8", loc: "Testing lab 1", status: "available" },
  { name: "Potentiostat 5", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/xQsD5JycM29ulUAnIg-2wA/WVbvcWDS7mt2ydpH24JSBbVUDkDoSvnHHF31oxNS8Kli_IcVpvf1p4ySwhTb34r4zE2iUk2gB6618k8tM572A9sX4kZXnWP85e0hGjxy4Oh8trmsAwzifqjXbg3zr-oKe70ixfj6KDa1c4oF7KgudaF2NLgfOmrtgVZDypGIejk/1OmHMFpNi9Qk-2-Um2msUHcObmj1hU-nByzpk-Yu1S0", loc: "Testing lab 2", status: "under" },
  { name: "Piston", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/zEPNTKG9cnsOwqXfwVTfxw/77pZOgDyaDvHmuhjea_qUxVECtVnv1BHX3J0Eqd6D0Lv2mAoWVgisHN_Y-416wkOJwT2Nt-H-15xJymeJgJDPflPfi_LdnSC8V6GNdwbdyt7XRIqxdBZ7gWr-ZPuT32AwM1Kkq-B_iUusuueDCPDnK0qdu5MM1MsR9eD3QI_2e0/oDjYZgQCG1Aqoei9qVgkVib73owNmkRQ6Anwx-P-n8E", loc: "Testing lab 2", status: "available" },
  { name: "GC", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/4knh--UPFCTqUgmsqBNGFA/BCJH00ubg5niuZjQl5tCPxY-AITrUBKf5OYVWMJGbhh0aJHpeaTDPh7axCEnTOkkKOTaXyuBUgm9hjaPS8Ut--9OcgFr0Yxi4-jhWgqYTzwDqm5zqu7wBVTjo08niy21Sa2ylyNRTUAqMrpVZPDuGyaorBUFxOs7_zhESXKp4JE/3r53YmazXXNIh_iEYu7N-8_xv2trsRQjXE-nTUj9IhM", loc: "Testing lab 2", status: "available" },
  { name: "Rotating disk electrode", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Ky7c8fovWmVtPnmI3WQZUw/l1NpDpH-Dj2Ck9M676CxMDdkCLmsCHOE8yEmrDsscZy5rD65XQdehKzrII4nzznrIgzfPLG-fZ4CtUoyYvBJ4Ay_LzBi-Ow8UsYI5o6Epo5m55RFsknUYwpTjsFBAYcwOaEE8obe2Gm7uWdpOZLvQ_okNT-RZ_d_mD89liyH0oo/j3fdqOMmAfLQd8hwjaCsaB4HMXVGIWHERCPTJm0GPLA", loc: "Testing lab 1", status: "available" },
  { name: "Thermoelectric generator seebeck", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/fKkFav_rDgCc9XUjJ4Jo8g/OKIIFc38QcfvSXeWpH02gdJYnEnc8sl3YsGFfCznqmAMSKWGc5_FPgmX29ibj25Zm4B5itlPYEFMyuqoOGYP618t7agEIWEiGHUAmvYVboLQ6sCy1ke6ZWva144juPrhRaOCbS4T1ttF9lgahbMwCeQYh1qLi41j-srSLywu7zg/F8zCFh67XF3x2dbHMpZ9wkLSHc8_V7Swe-OP4C3Yucc", loc: "Testing lab 2", status: "available" },
  { name: "Spin coater", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/DlY1Q_dn9YloEACiGkXOcQ/C8lvsQUANZGMngDN96gVwE4XLTeBJ6SDedK2RCdq6l4h-Ijd6XpX-EkaPNu6XXim1o5bXd__6czQ-O4ukCEAgGEwEuPG2MXyuWlwbSJ3yywdL6QjcnmHIHWmkXDNZTIv2A8yiAaL7vktgzVCC_2-Qx_7_rZi900dpM6pV3BhDMI/z4qcy5sCOIWM3QfQiDp9GzERZuitx7dQIdPzPgcJbjQ", loc: "Testing lab 2", status: "available" },
  { name: "Optical power and energy meter", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/xJ5TYHbgmLR0J-gDJ3CoUg/oRZ37AVYKU4C68SX6Zo0FSh_Gj8wQyBhobmMf3pYhWjCk2t5Vjy5i-dFnOGcNMGQ2QqCKMC_mo8xDMKkFpTZdosbJYLHiw6l6P9tG92LVgnBzQRdFUgxuGeCTtaeRxcTjiS9CLlzh4PpkHYkl9HYe2xCN78G5gfjJlWks96sgjc/YogIuzDnBtBCgFX7YJ-YwEv16ESTFbLO9OmWFwIw0Zc", loc: "Testing lab 2", status: "available" },
  { name: "Stirrer 8", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/rjs8mYXx61DHTFM0eoy4Bg/7KHsf71vlT867Yn4mqD4zmYMh_sLgPxC7dpWZHRJBxww71Ls606NQWgKPqdvfSJHiDk8bfTdHaX4Yh9R5VmMMthnZ2PGfbuoLrE8UaYlrRurkyDciiFvH4_7OwZuseLCkwWvHkUm_xwVkWvIoV9_EdnV0eI4-CEd2S2cTia7Zuw/-YO4y0-9Q9ebUt5IXYlsPCfNLj2miLDJDWKxitMYv80", loc: "Testing lab 2", status: "available" },
  { name: "Stirrer 10", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/_NdFotsdV4mwD-4NpWDVcw/ovGMnbnqsO_blbsvk1uUFk99TUQLIuZwNRhqNCSQlxwa_gCd0mpS0H0QEISAsEZ2yESdIJDQXEZMxIFyLhbk2JAKphuNeAyRYj88u4psvEZov6XjFeLmWH2kjzO3Er03MXfrzI0sKwaM9YcDyYs2kU8or8gYApQSARhGOAtAKcg/vqblneN8fTY_-rQkPDckcUdsg7hbUs9ueiVgH6xSujA", loc: "Wet Chemistry lab", status: "under" },
  { name: "Stirrer 13", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/24tUlYTW7hMvtTiQVy5pQQ/W7MYSwqlg7hgstuvLCx_gFSoJwGn2sfobJzZtEA5nBhCvvmfbfbZnveA390PTkKxcpbA6WCr6XoHTeiyEL_oOhtJMtE5pgaMiyOiCh58wGBqHMIZckFd2UbyJS84qWLoaYFYyJMw8yLEWtgXz79YEJWx3oafC9q_xRBRK1mzmpI/WbtFqaxtJHhS-WkDIP8ryxVH68tpqcJMWSb_gXdA6Fo", loc: "Wet Chemistry lab", status: "under" },
  { name: "Stirrer 11", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Gla5NLuo-UpfIkZ6oavQGw/1k0AhkXYAiruqyjJa3POTaMBZj2OkbzTrra5xmcSt-Lu4fFnUK8BoWpJxSwiiEWuHCuDkSrwsgElLDK8zRRdHX4756EAc7KPrB2GGwEOxNXtP-y0Ijns5fEjnirwuFjEvNhuSES52qXN_5jM78IITrlJpZ-_8fkliTxx39587XA/1GYGoKphP2qbYOKMYsSgdHjYTEzNiBNwmwbPCK4YTr4", loc: "Wet Chemistry lab", status: "available" },
  { name: "Stirrer 12", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/EBJYqkn26T0pgoSqnPJkzw/9loPaBtMlfBX-H7PHE3r4DzQb4_6KUdskRnvqu-7fFSl0N2szR-OG2I18j-fLB5k9pcdGA3VZBcJRHtCaB-M6kHBnpAhT07s9RzIY85jnX2dvRdxWXlJdTu_Xst7C7hTjHEfIxQuATbQK9hDLzJ0kbk9KRZmVfka3_6KIbqDy4k/8b1Pq8oXPacqMPpHF-__564AKLhiiYUnxSlzZ2fTMMc", loc: "Wet Chemistry lab", status: "available" },
  { name: "Potentiostat 2", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/IIxtCTmEP9o7tWLQ8c6VFg/4ux5nA2kawR0WoU9xqNzSnAwEz1lQ39twue_q0plViqUg2AcaGmGMsKeFJpdd_qvgQNIlJQ5mHEMUGO72EuSGD0HIbCVVXgZHYBxWEcdZtMsr7V5PY2a8GAZZ4s6KXWOk-3TuyRdcwWhwWkcG5gJJc0j90dVPxhNEKmFHD5QgS4/-ehA6KZs49ihGyBir8v3YZYwCsJTN-YjccL7TEK74Og", loc: "Testing lab 2", status: "available" },
  { name: "Power supply 3", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/Fgs7siuBicXelJHGyeCgZg/KCdV1NUKJTnxrKCL8wM41qxOhJkUdw4cPmOudYilBRi_JNY-V1YSQt4rTz4sOMUtLVY09Z5S5JlJ4N4geq6nTM9s9spy_qQJtFJxtjoBgIx3dKMOvEN7HGtZ3f7INcxH95aZeXZhFVT2Fx2xFhMZHJaFYpedIMWe60BhSFSa8kZNGwlhZF31Iaqd_kQXTOqbA9TTiPJ_EtSZcnQmOVGWiQ/m7bM4Gl-XHqlCdvgomI7Xi6zBBPA0Fg8x-tjdFXXI0c", loc: "Testing lab 1", status: "available" },
  { name: "power supply 4", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/gzriFxI0UiiPtAWO6aJe8A/Ez0Nc84aSHuZo121sFKP8PygoMlur6oQ1l-WWenB9vyaBr6Y62Hmn0NlRrdnEHDFb3HZzZTm8ZZM9RP1piyn5Gif57NWhYhk5aqv_hycL4mj8aD7wj_FiB5poa03G4Syh7_yy6Ox2TDJOU0mJBKC22yl-yzjBuoFHMc0llSQDPDSW4M4czIapnJyncg2-e69MwCSL23SFeqmXCh0MhZByw/_yB8RKrAmjMzkU05QzuSZv6SOH004cYqy2LfvAWRLZM", loc: "Testing lab 1", status: "available" },
  { name: "Powe Supply 5", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/lqBOGhVZKoCMKPUbSJfSxA/7K65wuMnoxtElk4S-RWVGyTkLutJJgXln3vziMTyJmS4-BVgIuuXra-rwOO6r57rdiuwtawUS_q_bcJZb5c7qdpkd2s64tZQ6ThVjYnpAmhhklp3CAEyOJn_gVwZc5SQFvmtf6bzngi8at8sfTbkkQGH98GzGV1FvmGbzhu9dm47IHvAwx2f8p_cuqIlWp3nsaoyNxD9trhxva0dtoyExA/BEpznjBZnEwtZjIanOizmtfZMhRfUhN4M0uPNlpEc-Y", loc: "Testing lab 1", status: "available" },
  { name: "Power Supply 6", img: "https://v5.airtableusercontent.com/v3/u/52/52/1777824000000/EO09ZUw3PdUz4RHkFPOAEg/VwDEvNsp0tmyxGZSb4I2yaufPpUmSGX8ePjr4rc1xbMERT71onlUXxyurartCGgKC5a_5Sh6RxgNENqPnR22EKjFy4IfD4UlJY7gIvPWUO4Yo1IdG0OHigfV3rgi0shgLV6NgbjujC1VEQTowdZMxQj8PDgfrLHbEnPcrQhSkRkV5yxADBsKsIfjhdGzdv_7RftKoJkwQdWStyGTA7mn_g/2BchHwp9KN5jQ9LnOo63Mk7lVJjcDuylUN_cYnWfRts", loc: "Testing lab 1", status: "available" },
];

// Avatar color palette — 30 distinct academic tones
const AC = [
  ["#dde8f5","#1e4080"],["#fef3d7","#7a5000"],["#d4f0e4","#1a6a3a"],
  ["#f5dde8","#7a1e48"],["#e8e0f5","#4a1e80"],["#fde8d4","#8a3a10"],
  ["#d4eef5","#1a5a70"],["#d4f5e4","#1a704a"],["#f5e8d4","#705a1a"],
  ["#e8f5d4","#3a701a"],["#f5d4e8","#701a5a"],["#d4d8f5","#1a2080"],
  ["#f5f0d4","#605010"],["#d4f5f0","#1a7060"],["#f5ead4","#706020"],
  ["#d4e4f5","#1a4060"],["#f5d4d4","#801a1a"],["#e4f5d4","#406020"],
  ["#f0e4f5","#5a1a70"],["#d4f0f5","#1a5060"],["#f5e0d4","#603020"],
  ["#d4f8e4","#1a6040"],["#f8e4d4","#804020"],["#e4d4f5","#401a70"],
  ["#d4f5d8","#1a601e"],["#f8d4e4","#701a40"],["#d8f5d4","#206010"],
  ["#f5d8d4","#701010"],["#d4d4f5","#10107a"],["#f5f5d4","#606010"],
];

function mk(name, role, interests, i) {
  const [bg, color] = AC[i % AC.length];
  const clean = name.replace(/^(Dr\.|Prof\.)\s+/, "").split(" ");
  const initials = clean.length >= 2
    ? (clean[0][0] + clean[clean.length - 1][0]).toUpperCase()
    : clean[0].slice(0, 2).toUpperCase();
  return { name, role, initials, bg, color, interests };
}

// ── REAL TEAM MEMBERS from EML quiz responses ────────────────────────────────
const teamGroups = [
  {
    label: "Postdoctoral Researchers & Senior Scientists",
    members: [
      { ...mk("Dr. Ghada E. Khedr", "Postdoctoral Researcher", ["DFT","MD Simulations","CO\u2082 Reduction","Electrolytes","Water Splitting"], 0),
        scholar: "https://scholar.google.com/citations?user=i7M3gQ0AAAAJ&hl=en", email: "khedrghada@aucegypt.edu",
        note: "Asst. Prof., Egyptian Petroleum Research Institute" },
    ],
  },
  {
    label: "PhD Students",
    members: [
      { ...mk("Hadir M. Emara", "PhD Student", ["Nanomedicine","Targeted Cancer Treatment","Drug Delivery"], 4),
        scholar: "https://scholar.google.com/citations?user=d7MwBZgAAAAJ&hl=en", email: "hadir.emara@aucegypt.edu",
        note: "Nanomedicine for Targeted Cancer Treatment" },
      { ...mk("Sara A. Teama", "PhD Student", ["Supercapacitors","Water Splitting","Electrode Materials"], 6),
        photo: "team/sara-teama.jpg",
        email: "sarateama@aucegypt.edu",
        note: "TA at Faculty of Science, Menoufia University" },
    ],
  },
  {
    label: "Master\'s Students",
    members: [
      { ...mk("Ezz Yousef", "Master\'s Holder", ["Electrolyte Supercapacitors","UV-Shielding","Nanocomposites"], 9),
        photo: "team/ezz-yousef.jpg",
        scholar: "https://scholar.google.com/citations?user=m0Rs9oIAAAAJ&hl=en", email: "ezzyousef2@aucegypt.edu",
        note: "MSc in Nanotechnology from EML" },
      { ...mk("Abdallah A. Akar", "Master\'s Holder", ["Supercapacitors","Electrolyte Engineering","Biogas Reactor"], 14),
        photo: "team/abdallah-akar.jpg",
        scholar: "https://scholar.google.com/citations?user=bjRsmrEAAAAJ&hl=en", email: "abdallah.akar@aucegypt.edu",
        note: "MSc from EML — Hydrogel electrolytes & energy storage" },
      { ...mk("Mostafa A. Moselhy", "Master\'s Student", ["Supercapacitor Electrolytes","Deep Eutectic Solvents","Freeze-Tolerant Devices"], 29),
        photo: "team/mostafa-moselhy.jpg",
        scholar: "https://scholar.google.com/citations?user=GfLRNYkAAAAJ&hl=ar", email: "m.moselhy@aucegypt.edu",
        note: "Research Assistant at AUC — Supercapacitor Electrolyte Subgroup" },
      { ...mk("Hajar Kamel", "Master\'s Student", ["Supercapacitor Electrolytes","Gel Polymers","Ionic Liquids"], 10),
        photo: "team/hajar-kamel.jpg",
        email: "Hajar.kamel@aucegypt.edu",
        note: "TA at AUC — Electrolyte Supercapacitors" },
      { ...mk("Esraa Mourad", "Master\'s Student", ["UV-Shielding","Nanocomposite Membranes","PMMA/PVDF"], 11),
        photo: "team/esraa-mourad.jpg",
        email: "esraamahmoud@aucegypt.edu",
        note: "UV-shielding polymer nanocomposite membranes" },
      { ...mk("Mai Ali Hassan", "Master\'s Student", ["Capacitive Deionization","Water Desalination","Electrode Design"], 5),
        photo: "team/mai-hassan.jpg",
        scholar: "https://scholar.google.com/citations?user=BTLIKZIAAAAJ&hl=en", email: "maighanem@aucegypt.edu",
        note: "Capacitive Deionization & Water Desalination" },
      { ...mk("Marwa A. El-Gammal", "Master\'s Student", ["Nanofibers","Drug Delivery","Wound Healing","Electrospinning"], 7),
        photo: "team/marwa-elgammal.jpg",
        scholar: "https://scholar.google.com/citations?user=Pp8PijQAAAAJ&hl=ru", email: "marwaelgammal@aucegypt.edu",
        note: "TA at AUC — Nanofiber scaffolds for wound healing" },
      { ...mk("Abdelrahman A. Ashour", "Master\'s Student", ["CO\u2082 Electroreduction","C\u2013C Coupling","Sn\u2013Cu Alloys"], 8),
        photo: "team/abdelrahman-ashour.jpg",
        email: "Abdelrahman.ashour@aucegypt.edu",
        note: "CO\u2082RR \u2014 Pyramidal Dilute Sn\u2013Cu Alloy catalysts" },
      { ...mk("Abdelrahman M. Abdelmohsen", "Master\'s Student", ["CO\u2082 Reduction","Ammonia Production","Electrocatalysis"], 25),
        photo: "team/abdelrahman-abdelmohsen.jpg",
        scholar: "https://scholar.google.com/citations?user=V6wU7QMAAAAJ&hl=en", email: "a.abdelfattah@aucegypt.edu",
        note: "CO\u2082 Reduction & Ammonia Production" },
      { ...mk("Abdallah M. Abdeldaiem", "Research Assistant", ["Supercapacitors","Electrolyte Subgroup","Energy Storage"], 26),
        photo: "team/abdallah-abdeldaiem.png",
        scholar: "https://scholar.google.com/citations?user=S-8ggHoAAAAJ&hl=ar", email: "abdallah.abdeldaiem@aucegypt.edu",
        note: "Supercapacitors \u2014 Electrolyte Subgroup" },
      { ...mk("Ahmed G. Ali", "Research Assistant", ["Water Splitting","Green Hydrogen","Electrochemistry"], 27),
        photo: "team/ahmed-ali.jpg",
        scholar: "https://scholar.google.com/citations?user=hfuJC6YAAAAJ&hl=en", email: "ahmed.galal@aucegypt.edu",
        note: "TA at Ain Shams University \u2014 Water Splitting & Green Hydrogen" },
      { ...mk("Shadi A. S. Eldib", "Research Assistant", ["Thermoelectric","Piezoelectric","Energy Harvesting"], 28),
        photo: "team/shadi-eldib.jpg",
        scholar: "https://scholar.google.com/citations?user=B4Lx1X4AAAAJ&hl=en", email: "shadieldib@aucegypt.edu",
        note: "Thermoelectric & Piezoelectric Energy Harvesting" },
      { ...mk("Kareem T. Salim", "Research Assistant", ["Ammonia Synthesis","Electrochemical N\u2082 Reduction","Catalysis"], 12),
        photo: "team/kareem-salim.png",
        email: "kareemtareek@aucegypt.edu",
        note: "Ammonia Group \u2014 electrochemical nitrogen reduction" },
      { ...mk("Mohamed A. Elokl", "Research Assistant", ["CO\u2082 Capture & Conversion","Power-to-X","Decarbonization"], 13),
        photo: "team/Mohamed-Elokl.jpg",
        scholar: "https://scholar.google.com/citations?user=NQctE4EAAAAJ&hl=en", email: "m_hassan@aucegypt.edu",
        note: "Power-to-X Decarbonization \u2014 dual-functional materials" },
      { ...mk("Mohamed Badr", "Research Assistant", ["Water Splitting","Lab Support","Electrochemistry"], 16),
        photo: "team/mohamed-badr.jpg",
        email: "Mohamed.badr@aucegypt.edu",
        note: "Research Assistant \u2014 Water Splitting Group" },
      { ...mk("Moustafa I.M. Abdelaziz", "Research Assistant", ["Thermoelectric","Piezoelectric","Energy Harvesting"], 19),
        photo: "team/moustafa-abdelaziz.jpg",
        scholar: "https://scholar.google.com/citations?user=l89LJVQAAAAJ&hl=en", email: "mostafametwaly@aucegypt.edu",
        note: "Thermoelectric & Piezoelectric Research" },
      { ...mk("Yasmine I. Mesbah", "Research Assistant", ["Supercapacitors","Battery Recycling","Energy Storage"], 20),
        photo: "team/yasmine-mesbah.jpg",
        scholar: "https://scholar.google.com/citations?user=-VM5nF8AAAAJ&hl=en", email: "yasmine_mesbah@aucegypt.edu",
        note: "Supercapacitors & Sustainable Recycling of Li-Ion Batteries" },
    ],
  },
  {
    label: "Alumni",
    members: [
      { ...mk("Nashaat Ahmed", "Alumni \u00b7 Postdoc @ Univ. of Adelaide", ["Supercapacitors","Photoelectrochemical Water Splitting","Electrochemical Sensors"], 1),
        photo: "team/nashaat-ahmed.jpg",
        scholar: "https://scholar.google.com.au/citations?hl=en&authuser=1", email: "nashaat.ahmed@aucegypt.edu",
        note: "MSc from EML \u2192 Postdoc at University of Adelaide" },
      { ...mk("Ahmed M. Agour", "Alumni \u00b7 PhD Student @ Northeastern Univ.", ["Electrochemical N\u2082/CO\u2082 Reduction","Ammonia Synthesis","Electrocatalysis"], 2),
        photo: "team/ahmed-agour.jpg",
        scholar: "https://scholar.google.com/citations?hl=en&user=93r3gjcAAAAJ", email: "agour.a@northeastern.edu",
        note: "MSc from EML \u2192 PhD at Northeastern University" },
      { ...mk("Loujain G. Ghanem", "Alumni \u00b7 MSc Holder", ["Supercapacitors","Optical Supercapacitors","Electrolyte Engineering"], 3),
        photo: "team/loujain-ghanem.jpg",
        scholar: "https://scholar.google.com/citations?user=6j4PcKUAAAAJ&hl=en", email: "loujain.gamal@aucegypt.edu",
        note: "MSc in Materials Science from EML" },
      { ...mk("Abdelrahman A. M. Ismail", "Alumni \u00b7 PhD Student @ Northeastern Univ.", ["Electrolyte Design","Energy Storage","Supercapacitors"], 24),
        photo: "team/abdelrahman-ismail.jpg",
        scholar: "https://scholar.google.com/citations?user=AMVB3HgAAAAJ&hl=ar", email: "ismail.abde@northeastern.edu",
        note: "MSc from EML \u2192 PhD at Northeastern University" },
    ],
  },
  {
    label: "Lab Manager",
    members: [
      { ...mk("Mohamed Salama", "Lab Manager", ["Lab Operations","Characterization","Equipment Management"], 15),
        photo: "team/mohamed-salama.jpg",
        email: "Mohsalama@aucegypt.edu",
        note: "Lab Manager at AUC EML" },
    ],
  },
];

const researchAreas = [
  "Solar Energy Conversion",
  "Green Hydrogen Production",
  "Supercapacitors & Batteries",
  "CO₂ Electroreduction",
  "Perovskite Solar Cells",
  "Photoelectrochemistry",
  "AI-Driven Materials Design",
  "Water Desalination",
  "Nanotechnology",
  "E-Waste Recycling",
  "Thermoelectrics",
  "Thin Film Deposition",
];

const projects = [
  {
    id: 1, icon: "⚡", color: "#1e4080", bg: "#dde8f5",
    title: "Electrochemical Water Splitting",
    tag: "Green Hydrogen",
    description: "We design and fabricate advanced nanostructured photoelectrodes for photoelectrochemical (PEC) water splitting to produce clean hydrogen. Our latest breakthrough demonstrated transparent Sn-decorated W-doped TiO₂ multiphase nanotube arrays (anatase/brookite/rutile) on FTO substrates as highly efficient solar-driven water splitting photocatalysts. We also computationally explore nitrogen-passivated germanium carbide nanomeshes as next-generation photocatalysts using DFT simulations.",
    highlights: ["Sn-decorated W-doped TiO₂ multiphase nanotubes","Transparent FTO-based photoanodes","DFT study of GeC nanomesh catalysts","Solar-to-hydrogen efficiency optimization"],
    keyPaper: "Transparent Sn-Decorated W-Doped TiO₂ Multiphase Nanotube Arrays as Efficient Photocatalysts for Solar-Driven Water Splitting — ACS Appl. Energy Mater. (2024)",
  },
  {
    id: 2, icon: "💧", color: "#0a6640", bg: "#d4f0e4",
    title: "Capacitive Deionization (CDI)",
    tag: "Water Desalination",
    description: "CDI is an energy-efficient electrochemical desalination technology for removing salt ions from brackish water. Our group develops high-performance porous carbon and composite electrodes. Our recent work demonstrated CDI electrodes fabricated from recycled zinc–carbon batteries achieving an exceptional salt adsorption capacity of 46.1 mg/g with 100% performance retention over 250 cycles — offering a sustainable solution for water treatment in water-scarce regions.",
    highlights: ["Recycled battery-derived CDI electrodes","Salt adsorption capacity: 46.1 mg/g","250+ cycles at 100% retention","Nitrate & heavy metal ion removal"],
    keyPaper: "Sustainable water capacitive deionization with recycled zinc–carbon battery electrodes — Desalination (2025)",
  },
  {
    id: 3, icon: "⚡", color: "#7a3a00", bg: "#fde8d4",
    title: "Electrode Supercapacitors",
    tag: "Energy Storage — Electrodes",
    description: "We design earth-abundant, high-surface-area electrode materials for supercapacitors including metal oxides, phosphates, sulfides, and bioderived carbons. Recent highlights include Ni-Co phosphate heterostructures with dual electrochromic functionality, bimetallic oxynitride electrodes achieving record energy densities, and asymmetric quasi-solid-state devices. Electrode fabrication and testing uses potentiostats, muffle furnaces, and electrospinning systems.",
    highlights: ["Ni-Co phosphate electrochromic electrodes","Bimetallic oxynitride electrode materials","Bioderived carbon composites","Asymmetric quasi-solid-state devices"],
    keyPaper: "Unleashing the Full Potential of Electrochromic Heterostructured Nickel–Cobalt Phosphate — ACS Applied Materials & Interfaces (2025)",
  },
  {
    id: 4, icon: "🧪", color: "#4a1e80", bg: "#e8e0f5",
    title: "Electrolyte Supercapacitors",
    tag: "Energy Storage — Electrolytes",
    description: "We engineer advanced electrolyte systems to maximize the voltage window, ionic conductivity, and safety of solid-state supercapacitor devices. Our group develops solid acid–dual salt hybrid electrolytes and novel self-regenerative, non-flammable hydrogel electrolytes with anti-freeze properties and intrinsic redox activity — enabling flexible, wearable, and cold-weather energy storage applications.",
    highlights: ["Self-regenerative non-flammable hydrogel electrolytes","Solid acid–dual salt hybrid electrolytes","Anti-freeze properties for cold climates","Broad electrochemical stability window"],
    keyPaper: "Novel Self-Regenerative and Non-Flammable High-Performance Hydrogel Electrolyte with Anti-Freeze Properties — EML (2025); Solid Acid–Dual Salt Hybrid Electrolyte Unlocks Broad Electrochemical Stability — ACS (Jul 2025)",
  },
  {
    id: 5, icon: "🌱", color: "#2d6a1a", bg: "#d4f5d8",
    title: "Electrochemical Nitrate & Nitrogen Reduction",
    tag: "Green Ammonia",
    description: "Nitrate contamination and green ammonia production are dual global challenges. Our group develops selective electrocatalysts for converting nitrate (NO₃⁻) to ammonia (NH₃) under ambient conditions. We engineer transition-metal spinels and nanostructured composites with high Faradaic efficiency, guided by computational DFT insights into reaction mechanisms and active site identification.",
    highlights: ["Selective NO₃⁻ → NH₃ at ambient conditions","Transition-metal spinel electrocatalysts","High Faradaic efficiency & selectivity","DFT-guided active site design"],
    keyPaper: "Electrochemical Nitrate Reduction to Ammonia Using Earth-Abundant Electrocatalysts — Sustainable Energy & Fuels (2024)",
  },
  {
    id: 6, icon: "♻️", color: "#5a1e70", bg: "#f0e4f5",
    title: "CO₂ Electroreduction Reaction",
    tag: "Carbon Utilization",
    description: "We develop electrocatalysts for converting CO₂ into value-added products. Our work on pyramidal dilute Sn–Cu alloy catalysts demonstrated superior C–C coupling selectivity for ethanol and ethylene production. We also develop dual-functional Power-to-X systems that simultaneously capture and convert CO₂. DFT and MD simulations reveal reaction pathways at the atomic level, guiding experimental catalyst design.",
    highlights: ["Pyramidal Sn–Cu alloy for C–C coupling tuning","Dual-function CO₂ capture & conversion","Value-added products: CO, formate, ethanol","DFT + MD mechanistic studies"],
    keyPaper: "Tuning C–C Coupling via Pyramidal Dilute Sn–Cu Alloy — ACS Applied Materials & Interfaces (2025)",
  },
  {
    id: 7, icon: "🖥️", color: "#1a2080", bg: "#d4d8f5",
    title: "Computational Research (DFT & MD)",
    tag: "Theory & Simulation",
    description: "Our computational subgroup uses Density Functional Theory (DFT) and Molecular Dynamics (MD) simulations to design new materials before synthesis. We model electronic structures, adsorption energies, reaction pathways, and defect states for catalysts, electrodes, and photoelectrodes. Recent DFT work includes nitrogen-passivated GeC nanomesh photocatalysts for water splitting, electrolyte interface dynamics for supercapacitors, and CO₂ reduction reaction pathway mapping.",
    highlights: ["DFT+U for transition metal oxides & spinels","MD of electrolyte interfaces in supercapacitors","GeC nanomesh for photocatalytic water splitting","AI-assisted materials screening"],
    keyPaper: "Nitrogen-Passivated GeC Nanomeshes as Photocatalysts for Water Splitting — EML (2025); The DFT+U: Approaches, Accuracy, and Applications — InTech (2018)",
  },
  {
    id: 8, icon: "☀️", color: "#7a5000", bg: "#fef3d7",
    title: "UV-Shielding Materials",
    tag: "Photoprotection",
    description: "We engineer nanocomposite membranes for UV and blue light shielding in cosmetics, coatings, and optoelectronics. PMMA/PVDF nanocomposite membranes embedded with ultralow-loading Co₂VO₄ nanoparticles achieve comprehensive UV and blue light attenuation. Cellulose acetate/cerium vanadate composite membranes with tunable shielding capabilities are also explored, supported by DFT calculations.",
    highlights: ["PMMA/PVDF + Co₂VO₄ UV-shielding membranes","Cellulose acetate/CeVO₄ nanocomposites","Broad-spectrum UV + blue light attenuation","Transparent, flexible, cosmetics-compatible"],
    keyPaper: "Ultralow-Loading Co₂VO₄ in PMMA/PVDF for UV & Blue Light Attenuation — ACS Omega (2026); Recycled CA/CeVO₄ UV-Shielding Membranes — ACS Appl. Polym. Mater. (2024)",
  },
  {
    id: 9, icon: "🌡️", color: "#801a1a", bg: "#f5d4d4",
    title: "Thermoelectric Energy Harvesting",
    tag: "Waste Heat Recovery",
    description: "Thermoelectric generators (TEGs) convert waste heat directly into electricity. We develop nanostructured thermoelectric materials maximizing the figure of merit (ZT) by enhancing the Seebeck coefficient and suppressing thermal conductivity. Our research targets earth-abundant, non-toxic materials for low-to-medium temperature waste heat recovery in industrial and wearable applications, supported by both experimental characterization and computational modeling.",
    highlights: ["High ZT nanostructured thermoelectric materials","Low-to-medium temperature TEG optimization","Seebeck coefficient engineering","Industrial waste heat recovery applications"],
    keyPaper: "Thermoelectric characterization and device optimization — EML ongoing research",
  },
  {
    id: 10, icon: "🔄", color: "#406020", bg: "#d4f5d8",
    title: "Battery Recycling",
    tag: "E-Waste & Sustainability",
    description: "With millions of batteries discarded annually, we recover valuable materials from spent Li-ion and zinc–carbon batteries and upcycle them into high-performance electrodes. Recycled battery materials produce hydrogel electrolytes and supercapacitor electrodes with exceptional stability. Our top-cited paper (Wiley Top Cited 2020–21) showed asymmetric supercapacitors built from recycled Li-ion battery materials, and our CDI work uses recycled zinc–carbon battery electrodes for water desalination.",
    highlights: ["Li-ion & Zn–C battery material recovery","Recycled electrodes for supercapacitors & CDI","Wiley Top Cited Article 2020–21","Circular economy solution for e-waste"],
    keyPaper: "Asymmetric Solid-State Supercapacitors from Recycled Li-ion Batteries — Energy & Fuels (2024)",
  },
  {
    id: 11, icon: "🧬", color: "#1a5a70", bg: "#d4eef5",
    title: "Biology & Biomedical Applications",
    tag: "Biomedical",
    description: "We apply nanomaterial synthesis expertise to biomedical challenges, developing nanostructured materials for targeted cancer treatment, drug delivery, and wound healing. Electrospun nanofibers serve as drug-loading scaffolds for chronic wound healing, combining polymer science with controlled drug release. Nanostructured drug delivery systems enable selective tumor targeting for cancer nanomedicine.",
    highlights: ["Targeted cancer nanomedicine","Electrospun nanofiber wound healing scaffolds","Controlled drug release systems","Biocompatible nanocoatings"],
    keyPaper: "Nanofibers as Drug Scaffolds for Chronic Wound Healing — EML ongoing; Ni-free nanotubular drug eluting stents — Materials Science & Engineering C (2019)",
  },
  {
    id: 12, icon: "🌿", color: "#2d5a1a", bg: "#d4f0d4",
    title: "Biogas Production",
    tag: "Renewable Energy",
    description: "We engineer nanoparticle additives to enhance anaerobic digestion (AD) of organic waste for sustainable biogas production. Our work demonstrated that iron nanoparticles fabricated from industrial slag waste significantly boost biogas output from cow manure, achieving structural and catalytic parity with expensive laboratory-grade nanoparticles. We also recovered trimetallic Sn–Mn–Fe nanoparticles from electronic waste (printed circuit boards) and used them to enhance biogas quality — killing two birds with one stone: e-waste remediation and renewable fuel generation. Nanocomposite formulations combining metal enzyme cofactors, conductive carbon materials, and DIET activators are also investigated to maximize methane yields from agricultural waste.",
    highlights: ["Iron NPs from industrial slag for biogas enhancement","Trimetallic Sn–Mn–Fe NPs from e-waste for AD","Nanocomposites boosting methane yield from cattle manure","Sustainable win–win: e-waste recycling + biofuel generation"],
    keyPaper: "Optimizing Biogas Production with Recycled Iron Nanoparticles — Fuel (2025); Production of High-Quality Biogas Using Recycled Trimetallic NPs from Electronic Waste — Sustainable Energy & Fuels (2023); Innovative Nanocomposite Formulations for Enhancing Biogas — Bioresource Technology (2020)",
  },
];

function useIntersect() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function EMLLogo({ size = "nav" }) {
  const h = size === "nav" ? 44 : 54;
  return (
    <img
      src={`${import.meta.env.BASE_URL}EML_logo.png`}
      alt="Energy Materials Laboratory"
      style={{ height: h, objectFit: "contain",
        filter: "brightness(10) saturate(0.8) sepia(0.3)" }}
    />
  );
}

function AUCLogo() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}AUC_logo.png`}
      alt="The American University in Cairo"
      style={{ height: 36, objectFit: "contain",
        filter: "brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(1.8)" }}
      onError={e => { e.target.style.display = "none"; }}
    />
  );
}

// 2026 papers — always shown at the top regardless of API
// ── KNOWN PATENTS (always shown, user can add more) ───────────────────────
const DEFAULT_PATENTS = [
  { number: "US11795521B2", title: "Extraction of Iron (III) Oxide from Different Iron-Containing Ores", inventors: "Nageh K. Allam, Mahmoud M. Aly", assignee: "The American University in Cairo", filed: "2018", status: "Granted", url: "https://patents.google.com/patent/US11795521B2/en" },
  { number: "US App.", title: "Hydrogel Electrolyte Composition for Energy Storage Devices with Anti-Freeze and Non-Flammable Properties", inventors: "Nageh K. Allam, Abdelrahman A. M. Ismail", assignee: "The American University in Cairo", filed: "2023", status: "Pending", url: "" },
  { number: "US Prov. 62/262743", title: "Sub 100 nm Oxidized Transition Metal Tubular Architectures", inventors: "Menna Samir, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2016", status: "Provisional", url: "" },
  { number: "US Prov. 62/262685", title: "Ti-based Functional Nanoarchitectures as Drug Eluting Stents", inventors: "Yomna E. Saleh, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2016", status: "Provisional", url: "" },
  { number: "US Prov. 61/985504", title: "Efficient Charge Separation in Self-Assembled Nanostructured Photoanodes with Staggered Bandgap for Solar Energy Conversion", inventors: "R. Nashed, P. Szymanski, M. A. El-Sayed, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2014", status: "Provisional", url: "" },
  { number: "US Prov. 62/457533", title: "Magnetolysis — Electrochemical Water Splitting Using Magnetic Fields", inventors: "Hady Soliman, Mohamed Shokeir, Sandy El Moghazi, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2017", status: "Provisional", url: "" },
  { number: "US Prov. 62/509432", title: "Extraction of Iron (III) Oxide From Different Iron-Containing Ores (Provisional)", inventors: "Mahmoud A. Aly, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2017", status: "Provisional", url: "" },
];

// ── 2026 HARDCODED PAPERS — always shown ──────────────────────────────────
const papers2026 = [
  { year: 2026, citationCount: 6, title: "Artificial Intelligence-Driven Materials Design for Next-Generation Sustainable Energy Technologies", authors: [{ name: "SM Fawzy" }, { name: "MK M. Ali" }, { name: "Nageh K. Allam" }], venue: "ACS Sustainable Chemistry & Engineering 14, 4745–4761", externalIds: { DOI: "10.1021/acssuschemeng.6c01084" } },
  { year: 2026, citationCount: 0, title: "Multiscale Thermoelectric Transport: Bridging Quantum Mechanics to Macroscopic Systems Through the Landauer-Boltzmann Paradigm", authors: [{ name: "MI Abdelaziz" }, { name: "SA Eldib" }, { name: "Nageh K. Allam" }], venue: "Journal of Materials Chemistry A", externalIds: {} },
  { year: 2026, citationCount: 0, title: "Ultrathin MoS₂-Decorated N-Doped Carbon with Hierarchical Porosity for High-Capacity, Low-Energy Capacitive Deionization", authors: [{ name: "MA Ghanem" }, { name: "MM Taha" }, { name: "Nageh K. Allam" }], venue: "Journal of Materials Chemistry A", externalIds: {} },
  { year: 2026, citationCount: 0, title: "Engineering reline/carboxymethyl cellulose eutectogel electrolytes through nanoscale water confinement", authors: [{ name: "AA Akar" }, { name: "MA Moselhy" }, { name: "GE Khedr" }, { name: "E Yousef" }, { name: "Nageh K. Allam" }], venue: "Chemical Engineering Journal 537, 176245", externalIds: {} },
  { year: 2026, citationCount: 1, title: "Hierarchical aerogel-confined deep eutectic electrolytes with complete water immobilization for freeze-tolerant supercapacitors", authors: [{ name: "MA Moselhy" }, { name: "GE Khedr" }, { name: "E Yousef" }, { name: "AA Akar" }, { name: "Nageh K. Allam" }], venue: "Journal of Materials Chemistry A", externalIds: {} },
  { year: 2026, citationCount: 0, title: "Morphological and structural evolution of time-engineered Co-Fe bimetallic redox systems for high-performance hybrid supercapacitors", authors: [{ name: "HM El Sharkawy" }, { name: "AM Mohamed" }, { name: "Nageh K. Allam" }], venue: "Electrochimica Acta 570, 148940", externalIds: {} },
  { year: 2026, citationCount: 4, title: "Machine Learning Guidelines for Designing Next-Generation Nanocomposite Membranes for CO₂ Capture", authors: [{ name: "D Sallam" }, { name: "BS Shaheen" }, { name: "Nageh K. Allam" }], venue: "Green Chemistry 28, 1286–1315", externalIds: {} },
  { year: 2026, citationCount: 3, title: "Polymerizable Acrylamide-Based Deep Eutectic Solvents for Flexible Thermoelectric Devices", authors: [{ name: "SAS Eldib" }, { name: "MIM Abdelaziz" }, { name: "GE Khedr" }, { name: "HN Akl" }, { name: "Nageh K. Allam" }], venue: "ACS Applied Engineering Materials 4, 1551–1560", externalIds: {} },
  { year: 2026, citationCount: 1, title: "Synergistic structural and electrochemical engineering of NiFe₂O₄ spinel cathodes for sustainable water capacitive deionization", authors: [{ name: "RA Hassan" }, { name: "MM Taha" }, { name: "Nageh K. Allam" }], venue: "Separation and Purification Technology 384, 136353", externalIds: {} },
  { year: 2026, citationCount: 3, title: "Biomimetic CsCl: EG/PVA–NaOH eutectogels for high-performance ionic thermoelectrics", authors: [{ name: "MIM Abdelaziz" }, { name: "SAS Eldib" }, { name: "GE Khedr" }, { name: "Nageh K. Allam" }], venue: "Journal of Materials Chemistry A", externalIds: {} },
  { year: 2026, citationCount: 0, title: "Integrated CO₂ Capture and Conversion: Dual-Functional Materials, Mechanisms, and Pathways to Industrial Decarbonization", authors: [{ name: "MA Elokl" }, { name: "AG Ali" }, { name: "AM Abdelmohsen" }, { name: "Nageh K. Allam" }], venue: "EES Catalysis (RSC Publishing)", externalIds: { DOI: "10.1039/d5ey00322a" } },
  { year: 2026, citationCount: 0, title: "Ultralow-Loading Co₂VO₄ Nanoparticles Embedded in PMMA/PVDF Nanocomposite Membranes for UV and Blue Light Attenuation", authors: [{ name: "Esraa Mourad" }, { name: "GE Khedr" }, { name: "Nageh K. Allam" }], venue: "ACS Omega", externalIds: { DOI: "10.1021/acsomega.5c11512" } },
];

const AUTHOR_ID = "8643365";
const SCHOLAR_URL = "https://scholar.google.com/citations?user=18v00ZIAAAAJ&hl=en&sortby=pubdate";
const SCHOLAR_PATENTS_URL = "https://patents.google.com/patent/search?inventor=Nageh+Allam&assignee=American+University+Cairo";

async function fetchPapers() {
  const base = `https://api.semanticscholar.org/graph/v1/author/${AUTHOR_ID}/papers?fields=title,year,authors,venue,externalIds,citationCount,openAccessPdf&limit=200`;
  const proxies = [
    base,
    `https://corsproxy.io/?url=${encodeURIComponent(base)}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(base)}`,
  ];
  for (const url of proxies) {
    try {
      const r = await fetch(url, { headers: { Accept: "application/json" } });
      if (!r.ok) continue;
      const raw = await r.json();
      const data = raw.contents ? JSON.parse(raw.contents) : raw;
      const papers = (data.data || []).filter(p => p.year && p.title).sort((a, b) => (b.year || 0) - (a.year || 0));
      if (papers.length > 0) return papers;
    } catch { continue; }
  }
  throw new Error("All endpoints failed");
}

// ── PUBLICATIONS SECTION ───────────────────────────────────────────────────
function PublicationsSection() {
  const { editOn, extraPapers, setExtraPapers } = useContext(EditContext);
  const [papers, setPapers] = useState(papers2026);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [addPubOpen, setAddPubOpen] = useState(false);
  const [pubForm, setPubForm] = useState({ title: "", authors: "", venue: "", year: new Date().getFullYear().toString(), doi: "" });

  useEffect(() => {
    // Cache key with today's date — refreshes daily
    const today = new Date().toISOString().slice(0, 10);
    const cacheKey = `eml_papers_${today}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { merged, ts } = JSON.parse(cached);
        setPapers(merged);
        setLastUpdated(new Date(ts));
        return;
      } catch {}
    }
    fetchPapers()
      .then(fetched => {
        const fetchedFiltered = fetched.filter(p =>
          !papers2026.some(p26 => p.title.toLowerCase().slice(0, 40) === p26.title.toLowerCase().slice(0, 40))
        );
        const merged = [...papers2026, ...fetchedFiltered];
        const ts = Date.now();
        sessionStorage.setItem(cacheKey, JSON.stringify({ merged, ts }));
        // Clean old cache keys
        Object.keys(sessionStorage).filter(k => k.startsWith("eml_papers_") && k !== cacheKey).forEach(k => sessionStorage.removeItem(k));
        setPapers(merged);
        setLastUpdated(new Date(ts));
      })
      .catch(() => setPapers(papers2026));
  }, []);

  const allPapers = [...extraPapers, ...papers];
  const filtered = allPapers.filter(p =>
    !search ? true :
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.venue || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.authors || []).some(a => a.name.toLowerCase().includes(search.toLowerCase()))
  );
  const visible = showAll ? filtered : filtered.slice(0, 12);

  const addPublication = () => {
    if (!pubForm.title.trim()) return;
    setExtraPapers(prev => [{ year: parseInt(pubForm.year) || new Date().getFullYear(), citationCount: 0, title: pubForm.title, authors: pubForm.authors.split(",").map(a => ({ name: a.trim() })), venue: pubForm.venue, externalIds: pubForm.doi ? { DOI: pubForm.doi } : {}, openAccessPdf: null }, ...prev]);
    setPubForm({ title: "", authors: "", venue: "", year: new Date().getFullYear().toString(), doi: "" });
    setAddPubOpen(false);
  };

  return (
    <>
      {/* Status bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#d4f0e4", color: "#1a6a3a", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontFamily: "Space Mono", fontWeight: 700, letterSpacing: "0.08em" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1a6a3a", animation: "pulse 2s infinite", display: "inline-block" }} />
          LIVE · DAILY UPDATE
        </div>
        <span style={{ fontSize: 12, color: "#8a9ab0" }}>
          {papers.length} publications · Semantic Scholar
          {lastUpdated && ` · Updated ${lastUpdated.toLocaleDateString()}`}
        </span>
        <a href={SCHOLAR_URL} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#1e4080", fontFamily: "Space Mono", textDecoration: "none", marginLeft: "auto", letterSpacing: "0.06em" }}>
          Google Scholar ↗
        </a>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      {/* Search */}
      <div className="search-bar fade" style={{ marginBottom: 20 }}>
        <input className="search-input" placeholder="Search by title, author, or journal…" value={search} onChange={e => { setSearch(e.target.value); setShowAll(false); }} />
        {search && <button onClick={() => setSearch("")} style={{ padding: "0 14px", border: "1px solid #d0d8e8", background: "#f4f6fa", cursor: "pointer", color: "#8a9ab0", fontSize: 18 }}>×</button>}
      </div>

      {/* Papers list */}
      <div className="pub-list">
        {visible.length === 0
          ? <p style={{ padding: "24px", color: "#8a9ab0", fontSize: 14 }}>No papers match your search.</p>
          : visible.map((p, i) => {
            const doi = p.externalIds?.DOI;
            const arxiv = p.externalIds?.ArXiv;
            const pdfUrl = p.openAccessPdf?.url;
            const url = doi ? `https://doi.org/${doi}` : arxiv ? `https://arxiv.org/abs/${arxiv}` : null;
            const authorNames = (p.authors || []).map(a => a.name);
            return (
              <div key={i} className="pub-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div className="pub-year mono">{p.year}</div>
                  {p.citationCount > 0 && (
                    <div style={{ fontSize: 10, fontFamily: "Space Mono", color: "#f0b429", background: "rgba(240,180,41,0.1)", padding: "2px 8px", borderRadius: 20, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {p.citationCount} citations
                    </div>
                  )}
                </div>
                <p className="pub-title serif">{url
                  ? <a href={url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }} onMouseOver={e => e.target.style.color="#1e4080"} onMouseOut={e => e.target.style.color="inherit"}>{p.title}</a>
                  : p.title}
                </p>
                <p className="pub-authors">
                  {authorNames.map((a, j) => (
                    <span key={j}><span style={a.includes("Allam") ? { fontWeight: 700, color: "#1e4080" } : {}}>{a}</span>{j < authorNames.length - 1 && ", "}</span>
                  ))}
                </p>
                {p.venue && <span className="pub-venue">{p.venue}</span>}
                <div className="pub-tags">
                  {url && <a href={url} target="_blank" rel="noreferrer" className="pub-tag">DOI</a>}
                  {pdfUrl && <a href={pdfUrl} target="_blank" rel="noreferrer" className="pub-tag">PDF</a>}
                  {arxiv && <a href={`https://arxiv.org/abs/${arxiv}`} target="_blank" rel="noreferrer" className="pub-tag">arXiv</a>}
                </div>
              </div>
            );
          })
        }
      </div>

      {/* Show more */}
      <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        {filtered.length > 12 && (
          <button onClick={() => setShowAll(!showAll)} style={{ background: "none", border: "1px solid #1e4080", color: "#1e4080", padding: "8px 20px", fontSize: 12, fontFamily: "Space Mono", cursor: "pointer", letterSpacing: "0.08em" }}>
            {showAll ? "SHOW LESS ↑" : `SHOW ALL ${filtered.length} PAPERS ↓`}
          </button>
        )}
        <a href={SCHOLAR_URL} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontFamily: "Space Mono", color: "#8a9ab0", textDecoration: "none" }}>Full list on Google Scholar →</a>
      </div>

      {/* Add Publication — edit mode only */}
      {editOn && (
        <div style={{ marginTop: 20 }}>
          {!addPubOpen ? (
            <button onClick={() => setAddPubOpen(true)} style={{ width: "100%", padding: "12px", border: "2px dashed rgba(240,180,41,0.6)", background: "rgba(240,180,41,0.05)", color: "#f0b429", fontFamily: "Space Mono", fontSize: 11, letterSpacing: "0.12em", cursor: "pointer", textTransform: "uppercase", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>＋ Add Publication Manually</button>
          ) : (
            <div style={{ border: "1px solid #f0b429", background: "#f8f6f2", padding: "20px 24px", borderRadius: 2 }}>
              <p style={{ fontSize: 12, fontFamily: "Space Mono", color: "#1e4080", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase", fontWeight: 700 }}>＋ Add Publication</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", marginBottom: 14 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 11, color: "#4a6080", fontFamily: "Space Mono", display: "block", marginBottom: 4 }}>Title *</label>
                  <input value={pubForm.title} onChange={e => setPubForm(f => ({ ...f, title: e.target.value }))} placeholder="Full paper title" style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #d0d8e8", fontFamily: "Outfit, sans-serif", outline: "none", borderRadius: 2, boxSizing: "border-box", background: "white" }} />
                </div>
                {[["Authors *", "authors", "A. Author, B. Author, NK Allam"], ["Journal / Venue *", "venue", "e.g. ACS Applied Materials"], ["Year *", "year", "e.g. 2026"], ["DOI (optional)", "doi", "e.g. 10.1021/..."]].map(([label, key, ph]) => (
                  <div key={key}>
                    <label style={{ fontSize: 11, color: "#4a6080", fontFamily: "Space Mono", display: "block", marginBottom: 4 }}>{label}</label>
                    <input value={pubForm[key]} onChange={e => setPubForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #d0d8e8", fontFamily: "Outfit, sans-serif", outline: "none", borderRadius: 2, boxSizing: "border-box", background: "white" }} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addPublication} style={{ padding: "8px 20px", background: "#1e4080", color: "white", border: "none", fontFamily: "Space Mono", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>Add Paper</button>
                <button onClick={() => setAddPubOpen(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #d0d8e8", color: "#8a9ab0", fontFamily: "Space Mono", fontSize: 11, cursor: "pointer", borderRadius: 2 }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ── PATENTS SECTION ────────────────────────────────────────────────────────
function PatentsSection({ editOn, initialPatents }) {
  const [patents, setPatents] = useState(initialPatents || DEFAULT_PATENTS);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ number: "", title: "", inventors: "", assignee: "The American University in Cairo", filed: new Date().getFullYear().toString(), status: "Provisional", url: "" });

  const savePatents = (list) => {
    setPatents(list);
  };

  const addPatent = () => {
    if (!form.title.trim()) return;
    savePatents([form, ...patents]);
    setForm({ number: "", title: "", inventors: "", assignee: "The American University in Cairo", filed: new Date().getFullYear().toString(), status: "Provisional", url: "" });
    setAddOpen(false);
  };

  const removePatent = (i) => savePatents(patents.filter((_, idx) => idx !== i));

  return (
    <section id="patents" style={{ background: "#f4f6fa" }}>
      <div className="section">
        <div className="fade">
          <p className="section-label mono">Intellectual Property</p>
          <h2 className="section-title serif">Patents &amp; Inventions</h2>
        </div>

        {/* Status bar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dde8f5", color: "#1e4080", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontFamily: "Space Mono", fontWeight: 700, letterSpacing: "0.08em" }}>
            📋 {patents.length} PATENTS
          </div>
          <a href={SCHOLAR_PATENTS_URL} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#1e4080", fontFamily: "Space Mono", textDecoration: "none", marginLeft: "auto" }}>
            Search Google Patents ↗
          </a>
        </div>

        {/* Patent list */}
        <div className="fade" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {patents.map((p, i) => (
            <div key={i} style={{ padding: "22px 28px", background: "white", border: "1px solid #d0d8e8", borderTop: i === 0 ? "1px solid #d0d8e8" : "none", display: "flex", gap: 20, alignItems: "flex-start", transition: "all 0.2s", cursor: "default", position: "relative" }}
              onMouseOver={e => { e.currentTarget.style.background="#f0f4ff"; e.currentTarget.style.borderLeft="3px solid #1e4080"; e.currentTarget.style.paddingLeft="25px"; }}
              onMouseOut={e => { e.currentTarget.style.background="white"; e.currentTarget.style.borderLeft=""; e.currentTarget.style.paddingLeft="28px"; }}>
              <div style={{ flexShrink: 0, width: 40, height: 40, background: "#edf0f7", border: "1px solid #d0d8e8", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2, marginTop: 2 }}>
                <span style={{ fontSize: 20 }}>📋</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 7, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 10, fontFamily: "Space Mono", fontWeight: 700, letterSpacing: "0.08em", padding: "2px 9px", borderRadius: 20, background: p.status === "Granted" ? "#d4f0e4" : p.status === "Pending" ? "#fef3d7" : "#dde8f5", color: p.status === "Granted" ? "#1a6a3a" : p.status === "Pending" ? "#7a5000" : "#1e4080" }}>{p.status.toUpperCase()}</span>
                  <span style={{ fontSize: 10, fontFamily: "Space Mono", color: "#8a9ab0" }}>{p.number}</span>
                  <span style={{ fontSize: 10, fontFamily: "Space Mono", color: "#f0b429" }}>Filed {p.filed}</span>
                </div>
                <p style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 15, color: "#0a162e", lineHeight: 1.4, marginBottom: 7 }}>
                  {p.url ? <a href={p.url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }} onMouseOver={e => e.target.style.color="#1e4080"} onMouseOut={e => e.target.style.color="inherit"}>{p.title}</a> : p.title}
                </p>
                <p style={{ fontSize: 12, color: "#4a6080", marginBottom: 3 }}><span style={{ color: "#1e4080", fontWeight: 600 }}>Inventors: </span>{p.inventors}</p>
                <p style={{ fontSize: 11, color: "#8a9ab0", fontFamily: "Space Mono" }}>{p.assignee}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, alignItems: "flex-end" }}>
                {p.url && <a href={p.url} target="_blank" rel="noreferrer" style={{ fontSize: 10, fontFamily: "Space Mono", color: "#1e4080", border: "1px solid #d0d8e8", padding: "4px 10px", textDecoration: "none", whiteSpace: "nowrap" }} onMouseOver={e => { e.currentTarget.style.background="#1e4080"; e.currentTarget.style.color="white"; }} onMouseOut={e => { e.currentTarget.style.background=""; e.currentTarget.style.color="#1e4080"; }}>View ↗</a>}
                {editOn && <button onClick={() => removePatent(i)} style={{ fontSize: 9, color: "#e05555", background: "none", border: "1px solid #e05555", cursor: "pointer", padding: "3px 8px", fontFamily: "Space Mono" }}>✕ Remove</button>}
              </div>
            </div>
          ))}
        </div>

        {/* Add Patent button */}
        <div style={{ marginTop: 16 }}>
          {editOn && !addOpen && (
            <button onClick={() => setAddOpen(true)} style={{ width: "100%", padding: "12px", border: "2px dashed rgba(30,64,128,0.4)", background: "rgba(30,64,128,0.03)", color: "#1e4080", fontFamily: "Space Mono", fontSize: 11, letterSpacing: "0.12em", cursor: "pointer", textTransform: "uppercase", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 12 }}>＋ Add New Patent</button>
          )}
          {editOn && addOpen && (
            <div style={{ border: "1px solid #1e4080", background: "#f0f4ff", padding: "20px 24px", borderRadius: 2, marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontFamily: "Space Mono", color: "#1e4080", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase", fontWeight: 700 }}>＋ Add Patent</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", marginBottom: 14 }}>
                {[
                  ["Title *", "title", "Full patent title", true],
                  ["Patent Number", "number", "e.g. US11795521B2", false],
                  ["Inventors *", "inventors", "A. Name, B. Name, NK Allam", false],
                  ["Assignee", "assignee", "The American University in Cairo", false],
                  ["Filed Year", "filed", "e.g. 2024", false],
                  ["Google Patents URL", "url", "https://patents.google.com/patent/...", false],
                ].map(([label, key, ph, full]) => (
                  <div key={key} style={full ? { gridColumn: "1 / -1" } : {}}>
                    <label style={{ fontSize: 11, color: "#4a6080", fontFamily: "Space Mono", display: "block", marginBottom: 4 }}>{label}</label>
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #d0d8e8", fontFamily: "Outfit, sans-serif", outline: "none", borderRadius: 2, boxSizing: "border-box", background: "white" }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, color: "#4a6080", fontFamily: "Space Mono", display: "block", marginBottom: 4 }}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #d0d8e8", fontFamily: "Outfit, sans-serif", outline: "none", borderRadius: 2, background: "white" }}>
                    <option>Provisional</option>
                    <option>Pending</option>
                    <option>Granted</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={addPatent} style={{ padding: "8px 20px", background: "#1e4080", color: "white", border: "none", fontFamily: "Space Mono", fontSize: 11, cursor: "pointer", borderRadius: 2 }}>Add Patent</button>
                <button onClick={() => setAddOpen(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #d0d8e8", color: "#8a9ab0", fontFamily: "Space Mono", fontSize: 11, cursor: "pointer", borderRadius: 2 }}>Cancel</button>
              </div>
            </div>
          )}
          <a href={SCHOLAR_PATENTS_URL} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontFamily: "Space Mono", color: "#8a9ab0", textDecoration: "none" }}>
            Search all patents on Google Patents →
          </a>
        </div>
      </div>
    </section>
  );
}




// ── EDIT CONTEXT — shared state across all components ─────────────────────
const EditContext = React.createContext({ editOn: false, openCropForMember: null, setMemberOverrides: null, extraPapers: [], setExtraPapers: null, textEdits: {}, setTextEdits: null });

const ADMIN_HASH = "da25c5b5903cfd4b93885fe8a67aed43e871cc8b5cad8eb95988e49cb16da8d9";

async function checkPassword(pw) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pw));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("") === ADMIN_HASH;
}

// Add Member Form — appears at bottom of each group in edit mode
function AddMemberForm({ groupLabel, onAdd }) {
  const { editOn } = useContext(EditContext);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", note: "", interests: "", email: "", scholar: "" });
  const [imgSrc, setImgSrc] = useState(null);

  if (!editOn) return null;

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImgSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const initials = form.name.replace(/^(Dr\.|Prof\.)\s+/, "").split(" ")
      .filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const colors = [["#dde8f5","#1e4080"],["#fef3d7","#7a5000"],["#d4f0e4","#1a6a3a"],["#f5dde8","#7a1e48"],["#e8e0f5","#4a1e80"],["#fde8d4","#8a3a10"]];
    const [bg, color] = colors[Math.floor(Math.random() * colors.length)];
    onAdd({
      name: form.name, role: form.role || "Researcher",
      initials, bg, color, note: form.note,
      interests: form.interests.split(",").map(s => s.trim()).filter(Boolean),
      email: form.email, scholar: form.scholar,
      photo: imgSrc || null, _isDataUrl: !!imgSrc,
    });
    setForm({ name: "", role: "", note: "", interests: "", email: "", scholar: "" });
    setImgSrc(null);
    setOpen(false);
  };

  return (
    <div style={{ marginTop: 12 }}>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{
          width: "100%", padding: "12px", border: "2px dashed rgba(240,180,41,0.6)",
          background: "rgba(240,180,41,0.05)", color: "#f0b429",
          fontFamily: "Space Mono", fontSize: 11, letterSpacing: "0.12em",
          cursor: "pointer", textTransform: "uppercase", borderRadius: 2, transition: "all 0.2s",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}
        onMouseOver={e => { e.currentTarget.style.background = "rgba(240,180,41,0.12)"; }}
        onMouseOut={e => { e.currentTarget.style.background = "rgba(240,180,41,0.05)"; }}
        >＋ Add Member to {groupLabel}</button>
      ) : (
        <div style={{ border: "1px solid #f0b429", background: "#f8f6f2", padding: "20px 24px", borderRadius: 2 }}>
          <p style={{ fontSize: 12, fontFamily: "Space Mono", color: "#1e4080", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase", fontWeight: 700 }}>
            ＋ New Member — {groupLabel}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", marginBottom: 12 }}>
            {[
              ["Full Name *", "name", "e.g. Ahmed Mohamed"],
              ["Role / Position *", "role", "e.g. PhD Student"],
              ["Short Note", "note", "e.g. TA at AUC — Water Splitting"],
              ["Research Interests", "interests", "Comma separated: CO₂, DFT"],
              ["Email", "email", "e.g. name@aucegypt.edu"],
              ["Google Scholar URL", "scholar", "https://scholar.google.com/..."],
            ].map(([label, key, placeholder]) => (
              <div key={key}>
                <label style={{ fontSize: 11, color: "#4a6080", fontFamily: "Space Mono", display: "block", marginBottom: 4 }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #d0d8e8", fontFamily: "Outfit, sans-serif", outline: "none", borderRadius: 2, boxSizing: "border-box", background: "white" }} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "#4a6080", fontFamily: "Space Mono", display: "block", marginBottom: 6 }}>Photo (optional)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {imgSrc && <img src={imgSrc} alt="preview" style={{ width: 60, height: 60, objectFit: "cover", objectPosition: "top", borderRadius: 2, border: "1px solid #d0d8e8" }} />}
              <label style={{ display: "inline-block", padding: "7px 16px", cursor: "pointer", border: "1px solid #1e4080", color: "#1e4080", fontSize: 12, fontFamily: "Space Mono", borderRadius: 2, background: "white" }}>
                {imgSrc ? "Change Photo" : "Upload Photo"}
                <input type="file" accept="image/*" onChange={handleImg} style={{ display: "none" }} />
              </label>
              {imgSrc && <button onClick={() => setImgSrc(null)} style={{ fontSize: 11, color: "#e05555", background: "none", border: "none", cursor: "pointer", fontFamily: "Space Mono" }}>Remove</button>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} style={{ padding: "8px 20px", background: "#1e4080", color: "white", border: "none", fontFamily: "Space Mono", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", borderRadius: 2 }}>Add Member</button>
            <button onClick={() => setOpen(false)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #d0d8e8", color: "#8a9ab0", fontFamily: "Space Mono", fontSize: 11, cursor: "pointer", borderRadius: 2 }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── IMAGE CROP TOOL ────────────────────────────────────────────────────────
function ImageCropTool({ src, name, onSave, onClose, onUploadNew }) {
  const imgRef = React.useRef(null);
  const [cropX, setCropX] = useState(50);
  const [cropY, setCropY] = useState(20);
  const [zoom, setZoom]   = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast]     = useState(100);
  const [previewUrl, setPreviewUrl] = useState(null);

  const preview = () => {
    const img = imgRef.current;
    if (!img || !img.complete) return null;
    const { naturalWidth: nw, naturalHeight: nh } = img;
    const OUT = 400;
    const scale = zoom / 100;
    // visible region size in natural pixels
    const viewW = nw / scale;
    const viewH = nh / scale;
    // anchor point: cropX% across, cropY% down
    const sx = (nw * cropX / 100) - viewW / 2;
    const sy = (nh * cropY / 100) - viewH / 2;
    // clamp
    const csx = Math.max(0, Math.min(nw - viewW, sx));
    const csy = Math.max(0, Math.min(nh - viewH, sy));
    const csw = Math.min(viewW, nw - csx);
    const csh = Math.min(viewH, nh - csy);
    const canvas = document.createElement("canvas");
    canvas.width = OUT; canvas.height = OUT;
    const ctx = canvas.getContext("2d");
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(img, csx, csy, csw, csh, 0, 0, OUT, OUT);
    return canvas.toDataURL("image/jpeg", 0.92);
  };

  const updatePreview = () => { const d = preview(); if (d) setPreviewUrl(d); };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 20000, background: "rgba(0,0,0,0.94)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#0d1d38", border: "1px solid #f0b429", padding: 24, width: 560, borderRadius: 4, maxHeight: "95vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ fontSize: 15, color: "#f0b429", fontFamily: "Space Mono", fontWeight: 700 }}>✂ Edit Photo — {name}</p>
          <button onClick={onClose} style={{ background: "none", border: "1px solid #444", color: "#888", padding: "3px 10px", cursor: "pointer", fontFamily: "Space Mono", fontSize: 11 }}>✕</button>
        </div>

        {/* Upload new photo button */}
        <label style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          width: "100%", padding: "9px 0", marginBottom: 14,
          border: "1px dashed rgba(240,180,41,0.5)", color: "#f0b429",
          fontFamily: "Space Mono", fontSize: 11, cursor: "pointer", letterSpacing: "0.08em",
          background: "rgba(240,180,41,0.04)", borderRadius: 2,
        }}>
          📁 {src ? "Upload Different Photo" : "Upload Photo"}
          <input type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const file = e.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = ev => onUploadNew(ev.target.result); r.readAsDataURL(file); }} />
        </label>

        {/* Preview grid */}
        {src && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 9, color: "#8a9ab0", fontFamily: "Space Mono", marginBottom: 6, letterSpacing: "0.12em" }}>ORIGINAL</p>
            <img ref={imgRef} src={src} alt="original" crossOrigin="anonymous"
              style={{ width: "100%", maxHeight: 220, objectFit: "contain" }}
              onLoad={updatePreview} />
          </div>
          <div>
            <p style={{ fontSize: 9, color: "#8a9ab0", fontFamily: "Space Mono", marginBottom: 6, letterSpacing: "0.12em" }}>PREVIEW (card size)</p>
            {previewUrl
              ? <img src={previewUrl} style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", border: "1px solid #1e4080" }} alt="preview" />
              : <div style={{ width: "100%", aspectRatio: "4/5", background: "#1e4080", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ color: "#8a9ab0", fontSize: 10, fontFamily: "Space Mono" }}>Adjust sliders</p>
                </div>
            }
          </div>
        </div>
        )}
        {/* Controls */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px", marginBottom: 16 }}>
          {[
            ["↕ Face vertical position", cropY, setCropY, 0, 100, "%"],
            ["↔ Face horizontal position", cropX, setCropX, 0, 100, "%"],
            ["🔍 Zoom", zoom, setZoom, 50, 300, "%"],
            ["☀ Brightness", brightness, setBrightness, 50, 200, ""],
            ["◑ Contrast", contrast, setContrast, 50, 200, ""],
          ].map(([label, val, setter, min, max, unit]) => (
            <div key={label}>
              <label style={{ fontSize: 10, color: "#8a9ab0", fontFamily: "Space Mono", display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>{label}</span>
                <span style={{ color: "#f0b429" }}>{Math.round(val)}{unit}</span>
              </label>
              <input type="range" min={min} max={max} value={Math.round(val)}
                onChange={e => setter(Number(e.target.value))}
                onMouseUp={updatePreview} onTouchEnd={updatePreview} onKeyUp={updatePreview}
                style={{ width: "100%", accentColor: "#f0b429", cursor: "pointer" }} />
            </div>
          ))}
        </div>

        <button onClick={updatePreview} style={{ width: "100%", padding: 8, background: "rgba(240,180,41,0.08)", border: "1px solid rgba(240,180,41,0.4)", color: "#f0b429", fontFamily: "Space Mono", fontSize: 11, cursor: "pointer", marginBottom: 12, borderRadius: 2 }}>
          ↻ Refresh Preview
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { const d = preview(); if (d) onSave(d); }} style={{ flex: 1, padding: 11, background: "#f0b429", color: "#0a162e", border: "none", fontFamily: "Space Mono", fontSize: 12, cursor: "pointer", fontWeight: 700, borderRadius: 2 }}>
            ✓ Save
          </button>
          <button onClick={onClose} style={{ padding: "11px 18px", background: "transparent", border: "1px solid #444", color: "#888", fontFamily: "Space Mono", fontSize: 11, cursor: "pointer", borderRadius: 2 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FULL ADMIN PANEL ───────────────────────────────────────────────────────
function EditToolbar({ onEditChange, extraProjects, setExtraProjects, memberOverrides, setMemberOverrides, extraMembers, blobPatents, extraPapers, textEdits, setTextEdits }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pw, setPw] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [editOn, setEditOn] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [cropTarget, setCropTarget] = useState(null);
  const [projForm, setProjForm] = useState({ title: "", tag: "", icon: "🔬", description: "", highlights: "" });
  const [addProjOpen, setAddProjOpen] = useState(false);
  const [ghToken, setGhToken] = useState(() => { try { return localStorage.getItem("eml_gh_token") || ""; } catch { return ""; } });
  const [ghRepo, setGhRepo] = useState(() => { try { return localStorage.getItem("eml_gh_repo") || "ezzyousef/eml-site"; } catch { return "ezzyousef/eml-site"; } });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const saveToNetlify = async (pwArg) => {
    setSaving(true); setSaveMsg("Saving…");
    try {
      const patch = {
        token: pwArg,
        memberOverrides,
        patents: blobPatents,
        extraProjects,
        extraMembers,
        extraPapers,
        textEdits,
      };
      const res = await fetch("/api/save-overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const text = await res.text();
      let json = {};
      try { json = text ? JSON.parse(text) : {}; } catch { json = { error: "Invalid server response" }; }
      if (res.ok && json.ok) {
        setSaveMsg("✓ Saved! Changes are live instantly.");
      } else {
        setSaveMsg("✗ Error: " + (json.error || "Unknown"));
      }
    } catch (e) { setSaveMsg("✗ " + e.message); }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 8000);
  };

  const saveToGitHub = saveToNetlify;

  // Secret keyboard shortcut: Ctrl + Shift + A
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        if (!loggedIn) setShowLogin(true);
        else setShowPanel(p => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [loggedIn]);

  const enableEdit = () => {
    document.querySelectorAll("p, h1, h2, h3, h4, span, li").forEach((el, idx) => {
      if (!el.closest("input,button,.admin-panel,script,[data-no-edit]")) {
        el.contentEditable = "true"; el.spellcheck = false;
        // Assign a stable data-edit-id if not already set
        if (!el.dataset.editId) el.dataset.editId = `edit-${idx}`;
        el.addEventListener("input", () => {
          const id = el.dataset.editId;
          setTextEdits(prev => ({ ...prev, [id]: el.textContent }));
        }, { once: false });
      }
    });
    setEditOn(true);
    if (onEditChange) onEditChange(true);
  };

  const disableEdit = () => {
    document.querySelectorAll("[contenteditable]").forEach(el => el.contentEditable = "false");
    setEditOn(false);
    if (onEditChange) onEditChange(false);
  };

  const handleLogin = async () => {
    if (await checkPassword(pw)) {
      setLoggedIn(true); setShowLogin(false); setPwErr(false);
      setAdminPw(pw); setPw("");
      setShowPanel(true); enableEdit();
    } else setPwErr(true);
  };

  const uploadImg = (e, onLoad) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onLoad(ev.target.result);
    reader.readAsDataURL(file);
  };

  const allMembers = [
    { name: "Prof. Nageh K. Allam", key: "nageh" },
    ...teamGroups.flatMap(g => g.members.map(m => ({ name: m.name, key: m.name }))),
  ];

  const addProject = () => {
    if (!projForm.title.trim()) return;
    setExtraProjects(prev => [...prev, {
      id: Date.now(), icon: projForm.icon || "🔬",
      color: "#1e4080", bg: "#dde8f5",
      title: projForm.title, tag: projForm.tag,
      description: projForm.description,
      highlights: projForm.highlights.split("\n").filter(Boolean),
      keyPaper: "",
    }]);
    setProjForm({ title: "", tag: "", icon: "🔬", description: "", highlights: "" });
    setAddProjOpen(false);
  };

  const tabs = [
    { id: "text", label: "✏ Text" },
    { id: "members", label: "👥 Photos" },
    { id: "projects", label: "📋 Projects" },
    { id: "logos", label: "🖼 Logos" },
    { id: "save", label: "💾 Save" },
  ];

  return (
    <>
      {cropTarget && <ImageCropTool src={cropTarget.src} onSave={d => { cropTarget.onSave(d); setCropTarget(null); }} onClose={() => setCropTarget(null)} />}

      {showLogin && (
        <div className="edit-login">
          <div className="edit-login-box">
            <p className="serif" style={{ fontSize: 20, color: "#f0b429", marginBottom: 6 }}>EML Admin</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "Space Mono", marginBottom: 24 }}>Password required</p>
            <input type="password" value={pw} onChange={e => { setPw(e.target.value); setPwErr(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Password" autoFocus
              style={{ width: "100%", padding: "10px 14px", marginBottom: 8, background: "rgba(255,255,255,0.05)", border: `1px solid ${pwErr ? "#e05555" : "#f0b429"}`, color: "white", fontFamily: "Space Mono", fontSize: 13, outline: "none", borderRadius: 2, boxSizing: "border-box" }} />
            {pwErr && <p style={{ fontSize: 11, color: "#e05555", fontFamily: "Space Mono", marginBottom: 8 }}>Wrong password</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button className="edit-btn edit-btn-on" style={{ flex: 1 }} onClick={handleLogin}>Login</button>
              <button className="edit-btn" style={{ flex: 1, borderColor: "#555", color: "#999" }} onClick={() => { setShowLogin(false); setPw(""); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editOn && <div className="edit-mode-banner" data-no-edit>✏ EDIT MODE — Click any text on the page to edit</div>}

      {/* Sliding panel */}
      {showPanel && loggedIn && (
        <div className="admin-panel" data-no-edit style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 9990, width: 360,
          background: "#0a162e", borderLeft: "2px solid #f0b429",
          display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.6)", overflowY: "auto",
        }}>
          {/* Header */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(240,180,41,0.2)", background: "#060f1e", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div>
              <p style={{ fontSize: 13, color: "#f0b429", fontFamily: "Space Mono", fontWeight: 700, margin: 0 }}>⚙ EML Admin Panel</p>
              <p style={{ fontSize: 9, color: editOn ? "#1a9e75" : "#8a9ab0", fontFamily: "Space Mono", margin: 0 }}>{editOn ? "✏ EDITING ACTIVE" : "Edit mode off"}</p>
            </div>
            <button onClick={() => { setShowPanel(false); disableEdit(); }} style={{ background: "none", border: "1px solid #444", color: "#888", padding: "4px 10px", cursor: "pointer", fontFamily: "Space Mono", fontSize: 10 }}>✕</button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(240,180,41,0.15)", flexShrink: 0 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                flex: 1, padding: "9px 4px", fontSize: 9, fontFamily: "Space Mono",
                background: activeTab === t.id ? "rgba(240,180,41,0.1)" : "transparent",
                color: activeTab === t.id ? "#f0b429" : "rgba(255,255,255,0.35)",
                border: "none", borderBottom: activeTab === t.id ? "2px solid #f0b429" : "2px solid transparent",
                cursor: "pointer",
              }}>{t.label}</button>
            ))}
          </div>

          <div style={{ padding: 16, flex: 1, overflowY: "auto" }}>

            {/* TEXT TAB */}
            {activeTab === "text" && (
              <div>
                <button onClick={editOn ? disableEdit : enableEdit} style={{
                  width: "100%", padding: 12, marginBottom: 12,
                  background: editOn ? "rgba(26,158,117,0.15)" : "rgba(240,180,41,0.08)",
                  border: `1px solid ${editOn ? "#1a9e75" : "#f0b429"}`,
                  color: editOn ? "#1a9e75" : "#f0b429",
                  fontFamily: "Space Mono", fontSize: 11, cursor: "pointer",
                }}>
                  {editOn ? "✓ EDITING ON — Click text to edit" : "✏ ENABLE TEXT EDITING"}
                </button>
                <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: 12, borderRadius: 2 }}>
                  <p style={{ fontSize: 10, color: "#f0b429", fontFamily: "Space Mono", marginBottom: 8 }}>HOW TO USE:</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.9 }}>
                    • Click any title, description or text<br/>
                    • Type to edit directly on the page<br/>
                    • Gold dashed outline = editable field<br/>
                    • Changes are visible immediately
                  </p>
                </div>
              </div>
            )}

            {/* PHOTOS TAB */}
            {activeTab === "members" && (
              <div>
                <p style={{ fontSize: 10, color: "#8a9ab0", fontFamily: "Space Mono", marginBottom: 12, lineHeight: 1.6 }}>
                  Upload a photo → crop & adjust → save. Changes apply instantly.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {allMembers.map(({ name, key }) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 2 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 2, overflow: "hidden", flexShrink: 0, background: "#1e4080", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {memberOverrides[key]
                          ? <img src={memberOverrides[key]} style={{ width: 32, height: 32, objectFit: "cover" }} alt={name} />
                          : <span style={{ fontSize: 10, color: "#f0b429", fontFamily: "Space Mono" }}>{name.split(" ").map(w=>w[0]).join("").slice(0,2)}</span>
                        }
                      </div>
                      <span style={{ flex: 1, fontSize: 11, color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        <label style={{ fontSize: 9, color: "#f0b429", fontFamily: "Space Mono", cursor: "pointer", border: "1px solid rgba(240,180,41,0.4)", padding: "2px 6px" }}>
                          {memberOverrides[key] ? "✂" : "＋"}
                          <input type="file" accept="image/*" style={{ display: "none" }}
                            onChange={e => uploadImg(e, src => setCropTarget({ src, onSave: d => setMemberOverrides(p => ({ ...p, [key]: d })) }))} />
                        </label>
                        {memberOverrides[key] && (
                          <button onClick={() => setCropTarget({ src: memberOverrides[key], onSave: d => setMemberOverrides(p => ({ ...p, [key]: d })) })}
                            style={{ fontSize: 9, color: "#8a9ab0", background: "none", border: "1px solid #444", cursor: "pointer", padding: "2px 5px" }}>✂</button>
                        )}
                        {memberOverrides[key] && (
                          <button onClick={() => setMemberOverrides(p => { const n = {...p}; delete n[key]; return n; })}
                            style={{ fontSize: 9, color: "#e05555", background: "none", border: "1px solid #e05555", cursor: "pointer", padding: "2px 5px" }}>✕</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div>
                <p style={{ fontSize: 10, color: "#8a9ab0", fontFamily: "Space Mono", marginBottom: 10 }}>
                  {projects.length + extraProjects.length} total projects
                </p>
                <div style={{ marginBottom: 12, maxHeight: 240, overflowY: "auto" }}>
                  {[...projects, ...extraProjects].map((p, i) => (
                    <div key={i} style={{ padding: "6px 10px", background: i >= projects.length ? "rgba(240,180,41,0.05)" : "rgba(255,255,255,0.03)", border: `1px solid ${i >= projects.length ? "rgba(240,180,41,0.3)" : "rgba(255,255,255,0.06)"}`, marginBottom: 3, borderRadius: 2, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{p.icon}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", flex: 1 }}>{p.title}</span>
                      {i >= projects.length && (
                        <button onClick={() => setExtraProjects(prev => prev.filter((_, j) => j !== i - projects.length))}
                          style={{ fontSize: 9, color: "#e05555", background: "none", border: "1px solid #e05555", cursor: "pointer", padding: "2px 5px" }}>✕</button>
                      )}
                    </div>
                  ))}
                </div>
                {!addProjOpen ? (
                  <button onClick={() => setAddProjOpen(true)} style={{ width: "100%", padding: 10, border: "2px dashed rgba(240,180,41,0.5)", background: "rgba(240,180,41,0.05)", color: "#f0b429", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer" }}>＋ Add New Project</button>
                ) : (
                  <div style={{ border: "1px solid #f0b429", padding: 14, borderRadius: 2 }}>
                    <p style={{ fontSize: 10, color: "#f0b429", fontFamily: "Space Mono", marginBottom: 12, fontWeight: 700 }}>NEW PROJECT</p>
                    {[
                      ["Icon (emoji)", "icon", "🔬", false],
                      ["Title *", "title", "Project title", false],
                      ["Tag", "tag", "e.g. Green Energy", false],
                      ["Description *", "description", "Describe the research...", true],
                      ["Highlights (one per line)", "highlights", "Key point 1\nKey point 2", true],
                    ].map(([label, key, ph, multi]) => (
                      <div key={key} style={{ marginBottom: 8 }}>
                        <label style={{ fontSize: 9, color: "#8a9ab0", fontFamily: "Space Mono", display: "block", marginBottom: 3 }}>{label}</label>
                        {multi
                          ? <textarea value={projForm[key]} onChange={e => setProjForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} rows={3}
                              style={{ width: "100%", padding: "6px 8px", fontSize: 12, border: "1px solid #d0d8e8", outline: "none", borderRadius: 2, boxSizing: "border-box", resize: "vertical", background: "white" }} />
                          : <input value={projForm[key]} onChange={e => setProjForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                              style={{ width: "100%", padding: "6px 8px", fontSize: 12, border: "1px solid #d0d8e8", outline: "none", borderRadius: 2, boxSizing: "border-box", background: "white" }} />
                        }
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={addProject} style={{ flex: 1, padding: 8, background: "#1e4080", color: "white", border: "none", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer" }}>Add Project</button>
                      <button onClick={() => setAddProjOpen(false)} style={{ padding: "8px 12px", background: "transparent", border: "1px solid #555", color: "#888", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LOGOS TAB */}
            {activeTab === "logos" && (
              <div>
                <p style={{ fontSize: 10, color: "#8a9ab0", fontFamily: "Space Mono", marginBottom: 14, lineHeight: 1.6 }}>
                  Upload new logos. You can crop the EML logo. Changes apply to this session.
                </p>
                {[
                  ["EML Logo", "eml", true],
                  ["AUC Logo", "auc", false],
                ].map(([label, key, canCrop]) => (
                  <div key={key} style={{ marginBottom: 16, padding: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2 }}>
                    <p style={{ fontSize: 10, color: "#f0b429", fontFamily: "Space Mono", marginBottom: 10 }}>{label}</p>
                    {memberOverrides[key] && (
                      <div style={{ marginBottom: 10, textAlign: "center", background: "#060f1e", padding: 8 }}>
                        <img src={memberOverrides[key]} style={{ maxHeight: 50, maxWidth: "100%", objectFit: "contain" }} alt={label} />
                      </div>
                    )}
                    <label style={{ display: "block", padding: 10, textAlign: "center", border: "1px dashed rgba(240,180,41,0.4)", color: "#f0b429", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer" }}>
                      {memberOverrides[key] ? "✓ Uploaded — Change" : `＋ Upload ${label}`}
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={e => uploadImg(e, src => {
                          if (canCrop) setCropTarget({ src, onSave: d => setMemberOverrides(p => ({ ...p, [key]: d })) });
                          else setMemberOverrides(p => ({ ...p, [key]: src }));
                        })} />
                    </label>
                    {memberOverrides[key] && canCrop && (
                      <button onClick={() => setCropTarget({ src: memberOverrides[key], onSave: d => setMemberOverrides(p => ({ ...p, [key]: d })) })}
                        style={{ width: "100%", marginTop: 6, padding: 6, background: "transparent", border: "1px solid rgba(240,180,41,0.4)", color: "#f0b429", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer" }}>✂ Crop/Edit</button>
                    )}
                    {memberOverrides[key] && (
                      <button onClick={() => setMemberOverrides(p => { const n = {...p}; delete n[key]; return n; })}
                        style={{ width: "100%", marginTop: 4, padding: 6, background: "transparent", border: "1px solid #e05555", color: "#e05555", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer" }}>Remove</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {activeTab === "save" && (
            <div style={{ padding: "0 18px 18px" }}>
              {/* Netlify Connected Status */}
              <div style={{ background: "rgba(26,158,117,0.08)", border: "1px solid rgba(26,158,117,0.3)", padding: "12px 14px", borderRadius: 2, marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "#1a9e75", fontFamily: "Space Mono", fontWeight: 700, marginBottom: 4 }}>✓ VERCEL STORAGE CONNECTED</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                  Changes save instantly — no rebuild needed.<br/>
                  Site: <span style={{ color: "#f0b429" }}>eml-site.vercel.app</span>
                </p>
              </div>

              {/* What gets saved */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", padding: "12px 14px", borderRadius: 2, marginBottom: 16 }}>
                <p style={{ fontSize: 10, color: "#8a9ab0", fontFamily: "Space Mono", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>What Gets Saved</p>
                {[
                  ["📸", "Member photos", `${Object.keys(memberOverrides).length} photo override(s)`],
                  ["📋", "Patents", "All patents incl. newly added"],
                  ["📁", "Projects", `${extraProjects.length} extra project(s)`],
                  ["📝", "Text edits", "Any text edited on the page"],
                ].map(([icon, label, desc]) => (
                  <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontSize: 11, color: "white", fontFamily: "Space Mono", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 10, color: "#8a9ab0", margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save button */}
              <button onClick={() => { const p = adminPw; saveToNetlify(p); }} disabled={saving}
                style={{ width: "100%", padding: "14px", background: saving ? "#333" : "#1e4080", color: "white", border: "none", fontFamily: "Space Mono", fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", cursor: saving ? "not-allowed" : "pointer", borderRadius: 2, textTransform: "uppercase", marginBottom: 10 }}>
                {saving ? "⏳ Saving…" : "💾 SAVE & PUBLISH"}
              </button>

              {saveMsg && (
                <p style={{ fontSize: 11, fontFamily: "Space Mono", color: saveMsg.startsWith("✓") ? "#1a9e75" : "#e05555", textAlign: "center", padding: "8px", background: saveMsg.startsWith("✓") ? "rgba(26,158,117,0.1)" : "rgba(224,85,85,0.1)", borderRadius: 2 }}>
                  {saveMsg}
                </p>
              )}

              <p style={{ fontSize: 9, color: "#555", fontFamily: "Space Mono", marginTop: 12, lineHeight: 1.6 }}>
                Saves instantly — no rebuild needed.
              </p>
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "#060f1e", flexShrink: 0 }}>
            <button onClick={() => { setLoggedIn(false); setShowPanel(false); disableEdit(); setMemberOverrides({}); }}
              style={{ width: "100%", padding: 8, background: "transparent", border: "1px solid #444", color: "#666", fontFamily: "Space Mono", fontSize: 10, cursor: "pointer" }}>
              Logout & Reset
            </button>
          </div>
        </div>
      )}

      {/* Hidden floating button — only visible after Ctrl+Shift+A */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", gap: 8 }}>
        {loggedIn && (
          <button onClick={() => setShowPanel(!showPanel)} style={{
            padding: "10px 18px", background: showPanel ? "#f0b429" : "#0a162e",
            border: "1px solid #f0b429", color: showPanel ? "#0a162e" : "#f0b429",
            fontFamily: "Space Mono", fontSize: 11, cursor: "pointer", letterSpacing: "0.08em",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}>
            {showPanel ? "✕ Close Panel" : "⚙ Admin Panel"}
          </button>
        )}
      </div>
    </>
  );
}


export default function EMLWebsite() {
  const [editOn, setEditOn] = useState(false);
  const [extraMembers, setExtraMembers] = useState({});
  const [extraProjects, setExtraProjects] = useState([]);
  const [extraPapers, setExtraPapers] = useState([]);
  const [textEdits, setTextEdits] = useState({});
  const [memberOverrides, setMemberOverrides] = useState({}); // { memberName: dataUrl }
  const [blobPatents, setBlobPatents] = useState(null); // loaded from Netlify Blobs
  const [inlineCrop, setInlineCrop] = useState(null); // { src, name, onSave }
  useIntersect();

  // Load saved overrides from Netlify Blobs via API
  useEffect(() => {
    fetch("/api/save-overrides")
      .then(r => {
        if (!r.ok) return null;
        return r.text().then(t => {
          try { return t ? JSON.parse(t) : null; } catch { return null; }
        });
      })
      .then(data => {
        if (!data) return;
        // Restore photo overrides
        if (data.memberOverrides && Object.keys(data.memberOverrides).length)
          setMemberOverrides(prev => ({ ...prev, ...data.memberOverrides }));
        // Restore patents from Blobs
        if (data.patents && Array.isArray(data.patents))
          setBlobPatents(data.patents);
        // Restore extra projects
        if (data.extraProjects && data.extraProjects.length)
          setExtraProjects(data.extraProjects);
        // Restore extra members
        if (data.extraMembers)
          setExtraMembers(data.extraMembers);
        // Restore extra papers
        if (data.extraPapers && Array.isArray(data.extraPapers))
          setExtraPapers(data.extraPapers);
        // Restore text edits and apply to DOM
        if (data.textEdits && typeof data.textEdits === "object") {
          setTextEdits(data.textEdits);
          // Apply text edits to DOM after render
          setTimeout(() => {
            Object.entries(data.textEdits).forEach(([selector, text]) => {
              try {
                const el = document.querySelector(selector);
                if (el) el.textContent = text;
              } catch {}
            });
          }, 500);
        }
      })
      .catch(() => {});
  }, []);

  // Re-apply text edits to DOM whenever textEdits state changes (e.g. after load)
  useEffect(() => {
    if (!textEdits || Object.keys(textEdits).length === 0) return;
    const apply = () => {
      Object.entries(textEdits).forEach(([id, text]) => {
        const el = document.querySelector(`[data-edit-id="${id}"]`);
        if (el && el.textContent !== text) el.textContent = text;
      });
    };
    // Try immediately, then again after a short delay for dynamic content
    apply();
    const t = setTimeout(apply, 800);
    return () => clearTimeout(t);
  }, [textEdits]);

  const openCropForMember = (name, currentSrc, onSave) => {
    setInlineCrop({ src: currentSrc, name, onSave });
  };

  const addMember = (groupLabel, member) => {
    setExtraMembers(prev => ({
      ...prev,
      [groupLabel]: [...(prev[groupLabel] || []), member],
    }));
  };


  return (
    <EditContext.Provider value={{ editOn, openCropForMember, setMemberOverrides, extraPapers, setExtraPapers, textEdits, setTextEdits }}>
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f4f6fa" }}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand">
          <EMLLogo size="nav" />
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.12)", margin: "0 8px" }} />
          <AUCLogo />
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {["Research", "Publications", "Patents", "Team", "Projects", "Contact"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{
              color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 500,
              letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
              fontFamily: "'Space Mono', monospace", transition: "color 0.2s", whiteSpace: "nowrap",
            }}
            onMouseOver={e => e.target.style.color = "#f0b429"}
            onMouseOut={e => e.target.style.color = "rgba(255,255,255,0.8)"}
            >{s}</a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" style={{ position: "relative", overflow: "hidden", minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 48px 60px" }}>
        {/* EML logo as large background watermark */}
        <img
          src={`${import.meta.env.BASE_URL}EML_logo.png`}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute", right: "0", top: "50%",
            transform: "translateY(-50%)",
            width: "60%", opacity: 0.05,
            pointerEvents: "none", zIndex: 0,
            objectFit: "contain",
          }}
        />
        <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          {/* Top: Lab name + AUC */}
          <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#f0b429", fontFamily: "Space Mono", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 32, height: 1, background: "#f0b429", display: "inline-block" }} />
            The American University in Cairo · School of Sciences &amp; Engineering
          </p>

          {/* Main two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 48 }}>
            {/* Left: text */}
            <div>
              <h1 className="serif" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.1,  color: "#ffffff", letterSpacing: "-0.02em", marginBottom: 20, whiteSpace: "nowrap" }}>
                Energy <span style={{ color: "#f0b429" }}>Materials</span> Laboratory
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(255,255,255,0.62)", fontWeight: 300, marginBottom: 36 }}>
                Pioneering next-generation materials for solar energy conversion,
                green hydrogen production, CO₂ electroreduction, and sustainable energy storage
                — bridging fundamental science with real-world impact.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a href="#publications" className="btn-primary">Our Publications</a>
                <a href="#team" className="btn-outline">Meet the Team</a>
                <a href="#patents" className="btn-outline">Patents</a>
              </div>
            </div>

            {/* Right: EML logo */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img
                src={`${import.meta.env.BASE_URL}EML_logo.png`}
                alt="Energy Materials Laboratory"
                style={{ width: "90%", maxWidth: 340, objectFit: "contain", filter: "brightness(10) saturate(0.8) sepia(0.3) drop-shadow(0 0 20px rgba(240,180,41,0.5))" }}
              />
            </div>
          </div>

          {/* Prof. Nageh card on hero */}
          <div style={{
            display: "grid", gridTemplateColumns: "180px 1fr",
            background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(240,180,41,0.3)",
            borderLeft: "4px solid #f0b429",
            minHeight: 160, overflow: "hidden",
          }}>
            {/* Rectangular photo — left */}
            <div style={{ position: "relative", minHeight: 160 }}>
              <img
                src={memberOverrides["nageh"] || `${import.meta.env.BASE_URL}nageh.jpg`}
                alt="Prof. Nageh K. Allam"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", display: "block", minHeight: 160 }}
                onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
              />
              <div style={{
                display: "none", width: "100%", minHeight: 160,
                background: "linear-gradient(135deg, #1e4080, #2a5fba)",
                alignItems: "center", justifyContent: "center",
                fontFamily: "'Libre Baskerville', serif", fontSize: 40, color: "white", fontWeight: 700,
              }}>NA</div>
            </div>
            {/* Text — right */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
                <p className="serif" style={{ fontSize: 20, color: "white", fontWeight: 700, margin: 0 }}>Prof. Nageh K. Allam</p>
                <span style={{ fontSize: 10, color: "#f0b429", fontFamily: "Space Mono", letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(240,180,41,0.1)", padding: "2px 8px", borderRadius: 2 }}>Lab Director · PI</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8, fontFamily: "Space Mono" }}>
                Professor of Physics · Department of Physics, AUC
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0 }}>
                PhD (Penn State) · Postdoc at Georgia Tech &amp; MIT ·
                Obada Prize (2022), State of Egypt Award, TWAS Young Scientist Award, and AUC Excellence in Research Award.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <a href="https://scholar.google.com/citations?user=18v00ZIAAAAJ&hl=en" target="_blank" rel="noreferrer" className="pi-link">Google Scholar</a>
                <a href="https://www.aucegypt.edu/fac/nageh-allam" target="_blank" rel="noreferrer" className="pi-link">AUC Profile</a>
                <a href="mailto:nageh.allam@aucegypt.edu" className="pi-link">Email</a>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 40, marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[["200+","Publications"],["15,700+","Citations"],["12","Research Projects"],["65","Lab Instruments"]].map(([n,l]) => (
              <div key={l}>
                <div className="serif" style={{ fontSize: 24, fontWeight: 700, color: "#f0b429", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Space Mono", marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Group Photo */}
          <div style={{ marginTop: 36, position: "relative" }}>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0b429", fontFamily: "Space Mono", marginBottom: 12 }}>
              ● The EML Family
            </p>
            <img
              src={`${import.meta.env.BASE_URL}group-photo.png`}
              alt="EML Research Group"
              style={{
                width: "100%", borderRadius: 4,
                border: "1px solid rgba(240,180,41,0.2)",
                objectFit: "cover", maxHeight: 420,
                display: "block",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
              }}
            />
          </div>
        </div>
      </section>

      {/* ABOUT / RESEARCH */}
      <section id="research" style={{ background: "#f4f6fa" }}>
        <div className="section">
          <div className="fade">
            <p className="section-label mono">About Our Research</p>
            <h2 className="section-title serif">Solving critical energy<br />challenges through materials science</h2>
          </div>
          <div className="about-grid">
            <div className="about-text fade">
              <p>
                The Energy Materials Laboratory (EML) at The American University in Cairo, led by
                <strong style={{ color: "#1e4080" }}> Prof. Nageh K. Allam</strong>, is a globally recognized
                research group dedicated to the discovery and engineering of advanced functional materials
                for sustainable energy applications.
              </p>
              <p>
                Our work spans solar energy conversion (photoelectrochemical water splitting for green hydrogen,
                lead-free perovskite solar cells), electrochemical energy storage (supercapacitors and batteries),
                CO₂ electroreduction into value-added fuels, and water desalination and treatment. We increasingly
                integrate AI-driven computational frameworks to accelerate materials discovery across vast chemical spaces.
              </p>
              <p>
                Committed to training the next generation of scientists, our lab is home to a diverse team of
                postdoctoral researchers, PhD and MSc students, and undergraduates. Our work has attracted
                international recognition and funding, and our findings are regularly published in leading
                journals including <em>Nature</em>, <em>ACS</em>, and <em>RSC</em> family journals.
              </p>
            </div>
            <div className="fade" style={{ transitionDelay: "0.15s" }}>
              <p className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "#1e4080", marginBottom: 16, fontWeight: 700 }}>Research Themes</p>
              <div className="research-tags">
                {researchAreas.map(r => <span key={r} className="rtag">{r}</span>)}
              </div>
              <div style={{ marginTop: 28, padding: "20px 24px", background: "#0a162e", borderLeft: "3px solid #f0b429" }}>
                <p className="mono" style={{ fontSize: 10, letterSpacing: "0.15em", color: "#f0b429", marginBottom: 8 }}>DIRECTOR</p>
                <p className="serif" style={{ fontSize: 16, color: "white", marginBottom: 4 }}>Prof. Nageh K. Allam</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>
                  Physics Dept., School of Sciences &amp; Engineering<br />
                  The American University in Cairo / MIT
                </p>
                <a href="https://scholar.google.com/citations?user=18v00ZIAAAAJ&hl=en" target="_blank" rel="noreferrer"
                  style={{ fontSize: 11, color: "#f0b429", fontFamily: "Space Mono", textDecoration: "none" }}>
                  Google Scholar →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PUBLICATIONS — auto-fetched from Semantic Scholar */}
      <div className="section-alt">
        <div className="section-inner" id="publications">
          <div className="fade">
            <p className="section-label mono">Selected Publications</p>
            <h2 className="section-title serif">Recent Research Output</h2>
          </div>

          <PublicationsSection />
        </div>
      </div>


      {/* PATENTS */}
      <PatentsSection editOn={editOn} initialPatents={blobPatents} />


      {/* TEAM */}
      <div className="section-alt">
        <div className="section-inner" id="team">
          <div className="fade">
            <p className="section-label mono">Meet the Team</p>
            <h2 className="section-title serif">Research Group Members</h2>
          </div>

          {/* PI Card — rectangular, same style as member cards */}
          <div className="fade" style={{
            display: "grid", gridTemplateColumns: "200px 1fr",
            height: 240, overflow: "hidden",
            border: "1px solid #f0b429", marginBottom: 32,
            boxShadow: "0 4px 20px rgba(240,180,41,0.15)"
          }}>
            {/* Left half — photo */}
            <img
              src={memberOverrides["nageh"] || `${import.meta.env.BASE_URL}nageh.jpg`}
              alt="Prof. Nageh K. Allam"
              style={{ width: "200px", height: "240px", objectFit: "cover", objectPosition: "center 15%", display: "block", cursor: editOn ? "pointer" : "default" }}
              onClick={() => { if (!editOn) return; const src = memberOverrides["nageh"] || `${import.meta.env.BASE_URL}nageh.jpg`; openCropForMember("nageh", src, d => setMemberOverrides(p => ({ ...p, nageh: d }))); }}
              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
            <div style={{
              display: "none", width: 200, height: 240,
              background: "linear-gradient(135deg, #1e4080, #2a5fba)",
              alignItems: "center", justifyContent: "center",
              fontFamily: "'Libre Baskerville', serif", fontSize: 48, color: "white", fontWeight: 700,
            }}>NA</div>
            {/* Right half — text, centered header, justified body */}
            <div style={{ background: "#0a162e", padding: "28px 32px", display: "flex", flexDirection: "column", justifyContent: "center", borderLeft: "4px solid #f0b429" }}>
              <span style={{ fontSize: 10, color: "#f0b429", fontFamily: "Space Mono", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6, textAlign: "center" }}>Principal Investigator</span>
              <p className="serif" style={{ fontSize: 22, color: "white", fontWeight: 700, marginBottom: 4, textAlign: "center" }}>Prof. Nageh K. Allam</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "Space Mono", marginBottom: 14, textAlign: "center" }}>Professor of Physics · AUC</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 14, textAlign: "justify" }}>
                PhD from Pennsylvania State University · Postdoctoral research at Georgia Institute of Technology and the Research Laboratory of Electronics at MIT.
                Recipient of the Obada Prize (2022), State of Egypt Award in Advanced Technological Sciences, TWAS Young Scientist Award, and AUC Excellence in Research Award.
                Member of APS, MRS, and the Electrochemical Society.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                <a href="https://scholar.google.com/citations?user=18v00ZIAAAAJ&hl=en" target="_blank" rel="noreferrer" className="pi-link">Google Scholar</a>
                <a href="mailto:nageh.allam@aucegypt.edu" className="pi-link">Email</a>
                <a href="https://www.aucegypt.edu/fac/nageh-allam" target="_blank" rel="noreferrer" className="pi-link">AUC Profile</a>
              </div>
            </div>
          </div>

          {/* Team Grid - grouped by role */}
          {teamGroups.map(group => {
            const extras = extraMembers[group.label] || [];
            const allMembers = [...group.members, ...extras];
            return (
              <div key={group.label}>
                <p className="team-section-header">{group.label} <span style={{ color: "#8a9ab0", fontWeight: 400 }}>({allMembers.length})</span></p>
                <div className="team-grid">
                  {allMembers.map((m, i) => (
                    <div key={i} className="member-card fade" style={{ transitionDelay: `${i * 0.04}s` }}>
                      {/* LEFT HALF — full photo, clickable in edit mode */}
                      {(() => {
                        const photoSrc = memberOverrides[m.name] || (m.photo ? (m._isDataUrl ? m.photo : `${import.meta.env.BASE_URL}${m.photo}`) : null);
                        const doEdit = () => {
                          if (photoSrc) {
                            openCropForMember(m.name, photoSrc, d => setMemberOverrides(p => ({ ...p, [m.name]: d })));
                          } else {
                            setInlineCrop({ src: null, name: m.name, onSave: d => setMemberOverrides(p => ({ ...p, [m.name]: d })) });
                          }
                        };
                        return (
                          <div style={{ position: "relative", width: 160, height: 200, flexShrink: 0, overflow: "hidden", cursor: editOn ? "pointer" : "default" }}
                            onClick={editOn ? doEdit : undefined}
                            onMouseEnter={e => { if (editOn) e.currentTarget.querySelector(".edit-overlay").style.opacity = 1; }}
                            onMouseLeave={e => { if (editOn) e.currentTarget.querySelector(".edit-overlay").style.opacity = 0; }}
                          >
                            {photoSrc
                              ? <img src={photoSrc} alt={m.name} className="member-photo-half" style={{ objectPosition: "center top", pointerEvents: "none" }} onError={e => e.target.style.display = "none"} />
                              : <div className="member-photo-fallback" style={{ background: m.bg, color: m.color, display: "flex", pointerEvents: "none" }}>{m.initials}</div>
                            }
                            {editOn && (
                              <div className="edit-overlay" style={{
                                position: "absolute", inset: 0, background: "rgba(10,22,46,0.6)",
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                gap: 8, opacity: 0, transition: "opacity 0.2s", pointerEvents: "none",
                              }}>
                                <span style={{ fontSize: 26 }}>{photoSrc ? "✂" : "📁"}</span>
                                <span style={{ fontSize: 9, color: "white", fontFamily: "Space Mono", letterSpacing: "0.1em" }}>{photoSrc ? "EDIT PHOTO" : "UPLOAD PHOTO"}</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {/* RIGHT HALF — text */}
                      <div className="member-text-half">
                        <p className="member-name">{m.name}</p>
                        <p className="member-role">{m.role}</p>
                        {m.note && <p style={{ fontSize: 11, color: "#8a9ab0", marginBottom: 8, lineHeight: 1.4 }}>{m.note}</p>}
                        <div className="member-interests">
                          {m.interests.map(interest => <span key={interest} className="mint">{interest}</span>)}
                        </div>
                        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                          {m.scholar && (
                            <a href={m.scholar} target="_blank" rel="noreferrer"
                              style={{ fontSize: 10, color: "#1e4080", fontFamily: "Space Mono", textDecoration: "none", border: "1px solid #d0d8e8", padding: "2px 7px", borderRadius: 2 }}>
                              Scholar
                            </a>
                          )}
                          {m.email && (
                            <a href={`mailto:${m.email}`}
                              style={{ fontSize: 10, color: "#8a9ab0", fontFamily: "Space Mono", textDecoration: "none", border: "1px solid #d0d8e8", padding: "2px 7px", borderRadius: 2 }}>
                              Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <AddMemberForm groupLabel={group.label} onAdd={(m) => addMember(group.label, m)} />
              </div>
            );
          })}
        </div>
      </div>


      {/* PROJECTS */}
      <section id="projects" style={{ background: "#f4f6fa" }}>
        <div className="section">
          <div className="fade">
            <p className="section-label mono">Research Projects</p>
            <h2 className="section-title serif">Our Active Research Programs</h2>
          </div>
          <div className="projects-grid">
            {[...projects, ...extraProjects].map((p, i) => (
              <div
                key={p.id}
                className="project-card fade"
                style={{ "--proj-color": p.color, transitionDelay: `${(i % 3) * 0.08}s` }}
              >
                <span className="proj-num">{String(p.id).padStart(2, "0")}</span>
                <div className="proj-icon-wrap" style={{ background: p.bg }}>{p.icon}</div>
                <span className="proj-tag" style={{ background: p.bg, color: p.color }}>{p.tag}</span>
                <h3 className="proj-title">{p.title}</h3>
                <p className="proj-desc">{p.description}</p>
                {p.subgroups && p.subgroups.map(sg => (
                  <div key={sg.label} className="proj-subgroup" style={{ borderLeftColor: p.color }}>
                    <p className="proj-subgroup-label" style={{ color: p.color }}>{sg.label}</p>
                    <p className="proj-subgroup-text">{sg.text}</p>
                  </div>
                ))}
                <ul className="proj-highlights">
                  {p.highlights.map(h => <li key={h}>{h}</li>)}
                </ul>
                {p.members && (
                  <p style={{ fontSize: 11, color: "#1e4080", marginBottom: 10, fontFamily: "Space Mono", letterSpacing: "0.03em" }}>
                    👥 {p.members}
                  </p>
                )}
                <p className="proj-paper"><strong>Key Publication: </strong>{p.keyPaper}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* FOOTER */}
      <footer className="footer" id="contact">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <EMLLogo size="footer" />
              <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.1)" }} />
              <AUCLogo />
            </div>
            <p className="footer-tagline">
              Energy Materials Laboratory<br />
              Physics Department, School of Sciences &amp; Engineering<br />
              The American University in Cairo<br />
              New Cairo 11835, Egypt
            </p>
            <p style={{ marginTop: 16, fontSize: 13 }}>
              <a href="mailto:nageh.allam@aucegypt.edu" style={{ color: "#f0b429", textDecoration: "none" }}>
                nageh.allam@aucegypt.edu
              </a>
            </p>
          </div>
          <div>
            <p className="footer-heading">Navigate</p>
            {["Research", "Publications", "Patents", "Team", "Projects"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="footer-link">{l}</a>
            ))}
          </div>
          <div>
            <p className="footer-heading">External</p>
            <a href="https://scholar.google.com/citations?user=18v00ZIAAAAJ&hl=en" target="_blank" rel="noreferrer" className="footer-link">Google Scholar</a>
            <a href="https://www.aucegypt.edu" target="_blank" rel="noreferrer" className="footer-link">AUC Website</a>
            <a href="mailto:nageh.allam@aucegypt.edu" className="footer-link">Contact PI</a>
          </div>
          <div>
            <p className="footer-heading">Research Areas</p>
            <a href="#research" className="footer-link">Solar Energy</a>
            <a href="#research" className="footer-link">Green Hydrogen</a>
            <a href="#research" className="footer-link">CO₂ Conversion</a>
            <a href="#research" className="footer-link">Energy Storage</a>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Energy Materials Laboratory · The American University in Cairo · All rights reserved.
        </div>
      </footer>
      {/* INLINE CROP MODAL — triggered by clicking photo in edit mode */}
      {inlineCrop && (
        <ImageCropTool
          src={inlineCrop.src}
          name={inlineCrop.name}
          onSave={d => { inlineCrop.onSave(d); setInlineCrop(null); }}
          onClose={() => setInlineCrop(null)}
          onUploadNew={src => setInlineCrop(prev => ({ ...prev, src }))}
        />
      )}
      <EditToolbar onEditChange={setEditOn} extraProjects={extraProjects} setExtraProjects={setExtraProjects} memberOverrides={memberOverrides} setMemberOverrides={setMemberOverrides} extraMembers={extraMembers} blobPatents={blobPatents} extraPapers={extraPapers} textEdits={textEdits} setTextEdits={setTextEdits} />
    </div>
    </EditContext.Provider>
  );
}
