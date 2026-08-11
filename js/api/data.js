const STUDY_BATCH_SIZE = 20;

    async function fetchRandomStudyBatch(table, category = 'ALL', limit = STUDY_BATCH_SIZE) {
      if (!supabaseClient) throw new Error('Supabase client unavailable');
      let countQuery = supabaseClient.from(table).select('id', { count: 'exact', head: true });
      if (category !== 'ALL') countQuery = countQuery.eq('category', category);
      const { count, error: countError } = await countQuery;
      if (countError) throw countError;
      const total = Number(count || 0);
      if (!total) return [];
      const maxStart = Math.max(0, total - limit);
      const randomStart = Math.floor(Math.random() * (maxStart + 1));
      let q = supabaseClient.from(table)
        .select(table === 'vocabularies' ? 'id,category,korean,english,image' : 'id,category,english,korean,created_at')
        .order('id', { ascending: true })
        .range(randomStart, randomStart + limit - 1);
      if (category !== 'ALL') q = q.eq('category', category);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    }

    async function fetchCategories(table) {
      if (!supabaseClient) return [];
      const rpcName = table === 'vocabularies' ? 'get_vocab_categories' : 'get_text_vocab_categories';
      const { data, error } = await supabaseClient.rpc(rpcName);
      if (error) return [];
      return (data || []).map(r => r.category).filter(Boolean).sort((a,b)=>a.localeCompare(b));
    }

    function setCategoryOptions(id, categories) {
      const select = document.getElementById(id);
      if (!select) return;
      const current = select.value;
      select.innerHTML = '<option value="ALL">All Categories</option>';
      categories.forEach(cat => {
        const opt=document.createElement('option'); opt.value=cat; opt.textContent=cat; select.appendChild(opt);
      });
      if (categories.includes(current)) select.value=current;
    }


