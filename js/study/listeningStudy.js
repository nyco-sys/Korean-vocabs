let listeningQuestions = [];
let filteredListeningQuestions = [];
let listeningIndex = 0;
let listeningSelectedAnswer = null;
let listeningRate = 1;
let listeningCorrect = 0;
let listeningIncorrect = 0;
let listeningSessionTotal = 10;
let listeningSessionActive = false;

async function initListeningPage() {
  const categorySelect = document.getElementById('listening-category');
  if (!categorySelect || !supabaseClient) return;

  try {
    const { data, error } = await supabaseClient
      .from('listening_questions')
      .select('category')
      .order('category');

    if (error) throw error;

    const categories = [...new Set((data || []).map(row => row.category).filter(Boolean))];
    setCategoryOptions('listening-category', categories);
  } catch (error) {
    console.error('Could not load listening categories:', error);
  }
}

async function fetchListeningQuestions(category = 'ALL', difficulty = 'ALL') {
  if (!supabaseClient) throw new Error('Supabase client unavailable');

  let query = supabaseClient
    .from('listening_questions')
    .select('id,category,difficulty,question_text,audio_text,audio_url,choice_1,choice_2,choice_3,choice_4,correct_answer,translation,explanation')
    .eq('is_active', true);

  if (category !== 'ALL') query = query.eq('category', category);
  if (difficulty !== 'ALL') query = query.eq('difficulty', difficulty);

  const { data, error } = await query;
  if (error) throw error;

  return shuffleListening(data || []);
}

