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

