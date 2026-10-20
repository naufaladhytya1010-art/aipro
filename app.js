/* Master Prompt AI — frontend-only demo. API keys in a browser are not safe for public production apps. */
const $ = (s) => document.querySelector(s);
const STORAGE = { history: 'mpai_history_v1', favorites: 'mpai_favorites_v1', settings: 'mpai_settings_v1', language: 'mpai_language_v1' };
let currentPrompt = '';
let currentRecordId = null;
let language = localStorage.getItem(STORAGE.language) || 'id';
let typingTimer = null;

const translations = {
  id: {
    settings:'Pengaturan', eyebrow:'PROMPT ENGINEERING, DISEMPURNAKAN', heroTitle:'Ide biasa.<br><em>Prompt luar biasa.</em>',
    heroSub:'Ubah gagasan mentah menjadi master prompt yang jelas, terarah, dan siap menghasilkan karya terbaik dari AI.',
    sections:'bagian terstruktur', library:'LIBRARY', clear:'Hapus', newPrompt:'Prompt baru', recent:'RIWAYAT TERBARU',
    historyEmpty:'Prompt tersimpan akan muncul di sini.', localStorage:'Riwayat tersimpan di perangkat ini', promptBrief:'PROMPT BRIEF',
    startWithIdea:'Mulai dari ide kamu', ideaLabel:'IDE / INSTRUKSI AWAL',
    ideaPlaceholder:'Contoh: Buatkan prompt untuk desain logo kedai kopi premium bernama Kopi Senja...',
    ideaHint:'Tulis seadanya. AI akan membantu menyusun detailnya.', category:'KATEGORI', catCopy:'Teks / Copywriting',
    catImage:'Gambar (Midjourney / DALL·E)', catBusiness:'Bisnis', catEducation:'Pendidikan', catCustom:'Custom',
    targetAI:'TARGET AI', detailLevel:'TINGKAT DETAIL', short:'Singkat', standard:'Standar', ultra:'Ultra Detail',
    outputEnglish:'Hasil dalam bahasa Inggris', smartStructure:'Struktur adaptif', generate:'Buat Master Prompt', output:'OUTPUT',
    yourMasterPrompt:'Master prompt kamu', ready:'SIAP DIGUNAKAN', copy:'Salin', export:'Ekspor', regenerate:'Regenerate',
    improve:'Perbaiki / Tingkatkan', saveHistory:'Simpan ke Riwayat',
    apiDisclaimer:'Tanpa API, generator menggunakan template cerdas lokal. Hubungkan API di Pengaturan untuk generasi AI langsung.',
    settingsTitle:'Pengaturan AI', apiWarning:'API key disimpan hanya di localStorage browser ini. Jangan gunakan cara ini untuk aplikasi publik/produksi karena key dapat dilihat dari perangkat browser. Untuk produksi, gunakan backend proxy.',
    provider:'PROVIDER AI', localTemplate:'Template lokal (tanpa API)', apiKey:'API KEY', model:'MODEL (opsional)',
    cancel:'Batal', saveSettings:'Simpan Pengaturan', footer:'Dibuat untuk ide yang lebih besar.', ideaRequired:'Masukkan ide terlebih dahulu.',
    copied:'Prompt berhasil disalin.', saved:'Prompt disimpan ke riwayat.', noPrompt:'Buat prompt terlebih dahulu.', apiKeyMissing:'API key kosong. Isi di Pengaturan atau gunakan template lokal.',
    apiFailed:'Generasi AI gagal. Periksa API key, koneksi, model, dan batas penggunaan.', improved:'Prompt ditingkatkan.',
    generated:'Master prompt berhasil dibuat.', deleted:'Riwayat dan favorit dihapus.', settingsSaved:'Pengaturan tersimpan.',
    sectionsNames:['ROLE / PERAN','KONTEKS','TUJUAN','INSTRUKSI DETAIL','BATASAN','FORMAT OUTPUT','CONTOH','GAYA BAHASA'],
    role:'Berperanlah sebagai ahli berpengalaman yang relevan dengan tugas ini, dengan kemampuan analitis dan standar kualitas profesional.',
    context:'Gunakan ide awal berikut sebagai konteks utama dan pertahankan maksud pengguna. Identifikasi audiens, situasi penggunaan, serta kebutuhan yang belum disebutkan.',
    objective:'Hasilkan solusi yang akurat, relevan, orisinal, praktis, dan mudah diterapkan. Utamakan kejelasan serta nilai nyata bagi pengguna.',
    instructions:'1. Analisis permintaan dan pecah menjadi langkah yang jelas.\n2. Nyatakan asumsi penting; tanyakan klarifikasi hanya jika informasi yang hilang benar-benar menghambat hasil.\n3. Berikan detail spesifik, alasan keputusan, dan alternatif yang relevan.\n4. Periksa konsistensi, akurasi, dan kelengkapan sebelum menjawab.',
    constraints:'Hindari klaim yang tidak didukung, pengulangan, jargon tanpa penjelasan, serta detail yang tidak relevan. Jangan mengarang fakta; tandai asumsi atau ketidakpastian dengan jelas.',
    format:'Susun jawaban dengan judul dan subjudul yang mudah dipindai. Gunakan daftar atau tabel jika membantu. Akhiri dengan hasil final yang siap digunakan.',
    example:'Contoh masukan: [isi kebutuhan atau referensi pengguna].\nContoh hasil yang diharapkan: keluaran konkret, konsisten dengan tujuan, dan bisa langsung ditinjau atau digunakan.',
    tone:'Gunakan bahasa yang profesional, hangat, lugas, percaya diri, dan sesuai audiens. Hindari nada berlebihan; prioritaskan kalimat yang jelas.',
    detailShort:'Ringkas, prioritaskan inti dan hasil langsung.', detailStandard:'Berikan detail yang cukup, langkah praktis, dan pemeriksaan kualitas.', detailUltra:'Sangat mendalam: uraikan asumsi, langkah demi langkah, edge case, alternatif, kriteria evaluasi, dan checklist kualitas.',
    improveAddon:'\n\nPENINGKATAN KUALITAS:\n- Buat instruksi lebih spesifik dan dapat diverifikasi.\n- Hilangkan ambiguitas, tambahkan kriteria keberhasilan, dan jaga agar setiap bagian saling konsisten.\n- Jika relevan, sertakan langkah validasi sebelum menyajikan hasil akhir.',
    noHistory:'Belum ada riwayat.'
  },
  en: {
    settings:'Settings', eyebrow:'PROMPT ENGINEERING, REFINED', heroTitle:'Ordinary ideas.<br><em>Extraordinary prompts.</em>',
    heroSub:'Turn rough thoughts into clear, focused master prompts designed to get better work from AI.',
    sections:'structured sections', library:'LIBRARY', clear:'Clear', newPrompt:'New prompt', recent:'RECENT HISTORY',
    historyEmpty:'Saved prompts will appear here.', localStorage:'History saved on this device', promptBrief:'PROMPT BRIEF',
    startWithIdea:'Start with your idea', ideaLabel:'IDEA / INITIAL INSTRUCTION',
    ideaPlaceholder:'Example: Create a prompt for a premium coffee shop logo named Kopi Senja...',
    ideaHint:'Write a rough idea. The generator will structure the details.', category:'CATEGORY', catCopy:'Text / Copywriting',
    catImage:'Image (Midjourney / DALL·E)', catBusiness:'Business', catEducation:'Education', catCustom:'Custom',
    targetAI:'AI TARGET', detailLevel:'DETAIL LEVEL', short:'Short', standard:'Standard', ultra:'Ultra Detail',
    outputEnglish:'Generate in English', smartStructure:'Adaptive structure', generate:'Generate Master Prompt', output:'OUTPUT',
    yourMasterPrompt:'Your master prompt', ready:'READY TO USE', copy:'Copy', export:'Export', regenerate:'Regenerate',
    improve:'Improve / Enhance', saveHistory:'Save to History',
    apiDisclaimer:'Without an API, the generator uses a smart local template. Connect an API in Settings for direct AI generation.',
    settingsTitle:'AI Settings', apiWarning:'The API key is stored in this browser’s localStorage. Do not use this approach in public/production apps because browser users can inspect the key. Use a backend proxy for production.',
    provider:'AI PROVIDER', localTemplate:'Local template (no API)', apiKey:'API KEY', model:'MODEL (optional)',
    cancel:'Cancel', saveSettings:'Save Settings', footer:'Built for bigger ideas.', ideaRequired:'Please enter an idea first.',
    copied:'Prompt copied.', saved:'Prompt saved to history.', noPrompt:'Generate a prompt first.', apiKeyMissing:'API key is empty. Add it in Settings or use the local template.',
    apiFailed:'AI generation failed. Check the API key, connection, model, and usage limits.', improved:'Prompt enhanced.',
    generated:'Master prompt generated.', deleted:'History and favorites cleared.', settingsSaved:'Settings saved.',
    sectionsNames:['ROLE','CONTEXT','OBJECTIVE','DETAILED INSTRUCTIONS','CONSTRAINTS','OUTPUT FORMAT','EXAMPLE','TONE & STYLE'],
    role:'Act as an experienced specialist relevant to this task, applying strong analytical skills and professional quality standards.',
    context:'Use the initial idea below as the primary context and preserve the user’s intent. Identify the audience, use case, and unstated needs.',
    objective:'Produce an accurate, relevant, original, practical, and easy-to-apply solution. Prioritize clarity and real user value.',
    instructions:'1. Analyze the request and break it into clear steps.\n2. State important assumptions; ask clarifying questions only when missing information blocks a useful result.\n3. Provide specific details, reasoning, and relevant alternatives.\n4. Check consistency, accuracy, and completeness before responding.',
    constraints:'Avoid unsupported claims, repetition, unexplained jargon, and irrelevant details. Do not invent facts; clearly label assumptions or uncertainty.',
    format:'Organize the answer with scannable headings and subheadings. Use lists or tables when helpful. End with a final deliverable ready to use.',
    example:'Example input: [user need or reference].\nExpected result: a concrete output aligned with the goal that can be reviewed or used immediately.',
    tone:'Use a professional, warm, direct, confident voice suited to the audience. Avoid exaggeration and prioritize clear sentences.',
    detailShort:'Concise; prioritize the core and direct result.', detailStandard:'Provide sufficient detail, practical steps, and quality checks.', detailUltra:'Be comprehensive: explain assumptions, steps, edge cases, alternatives, evaluation criteria, and a quality checklist.',
    improveAddon:'\n\nQUALITY ENHANCEMENTS:\n- Make instructions specific and verifiable.\n- Remove ambiguity, add success criteria, and keep all sections consistent.\n- When relevant, include validation steps before presenting the final result.',
    noHistory:'No history yet.'
  }
};
const t = key => translations[language][key] ?? translations.id[key] ?? key;
const readJSON = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const getSettings = () => ({ provider:'local', apiKey:'', model:'', ...readJSON(STORAGE.settings,{}) });
const getHistory = () => readJSON(STORAGE.history, []);
const getFavorites = () => readJSON(STORAGE.favorites, []);
const saveJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function applyLanguage() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const value = t(el.dataset.i18n);
    if (el.tagName === 'OPTION' || el.tagName === 'BUTTON' || el.tagName === 'SPAN' || el.tagName === 'P' || el.tagName === 'H2' || el.tagName === 'DIV') el.innerHTML = value;
    else el.textContent = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => el.placeholder = t(el.dataset.i18nPlaceholder));
  $('#languageToggle').textContent = language === 'id' ? 'ID / EN' : 'EN / ID';
  renderHistory();
}
function categoryName() { return $('#category').selectedOptions[0]?.textContent || 'Custom'; }
function detailName() { return $('#detail').selectedOptions[0]?.textContent || 'Standar'; }

