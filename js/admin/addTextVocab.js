    async function addTextVocabulary(e) {
      if (!isAdminAuthenticated()) { openLoginModal(); return; }

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
        localStorage.setItem('korean_text_vocab_quiz', JSON.stringify(textVocabularies));
        await loadStudyTextBatch(document.getElementById('text-category-filter')?.value || 'ALL');
        const textCats = await fetchCategories('text_vocabs');
        if (textCats.length) setCategoryOptions('text-category-filter', textCats);
        document.getElementById('text-vocab-form').reset();
        addTextInputJamoSequence=[]; document.getElementById('text-add-korean-keyboard').classList.remove('visible');
        alert('Text vocabulary added to the online database!');
        switchTab('text-study');
      } catch(error) {
        console.error('Text vocabulary insert failed:',error);
        alert('Could not save the text vocabulary. Please check the text_vocabs policies.');
      } finally { btn.disabled=false; btn.textContent=original; }
    }

