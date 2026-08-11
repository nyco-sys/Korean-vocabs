/* Persistent mistake tracking for the signed-in learner/admin. */

async function getCurrentAuthUser() {
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) return null;
  return data?.user || null;
}

async function recordVocabularyMistake(type, item) {
  const user = await getCurrentAuthUser();
  if (!user || !item?.id || !supabaseClient) return;

  const { error } = await supabaseClient.rpc('record_study_mistake', {
    p_vocab_type: type,
    p_vocab_id: String(item.id),
    p_category: item.category || '',
    p_korean: item.korean || '',
    p_english: item.english || null,
    p_image: type === 'image' ? (item.image || null) : null
  });

  if (error) {
    console.error('Could not record mistake:', error);
    return false;
  }

  // Wrong attempts are useful for difficulty statistics.
  if (typeof recordStudyActivity === 'function') {
    const session = type === 'image' ? imageStudySession : textStudySession;
    recordStudyActivity(type, item, 'wrong', session?.mode || 'typing', !!session?.review);
  }

  return true;
}

async function fetchMistakes(type = 'ALL', limit = 100) {
  if (!supabaseClient) return [];
  const user = await getCurrentAuthUser();
  if (!user) return [];

  let query = supabaseClient
    .from('study_mistakes')
    .select('id,vocab_type,vocab_id,category,korean,english,image,wrong_count,last_wrong_at')
    .order('last_wrong_at', { ascending: false })
    .limit(limit);

  if (type !== 'ALL') query = query.eq('vocab_type', type);

  const { data, error } = await query;
  if (error) {
    console.error('Could not load mistakes:', error);
    return [];
  }
  return data || [];
}

async function clearMistake(type, vocabId) {
  if (!supabaseClient) return false;
  const user = await getCurrentAuthUser();
  if (!user) return false;

  const { error } = await supabaseClient
    .from('study_mistakes')
    .delete()
    .eq('user_id', user.id)
    .eq('vocab_type', type)
    .eq('vocab_id', String(vocabId));

  if (error) {
    console.error('Could not clear mistake:', error);
    return false;
  }
  return true;
}

async function clearMistakeForCorrectAnswer(type, item) {
  if (!item?.id || !supabaseClient) return;
  const user = await getCurrentAuthUser();
  if (!user) return;
  await supabaseClient
    .from('study_mistakes')
    .delete()
    .eq('user_id', user.id)
    .eq('vocab_type', type)
    .eq('vocab_id', String(item.id));
}

async function fetchReviewMistakeBatch(type, limit = 20) {
  const mistakes = await fetchMistakes(type, limit);
  return mistakes.map(item => ({
    id: item.vocab_id,
    korean: item.korean || '',
    english: item.english || '',
    category: item.category || '',
    image: item.image || '',
    wrong_count: item.wrong_count || 1
  }));
}
