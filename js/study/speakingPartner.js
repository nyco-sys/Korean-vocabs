let speakingRecognition = null;
let speakingRecording = false;
let speakingTranscript = '';
let speakingFinalTranscript = '';
let speakingInterimTranscript = '';
let speakingShouldListen = false;
let speakingRestartTimer = null;
let speakingCorrectionMode = 'gentle';
let speakingMessages = [];
let speakingBusy = false;
let speakingSessionId = crypto?.randomUUID?.() || String(Date.now());

const speakingScenarioPrompts = {
  free: 'Have a natural beginner-friendly Korean conversation. Do not force a topic.',
  self_intro: 'Practice self-introduction: name, hometown, work/study, hobbies and daily life.',
  restaurant: 'Role-play ordering food at a Korean restaurant.',
  shopping: 'Role-play shopping in a Korean store.',
  workplace: 'Role-play a simple Korean workplace conversation.',
  directions: 'Role-play asking for and giving directions in Korea.',
  eps_workplace: 'Role-play a practical EPS-TOPIK workplace situation using clear, useful Korean.'
};

function speakingSetStatus(text, busy=false) {
  const el=document.getElementById('speaking-status');
  if(el) el.textContent=text;
  const dot=document.querySelector('.speaking-status-dot');
  if(dot) dot.style.background=busy?'#f59e0b':'#34d399';
}

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function setupSpeakingRecognition(){
  const Recognition=getSpeechRecognition();
  if(!Recognition) return null;
  const r=new Recognition();
  r.lang='ko-KR';
  r.interimResults=true;
  r.continuous=true;
  r.maxAlternatives=1;
  r.onstart=()=>{ speakingRecording=true; speakingSetStatus('Listening…',true); updateSpeakingMicUI(true); };
  r.onresult=(event)=>{
    let interim='';
    for(let i=event.resultIndex;i<event.results.length;i++){
      const text=event.results[i][0]?.transcript||'';
      if(event.results[i].isFinal) speakingFinalTranscript += text + ' ';
      else interim += text;
    }
    speakingInterimTranscript=interim;
    speakingTranscript=`${speakingFinalTranscript}${speakingInterimTranscript}`.trim();
    const box=document.getElementById('speaking-transcript');
    if(box) box.textContent=speakingTranscript||'Listening…';
    if(speakingFinalTranscript.trim()) document.getElementById('speaking-send-btn')?.removeAttribute('disabled');
  };
  r.onerror=(e)=>{
    if(e.error==='not-allowed'||e.error==='service-not-allowed'){
      speakingShouldListen=false; speakingRecording=false; updateSpeakingMicUI(false); speakingSetStatus('Microphone permission is blocked.'); return;
    }
    if(speakingShouldListen&&!speakingBusy) speakingSetStatus('Reconnecting microphone…',true);
    else { speakingRecording=false; updateSpeakingMicUI(false); speakingSetStatus('Speech recognition stopped.'); }
  };
  r.onend=()=>{
    speakingRecording=false;
    if(speakingShouldListen&&!speakingBusy){
      updateSpeakingMicUI(true); speakingSetStatus('Listening…',true);
      clearTimeout(speakingRestartTimer);
      speakingRestartTimer=setTimeout(()=>{
        if(!speakingShouldListen||speakingBusy) return;
        try{ r.start(); }catch(error){ if(error?.name!=='InvalidStateError') console.warn('Speech restart failed:',error); }
      },250);
      return;
    }
    updateSpeakingMicUI(false);
    if(speakingTranscript.trim()) document.getElementById('speaking-send-btn')?.removeAttribute('disabled');
    if(!speakingBusy) speakingSetStatus('Ready to talk');
  };
  return r;
}

function updateSpeakingMicUI(recording){
  const b=document.getElementById('speaking-mic-btn'); const icon=document.getElementById('speaking-mic-icon'); const label=document.getElementById('speaking-mic-label');
  if(!b) return;
  b.classList.toggle('recording',recording);
  if(icon) icon.textContent=recording?'⏹':'🎙️';
  if(label) label.textContent=recording?'Listening…':'Tap to speak';
}

