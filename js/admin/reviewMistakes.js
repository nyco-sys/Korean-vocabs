/* Mistake Review screen and practice launchers. */

async function loadMistakeReview() {
  const list = document.getElementById('mistake-list');
  const summary = document.getElementById('mistake-summary');
  const filter = document.getElementById('mistake-filter')?.value || 'ALL';
  if (!list) return;

  list.innerHTML = '<div class="glass-panel review-empty">Loading mistakes...</div>';
  const mistakes = await fetchMistakes(filter, 100);
  reviewMistakes = mistakes;
  reviewFilter = filter;

  const imageCount = mistakes.filter(m => m.vocab_type === 'image').length;
  const textCount = mistakes.filter(m => m.vocab_type === 'text').length;
  if (summary) {
    summary.innerHTML = `
      <div class="review-stat"><span>Total</span><strong>${mistakes.length}</strong></div>
      <div class="review-stat"><span>Image</span><strong>${imageCount}</strong></div>
      <div class="review-stat"><span>Text</span><strong>${textCount}</strong></div>
    `;
  }

  if (!mistakes.length) {
    list.innerHTML = `
      <div class="glass-panel review-empty">
        <div class="review-empty-icon">🎯</div>
        <h3>No mistakes to review</h3>
        <p>Great job! Vocabulary you answer incorrectly will appear here automatically.</p>
      </div>`;
    return;
  }

  list.innerHTML = '';
  mistakes.forEach(item => {
    const card = document.createElement('article');
    card.className = 'mistake-card glass-panel';
    const image = item.vocab_type === 'image' && item.image
      ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.english || 'Vocabulary image')}" loading="lazy">`
      : `<div class="mistake-text-icon">한</div>`;
    card.innerHTML = `
      <div class="mistake-card-media">${image}</div>
      <div class="mistake-card-content">
        <span class="category-tag">${escapeHtml(item.category || 'Uncategorized')}</span>
        <h3>${escapeHtml(item.korean)}</h3>
        <p>${escapeHtml(item.english || '')}</p>
        <span class="mistake-count">Wrong ${item.wrong_count} time${item.wrong_count === 1 ? '' : 's'}</span>
      </div>
      <button class="btn btn-secondary mistake-remove" type="button" title="Remove from review" onclick="removeMistake('${escapeHtml(item.vocab_type)}', '${escapeHtml(String(item.vocab_id))}')">✓</button>
    `;
    list.appendChild(card);
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

async function removeMistake(type, vocabId) {
  const ok = await clearMistake(type, vocabId);
  if (ok) loadMistakeReview();
}

async function startImageMistakeReview() {
  const mistakes = await fetchMistakes('image', 20);
  if (!mistakes.length) {
    alert('You have no image mistakes to review.');
    return;
  }
  setStudyReviewMode('image', true);
  switchTab('study');
  await startImageStudy();
}

async function startTextMistakeReview() {
  const mistakes = await fetchMistakes('text', 20);
  if (!mistakes.length) {
    alert('You have no text mistakes to review.');
    return;
  }
  setStudyReviewMode('text', true);
  switchTab('text-study');
  await startTextStudy();
}
