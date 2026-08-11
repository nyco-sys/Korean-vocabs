
/* Study Statistics dashboard. */

async function loadStatistics() {
  const dashboard = document.getElementById('statistics-dashboard');
  const loading = document.getElementById('statistics-loading');
  const empty = document.getElementById('statistics-empty');
  const loginNotice = document.getElementById('statistics-login-notice');
  if (!dashboard || !loading || !empty || !loginNotice) return;

  if (!adminAuthenticated) {
    loading.style.display = 'none';
    dashboard.style.display = 'none';
    empty.style.display = 'none';
    loginNotice.style.display = 'block';
    return;
  }

  loginNotice.style.display = 'none';
  loading.style.display = 'block';
  dashboard.style.display = 'none';
  empty.style.display = 'none';

  const days = Number(document.getElementById('statistics-period')?.value || 30);
  const rows = await fetchStudyStatistics(days);

  if (!rows) {
    loading.style.display = 'none';
    loginNotice.style.display = 'block';
    return;
  }

  const stats = calculateStudyStatistics(rows);
  loading.style.display = 'none';

  if (!rows.length) {
    empty.style.display = 'block';
    return;
  }

  dashboard.style.display = 'block';
  renderStudyStatistics(stats);
}

function renderStudyStatistics(stats) {
  setText('stat-total', stats.totalAttempts);
  setText('stat-correct', stats.correct);
  setText('stat-wrong', stats.wrong);
  setText('stat-accuracy', `${stats.accuracy}%`);
  setText('stat-image', stats.imageAttempts);
  setText('stat-text', stats.textAttempts);
  setText('stat-skipped', stats.skipped);

  const categories = document.getElementById('stats-categories');
  if (categories) {
    categories.innerHTML = stats.categoryList.length
      ? stats.categoryList.slice(0, 6).map(c => `
          <div class="stats-row">
            <div>
              <strong>${escapeHtml(c.name)}</strong>
              <small>${c.wrong} wrong · ${c.attempts} attempts</small>
            </div>
            <span class="stats-score ${c.accuracy < 70 ? 'bad' : c.accuracy < 85 ? 'medium' : 'good'}">${c.accuracy}%</span>
          </div>
        `).join('')
      : '<div class="stats-muted">No category data yet.</div>';
  }

  const difficult = document.getElementById('stats-difficult-words');
  if (difficult) {
    difficult.innerHTML = stats.difficultWords.length
      ? stats.difficultWords.map(w => `
          <div class="stats-row">
            <div>
              <strong>${escapeHtml(w.korean)}</strong>
              <small>${escapeHtml(w.english)} · ${escapeHtml(w.category)}</small>
            </div>
            <span class="stats-count">✗ ${w.wrong}</span>
          </div>
        `).join('')
      : '<div class="stats-muted">No mistakes recorded in this period.</div>';
  }

  const practiced = document.getElementById('stats-practiced-words');
  if (practiced) {
    practiced.innerHTML = stats.practicedWords.length
      ? stats.practicedWords.map(w => `
          <div class="stats-row">
            <div>
              <strong>${escapeHtml(w.korean)}</strong>
              <small>${escapeHtml(w.english)} · ${escapeHtml(w.category)}</small>
            </div>
            <span class="stats-count">${w.attempts} attempts</span>
          </div>
        `).join('')
      : '<div class="stats-muted">No vocabulary practiced in this period.</div>';
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function handleStatisticsAuthChange() {
  if (document.getElementById('statistics-view')) loadStatistics();
}
