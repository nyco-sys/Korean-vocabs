(() => {
  let koreanVoices = [];
  let currentRate = 1.0;
  let currentUtterance = null;
  let isSpeaking = false;

  function loadKoreanVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    koreanVoices = voices.filter(v => /^ko(-|_)/i.test(v.lang));
  }

  function getKoreanVoice() {
    loadKoreanVoices();
    return koreanVoices[0] || null;
  }

  function stopKoreanAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    isSpeaking = false;

    document.querySelectorAll('.ai-audio-play.is-playing').forEach(btn => {
      btn.classList.remove('is-playing');
      btn.classList.remove('is-stop');
      btn.setAttribute('aria-label', 'Play Korean audio');
      const icon = btn.querySelector('.ai-audio-icon');
      if (icon) icon.textContent = '▶';
      const label = btn.querySelector('.ai-audio-play-label');
      if (label) label.textContent = '듣기';
    });
  }

  function speakKorean(text, rate = currentRate) {
    if (!('speechSynthesis' in window)) {
      showTTSError('Korean audio is not supported by this browser.');
      return;
    }

    const cleanText = String(text || '').trim();
    if (!cleanText) return;

    window.speechSynthesis.cancel();
    document.querySelectorAll('.ai-audio-play.is-playing').forEach(btn => {
      btn.classList.remove('is-playing');
      btn.classList.remove('is-stop');
      const icon = btn.querySelector('.ai-audio-icon');
      if (icon) icon.textContent = '▶';
      const label = btn.querySelector('.ai-audio-play-label');
      if (label) label.textContent = '듣기';
    });

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ko-KR';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voice = getKoreanVoice();
    if (voice) utterance.voice = voice;

    currentUtterance = utterance;
    isSpeaking = true;
    utterance.onend = () => {
      currentUtterance = null;
      isSpeaking = false;
      document.querySelectorAll('.ai-audio-play.is-playing').forEach(btn => {
        btn.classList.remove('is-playing');
        btn.classList.remove('is-stop');
        btn.setAttribute('aria-label', 'Play Korean audio');
        const icon = btn.querySelector('.ai-audio-icon');
        if (icon) icon.textContent = '▶';
        const label = btn.querySelector('.ai-audio-play-label');
        if (label) label.textContent = '듣기';
      });
    };
    utterance.onerror = () => {
      currentUtterance = null;
      isSpeaking = false;
      document.querySelectorAll('.ai-audio-play.is-playing').forEach(btn => {
        btn.classList.remove('is-playing');
        btn.classList.remove('is-stop');
        const icon = btn.querySelector('.ai-audio-icon');
        if (icon) icon.textContent = '▶';
        const label = btn.querySelector('.ai-audio-play-label');
        if (label) label.textContent = '듣기';
      });
    };

    window.speechSynthesis.speak(utterance);
  }

  function showTTSError(message) {
    const existing = document.getElementById('ai-audio-error');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'ai-audio-error';
    el.className = 'ai-audio-error';
    el.textContent = message;

    const tutor = document.querySelector('.ai-tutor-view, .ai-tutor-container, #ai-tutor');
    (tutor || document.body).appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }

  function extractKorean(text) {
    const value = String(text || '').trim();
    if (!value) return '';

    // Prefer lines/sentences containing Hangul. Remove markdown formatting
    // while preserving Korean punctuation and spaces.
    return value
      .split(/\n+/)
      .map(line => line.replace(/[*_`>#]+/g, '').trim())
      .filter(line => /[가-힣]/.test(line))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function createAudioControls(koreanText) {
    const wrap = document.createElement('div');
    wrap.className = 'ai-audio-controls';
    wrap.dataset.koreanText = koreanText;

    wrap.innerHTML = `
      <button type="button" class="ai-audio-play" aria-label="Play Korean audio" title="Play Korean audio">
        <span class="ai-audio-icon">▶</span>
        <span class="ai-audio-play-label">듣기</span>
      </button>
      <button type="button" class="ai-audio-slow" aria-label="Play Korean audio slowly" title="Play slowly">
        <span>🐢</span>
        <span>느리게</span>
      </button>
      <button type="button" class="ai-audio-replay" aria-label="Replay Korean audio" title="Replay">
        <span>↻</span>
        <span>다시 듣기</span>
      </button>
    `;

    const play = wrap.querySelector('.ai-audio-play');
    const slow = wrap.querySelector('.ai-audio-slow');
    const replay = wrap.querySelector('.ai-audio-replay');

    play.addEventListener('click', () => {
      if (isSpeaking && play.classList.contains('is-playing')) {
        stopKoreanAudio();
        return;
      }

      speakKorean(koreanText, 1.0);
      play.classList.add('is-playing');
      play.setAttribute('aria-label', 'Stop Korean audio');
      play.setAttribute('title', 'Stop Korean audio');
      const icon = play.querySelector('.ai-audio-icon');
      if (icon) icon.textContent = '■';
      const label = play.querySelector('.ai-audio-play-label');
      if (label) label.textContent = '중지';
    });

    slow.addEventListener('click', () => {
      speakKorean(koreanText, 0.65);
      play.classList.add('is-playing');
      play.setAttribute('aria-label', 'Stop Korean audio');
      const icon = play.querySelector('.ai-audio-icon');
      if (icon) icon.textContent = '■';
      const label = play.querySelector('.ai-audio-play-label');
      if (label) label.textContent = '중지';
    });

    replay.addEventListener('click', () => {
      speakKorean(koreanText, currentRate);
      play.classList.add('is-playing');
      play.setAttribute('aria-label', 'Stop Korean audio');
      const icon = play.querySelector('.ai-audio-icon');
      if (icon) icon.textContent = '■';
      const label = play.querySelector('.ai-audio-play-label');
      if (label) label.textContent = '중지';
    });

    return wrap;
  }

  window.speakKorean = speakKorean;
  window.stopKoreanAudio = stopKoreanAudio;
  window.extractKoreanForAudio = extractKorean;
  window.createAIAudioControls = createAudioControls;

  // Stop speech whenever the app navigates or the current view changes.
  document.addEventListener('click', (event) => {
    const navTarget = event.target.closest(
      'a, button, [data-view], [data-section], .nav-link, .sidebar-link'
    );
    if (navTarget && isSpeaking) {
      const href = navTarget.getAttribute('href') || '';
      const text = (navTarget.textContent || '').trim().toLowerCase();
      const isNavigation =
        href.startsWith('#') ||
        navTarget.matches('[data-view], [data-section], .nav-link, .sidebar-link') ||
        /study|dashboard|vocab|manage|home|ai tutor|profile|setting/.test(text);

      if (isNavigation) stopKoreanAudio();
    }
  }, true);

  window.addEventListener('hashchange', stopKoreanAudio);
  window.addEventListener('beforeunload', stopKoreanAudio);

  if ('speechSynthesis' in window) {
    loadKoreanVoices();
    window.speechSynthesis.onvoiceschanged = loadKoreanVoices;
  }
})();
