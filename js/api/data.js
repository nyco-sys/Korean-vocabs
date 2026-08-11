const STUDY_BATCH_SIZE = 20;

    async function fetchRandomStudyBatch(table, category = 'ALL') {
      if (!supabaseClient) throw new Error('Supabase client unavailable');

      const pageSize = 1000;
      let qCount = supabaseClient.from(table).select('id', { count: 'exact', head: true });
      if (category !== 'ALL') qCount = qCount.eq('category', category);

      const { count, error: countError } = await qCount;
      if (countError) throw countError;

      const total = Number(count || 0);
      if (!total) return [];

      const rows = [];
      for (let start = 0; start < total; start += pageSize) {
        let q = supabaseClient
          .from(table)
          .select(
            table === 'vocabularies'
              ? 'id,category,korean,english,image'
              : 'id,category,english,korean,created_at'
          )
          .order('id', { ascending: true })
          .range(start, Math.min(start + pageSize - 1, total - 1));

        if (category !== 'ALL') q = q.eq('category', category);

        const { data, error } = await q;
        if (error) throw error;
        rows.push(...(data || []));
      }

      return rows;
    }

    async function fetchCategories(table) {
      if (!supabaseClient) return [];

      // Prefer the category RPC when available. If the RPC is missing,
      // restricted by RLS, or otherwise unavailable, fall back to a
      // lightweight category-column query so the study dropdown still works.
      const rpcName = table === 'vocabularies'
        ? 'get_vocab_categories'
        : 'get_text_vocab_categories';

      try {
        const { data, error } = await supabaseClient.rpc(rpcName);
        if (!error && Array.isArray(data)) {
          return [...new Set(
            data.map(row => row?.category).filter(Boolean)
          )].sort((a, b) => a.localeCompare(b));
        }
      } catch (e) {
        console.warn(`Category RPC ${rpcName} unavailable; using fallback.`, e);
      }

      try {
        const pageSize = 1000;
        const categories = [];
        let start = 0;

        while (true) {
          const { data, error } = await supabaseClient
            .from(table)
            .select('category')
            .not('category', 'is', null)
            .range(start, start + pageSize - 1);

          if (error) throw error;

          categories.push(...(data || []).map(row => row.category).filter(Boolean));

          if (!data || data.length < pageSize) break;
          start += pageSize;
        }

        return [...new Set(categories)].sort((a, b) => a.localeCompare(b));
      } catch (error) {
        console.error(`Could not load categories from ${table}:`, error);
        return [];
      }
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

    window.fetchCategories = fetchCategories;
    window.fetchRandomStudyBatch = fetchRandomStudyBatch;
    window.setCategoryOptions = setCategoryOptions;



