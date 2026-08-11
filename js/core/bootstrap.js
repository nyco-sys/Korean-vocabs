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
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      adminAuthenticated = !!session;
      document.body.classList.toggle('admin-authenticated', adminAuthenticated);
      const loginBtn = document.getElementById('login-nav-btn');
      const logoutBtn = document.getElementById('logout-nav-btn');
      document.querySelectorAll('.admin-only-nav').forEach(btn => {
        btn.style.display = adminAuthenticated ? '' : 'none';
      });
      if (loginBtn) loginBtn.style.display = adminAuthenticated ? 'none' : '';
      if (logoutBtn) logoutBtn.style.display = adminAuthenticated ? '' : 'none';
    });
  }
  await loadInitialData();
  setupPhysicalKeyboardListener();
  setupAddKoreanKeyboard();
  setupTextKoreanKeyboards();
  setupEditKoreanKeyboard();
});
