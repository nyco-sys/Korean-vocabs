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

