let managedUsers = [];
let editingUserId = null;

async function adminUsersRequest(method='GET', body=null) {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) throw new Error('Please sign in.');
  const options = { method, headers: { Authorization: `Bearer ${session.access_token}`, apikey: SUPABASE_PUBLISHABLE_KEY } };
  if (body) { options.headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(body); }
  const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-users`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || 'Admin request failed.');
  return data;
}

async function loadUsers() {
  if (!isAdminUser()) return;
  const list = document.getElementById('users-list');
  if (!list) return;
  list.innerHTML = '<div class="users-empty">Loading users...</div>';
  try {
    const data = await adminUsersRequest('GET');
    managedUsers = data.users || [];
    renderUsers();
  } catch (error) {
    console.error('Could not load users:', error);
    list.innerHTML = `<div class="users-empty">${escapeHtml(error.message)}</div>`;
  }
}

function renderUsers() {
  const list = document.getElementById('users-list');
  const search = (document.getElementById('user-search')?.value || '').trim().toLowerCase();
  if (!list) return;
  const users = managedUsers.filter(u => !search || `${u.display_name || ''} ${u.email || ''}`.toLowerCase().includes(search));
  if (!users.length) { list.innerHTML = '<div class="users-empty">No users found.</div>'; return; }

  list.innerHTML = users.map(user => `
    <article class="user-card">
      <div class="user-avatar">${escapeHtml((user.display_name || user.email || '?').slice(0,1).toUpperCase())}</div>
      <div class="user-main">
        <div class="user-name-row"><h3>${escapeHtml(user.display_name || 'Unnamed user')}</h3><span class="user-role-badge ${user.role === 'admin' ? 'admin' : ''}">${escapeHtml(user.role)}</span></div>
        <p>${escapeHtml(user.email || '')}</p>
        <div class="user-meta"><span class="${user.status === 'active' ? 'status-active' : 'status-disabled'}">● ${escapeHtml(user.status)}</span><span>AI Tutor ${user.ai_tutor_enabled ? 'allowed' : 'disabled'}</span></div>
      </div>
      <div class="user-actions">
        <button class="btn btn-secondary" type="button" onclick="editManagedUser('${user.id}')">Edit</button>
        <button class="btn btn-danger-soft" type="button" onclick="deleteManagedUser('${user.id}')">Delete</button>
      </div>
    </article>`).join('');
}

function openCreateUserModal() {
  editingUserId = null;
  document.getElementById('user-form')?.reset();
  document.getElementById('user-id').value = '';
  document.getElementById('user-email').disabled = false;
  document.getElementById('user-password').required = true;
  document.getElementById('user-password-hint').textContent = '(minimum 8 characters)';
  document.getElementById('user-status-wrap').style.display = 'none';
  document.getElementById('user-modal-title').textContent = 'Create User';
  document.getElementById('user-modal-subtitle').textContent = 'Create an account for a learner.';
  document.getElementById('user-submit-btn').textContent = 'Create User';
  document.getElementById('user-form-error').textContent = '';
  openUserModal();
}

function editManagedUser(id) {
  const user = managedUsers.find(u => u.id === id);
  if (!user) return;
  editingUserId = id;
  document.getElementById('user-id').value = id;
  document.getElementById('user-name').value = user.display_name || '';
  document.getElementById('user-email').value = user.email || '';
  document.getElementById('user-email').disabled = true;
  document.getElementById('user-password').value = '';
  document.getElementById('user-password').required = false;
  document.getElementById('user-password-hint').textContent = '(leave blank to keep current password)';
  document.getElementById('user-role').value = user.role || 'user';
  document.getElementById('user-ai-enabled').checked = !!user.ai_tutor_enabled;
  document.getElementById('user-status').value = user.status || 'active';
  document.getElementById('user-status-wrap').style.display = '';
  document.getElementById('user-modal-title').textContent = 'Edit User';
  document.getElementById('user-modal-subtitle').textContent = 'Update account access and AI Tutor permissions.';
  document.getElementById('user-submit-btn').textContent = 'Save Changes';
  document.getElementById('user-form-error').textContent = '';
  openUserModal();
}

function openUserModal() {
  const modal = document.getElementById('user-modal');
  if (!modal) return;
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
}
function closeUserModal() {
  const modal = document.getElementById('user-modal');
  if (!modal) return;
  modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
}

async function saveUser(event) {
  event.preventDefault();
  const button = document.getElementById('user-submit-btn');
  const errorBox = document.getElementById('user-form-error');
  errorBox.textContent = '';
  button.disabled = true;
  try {
    const body = {
      user_id: editingUserId || undefined,
      email: document.getElementById('user-email').value.trim(),
      password: document.getElementById('user-password').value,
      display_name: document.getElementById('user-name').value.trim(),
      role: document.getElementById('user-role').value,
      ai_tutor_enabled: document.getElementById('user-ai-enabled').checked,
      status: document.getElementById('user-status').value
    };
    if (editingUserId) {
      await adminUsersRequest('PATCH', body);
    } else {
      await adminUsersRequest('POST', body);
    }
    closeUserModal();
    await loadUsers();
  } catch (error) {
    console.error('Could not save user:', error);
    errorBox.textContent = error.message || 'Could not save user.';
  } finally { button.disabled = false; }
}

async function deleteManagedUser(id) {
  const user = managedUsers.find(u => u.id === id);
  if (!user) return;
  if (id === currentAuthUser?.id) { notify('You cannot delete the currently signed-in admin account.'); return; }
  if (!confirm(`Delete ${user.display_name || user.email}? This permanently removes the account and its user-owned data.`)) return;
  try { await adminUsersRequest('DELETE', { user_id: id }); await loadUsers(); }
  catch (error) { notify(error.message || 'Could not delete user.'); }
}
