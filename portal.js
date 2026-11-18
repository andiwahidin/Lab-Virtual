const LABS = {
  'stack-queue': {
    id: 'stack-queue',
    name: 'Stack & Queue',
    kicker: 'Modul 01 · Struktur Data · Kelas X Fase E',
    title: 'Struktur Data Tumpukan (Stack) & Antrean (Queue)',
    desc: 'Eksplorasi cara kerja penyimpanan data LIFO (Push & Pop) dan FIFO (Enqueue & Dequeue) pada studi kasus antrean formulir loket rumah sakit dan tumpukan piring.',
    focus: 'Fokus: Perbandingan prinsip LIFO vs FIFO dan keadilan pelayanan antrean.',
    missionsCount: '04',
    image: '/src/assets/images/lab_stack_queue_1795006595233.jpg',
    imageAlt: 'Ilustrasi struktur data Stack vertikal dan jalur Queue horizontal',
    path: '/labs/stack-queue/index.html',
    workflow: {
      teori: 'Studi kasus loket rumah sakit, konsep Stack (LIFO) vs Queue (FIFO), dan tabel pembanding.',
      simulasi: 'Meja kerja Push/Pop & Enqueue/Dequeue, 4 misi berjenjang, dan pencatatan tabel percobaan.',
      prosedur: '7 langkah kerja sistematis dari pemahaman kasus hingga verifikasi tabel percobaan.',
      lkpd: '10 soal analisis dan diagnostik otomatis dengan konversi laporan praktikum berformat PDF A4.'
    }
  },
  'searching-sorting': {
    id: 'searching-sorting',
    name: 'Searching & Sorting',
    kicker: 'Modul 02 · Algoritma Pemrograman · Kelas X Fase E',
    title: 'Algoritma Pencarian (Searching) & Pengurutan (Sorting)',
    desc: 'Bandingkan Pencarian Linier & Biner serta algoritma Bubble, Insertion, dan Selection Sort melalui mode demonstrasi otomatis maupun praktik siswa terpandu.',
    focus: 'Fokus: Efisiensi iterasi, pembandingan, penukaran elemen, dan pelacakan akurasi langkah.',
    missionsCount: '06',
    image: '/src/assets/images/lab_sorting_search_1795006596013.jpg',
    imageAlt: 'Ilustrasi algoritma pengurutan dan pembandingan batang data',
    path: '/labs/searching-sorting/index.html',
    workflow: {
      teori: 'Tiga elemen masalah pencarian, syarat Binary Search, dan telusur Bubble, Insertion, & Selection Sort.',
      simulasi: 'Mode Demonstrasi & Aktivitas Siswa untuk 6 misi praktikum beserta pelacak kesalahan teknik.',
      prosedur: 'Tahapan praktikum terpandu untuk menguji deret acak, hampir terurut, dan terbalik.',
      lkpd: '10 soal evaluasi algoritma & diagnostik otomatis lengkap dengan rekap PDF A4.'
    }
  },
  'kabel-utp': {
    id: 'kabel-utp',
    name: 'Perakitan Kabel UTP',
    kicker: 'Modul 03 · Jaringan Komputer & Internet · Fase E/F',
    title: 'Perakitan Kabel UTP & Terminasi Konektor RJ-45',
    desc: 'Pelajari standar pengkabelan EIA/TIA-568A dan T568B, susun 8 warna inti kawat pada ujung konektor RJ-45, lakukan crimping, dan uji koneksi dengan LAN Tester.',
    focus: 'Fokus: Pengkabelan Straight-Through & Crossover serta diagnostik urutan pin 1–8.',
    missionsCount: '05',
    image: '/src/assets/images/lab_utp_cabling_1795006596764.jpg',
    imageAlt: 'Ilustrasi konektor RJ-45, delapan kawat tembaga UTP, dan LAN cable tester',
    path: '/labs/kabel-utp/index.html',
    workflow: {
      teori: 'Fungsi 8 warna kawat UTP, perbedaan standar T568A vs T568B, serta kabel Straight & Crossover.',
      simulasi: 'Pengupasan jaket kabel, penyusunan & tukar pin Ujung A/B, Tang Crimping, dan LAN Tester.',
      prosedur: 'Langkah perakitan kabel jaringan secara aman hingga verifikasi sinyal LED 1–8.',
      lkpd: '10 soal terminasi RJ-45 & analisis kerusakan kabel lengkap dengan ekspor PDF A4.'
    }
  }
};

