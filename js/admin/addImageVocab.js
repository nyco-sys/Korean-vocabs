    async function addVocabulary(e) {
      if (!isAdminAuthenticated()) { openLoginModal(); return; }

      e.preventDefault();
      const newVocab = {
        category: document.getElementById('input-category').value.trim(),
        korean: document.getElementById('input-korean').value.trim(),
        english: document.getElementById('input-english').value.trim(),
        image: document.getElementById('input-image').value.trim()
      };
      if (!newVocab.category || !newVocab.korean || !newVocab.image) return;
      if (!supabaseClient) {
        notify('Supabase is not available. Please refresh the page and try again.');
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
        saveToLocalStorage();
        await loadStudyImageBatch(document.getElementById('category-filter')?.value || 'ALL');
        const imageCats = await fetchCategories('vocabularies');
        if (imageCats.length) setCategoryOptions('category-filter', imageCats);
        document.getElementById('vocab-form').reset();
        addInputJamoSequence = [];
        isAddShiftActive = false;
        document.getElementById('add-shift-btn').classList.remove('active-shift');
        document.getElementById('add-korean-keyboard').classList.remove('visible');
        notify('Vocabulary item added to the online database!');
        switchTab('study');
        filterVocab();
      } catch (error) {
        console.error('Supabase insert failed:', error);
        notify('Could not save the vocabulary. Please check your Supabase connection and policies.');
      } finally {
        saveButton.disabled = false;
        saveButton.textContent = originalButtonText;
      }
    }