function makePrompt(idea, improved=false) {
  const english = $('#englishOutput').checked || language === 'en';
  const tr = translations[english ? 'en' : 'id'];
  const category = $('#category').value;
  const target = $('#target').value;
  const detail = $('#detail').value;
  let role = tr.role;
  if (category === 'coding') role = english ? 'Act as a senior full-stack software engineer, solution architect, and code reviewer.' : 'Berperan sebagai senior full-stack developer, software architect, dan code reviewer.';
  if (category === 'image') role = english ? 'Act as an expert art director and generative-image prompt designer.' : 'Berperan sebagai art director ahli dan perancang prompt gambar generatif.';
  if (category === 'video') role = english ? 'Act as a film director, cinematographer, and AI video prompt specialist.' : 'Berperan sebagai sutradara, sinematografer, dan spesialis prompt video AI.';
  if (category === 'business') role = english ? 'Act as a strategic business consultant and market researcher.' : 'Berperan sebagai konsultan strategi bisnis dan peneliti pasar.';
  if (category === 'education') role = english ? 'Act as an experienced educator and instructional designer.' : 'Berperan sebagai pendidik berpengalaman dan instructional designer.';
  const names = tr.sectionsNames;
  const sections = [
    [names[0], role],
    [names[1], `${tr.context}\n\n${english?'USER IDEA':'IDE PENGGUNA'}: ${idea}\n${english?'CATEGORY':'KATEGORI'}: ${categoryName()}\n${english?'TARGET':'TARGET'}: ${target}`],
    [names[2], tr.objective],
    [names[3], `${tr.instructions}\n\n${detail==='short'?tr.detailShort:detail==='ultra'?tr.detailUltra:tr.detailStandard}`],
    [names[4], tr.constraints],
    [names[5], tr.format],
    [names[6], tr.example],
    [names[7], tr.tone]
  ];
  if (category === 'image') {
    sections[3][1] += english
      ? '\nFor image generation, specify subject, composition, visual hierarchy, medium, lighting, color palette, materials, background, camera/view, aspect ratio, and negative constraints where supported. Keep platform-specific parameters valid.'
      : '\nUntuk gambar, jelaskan subjek, komposisi, hierarki visual, medium, pencahayaan, palet warna, material, latar, sudut pandang, rasio aspek, dan batasan negatif bila didukung. Pastikan parameter sesuai platform.';
    sections[5][1] += english ? '\nSuggested fields: Main prompt, visual direction, composition, lighting, palette, aspect ratio, negative prompt (if supported).' : '\nKolom yang disarankan: prompt utama, arahan visual, komposisi, pencahayaan, palet, rasio aspek, negative prompt (jika didukung).';
  }
  if (category === 'coding') sections[5][1] += english ? '\nInclude complete code, file paths, setup steps, assumptions, and meaningful error handling.' : '\nSertakan kode lengkap, lokasi file, langkah menjalankan, asumsi, dan penanganan error yang bermakna.';
  if (improved) sections[3][1] += tr.improveAddon;
  return `${english?'MASTER PROMPT':'MASTER PROMPT'} — ${target.toUpperCase()}\n${'═'.repeat(40)}\n\n${sections.map(([heading, body])=>`${heading}\n${'-'.repeat(Math.min(heading.length, 34))}\n${body}`).join('\n\n')}\n\n${english?'FINAL REQUEST':'PERMINTAAN AKHIR'}\n${english?'Now execute this prompt. If a critical detail is missing, state a reasonable assumption before proceeding.':'Sekarang jalankan prompt ini. Jika ada detail penting yang belum tersedia, nyatakan asumsi yang masuk akal sebelum melanjutkan.'}`;
}

