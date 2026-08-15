document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadAppComponents();
  } catch (error) {
    console.error('Component loading failed:', error);
    document.getElementById('main-content').innerHTML = '<div class="glass-panel">Could not load the application components. Please refresh.</div>';
    return;
  }

  initializeSupabase();
  if (supabaseClient) {
    await refreshAuthUI();
    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      adminAuthenticated = !!session;
      await refreshAuthUI();

      // If the current page requires authentication and the session ended,
      // immediately return the user to the public Study Image page.
      const activeView = document.querySelector('.view.active');
      if (!adminAuthenticated && activeView?.classList.contains('auth-required-view')) {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const gate = document.getElementById('auth-gate');
        if (gate) gate.hidden = false;
      }

      if (typeof refreshStatisticsAfterAuth === 'function') refreshStatisticsAfterAuth();
      if (typeof loadAISettings === 'function') loadAISettings();
    });
  }
  // Always start with exactly one authenticated view (Study Image).
  // Component HTML may contain an initial .active class, so normalize it here.
  document.querySelectorAll('#app-views .view').forEach(v => {
    v.classList.remove('active');
    v.hidden = true;
    v.setAttribute('aria-hidden', 'true');
  });
  if (adminAuthenticated) setActiveView('statistics');

  if (typeof initializeLessons === 'function') initializeLessons();
  await loadInitialData();
  openStudySettings('image');
  openStudySettings('text');
  setupPhysicalKeyboardListener();
  setupAddKoreanKeyboard();
  setupTextKoreanKeyboards();
  setupEditKoreanKeyboard();
  if (adminAuthenticated) { loadStatistics(); loadAISettings(); }
});

// Initialize AI Tutor Korean keyboard whenever the AI view is injected.
if (!window.__aiKeyboardObserver) {
  window.__aiKeyboardObserver = new MutationObserver(() => {
    if (typeof window.setupAIKoreanKeyboard === 'function' && document.getElementById('ai-message')) {
      window.setupAIKoreanKeyboard();
      window.__aiKeyboardObserver.disconnect();
    }
  });
  window.__aiKeyboardObserver.observe(document.body, { childList: true, subtree: true });
}
