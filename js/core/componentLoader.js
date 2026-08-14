/* HTML component loader for GitHub Pages (no PHP/server required). */
const APP_COMPONENTS = {
  header: 'components/navbar.html',
  views: [
    'components/views/study-image.html',
    'components/views/add-image.html',
    'components/views/study-text.html',
    'components/views/add-text.html',
    'components/views/manage.html',
    'components/views/review-mistakes.html',
    'components/views/statistics.html',
    'components/views/ai-tutor.html',
    'components/views/users.html'
  ],
  modals: [
    'components/modals/edit-vocab.html',
    'components/modals/login.html',
    'components/modals/user.html'
  ]
};

async function loadHtmlFragment(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Could not load component: ${url} (${response.status})`);
  return response.text();
}

async function loadAppComponents() {
  const header = document.getElementById('app-header');
  const views = document.getElementById('app-views');
  const modals = document.getElementById('app-modals');
  if (!header || !views || !modals) throw new Error('Application mount points are missing.');

  header.innerHTML = await loadHtmlFragment(APP_COMPONENTS.header);
  views.innerHTML = (await Promise.all(APP_COMPONENTS.views.map(loadHtmlFragment))).join('\n');
  modals.innerHTML = (await Promise.all(APP_COMPONENTS.modals.map(loadHtmlFragment))).join('\n');
}
