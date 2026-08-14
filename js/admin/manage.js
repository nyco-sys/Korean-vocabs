    /* MANAGE VOCABULARIES */
    let manageType = 'image';
    let managePage = 1;
    const MANAGE_PAGE_SIZE = 5;
    let editingVocabId = null, editingVocabType = null, editInputJamoSequence = [];

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
      if (!isAdminAuthenticated()) { openLoginModal(); return; }
      managePage=1;
      await populateManageCategories();
      await renderManageList();
    }


    async function populateManageCategories() {
      const table=manageType==='image'?'vocabularies':'text_vocabs';
      const cats=await fetchCategories(table);
      if(cats.length) setCategoryOptions('manage-category',cats);
    }


    function escapeHtml(value) {
      return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
      }[ch]));
    }

    async function renderManageList() {
      const list=document.getElementById('manage-list'), count=document.getElementById('manage-count'), pagination=document.getElementById('manage-pagination');
      if(!list||!count||!pagination||!supabaseClient)return;
      if(!isAdminAuthenticated()){ list.innerHTML='<div class="manage-empty">Please sign in to manage vocabulary.</div>'; count.textContent=''; pagination.innerHTML=''; return; }

      const table=manageType==='image'?'vocabularies':'text_vocabs';
      const q=(document.getElementById('manage-search')?.value||'').trim();
      const cat=document.getElementById('manage-category')?.value||'ALL';
      list.innerHTML='<div class="manage-empty">Loading...</div>';
      count.textContent='';
      pagination.innerHTML='';

      try {
        const fields=table==='vocabularies'
          ? 'id,category,korean,english,image'
          : 'id,category,english,korean,created_at';

        let query=supabaseClient
          .from(table)
          .select(fields,{count:'exact'})
          .order('id',{ascending:true});

        if(cat!=='ALL') query=query.eq('category',cat);
        if(q){
          const safe=q.replace(/[%(),]/g,' ').trim();
          if(safe) query=query.or(`korean.ilike.%${safe}%,english.ilike.%${safe}%,category.ilike.%${safe}%`);
        }

        const start=(managePage-1)*MANAGE_PAGE_SIZE;
        const {data:rows,count:total,error}=await query.range(start,start+MANAGE_PAGE_SIZE-1);
        if(error) throw error;

        const totalCount=Number(total||0);
        const totalPages=Math.max(1,Math.ceil(totalCount/MANAGE_PAGE_SIZE));
        if(managePage>totalPages){managePage=totalPages;return renderManageList();}

        count.textContent=totalCount
          ? `Showing ${start+1}–${Math.min(start+MANAGE_PAGE_SIZE,totalCount)} of ${totalCount}`
          : 'No vocabulary found.';

        list.innerHTML=rows?.length?rows.map(v=>{
          const preview=manageType==='image'&&v.image
            ? `<img src="${escapeHtml(v.image)}" alt="" style="width:54px;height:54px;object-fit:cover;border-radius:8px;margin-right:12px;">`
            : '';
          return `<div class="manage-row"><div class="manage-main" style="display:flex;align-items:center;min-width:0;">${preview}<div style="min-width:0;"><div class="manage-korean">${escapeHtml(v.korean)}</div><div class="manage-meaning">${escapeHtml(v.english||'')}</div><div class="manage-meta">${escapeHtml(v.category||'Uncategorized')}</div></div></div><div class="manage-actions"><button class="manage-edit" onclick="editManagedVocab('${escapeHtml(v.id)}')">✏️ Edit</button><button class="manage-delete" onclick="deleteManagedVocab('${escapeHtml(v.id)}')">🗑️ Delete</button></div></div>`;
        }).join(''):'<div class="manage-empty">No vocabulary matches your search.</div>';

        if(totalPages>1){
          const add=(txt,disabled,fn,active=false)=>{const b=document.createElement('button');b.className='manage-page-btn'+(active?' active':'');b.textContent=txt;b.disabled=disabled;b.onclick=fn;pagination.appendChild(b);};
          add('‹',managePage===1,()=>{managePage--;renderManageList();});
          const max=7;let first=Math.max(1,managePage-3),last=Math.min(totalPages,first+max-1);if(last-first+1<max)first=Math.max(1,last-max+1);
          for(let i=first;i<=last;i++)add(i,false,()=>{managePage=i;renderManageList();},i===managePage);
          add('›',managePage===totalPages,()=>{managePage++;renderManageList();});
        }
      } catch(error) {
        console.error('Manage vocabulary load failed:', error);
        list.innerHTML='<div class="manage-empty">Could not load vocabularies. Please refresh and try again.</div>';
        count.textContent='';
      }
    }

    async function editManagedVocab(id) {
      if (!isAdminAuthenticated()) { openLoginModal(); return; }
      const table = manageType === 'image' ? 'vocabularies' : 'text_vocabs';
      const fields = table === 'vocabularies' ? 'id,category,korean,english,image' : 'id,category,korean,english';
      const { data:item, error } = await supabaseClient.from(table).select(fields).eq('id',id).single();
      if (error || !item) { console.error('Edit load failed:',error); return; }
      editingVocabId=id; editingVocabType=manageType;
      editInputJamoSequence=Hangul.disassemble(item.korean || '');
      document.getElementById('edit-category').value=item.category||'';
      document.getElementById('edit-english').value=item.english||'';
      document.getElementById('edit-korean').value=item.korean||'';
      document.getElementById('edit-image').value=item.image||'';
      document.getElementById('edit-image-group').style.display=manageType==='image'?'':'none';
      document.getElementById('edit-modal').classList.add('open');
      document.getElementById('edit-modal').setAttribute('aria-hidden','false');
      setTimeout(()=>document.getElementById('edit-korean').focus(),0);
    }

    function closeEditModal(){
      const m=document.getElementById('edit-modal'); if(m){m.classList.remove('open');m.setAttribute('aria-hidden','true');}
      editingVocabId=null; editingVocabType=null; editInputJamoSequence=[];
    }

    function renderEditKoreanInput(){document.getElementById('edit-korean').value=Hangul.assemble(editInputJamoSequence);}
    function handleEditKey(char){editInputJamoSequence.push(char);renderEditKoreanInput();document.getElementById('edit-korean').focus();}
    function handleEditBackspace(){editInputJamoSequence.pop();renderEditKoreanInput();document.getElementById('edit-korean').focus();}
    function setupEditKoreanKeyboard(){
      buildKoreanKeyboard('edit-korean-keyboard','edit');
      const input=document.getElementById('edit-korean'); if(!input)return;
      input.addEventListener('focus',()=>document.getElementById('edit-korean-keyboard').classList.add('visible'));
      input.addEventListener('keydown',e=>{if(e.key==='Backspace'){e.preventDefault();handleEditBackspace()}else if(e.key===' '){e.preventDefault();handleEditKey(' ')}else if(qwertyMap[e.key]){e.preventDefault();handleEditKey(qwertyMap[e.key])}});
      input.addEventListener('input',()=>{if(input.value!==Hangul.assemble(editInputJamoSequence))editInputJamoSequence=Hangul.disassemble(input.value)});
    }

    async function saveEditedVocab(e){
      if (!isAdminAuthenticated()) { openLoginModal(); return; }

      e.preventDefault(); if(!editingVocabId||!editingVocabType||!supabaseClient)return;
      const updateData={category:document.getElementById('edit-category').value.trim(),english:document.getElementById('edit-english').value.trim(),korean:document.getElementById('edit-korean').value.trim()};
      if(editingVocabType==='image')updateData.image=document.getElementById('edit-image').value.trim();
      if(!updateData.category||!updateData.english||!updateData.korean||(editingVocabType==='image'&&!updateData.image)){notify('All fields are required.');return;}
      const table=editingVocabType==='image'?'vocabularies':'text_vocabs'; const btn=document.querySelector('#edit-vocab-form button[type="submit"]'); const old=btn.textContent; btn.disabled=true;btn.textContent='Saving...';
      try{
        const {data,error}=await supabaseClient.from(table).update(updateData).eq('id',editingVocabId).select().single(); if(error)throw error;
        if(editingVocabType==='image'){const i=vocabularies.findIndex(v=>String(v.id)===String(editingVocabId));if(i>=0)vocabularies[i]=data;saveToLocalStorage();populateCategories();filterVocab();}
        else{const i=textVocabularies.findIndex(v=>String(v.id)===String(editingVocabId));if(i>=0)textVocabularies[i]=data;localStorage.setItem('korean_text_vocab_quiz',JSON.stringify(textVocabularies));populateTextCategories();filterTextVocab();}
        populateManageCategories();renderManageList();closeEditModal();notify('Vocabulary updated successfully.');
      }catch(error){console.error('Update failed:',error);notify('Could not update this item. Make sure the UPDATE policy is enabled.')}finally{btn.disabled=false;btn.textContent=old}
    }

    async function deleteManagedVocab(id) {
      if(!isAdminAuthenticated()){openLoginModal();return;}
      const table=manageType==='image'?'vocabularies':'text_vocabs';
      const {data:item,error:fe}=await supabaseClient.from(table).select('id,korean,english').eq('id',id).single();
      if(fe||!item)return;
      if(!confirm(`Delete "${item.korean}${item.english?' - '+item.english:''}" permanently?`))return;
      const {error}=await supabaseClient.from(table).delete().eq('id',id);
      if(error){console.error(error);notify('Could not delete this item. Make sure the DELETE policy is enabled.');return;}
      await renderManageList();
    }


