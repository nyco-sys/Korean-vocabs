/* AI TUTOR KOREAN KEYBOARD - same composition behavior as Add Vocabulary */
let aiInputJamoSequence = [];
let isAIShiftActive = false;

function aiKeyboardTarget() {
  return document.getElementById('ai-message');
}

function showAIKoreanKeyboard() {
  const keyboard = document.getElementById('ai-korean-keyboard');
  if (keyboard) keyboard.classList.add('is-open');
}

function toggleAIShift() {
  isAIShiftActive = !isAIShiftActive;
  const shiftBtn = document.getElementById('ai-shift-btn');
  if (shiftBtn) shiftBtn.classList.toggle('active-shift', isAIShiftActive);

  document.querySelectorAll('#ai-korean-keyboard .kb-key[data-shift]').forEach(btn => {
    const mainChar = btn.querySelector('.main-char');
    if (mainChar) mainChar.textContent = isAIShiftActive ? btn.dataset.shift : btn.dataset.normal;
  });
}

function pressAIKeyFromBtn(btn) {
  const char = isAIShiftActive ? btn.dataset.shift : btn.dataset.normal;
  pressAIKey(char);
  if (isAIShiftActive) toggleAIShift();
}

function pressAIKey(char) {
  aiInputJamoSequence.push(char);
  renderAIKoreanInput();
  aiKeyboardTarget()?.focus();
}

function pressAIBackspace() {
  aiInputJamoSequence.pop();
  renderAIKoreanInput();
  aiKeyboardTarget()?.focus();
}

function clearAIKoreanInput() {
  aiInputJamoSequence = [];
  renderAIKoreanInput();
  aiKeyboardTarget()?.focus();
}

function renderAIKoreanInput() {
  const input = aiKeyboardTarget();
  if (!input || typeof Hangul === 'undefined') return;
  input.value = Hangul.assemble(aiInputJamoSequence);
  const length = input.value.length;
  input.setSelectionRange(length, length);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function setupAIKoreanKeyboard() {
  const inputEl = aiKeyboardTarget();
  if (!inputEl) return;

  inputEl.addEventListener('focus', showAIKoreanKeyboard);

  inputEl.addEventListener('input', () => {
    const value = inputEl.value;
    if (typeof Hangul === 'undefined') return;
    const assembled = Hangul.assemble(aiInputJamoSequence);
    if (value !== assembled) {
      aiInputJamoSequence = Hangul.disassemble(value);
    }
  });
}

function toggleAIKoreanKeyboard() {
  const keyboard = document.getElementById('ai-korean-keyboard');
  const button = document.getElementById('ai-korean-keyboard-toggle');
  if (!keyboard) return;
  const open = keyboard.classList.toggle('is-open');
  if (button) {
    button.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open));
  }
  if (open) {
    const input = aiKeyboardTarget();
    if (input && typeof Hangul !== 'undefined') aiInputJamoSequence = Hangul.disassemble(input.value);
    input?.focus();
  }
}

window.pressAIKeyFromBtn = pressAIKeyFromBtn;
window.pressAIKey = pressAIKey;
window.pressAIBackspace = pressAIBackspace;
window.clearAIKoreanInput = clearAIKoreanInput;
window.toggleAIShift = toggleAIShift;
window.toggleAIKoreanKeyboard = toggleAIKoreanKeyboard;

// Initialize after the AI view has been injected.
window.setupAIKoreanKeyboard = setupAIKoreanKeyboard;
