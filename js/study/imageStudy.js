    async function loadStudyImageBatch(category='ALL') {
      try {
        if (imageStudySession.review) {
          vocabularies = await fetchReviewMistakeBatch('image', 20);
        } else {
          vocabularies = (await fetchRandomStudyBatch('vocabularies', category)).map(item => ({
            id:item.id,korean:item.korean,english:item.english||'',category:item.category,image:item.image
          }));
        }
        filteredVocab=shuffleArray(vocabularies); currentIndex=0; if (imageStudySession.active) updateQuizUI();
        console.log(`Loaded ${vocabularies.length} image study items (full session).`);
      } catch(e) { console.error('Image study batch failed:',e); updateQuizUI(); }
    }

    async function loadStudyTextBatch(category='ALL') {
      try {
        textVocabularies = textStudySession.review
          ? await fetchReviewMistakeBatch('text', 20)
          : await fetchRandomStudyBatch('text_vocabs', category);
        filteredTextVocab=shuffleArray(textVocabularies); currentTextIndex=0; updateTextQuizUI();
        console.log(`Loaded ${textVocabularies.length} text study items (full session).`);
      } catch(e) { console.error('Text study batch failed:',e); updateTextQuizUI(); }
    }

    async function loadInitialData() {
      try {
        const imageCats = await fetchCategories('vocabularies');
        const textCats = await fetchCategories('text_vocabs');
        if (imageCats.length) setCategoryOptions('category-filter', imageCats);
        if (textCats.length) setCategoryOptions('text-category-filter', textCats);
        // Do not download a study batch until the learner starts a session.
        showStudyScreen('image', 'settings');
        showStudyScreen('text', 'settings');
      } catch (e) {
        console.error('Study setup load failed:', e);
      }
    }

    async function startImageStudy() {
      const category = document.getElementById('category-filter')?.value || 'ALL';
      const mode = document.getElementById('image-quiz-mode')?.value || 'typing';
      const review = imageStudySession.review === true;
      resetStudySession('image', { total: 0, category, mode });
      imageStudySession.review = review;
      imageQuizMode = mode;
      showStudyScreen('image', 'quiz');
      await loadStudyImageBatch(category);
      if (!filteredVocab.length) { imageStudySession.active = false; showStudyScreen('image', 'settings'); document.getElementById('empty-notice').style.display='block'; return; }
      imageStudySession.total = filteredVocab.length;
      updateStudyProgress('image');
    }

    function restartImageStudy() { startImageStudy(); }

    async function filterVocab() {
      if (imageStudySession.active) await startImageStudy();
    }

    async function triggerRandomMode() {
      const s=document.getElementById('category-filter'); if(s) s.value='ALL';
      if (imageStudySession.active) await startImageStudy();
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

    function shuffleArray(items) {
      const arr = [...items];
      for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
      return arr;
    }

    async function filterVocab() {
      await loadStudyImageBatch(document.getElementById('category-filter')?.value || 'ALL');
    }

    async function triggerRandomMode() {
      const s=document.getElementById('category-filter'); if(s) s.value='ALL';
      await loadStudyImageBatch('ALL');
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
      updateStudyProgress('image');
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

    async function getRemoteRandomChoices(table, correctItem, answerKey) {
      try {
        const pool = await fetchRandomStudyBatch(table, 'ALL', 20);
        return getRandomChoices([...pool, correctItem], correctItem, answerKey);
      } catch (e) {
        console.error('Random choice batch failed:', e);
        return getRandomChoices([correctItem], correctItem, answerKey);
      }
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

    async function renderImageMultipleChoice() {
      const container = document.getElementById('image-multiple-choice');
      const current = filteredVocab[currentIndex];
      if (!container || !current) return;
      container.innerHTML = '<div class="manage-empty">Loading choices...</div>';
      const choices = await getRemoteRandomChoices('vocabularies', current, 'korean');
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
        setTimeout(() => { if (!recordStudyAnswer('image', 'correct')) nextQuestion(); }, 1000);
      } else {
        clickedButton.classList.add('incorrect');
        buttons.forEach(btn => {
          if (btn.textContent.trim() === current.korean.trim()) btn.classList.add('correct');
        });
        setFeedback('feedback', `Incorrect! Correct answer: ${current.korean} ❌`, false);
        playWrongSound();
        recordVocabularyMistake('image', current);
        setTimeout(() => {
          buttons.forEach(btn => btn.disabled = false);
        }, 900);
      }
    }