const VALID_SECTIONS = new Set(['beranda', 'teori', 'simulasi', 'prosedur', 'lkpd']);
const frameCache = {};
const frameHeights = {};

let activeLabId = 'stack-queue';
let activeSection = 'beranda';
let globalSfxEnabled = true;
let globalBgmEnabled = false;

function selectLab(labId) {
  if (!LABS[labId]) return;
  activeLabId = labId;
  updateBerandaContent();
  updateActiveControlsUI();

  if (activeSection !== 'beranda') {
    showEmbeddedModule(activeLabId, activeSection);
  }
  syncUrlState();
}

function setSection(sectionName) {
  if (!VALID_SECTIONS.has(sectionName)) return;
  activeSection = sectionName;
  updateActiveControlsUI();

  const berandaEl = document.getElementById('berandaSection');
  const stageEl = document.getElementById('moduleStageSection');

  if (sectionName === 'beranda') {
    stageEl.classList.add('hidden');
    berandaEl.classList.remove('hidden');
    pauseAllFrameBgm();
  } else {
    berandaEl.classList.add('hidden');
    stageEl.classList.remove('hidden');
    showEmbeddedModule(activeLabId, sectionName);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  syncUrlState();
}

function openLabAt(labId, sectionName) {
  if (!LABS[labId]) return;
  activeLabId = labId;
  updateBerandaContent();
  setSection(sectionName || 'simulasi');
}

function updateBerandaContent() {
  const lab = LABS[activeLabId];
  document.getElementById('heroKicker').textContent = lab.kicker;
  document.getElementById('heroTitle').textContent = lab.title;
  document.getElementById('heroDesc').textContent = lab.desc;
  document.getElementById('heroMissionsCount').textContent = lab.missionsCount;
  document.getElementById('heroFocusText').textContent = lab.focus;
  document.getElementById('workflowHeading').textContent = `Empat Tahap Praktikum: ${lab.name}`;

  const heroImg = document.getElementById('heroImage');
  const frame = heroImg.closest('.hero-visual-frame');
  if (frame) frame.classList.remove('is-fallback');
  heroImg.src = lab.image;
  heroImg.alt = lab.imageAlt;
  document.getElementById('heroFallbackLabel').textContent = lab.title;

  document.getElementById('wfTeoriDesc').textContent = lab.workflow.teori;
  document.getElementById('wfSimulasiDesc').textContent = lab.workflow.simulasi;
  document.getElementById('wfProsedurDesc').textContent = lab.workflow.prosedur;
  document.getElementById('wfLkpdDesc').textContent = lab.workflow.lkpd;
}

function updateActiveControlsUI() {
  document.querySelectorAll('.nav-link').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.section === activeSection);
  });

  const mobileSelect = document.getElementById('mobileSectionSelect');
  if (mobileSelect) mobileSelect.value = activeSection;

  document.querySelectorAll('.topic-tab').forEach((btn) => {
    const isMatch = btn.dataset.lab === activeLabId;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-selected', String(isMatch));
  });

  document.querySelectorAll('.overview-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.lab === activeLabId);
  });
}

