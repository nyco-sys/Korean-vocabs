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
function renderAIMarkdown(text){
  const source = String(text ?? '').replace(/\r\n/g, '\n');
  const lines = source.split('\n');
  const output = [];
  let i = 0;

  function inlineMarkdown(value){
    let html = escapeAIHtml(value);
    html = html
      .replace(/`([^`\n]+)`/g,'<code>$1</code>')
      .replace(/\*\*([^*\n]+)\*\*/g,'<strong>$1</strong>')
      .replace(/__([^_\n]+)__/g,'<strong>$1</strong>')
      .replace(/\*([^*\n]+)\*/g,'<em>$1</em>');
    return html;
  }

  function splitTableRow(line){
    let value = line.trim();
    if (value.startsWith('|')) value = value.slice(1);
    if (value.endsWith('|') && !value.endsWith('\\|')) value = value.slice(0, -1);

    const cells = [];
    let cell = '';
    let escaped = false;

    for (const char of value) {
      if (char === '|' && !escaped) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += char;
      }
      escaped = char === '\\' && !escaped;
      if (char !== '\\') escaped = false;
    }
    cells.push(cell.trim());

    return cells.map(cell => cell.replace(/\\\|/g, '|'));
  }

  function isTableSeparator(line){
    const cells = splitTableRow(line);
    return cells.length > 0 && cells.every(cell =>
      /^:?-{3,}:?$/.test(cell.trim())
    );
  }

  function alignmentFor(cell){
    const value = cell.trim();
    if (value.startsWith(':') && value.endsWith(':')) return 'center';
    if (value.startsWith(':')) return 'left';
    if (value.endsWith(':')) return 'right';
    return '';
  }

  function renderTable(headerLine, separatorLine, bodyLines){
    const headers = splitTableRow(headerLine);
    const separators = splitTableRow(separatorLine);
    const rows = bodyLines.map(splitTableRow);

    const columnCount = Math.max(
      headers.length,
      separators.length,
      ...rows.map(row => row.length)
    );

    const headerCells = Array.from({length: columnCount}, (_, index) =>
      headers[index] ?? ''
    );

    const tableRows = rows.map(row =>
      Array.from({length: columnCount}, (_, index) => row[index] ?? '')
    );

    let html = '<div class="ai-table-wrap"><table class="ai-markdown-table"><thead><tr>';

    for (let index = 0; index < columnCount; index++) {
      const align = alignmentFor(separators[index] || '');
      html += `<th${align ? ` style="text-align:${align}"` : ''}>${inlineMarkdown(headerCells[index])}</th>`;
    }

    html += '</tr></thead>';

    if (tableRows.length) {
      html += '<tbody>';
      tableRows.forEach(row => {
        html += '<tr>';
        for (let index = 0; index < columnCount; index++) {
          const align = alignmentFor(separators[index] || '');
          html += `<td${align ? ` style="text-align:${align}"` : ''}>${inlineMarkdown(row[index])}</td>`;
        }
        html += '</tr>';
      });
      html += '</tbody>';
    }

    html += '</table></div>';
    return html;
  }

  while (i < lines.length) {
    // Markdown table: header + separator + zero or more body rows.
    if (
      i + 1 < lines.length &&
      lines[i].includes('|') &&
      isTableSeparator(lines[i + 1])
    ) {
      const body = [];
      let j = i + 2;

      while (j < lines.length && lines[j].trim() && lines[j].includes('|')) {
        body.push(lines[j]);
        j++;
      }

      output.push(renderTable(lines[i], lines[i + 1], body));
      i = j;
      continue;
    }

    const line = lines[i];

    if (/^\s*###\s+/.test(line)) {
      output.push(`<h5>${inlineMarkdown(line.replace(/^\s*###\s+/, ''))}</h5>`);
    } else if (/^\s*##\s+/.test(line)) {
      output.push(`<h4>${inlineMarkdown(line.replace(/^\s*##\s+/, ''))}</h4>`);
    } else if (/^\s*#\s+/.test(line)) {
      output.push(`<h3>${inlineMarkdown(line.replace(/^\s*#\s+/, ''))}</h3>`);
    } else if (/^\s*[-•]\s+/.test(line)) {
      const items = [];
      let j = i;
      while (j < lines.length && /^\s*[-•]\s+/.test(lines[j])) {
        items.push(`<li>${inlineMarkdown(lines[j].replace(/^\s*[-•]\s+/, ''))}</li>`);
        j++;
      }
      output.push(`<ul>${items.join('')}</ul>`);
      i = j;
      continue;
    } else if (!line.trim()) {
      output.push('');
    } else {
      output.push(inlineMarkdown(line));
    }

    i++;
  }

  // Preserve ordinary paragraphs while keeping block-level tables/lists/headings intact.
  let html = '';
  let paragraph = [];

  function flushParagraph(){
    if (!paragraph.length) return;
    const content = paragraph.join('<br>');
    html += `<p>${content}</p>`;
    paragraph = [];
  }

  for (const block of output) {
    if (!block) {
      flushParagraph();
    } else if (/^<(div|ul|h[3-5])/.test(block)) {
      flushParagraph();
      html += block;
    } else {
      paragraph.push(block);
    }
  }
  flushParagraph();

  return `<div class="ai-rich-text">${html}</div>`;
}
function addAIMessage(text,role,meta={}){const messages=document.getElementById('ai-messages');if(!messages)return;const bubble=document.createElement('div');bubble.className=`ai-message ${role}`;if(role==='assistant'){bubble.innerHTML=renderAIMarkdown(text);if(meta.provider){const provider=document.createElement('div');provider.className='ai-provider-badge';provider.innerHTML=`<span class="provider-dot"></span>${escapeAIHtml(meta.provider)}${meta.fallback?' · fallback':''}`;bubble.appendChild(provider);}}else if(role==='user')bubble.textContent=text;else bubble.innerHTML=`<div class="ai-error-content"><span>⚠️</span><span>${escapeAIHtml(text)}</span></div>`;messages.appendChild(bubble);if(meta.scroll!==false)messages.scrollTo({top:messages.scrollHeight,behavior:'smooth'});}
function handleAIKeydown(event){if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();askAITutor();}}
document.addEventListener('input',e=>{if(e.target.id==='ai-message'){const c=document.getElementById('ai-character-count');if(c)c.textContent=`${e.target.value.length} / 4000`;}});


// Initialize the AI Tutor Korean keyboard after the view is available.
function initAIKoreanKeyboardIfReady() {
  if (typeof setupAIKoreanKeyboard === 'function' && document.getElementById('ai-message')) {
    setupAIKoreanKeyboard();
  }
}
window.initAIKoreanKeyboardIfReady = initAIKoreanKeyboardIfReady;

// Attach browser-native Korean audio controls to newly rendered AI messages.
(() => {
  function attachKoreanAudioToMessages() {
    if (!window.createAIAudioControls || !window.extractKoreanForAudio) return;

    const candidates = document.querySelectorAll(
      '.ai-message.assistant:not([data-audio-ready]),' +
      '.assistant-message:not([data-audio-ready]),' +
      '.ai-chat-message.assistant:not([data-audio-ready])'
    );

    candidates.forEach(message => {
      const text = window.extractKoreanForAudio(message.innerText || '');
      if (!text) {
        message.dataset.audioReady = 'true';
        return;
      }

      const controls = window.createAIAudioControls(text);
      message.appendChild(controls);
      message.dataset.audioReady = 'true';
    });
  }

  const observer = new MutationObserver(attachKoreanAudioToMessages);
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(attachKoreanAudioToMessages, 500);
})();
