(function () {
  const params = new URLSearchParams(window.location.search);
  const isEmbedded = params.get('embed') === '1';
  if (!isEmbedded) return;

  document.documentElement.classList.add('is-embedded');

  function postToParent(payload) {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(payload, '*');
    }
  }

  function syncHeight() {
    const activeView = document.querySelector('.view.active');
    const container = document.querySelector('.app-container') || document.body;
    const h = Math.max(
      activeView ? activeView.scrollHeight + 48 : 0,
      container ? container.scrollHeight + 24 : 0,
      document.documentElement.scrollHeight
    );
    postToParent({ type: 'lab-resize', labId: params.get('labId') || '', height: h });
  }

  function syncStudentIdentity() {
    const nameInputs = ['studentName', 'lkpdNama']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const classInputs = ['studentClass', 'lkpdKelas']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const savedName = localStorage.getItem('labmaya_student_name') || '';
    const savedClass = localStorage.getItem('labmaya_student_class') || '';

    nameInputs.forEach((el) => {
      if (savedName && !el.value) el.value = savedName;
      el.addEventListener('input', () => {
        localStorage.setItem('labmaya_student_name', el.value);
      });
    });

    classInputs.forEach((el) => {
      if (savedClass && !el.value) el.value = savedClass;
      el.addEventListener('input', () => {
        localStorage.setItem('labmaya_student_class', el.value);
      });
    });
  }

  function getAudioState() {
    const sfxBtn = document.getElementById('btnSfx') || document.getElementById('btnToggleSfx');
    const bgmBtn = document.getElementById('btnBgm') || document.getElementById('btnToggleBgm');
    const sfxOn = sfxBtn
      ? (sfxBtn.classList.contains('muted') ? false : sfxBtn.classList.contains('active') || !sfxBtn.classList.contains('muted'))
      : true;
    const bgmOn = bgmBtn
      ? (bgmBtn.id === 'btnToggleBgm'
          ? bgmBtn.classList.contains('active')
          : !bgmBtn.classList.contains('muted') && (bgmBtn.classList.contains('active') || bgmBtn.textContent.includes('🎵')))
      : false;
    return { sfxOn, bgmOn };
  }

  function applyAudioState(desiredSfx, desiredBgm) {
    try {
      const { sfxOn, bgmOn } = getAudioState();
      if (typeof desiredSfx === 'boolean' && sfxOn !== desiredSfx && typeof window.toggleSfx === 'function') {
        window.toggleSfx();
      }
      if (typeof desiredBgm === 'boolean' && bgmOn !== desiredBgm && typeof window.toggleBgm === 'function') {
        window.toggleBgm();
      }
    } catch {
      // ignore audio sync issues
    }
  }

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'sync-identity') {
      const savedName = localStorage.getItem('labmaya_student_name') || '';
      const savedClass = localStorage.getItem('labmaya_student_class') || '';
      ['studentName', 'lkpdNama'].forEach((id) => {
        const el = document.getElementById(id);
        if (el && savedName) el.value = savedName;
      });
      ['studentClass', 'lkpdKelas'].forEach((id) => {
        const el = document.getElementById(id);
        if (el && savedClass) el.value = savedClass;
      });
    }

    if (data.type === 'set-audio') {
      applyAudioState(data.sfx, data.bgm);
    }

    if (data.type === 'navigate-view' && data.view) {
      if (typeof window.navigateTo === 'function' && document.getElementById(`view-${data.view}`)) {
        window.navigateTo(data.view);
      }
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    syncStudentIdentity();

    if (typeof window.navigateTo === 'function') {
      const originalNavigateTo = window.navigateTo;
      window.navigateTo = function (viewName) {
        originalNavigateTo(viewName);
        postToParent({ type: 'lab-view-changed', labId: params.get('labId') || '', view: viewName });
        postToParent({ type: 'lab-scroll-top' });
        requestAnimationFrame(syncHeight);
        setTimeout(syncHeight, 120);
      };
    }

    window.scrollTo = function () {
      postToParent({ type: 'lab-scroll-top' });
    };

    const targetView = params.get('view') || 'teori';
    if (typeof window.navigateTo === 'function' && document.getElementById(`view-${targetView}`)) {
      window.navigateTo(targetView);
    }

    const desiredSfx = params.get('sfx') !== '0';
    const desiredBgm = params.get('bgm') === '1';
    applyAudioState(desiredSfx, desiredBgm);

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => syncHeight());
      ro.observe(document.body);
      const container = document.querySelector('.app-container');
      if (container) ro.observe(container);
    }

    if (typeof MutationObserver !== 'undefined') {
      const mo = new MutationObserver(() => {
        requestAnimationFrame(syncHeight);
      });
      mo.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    window.addEventListener('resize', () => {
      requestAnimationFrame(syncHeight);
      setTimeout(syncHeight, 100);
    });

    syncHeight();
    setTimeout(syncHeight, 150);
    setTimeout(syncHeight, 500);
  });
})();
