
/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

(function () {
  function closeMobileNavigation() {
    const menu = document.getElementById('main-navigation');
    const toggle = document.getElementById('mobile-menu-toggle');

    if (!menu || !toggle) return;

    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function toggleMobileNavigation() {
    const menu = document.getElementById('main-navigation');
    const toggle = document.getElementById('mobile-menu-toggle');

    if (!menu || !toggle) return;

    const open = menu.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute(
      'aria-label',
      open ? 'Close navigation menu' : 'Open navigation menu'
    );
  }

  // Delegation is intentional because navbar.html is loaded as a component.
  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('#mobile-menu-toggle');

    if (toggle) {
      event.stopPropagation();
      toggleMobileNavigation();
      return;
    }

    // Close after selecting a navigation item.
    if (event.target.closest('#main-navigation .nav-btn')) {
      closeMobileNavigation();
      return;
    }

    // Close when clicking outside the header/menu.
    const header = event.target.closest('header');
    if (!header) {
      closeMobileNavigation();
    }
  });

  // Close the menu when switching back to desktop width.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 800) {
      closeMobileNavigation();
    }
  });

  // Expose a small helper for the app if needed later.
  window.closeMobileNavigation = closeMobileNavigation;
})();