function showEmbeddedModule(labId, sectionName) {
  const lab = LABS[labId];
  const host = document.getElementById('framesHost');
  const loadingHint = document.getElementById('moduleLoadingHint');

  Object.keys(frameCache).forEach((id) => {
    const f = frameCache[id];
    const isTarget = id === labId;
    f.classList.toggle('hidden', !isTarget);
    if (!isTarget) {
      try {
        f.contentWindow.postMessage({ type: 'set-audio', bgm: false }, '*');
      } catch {
        // ignore cross-state error
      }
    }
  });

  let iframe = frameCache[labId];
  if (!iframe) {
    loadingHint.classList.remove('hidden');
    iframe = document.createElement('iframe');
    iframe.id = `frame-${labId}`;
    iframe.className = 'module-frame';
    iframe.title = lab.title;
    iframe.scrolling = 'no';
    iframe.src = `${lab.path}?embed=1&labId=${encodeURIComponent(labId)}&view=${encodeURIComponent(sectionName)}&sfx=${globalSfxEnabled ? '1' : '0'}&bgm=${globalBgmEnabled ? '1' : '0'}`;

    iframe.addEventListener('load', () => {
      loadingHint.classList.add('hidden');
      try {
        iframe.contentWindow.postMessage({ type: 'sync-identity' }, '*');
        iframe.contentWindow.postMessage({ type: 'set-audio', sfx: globalSfxEnabled, bgm: globalBgmEnabled }, '*');
      } catch {
        // ignore
      }
    });

    host.appendChild(iframe);
    frameCache[labId] = iframe;
    return;
  }

  loadingHint.classList.add('hidden');
  if (frameHeights[labId]) {
    iframe.style.height = `${frameHeights[labId]}px`;
  }

  try {
    iframe.contentWindow.postMessage({ type: 'navigate-view', view: sectionName }, '*');
    iframe.contentWindow.postMessage({ type: 'sync-identity' }, '*');
    iframe.contentWindow.postMessage({ type: 'set-audio', sfx: globalSfxEnabled, bgm: globalBgmEnabled }, '*');
  } catch {
    iframe.src = `${lab.path}?embed=1&labId=${encodeURIComponent(labId)}&view=${encodeURIComponent(sectionName)}`;
  }
}

function pauseAllFrameBgm() {
  Object.values(frameCache).forEach((f) => {
    try {
      f.contentWindow.postMessage({ type: 'set-audio', bgm: false }, '*');
    } catch {
      // ignore
    }
  });
}

function toggleGlobalSfx() {
  globalSfxEnabled = !globalSfxEnabled;
  const btn = document.getElementById('globalSfxBtn');
  btn.classList.toggle('active', globalSfxEnabled);
  btn.setAttribute('aria-pressed', String(globalSfxEnabled));
  btn.textContent = globalSfxEnabled ? 'SFX Aktif' : 'SFX Mati';

  const activeFrame = frameCache[activeLabId];
  if (activeFrame) {
    try {
      activeFrame.contentWindow.postMessage({ type: 'set-audio', sfx: globalSfxEnabled }, '*');
    } catch {
      // ignore
    }
  }
}

function toggleGlobalBgm() {
  globalBgmEnabled = !globalBgmEnabled;
  const btn = document.getElementById('globalBgmBtn');
  btn.classList.toggle('active', globalBgmEnabled);
  btn.setAttribute('aria-pressed', String(globalBgmEnabled));
  btn.textContent = globalBgmEnabled ? 'Musik Aktif' : 'Musik Mati';

  const activeFrame = frameCache[activeLabId];
  if (activeFrame && activeSection !== 'beranda') {
    try {
      activeFrame.contentWindow.postMessage({ type: 'set-audio', bgm: globalBgmEnabled }, '*');
    } catch {
      // ignore
    }
  }
}

function syncUrlState() {
  const url = new URL(window.location.href);
  url.searchParams.set('lab', activeLabId);
  if (activeSection !== 'beranda') {
    url.searchParams.set('view', activeSection);
  } else {
    url.searchParams.delete('view');
  }
  window.history.replaceState({}, '', url.toString());
}

window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'lab-resize' && data.labId && typeof data.height === 'number') {
    const safeH = Math.max(520, Math.ceil(data.height));
    frameHeights[data.labId] = safeH;
    const frame = frameCache[data.labId];
    if (frame && data.labId === activeLabId) {
      frame.style.height = `${safeH}px`;
    }
  }

  if (data.type === 'lab-view-changed' && data.view) {
    const mapped = data.view === 'home' ? 'beranda' : data.view;
    if (VALID_SECTIONS.has(mapped) && mapped !== activeSection) {
      if (mapped === 'beranda') {
        setSection('beranda');
      } else {
        activeSection = mapped;
        updateActiveControlsUI();
        syncUrlState();
      }
    }
  }

  if (data.type === 'lab-scroll-top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const initialLab = params.get('lab');
  const initialView = params.get('view');

  if (initialLab && LABS[initialLab]) {
    activeLabId = initialLab;
  }

  updateBerandaContent();
  updateActiveControlsUI();

  if (initialView && VALID_SECTIONS.has(initialView) && initialView !== 'beranda') {
    setSection(initialView);
  }
});
