/* Shared study settings, session tracking, and results. */
// The study session uses every vocabulary item returned for the selected
// category. There is no manual question-count limit.
function getStudyQuestionCount() {
  return Number.MAX_SAFE_INTEGER;
}

function getAvailableStudyQuestionCount(items) {
  return Array.isArray(items) ? items.length : 0;
}

function showStudyScreen(type, screen) {
  const prefix = type === 'image' ? '' : 'text-';
  const settings = document.getElementById(`${prefix}study-settings`);
  const quiz = document.getElementById(`${prefix}quiz-wrapper`);
  const result = document.getElementById(`${prefix}study-result`);
  const empty = document.getElementById(`${prefix}empty-notice`);
  if (settings) settings.style.display = screen === 'settings' ? 'block' : 'none';
  if (quiz) quiz.style.display = screen === 'quiz' ? 'flex' : 'none';
  if (result) result.style.display = screen === 'result' ? 'block' : 'none';
  if (empty && screen !== 'quiz') empty.style.display = 'none';
}

function updateStudyProgress(type) {
  const session = type === 'image' ? imageStudySession : textStudySession;
  const id = type === 'image' ? 'image-study-progress' : 'text-study-progress';
  const el = document.getElementById(id);
  if (!el || !session.active) return;
  el.textContent = `Question ${Math.min(session.completed + 1, session.total)} / ${session.total}`;
}

function finishStudy(type) {
  const session = type === 'image' ? imageStudySession : textStudySession;
  session.active = false;
  const resultPrefix = type === 'image' ? '' : 'text-';
  showStudyScreen(type, 'result');
  const correctEl = document.getElementById(`${resultPrefix}result-correct`);
  const skippedEl = document.getElementById(`${resultPrefix}result-skipped`);
  const scoreEl = document.getElementById(`${resultPrefix}result-score`);
  const totalEl = document.getElementById(`${resultPrefix}result-total`);
  const modeEl = document.getElementById(`${resultPrefix}result-mode`);
  const categoryEl = document.getElementById(`${resultPrefix}result-category`);
  const score = session.total ? Math.round((session.correct / session.total) * 100) : 0;
  if (correctEl) correctEl.textContent = session.correct;
  const correctCardEl = document.getElementById(`${resultPrefix}result-correct-card`);
  if (correctCardEl) correctCardEl.textContent = session.correct;
  if (skippedEl) skippedEl.textContent = session.skipped;
  if (scoreEl) scoreEl.textContent = `${score}%`;
  if (totalEl) totalEl.textContent = session.total;
  if (modeEl) modeEl.textContent = session.mode === 'multiple' ? 'Multiple Choice' : 'Typing';
  if (categoryEl) categoryEl.textContent = session.review ? 'Mistake Review' : (session.category === 'ALL' ? 'All Categories' : session.category);
}

function recordStudyAnswer(type, result, itemOverride = null) {
  const session = type === 'image' ? imageStudySession : textStudySession;
  if (!session.active) return false;

  const item = itemOverride || (
    type === 'image' ? filteredVocab[currentIndex] : filteredTextVocab[currentTextIndex]
  );

  if (result === 'correct') {
    session.correct += 1;
    if (session.review) {
      clearMistakeForCorrectAnswer(type, item);
    }
  }

  if (result === 'skipped') session.skipped += 1;

  // Store one final study outcome for the question/session.
  // Wrong attempts are recorded separately by recordVocabularyMistake().
  if (item && typeof recordStudyActivity === 'function') {
    recordStudyActivity(type, item, result, session.mode, session.review);
  }

  session.completed += 1;
  if (session.completed >= session.total) {
    finishStudy(type);
    return true;
  }

  updateStudyProgress(type);
  return false;
}

function resetStudySession(type, options) {
  const session = type === 'image' ? imageStudySession : textStudySession;
  session.active = true;
  session.total = options.total;
  session.completed = 0;
  session.correct = 0;
  session.skipped = 0;
  session.category = options.category;
  session.mode = options.mode;
  updateStudyProgress(type);
}

function openStudySettings(type) {
  const session = type === 'image' ? imageStudySession : textStudySession;
  session.active = false;
  session.review = false;
  showStudyScreen(type, 'settings');
}

function setStudyReviewMode(type, enabled) {
  const session = type === 'image' ? imageStudySession : textStudySession;
  session.review = !!enabled;
}
