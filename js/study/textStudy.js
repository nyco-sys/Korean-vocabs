    /* TEXT VOCABULARY */
    async function loadTextVocabularies() {
      await loadStudyTextBatch(document.getElementById('text-category-filter')?.value || 'ALL');
      const cats = await fetchCategories('text_vocabs');
      if (cats.length) setCategoryOptions('text-category-filter', cats);
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

    async function filterTextVocab() {
      if (textStudySession.active) await startTextStudy();
    }

    async function triggerRandomTextMode() {
      const s=document.getElementById('text-category-filter'); if(s) s.value='ALL';
      if (textStudySession.active) await startTextStudy();
    }

    async function startTextStudy() {
      const category = document.getElementById('text-category-filter')?.value || 'ALL';
      const mode = document.getElementById('text-quiz-mode')?.value || 'typing';
      const total = getStudyQuestionCount('text-question-count');
      const review = textStudySession.review === true;
      resetStudySession('text', { total, category, mode });
      textStudySession.review = review;
      textQuizMode = mode;
      showStudyScreen('text', 'quiz');
      await loadStudyTextBatch(category);
      if (!filteredTextVocab.length) { textStudySession.active = false; showStudyScreen('text', 'settings'); document.getElementById('text-empty-notice').style.display='block'; return; }
      textStudySession.total = Math.min(total, filteredTextVocab.length);
      updateStudyProgress('text');
    }

    function restartTextStudy() { startTextStudy(); }

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
      updateStudyProgress('text');
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

    async function renderTextMultipleChoice() {
      const container = document.getElementById('text-multiple-choice');
      const current = filteredTextVocab[currentTextIndex];
      if (!container || !current) return;
      container.innerHTML = '<div class="manage-empty">Loading choices...</div>';
      const choices = await getRemoteRandomChoices('text_vocabs', current, 'korean');
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
        setTimeout(() => { if (!recordStudyAnswer('text', 'correct')) nextTextQuestion(); }, 1000);
      } else {
        clickedButton.classList.add('incorrect');
        buttons.forEach(btn => {
          if (btn.textContent.trim() === current.korean.trim()) btn.classList.add('correct');
        });
        setFeedback('text-feedback', `Incorrect! Correct answer: ${current.korean} ❌`, false);
        playWrongSound();
        recordVocabularyMistake('text', current);
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
        setTimeout(() => { if (!recordStudyAnswer('text', 'correct')) nextTextQuestion(); }, 1200);
      } else {
        inputEl.className = 'answer-input incorrect';
        feedback.style.color = 'var(--danger)';
        feedback.textContent = 'Incorrect! Try again. ❌';
        playWrongSound();
        recordVocabularyMistake('text', current);
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

    function skipTextQuestion() { if (!recordStudyAnswer('text', 'skipped')) nextTextQuestion(); }

    async function nextTextQuestion() {
      if (!textStudySession.active || !filteredTextVocab.length) return;
      if (currentTextIndex >= filteredTextVocab.length - 1) {
        await loadStudyTextBatch(textStudySession.category);
        return;
      }
      currentTextIndex += 1;
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
      } else if (mode === 'edit') {
        handleEditKey(char);
      } else {
        addTextInputJamoSequence.push(char);
        renderAddTextKoreanInput();
      }
    }

    function handleGenericBackspace(mode) {
      if (mode === 'text-study') {
        textInputJamoSequence.pop();
        renderTextKoreanInput();
      } else if (mode === 'edit') {
        handleEditBackspace();
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
      const clear=document.createElement('button'); clear.type='button'; clear.className='kb-key wide'; clear.textContent='Clear'; clear.onclick=()=> mode==='text-study' ? clearTextInput() : mode==='edit' ? (editInputJamoSequence=[], renderEditKoreanInput()) : clearAddTextKoreanInput();
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