function shuffleListening(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function startListeningPractice() {
  stopKoreanAudioIfAvailable();

  const category = document.getElementById('listening-category')?.value || 'ALL';
  const difficulty = document.getElementById('listening-difficulty')?.value || 'ALL';
  const count = Number(document.getElementById('listening-count')?.value || 10);

  listeningSessionTotal = count;
  listeningCorrect = 0;
  listeningIncorrect = 0;
  listeningIndex = 0;
  listeningSelectedAnswer = null;
  listeningSessionActive = true;

  const settings = document.getElementById('listening-settings');
  const quiz = document.getElementById('listening-quiz-wrapper');
  const result = document.getElementById('listening-result');
  const empty = document.getElementById('listening-empty-notice');

  if (settings) settings.style.display = 'none';
  if (result) result.style.display = 'none';
  if (empty) empty.style.display = 'none';
  if (quiz) quiz.style.display = 'flex';

  try {
    const all = await fetchListeningQuestions(category, difficulty);
    filteredListeningQuestions = all.slice(0, Math.min(count, all.length));

    if (!filteredListeningQuestions.length) {
      listeningSessionActive = false;
      if (quiz) quiz.style.display = 'none';
      if (empty) empty.style.display = 'block';
      return;
    }

    listeningSessionTotal = filteredListeningQuestions.length;
    renderListeningQuestion();
  } catch (error) {
    console.error('Listening questions failed:', error);
    listeningSessionActive = false;
    if (quiz) quiz.style.display = 'none';
    if (empty) {
      empty.style.display = 'block';
      empty.innerHTML = '<h3>Could not load listening questions.</h3><p style="color:var(--text-muted);margin-top:8px;">Please check your Supabase listening setup.</p>';
    }
  }
}

function renderListeningQuestion() {
  stopKoreanAudioIfAvailable();

  const q = filteredListeningQuestions[listeningIndex];
  if (!q) return;

  listeningSelectedAnswer = null;

  document.getElementById('listening-progress').textContent =
    `Question ${listeningIndex + 1} of ${listeningSessionTotal}`;

  document.getElementById('listening-card-category').textContent = q.category || 'Listening';
  document.getElementById('listening-card-difficulty').textContent = q.difficulty || 'Beginner';
  document.getElementById('listening-question-text').textContent = q.question_text || '';
  document.getElementById('listening-feedback').textContent = '';
  document.getElementById('listening-feedback').className = 'listening-feedback';

  const playButton = document.getElementById('listening-play-btn');
  playButton.disabled = false;
  playButton.classList.remove('playing');
  document.getElementById('listening-play-icon').textContent = '▶';
  document.getElementById('listening-player-status').textContent =
    q.audio_url ? 'Press play to hear the audio.' : 'Browser Korean voice • Press play to listen.';

  const choices = document.getElementById('listening-choices');
  choices.innerHTML = '';

  [
    ['1', q.choice_1],
    ['2', q.choice_2],
    ['3', q.choice_3],
    ['4', q.choice_4]
  ].forEach(([number, text]) => {
    if (!text) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'listening-choice';
    button.dataset.answer = number;
    button.innerHTML = `<span class="choice-number">${number}</span><span class="choice-text"></span>`;
    button.querySelector('.choice-text').textContent = text;
    button.addEventListener('click', () => selectListeningAnswer(number, button));
    choices.appendChild(button);
  });

  document.getElementById('listening-check-btn').disabled = true;
}

function selectListeningAnswer(answer, button) {
  if (!listeningSessionActive) return;
  listeningSelectedAnswer = answer;

  document.querySelectorAll('.listening-choice').forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');
  document.getElementById('listening-check-btn').disabled = false;
}

function checkListeningAnswer() {
  const q = filteredListeningQuestions[listeningIndex];
  if (!q || !listeningSelectedAnswer) return;

  const buttons = document.querySelectorAll('.listening-choice');
  buttons.forEach(btn => btn.disabled = true);

  const correct = String(q.correct_answer) === String(listeningSelectedAnswer);
  const feedback = document.getElementById('listening-feedback');

  if (correct) {
    listeningCorrect++;
    feedback.className = 'listening-feedback correct';
    feedback.innerHTML = `<strong>Correct! 정답입니다! 🎉</strong><span>${escapeListeningText(q.translation || '')}</span>`;
  } else {
    listeningIncorrect++;
    feedback.className = 'listening-feedback incorrect';
    feedback.innerHTML =
      `<strong>Incorrect. ❌</strong><span>Correct answer: ${escapeListeningText(q.correct_answer)} — ${escapeListeningText(getChoiceText(q, q.correct_answer))}</span>` +
      (q.explanation ? `<small>${escapeListeningText(q.explanation)}</small>` : '');
  }

  document.getElementById('listening-check-btn').disabled = true;

  setTimeout(() => {
    listeningIndex++;
    if (listeningIndex >= filteredListeningQuestions.length) {
      finishListeningPractice();
    } else {
      renderListeningQuestion();
    }
  }, correct ? 1100 : 1700);
}

function getChoiceText(q, answer) {
  return q[`choice_${answer}`] || '';
}

function finishListeningPractice() {
  stopKoreanAudioIfAvailable();
  listeningSessionActive = false;

  const total = listeningCorrect + listeningIncorrect;
  const accuracy = total ? Math.round((listeningCorrect / total) * 100) : 0;

  document.getElementById('listening-quiz-wrapper').style.display = 'none';
  document.getElementById('listening-result').style.display = 'block';
  document.getElementById('listening-result-score').textContent = `${accuracy}%`;
  document.getElementById('listening-result-correct').textContent = listeningCorrect;
  document.getElementById('listening-result-total').textContent = total;
  document.getElementById('listening-result-correct-card').textContent = listeningCorrect;
  document.getElementById('listening-result-incorrect').textContent = listeningIncorrect;
  document.getElementById('listening-result-accuracy').textContent = `${accuracy}%`;
}

function exitListeningPractice() {
  stopKoreanAudioIfAvailable();
  listeningSessionActive = false;

  document.getElementById('listening-quiz-wrapper').style.display = 'none';
  document.getElementById('listening-result').style.display = 'none';
  document.getElementById('listening-empty-notice').style.display = 'none';
  document.getElementById('listening-settings').style.display = 'block';
}

function restartListeningPractice() {
  startListeningPractice();
}

function setListeningRate(rate, button) {
  listeningRate = Number(rate) || 1;
  document.querySelectorAll('.listening-speed-btn').forEach(btn => btn.classList.remove('active'));
  button?.classList.add('active');

  if (listeningSessionActive) playCurrentListeningAudio();
}

function playCurrentListeningAudio() {
  const q = filteredListeningQuestions[listeningIndex];
  if (!q) return;

  const isPlaying = document.getElementById('listening-play-btn')?.classList.contains('playing');
  if (isPlaying) {
    stopKoreanAudioIfAvailable();
    return;
  }

  if (q.audio_url) {
    stopKoreanAudioIfAvailable();
    const audio = new Audio(q.audio_url);
    audio.play().catch(error => {
      console.error('Listening audio playback failed:', error);
      speakListeningText(q.audio_text || '');
    });
    window.__currentListeningAudio = audio;
    audio.playbackRate = listeningRate;
    audio.onended = resetListeningPlayButton;
    setListeningPlaying(true);
  } else {
    speakListeningText(q.audio_text || '');
  }
}

function speakListeningText(text) {
  if (!('speechSynthesis' in window)) {
    notify('Korean audio is not supported by this browser.', 'warning');
    return;
  }

  stopKoreanAudioIfAvailable();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = listeningRate;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  const koreanVoice = voices.find(v => /^ko(-|_)/i.test(v.lang));
  if (koreanVoice) utterance.voice = koreanVoice;

  utterance.onend = resetListeningPlayButton;
  utterance.onerror = resetListeningPlayButton;

  window.__currentListeningUtterance = utterance;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  setListeningPlaying(true);
}

function resetListeningPlayButton() {
  const button = document.getElementById('listening-play-btn');
  if (!button) return;
  button.classList.remove('playing');
  document.getElementById('listening-play-icon').textContent = '▶';
  document.getElementById('listening-player-status').textContent = 'Press play to hear the Korean audio.';
}

function setListeningPlaying(playing) {
  const button = document.getElementById('listening-play-btn');
  if (!button) return;
  button.classList.toggle('playing', playing);
  document.getElementById('listening-play-icon').textContent = playing ? '■' : '▶';
  document.getElementById('listening-player-status').textContent =
    playing ? 'Playing Korean audio… Click again to stop.' : 'Press play to hear the Korean audio.';
}

function stopKoreanAudioIfAvailable() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  if (window.__currentListeningAudio) {
    window.__currentListeningAudio.pause();
    window.__currentListeningAudio.currentTime = 0;
    window.__currentListeningAudio = null;
  }
  window.__currentListeningUtterance = null;
  resetListeningPlayButton();
}

function escapeListeningText(text) {
  return String(text || '').replace(/[&<>"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
}

window.initListeningPage = initListeningPage;
window.startListeningPractice = startListeningPractice;
window.exitListeningPractice = exitListeningPractice;
window.restartListeningPractice = restartListeningPractice;
window.playCurrentListeningAudio = playCurrentListeningAudio;
window.setListeningRate = setListeningRate;
window.checkListeningAnswer = checkListeningAnswer;
