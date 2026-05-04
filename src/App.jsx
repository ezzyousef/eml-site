import React, { useState, useEffect } from "react";

const ADMIN_HASH = "da25c5b5903cfd4b93885fe8a67aed43e871cc8b5cad8eb95988e49cb16da8d9";
const SCHOLAR_URL = "https://scholar.google.com/citations?user=18v00ZIAAAAJ&hl=en&sortby=pubdate";
const AUTHOR_ID = "8643365";

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
}

const DEFAULT_SITE = {
  hero: {
    eyebrow: "The American University in Cairo · School of Sciences & Engineering",
    title: "Energy Materials Laboratory",
    subtitle: "Pioneering next-generation materials for solar energy conversion, green hydrogen production, CO₂ electroreduction, and sustainable energy storage — bridging fundamental science with real-world impact.",
    stats: [
      { num: "200+", label: "Publications" },
      { num: "15,700+", label: "Citations" },
      { num: "12", label: "Research Projects" },
      { num: "65", label: "Lab Instruments" },
    ],
  },
  about: {
    p1: "The Energy Materials Laboratory (EML) at The American University in Cairo, led by Prof. Nageh K. Allam, is a globally recognized research group dedicated to the discovery and engineering of advanced functional materials for sustainable energy applications.",
    p2: "Our work spans solar energy conversion (photoelectrochemical water splitting for green hydrogen, lead-free perovskite solar cells), electrochemical energy storage (supercapacitors and batteries), CO₂ electroreduction into value-added fuels, and water desalination and treatment.",
    p3: "Committed to training the next generation of scientists, our lab is home to a diverse team of postdoctoral researchers, PhD and MSc students, and undergraduates. Our work has attracted international recognition and findings are regularly published in leading journals.",
  },
  pi: {
    name: "Prof. Nageh K. Allam",
    title: "Professor of Physics · Department of Physics, AUC",
    bio: "PhD from Pennsylvania State University · Postdoctoral research at Georgia Institute of Technology and the Research Laboratory of Electronics at MIT. Recipient of the Obada Prize (2022), State of Egypt Award, TWAS Young Scientist Award, and AUC Excellence in Research Award.",
    scholar: "https://scholar.google.com/citations?user=18v00ZIAAAAJ&hl=en",
    email: "nageh.allam@aucegypt.edu",
    aucProfile: "https://www.aucegypt.edu/fac/nageh-allam",
    photo: null,
  },
  teamGroups: [
    { label: "Postdoctoral Researchers & Senior Scientists", members: [
      { name: "Dr. Ghada E. Khedr", role: "Postdoctoral Researcher", note: "Asst. Prof., Egyptian Petroleum Research Institute", interests: ["DFT","MD Simulations","CO₂ Reduction"], email: "khedrghada@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=i7M3gQ0AAAAJ&hl=en", photo: null },
    ]},
    { label: "PhD Students", members: [
      { name: "Hadir M. Emara", role: "PhD Student", note: "Nanomedicine for Targeted Cancer Treatment", interests: ["Nanomedicine","Targeted Cancer Treatment","Drug Delivery"], email: "hadir.emara@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=d7MwBZgAAAAJ&hl=en", photo: null },
      { name: "Sara A. Teama", role: "PhD Student", note: "TA at Faculty of Science, Menoufia University", interests: ["Supercapacitors","Water Splitting","Electrode Materials"], email: "sarateama@aucegypt.edu", scholar: "", photo: "team/sara-teama.jpg" },
    ]},
    { label: "Master's Students", members: [
      { name: "Ezz Yousef", role: "Master's Holder", note: "MSc in Nanotechnology from EML", interests: ["Electrolyte Supercapacitors","UV-Shielding","Nanocomposites"], email: "ezzyousef2@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=m0Rs9oIAAAAJ&hl=en", photo: "team/ezz-yousef.jpg" },
      { name: "Abdallah A. Akar", role: "Master's Holder", note: "MSc from EML — Hydrogel electrolytes & energy storage", interests: ["Supercapacitors","Electrolyte Engineering","Biogas Reactor"], email: "abdallah.akar@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=bjRsmrEAAAAJ&hl=en", photo: "team/abdallah-akar.jpg" },
      { name: "Mostafa A. Moselhy", role: "Master's Student", note: "Research Assistant at AUC — Supercapacitor Electrolyte Subgroup", interests: ["Supercapacitor Electrolytes","Deep Eutectic Solvents","Freeze-Tolerant Devices"], email: "m.moselhy@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=GfLRNYkAAAAJ&hl=ar", photo: "team/mostafa-moselhy.jpg" },
      { name: "Hajar Kamel", role: "Master's Student", note: "TA at AUC — Electrolyte Supercapacitors", interests: ["Supercapacitor Electrolytes","Gel Polymers","Ionic Liquids"], email: "Hajar.kamel@aucegypt.edu", scholar: "", photo: "team/hajar-kamel.jpg" },
      { name: "Esraa Mourad", role: "Master's Student", note: "UV-shielding polymer nanocomposite membranes", interests: ["UV-Shielding","Nanocomposite Membranes","PMMA/PVDF"], email: "esraamahmoud@aucegypt.edu", scholar: "", photo: "team/esraa-mourad.jpg" },
      { name: "Mai Ali Hassan", role: "Master's Student", note: "Capacitive Deionization & Water Desalination", interests: ["Capacitive Deionization","Water Desalination","Electrode Design"], email: "maighanem@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=BTLIKZIAAAAJ&hl=en", photo: "team/mai-hassan.jpg" },
      { name: "Marwa A. El-Gammal", role: "Master's Student", note: "TA at AUC — Nanofiber scaffolds for wound healing", interests: ["Nanofibers","Drug Delivery","Wound Healing","Electrospinning"], email: "marwaelgammal@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=Pp8PijQAAAAJ&hl=ru", photo: "team/marwa-elgammal.jpg" },
      { name: "Abdelrahman A. Ashour", role: "Master's Student", note: "CO₂RR — Pyramidal Dilute Sn–Cu Alloy catalysts", interests: ["CO₂ Electroreduction","C–C Coupling","Sn–Cu Alloys"], email: "Abdelrahman.ashour@aucegypt.edu", scholar: "", photo: "team/abdelrahman-ashour.jpg" },
      { name: "Abdelrahman M. Abdelmohsen", role: "Master's Student", note: "CO₂ Reduction & Ammonia Production", interests: ["CO₂ Reduction","Ammonia Production","Electrocatalysis"], email: "a.abdelfattah@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=V6wU7QMAAAAJ&hl=en", photo: "team/abdelrahman-abdelmohsen.jpg" },
      { name: "Abdallah M. Abdeldaiem", role: "Research Assistant", note: "Supercapacitors — Electrolyte Subgroup", interests: ["Supercapacitors","Electrolyte Subgroup","Energy Storage"], email: "abdallah.abdeldaiem@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=S-8ggHoAAAAJ&hl=ar", photo: "team/abdallah-abdeldaiem.png" },
      { name: "Ahmed G. Ali", role: "Research Assistant", note: "TA at Ain Shams University — Water Splitting & Green Hydrogen", interests: ["Water Splitting","Green Hydrogen","Electrochemistry"], email: "ahmed.galal@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=hfuJC6YAAAAJ&hl=en", photo: "team/ahmed-ali.jpg" },
      { name: "Shadi A. S. Eldib", role: "Research Assistant", note: "Thermoelectric & Piezoelectric Energy Harvesting", interests: ["Thermoelectric","Piezoelectric","Energy Harvesting"], email: "shadieldib@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=B4Lx1X4AAAAJ&hl=en", photo: "team/shadi-eldib.jpg" },
      { name: "Kareem T. Salim", role: "Research Assistant", note: "Ammonia Group — electrochemical nitrogen reduction", interests: ["Ammonia Synthesis","Electrochemical N₂ Reduction","Catalysis"], email: "kareemtareek@aucegypt.edu", scholar: "", photo: "team/kareem-salim.png" },
      { name: "Mohamed A. Elokl", role: "Research Assistant", note: "Power-to-X Decarbonization — dual-functional materials", interests: ["CO₂ Capture & Conversion","Power-to-X","Decarbonization"], email: "m_hassan@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=NQctE4EAAAAJ&hl=en", photo: "team/Mohamed-Elokl.jpg" },
      { name: "Mohamed Badr", role: "Research Assistant", note: "Research Assistant — Water Splitting Group", interests: ["Water Splitting","Lab Support","Electrochemistry"], email: "Mohamed.badr@aucegypt.edu", scholar: "", photo: "team/mohamed-badr.jpg" },
      { name: "Moustafa I.M. Abdelaziz", role: "Research Assistant", note: "Thermoelectric & Piezoelectric Research", interests: ["Thermoelectric","Piezoelectric","Energy Harvesting"], email: "mostafametwaly@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=l89LJVQAAAAJ&hl=en", photo: "team/moustafa-abdelaziz.jpg" },
      { name: "Yasmine I. Mesbah", role: "Research Assistant", note: "Supercapacitors & Sustainable Recycling of Li-Ion Batteries", interests: ["Supercapacitors","Battery Recycling","Energy Storage"], email: "yasmine_mesbah@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=-VM5nF8AAAAJ&hl=en", photo: "team/yasmine-mesbah.jpg" },
    ]},
    { label: "Alumni", members: [
      { name: "Nashaat Ahmed", role: "Alumni · Postdoc @ Univ. of Adelaide", note: "MSc from EML → Postdoc at University of Adelaide", interests: ["Supercapacitors","PEC Water Splitting","Electrochemical Sensors"], email: "nashaat.ahmed@aucegypt.edu", scholar: "https://scholar.google.com.au/citations?hl=en&authuser=1", photo: "team/nashaat-ahmed.jpg" },
      { name: "Ahmed M. Agour", role: "Alumni · PhD Student @ Northeastern Univ.", note: "MSc from EML → PhD at Northeastern University", interests: ["N₂/CO₂ Reduction","Ammonia Synthesis","Electrocatalysis"], email: "agour.a@northeastern.edu", scholar: "https://scholar.google.com/citations?hl=en&user=93r3gjcAAAAJ", photo: "team/ahmed-agour.jpg" },
      { name: "Loujain G. Ghanem", role: "Alumni · MSc Holder", note: "MSc in Materials Science from EML", interests: ["Supercapacitors","Optical Supercapacitors","Electrolyte Engineering"], email: "loujain.gamal@aucegypt.edu", scholar: "https://scholar.google.com/citations?user=6j4PcKUAAAAJ&hl=en", photo: null },
      { name: "Abdelrahman A. M. Ismail", role: "Alumni · PhD Student @ Northeastern Univ.", note: "MSc from EML → PhD at Northeastern University", interests: ["Electrolyte Design","Energy Storage","Supercapacitors"], email: "ismail.abde@northeastern.edu", scholar: "https://scholar.google.com/citations?user=AMVB3HgAAAAJ&hl=ar", photo: "team/abdelrahman-ismail.jpg" },
    ]},
    { label: "Lab Manager", members: [
      { name: "Mohamed Salama", role: "Lab Manager", note: "Lab Manager at AUC EML", interests: ["Lab Operations","Characterization","Equipment Management"], email: "Mohsalama@aucegypt.edu", scholar: "", photo: "team/mohamed-salama.jpg" },
    ]},
  ],
  patents: [
    { number: "US11795521B2", title: "Extraction of Iron (III) Oxide from Different Iron-Containing Ores", inventors: "Nageh K. Allam, Mahmoud M. Aly", assignee: "The American University in Cairo", filed: "2018", status: "Granted", url: "https://patents.google.com/patent/US11795521B2/en" },
    { number: "US App.", title: "Hydrogel Electrolyte Composition for Energy Storage Devices with Anti-Freeze and Non-Flammable Properties", inventors: "Nageh K. Allam, Abdelrahman A. M. Ismail", assignee: "The American University in Cairo", filed: "2023", status: "Pending", url: "" },
    { number: "US Prov. 62/262743", title: "Sub 100 nm Oxidized Transition Metal Tubular Architectures", inventors: "Menna Samir, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2016", status: "Provisional", url: "" },
    { number: "US Prov. 62/262685", title: "Ti-based Functional Nanoarchitectures as Drug Eluting Stents", inventors: "Yomna E. Saleh, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2016", status: "Provisional", url: "" },
    { number: "US Prov. 61/985504", title: "Efficient Charge Separation in Self-Assembled Nanostructured Photoanodes for Solar Energy Conversion", inventors: "R. Nashed, P. Szymanski, M. A. El-Sayed, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2014", status: "Provisional", url: "" },
    { number: "US Prov. 62/457533", title: "Magnetolysis — Electrochemical Water Splitting Using Magnetic Fields", inventors: "Hady Soliman, Mohamed Shokeir, Sandy El Moghazi, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2017", status: "Provisional", url: "" },
    { number: "US Prov. 62/509432", title: "Extraction of Iron (III) Oxide From Different Iron-Containing Ores (Provisional)", inventors: "Mahmoud A. Aly, Nageh K. Allam", assignee: "The American University in Cairo", filed: "2017", status: "Provisional", url: "" },
  ],
  extraPapers: [],
  researchAreas: ["Solar Energy Conversion","Green Hydrogen Production","Supercapacitors & Batteries","CO₂ Electroreduction","Perovskite Solar Cells","Photoelectrochemistry","AI-Driven Materials Design","Water Desalination","Nanotechnology","E-Waste Recycling","Thermoelectrics","Thin Film Deposition"],
};

