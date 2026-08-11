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

