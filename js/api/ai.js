let aiConfigured = false;
let aiConversations = [];
let activeAIConversationId = null;

async function aiTutorRequest(method='GET', body=null) {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) throw new Error('Please sign in first.');
  const options = { method, headers: { Authorization: `Bearer ${session.access_token}`, apikey: SUPABASE_PUBLISHABLE_KEY } };
  if (body) { options.headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(body); }
  const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-tutor`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || 'AI Tutor request failed.');
  return data;
}

async function loadAISettings() {
  const status = document.getElementById('ai-config-status');
  const shell = document.getElementById('ai-chat-shell');
  const notice = document.getElementById('ai-access-notice');
  const profile = getCurrentUserProfile?.();
  if (!isUserAuthenticated() || !profile?.ai_tutor_enabled) {
    if (shell) shell.style.display = 'none';
    if (notice) notice.style.display = isUserAuthenticated() ? 'block' : 'none';
    return;
  }
  try {
    const data = await aiTutorRequest('GET');
    aiConfigured = !!data.configured;
    if (status) status.textContent = aiConfigured ? `✓ ${data.providers.join(' → ')}` : 'No provider configured';
    if (notice) notice.style.display = aiConfigured ? 'none' : 'block';
    if (shell) shell.style.display = aiConfigured ? 'grid' : 'none';
    if (aiConfigured) await loadAIConversations();
  } catch (error) {
    aiConfigured = false;
    if (status) status.textContent = 'Unavailable';
    if (notice) { notice.style.display = 'block'; notice.querySelector('h3').textContent = 'AI Tutor unavailable'; notice.querySelector('p').textContent = error.message; }
    if (shell) shell.style.display = 'none';
  }
}

async function loadAIConversations() {
  const list = document.getElementById('ai-conversation-list');
  if (!list || !supabaseClient) return;
  const { data, error } = await supabaseClient.from('ai_conversations').select('id,title,created_at,updated_at').order('updated_at',{ascending:false});
  if (error) { console.error('Could not load AI history:', error); list.innerHTML = '<div class="ai-history-empty">Could not load history.</div>'; return; }
  aiConversations = data || [];
  renderAIConversationList();
  if (activeAIConversationId && aiConversations.some(c => c.id === activeAIConversationId)) await openAIConversation(activeAIConversationId);
  else if (aiConversations[0]) await openAIConversation(aiConversations[0].id);
  else newAIConversation();
}

function renderAIConversationList() {
  const list = document.getElementById('ai-conversation-list'); if (!list) return;
  if (!aiConversations.length) { list.innerHTML = '<div class="ai-history-empty">No conversations yet.<br>Start a new chat.</div>'; return; }
  list.innerHTML = aiConversations.map(c => `<button class="ai-conversation-item ${c.id===activeAIConversationId?'active':''}" type="button" onclick="openAIConversation('${c.id}')"><span>💬</span><span>${escapeAIHtml(c.title || 'New conversation')}</span></button>`).join('');
}

async function openAIConversation(id) {
  activeAIConversationId = id;
  const title = aiConversations.find(c => c.id === id)?.title || 'New conversation';
  document.getElementById('ai-current-title').textContent = title;
  renderAIConversationList();
  const messages = document.getElementById('ai-messages'); if (!messages) return;
  messages.innerHTML = '<div class="ai-history-loading">Loading conversation...</div>';
  const { data, error } = await supabaseClient.from('ai_messages').select('role,content,provider,created_at').eq('conversation_id',id).order('created_at',{ascending:true});
  if (error) { messages.innerHTML = '<div class="ai-history-empty">Could not load this conversation.</div>'; return; }
  messages.innerHTML = '';
  (data || []).forEach(m => addAIMessage(m.content,m.role,{provider:m.provider,scroll:false}));
  if (!(data || []).length) showAIWelcome();
  messages.scrollTop = messages.scrollHeight;
}

function showAIWelcome() {
  const messages = document.getElementById('ai-messages'); if (!messages) return;
  messages.innerHTML = `<div class="ai-message assistant"><div class="ai-rich-text"><p><strong>안녕하세요! 👋</strong></p><p>I'm your Korean tutor. Ask me about grammar, vocabulary, particles, pronunciation, or a sentence you're studying.</p><div class="ai-suggestion-row"><button type="button" onclick="useAISuggestion('What is the difference between 은/는 and 이/가?')">은/는 vs 이/가</button><button type="button" onclick="useAISuggestion('Give me 5 Korean example sentences for beginners.')">Example sentences</button></div></div></div>`;
}
function useAISuggestion(text){ const input=document.getElementById('ai-message'); input.value=text; input.focus(); }
function newAIConversation() { activeAIConversationId=null; document.getElementById('ai-current-title').textContent='New conversation'; renderAIConversationList(); showAIWelcome(); document.getElementById('ai-message')?.focus(); }

async function askAITutor() {
  const input=document.getElementById('ai-message'), button=document.getElementById('ai-send-btn');
  const message=input.value.trim(); if(!message || !aiConfigured) return;
  addAIMessage(message,'user'); input.value=''; button.disabled=true; button.classList.add('is-loading'); button.innerHTML='<span class="ai-spinner"></span>Thinking';
  try {
    const data=await aiTutorRequest('POST',{message,conversation_id:activeAIConversationId});
    activeAIConversationId=data.conversation_id;
    if (!aiConversations.some(c=>c.id===data.conversation_id)) aiConversations.unshift({id:data.conversation_id,title:data.title,updated_at:new Date().toISOString()});
    else { const c=aiConversations.find(c=>c.id===data.conversation_id); if(c){c.title=data.title;c.updated_at=new Date().toISOString();} }
    document.getElementById('ai-current-title').textContent=data.title||'Conversation'; renderAIConversationList();
    addAIMessage(data.answer || 'I could not generate a response.','assistant',{provider:data.provider,fallback:data.fallbackUsed});
  } catch(error) { addAIMessage(error.message||'AI request failed.','error'); }
  finally { button.disabled=false; button.classList.remove('is-loading'); button.innerHTML='Send <span class="send-arrow">↗</span>'; input.focus(); }
}

function escapeAIHtml(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
function renderAIMarkdown(text){let html=escapeAIHtml(text);html=html.replace(/`([^`\n]+)`/g,'<code>$1</code>').replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>').replace(/__([^_\n]+)__/g,'<strong>$1</strong>').replace(/\*([^*\n]+)\*/g,'<em>$1</em>').replace(/^###\s+(.+)$/gm,'<h5>$1</h5>').replace(/^##\s+(.+)$/gm,'<h4>$1</h4>').replace(/^#\s+(.+)$/gm,'<h3>$1</h3>').replace(/^\s*[-•]\s+(.+)$/gm,'<li>$1</li>');html=html.replace(/(?:<li>.*?<\/li>\s*)+/gs,m=>`<ul>${m}</ul>`);html=html.replace(/\n{2,}/g,'</p><p>').replace(/\n/g,'<br>');return `<div class="ai-rich-text"><p>${html}</p></div>`.replace(/<p><\/p>/g,'');}
function addAIMessage(text,role,meta={}){const messages=document.getElementById('ai-messages');if(!messages)return;const bubble=document.createElement('div');bubble.className=`ai-message ${role}`;if(role==='assistant'){bubble.innerHTML=renderAIMarkdown(text);if(meta.provider){const provider=document.createElement('div');provider.className='ai-provider-badge';provider.innerHTML=`<span class="provider-dot"></span>${escapeAIHtml(meta.provider)}${meta.fallback?' · fallback':''}`;bubble.appendChild(provider);}}else if(role==='user')bubble.textContent=text;else bubble.innerHTML=`<div class="ai-error-content"><span>⚠️</span><span>${escapeAIHtml(text)}</span></div>`;messages.appendChild(bubble);if(meta.scroll!==false)messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'});}
function handleAIKeydown(event){if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();askAITutor();}}
document.addEventListener('input',e=>{if(e.target.id==='ai-message'){const c=document.getElementById('ai-character-count');if(c)c.textContent=`${e.target.value.length} / 4000`;}});