async function callAI(prompt) {
  const s = getSettings();
  if (s.provider === 'local') return prompt;
  if (!s.apiKey.trim()) throw new Error(t('apiKeyMissing'));
  const model = s.model.trim();
  let response, data;
  if (s.provider === 'openai') {
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${s.apiKey}`},
      body:JSON.stringify({model:model || 'gpt-4.1-mini',messages:[{role:'system',content:'You are an expert prompt engineer. Improve the provided master prompt without answering the user’s underlying task. Preserve the eight labeled sections: Role, Context, Objective, Detailed Instructions, Constraints, Output Format, Example, Tone & Style. Return only the finished prompt.'},{role:'user',content:prompt}],temperature:0.7})
    });
    data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || t('apiFailed'));
    return data.choices?.[0]?.message?.content || prompt;
  }
  if (s.provider === 'anthropic') {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST', headers:{'Content-Type':'application/json','x-api-key':s.apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:model || 'claude-3-5-haiku-latest',max_tokens:5000,system:'You are an expert prompt engineer. Improve the provided master prompt without answering the underlying task. Preserve the eight labeled sections. Return only the finished prompt.',messages:[{role:'user',content:prompt}]})
    });
    data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || t('apiFailed'));
    return data.content?.map(x=>x.text||'').join('\n') || prompt;
  }
  if (s.provider === 'gemini') {
    const chosenModel = model || 'gemini-2.0-flash';
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(chosenModel)}:generateContent?key=${encodeURIComponent(s.apiKey)}`, {
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({systemInstruction:{parts:[{text:'You are an expert prompt engineer. Improve the provided master prompt without answering the underlying task. Preserve the eight labeled sections. Return only the finished prompt.'}]},contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.7,maxOutputTokens:6000}})
    });
    data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || t('apiFailed'));
    return data.candidates?.[0]?.content?.parts?.map(x=>x.text||'').join('\n') || prompt;
  }
  return prompt;
}

