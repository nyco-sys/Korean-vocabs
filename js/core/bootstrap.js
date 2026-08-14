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

  await loadInitialData();
  openStudySettings('image');
  openStudySettings('text');
  setupPhysicalKeyboardListener();
  setupAddKoreanKeyboard();
  setupTextKoreanKeyboards();
  setupEditKoreanKeyboard();
  if (adminAuthenticated) { loadStatistics(); loadAISettings(); }
});