const PAPERS_2026 = [
  { year:2026, citationCount:6, title:"Artificial Intelligence-Driven Materials Design for Next-Generation Sustainable Energy Technologies", authors:[{name:"SM Fawzy"},{name:"MK M. Ali"},{name:"Nageh K. Allam"}], venue:"ACS Sustainable Chemistry & Engineering 14, 4745–4761", externalIds:{DOI:"10.1021/acssuschemeng.6c01084"} },
  { year:2026, citationCount:0, title:"Multiscale Thermoelectric Transport: Bridging Quantum Mechanics to Macroscopic Systems", authors:[{name:"MI Abdelaziz"},{name:"SA Eldib"},{name:"Nageh K. Allam"}], venue:"Journal of Materials Chemistry A", externalIds:{} },
  { year:2026, citationCount:0, title:"Engineering reline/carboxymethyl cellulose eutectogel electrolytes through nanoscale water confinement", authors:[{name:"AA Akar"},{name:"MA Moselhy"},{name:"GE Khedr"},{name:"E Yousef"},{name:"Nageh K. Allam"}], venue:"Chemical Engineering Journal 537, 176245", externalIds:{} },
  { year:2026, citationCount:1, title:"Hierarchical aerogel-confined deep eutectic electrolytes with complete water immobilization for freeze-tolerant supercapacitors", authors:[{name:"MA Moselhy"},{name:"GE Khedr"},{name:"E Yousef"},{name:"AA Akar"},{name:"Nageh K. Allam"}], venue:"Journal of Materials Chemistry A", externalIds:{} },
  { year:2026, citationCount:4, title:"Machine Learning Guidelines for Designing Next-Generation Nanocomposite Membranes for CO₂ Capture", authors:[{name:"D Sallam"},{name:"BS Shaheen"},{name:"Nageh K. Allam"}], venue:"Green Chemistry 28, 1286–1315", externalIds:{} },
  { year:2026, citationCount:3, title:"Polymerizable Acrylamide-Based Deep Eutectic Solvents for Flexible Thermoelectric Devices", authors:[{name:"SAS Eldib"},{name:"MIM Abdelaziz"},{name:"GE Khedr"},{name:"HN Akl"},{name:"Nageh K. Allam"}], venue:"ACS Applied Engineering Materials 4, 1551–1560", externalIds:{} },
  { year:2026, citationCount:0, title:"Integrated CO₂ Capture and Conversion: Dual-Functional Materials, Mechanisms, and Pathways to Industrial Decarbonization", authors:[{name:"MA Elokl"},{name:"AG Ali"},{name:"AM Abdelmohsen"},{name:"Nageh K. Allam"}], venue:"EES Catalysis (RSC Publishing)", externalIds:{DOI:"10.1039/d5ey00322a"} },
  { year:2026, citationCount:0, title:"Ultralow-Loading Co₂VO₄ Nanoparticles Embedded in PMMA/PVDF Nanocomposite Membranes for UV and Blue Light Attenuation", authors:[{name:"Esraa Mourad"},{name:"GE Khedr"},{name:"Nageh K. Allam"}], venue:"ACS Omega", externalIds:{DOI:"10.1021/acsomega.5c11512"} },
];

const AVATAR_COLORS = [
  ["#dde8f5","#1e4080"],["#fef3d7","#7a5000"],["#d4f0e4","#1a6a3a"],
  ["#f5dde8","#7a1e48"],["#e8e0f5","#4a1e80"],["#fde8d4","#8a3a10"],
  ["#d4eef5","#1a5a70"],["#d4f5e4","#1a704a"],["#f5e8d4","#705a1a"],
  ["#e8f5d4","#3a701a"],["#f5d4e8","#701a5a"],["#d4d8f5","#1a2080"],
];
function getInitials(name) {
  const clean = name.replace(/^(Dr\.|Prof\.)\s+/,"").split(" ").filter(Boolean);
  return clean.length >= 2 ? (clean[0][0]+clean[clean.length-1][0]).toUpperCase() : (clean[0]||"?").slice(0,2).toUpperCase();
}

