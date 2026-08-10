/* SUPABASE CONFIGURATION */
const SUPABASE_URL = "https://nylbmogscfyxcgdbknds.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iuBDHcXh4_s01Ba_ujDf3Q_PufyUFUS";
let supabaseClient = null;

function initializeSupabase() {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );
    return true;
  }
  console.error('Supabase library was not loaded.');
  return false;
}

let vocabularies = [];
    let filteredVocab = [];
    let currentIndex = 0;
    let inputJamoSequence = [];
    let isShiftActive = false;
    let textVocabularies = [];
    let filteredTextVocab = [];
    let currentTextIndex = 0;
    let textInputJamoSequence = [];
    let isTextShiftActive = false;
    let addTextInputJamoSequence = [];
    let isAddTextShiftActive = false;
    let imageQuizMode = 'typing';
    let textQuizMode = 'typing';
    let audioContext = null;

    // Physical QWERTY to Hangul mapping
    const qwertyMap = {
      'q':'ㅂ', 'Q':'ㅃ', 'w':'ㅈ', 'W':'ㅉ', 'e':'ㄷ', 'E':'ㄸ', 'r':'ㄱ', 'R':'ㄲ', 't':'ㅅ', 'T':'ㅆ',
      'y':'ㅛ', 'u':'ㅕ', 'i':'ㅑ', 'o':'ㅐ', 'O':'ㅒ', 'p':'ㅔ', 'P':'ㅖ',
      'a':'ㅁ', 's':'ㄴ', 'd':'ㅇ', 'f':'ㄹ', 'g':'ㅎ', 'h':'ㅗ', 'j':'ㅓ', 'k':'ㅏ', 'l':'ㅣ',
      'z':'ㅋ', 'x':'ㅌ', 'c':'ㅍ', 'v':'ㅊ', 'b':'ㅠ', 'n':'ㅜ', 'm':'ㅡ'
    };

    document.addEventListener('DOMContentLoaded', async () => {
      initializeSupabase();
      await loadInitialData();
      populateCategories();
      filterVocab();
      setupPhysicalKeyboardListener();
      setupAddKoreanKeyboard();
      setupTextKoreanKeyboards();
      await loadTextVocabularies();
      populateTextCategories();
      filterTextVocab();
    });

    async function loadInitialData() {
      try {
        if (!supabaseClient) throw new Error('Supabase client unavailable');
        const { data, error } = await supabaseClient
          .from('vocabularies')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) throw error;

        vocabularies = (data || []).map(item => ({
          id: item.id,
          korean: item.korean,
          english: item.english || '',
          category: item.category,
          image: item.image
        }));

        saveToLocalStorage();
        console.log('Loaded vocabularies from Supabase:', vocabularies.length);
      } catch (error) {
        console.error('Supabase load failed:', error);
        const stored = localStorage.getItem('korean_vocab_quiz');
        if (stored) {
          vocabularies = JSON.parse(stored);
        } else {
          try {
            const res = await fetch('data/vocabularies.json');
            vocabularies = await res.json();
            saveToLocalStorage();
          } catch (e) {
            vocabularies = [
              { id: "1", korean: "사과", english: "Apple", category: "Food", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600" },
              { id: "2", korean: "물", english: "Water", category: "Food", image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600" },
              { id: "3", korean: "학교", english: "School", category: "Places", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600" }
            ];
            saveToLocalStorage();
          }
        }
        alert('Could not connect to the online vocabulary database. Using local data for now.');
      }
    }

    function saveToLocalStorage() {
      localStorage.setItem('korean_vocab_quiz', JSON.stringify(vocabularies));
    }

    function populateCategories() {
      const select = document.getElementById('category-filter');
      const categories = [...new Set(vocabularies.map(item => item.category))];
      select.innerHTML = '<option value="ALL">All Categories</option>';
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
      });
    }

    function filterVocab() {
      const selectedCat = document.getElementById('category-filter').value;
      if (selectedCat === 'ALL') {
        filteredVocab = [...vocabularies];
      } else {
        filteredVocab = vocabularies.filter(v => v.category === selectedCat);
      }
      currentIndex = 0;
      updateQuizUI();
    }

    function triggerRandomMode() {
      document.getElementById('category-filter').value = 'ALL';
      filteredVocab = [...vocabularies].sort(() => Math.random() - 0.5);
      currentIndex = 0;
      updateQuizUI();
    }

    function updateQuizUI() {
      clearInput();
      resetFeedback();

      const wrapper = document.getElementById('quiz-wrapper');
      const emptyNotice = document.getElementById('empty-notice');

      if (filteredVocab.length === 0) {
        wrapper.style.display = 'none';
        emptyNotice.style.display = 'block';
        return;
      }

      wrapper.style.display = 'flex';
      emptyNotice.style.display = 'none';

      const current = filteredVocab[currentIndex];
      document.getElementById('card-cat').textContent = current.category;
      document.getElementById('card-img').src = current.image;
      updateImageQuizModeUI();
    }

    function setImageQuizMode(mode) {
      imageQuizMode = mode;
      updateImageQuizModeUI();
    }

    function updateImageQuizModeUI() {
      const typing = document.getElementById('typing-answer-area');
      const keyboard = document.getElementById('korean-keyboard');
      const actions = document.getElementById('image-typing-actions');
      const choices = document.getElementById('image-multiple-choice');
      if (!typing || !choices) return;

      const multiple = imageQuizMode === 'multiple';
      typing.style.display = multiple ? 'none' : 'block';
      if (keyboard) keyboard.style.display = multiple ? 'none' : '';
      if (actions) actions.style.display = multiple ? 'none' : 'flex';
      choices.style.display = multiple ? 'grid' : 'none';
      if (multiple) renderImageMultipleChoice();
    }

    function getRandomChoices(allItems, correctItem, answerKey) {
      const correct = correctItem[answerKey];
      const pool = allItems.filter(item => item !== correctItem && item[answerKey] && item[answerKey].trim() !== correct.trim());
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const unique = [];
      const seen = new Set([correct.trim()]);
      for (const item of shuffled) {
        const answer = item[answerKey].trim();
        if (!seen.has(answer)) {
          seen.add(answer);
          unique.push(answer);
        }
        if (unique.length >= 3) break;
      }
      return [correct.trim(), ...unique].sort(() => Math.random() - 0.5);
    }

    function renderImageMultipleChoice() {
      const container = document.getElementById('image-multiple-choice');
      const current = filteredVocab[currentIndex];
      if (!container || !current) return;
      const choices = getRandomChoices(vocabularies, current, 'korean');
      container.innerHTML = '';
      choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'multiple-choice-btn';
        btn.textContent = choice;
        btn.onclick = () => checkImageMultipleChoice(choice, btn);
        container.appendChild(btn);
      });
    }

    function checkImageMultipleChoice(choice, clickedButton) {
      const current = filteredVocab[currentIndex];
      if (!current) return;
      const buttons = document.querySelectorAll('#image-multiple-choice .multiple-choice-btn');
      buttons.forEach(btn => btn.disabled = true);
      if (choice.trim() === current.korean.trim()) {
        clickedButton.classList.add('correct');
        setFeedback('feedback', 'Correct! 정답입니다! 🎉', true);
        playCorrectSound();
        setTimeout(nextQuestion, 1000);
      } else {
        clickedButton.classList.add('incorrect');
        buttons.forEach(btn => {
          if (btn.textContent.trim() === current.korean.trim()) btn.classList.add('correct');
        });
        setFeedback('feedback', `Incorrect! Correct answer: ${current.korean} ❌`, false);
        playWrongSound();
        setTimeout(() => {
          buttons.forEach(btn => btn.disabled = false);
        }, 900);
      }
    }

    function setFeedback(id, text, correct) {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.color = correct ? 'var(--success)' : 'var(--danger)';
      el.textContent = text;
    }

    function getAudioContext() {
      if (!audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        audioContext = new AudioCtx();
      }
      if (audioContext.state === 'suspended') audioContext.resume();
      return audioContext;
    }

    function playTone(frequency, startTime, duration, type = 'sine', volume = 0.06) {
      const ctx = getAudioContext();
      if (!ctx) return;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration + 0.02);
    }

    function playCorrectSound() {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      playTone(523.25, now, 0.14, 'sine', 0.055);
      playTone(659.25, now + 0.10, 0.18, 'sine', 0.055);
      playTone(783.99, now + 0.20, 0.24, 'sine', 0.06);
    }

    function playWrongSound() {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      playTone(220, now, 0.18, 'sawtooth', 0.045);
      playTone(165, now + 0.14, 0.25, 'sawtooth', 0.04);
    }

    /* KEYBOARD LOGIC */
    function toggleShift() {
      isShiftActive = !isShiftActive;
      const shiftBtn = document.getElementById('shift-btn');
      if (isShiftActive) {
        shiftBtn.classList.add('active-shift');
      } else {
        shiftBtn.classList.remove('active-shift');
      }

      // Update visible layout labels
      document.querySelectorAll('.kb-key[data-shift]').forEach(btn => {
        const mainChar = btn.querySelector('.main-char');
        if (mainChar) {
          mainChar.textContent = isShiftActive ? btn.dataset.shift : btn.dataset.normal;
        }
      });
    }

    function pressKeyFromBtn(btn) {
      const char = isShiftActive ? btn.dataset.shift : btn.dataset.normal;
      pressKey(char);
      if (isShiftActive) toggleShift(); // Reset shift after 1 keypress
    }

    function pressKey(char) {
      inputJamoSequence.push(char);
      renderInput();
    }

    function pressBackspace() {
      inputJamoSequence.pop();
      renderInput();
    }

    function clearInput() {
      inputJamoSequence = [];
      renderInput();
    }

    function renderInput() {
      const assembledText = Hangul.assemble(inputJamoSequence);
      document.getElementById('user-input').value = assembledText;
    }

    /* PHYSICAL KEYBOARD LISTENER */
    function setupPhysicalKeyboardListener() {
      const inputEl = document.getElementById('user-input');
      
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          e.preventDefault();
          pressBackspace();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          checkAnswer();
        } else if (e.key === ' ') {
          e.preventDefault();
          pressKey(' ');
        } else if (qwertyMap[e.key]) {
          e.preventDefault();
          pressKey(qwertyMap[e.key]);
        }
      });
    }

    /* GAME RULES */
    function checkAnswer() {
      const userInput = document.getElementById('user-input').value.trim();
      const current = filteredVocab[currentIndex];
      const inputEl = document.getElementById('user-input');
      const feedback = document.getElementById('feedback');

      if (!userInput) return;

      if (userInput === current.korean.trim()) {
        inputEl.className = "answer-input correct";
        feedback.style.color = "var(--success)";
        feedback.textContent = "Correct! 정답입니다! 🎉";
        playCorrectSound();
        
        setTimeout(() => {
          nextQuestion();
        }, 1200);
      } else {
        inputEl.className = "answer-input incorrect";
        feedback.style.color = "var(--danger)";
        feedback.textContent = "Incorrect! Try again. ❌";
        playWrongSound();
        
        setTimeout(() => {
          inputEl.className = "answer-input";
        }, 600);
      }
    }

    function showAnswer() {
      const current = filteredVocab[currentIndex];
      const feedback = document.getElementById('feedback');
      document.getElementById('user-input').value = current.korean;
      feedback.style.color = "#c4b5fd";
      feedback.textContent = `Answer: ${current.korean} (${current.english || ''})`;
    }

    function skipQuestion() {
      nextQuestion();
    }

    function nextQuestion() {
      if (filteredVocab.length === 0) return;
      currentIndex = (currentIndex + 1) % filteredVocab.length;
      updateQuizUI();
    }

    function resetFeedback() {
      const inputEl = document.getElementById('user-input');
      const feedback = document.getElementById('feedback');
      inputEl.className = "answer-input";
      feedback.textContent = "";
    }


    /* ADD VOCABULARY KOREAN KEYBOARD */
    let addInputJamoSequence = [];
    let isAddShiftActive = false;

    function showAddKoreanKeyboard() {
      document.getElementById('add-korean-keyboard').classList.add('visible');
    }

    function toggleAddShift() {
      isAddShiftActive = !isAddShiftActive;

      const shiftBtn = document.getElementById('add-shift-btn');

      if (isAddShiftActive) {
        shiftBtn.classList.add('active-shift');
      } else {
        shiftBtn.classList.remove('active-shift');
      }

      document.querySelectorAll('#add-korean-keyboard .kb-key[data-shift]').forEach(btn => {
        const mainChar = btn.querySelector('.main-char');

        if (mainChar) {
          mainChar.textContent = isAddShiftActive
            ? btn.dataset.shift
            : btn.dataset.normal;
        }
      });
    }

    function pressAddKeyFromBtn(btn) {
      const char = isAddShiftActive
        ? btn.dataset.shift
        : btn.dataset.normal;

      pressAddKey(char);

      if (isAddShiftActive) {
        toggleAddShift();
      }
    }

    function pressAddKey(char) {
      addInputJamoSequence.push(char);
      renderAddKoreanInput();
      document.getElementById('input-korean').focus();
    }

    function pressAddBackspace() {
      addInputJamoSequence.pop();
      renderAddKoreanInput();
      document.getElementById('input-korean').focus();
    }

    function clearAddKoreanInput() {
      addInputJamoSequence = [];
      renderAddKoreanInput();
      document.getElementById('input-korean').focus();
    }

    function renderAddKoreanInput() {
      const assembledText = Hangul.assemble(addInputJamoSequence);
      document.getElementById('input-korean').value = assembledText;
    }

    function setupAddKoreanKeyboard() {
      const inputEl = document.getElementById('input-korean');

      inputEl.addEventListener('focus', showAddKoreanKeyboard);

      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          e.preventDefault();
          pressAddBackspace();
        } else if (e.key === ' ') {
          e.preventDefault();
          pressAddKey(' ');
        } else if (qwertyMap[e.key]) {
          e.preventDefault();
          pressAddKey(qwertyMap[e.key]);
        }
      });

      inputEl.addEventListener('input', () => {
        const value = inputEl.value;

        // Keep the virtual keyboard state synchronized if the user
        // pastes or manually types Korean text.
        if (value !== Hangul.assemble(addInputJamoSequence)) {
          addInputJamoSequence = Hangul.disassemble(value);
        }
      });
    }

    /* TEXT VOCABULARY */
    async function loadTextVocabularies() {
      try {
        if (!supabaseClient) throw new Error('Supabase client unavailable');
        const { data, error } = await supabaseClient
          .from('text_vocabs')
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        textVocabularies = data || [];
        localStorage.setItem('korean_text_vocab_quiz', JSON.stringify(textVocabularies));
      } catch (error) {
        console.error('Text vocabulary load failed:', error);
        try {
          textVocabularies = JSON.parse(localStorage.getItem('korean_text_vocab_quiz') || '[]');
        } catch (e) {
          textVocabularies = [];
        }
      }
    }

    function populateTextCategories() {
      const select = document.getElementById('text-category-filter');
      const categories = [...new Set(textVocabularies.map(item => item.category).filter(Boolean))];
      select.innerHTML = '<option value="ALL">All Categories</option>';
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
      });
    }

    function filterTextVocab() {
      const selectedCat = document.getElementById('text-category-filter').value;
      filteredTextVocab = selectedCat === 'ALL'
        ? [...textVocabularies]
        : textVocabularies.filter(v => v.category === selectedCat);
      currentTextIndex = 0;
      updateTextQuizUI();
    }

    function triggerRandomTextMode() {
      document.getElementById('text-category-filter').value = 'ALL';
      filteredTextVocab = [...textVocabularies].sort(() => Math.random() - 0.5);
      currentTextIndex = 0;
      updateTextQuizUI();
    }

    function updateTextQuizUI() {
      clearTextInput();
      resetTextFeedback();
      const wrapper = document.getElementById('text-quiz-wrapper');
      const empty = document.getElementById('text-empty-notice');
      if (!filteredTextVocab.length) {
        wrapper.style.display = 'none';
        empty.style.display = 'block';
        return;
      }
      wrapper.style.display = 'flex';
      empty.style.display = 'none';
      const current = filteredTextVocab[currentTextIndex];
      document.getElementById('text-card-cat').textContent = current.category;
      document.getElementById('text-card-prompt').textContent = current.english;
      updateTextQuizModeUI();
    }

    function setTextQuizMode(mode) {
      textQuizMode = mode;
      updateTextQuizModeUI();
    }

    function updateTextQuizModeUI() {
      const typing = document.getElementById('text-typing-answer-area');
      const keyboard = document.getElementById('text-study-keyboard');
      const actions = document.getElementById('text-typing-actions');
      const choices = document.getElementById('text-multiple-choice');
      if (!typing || !choices) return;
      const multiple = textQuizMode === 'multiple';
      typing.style.display = multiple ? 'none' : 'block';
      if (keyboard) keyboard.style.display = multiple ? 'none' : '';
      if (actions) actions.style.display = multiple ? 'none' : 'flex';
      choices.style.display = multiple ? 'grid' : 'none';
      if (multiple) renderTextMultipleChoice();
    }

    function renderTextMultipleChoice() {
      const container = document.getElementById('text-multiple-choice');
      const current = filteredTextVocab[currentTextIndex];
      if (!container || !current) return;
      const choices = getRandomChoices(textVocabularies, current, 'korean');
      container.innerHTML = '';
      choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'multiple-choice-btn';
        btn.textContent = choice;
        btn.onclick = () => checkTextMultipleChoice(choice, btn);
        container.appendChild(btn);
      });
    }

    function checkTextMultipleChoice(choice, clickedButton) {
      const current = filteredTextVocab[currentTextIndex];
      if (!current) return;
      const buttons = document.querySelectorAll('#text-multiple-choice .multiple-choice-btn');
      buttons.forEach(btn => btn.disabled = true);
      if (choice.trim() === current.korean.trim()) {
        clickedButton.classList.add('correct');
        setFeedback('text-feedback', 'Correct! 정답입니다! 🎉', true);
        playCorrectSound();
        setTimeout(nextTextQuestion, 1000);
      } else {
        clickedButton.classList.add('incorrect');
        buttons.forEach(btn => {
          if (btn.textContent.trim() === current.korean.trim()) btn.classList.add('correct');
        });
        setFeedback('text-feedback', `Incorrect! Correct answer: ${current.korean} ❌`, false);
        playWrongSound();
        setTimeout(() => {
          buttons.forEach(btn => btn.disabled = false);
        }, 900);
      }
    }

    function checkTextAnswer() {
      const userInput = document.getElementById('text-user-input').value.trim();
      const current = filteredTextVocab[currentTextIndex];
      if (!userInput || !current) return;
      const inputEl = document.getElementById('text-user-input');
      const feedback = document.getElementById('text-feedback');
      if (userInput === current.korean.trim()) {
        inputEl.className = 'answer-input correct';
        feedback.style.color = 'var(--success)';
        feedback.textContent = 'Correct! 정답입니다! 🎉';
        playCorrectSound();
        setTimeout(nextTextQuestion, 1200);
      } else {
        inputEl.className = 'answer-input incorrect';
        feedback.style.color = 'var(--danger)';
        feedback.textContent = 'Incorrect! Try again. ❌';
        playWrongSound();
        setTimeout(() => inputEl.className = 'answer-input', 600);
      }
    }

    function showTextAnswer() {
      const current = filteredTextVocab[currentTextIndex];
      if (!current) return;
      const input = document.getElementById('text-user-input');
      input.value = current.korean;
      textInputJamoSequence = Hangul.disassemble(current.korean);
      document.getElementById('text-feedback').textContent = `Answer: ${current.korean}`;
    }

    function skipTextQuestion() { nextTextQuestion(); }

    function nextTextQuestion() {
      if (!filteredTextVocab.length) return;
      currentTextIndex = (currentTextIndex + 1) % filteredTextVocab.length;
      updateTextQuizUI();
    }

    function resetTextFeedback() {
      const input = document.getElementById('text-user-input');
      document.getElementById('text-feedback').textContent = '';
      input.className = 'answer-input';
    }

    function clearTextInput() {
      textInputJamoSequence = [];
      document.getElementById('text-user-input').value = '';
    }

    function clearAddTextKoreanInput() {
      addTextInputJamoSequence = [];
      renderAddTextKoreanInput();
      document.getElementById('text-input-korean').focus();
    }

    function renderTextKoreanInput() {
      document.getElementById('text-user-input').value = Hangul.assemble(textInputJamoSequence);
    }

    function renderAddTextKoreanInput() {
      document.getElementById('text-input-korean').value = Hangul.assemble(addTextInputJamoSequence);
    }

    function handleGenericKey(mode, char) {
      if (mode === 'text-study') {
        textInputJamoSequence.push(char);
        renderTextKoreanInput();
      } else {
        addTextInputJamoSequence.push(char);
        renderAddTextKoreanInput();
      }
    }

    function handleGenericBackspace(mode) {
      if (mode === 'text-study') {
        textInputJamoSequence.pop();
        renderTextKoreanInput();
      } else {
        addTextInputJamoSequence.pop();
        renderAddTextKoreanInput();
      }
    }

    function buildKoreanKeyboard(containerId, mode) {
      const container = document.getElementById(containerId);
      if (!container) return;
      const rows = [
        [['ㅂ','ㅃ'],['ㅈ','ㅉ'],['ㄷ','ㄸ'],['ㄱ','ㄲ'],['ㅅ','ㅆ'],['ㅛ','ㅛ'],['ㅕ','ㅕ'],['ㅑ','ㅑ'],['ㅐ','ㅒ'],['ㅔ','ㅖ']],
        [['ㅁ','ㅁ'],['ㄴ','ㄴ'],['ㅇ','ㅇ'],['ㄹ','ㄹ'],['ㅎ','ㅎ'],['ㅗ','ㅗ'],['ㅓ','ㅓ'],['ㅏ','ㅏ'],['ㅣ','ㅣ']],
        [['ㅋ','ㅋ'],['ㅌ','ㅌ'],['ㅍ','ㅍ'],['ㅊ','ㅊ'],['ㅠ','ㅠ'],['ㅜ','ㅜ'],['ㅡ','ㅡ']]
      ];
      container.innerHTML = '';
      let shift = false;
      rows.forEach((row, ri) => {
        const rowEl = document.createElement('div'); rowEl.className = 'kb-row';
        if (ri === 2) {
          const shiftBtn = document.createElement('button');
          shiftBtn.type='button'; shiftBtn.className='kb-key wide'; shiftBtn.textContent='Shift ⇧';
          shiftBtn.onclick=()=>{ shift=!shift; shiftBtn.classList.toggle('active-shift',shift); };
          rowEl.appendChild(shiftBtn);
        }
        row.forEach(([normal, shifted]) => {
          const btn=document.createElement('button'); btn.type='button'; btn.className='kb-key';
          if (shifted !== normal) { const sub=document.createElement('span'); sub.className='sub-char'; sub.textContent=shifted; btn.appendChild(sub); }
          const main=document.createElement('span'); main.className='main-char'; main.textContent=normal; btn.appendChild(main);
          btn.onclick=()=>{ handleGenericKey(mode, shift ? shifted : normal); if(shift){shift=false; shiftBtn?.classList.remove('active-shift');} };
          rowEl.appendChild(btn);
        });
        if (ri === 2) {
          const back=document.createElement('button'); back.type='button'; back.className='kb-key wide'; back.textContent='⌫'; back.onclick=()=>handleGenericBackspace(mode); rowEl.appendChild(back);
        }
        container.appendChild(rowEl);
      });
      const last=document.createElement('div'); last.className='kb-row';
      const space=document.createElement('button'); space.type='button'; space.className='kb-key space-key'; space.textContent='Space'; space.onclick=()=>handleGenericKey(mode,' ');
      const clear=document.createElement('button'); clear.type='button'; clear.className='kb-key wide'; clear.textContent='Clear'; clear.onclick=()=> mode==='text-study' ? clearTextInput() : clearAddTextKoreanInput();
      last.append(space,clear); container.appendChild(last);
    }

    function setupTextKoreanKeyboards() {
      buildKoreanKeyboard('text-study-keyboard','text-study');
      buildKoreanKeyboard('text-add-korean-keyboard','text-add');
      const studyInput=document.getElementById('text-user-input');
      const addInput=document.getElementById('text-input-korean');
      studyInput.addEventListener('focus',()=>document.getElementById('text-study-keyboard').classList.add('visible'));
      addInput.addEventListener('focus',()=>document.getElementById('text-add-korean-keyboard').classList.add('visible'));
      const setup=(input,mode)=>input.addEventListener('keydown',e=>{
        if(e.key==='Backspace'){e.preventDefault();handleGenericBackspace(mode);}
        else if(e.key==='Enter' && mode==='text-study'){e.preventDefault();checkTextAnswer();}
        else if(e.key===' '){e.preventDefault();handleGenericKey(mode,' ');}
        else if(qwertyMap[e.key]){e.preventDefault();handleGenericKey(mode,qwertyMap[e.key]);}
      });
      setup(studyInput,'text-study'); setup(addInput,'text-add');
      [studyInput,addInput].forEach((input)=>input.addEventListener('input',()=>{
        const mode=input===studyInput?'text-study':'text-add';
        const expected=mode==='text-study'?Hangul.assemble(textInputJamoSequence):Hangul.assemble(addTextInputJamoSequence);
        if(input.value!==expected){
          if(mode==='text-study') textInputJamoSequence=Hangul.disassemble(input.value);
          else addTextInputJamoSequence=Hangul.disassemble(input.value);
        }
      }));
    }

    async function addTextVocabulary(e) {
      e.preventDefault();
      const newWord={
        category: document.getElementById('text-input-category').value.trim(),
        english: document.getElementById('text-input-english').value.trim(),
        korean: document.getElementById('text-input-korean').value.trim()
      };
      if(!newWord.category || !newWord.english || !newWord.korean) return;
      if(!supabaseClient){ alert('Supabase is not available. Please refresh the page and try again.'); return; }
      const btn=document.querySelector('#text-vocab-form button[type="submit"]'); const original=btn.textContent;
      btn.disabled=true; btn.textContent='Saving...';
      try {
        const {data,error}=await supabaseClient.from('text_vocabs').insert([newWord]).select().single();
        if(error) throw error;
        textVocabularies.push(data);
        localStorage.setItem('korean_text_vocab_quiz',JSON.stringify(textVocabularies));
        populateTextCategories(); filterTextVocab();
        document.getElementById('text-vocab-form').reset();
        addTextInputJamoSequence=[]; document.getElementById('text-add-korean-keyboard').classList.remove('visible');
        alert('Text vocabulary added to the online database!');
        switchTab('text-study');
      } catch(error) {
        console.error('Text vocabulary insert failed:',error);
        alert('Could not save the text vocabulary. Please check the text_vocabs policies.');
      } finally { btn.disabled=false; btn.textContent=original; }
    }

    /* TAB & DATA MANAGEMENT */
    function switchTab(tab) {
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      const view=document.getElementById(tab + '-view');
      if(view) view.classList.add('active');
      if(tab==='study') document.getElementById('user-input')?.focus();
      if(tab==='text-study') document.getElementById('text-user-input')?.focus();
      if(tab==='manage') loadManageData();
    }

    async function addVocabulary(e) {
      e.preventDefault();
      const newVocab = {
        category: document.getElementById('input-category').value.trim(),
        korean: document.getElementById('input-korean').value.trim(),
        english: document.getElementById('input-english').value.trim(),
        image: document.getElementById('input-image').value.trim()
      };
      if (!newVocab.category || !newVocab.korean || !newVocab.image) return;
      if (!supabaseClient) {
        alert('Supabase is not available. Please refresh the page and try again.');
        return;
      }
      const saveButton = document.querySelector('#vocab-form button[type="submit"]');
      const originalButtonText = saveButton.textContent;
      saveButton.disabled = true;
      saveButton.textContent = 'Saving...';
      try {
        if (!supabaseClient) throw new Error('Supabase client unavailable');
        const { data, error } = await supabaseClient
          .from('vocabularies')
          .insert([newVocab])
          .select()
          .single();
        if (error) throw error;
        const savedVocab = {
          id: data.id, category: data.category, korean: data.korean,
          english: data.english || '', image: data.image
        };
        vocabularies.push(savedVocab);
        saveToLocalStorage();
        populateCategories();
        document.getElementById('vocab-form').reset();
        addInputJamoSequence = [];
        isAddShiftActive = false;
        document.getElementById('add-shift-btn').classList.remove('active-shift');
        document.getElementById('add-korean-keyboard').classList.remove('visible');
        alert('Vocabulary item added to the online database!');
        switchTab('study');
        filterVocab();
      } catch (error) {
        console.error('Supabase insert failed:', error);
        alert('Could not save the vocabulary. Please check your Supabase connection and policies.');
      } finally {
        saveButton.disabled = false;
        saveButton.textContent = originalButtonText;
      }
    }


    /* MANAGE VOCABULARIES */
    let manageType = 'image';
    let managePage = 1;
    const MANAGE_PAGE_SIZE = 20;

    function setManageType(type) {
      manageType = type;
      managePage = 1;
      const imageTab = document.getElementById('manage-image-tab');
      const textTab = document.getElementById('manage-text-tab');
      if (imageTab && textTab) {
        imageTab.className = type === 'image' ? 'btn btn-submit' : 'btn btn-secondary';
        textTab.className = type === 'text' ? 'btn btn-submit' : 'btn btn-secondary';
      }
      populateManageCategories();
      renderManageList();
    }

    async function loadManageData() {
      if (!supabaseClient) {
        alert('Supabase is not available. Please refresh the page.');
        return;
      }

      const list = document.getElementById('manage-list');
      if (list) list.innerHTML = '<div class="manage-empty">Loading...</div>';

      try {
        const { data: imageData, error: imageError } = await supabaseClient
          .from('vocabularies').select('id,category,korean,english,image,created_at')
          .order('created_at', { ascending: true });
        if (imageError) throw imageError;

        const { data: textData, error: textError } = await supabaseClient
          .from('text_vocabs').select('id,category,english,korean,created_at')
          .order('created_at', { ascending: true });
        if (textError) throw textError;

        vocabularies = imageData || [];
        textVocabularies = textData || [];
        saveToLocalStorage();
        localStorage.setItem('korean_text_vocab_quiz', JSON.stringify(textVocabularies));

        populateCategories();
        populateTextCategories();
        populateManageCategories();
        renderManageList();
      } catch (error) {
        console.error('Manage load failed:', error);
        if (list) list.innerHTML = '<div class="manage-empty">Could not load vocabulary. Check your Supabase SELECT policy.</div>';
      }
    }

    function populateManageCategories() {
      const select = document.getElementById('manage-category');
      if (!select) return;
      const source = manageType === 'image' ? vocabularies : textVocabularies;
      const cats = [...new Set(source.map(v => (v.category || '').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
      const current = select.value;
      select.innerHTML = '<option value="ALL">All Categories</option>' +
        cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');
      if (cats.includes(current)) select.value = current;
    }

    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
      }[ch]));
    }

    function renderManageList() {
      const list = document.getElementById('manage-list');
      const count = document.getElementById('manage-count');
      const pagination = document.getElementById('manage-pagination');
      if (!list || !count || !pagination) return;

      const source = manageType === 'image' ? vocabularies : textVocabularies;
      const query = (document.getElementById('manage-search')?.value || '').trim().toLowerCase();
      const category = document.getElementById('manage-category')?.value || 'ALL';

      const filtered = source.filter(v => {
        const haystack = [v.korean, v.english, v.category].join(' ').toLowerCase();
        return (!query || haystack.includes(query)) && (category === 'ALL' || v.category === category);
      });

      const totalPages = Math.max(1, Math.ceil(filtered.length / MANAGE_PAGE_SIZE));
      if (managePage > totalPages) managePage = totalPages;
      const start = (managePage - 1) * MANAGE_PAGE_SIZE;
      const rows = filtered.slice(start, start + MANAGE_PAGE_SIZE);

      count.textContent = filtered.length
        ? `Showing ${start + 1}–${Math.min(start + MANAGE_PAGE_SIZE, filtered.length)} of ${filtered.length}`
        : 'No vocabulary found.';

      if (!rows.length) {
        list.innerHTML = '<div class="manage-empty">No vocabulary matches your search.</div>';
      } else {
        list.innerHTML = rows.map(v => {
          const meaning = manageType === 'image' ? (v.english || '') : (v.english || '');
          const preview = manageType === 'image' && v.image
            ? `<img src="${escapeHtml(v.image)}" alt="" style="width:54px;height:54px;object-fit:cover;border-radius:8px;margin-right:12px;">`
            : '';
          return `<div class="manage-row">
            <div class="manage-main" style="display:flex;align-items:center;min-width:0;">
              ${preview}
              <div style="min-width:0;">
                <div class="manage-korean">${escapeHtml(v.korean)}</div>
                <div class="manage-meaning">${escapeHtml(meaning)}</div>
                <div class="manage-meta">${escapeHtml(v.category || 'Uncategorized')}</div>
              </div>
            </div>
            <div class="manage-actions">
              <button class="manage-edit" onclick="editManagedVocab('${escapeHtml(v.id)}')">✏️ Edit</button>
              <button class="manage-delete" onclick="deleteManagedVocab('${escapeHtml(v.id)}')">🗑️ Delete</button>
            </div>
          </div>`;
        }).join('');
      }

      pagination.innerHTML = '';
      if (totalPages > 1) {
        const prev = document.createElement('button');
        prev.className='manage-page-btn';
        prev.textContent='‹';
        prev.disabled=managePage===1;
        prev.onclick=()=>{managePage--;renderManageList();};
        pagination.appendChild(prev);

        const maxButtons = 7;
        let first = Math.max(1, managePage - 3);
        let last = Math.min(totalPages, first + maxButtons - 1);
        first = Math.max(1, last - maxButtons + 1);
        for(let p=first;p<=last;p++){
          const b=document.createElement('button');
          b.className='manage-page-btn'+(p===managePage?' active':'');
          b.textContent=p;
          b.onclick=()=>{managePage=p;renderManageList();};
          pagination.appendChild(b);
        }

        const next = document.createElement('button');
        next.className='manage-page-btn';
        next.textContent='›';
        next.disabled=managePage===totalPages;
        next.onclick=()=>{managePage++;renderManageList();};
        pagination.appendChild(next);
      }
    }

    async function editManagedVocab(id) {
      const source = manageType === 'image' ? vocabularies : textVocabularies;
      const item = source.find(v => String(v.id) === String(id));
      if (!item || !supabaseClient) return;

      const category = prompt('Category:', item.category || '');
      if (category === null) return;

      const english = prompt('English / Meaning:', item.english || '');
      if (english === null) return;

      const korean = prompt('Korean:', item.korean || '');
      if (korean === null) return;

      const updateData = { category: category.trim(), english: english.trim(), korean: korean.trim() };
      if (manageType === 'image') {
        const image = prompt('Image URL:', item.image || '');
        if (image === null) return;
        updateData.image = image.trim();
      }

      if (!updateData.category || !updateData.english || !updateData.korean || (manageType==='image' && !updateData.image)) {
        alert('All fields are required.');
        return;
      }

      try {
        const table = manageType === 'image' ? 'vocabularies' : 'text_vocabs';
        const { data, error } = await supabaseClient.from(table).update(updateData).eq('id', id).select().single();
        if (error) throw error;

        const index = source.findIndex(v => String(v.id) === String(id));
        source[index] = data;
        if (manageType === 'image') {
          vocabularies = source;
          saveToLocalStorage();
          populateCategories();
        } else {
          textVocabularies = source;
          localStorage.setItem('korean_text_vocab_quiz', JSON.stringify(textVocabularies));
          populateTextCategories();
        }
        populateManageCategories();
        renderManageList();
        alert('Vocabulary updated successfully.');
      } catch (error) {
        console.error('Update failed:', error);
        alert('Could not update this item. Make sure the UPDATE policy is enabled.');
      }
    }

    async function deleteManagedVocab(id) {
      const source = manageType === 'image' ? vocabularies : textVocabularies;
      const item = source.find(v => String(v.id) === String(id));
      if (!item || !supabaseClient) return;

      const label = `${item.korean}${item.english ? ' - ' + item.english : ''}`;
      if (!confirm(`Delete "${label}" permanently?`)) return;

      try {
        const table = manageType === 'image' ? 'vocabularies' : 'text_vocabs';
        const { error } = await supabaseClient.from(table).delete().eq('id', id);
        if (error) throw error;

        const remaining = source.filter(v => String(v.id) !== String(id));
        if (manageType === 'image') {
          vocabularies = remaining;
          saveToLocalStorage();
          populateCategories();
        } else {
          textVocabularies = remaining;
          localStorage.setItem('korean_text_vocab_quiz', JSON.stringify(textVocabularies));
          populateTextCategories();
        }
        populateManageCategories();
        renderManageList();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Could not delete this item. Make sure the DELETE policy is enabled.');
      }
    }

    function exportJSON() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocabularies, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute("href", dataStr);
      anchor.setAttribute("download", "vocabularies.json");
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    }

    function importJSON(event) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            vocabularies = data;
            saveToLocalStorage();
            populateCategories();
            filterVocab();
            alert('Vocabulary list updated successfully!');
          }
        } catch (err) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(event.target.files[0]);
    }
