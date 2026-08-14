/* Premium in-app notifications — replaces browser alert() dialogs. */
(function () {
  function ensureContainer() {
    let container = document.getElementById('app-notifications');
    if (container) return container;
    container = document.createElement('div');
    container.id = 'app-notifications';
    container.className = 'app-notifications';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
    return container;
  }

  function inferType(message) {
    const text = String(message || '').toLowerCase();
    if (/success|successfully|added|updated|saved|enabled|completed|copied/.test(text)) return 'success';
    if (/disabled|warning|cannot|unable|not enabled|please contact/.test(text)) return 'warning';
    if (/error|failed|could not|invalid|denied|unauthorized|forbidden|delete/.test(text)) return 'error';
    return 'info';
  }

  function notify(message, type) {
    const container = ensureContainer();
    const toast = document.createElement('div');
    const resolvedType = type || inferType(message);
    const icons = { success: '✓', error: '!', warning: '!', info: 'i' };
    toast.className = `app-toast app-toast-${resolvedType}`;
    toast.setAttribute('role', resolvedType === 'error' ? 'alert' : 'status');
    toast.innerHTML = `
      <span class="app-toast-icon" aria-hidden="true">${icons[resolvedType] || 'i'}</span>
      <div class="app-toast-content"><span class="app-toast-title">${resolvedType.charAt(0).toUpperCase() + resolvedType.slice(1)}</span><span class="app-toast-message"></span></div>
      <button class="app-toast-close" type="button" aria-label="Dismiss notification">×</button>
      <span class="app-toast-progress" aria-hidden="true"></span>
    `;
    toast.querySelector('.app-toast-message').textContent = String(message || '');
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('is-visible'));
    const remove = () => {
      if (toast.dataset.removing) return;
      toast.dataset.removing = '1';
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 240);
    };
    toast.querySelector('.app-toast-close').addEventListener('click', remove);
    const duration = resolvedType === 'error' ? 5200 : 3600;
    const timer = setTimeout(remove, duration);
    toast.addEventListener('mouseenter', () => clearTimeout(timer), { once: true });
    return toast;
  }

  window.notify = notify;
  window.showNotification = notify;
})();