async function apiLoad() {
  try {
    const r = await fetch("/api/save-overrides");
    const text = await r.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch { return null; }
}
async function apiSave(password, data) {
  const r = await fetch("/api/save-overrides", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({token:password,...data}) });
  const text = await r.text();
  try { return JSON.parse(text); } catch { return {error:"Invalid response"}; }
}
async function fetchSemanticPapers() {
  const base = `https://api.semanticscholar.org/graph/v1/author/${AUTHOR_ID}/papers?fields=title,year,authors,venue,externalIds,citationCount,openAccessPdf&limit=200`;
  for (const url of [base, `https://corsproxy.io/?url=${encodeURIComponent(base)}`]) {
    try {
      const r = await fetch(url, {headers:{Accept:"application/json"}});
      if (!r.ok) continue;
      const raw = await r.json();
      const data = raw.contents ? JSON.parse(raw.contents) : raw;
      const papers = (data.data||[]).filter(p=>p.year&&p.title).sort((a,b)=>(b.year||0)-(a.year||0));
      if (papers.length > 0) return papers;
    } catch { continue; }
  }
  return [];
}

function readFileAsDataURL(file) {
  return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.onerror=rej; r.readAsDataURL(file); });
}

function EMLLogo({size=44,style={}}) {
  return <img src={`${import.meta.env.BASE_URL}EML_logo.png`} alt="EML" style={{height:size,objectFit:"contain",filter:"brightness(10) saturate(0.8) sepia(0.3)",...style}} />;
}
function AUCLogo({style={}}) {
  return <img src={`${import.meta.env.BASE_URL}AUC_logo.png`} alt="AUC" style={{height:34,objectFit:"contain",filter:"brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(1.8)",...style}} onError={e=>e.target.style.display="none"} />;
}
function StatusBadge({status}) {
  const map={Granted:["#d4f0e4","#1a6a3a"],Pending:["#fef3d7","#7a5000"],Provisional:["#dde8f5","#1e4080"]};
  const [bg,color]=(map[status]||map.Provisional);
  return <span style={{fontSize:10,fontFamily:"Space Mono",fontWeight:700,letterSpacing:"0.08em",padding:"2px 9px",borderRadius:20,background:bg,color}}>{status.toUpperCase()}</span>;
}
function MemberPhoto({member,size={w:160,h:200},style={}}) {
  const src = member.photo ? (member.photo.startsWith("data:") ? member.photo : `${import.meta.env.BASE_URL}${member.photo}`) : null;
  const [bg,color] = AVATAR_COLORS[0];
  return src
    ? <img src={src} alt={member.name} style={{width:size.w,height:size.h,objectFit:"cover",objectPosition:"center top",display:"block",flexShrink:0,...style}} onError={e=>e.target.style.display="none"} />
    : <div style={{width:size.w,height:size.h,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:bg,color,fontFamily:"'Libre Baskerville',serif",fontSize:Math.floor(size.w*0.22),fontWeight:700,...style}}>{getInitials(member.name)}</div>;
}

// ── ADMIN INPUT HELPERS ──
const inp = {width:"100%",padding:"8px 10px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.15)",color:"white",fontFamily:"Outfit,sans-serif",fontSize:13,outline:"none",borderRadius:2,boxSizing:"border-box"};
const lbl = {fontSize:10,color:"#8a9ab0",fontFamily:"Space Mono",display:"block",marginBottom:5,letterSpacing:"0.06em",textTransform:"uppercase"};
const pBtn = {padding:"9px 18px",fontFamily:"Space Mono",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderRadius:2,border:"none",background:"#f0b429",color:"#0a162e",fontWeight:700};
const gBtn = {padding:"9px 18px",fontFamily:"Space Mono",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderRadius:2,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.5)"};
const dBtn = {padding:"5px 10px",fontFamily:"Space Mono",fontSize:9,cursor:"pointer",borderRadius:2,border:"1px solid rgba(224,85,85,0.4)",background:"transparent",color:"#e05555"};
const eBtn = {padding:"5px 10px",fontFamily:"Space Mono",fontSize:9,cursor:"pointer",borderRadius:2,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.6)"};

function AdminInput({label,value,onChange,type="text",rows}) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      {rows ? <textarea style={{...inp,resize:"vertical"}} rows={rows} value={value} onChange={onChange} /> : <input type={type} style={inp} value={value} onChange={onChange} />}
    </div>
  );
}

function PhotoUpload({label,hasPhoto,onUpload,onRemove}) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"8px 12px",border:"1px dashed rgba(240,180,41,0.4)",color:"#f0b429",fontFamily:"Space Mono",fontSize:10,borderRadius:2}}>
        {hasPhoto ? "✓ Photo uploaded — Change" : "📁 Upload photo"}
        <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{const f=e.target.files[0];if(!f)return;onUpload(await readFileAsDataURL(f));}} />
      </label>
      {hasPhoto && <button style={{...dBtn,width:"100%",marginTop:5,padding:6}} onClick={onRemove}>Remove Photo</button>}
    </div>
  );
}

