/* Dashboard / Statistics navigation. The dashboard uses the existing statistics view. */
(function () {
  const originalSwitchTab = window.switchTab;
  window.switchTab = function (tab) {
    if (tab === 'statistics') {
      if (typeof requireAdmin === 'function' && !requireAdmin('statistics')) return;
      document.querySelectorAll('#app-views .view').forEach(v => {
        const active = v.id === 'statistics-view';
        v.classList.toggle('active', active);
        v.hidden = !active;
        v.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === 'statistics'));
      if (typeof loadStatistics === 'function') loadStatistics();
      return;
    }
    if (typeof originalSwitchTab === 'function') return originalSwitchTab(tab);
  };
})();
