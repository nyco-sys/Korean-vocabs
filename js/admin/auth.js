    /* TAB & DATA MANAGEMENT */

    /* ADMIN AUTHENTICATION */
    let adminAuthenticated = false;

    function isAdminAuthenticated() {
      return adminAuthenticated;
    }

    async function refreshAuthUI() {
      if (!supabaseClient) return;
      const { data } = await supabaseClient.auth.getSession();
      adminAuthenticated = !!data?.session;
      document.body.classList.toggle('admin-authenticated', adminAuthenticated);

      const loginBtn = document.getElementById('login-nav-btn');
      const logoutBtn = document.getElementById('logout-nav-btn');
      document.querySelectorAll('.admin-only-nav').forEach(btn => {
        btn.style.display = adminAuthenticated ? '' : 'none';
      });
      if (loginBtn) loginBtn.style.display = adminAuthenticated ? 'none' : '';
      if (logoutBtn) logoutBtn.style.display = adminAuthenticated ? '' : 'none';
    }

    function openLoginModal() {
      const modal = document.getElementById('login-modal');
      if (!modal) return;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      document.getElementById('login-error').textContent = '';
      setTimeout(() => document.getElementById('admin-email')?.focus(), 50);
    }

    function closeLoginModal() {
      const modal = document.getElementById('login-modal');
      if (!modal) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
    }

    async function loginAdmin(event) {
      event.preventDefault();
      if (!supabaseClient) {
        document.getElementById('login-error').textContent = 'Supabase is not available. Please refresh.';
        return;
      }

      const email = document.getElementById('admin-email').value.trim();
      const password = document.getElementById('admin-password').value;
      const errorBox = document.getElementById('login-error');
      const button = event.submitter || event.target.querySelector('button[type="submit"]');

      errorBox.textContent = '';
      if (button) { button.disabled = true; button.textContent = 'Logging in...'; }

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        adminAuthenticated = !!data.session;
        await refreshAuthUI();
        closeLoginModal();
        document.getElementById('admin-login-form')?.reset();
        alert('Admin login successful.');
      } catch (error) {
        console.error('Admin login failed:', error);
        errorBox.textContent = error.message || 'Login failed. Check your email and password.';
      } finally {
        if (button) { button.disabled = false; button.textContent = 'Login'; }
      }
    }

    async function logoutAdmin() {
      if (!supabaseClient) return;
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        alert('Could not log out. Please try again.');
        return;
      }
      adminAuthenticated = false;
      await refreshAuthUI();
      switchTab('study');
    }

    function requireAdmin(tab) {
      const protectedTabs = ['add','text-add','manage','review'];
      if (protectedTabs.includes(tab) && !adminAuthenticated) {
        openLoginModal();
        return false;
      }
      return true;
    }

    function switchTab(tab) {
      if (!requireAdmin(tab)) return;
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const view=document.getElementById(tab + '-view');
      if(view) view.classList.add('active');
      if(tab==='study') document.getElementById('user-input')?.focus();
      if(tab==='text-study') document.getElementById('text-user-input')?.focus();
      if(tab==='manage') loadManageData();
      if(tab==='review') loadMistakeReview();
    }



// Refresh statistics when authentication changes.
function refreshStatisticsAfterAuth() {
  if (typeof handleStatisticsAuthChange === 'function') handleStatisticsAuthChange();
}
