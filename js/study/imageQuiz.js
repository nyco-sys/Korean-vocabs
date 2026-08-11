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

    async function nextQuestion() {
      if (!filteredVocab.length) return;
      if (currentIndex >= filteredVocab.length - 1) {
        await loadStudyImageBatch(document.getElementById('category-filter')?.value || 'ALL');
        return;
      }
      currentIndex += 1;
      updateQuizUI();
    }

    function resetFeedback() {
      const inputEl = document.getElementById('user-input');
      const feedback = document.getElementById('feedback');
      inputEl.className = "answer-input";
      feedback.textContent = "";
    }