function toggleSpeakingMic(){
  if(speakingBusy) return;
  if(!speakingRecognition) speakingRecognition=setupSpeakingRecognition();
  if(!speakingRecognition){ notify('Speech recognition is not supported in this browser. Try Chrome or Edge.','warning'); return; }
  if(speakingRecording||speakingShouldListen){
    speakingShouldListen=false; clearTimeout(speakingRestartTimer);
    try{ speakingRecognition.stop(); }catch(_){}
    speakingRecording=false; updateSpeakingMicUI(false);
    if(speakingTranscript.trim()) document.getElementById('speaking-send-btn')?.removeAttribute('disabled');
    speakingSetStatus('Ready to send');
    return;
  }
  speakingFinalTranscript=''; speakingInterimTranscript=''; speakingTranscript=''; speakingShouldListen=true;
  const box=document.getElementById('speaking-transcript'); if(box) box.textContent='Listening…';
  document.getElementById('speaking-send-btn')?.setAttribute('disabled','disabled');
  try{ speakingRecognition.start(); }catch(e){ if(e?.name!=='InvalidStateError'){ speakingShouldListen=false; console.warn('Speech recognition start failed:',e); } }
}

function setSpeakingCorrectionMode(mode,button){
  speakingCorrectionMode=mode;
  document.querySelectorAll('.speaking-mode').forEach(b=>b.classList.remove('active'));
  button?.classList.add('active');
}

function currentSpeakingScenario(){ return document.getElementById('speaking-scenario')?.value || 'free'; }

function resetSpeakingSession(){
  stopSpeakingAudio();
  if(speakingRecognition && speakingRecording) try{speakingRecognition.stop();}catch(_){}
  speakingShouldListen=false; clearTimeout(speakingRestartTimer); speakingMessages=[]; speakingBusy=false; speakingTranscript=''; speakingFinalTranscript=''; speakingInterimTranscript=''; speakingSessionId=crypto?.randomUUID?.()||String(Date.now());
  const chat=document.getElementById('speaking-chat');
  if(chat) chat.innerHTML='<div class="speaking-welcome"><div class="speaking-mini-avatar">👩🏻‍💼</div><div><strong>안녕하세요! 저는 민지예요. 👋</strong><p>Let\'s practice Korean together. Choose a topic, then press the microphone and speak.</p></div></div>';
  const correction=document.getElementById('speaking-correction'); if(correction) correction.hidden=true;
  const transcript=document.getElementById('speaking-transcript'); if(transcript) transcript.textContent='Press the microphone and start speaking.';
  document.getElementById('speaking-send-btn')?.setAttribute('disabled','disabled');
  speakingSetStatus('Ready to talk');
}

