/* AUTHENTICATION + AUTHORIZATION */
let adminAuthenticated = false; // kept for backwards compatibility with existing modules
let authenticatedUser = null;
let currentUserProfile = null;
let currentAuthUser = null;

const PROTECTED_TABS = ['study','text-study','add','text-add','manage','review','statistics','ai-tutor'];
const ADMIN_TABS = ['users'];

function isUserAuthenticated() { return !!authenticatedUser; }
function isAdminUser() { return !!authenticatedUser && currentUserProfile?.role === 'admin' && currentUserProfile?.status === 'active'; }
function isAdminAuthenticated() { return isUserAuthenticated(); } // existing vocabulary modules use this as a login guard
function getCurrentUserProfile() { return currentUserProfile; }

async function loadCurrentProfile(user) {
  if (!user || !supabaseClient) return null;

  let { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('id,email,display_name,role,status,ai_tutor_enabled')
    .eq('id', user.id)
    .maybeSingle();

  // Bootstrap the very first account. This is intentionally done only when
  // there is no active admin yet. The SQL function performs the authoritative check.
  if (profileError) {
    console.error('Could not load account profile:', profileError);
  }

  if (!profile || profile.status !== 'active' || profile.role !== 'admin') {
    const { data: claimResult, error: claimError } = await supabaseClient.rpc('claim_first_admin');
    if (claimError) {
      console.error('First-admin bootstrap failed:', claimError);
    } else if (claimResult?.claimed) {
      console.info('First account activated as admin.');
    }

    const result = await supabaseClient
      .from('profiles')
      .select('id,email,display_name,role,status,ai_tutor_enabled')
      .eq('id', user.id)
      .maybeSingle();
    profile = result.data;
    if (result.error) console.error('Could not reload account profile:', result.error);
  }

  return profile || null;
}

function setProtectedNavVisibility() {
  const loggedIn = isUserAuthenticated();
  const admin = isAdminUser();
  document.body.classList.toggle('authenticated', loggedIn);
  document.body.classList.toggle('admin-authenticated', admin);
  // The sidebar/logo navigation belongs to the authenticated application.
  // Keep the logged-out screen focused on the Sign In gate.
  if (!loggedIn) {
    document.body.classList.remove('sidebar-open');
    document.getElementById('app-sidebar')?.classList.remove('is-open');
    document.getElementById('sidebar-backdrop')?.classList.remove('is-visible');
  }
  document.body.classList.toggle('ai-tutor-enabled', !!currentUserProfile?.ai_tutor_enabled);
  const authGate = document.getElementById('auth-gate');
  const appViews = document.getElementById('app-views');
  const appHeader = document.getElementById('app-header');

  // The entire application (sidebar + study pages + protected views) is hidden
  // until Supabase confirms an authenticated session. This prevents Study Image
  // or any other view from appearing outside the Sign In gate while logged out.
  if (authGate) authGate.hidden = loggedIn;
  if (appViews) appViews.hidden = !loggedIn;
  if (appHeader) appHeader.hidden = !loggedIn;

  document.querySelectorAll('.auth-required-nav').forEach(btn => { btn.style.display = loggedIn ? '' : 'none'; });
  const manageLabel = document.getElementById('manage-section-label'); if (manageLabel) manageLabel.style.display = loggedIn ? '' : 'none';
  const adminLabel = document.getElementById('admin-section-label'); if (adminLabel) adminLabel.style.display = admin ? '' : 'none';
  document.querySelectorAll('.admin-only-nav').forEach(btn => { btn.style.display = admin ? '' : 'none'; });
  document.querySelectorAll('#app-views .view').forEach(view => {
    if (!loggedIn) {
      view.hidden = true;
      view.classList.remove('active');
      view.setAttribute('aria-hidden', 'true');
    } else if (!view.classList.contains('active')) {
      view.hidden = true;
      view.setAttribute('aria-hidden', 'true');
    }
  });
  document.querySelectorAll('.admin-only-view').forEach(view => {
    if (!admin || !loggedIn) {
      view.hidden = true;
      view.classList.remove('active');
      view.setAttribute('aria-hidden', 'true');
    }
  });

  // AI Tutor is a separate permission from simply being logged in.
  document.querySelectorAll('[data-ai-nav]').forEach(btn => {
    btn.style.display = loggedIn && currentUserProfile?.ai_tutor_enabled ? '' : 'none';
  });
  const loginBtn = document.getElementById('login-nav-btn');
  const logoutBtn = document.getElementById('logout-nav-btn');
  const userCard = document.getElementById('sidebar-user-card');
  const userAvatar = document.getElementById('sidebar-user-avatar');
  const userName = document.getElementById('sidebar-user-name');
  const userEmail = document.getElementById('sidebar-user-email');
  const userRole = document.getElementById('sidebar-user-role');
  if (userCard) userCard.hidden = !loggedIn;
  if (loggedIn) {
    const displayName = currentUserProfile?.display_name || authenticatedUser?.email?.split('@')[0] || 'User';
    const email = currentUserProfile?.email || authenticatedUser?.email || '';
    const initials = displayName.trim().split(/\s+/).slice(0,2).map(part => part[0]).join('').toUpperCase() || 'U';
    if (userAvatar) userAvatar.textContent = initials;
    if (userName) userName.textContent = displayName;
    if (userEmail) userEmail.textContent = email;
    if (userRole) userRole.textContent = admin ? 'ADMIN' : 'USER';
  }
  if (loginBtn) loginBtn.hidden = loggedIn;
  if (logoutBtn) logoutBtn.hidden = !loggedIn;
}

async function refreshAuthUI() {
  authenticatedUser = null; currentAuthUser = null; currentUserProfile = null; adminAuthenticated = false;
  if (!supabaseClient) { setProtectedNavVisibility(); return; }

  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
      currentAuthUser = session.user;
      authenticatedUser = session.user;
      currentUserProfile = await loadCurrentProfile(session.user);
      adminAuthenticated = true; // compatibility variable means "authenticated" now
      if (currentUserProfile?.role === 'admin') {
        try { await supabaseClient.rpc('claim_unowned_vocabulary'); } catch (_) {}
      }
    }
  } catch (error) { console.error('Auth refresh failed:', error); }

  setProtectedNavVisibility();
  if (isAdminUser() && typeof loadUsers === 'function' && document.getElementById('users-list')) loadUsers();
}