function AdminPanel({site,setSite,onClose,adminPw}) {
  const [tab,setTab] = useState("hero");
  const [saving,setSaving] = useState(false);
  const [msg,setMsg] = useState("");
  const [editingMember,setEditingMember] = useState(null);
  const [mForm,setMForm] = useState({});
  const [editingPatent,setEditingPatent] = useState(null);
  const [pForm,setPForm] = useState({});
  const [addingPaper,setAddingPaper] = useState(false);
  const [paperForm,setPaperForm] = useState({title:"",authors:"",venue:"",year:String(new Date().getFullYear()),doi:""});

  const save = async () => {
    setSaving(true); setMsg("");
    try {
      const res = await apiSave(adminPw,{siteData:site});
      setMsg(res?.ok ? "✓ Saved! All changes are live." : "✗ "+(res?.error||"Failed"));
    } catch(e){setMsg("✗ "+e.message);}
    setSaving(false);
    setTimeout(()=>setMsg(""),7000);
  };

  const upd = (key,val) => setSite(s=>({...s,[key]:val}));
  const updHero = (k,v) => setSite(s=>({...s,hero:{...s.hero,[k]:v}}));
  const updStat = (i,k,v) => {const st=[...site.hero.stats];st[i]={...st[i],[k]:v};updHero("stats",st);};
  const updAbout = (k,v) => setSite(s=>({...s,about:{...s.about,[k]:v}}));
  const updPi = (k,v) => setSite(s=>({...s,pi:{...s.pi,[k]:v}}));

  const TABS = ["hero","about","team","patents","papers","save"];

  return (
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:9000,background:"rgba(5,12,30,0.7)",backdropFilter:"blur(4px)"}} />
      <div style={{position:"fixed",top:0,right:0,bottom:0,zIndex:9001,width:430,background:"#0a162e",borderLeft:"2px solid #f0b429",display:"flex",flexDirection:"column",boxShadow:"-12px 0 60px rgba(0,0,0,0.8)"}}>
        {/* Header */}
        <div style={{padding:"14px 18px",borderBottom:"1px solid rgba(240,180,41,0.15)",background:"#060f1e",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <p style={{fontSize:13,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700}}>⚙ EML Admin Panel</p>
            <p style={{fontSize:9,color:"#1a9e75",fontFamily:"Space Mono"}}>All edits save to cloud · Ctrl+Shift+A to toggle</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"1px solid #333",color:"#888",padding:"4px 10px",cursor:"pointer",fontFamily:"Space Mono",fontSize:10}}>✕</button>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",borderBottom:"1px solid rgba(240,180,41,0.1)",flexShrink:0}}>
          {TABS.map(t=><button key={t} onClick={()=>{setTab(t);setEditingMember(null);setEditingPatent(null);setAddingPaper(false);}} style={{flex:1,padding:"9px 4px",fontSize:9,fontFamily:"Space Mono",background:tab===t?"rgba(240,180,41,0.07)":"transparent",color:tab===t?"#f0b429":"rgba(255,255,255,0.35)",border:"none",borderBottom:tab===t?"2px solid #f0b429":"2px solid transparent",cursor:"pointer",letterSpacing:"0.05em",textTransform:"uppercase"}}>{t==="save"?"💾 Save":t}</button>)}
        </div>
        {/* Body */}
        <div style={{flex:1,overflowY:"auto",padding:16}}>

          {/* HERO TAB */}
          {tab==="hero" && (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>Hero Section</p>
              <AdminInput label="Eyebrow text" value={site.hero.eyebrow} onChange={e=>updHero("eyebrow",e.target.value)} />
              <AdminInput label="Lab Title" value={site.hero.title} onChange={e=>updHero("title",e.target.value)} />
              <AdminInput label="Subtitle / Description" value={site.hero.subtitle} onChange={e=>updHero("subtitle",e.target.value)} rows={4} />
              <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:8}}>Stats Strip</p>
              {site.hero.stats.map((s,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,background:"rgba(255,255,255,0.04)",padding:10,borderRadius:2}}>
                  <AdminInput label={`Number ${i+1}`} value={s.num} onChange={e=>updStat(i,"num",e.target.value)} />
                  <AdminInput label={`Label ${i+1}`} value={s.label} onChange={e=>updStat(i,"label",e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {/* ABOUT TAB */}
          {tab==="about" && (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase"}}>About / Research Section</p>
              <AdminInput label="Paragraph 1" value={site.about.p1} onChange={e=>updAbout("p1",e.target.value)} rows={4} />
              <AdminInput label="Paragraph 2" value={site.about.p2} onChange={e=>updAbout("p2",e.target.value)} rows={4} />
              <AdminInput label="Paragraph 3" value={site.about.p3} onChange={e=>updAbout("p3",e.target.value)} rows={4} />
              <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:8}}>PI Card</p>
              <AdminInput label="Name" value={site.pi.name} onChange={e=>updPi("name",e.target.value)} />
              <AdminInput label="Title / Position" value={site.pi.title} onChange={e=>updPi("title",e.target.value)} />
              <AdminInput label="Biography" value={site.pi.bio} onChange={e=>updPi("bio",e.target.value)} rows={4} />
              <AdminInput label="Email" value={site.pi.email} onChange={e=>updPi("email",e.target.value)} />
              <AdminInput label="Google Scholar URL" value={site.pi.scholar} onChange={e=>updPi("scholar",e.target.value)} />
              <AdminInput label="AUC Profile URL" value={site.pi.aucProfile} onChange={e=>updPi("aucProfile",e.target.value)} />
              <PhotoUpload label="PI Photo" hasPhoto={!!site.pi.photo} onUpload={d=>updPi("photo",d)} onRemove={()=>updPi("photo",null)} />
            </div>
          )}

          {/* TEAM TAB */}
          {tab==="team" && (
            <div>
              {editingMember && (
                <div style={{background:"rgba(240,180,41,0.05)",border:"1px solid rgba(240,180,41,0.3)",padding:14,borderRadius:2,marginBottom:12}}>
                  <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{editingMember.isNew?"Add New Member":"Edit Member"}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[["name","Full Name *"],["role","Role / Position *"],["note","Short Note"],["email","Email"],["scholar","Google Scholar URL"]].map(([k,l])=>(
                      <AdminInput key={k} label={l} value={mForm[k]||""} onChange={e=>setMForm(f=>({...f,[k]:e.target.value}))} />
                    ))}
                    <div>
                      <label style={lbl}>Research Interests (comma separated)</label>
                      <input style={inp} value={Array.isArray(mForm.interests)?mForm.interests.join(", "):mForm.interests||""} onChange={e=>setMForm(f=>({...f,interests:e.target.value}))} />
                    </div>
                    <PhotoUpload label="Member Photo" hasPhoto={!!mForm.photo&&mForm.photo.startsWith("data:")} onUpload={d=>setMForm(f=>({...f,photo:d}))} onRemove={()=>setMForm(f=>({...f,photo:null}))} />
                    <div style={{display:"flex",gap:8,marginTop:4}}>
                      <button style={pBtn} onClick={()=>{
                        const interests = typeof mForm.interests==="string" ? mForm.interests.split(",").map(s=>s.trim()).filter(Boolean) : mForm.interests||[];
                        const member = {...mForm,interests};
                        setSite(s=>{
                          const groups = s.teamGroups.map((g,i)=>{
                            if(i!==editingMember.groupIdx) return g;
                            if(editingMember.isNew) return {...g,members:[...g.members,member]};
                            return {...g,members:g.members.map((m,j)=>j===editingMember.memberIdx?member:m)};
                          });
                          return {...s,teamGroups:groups};
                        });
                        setEditingMember(null);
                      }}>Save Member</button>
                      <button style={gBtn} onClick={()=>setEditingMember(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
              {!editingMember && site.teamGroups.map((group,gi)=>(
                <div key={gi} style={{marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                    <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700}}>{group.label} ({group.members.length})</p>
                    <button style={{...eBtn,padding:"4px 10px"}} onClick={()=>{setMForm({name:"",role:"",note:"",interests:"",email:"",scholar:"",photo:null});setEditingMember({groupIdx:gi,isNew:true});}}>+ Add</button>
                  </div>
                  {group.members.map((m,mi)=>(
                    <div key={mi} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:2,marginBottom:4}}>
                      <MemberPhoto member={m} size={{w:32,h:32}} />
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:11,color:"rgba(255,255,255,0.85)",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.name}</p>
                        <p style={{fontSize:9,color:"#8a9ab0",fontFamily:"Space Mono"}}>{m.role}</p>
                      </div>
                      <div style={{display:"flex",gap:4,flexShrink:0}}>
                        <button style={eBtn} onClick={()=>{setMForm({...m,interests:Array.isArray(m.interests)?m.interests.join(", "):m.interests||""});setEditingMember({groupIdx:gi,memberIdx:mi,isNew:false});}}>Edit</button>
                        <button style={dBtn} onClick={()=>setSite(s=>({...s,teamGroups:s.teamGroups.map((g,i)=>i===gi?{...g,members:g.members.filter((_,j)=>j!==mi)}:g)}))}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              {!editingMember && (
                <div style={{marginTop:12,borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:12}}>
                  <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700,marginBottom:8}}>ADD NEW GROUP</p>
                  <div style={{display:"flex",gap:8}}>
                    <input style={{...inp,flex:1}} placeholder="e.g. Visiting Researchers" id="newGroupInput" />
                    <button style={pBtn} onClick={()=>{const v=document.getElementById("newGroupInput").value.trim();if(!v)return;setSite(s=>({...s,teamGroups:[...s.teamGroups,{label:v,members:[]}]}));document.getElementById("newGroupInput").value="";}}>Add</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PATENTS TAB */}
          {tab==="patents" && (
            <div>
              {editingPatent && (
                <div style={{background:"rgba(30,64,128,0.1)",border:"1px solid rgba(30,64,128,0.3)",padding:14,borderRadius:2,marginBottom:12}}>
                  <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>{editingPatent.isNew?"Add Patent":"Edit Patent"}</p>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[["title","Title *"],["number","Patent Number"],["inventors","Inventors"],["assignee","Assignee"],["filed","Filed Year"],["url","Google Patents URL"]].map(([k,l])=>(
                      <AdminInput key={k} label={l} value={pForm[k]||""} onChange={e=>setPForm(f=>({...f,[k]:e.target.value}))} />
                    ))}
                    <div>
                      <label style={lbl}>Status</label>
                      <select style={{...inp,background:"#0a162e",color:"white"}} value={pForm.status||"Provisional"} onChange={e=>setPForm(f=>({...f,status:e.target.value}))}>
                        <option>Provisional</option><option>Pending</option><option>Granted</option>
                      </select>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button style={pBtn} onClick={()=>{
                        setSite(s=>({...s,patents:editingPatent.isNew?[pForm,...s.patents]:s.patents.map((p,i)=>i===editingPatent.idx?pForm:p)}));
                        setEditingPatent(null);
                      }}>Save Patent</button>
                      <button style={gBtn} onClick={()=>setEditingPatent(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
              {!editingPatent && <button style={{...pBtn,width:"100%",marginBottom:12}} onClick={()=>{setPForm({number:"",title:"",inventors:"",assignee:"The American University in Cairo",filed:String(new Date().getFullYear()),status:"Provisional",url:""});setEditingPatent({isNew:true});}}>+ Add New Patent</button>}
              {!editingPatent && site.patents.map((p,i)=>(
                <div key={i} style={{padding:"10px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:2,marginBottom:6}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                    <div style={{flex:1,minWidth:0}}>
                      <StatusBadge status={p.status} />
                      <p style={{fontSize:11,color:"rgba(255,255,255,0.85)",marginTop:5,lineHeight:1.4}}>{p.title}</p>
                      <p style={{fontSize:9,color:"#8a9ab0",fontFamily:"Space Mono",marginTop:3}}>{p.number} · Filed {p.filed}</p>
                    </div>
                    <div style={{display:"flex",gap:4,flexShrink:0}}>
                      <button style={eBtn} onClick={()=>{setPForm({...p});setEditingPatent({idx:i,isNew:false});}}>Edit</button>
                      <button style={dBtn} onClick={()=>setSite(s=>({...s,patents:s.patents.filter((_,j)=>j!==i)}))}>✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAPERS TAB */}
          {tab==="papers" && (
            <div>
              {addingPaper && (
                <div style={{background:"rgba(26,158,117,0.07)",border:"1px solid rgba(26,158,117,0.25)",padding:14,borderRadius:2,marginBottom:12}}>
                  <p style={{fontSize:10,color:"#1a9e75",fontFamily:"Space Mono",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:12}}>Add Publication</p>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[["title","Title *"],["authors","Authors (comma separated) *"],["venue","Journal / Venue *"],["year","Year *"],["doi","DOI (optional)"]].map(([k,l])=>(
                      <AdminInput key={k} label={l} value={paperForm[k]||""} onChange={e=>setPaperForm(f=>({...f,[k]:e.target.value}))} />
                    ))}
                    <div style={{display:"flex",gap:8}}>
                      <button style={pBtn} onClick={()=>{
                        if(!paperForm.title.trim()) return;
                        const paper={year:parseInt(paperForm.year)||new Date().getFullYear(),citationCount:0,title:paperForm.title,authors:paperForm.authors.split(",").map(a=>({name:a.trim()})),venue:paperForm.venue,externalIds:paperForm.doi?{DOI:paperForm.doi}:{}};
                        setSite(s=>({...s,extraPapers:[paper,...(s.extraPapers||[])]}));
                        setPaperForm({title:"",authors:"",venue:"",year:String(new Date().getFullYear()),doi:""});
                        setAddingPaper(false);
                      }}>Add Paper</button>
                      <button style={gBtn} onClick={()=>setAddingPaper(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
              {!addingPaper && <button style={{...pBtn,width:"100%",marginBottom:12}} onClick={()=>setAddingPaper(true)}>+ Add Publication Manually</button>}
              {(site.extraPapers||[]).length > 0 && (
                <>
                  <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700,marginBottom:8}}>MANUALLY ADDED ({site.extraPapers.length})</p>
                  {(site.extraPapers||[]).map((p,i)=>(
                    <div key={i} style={{padding:"8px 10px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(26,158,117,0.2)",borderRadius:2,marginBottom:5}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:11,color:"rgba(255,255,255,0.8)",lineHeight:1.35}}>{p.title}</p>
                          <p style={{fontSize:9,color:"#8a9ab0",fontFamily:"Space Mono",marginTop:3}}>{p.year} · {p.venue}</p>
                        </div>
                        <button style={{...dBtn,flexShrink:0}} onClick={()=>setSite(s=>({...s,extraPapers:s.extraPapers.filter((_,j)=>j!==i)}))}>✕</button>
                      </div>
                    </div>
                  ))}
                </>
              )}
              <p style={{fontSize:10,color:"rgba(255,255,255,0.25)",fontFamily:"Space Mono",marginTop:12,lineHeight:1.7}}>Publications auto-fetch from Semantic Scholar daily. Manually added papers appear at the top.</p>
            </div>
          )}

          {/* SAVE TAB */}
          {tab==="save" && (
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{background:"rgba(26,158,117,0.08)",border:"1px solid rgba(26,158,117,0.25)",padding:"12px 14px",borderRadius:2}}>
                <p style={{fontSize:10,color:"#1a9e75",fontFamily:"Space Mono",fontWeight:700,marginBottom:4}}>✓ VERCEL STORAGE CONNECTED</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.7}}>Changes save to GitHub Gist instantly. All edits restore on every page refresh.</p>
              </div>
              <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",padding:"12px 14px",borderRadius:2}}>
                <p style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>What Gets Saved</p>
                {["Hero section text & stats","About & PI card content","All team members & photos","All groups & new members","Patents list","Extra publications"].map(l=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
                    <span style={{width:6,height:6,borderRadius:"50%",background:"#f0b429",flexShrink:0}} />
                    <span style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{l}</span>
                  </div>
                ))}
              </div>
              <button style={{...pBtn,width:"100%",padding:14,fontSize:13,opacity:saving?0.6:1}} disabled={saving} onClick={save}>
                {saving?"⏳ Saving…":"💾 SAVE & PUBLISH ALL CHANGES"}
              </button>
              {msg && <div style={{padding:"10px 14px",background:msg.startsWith("✓")?"rgba(26,158,117,0.12)":"rgba(224,85,85,0.12)",border:`1px solid ${msg.startsWith("✓")?"rgba(26,158,117,0.3)":"rgba(224,85,85,0.3)"}`,borderRadius:2}}>
                <p style={{fontSize:11,fontFamily:"Space Mono",color:msg.startsWith("✓")?"#1a9e75":"#e05555"}}>{msg}</p>
              </div>}
            </div>
          )}
        </div>

        {/* Footer save shortcut */}
        {tab!=="save" && (
          <div style={{padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",background:"#060f1e",flexShrink:0}}>
            <button style={{...pBtn,width:"100%",padding:10,opacity:saving?0.6:1}} disabled={saving} onClick={save}>
              {saving?"⏳ Saving…":"💾 Save All Changes"}
            </button>
            {msg && <p style={{fontSize:10,fontFamily:"Space Mono",color:msg.startsWith("✓")?"#1a9e75":"#e05555",textAlign:"center",marginTop:6}}>{msg}</p>}
          </div>
        )}
      </div>
    </>
  );
}

function LoginModal({onSuccess,onClose}) {
  const [pw,setPw] = useState("");
  const [err,setErr] = useState(false);
  const [loading,setLoading] = useState(false);
  const attempt = async () => {
    setLoading(true);
    const h = await sha256(pw);
    if(h===ADMIN_HASH){onSuccess(pw);}else{setErr(true);setLoading(false);}
  };
  return (
    <div style={{position:"fixed",inset:0,zIndex:10000,background:"rgba(5,10,25,0.98)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#0d1d38",border:"1px solid #f0b429",padding:"40px 48px",width:340,textAlign:"center",borderRadius:4}}>
        <p style={{fontFamily:"'Libre Baskerville',serif",fontSize:22,color:"#f0b429",marginBottom:6}}>EML Admin</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontFamily:"Space Mono",marginBottom:24}}>Password required</p>
        <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} onKeyDown={e=>e.key==="Enter"&&attempt()} placeholder="Password" autoFocus
          style={{width:"100%",padding:"11px 14px",marginBottom:8,background:"rgba(255,255,255,0.05)",border:`1px solid ${err?"#e05555":"#f0b429"}`,color:"white",fontFamily:"Space Mono",fontSize:13,outline:"none",borderRadius:2,boxSizing:"border-box"}} />
        {err && <p style={{fontSize:11,color:"#e05555",fontFamily:"Space Mono",marginBottom:8}}>Wrong password</p>}
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <button style={{...pBtn,flex:1}} onClick={attempt} disabled={loading}>{loading?"…":"Login"}</button>
          <button style={{...gBtn,flex:1}} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function PublicationsSection({extraPapers}) {
  const [papers,setPapers] = useState(PAPERS_2026);
  const [search,setSearch] = useState("");
  const [showAll,setShowAll] = useState(false);
  const [lastUpdated,setLastUpdated] = useState(null);

  useEffect(()=>{
    const today=new Date().toISOString().slice(0,10);
    const key=`eml_papers_${today}`;
    const cached=sessionStorage.getItem(key);
    if(cached){try{const{merged,ts}=JSON.parse(cached);setPapers(merged);setLastUpdated(new Date(ts));return;}catch{}}
    fetchSemanticPapers().then(fetched=>{
      const filtered=fetched.filter(p=>!PAPERS_2026.some(p26=>p.title.toLowerCase().slice(0,40)===p26.title.toLowerCase().slice(0,40)));
      const merged=[...PAPERS_2026,...filtered];
      const ts=Date.now();
      sessionStorage.setItem(key,JSON.stringify({merged,ts}));
      Object.keys(sessionStorage).filter(k=>k.startsWith("eml_papers_")&&k!==key).forEach(k=>sessionStorage.removeItem(k));
      setPapers(merged);setLastUpdated(new Date(ts));
    }).catch(()=>{});
  },[]);

  const all=[...(extraPapers||[]),...papers];
  const filtered=all.filter(p=>!search?true:p.title.toLowerCase().includes(search.toLowerCase())||(p.venue||"").toLowerCase().includes(search.toLowerCase())||(p.authors||[]).some(a=>a.name.toLowerCase().includes(search.toLowerCase())));
  const visible=showAll?filtered:filtered.slice(0,12);

  return (
    <>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"#d4f0e4",color:"#1a6a3a",padding:"4px 12px",borderRadius:20,fontSize:11,fontFamily:"Space Mono",fontWeight:700}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"#1a6a3a",animation:"pulse 2s infinite",display:"inline-block"}} />LIVE · DAILY UPDATE
        </div>
        <span style={{fontSize:12,color:"#8a9ab0"}}>{papers.length} publications{lastUpdated&&` · Updated ${lastUpdated.toLocaleDateString()}`}</span>
        <a href={SCHOLAR_URL} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#1e4080",fontFamily:"Space Mono",textDecoration:"none",marginLeft:"auto"}}>Google Scholar ↗</a>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={{display:"flex",gap:10,marginBottom:20}}>
        <input style={{flex:1,padding:"10px 16px",border:"1px solid #d0d8e8",fontSize:14,fontFamily:"Outfit,sans-serif",outline:"none"}} placeholder="Search by title, author, or journal…" value={search} onChange={e=>{setSearch(e.target.value);setShowAll(false);}} />
        {search&&<button onClick={()=>setSearch("")} style={{padding:"0 14px",border:"1px solid #d0d8e8",background:"#f4f6fa",cursor:"pointer",color:"#8a9ab0",fontSize:18}}>×</button>}
      </div>
      <div style={{display:"flex",flexDirection:"column"}}>
        {visible.map((p,i)=>{
          const doi=p.externalIds?.DOI;const arxiv=p.externalIds?.ArXiv;const pdfUrl=p.openAccessPdf?.url;
          const url=doi?`https://doi.org/${doi}`:arxiv?`https://arxiv.org/abs/${arxiv}`:null;
          const authorNames=(p.authors||[]).map(a=>a.name);
          return (
            <div key={i} style={{padding:"22px 26px",background:"white",border:"1px solid #d0d8e8",borderTop:i===0?"1px solid #d0d8e8":"none",transition:"all 0.2s"}}
              onMouseOver={e=>{e.currentTarget.style.background="#f0f4ff";e.currentTarget.style.paddingLeft="30px";e.currentTarget.style.borderLeft="4px solid #1e4080";}}
              onMouseOut={e=>{e.currentTarget.style.background="white";e.currentTarget.style.paddingLeft="26px";e.currentTarget.style.borderLeft="";}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{fontSize:10,fontFamily:"Space Mono",color:"#f0b429",fontWeight:700}}>{p.year}</div>
                {p.citationCount>0&&<div style={{fontSize:10,fontFamily:"Space Mono",color:"#f0b429",background:"rgba(240,180,41,0.1)",padding:"2px 8px",borderRadius:20}}>{p.citationCount} citations</div>}
              </div>
              <p style={{fontFamily:"'Libre Baskerville',serif",fontSize:15,color:"#0a162e",lineHeight:1.45,marginBottom:8}}>
                {url?<a href={url} target="_blank" rel="noreferrer" style={{color:"inherit",textDecoration:"none"}} onMouseOver={e=>e.target.style.color="#1e4080"} onMouseOut={e=>e.target.style.color="inherit"}>{p.title}</a>:p.title}
              </p>
              <p style={{fontSize:13,color:"#4a6080",marginBottom:8}}>
                {authorNames.map((a,j)=><span key={j}><span style={a.includes("Allam")?{fontWeight:700,color:"#1e4080"}:{}}>{a}</span>{j<authorNames.length-1&&", "}</span>)}
              </p>
              {p.venue&&<span style={{fontSize:12,color:"#8a9ab0",fontStyle:"italic"}}>{p.venue}</span>}
              <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
                {url&&<a href={url} target="_blank" rel="noreferrer" style={{fontSize:10,padding:"2px 10px",border:"1px solid #b0bdd0",color:"#4a6080",fontFamily:"Space Mono",textDecoration:"none"}}>DOI</a>}
                {pdfUrl&&<a href={pdfUrl} target="_blank" rel="noreferrer" style={{fontSize:10,padding:"2px 10px",border:"1px solid #b0bdd0",color:"#4a6080",fontFamily:"Space Mono",textDecoration:"none"}}>PDF</a>}
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length>12&&(
        <div style={{marginTop:20,display:"flex",gap:16}}>
          <button onClick={()=>setShowAll(!showAll)} style={{background:"none",border:"1px solid #1e4080",color:"#1e4080",padding:"8px 20px",fontSize:12,fontFamily:"Space Mono",cursor:"pointer"}}>
            {showAll?`SHOW LESS ↑`:`SHOW ALL ${filtered.length} PAPERS ↓`}
          </button>
          <a href={SCHOLAR_URL} target="_blank" rel="noreferrer" style={{fontSize:12,fontFamily:"Space Mono",color:"#8a9ab0",textDecoration:"none",alignSelf:"center"}}>Full list on Google Scholar →</a>
        </div>
      )}
    </>
  );
}

export default function EMLWebsite() {
  const [site,setSite] = useState(DEFAULT_SITE);
  const [loaded,setLoaded] = useState(false);
  const [showLogin,setShowLogin] = useState(false);
  const [showPanel,setShowPanel] = useState(false);
  const [adminPw,setAdminPw] = useState("");

  useEffect(()=>{
    apiLoad().then(data=>{
      if(data?.siteData){
        setSite(prev=>({
          ...prev,...data.siteData,
          hero:{...prev.hero,...data.siteData.hero},
          about:{...prev.about,...data.siteData.about},
          pi:{...prev.pi,...data.siteData.pi},
          teamGroups:data.siteData.teamGroups||prev.teamGroups,
          patents:data.siteData.patents||prev.patents,
          extraPapers:data.siteData.extraPapers||prev.extraPapers,
          researchAreas:data.siteData.researchAreas||prev.researchAreas,
        }));
      }
      setLoaded(true);
    });
  },[]);

  useEffect(()=>{
    const h=e=>{if(e.ctrlKey&&e.shiftKey&&e.key==="A"){e.preventDefault();if(adminPw)setShowPanel(p=>!p);else setShowLogin(true);}};
    window.addEventListener("keydown",h);
    return()=>window.removeEventListener("keydown",h);
  },[adminPw]);

  if(!loaded) return (
    <div style={{minHeight:"100vh",background:"#0a162e",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{textAlign:"center"}}>
        <EMLLogo size={60} style={{marginBottom:20}} />
        <p style={{color:"rgba(255,255,255,0.4)",fontFamily:"Space Mono",fontSize:11,letterSpacing:"0.15em"}}>LOADING…</p>
      </div>
    </div>
  );

  const {hero,about,pi,teamGroups,patents,extraPapers} = site;
  const navLinks = ["Research","Publications","Patents","Team","Contact"];

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:"#f4f6fa"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Outfit',sans-serif;background:#f4f6fa;color:#0d1b2a}
        .nav-link{color:rgba(255,255,255,0.65);font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;font-family:'Space Mono',monospace;transition:color 0.2s}
        .nav-link:hover{color:#f0b429}
        .member-card{background:white;border:1px solid #d0d8e8;display:grid;grid-template-columns:160px 1fr;height:200px;overflow:hidden;transition:all 0.2s}
        .member-card:hover{border-color:#1e4080;transform:translateY(-3px);box-shadow:0 8px 24px rgba(30,64,128,0.12)}
        .team-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}
        @media(max-width:900px){.team-grid{grid-template-columns:1fr}.member-card{grid-template-columns:120px 1fr;height:160px}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      {showLogin&&<LoginModal onSuccess={pw=>{setAdminPw(pw);setShowLogin(false);setShowPanel(true);}} onClose={()=>setShowLogin(false)} />}
      {showPanel&&adminPw&&<AdminPanel site={site} setSite={setSite} onClose={()=>setShowPanel(false)} adminPw={adminPw} />}

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 40px",height:64,background:"rgba(10,22,46,0.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <EMLLogo size={40} /><div style={{width:1,height:28,background:"rgba(255,255,255,0.12)"}} /><AUCLogo />
        </div>
        <div style={{display:"flex",gap:28,alignItems:"center"}}>
          {navLinks.map(s=><a key={s} href={`#${s.toLowerCase()}`} className="nav-link">{s}</a>)}
        </div>
        <button onClick={()=>adminPw?setShowPanel(p=>!p):setShowLogin(true)} style={{padding:"6px 14px",background:"rgba(240,180,41,0.1)",border:"1px solid rgba(240,180,41,0.3)",color:"#f0b429",fontFamily:"Space Mono",fontSize:10,cursor:"pointer",letterSpacing:"0.08em",borderRadius:2}}>
          {showPanel?"✕ CLOSE":"⚙ ADMIN"}
        </button>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",background:"linear-gradient(160deg,#0a162e 0%,#0e2040 55%,#112a50 100%)",display:"flex",alignItems:"center",padding:"100px 80px 80px",position:"relative",overflow:"hidden"}}>
        <img src={`${import.meta.env.BASE_URL}EML_logo.png`} alt="" aria-hidden style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",width:"55%",opacity:0.05,pointerEvents:"none"}} />
        <div style={{maxWidth:1100,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
          <p style={{fontSize:11,letterSpacing:"0.25em",color:"#f0b429",fontFamily:"Space Mono",textTransform:"uppercase",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
            <span style={{width:32,height:1,background:"#f0b429",display:"inline-block"}} />{hero.eyebrow}
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center",marginBottom:48}}>
            <div>
              <h1 style={{fontFamily:"'Libre Baskerville',serif",fontSize:48,fontWeight:700,lineHeight:1.1,color:"white",letterSpacing:"-0.02em",marginBottom:20}}>{hero.title}</h1>
              <p style={{fontSize:16,lineHeight:1.8,color:"rgba(255,255,255,0.62)",fontWeight:300,marginBottom:36}}>{hero.subtitle}</p>
              <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                <a href="#publications" style={{padding:"11px 26px",background:"#f0b429",color:"#0a162e",fontSize:12,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none"}}>Our Publications</a>
                <a href="#team" style={{padding:"11px 26px",background:"transparent",border:"1px solid rgba(255,255,255,0.3)",color:"rgba(255,255,255,0.8)",fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none"}}>Meet the Team</a>
                <a href="#patents" style={{padding:"11px 26px",background:"transparent",border:"1px solid rgba(255,255,255,0.3)",color:"rgba(255,255,255,0.8)",fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",textDecoration:"none"}}>Patents</a>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
              <img src={`${import.meta.env.BASE_URL}EML_logo.png`} alt="EML" style={{width:"85%",maxWidth:320,objectFit:"contain",filter:"brightness(10) saturate(0.8) sepia(0.3) drop-shadow(0 0 20px rgba(240,180,41,0.4))"}} />
            </div>
          </div>
          {/* PI mini card */}
          <div style={{display:"grid",gridTemplateColumns:"180px 1fr",border:"1px solid rgba(240,180,41,0.3)",borderLeft:"4px solid #f0b429",minHeight:160,overflow:"hidden",background:"rgba(255,255,255,0.04)"}}>
            <div style={{position:"relative",minHeight:160}}>
              <img src={pi.photo||(import.meta.env.BASE_URL+"nageh.jpg")} alt={pi.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 20%",display:"block",minHeight:160}} onError={e=>e.target.style.display="none"} />
            </div>
            <div style={{padding:"20px 24px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:4}}>
                <p style={{fontFamily:"'Libre Baskerville',serif",fontSize:20,color:"white",fontWeight:700,margin:0}}>{pi.name}</p>
                <span style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",background:"rgba(240,180,41,0.1)",padding:"2px 8px",borderRadius:2}}>Lab Director · PI</span>
              </div>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:8,fontFamily:"Space Mono"}}>{pi.title}</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.65}}>{pi.bio}</p>
              <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                {pi.scholar&&<a href={pi.scholar} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#f0b429",fontFamily:"Space Mono",textDecoration:"none",border:"1px solid rgba(240,180,41,0.4)",padding:"4px 12px"}}>Google Scholar</a>}
                {pi.email&&<a href={`mailto:${pi.email}`} style={{fontSize:11,color:"#f0b429",fontFamily:"Space Mono",textDecoration:"none",border:"1px solid rgba(240,180,41,0.4)",padding:"4px 12px"}}>Email</a>}
                {pi.aucProfile&&<a href={pi.aucProfile} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#f0b429",fontFamily:"Space Mono",textDecoration:"none",border:"1px solid rgba(240,180,41,0.4)",padding:"4px 12px"}}>AUC Profile</a>}
              </div>
            </div>
          </div>
          {/* Stats */}
          <div style={{display:"flex",gap:40,marginTop:32,paddingTop:24,borderTop:"1px solid rgba(255,255,255,0.07)"}}>
            {hero.stats.map(({num,label})=>(
              <div key={label}>
                <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:28,fontWeight:700,color:"#f0b429",lineHeight:1}}>{num}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"Space Mono",marginTop:4}}>{label}</div>
              </div>
            ))}
          </div>
          {/* Group photo */}
          <div style={{marginTop:36}}>
            <p style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"#f0b429",fontFamily:"Space Mono",marginBottom:12}}>● The EML Family</p>
            <img src={`${import.meta.env.BASE_URL}group-photo.png`} alt="EML Research Group" style={{width:"100%",borderRadius:4,border:"1px solid rgba(240,180,41,0.2)",objectFit:"cover",maxHeight:420,display:"block",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}} />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="research" style={{background:"#f4f6fa",padding:"96px 80px",maxWidth:1200,margin:"0 auto"}}>
        <p style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"#1e4080",fontFamily:"Space Mono",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:12}}>About Our Research<span style={{flex:"0 0 40px",height:2,background:"#f0b429"}} /></p>
        <h2 style={{fontFamily:"'Libre Baskerville',serif",fontSize:36,fontWeight:700,color:"#0a162e",lineHeight:1.2,marginBottom:40}}>Solving critical energy challenges<br />through materials science</h2>
        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:64,alignItems:"start"}}>
          <div>
            {[about.p1,about.p2,about.p3].map((p,i)=><p key={i} style={{fontSize:16,lineHeight:1.85,color:"#2c3e55",marginBottom:20,fontWeight:300}}>{p}</p>)}
          </div>
          <div>
            <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:"#1e4080",fontFamily:"Space Mono",fontWeight:700,marginBottom:16}}>Research Themes</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:28}}>
              {site.researchAreas.map(r=><span key={r} style={{padding:"5px 14px",border:"1.5px solid #1e4080",color:"#1e4080",fontSize:11,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"Space Mono"}}>{r}</span>)}
            </div>
            <div style={{padding:"20px 24px",background:"#0a162e",borderLeft:"3px solid #f0b429"}}>
              <p style={{fontSize:10,letterSpacing:"0.15em",color:"#f0b429",fontFamily:"Space Mono",marginBottom:8}}>DIRECTOR</p>
              <p style={{fontFamily:"'Libre Baskerville',serif",fontSize:16,color:"white",marginBottom:4}}>{pi.name}</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:12}}>Physics Dept., School of Sciences & Engineering<br />The American University in Cairo</p>
              {pi.scholar&&<a href={pi.scholar} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#f0b429",fontFamily:"Space Mono",textDecoration:"none"}}>Google Scholar →</a>}
            </div>
          </div>
        </div>
      </section>

      {/* PUBLICATIONS */}
      <div style={{background:"#edf0f7"}}>
        <div id="publications" style={{maxWidth:1200,margin:"0 auto",padding:"96px 80px"}}>
          <p style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"#1e4080",fontFamily:"Space Mono",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:12}}>Selected Publications<span style={{flex:"0 0 40px",height:2,background:"#f0b429"}} /></p>
          <h2 style={{fontFamily:"'Libre Baskerville',serif",fontSize:36,fontWeight:700,color:"#0a162e",marginBottom:40}}>Recent Research Output</h2>
          <PublicationsSection extraPapers={extraPapers} />
        </div>
      </div>

      {/* PATENTS */}
      <section id="patents" style={{background:"#f4f6fa",padding:"96px 80px",maxWidth:1200,margin:"0 auto"}}>
        <p style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"#1e4080",fontFamily:"Space Mono",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:12}}>Intellectual Property<span style={{flex:"0 0 40px",height:2,background:"#f0b429"}} /></p>
        <h2 style={{fontFamily:"'Libre Baskerville',serif",fontSize:36,fontWeight:700,color:"#0a162e",marginBottom:40}}>Patents & Inventions</h2>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
          <span style={{display:"inline-flex",alignItems:"center",gap:6,background:"#dde8f5",color:"#1e4080",padding:"4px 12px",borderRadius:20,fontSize:11,fontFamily:"Space Mono",fontWeight:700}}>📋 {patents.length} PATENTS</span>
          <a href="https://patents.google.com/patent/search?inventor=Nageh+Allam" target="_blank" rel="noreferrer" style={{fontSize:11,color:"#1e4080",fontFamily:"Space Mono",textDecoration:"none",marginLeft:"auto"}}>Search Google Patents ↗</a>
        </div>
        <div style={{display:"flex",flexDirection:"column"}}>
          {patents.map((p,i)=>(
            <div key={i} style={{padding:"22px 28px",background:"white",border:"1px solid #d0d8e8",borderTop:i===0?"1px solid #d0d8e8":"none",display:"flex",gap:20,alignItems:"flex-start",transition:"all 0.2s"}}
              onMouseOver={e=>{e.currentTarget.style.background="#f0f4ff";e.currentTarget.style.borderLeft="4px solid #1e4080";e.currentTarget.style.paddingLeft="24px";}}
              onMouseOut={e=>{e.currentTarget.style.background="white";e.currentTarget.style.borderLeft="";e.currentTarget.style.paddingLeft="28px";}}>
              <div style={{flexShrink:0,width:40,height:40,background:"#edf0f7",border:"1px solid #d0d8e8",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:2}}><span style={{fontSize:20}}>📋</span></div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:7,flexWrap:"wrap"}}>
                  <StatusBadge status={p.status} />
                  <span style={{fontSize:10,fontFamily:"Space Mono",color:"#8a9ab0"}}>{p.number}</span>
                  <span style={{fontSize:10,fontFamily:"Space Mono",color:"#f0b429"}}>Filed {p.filed}</span>
                </div>
                <p style={{fontFamily:"'Libre Baskerville',serif",fontSize:15,color:"#0a162e",lineHeight:1.4,marginBottom:7}}>
                  {p.url?<a href={p.url} target="_blank" rel="noreferrer" style={{color:"inherit",textDecoration:"none"}} onMouseOver={e=>e.target.style.color="#1e4080"} onMouseOut={e=>e.target.style.color="inherit"}>{p.title}</a>:p.title}
                </p>
                <p style={{fontSize:12,color:"#4a6080",marginBottom:3}}><span style={{color:"#1e4080",fontWeight:600}}>Inventors: </span>{p.inventors}</p>
                <p style={{fontSize:11,color:"#8a9ab0",fontFamily:"Space Mono"}}>{p.assignee}</p>
              </div>
              {p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{fontSize:10,fontFamily:"Space Mono",color:"#1e4080",border:"1px solid #d0d8e8",padding:"4px 10px",textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}} onMouseOver={e=>{e.currentTarget.style.background="#1e4080";e.currentTarget.style.color="white";}} onMouseOut={e=>{e.currentTarget.style.background="";e.currentTarget.style.color="#1e4080";}}>View ↗</a>}
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <div style={{background:"#edf0f7"}}>
        <div id="team" style={{maxWidth:1200,margin:"0 auto",padding:"96px 80px"}}>
          <p style={{fontSize:11,letterSpacing:"0.25em",textTransform:"uppercase",color:"#1e4080",fontFamily:"Space Mono",fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",gap:12}}>Meet the Team<span style={{flex:"0 0 40px",height:2,background:"#f0b429"}} /></p>
          <h2 style={{fontFamily:"'Libre Baskerville',serif",fontSize:36,fontWeight:700,color:"#0a162e",marginBottom:40}}>Research Group Members</h2>
          {/* PI Card */}
          <div style={{display:"grid",gridTemplateColumns:"200px 1fr",height:240,overflow:"hidden",border:"1px solid #f0b429",marginBottom:40,boxShadow:"0 4px 20px rgba(240,180,41,0.12)"}}>
            <img src={pi.photo||(import.meta.env.BASE_URL+"nageh.jpg")} alt={pi.name} style={{width:200,height:240,objectFit:"cover",objectPosition:"center 15%",display:"block"}} onError={e=>e.target.style.display="none"} />
            <div style={{background:"#0a162e",padding:"28px 32px",display:"flex",flexDirection:"column",justifyContent:"center",borderLeft:"4px solid #f0b429"}}>
              <span style={{fontSize:10,color:"#f0b429",fontFamily:"Space Mono",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6}}>Principal Investigator</span>
              <p style={{fontFamily:"'Libre Baskerville',serif",fontSize:22,color:"white",fontWeight:700,marginBottom:4}}>{pi.name}</p>
              <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",fontFamily:"Space Mono",marginBottom:14}}>{pi.title}</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.65)",lineHeight:1.75,marginBottom:14}}>{pi.bio}</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {pi.scholar&&<a href={pi.scholar} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#f0b429",fontFamily:"Space Mono",textDecoration:"none",border:"1px solid rgba(240,180,41,0.4)",padding:"4px 12px"}}>Google Scholar</a>}
                {pi.email&&<a href={`mailto:${pi.email}`} style={{fontSize:11,color:"#f0b429",fontFamily:"Space Mono",textDecoration:"none",border:"1px solid rgba(240,180,41,0.4)",padding:"4px 12px"}}>Email</a>}
                {pi.aucProfile&&<a href={pi.aucProfile} target="_blank" rel="noreferrer" style={{fontSize:11,color:"#f0b429",fontFamily:"Space Mono",textDecoration:"none",border:"1px solid rgba(240,180,41,0.4)",padding:"4px 12px"}}>AUC Profile</a>}
              </div>
            </div>
          </div>
          {/* Groups */}
          {teamGroups.map((group,gi)=>(
            <div key={gi} style={{marginBottom:40}}>
              <p style={{fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:"#1e4080",fontFamily:"Space Mono",fontWeight:700,margin:"0 0 16px",paddingBottom:8,borderBottom:"1px solid #d0d8e8"}}>
                {group.label} <span style={{color:"#8a9ab0",fontWeight:400}}>({group.members.length})</span>
              </p>
              <div className="team-grid">
                {group.members.map((m,mi)=>(
                  <div key={mi} className="member-card">
                    <MemberPhoto member={m} size={{w:160,h:200}} />
                    <div style={{padding:"14px 16px",display:"flex",flexDirection:"column",justifyContent:"center",borderLeft:"3px solid #f0b429",overflow:"hidden",height:200,boxSizing:"border-box"}}>
                      <p style={{fontSize:13,fontWeight:600,color:"#0a162e",marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.name}</p>
                      <p style={{fontSize:9,color:"#f0b429",fontFamily:"Space Mono",letterSpacing:"0.05em",marginBottom:6,textTransform:"uppercase"}}>{m.role}</p>
                      {m.note&&<p style={{fontSize:11,color:"#8a9ab0",marginBottom:6,lineHeight:1.4}}>{m.note}</p>}
                      <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>
                        {(m.interests||[]).slice(0,3).map(t=><span key={t} style={{fontSize:9,color:"#4a6080",background:"#edf0f7",padding:"2px 6px"}}>{t}</span>)}
                      </div>
                      <div style={{display:"flex",gap:5,marginTop:"auto"}}>
                        {m.scholar&&<a href={m.scholar} target="_blank" rel="noreferrer" style={{fontSize:9,color:"#1e4080",fontFamily:"Space Mono",textDecoration:"none",border:"1px solid #d0d8e8",padding:"2px 6px"}}>Scholar</a>}
                        {m.email&&<a href={`mailto:${m.email}`} style={{fontSize:9,color:"#8a9ab0",fontFamily:"Space Mono",textDecoration:"none",border:"1px solid #d0d8e8",padding:"2px 6px"}}>Email</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:"#060f1e",color:"rgba(255,255,255,0.5)",padding:"64px 80px 32px"}} id="contact">
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48,maxWidth:1200,margin:"0 auto 48px"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}><EMLLogo size={44}/><div style={{width:1,height:32,background:"rgba(255,255,255,0.1)"}}/><AUCLogo /></div>
            <p style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.4)",maxWidth:240}}>Energy Materials Laboratory<br/>Physics Department, School of Sciences & Engineering<br/>The American University in Cairo<br/>New Cairo 11835, Egypt</p>
            {pi.email&&<a href={`mailto:${pi.email}`} style={{display:"block",marginTop:16,fontSize:13,color:"#f0b429",textDecoration:"none"}}>{pi.email}</a>}
          </div>
          <div>
            <p style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"#f0b429",fontFamily:"Space Mono",marginBottom:16}}>Navigate</p>
            {navLinks.map(l=><a key={l} href={`#${l.toLowerCase()}`} style={{display:"block",fontSize:13,color:"rgba(255,255,255,0.45)",textDecoration:"none",marginBottom:10}}>{l}</a>)}
          </div>
          <div>
            <p style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"#f0b429",fontFamily:"Space Mono",marginBottom:16}}>External</p>
            {pi.scholar&&<a href={pi.scholar} target="_blank" rel="noreferrer" style={{display:"block",fontSize:13,color:"rgba(255,255,255,0.45)",textDecoration:"none",marginBottom:10}}>Google Scholar</a>}
            <a href="https://www.aucegypt.edu" target="_blank" rel="noreferrer" style={{display:"block",fontSize:13,color:"rgba(255,255,255,0.45)",textDecoration:"none",marginBottom:10}}>AUC Website</a>
            {pi.email&&<a href={`mailto:${pi.email}`} style={{display:"block",fontSize:13,color:"rgba(255,255,255,0.45)",textDecoration:"none"}}>Contact PI</a>}
          </div>
          <div>
            <p style={{fontSize:10,letterSpacing:"0.2em",textTransform:"uppercase",color:"#f0b429",fontFamily:"Space Mono",marginBottom:16}}>Research Areas</p>
            {["Solar Energy","Green Hydrogen","CO₂ Conversion","Energy Storage"].map(a=><a key={a} href="#research" style={{display:"block",fontSize:13,color:"rgba(255,255,255,0.45)",textDecoration:"none",marginBottom:10}}>{a}</a>)}
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:24,fontSize:12,textAlign:"center",maxWidth:1200,margin:"0 auto"}}>
          © {new Date().getFullYear()} Energy Materials Laboratory · The American University in Cairo · All rights reserved.
        </div>
      </footer>

      {/* Floating Admin Button */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:8999}}>
        <button onClick={()=>adminPw?setShowPanel(p=>!p):setShowLogin(true)} style={{padding:"10px 18px",background:showPanel?"#f0b429":"#0a162e",border:"1px solid #f0b429",color:showPanel?"#0a162e":"#f0b429",fontFamily:"Space Mono",fontSize:11,cursor:"pointer",letterSpacing:"0.08em",boxShadow:"0 4px 16px rgba(0,0,0,0.5)",borderRadius:2}}>
          {showPanel?"✕ Close Panel":"⚙ Admin Panel"}
        </button>
      </div>
    </div>
  );
}
