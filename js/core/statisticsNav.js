
/* Adds the Statistics view to the existing tab system without replacing it. */
(function () {
  const originalSwitchTab = window.switchTab;

  function activateStatisticsTab() {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const view = document.getElementById('statistics-view');
    if (view) {
      view.classList.add('active');
      view.style.display = '';
    }
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector('[data-tab="statistics"]');
    if (btn) btn.classList.add('active');
    loadStatistics();
  }

  window.switchTab = function (tab) {
    if (tab === 'statistics') {
      activateStatisticsTab();
      return;
    }
    if (typeof originalSwitchTab === 'function') return originalSwitchTab(tab);
  };
})();