function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (!modal) return;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
  document.getElementById('login-error').textContent = '';
  setTimeout(() => document.getElementById('admin-email')?.focus(), 50);
}
function closeLoginModal() {
  const modal = document.getElementById('login-modal'); if (!modal) return;
  modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
}

async function loginAdmin(event) {
  event.preventDefault();
  if (!supabaseClient) return;
  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const errorBox = document.getElementById('login-error');
  const button = event.submitter || event.target.querySelector('button[type="submit"]');
  errorBox.textContent = '';
  if (button) { button.disabled = true; button.textContent = 'Signing in...'; }
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await refreshAuthUI();
    if (!authenticatedUser) throw new Error('Could not load your account profile.');
    if (!currentUserProfile) {
      await supabaseClient.auth.signOut();
      throw new Error('Your account profile could not be loaded. Please run the multi-user Supabase setup SQL.');
    }
    if (currentUserProfile.status !== 'active') {
      await supabaseClient.auth.signOut();
      throw new Error('This account is disabled. Please contact the administrator.');
    }
    // The session and profile are confirmed active at this point.
    // Close the modal before switching views so the authenticated app is visible immediately.
    closeLoginModal();
    document.getElementById('admin-login-form')?.reset();
    switchTab('statistics');
    notify('Signed in successfully.', 'success');
  } catch (error) { console.error('Login failed:', error); errorBox.textContent = error.message || 'Sign in failed.'; }
  finally { if (button) { button.disabled = false; button.textContent = 'Sign In'; } }
}

async function logoutAdmin() {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  if (error) { notify('Could not log out. Please try again.', 'error'); return; }

  // Clear only temporary study state. Saved user data such as vocabulary,
  // mistakes, statistics, and AI history remains untouched in Supabase.
  if (typeof resetStudyStateOnLogout === 'function') {
    resetStudyStateOnLogout();
  }

  authenticatedUser = null; currentAuthUser = null; currentUserProfile = null; adminAuthenticated = false;
  setProtectedNavVisibility();
}

function requireAdmin(tab) {
  if (!PROTECTED_TABS.includes(tab) && !ADMIN_TABS.includes(tab)) return true;
  if (!isUserAuthenticated()) { openLoginModal(); return false; }
  if (currentUserProfile?.status !== 'active') { notify('This account is disabled.', 'warning'); return false; }
  if (tab === 'ai-tutor' && !currentUserProfile?.ai_tutor_enabled) { notify('AI Tutor access has not been enabled for your account.', 'warning'); return false; }
  if (ADMIN_TABS.includes(tab) && !isAdminUser()) { notify('Admin access required.', 'error'); return false; }
  return true;
}

function setActiveView(tab) {
  const views = document.querySelectorAll('#app-views .view');
  views.forEach(v => {
    const active = v.id === `${tab}-view`;
    v.classList.toggle('active', active);
    v.hidden = !active;
    v.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
}

function switchTab(tab) {
  if (!requireAdmin(tab)) return;
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
  setActiveView(tab);
  if (tab === 'study') document.getElementById('user-input')?.focus();
  if (tab === 'text-study') document.getElementById('text-user-input')?.focus();
  if (tab === 'manage') loadManageData();
  if (tab === 'review') loadMistakeReview();
  if (tab === 'statistics' && typeof loadStatistics === 'function') loadStatistics();
  if (tab === 'ai-tutor' && typeof loadAISettings === 'function') loadAISettings();
  if (tab === 'users' && typeof loadUsers === 'function') loadUsers();
}

document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-nav-btn');
  const loginBtn = document.getElementById('login-nav-btn');
  if (logoutBtn) logoutBtn.hidden = true;
  if (loginBtn) loginBtn.hidden = false;
  refreshAuthUI().catch(error => console.error('Initial auth UI refresh failed:', error));
});