async function sendSpeakingMessage(){
  if(speakingBusy) return;
  const text=(speakingTranscript || document.getElementById('speaking-transcript')?.textContent || '').trim();
  if(!text || text==='Press the microphone and start speaking.' || text==='Listening…') return;
  speakingShouldListen=false; clearTimeout(speakingRestartTimer); if(speakingRecognition&&speakingRecording){try{speakingRecognition.stop();}catch(_){} } speakingRecording=false; updateSpeakingMicUI(false); stopSpeakingAudio(); speakingBusy=true; speakingSetStatus('Minji is thinking…',true);
  document.getElementById('speaking-send-btn')?.setAttribute('disabled','disabled');
  addSpeakingMessage('user',text);
  speakingTranscript=''; speakingFinalTranscript=''; speakingInterimTranscript='';
  const box=document.getElementById('speaking-transcript'); if(box) box.textContent='Press the microphone and start speaking.';
  const typing=addSpeakingTyping();
  try{
    const {data:{session}}=await supabaseClient.auth.getSession();
    if(!session) throw new Error('Please sign in first.');
    const response=await fetch(`${SUPABASE_URL}/functions/v1/ai-speaking-partner`,{
      method:'POST',
      headers:{Authorization:`Bearer ${session.access_token}`,apikey:SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({message:text,scenario:currentSpeakingScenario(),correction_mode:speakingCorrectionMode,history:speakingMessages.slice(-12),session_id:speakingSessionId})
    });
    const data=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data?.error || `Speaking Partner request failed (${response.status}).`);
    typing?.remove();
    const answer=data.response || data.answer || '죄송해요. 다시 말해 주세요.';
    addSpeakingMessage('assistant',answer,data.translation);
    if(data.correction?.has_correction){ showSpeakingCorrection(data.correction); }
    speakSpeakingKorean(answer);
    speakingMessages.push({role:'user',content:text}); speakingMessages.push({role:'assistant',content:answer});
  }catch(error){ typing?.remove(); addSpeakingMessage('error',error.message||'Speaking Partner request failed.'); }
  finally{ speakingBusy=false; speakingSetStatus('Ready to talk'); }
}

function addSpeakingMessage(role,text,translation=''){
  const chat=document.getElementById('speaking-chat'); if(!chat) return;
  const row=document.createElement('div'); row.className=`speaking-message ${role}`;
  const avatar=document.createElement('div'); avatar.className='speaking-message-avatar'; avatar.textContent=role==='assistant'?'👩🏻‍💼':role==='user'?'🧑🏻':'⚠️';
  const bubble=document.createElement('div'); bubble.className='speaking-bubble';
  const p=document.createElement('div'); p.className=role==='assistant'?'speaking-korean':''; p.textContent=text;
  bubble.appendChild(p);
  if(translation){ const t=document.createElement('div'); t.className='speaking-translation'; t.textContent=translation; bubble.appendChild(t); }
  if(role==='assistant'){
    const a=document.createElement('button'); a.className='speaking-audio-btn'; a.type='button'; a.textContent='🔊 Hear again'; a.onclick=()=>speakSpeakingKorean(text); bubble.appendChild(a);
  }
  row.append(avatar,bubble); chat.appendChild(row); chat.scrollTop=chat.scrollHeight; return row;
}

function addSpeakingTyping(){
  const chat=document.getElementById('speaking-chat'); if(!chat) return null;
  const row=document.createElement('div'); row.className='speaking-message assistant'; row.innerHTML='<div class="speaking-message-avatar">👩🏻‍💼</div><div class="speaking-bubble"><div class="speaking-typing"><span></span><span></span><span></span></div></div>'; chat.appendChild(row); chat.scrollTop=chat.scrollHeight; return row;
}

function showSpeakingCorrection(c){
  const panel=document.getElementById('speaking-correction'); if(!panel) return;
  panel.hidden=false;
  document.getElementById('speaking-correction-original').textContent=c.original||'';
  document.getElementById('speaking-correction-better').textContent=c.corrected||'';
  document.getElementById('speaking-correction-explanation').textContent=c.explanation||'';
}

function speakSpeakingKorean(text){
  if(!('speechSynthesis' in window)) return;
  stopSpeakingAudio();
  const u=new SpeechSynthesisUtterance(text); u.lang='ko-KR'; u.rate=.92; u.pitch=1; u.volume=1;
  const voice=window.speechSynthesis.getVoices().find(v=>/^ko(-|_)/i.test(v.lang)); if(voice) u.voice=voice;
  window.__speakingUtterance=u; window.speechSynthesis.speak(u);
}
function stopSpeakingAudio(){ if(window.speechSynthesis) window.speechSynthesis.cancel(); window.__speakingUtterance=null; }

window.toggleSpeakingMic=toggleSpeakingMic; window.sendSpeakingMessage=sendSpeakingMessage; window.setSpeakingCorrectionMode=setSpeakingCorrectionMode; window.resetSpeakingSession=resetSpeakingSession;