function typeResult(text) {
  clearInterval(typingTimer);
  const el = $('#resultText');
  el.textContent = '';
  let i = 0;
  // Reduced motion users get immediate output.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || text.length > 7000) { el.textContent = text; return; }
  typingTimer = setInterval(() => {
    el.textContent += text.slice(i, i + 12);
    i += 12;
    if (i >= text.length) { clearInterval(typingTimer); el.textContent = text; }
  }, 5);
}
function showResult(prompt) {
  currentPrompt = prompt;
  currentRecordId = null;
  $('#resultSection').hidden = false;
  $('#resultMeta').textContent = `${$('#target').value} · ${detailName()} · ${categoryName()}`;
  typeResult(prompt);
  updateFavoriteButton();
}
function toast(message) {
  const el = $('#toast'); el.textContent = message; el.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(()=>el.classList.remove('show'),2500);
}
async function generate(improved=false) {
  const idea = $('#idea').value.trim();
  if (!idea) { $('#statusMessage').textContent = t('ideaRequired'); $('#idea').focus(); return; }
  const btn = $('#generateBtn'); btn.disabled = true; $('#statusMessage').textContent = language==='id'?'Sedang menyusun prompt…':'Building your prompt…';
  try {
    let prompt = makePrompt(idea, improved);
    if (getSettings().provider !== 'local') prompt = await callAI(prompt);
    showResult(prompt);
    $('#statusMessage').textContent = t('generated');
    if (improved) toast(t('improved'));
  } catch (err) {
    $('#statusMessage').textContent = err.message || t('apiFailed');
  } finally { btn.disabled = false; }
}
function renderHistory() {
  const history = getHistory().slice().reverse();
  $('#historyCount').textContent = String(history.length);
  const list = $('#historyList');
  if (!history.length) { list.innerHTML = `<p class="empty-small">${escapeHTML(t('historyEmpty'))}</p>`; return; }
  list.innerHTML = history.slice(0,12).map(item => `<button class="history-item" data-id="${escapeHTML(item.id)}"><span>${item.favorite?'♥':'◷'}</span><span class="history-title">${escapeHTML(item.title)}</span></button>`).join('');
  list.querySelectorAll('[data-id]').forEach(btn => btn.addEventListener('click',()=>loadRecord(btn.dataset.id)));
}
function saveCurrent() {
  if (!currentPrompt) { toast(t('noPrompt')); return; }
  const history = getHistory();
  const id = currentRecordId || `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const record = {id, title:($('#idea').value.trim() || currentPrompt).slice(0,64), idea:$('#idea').value.trim(), prompt:currentPrompt, category:$('#category').value, target:$('#target').value, detail:$('#detail').value, favorite:getFavorites().includes(id), updatedAt:new Date().toISOString()};
  const index = history.findIndex(x=>x.id===id);
  if(index>=0) history[index]=record; else history.push(record);
  saveJSON(STORAGE.history,history); currentRecordId=id; renderHistory(); toast(t('saved'));
}
function loadRecord(id) {
  const record = getHistory().find(x=>x.id===id); if(!record) return;
  $('#idea').value=record.idea||''; $('#charCount').textContent=`${$('#idea').value.length} / 5000`;
  $('#category').value=record.category||'custom'; $('#target').value=record.target||'ChatGPT'; $('#detail').value=record.detail||'standard';
  currentRecordId=id; currentPrompt=record.prompt; $('#resultSection').hidden=false; $('#resultMeta').textContent=`${record.target} · ${record.detail} · ${categoryName()}`;
  $('#resultText').textContent=record.prompt; updateFavoriteButton(); $('#resultSection').scrollIntoView({behavior:'smooth',block:'start'});
}
function updateFavoriteButton() { const isFav=currentRecordId && getFavorites().includes(currentRecordId); $('#favoriteBtn').classList.toggle('is-favorite',!!isFav); $('#favoriteBtn').textContent=isFav?'♥':'♡'; }
function toggleFavorite() {
  if (!currentPrompt) { toast(t('noPrompt')); return; }
  if (!currentRecordId) saveCurrent();
  const favs=getFavorites(); const index=favs.indexOf(currentRecordId);
  if(index>=0) favs.splice(index,1); else favs.push(currentRecordId);
  saveJSON(STORAGE.favorites,favs);
  const hist=getHistory(); const item=hist.find(x=>x.id===currentRecordId); if(item) item.favorite=favs.includes(currentRecordId);
  saveJSON(STORAGE.history,hist); updateFavoriteButton(); renderHistory();
}
function exportTXT() {
  if(!currentPrompt){toast(t('noPrompt'));return;}
  const blob=new Blob([currentPrompt],{type:'text/plain;charset=utf-8'}); const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='master-prompt-ai.txt';a.click();URL.revokeObjectURL(url);
}
function exportPDF() {
  if(!currentPrompt){toast(t('noPrompt'));return;}
  const win=window.open('','_blank');
  if(!win){toast(language==='id'?'Izinkan pop-up untuk ekspor PDF.':'Allow pop-ups to export PDF.');return;}
  win.document.write(`<!doctype html><html><head><title>Master Prompt AI</title><style>body{font:12px/1.7 Arial,sans-serif;color:#222;max-width:800px;margin:40px auto;padding:0 20px;white-space:pre-wrap;overflow-wrap:anywhere}h1{font-size:20px;border-bottom:2px solid #dc143c;padding-bottom:10px}@media print{body{margin:15mm auto}}</style></head><body><h1>Master Prompt AI</h1><div>${escapeHTML(currentPrompt)}</div><script>window.onload=()=>window.print()<\/script></body></html>`);
  win.document.close();
}
function openSettings() {
  const s=getSettings(); $('#provider').value=s.provider; $('#apiKey').value=s.apiKey; $('#modelName').value=s.model;
  $('#settingsStatus').textContent=''; $('#settingsModal').hidden=false; $('#apiKey').focus();
}
function closeSettings() { $('#settingsModal').hidden=true; }
function saveSettings() {
  const provider=$('#provider').value, apiKey=$('#apiKey').value.trim(), model=$('#modelName').value.trim();
  if(provider!=='local'&&!apiKey){$('#settingsStatus').textContent=t('apiKeyMissing');return;}
  saveJSON(STORAGE.settings,{provider,apiKey,model}); $('#settingsStatus').textContent=t('settingsSaved'); toast(t('settingsSaved')); setTimeout(closeSettings,600);
}

$('#idea').addEventListener('input',()=>$('#charCount').textContent=`${$('#idea').value.length} / 5000`);
$('#generateBtn').addEventListener('click',()=>generate(false));
$('#regenerateBtn').addEventListener('click',()=>generate(false));
$('#improveBtn').addEventListener('click',()=>generate(true));
$('#copyBtn').addEventListener('click',async()=>{
  if(!currentPrompt){toast(t('noPrompt'));return;}
  try{await navigator.clipboard.writeText(currentPrompt);}catch{
    const area=document.createElement('textarea');area.value=currentPrompt;document.body.appendChild(area);area.select();document.execCommand('copy');area.remove();
  } toast(t('copied'));
});
$('#saveBtn').addEventListener('click',saveCurrent);
$('#favoriteBtn').addEventListener('click',toggleFavorite);
$('#exportBtn').addEventListener('click',()=>{if(!currentPrompt){toast(t('noPrompt'));return;}const choice=window.prompt(language==='id'?'Ketik TXT atau PDF untuk memilih format ekspor:':'Type TXT or PDF to choose export format:','TXT');if(!choice)return;if(choice.toLowerCase()==='pdf')exportPDF();else if(choice.toLowerCase()==='txt')exportTXT();else toast('Pilih TXT atau PDF.');});
$('#clearHistory').addEventListener('click',()=>{if(confirm(language==='id'?'Hapus semua riwayat dan favorit?':'Clear all history and favorites?')){localStorage.removeItem(STORAGE.history);localStorage.removeItem(STORAGE.favorites);currentRecordId=null;renderHistory();toast(t('deleted'));}});
$('#newPrompt').addEventListener('click',()=>{ $('#idea').value='';$('#charCount').textContent='0 / 5000';$('#resultSection').hidden=true;currentPrompt='';currentRecordId=null;$('#statusMessage').textContent='';$('#idea').focus();});
$('#languageToggle').addEventListener('click',()=>{language=language==='id'?'en':'id';localStorage.setItem(STORAGE.language,language);applyLanguage();});
$('#settingsOpen').addEventListener('click',openSettings);$('#settingsClose').addEventListener('click',closeSettings);$('#settingsCancel').addEventListener('click',closeSettings);$('#settingsSave').addEventListener('click',saveSettings);
$('#settingsModal').addEventListener('click',e=>{if(e.target===$('#settingsModal'))closeSettings();});
$('#toggleKey').addEventListener('click',()=>{const input=$('#apiKey');input.type=input.type==='password'?'text':'password';$('#toggleKey').textContent=input.type==='password'?'Lihat':'Sembunyikan';});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSettings();});
applyLanguage();
if ('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')) {
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(err=>console.warn('Service worker registration failed:',err)));
}
