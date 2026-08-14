/* =========================================================
   SIDEBAR NAVIGATION
   One logo trigger on desktop + mobile.
   Closed: only the logo is visible.
   Open: full sidebar appears and its own X closes it.
   ========================================================= */
(function () {
  function setOpen(open) {
    const sidebar = document.getElementById('app-sidebar');
    const trigger = document.getElementById('sidebar-logo-trigger');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (!sidebar) return;

    sidebar.classList.toggle('is-open', open);
    document.body.classList.toggle('sidebar-open', open);

    if (trigger) {
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', open ? 'Sidebar open' : 'Open sidebar');
    }

    if (backdrop) {
      backdrop.classList.toggle('is-visible', open && window.innerWidth <= 900);
    }
  }

  function toggleNavigation() {
    const sidebar = document.getElementById('app-sidebar');
    if (!sidebar) return;
    setOpen(!sidebar.classList.contains('is-open'));
  }

  function closeNavigation() {
    setOpen(false);
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('#sidebar-logo-trigger')) {
      event.preventDefault();
      event.stopPropagation();
      toggleNavigation();
      return;
    }

    if (event.target.closest('#sidebar-close')) {
      event.preventDefault();
      closeNavigation();
      return;
    }

    if (event.target.closest('#main-navigation .nav-btn, .admin-nav .nav-btn')) {
      if (window.innerWidth <= 900) closeNavigation();
      return;
    }

    if (event.target.closest('#sidebar-backdrop')) {
      closeNavigation();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const modal = document.getElementById('logout-modal');
      if (modal?.classList.contains('is-visible')) closeLogoutModal();
      else closeNavigation();
    }
  });

  window.addEventListener('resize', () => {
    const backdrop = document.getElementById('sidebar-backdrop');
    if (window.innerWidth > 900 && backdrop) backdrop.classList.remove('is-visible');
    if (window.innerWidth <= 900 && !document.getElementById('app-sidebar')?.classList.contains('is-open')) {
      document.body.classList.remove('sidebar-open');
    }
  });

  document.addEventListener('DOMContentLoaded', () => setOpen(false));

  window.closeMobileNavigation = closeNavigation;
  window.openSidebar = () => setOpen(true);
  window.closeSidebar = closeNavigation;
})();

/* =========================================================
   LOGOUT UI
   ========================================================= */
function openLogoutModal() {
  const modal = document.getElementById('logout-modal');
  if (!modal) return;
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => modal.querySelector('.logout-cancel')?.focus(), 50);
}

function closeLogoutModal() {
  const modal = document.getElementById('logout-modal');
  if (!modal) return;
  modal.classList.remove('is-visible');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

async function confirmLogout() {
  closeLogoutModal();
  await logoutAdmin();
}
