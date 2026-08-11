/* Persistent study statistics for the signed-in learner. */

async function recordStudyActivity(type, item, result, mode = 'typing', isReview = false) {
  if (!supabaseClient || !item?.id || !result) return false;

  const user = await getCurrentAuthUser();
  if (!user) return false;

  const { error } = await supabaseClient.rpc('record_study_activity', {
    p_vocab_type: type,
    p_vocab_id: String(item.id),
    p_category: item.category || '',
    p_korean: item.korean || '',
    p_english: item.english || '',
    p_result: result,
    p_mode: mode || 'typing',
    p_is_review: !!isReview
  });

  if (error) {
    console.error('Could not record study activity:', error);
    return false;
  }
  return true;
}

async function fetchStudyStatistics(days = 30) {
  if (!supabaseClient) return null;

  const user = await getCurrentAuthUser();
  if (!user) return null;

  const since = new Date();
  since.setDate(since.getDate() - Number(days || 30));

  const { data, error } = await supabaseClient
    .from('study_activity')
    .select('vocab_type,vocab_id,category,korean,english,result,mode,is_review,created_at')
    .eq('user_id', user.id)
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false })
    .limit(5000);

  if (error) {
    console.error('Could not load study statistics:', error);
    return null;
  }

  return data || [];
}

function calculateStudyStatistics(rows) {
  const totalAttempts = rows.length;
  const correct = rows.filter(r => r.result === 'correct').length;
  const wrong = rows.filter(r => r.result === 'wrong').length;
  const skipped = rows.filter(r => r.result === 'skipped').length;
  const answered = correct + wrong;
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;

  const categories = {};
  const words = {};

  rows.forEach(r => {
    const category = r.category || 'Uncategorized';
    categories[category] ||= { attempts: 0, correct: 0, wrong: 0, skipped: 0 };
    categories[category].attempts += 1;
    categories[category][r.result] += 1;

    const key = `${r.vocab_type}:${r.vocab_id}`;
    words[key] ||= {
      vocab_type: r.vocab_type,
      vocab_id: r.vocab_id,
      korean: r.korean || '',
      english: r.english || '',
      category,
      attempts: 0,
      correct: 0,
      wrong: 0,
      skipped: 0
    };
    words[key].attempts += 1;
    words[key][r.result] += 1;
  });

  const categoryList = Object.entries(categories).map(([name, value]) => ({
    name,
    ...value,
    accuracy: value.correct + value.wrong
      ? Math.round((value.correct / (value.correct + value.wrong)) * 100)
      : 0
  })).sort((a, b) => {
    if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
    return b.wrong - a.wrong;
  });

  const difficultWords = Object.values(words)
    .filter(w => w.wrong > 0)
    .sort((a, b) => {
      if (b.wrong !== a.wrong) return b.wrong - a.wrong;
      return a.correct - b.correct;
    })
    .slice(0, 10);

  const practicedWords = Object.values(words)
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 10);

  const imageAttempts = rows.filter(r => r.vocab_type === 'image').length;
  const textAttempts = rows.filter(r => r.vocab_type === 'text').length;

  return {
    totalAttempts,
    correct,
    wrong,
    skipped,
    answered,
    accuracy,
    imageAttempts,
    textAttempts,
    categoryList,
    difficultWords,
    practicedWords
  };
}
