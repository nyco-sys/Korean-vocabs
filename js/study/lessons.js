const KOREAN_LESSONS = [
  {
    id: 'phase-1', number: 1, title: '한글 기초', subtitle: 'Hangul Foundations', icon: '한', color: 'violet',
    description: 'Learn Hangul carefully from the beginning: the 10 basic vowels, 11 compound vowels, 14 basic consonants, 5 tense consonants, and how they form syllable blocks. Each sound is practiced one by one with Korean audio.',
    lessons: [
      { title: 'Introduction to Hangul', body: 'Hangul is a featural alphabet written in syllable blocks. Learn the difference between a letter (자모) and a complete syllable block.', examples: [
        {ko:'한글', en:'Hangul — Korean writing system', audio:'한글'},
        {ko:'한국어', en:'Korean language', audio:'한국어'},
        {ko:'가', en:'One complete syllable block: ㄱ + ㅏ', audio:'가'}
      ]},
      { title: 'How Syllable Blocks Work', body: 'Korean letters are grouped into blocks. A block normally begins with a consonant and contains a vowel; a final consonant can be added at the bottom.', examples: [
        {ko:'가', en:'ㄱ + ㅏ → ga', audio:'가'},
        {ko:'고', en:'ㄱ + ㅗ → go', audio:'고'},
        {ko:'한', en:'ㅎ + ㅏ + ㄴ → han', audio:'한'},
        {ko:'한국', en:'한 + 국 → hanguk', audio:'한국'}
      ]},

      { title: '10 Basic Vowels — Overview', body: 'Learn the ten basic Korean vowels one by one. The audio uses a syllable beginning with ㅇ so you hear the vowel sound itself.', examples: [
        {ko:'ㅏ', roman:'a', sound:'like the a in “father”', en:'아 → a', audio:'아'},
        {ko:'ㅑ', roman:'ya', sound:'y + ㅏ', en:'야 → ya', audio:'야'},
        {ko:'ㅓ', roman:'eo', sound:'open vowel; no exact English equivalent', en:'어 → eo', audio:'어'},
        {ko:'ㅕ', roman:'yeo', sound:'y + ㅓ', en:'여 → yeo', audio:'여'},
        {ko:'ㅗ', roman:'o', sound:'rounded o', en:'오 → o', audio:'오'},
        {ko:'ㅛ', roman:'yo', sound:'y + ㅗ', en:'요 → yo', audio:'요'},
        {ko:'ㅜ', roman:'u', sound:'oo as in “food”', en:'우 → u', audio:'우'},
        {ko:'ㅠ', roman:'yu', sound:'y + ㅜ', en:'유 → yu', audio:'유'},
        {ko:'ㅡ', roman:'eu', sound:'flat central vowel; no exact English equivalent', en:'으 → eu', audio:'으'},
        {ko:'ㅣ', roman:'i', sound:'ee as in “see”', en:'이 → i', audio:'이'}
      ]},
      { title: 'Basic Vowel 1 — ㅏ', body: 'ㅏ is pronounced a. Listen to 아 several times and repeat the vowel without adding an extra y sound.', examples:[{ko:'ㅏ', roman:'a', sound:'a', en:'아 — a', audio:'아'}] },
      { title: 'Basic Vowel 2 — ㅑ', body: 'ㅑ is pronounced ya. It is the y-version of ㅏ.', examples:[{ko:'ㅑ', roman:'ya', sound:'ya', en:'야 — ya', audio:'야'}] },
      { title: 'Basic Vowel 3 — ㅓ', body: 'ㅓ is romanized eo. It is not the same as English o; keep the sound open and relaxed.', examples:[{ko:'ㅓ', roman:'eo', sound:'Korean ㅓ', en:'어 — eo', audio:'어'}] },
      { title: 'Basic Vowel 4 — ㅕ', body: 'ㅕ is yeo, the y-version of ㅓ.', examples:[{ko:'ㅕ', roman:'yeo', sound:'yeo', en:'여 — yeo', audio:'여'}] },
      { title: 'Basic Vowel 5 — ㅗ', body: 'ㅗ is a rounded o sound. Keep the lips rounded and the tongue relatively high.', examples:[{ko:'ㅗ', roman:'o', sound:'rounded o', en:'오 — o', audio:'오'}] },
      { title: 'Basic Vowel 6 — ㅛ', body: 'ㅛ is yo, the y-version of ㅗ.', examples:[{ko:'ㅛ', roman:'yo', sound:'yo', en:'요 — yo', audio:'요'}] },
      { title: 'Basic Vowel 7 — ㅜ', body: 'ㅜ is a rounded u/oo sound, similar to oo in “food”.', examples:[{ko:'ㅜ', roman:'u', sound:'oo', en:'우 — u', audio:'우'}] },
      { title: 'Basic Vowel 8 — ㅠ', body: 'ㅠ is yu, the y-version of ㅜ.', examples:[{ko:'ㅠ', roman:'yu', sound:'yu', en:'유 — yu', audio:'유'}] },
      { title: 'Basic Vowel 9 — ㅡ', body: 'ㅡ is eu. It is produced with the lips relaxed and spread rather than rounded. It has no exact English equivalent.', examples:[{ko:'ㅡ', roman:'eu', sound:'Korean eu', en:'으 — eu', audio:'으'}] },
      { title: 'Basic Vowel 10 — ㅣ', body: 'ㅣ is i, similar to ee in “see”.', examples:[{ko:'ㅣ', roman:'i', sound:'ee', en:'이 — i', audio:'이'}] },

      { title: '11 Double / Compound Vowels — Overview', body: 'These are commonly called compound or double vowels. Learn each one separately and listen to a natural syllable containing the target sound.', examples: [
        {ko:'ㅐ', roman:'ae', sound:'open e', en:'애 → ae', audio:'애'},
        {ko:'ㅒ', roman:'yae', sound:'y + ㅐ', en:'얘 → yae', audio:'얘'},
        {ko:'ㅔ', roman:'e', sound:'e', en:'에 → e', audio:'에'},
        {ko:'ㅖ', roman:'ye', sound:'y + ㅔ', en:'예 → ye', audio:'예'},
        {ko:'ㅘ', roman:'wa', sound:'ㅗ + ㅏ', en:'와 → wa', audio:'와'},
        {ko:'ㅙ', roman:'wae', sound:'ㅗ + ㅐ', en:'왜 → wae', audio:'왜'},
        {ko:'ㅚ', roman:'oe', sound:'commonly pronounced close to we', en:'외 → oe / we', audio:'외'},
        {ko:'ㅝ', roman:'wo', sound:'ㅜ + ㅓ', en:'워 → wo', audio:'워'},
        {ko:'ㅞ', roman:'we', sound:'ㅜ + ㅔ', en:'웨 → we', audio:'웨'},
        {ko:'ㅟ', roman:'wi', sound:'ㅜ + ㅣ', en:'위 → wi', audio:'위'},
        {ko:'ㅢ', roman:'ui', sound:'ㅢ; pronunciation changes by position', en:'의 → ui', audio:'의'}
      ]},
      { title: 'Double Vowel 1 — ㅐ', body: 'ㅐ is ae. In modern Korean, ㅐ and ㅔ are often very similar in everyday speech, but learn the spelling distinction.', examples:[{ko:'ㅐ', roman:'ae', sound:'ae / open e', en:'애 — ae', audio:'애'}] },
      { title: 'Double Vowel 2 — ㅒ', body: 'ㅒ is yae, the y-version of ㅐ.', examples:[{ko:'ㅒ', roman:'yae', sound:'yae', en:'얘 — yae', audio:'얘'}] },
      { title: 'Double Vowel 3 — ㅔ', body: 'ㅔ is e. It is commonly very close to ㅐ in modern pronunciation.', examples:[{ko:'ㅔ', roman:'e', sound:'e', en:'에 — e', audio:'에'}] },
      { title: 'Double Vowel 4 — ㅖ', body: 'ㅖ is ye, the y-version of ㅔ.', examples:[{ko:'ㅖ', roman:'ye', sound:'ye', en:'예 — ye', audio:'예'}] },
      { title: 'Double Vowel 5 — ㅘ', body: 'ㅘ is wa, formed from ㅗ + ㅏ.', examples:[{ko:'ㅘ', roman:'wa', sound:'wa', en:'와 — wa', audio:'와'}] },
      { title: 'Double Vowel 6 — ㅙ', body: 'ㅙ is wae, formed from ㅗ + ㅐ.', examples:[{ko:'ㅙ', roman:'wae', sound:'wae', en:'왜 — wae', audio:'왜'}] },
      { title: 'Double Vowel 7 — ㅚ', body: 'ㅚ is written oe. In modern Korean it is commonly pronounced close to we.', examples:[{ko:'ㅚ', roman:'oe', sound:'often close to we', en:'외 — oe / we', audio:'외'}] },
      { title: 'Double Vowel 8 — ㅝ', body: 'ㅝ is wo, formed from ㅜ + ㅓ.', examples:[{ko:'ㅝ', roman:'wo', sound:'wo', en:'워 — wo', audio:'워'}] },
      { title: 'Double Vowel 9 — ㅞ', body: 'ㅞ is we, formed from ㅜ + ㅔ.', examples:[{ko:'ㅞ', roman:'we', sound:'we', en:'웨 — we', audio:'웨'}] },
      { title: 'Double Vowel 10 — ㅟ', body: 'ㅟ is wi, formed from ㅜ + ㅣ.', examples:[{ko:'ㅟ', roman:'wi', sound:'wi', en:'위 — wi', audio:'위'}] },
      { title: 'Double Vowel 11 — ㅢ', body: 'ㅢ is ui. Its actual pronunciation can change depending on where it occurs, so first learn the basic form 의.', examples:[{ko:'ㅢ', roman:'ui', sound:'ui', en:'의 — ui', audio:'의'}] },

      { title: '14 Basic Consonants — Overview', body: 'Learn the fourteen basic consonants one at a time. The example syllable shows the consonant in an initial position.', examples: [
        {ko:'ㄱ', roman:'g/k', sound:'between g and k depending on position', en:'가 → ga', audio:'가'},
        {ko:'ㄴ', roman:'n', sound:'n', en:'나 → na', audio:'나'},
        {ko:'ㄷ', roman:'d/t', sound:'between d and t depending on position', en:'다 → da', audio:'다'},
        {ko:'ㄹ', roman:'r/l', sound:'r-like initially; l-like finally', en:'라 → ra', audio:'라'},
        {ko:'ㅁ', roman:'m', sound:'m', en:'마 → ma', audio:'마'},
        {ko:'ㅂ', roman:'b/p', sound:'between b and p depending on position', en:'바 → ba', audio:'바'},
        {ko:'ㅅ', roman:'s', sound:'s; before ㅣ/y vowels it becomes more palatal', en:'사 → sa', audio:'사'},
        {ko:'ㅇ', roman:'silent / ng', sound:'silent initially; ng finally', en:'아 → initial silent; 응 → final ng', audio:'아'},
        {ko:'ㅈ', roman:'j', sound:'j', en:'자 → ja', audio:'자'},
        {ko:'ㅊ', roman:'ch', sound:'aspirated ch', en:'차 → cha', audio:'차'},
        {ko:'ㅋ', roman:'k', sound:'strongly aspirated k', en:'카 → ka', audio:'카'},
        {ko:'ㅌ', roman:'t', sound:'strongly aspirated t', en:'타 → ta', audio:'타'},
        {ko:'ㅍ', roman:'p', sound:'strongly aspirated p', en:'파 → pa', audio:'파'},
        {ko:'ㅎ', roman:'h', sound:'h', en:'하 → ha', audio:'하'}
      ]},
      { title: 'Basic Consonant 1 — ㄱ', body: 'ㄱ is between g and k. At the beginning of a word it is often heard closer to k than English g, while between voiced sounds it can sound more g-like.', examples:[{ko:'ㄱ', roman:'g/k', sound:'g/k', en:'가 — ga', audio:'가'}] },
      { title: 'Basic Consonant 2 — ㄴ', body: 'ㄴ is a clear n sound.', examples:[{ko:'ㄴ', roman:'n', sound:'n', en:'나 — na', audio:'나'}] },
      { title: 'Basic Consonant 3 — ㄷ', body: 'ㄷ is between d and t. Its sound depends on position and surrounding sounds.', examples:[{ko:'ㄷ', roman:'d/t', sound:'d/t', en:'다 — da', audio:'다'}] },
      { title: 'Basic Consonant 4 — ㄹ', body: 'ㄹ is a flap/r-like sound in initial positions and l-like in final position. It is not exactly English r or l.', examples:[{ko:'ㄹ', roman:'r/l', sound:'Korean flap / l', en:'라 — ra', audio:'라'},{ko:'말', roman:'mal', sound:'final l', en:'말 — mal', audio:'말'}] },
      { title: 'Basic Consonant 5 — ㅁ', body: 'ㅁ is a clear m sound.', examples:[{ko:'ㅁ', roman:'m', sound:'m', en:'마 — ma', audio:'마'}] },
      { title: 'Basic Consonant 6 — ㅂ', body: 'ㅂ is between b and p. In the initial position it is less voiced than English b.', examples:[{ko:'ㅂ', roman:'b/p', sound:'b/p', en:'바 — ba', audio:'바'}] },
      { title: 'Basic Consonant 7 — ㅅ', body: 'ㅅ is s. Before ㅣ and y-type vowels it sounds more like a soft sh.', examples:[{ko:'ㅅ', roman:'s', sound:'s', en:'사 — sa', audio:'사'},{ko:'시', roman:'si', sound:'soft shi-like sound', en:'시 — si', audio:'시'}] },
      { title: 'Basic Consonant 8 — ㅇ', body: 'ㅇ is silent at the beginning of a syllable and represents ng at the end.', examples:[{ko:'아', roman:'a', sound:'ㅇ is silent initially', en:'아 — a', audio:'아'},{ko:'응', roman:'eung', sound:'ng at the end', en:'응 — eung', audio:'응'}] },
      { title: 'Basic Consonant 9 — ㅈ', body: 'ㅈ is a j-like sound.', examples:[{ko:'ㅈ', roman:'j', sound:'j', en:'자 — ja', audio:'자'}] },
      { title: 'Basic Consonant 10 — ㅊ', body: 'ㅊ is an aspirated ch sound with noticeably more breath than ㅈ.', examples:[{ko:'ㅊ', roman:'ch', sound:'aspirated ch', en:'차 — cha', audio:'차'}] },
      { title: 'Basic Consonant 11 — ㅋ', body: 'ㅋ is an aspirated k sound. It has more airflow than ㄱ.', examples:[{ko:'ㅋ', roman:'k', sound:'aspirated k', en:'카 — ka', audio:'카'}] },
      { title: 'Basic Consonant 12 — ㅌ', body: 'ㅌ is an aspirated t sound. It has more airflow than ㄷ.', examples:[{ko:'ㅌ', roman:'t', sound:'aspirated t', en:'타 — ta', audio:'타'}] },
      { title: 'Basic Consonant 13 — ㅍ', body: 'ㅍ is an aspirated p sound. It has more airflow than ㅂ.', examples:[{ko:'ㅍ', roman:'p', sound:'aspirated p', en:'파 — pa', audio:'파'}] },
      { title: 'Basic Consonant 14 — ㅎ', body: 'ㅎ is an h sound. Its strength can change around certain vowels and consonants.', examples:[{ko:'ㅎ', roman:'h', sound:'h', en:'하 — ha', audio:'하'}] },

      { title: '5 Tense / Double Consonants — Overview', body: 'Tense consonants are written with doubled letters. They are produced with a tighter, more constricted articulation and little aspiration.', examples: [
        {ko:'ㄲ', roman:'kk', sound:'tense ㄱ', en:'까 → kka', audio:'까'},
        {ko:'ㄸ', roman:'tt', sound:'tense ㄷ', en:'따 → tta', audio:'따'},
        {ko:'ㅃ', roman:'pp', sound:'tense ㅂ', en:'빠 → ppa', audio:'빠'},
        {ko:'ㅆ', roman:'ss', sound:'tense ㅅ', en:'싸 → ssa', audio:'싸'},
        {ko:'ㅉ', roman:'jj', sound:'tense ㅈ', en:'짜 → jja', audio:'짜'}
      ]},
      { title: 'Tense Consonant 1 — ㄲ', body: 'ㄲ is the tense counterpart of ㄱ. Make the articulation tight and avoid a strong burst of air.', examples:[{ko:'ㄲ', roman:'kk', sound:'tense k', en:'까 — kka', audio:'까'}] },
      { title: 'Tense Consonant 2 — ㄸ', body: 'ㄸ is the tense counterpart of ㄷ. Keep the sound tight and crisp.', examples:[{ko:'ㄸ', roman:'tt', sound:'tense t', en:'따 — tta', audio:'따'}] },
      { title: 'Tense Consonant 3 — ㅃ', body: 'ㅃ is the tense counterpart of ㅂ. Use a tight lip closure without a strong aspirated puff.', examples:[{ko:'ㅃ', roman:'pp', sound:'tense p', en:'빠 — ppa', audio:'빠'}] },
      { title: 'Tense Consonant 4 — ㅆ', body: 'ㅆ is the tense counterpart of ㅅ. It is stronger and tighter than ordinary ㅅ.', examples:[{ko:'ㅆ', roman:'ss', sound:'tense s', en:'싸 — ssa', audio:'싸'}] },
      { title: 'Tense Consonant 5 — ㅉ', body: 'ㅉ is the tense counterpart of ㅈ. Keep the articulation tight with little aspiration.', examples:[{ko:'ㅉ', roman:'jj', sound:'tense j', en:'짜 — jja', audio:'짜'}] },

      { title: 'Syllable Block Reading Practice', body: 'Now combine the letters you learned. Read each block from left to right/top to bottom according to its layout, then listen and repeat.', examples: [
        {ko:'가', en:'ga', audio:'가'}, {ko:'나', en:'na', audio:'나'}, {ko:'다', en:'da', audio:'다'}, {ko:'마', en:'ma', audio:'마'},
        {ko:'한', en:'han', audio:'한'}, {ko:'밥', en:'bap', audio:'밥'}, {ko:'학교', en:'school', audio:'학교'}, {ko:'한국어', en:'Korean language', audio:'한국어'}
      ]},
      { title: 'Phase 1 Review & Mastery', body: 'Review all 10 basic vowels, 11 compound vowels, 14 basic consonants, 5 tense consonants, and syllable-block construction. The next version can turn this review into an interactive mastery test.', examples: [
        {ko:'가나다라', en:'ga-na-da-ra', audio:'가나다라'},
        {ko:'아야어여', en:'basic vowel practice', audio:'아야어여'},
        {ko:'오요우유', en:'basic vowel practice', audio:'오요우유'},
        {ko:'까따빠싸짜', en:'tense consonant practice', audio:'까따빠싸짜'}
      ]}
    ]
  },

  {
    id: 'phase-2', number: 2, title: '받침 & 발음', subtitle: 'Batchim & Korean Pronunciation', icon: '받', color: 'purple',
    description: 'Master 받침, 겹받침, and the major Korean pronunciation phenomena step by step with examples, audio, listening, and shadowing practice.',
    lessons: [
      { title: '받침 Introduction', body: '받침 is the consonant placed at the bottom of a Korean syllable block. Learn how the final consonant position works and why Korean final consonants have a limited set of representative sounds.', examples: [
        {ko:'밥', en:'rice / meal', audio:'밥'},
        {ko:'집', en:'house', audio:'집'},
        {ko:'책', en:'book', audio:'책'}
      ]},
      { title: '7 Representative Batchim Sounds', body: 'Although many consonants can appear as 받침, their final pronunciation is reduced to seven representative sounds: ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, and ㅇ.', examples: [
        {ko:'ㄱ → [ㄱ]', en:'박 → [박]', audio:'박'},
        {ko:'ㄴ → [ㄴ]', en:'산 → [산]', audio:'산'},
        {ko:'ㄷ → [ㄷ]', en:'옷 → [옫]', audio:'옷'},
        {ko:'ㄹ → [ㄹ]', en:'달 → [달]', audio:'달'},
        {ko:'ㅁ → [ㅁ]', en:'밤 → [밤]', audio:'밤'},
        {ko:'ㅂ → [ㅂ]', en:'밥 → [밥]', audio:'밥'},
        {ko:'ㅇ → [ㅇ]', en:'공 → [공]', audio:'공'}
      ]},
      { title: 'Basic Batchim Reading Practice', body: 'Practice reading words with final consonants. Focus on stopping the final sound cleanly instead of adding an extra vowel.', examples: [
        {ko:'국', en:'soup / country', audio:'국'},
        {ko:'눈', en:'eye / snow', audio:'눈'},
        {ko:'옷', en:'clothes', audio:'옷'},
        {ko:'달', en:'moon / month', audio:'달'},
        {ko:'밤', en:'night', audio:'밤'},
        {ko:'밥', en:'rice / meal', audio:'밥'},
        {ko:'공', en:'ball', audio:'공'}
      ]},
      { title: '연음 — Linking to the Next Syllable', body: 'When a batchim is followed by a syllable beginning with ㅇ, the final consonant can link to the next syllable and be pronounced as its initial consonant.', examples: [
        {ko:'먹어요', en:'eat / eats', audio:'먹어요'},
        {ko:'한국어', en:'Korean language', audio:'한국어'},
        {ko:'집에', en:'to / at home', audio:'집에'},
        {ko:'옷이', en:'clothes + subject marker', audio:'옷이'}
      ]},
      { title: '겹받침 Introduction', body: '겹받침 means two consonants are written together in the final position of a syllable. Learn the common combinations and remember that pronunciation depends on what follows.', examples: [
        {ko:'앉다', en:'to sit', audio:'앉다'},
        {ko:'읽다', en:'to read', audio:'읽다'},
        {ko:'없다', en:'to not exist', audio:'없다'},
        {ko:'삶', en:'life', audio:'삶'}
      ]},
      { title: '겹받침 — First Consonant Patterns', body: 'For several 겹받침 combinations, the first consonant is normally heard when the syllable ends before another consonant. This includes patterns such as ㄳ, ㄵ, ㄶ, ㄼ, ㄽ, ㄾ, ㅀ, and ㅄ.', examples: [
        {ko:'넋', en:'spirit', audio:'넋'},
        {ko:'앉다', en:'to sit', audio:'앉다'},
        {ko:'많다', en:'to be many', audio:'많다'},
        {ko:'값', en:'price', audio:'값'}
      ]},
      { title: '겹받침 — ㄺ / ㄻ / ㄿ Special Patterns', body: 'Pay special attention to ㄺ, ㄻ, and ㄿ. Their pronunciation changes depending on the following consonant and word environment, so learn them through both the rule and real words.', examples: [
        {ko:'읽다', en:'to read', audio:'읽다'},
        {ko:'읽어요', en:'read (polite)', audio:'읽어요'},
        {ko:'젊다', en:'to be young', audio:'젊다'},
        {ko:'읊다', en:'to recite', audio:'읊다'}
      ]},
      { title: '겹받침 + ㅇ', body: 'When a 겹받침 is followed by ㅇ, the pronunciation can split: one consonant remains as the final sound and the other links to the next syllable. Learn the common combinations carefully instead of applying one rule to every 겹받침.', examples: [
        {ko:'앉아요', en:'sit (polite)', audio:'앉아요'},
        {ko:'읽어요', en:'read (polite)', audio:'읽어요'},
        {ko:'없어요', en:'does not exist / have', audio:'없어요'},
        {ko:'젊어요', en:'is young (polite)', audio:'젊어요'}
      ]},
      { title: 'Soft / Linking Pronunciation Phenomenon', body: 'This phenomenon covers pronunciation changes that happen when final consonants meet the next syllable, especially 연음 and changes caused by the following vowel. Always listen to the whole word rather than reading each block separately.', examples: [
        {ko:'꽃이', en:'flower + subject marker', audio:'꽃이'},
        {ko:'옷을', en:'clothes + object marker', audio:'옷을'},
        {ko:'같아요', en:'is similar / same', audio:'같아요'}
      ]},
      { title: 'ㄷ / ㅌ + 이 → ㅈ / ㅊ', body: 'When a final ㄷ or ㅌ meets 이, the pronunciation can change through palatalization: ㄷ + 이 → 지 and ㅌ + 이 → 치.', examples: [
        {ko:'굳이', en:'deliberately / necessarily', audio:'굳이'},
        {ko:'같이', en:'together', audio:'같이'},
        {ko:'붙이다', en:'to attach', audio:'붙이다'}
      ]},
      { title: 'ㅎ Deletion Before a Vowel', body: 'In common pronunciation environments, final ㅎ can weaken or disappear before a vowel. Learn the sound rather than pronouncing the written ㅎ strongly.', examples: [
        {ko:'좋아요', en:'is good / I like it', audio:'좋아요'},
        {ko:'좋아해요', en:'like', audio:'좋아해요'},
        {ko:'싫어요', en:'do not like / dislike', audio:'싫어요'}
      ]},
      { title: '거센소리 — Aspirated Phenomenon', body: 'ㅎ can combine with neighboring consonants and produce an aspirated sound. The important changes are ㄱ + ㅎ → ㅋ, ㄷ + ㅎ → ㅌ, ㅂ + ㅎ → ㅍ, and ㅈ + ㅎ → ㅊ.', examples: [
        {ko:'축하해요', en:'congratulations', audio:'축하해요'},
        {ko:'좋다', en:'to be good', audio:'좋다'},
        {ko:'많다', en:'to be many', audio:'많다'},
        {ko:'입학', en:'entrance to school', audio:'입학'},
        {ko:'맞히다', en:'to get correct', audio:'맞히다'}
      ]},
      { title: '겹받침 + ㅎ', body: 'When 겹받침 and ㅎ meet, the resulting pronunciation follows the aspirated/weakening environment. Learn representative words and listen carefully to the changed consonant.', examples: [
        {ko:'많다', en:'to be many', audio:'많다'},
        {ko:'않다', en:'to not do / be', audio:'않다'},
        {ko:'닳다', en:'to wear away', audio:'닳다'}
      ]},
      { title: '비음화 — Nasalization', body: 'When a final consonant meets the nasal consonants ㄴ or ㅁ, the final sound can change into a nasal sound. This makes pronunciation smoother and is very common in everyday Korean.', examples: [
        {ko:'국민', en:'people / nation', audio:'국민'},
        {ko:'먹는', en:'eating', audio:'먹는'},
        {ko:'앞문', en:'front door', audio:'앞문'}
      ]},
      { title: 'ㄱ / ㅋ / ㄲ → ㅇ Before ㄴ / ㅁ', body: 'When a final ㄱ-family sound is followed by ㄴ or ㅁ, it changes to the nasal ㅇ sound.', examples: [
        {ko:'국민', en:'people / nation', audio:'국민'},
        {ko:'박물관', en:'museum', audio:'박물관'},
        {ko:'한국말', en:'Korean language (spoken)', audio:'한국말'}
      ]},
      { title: 'ㄷ-Series → ㄴ Before ㄴ / ㅁ', body: 'Final ㄷ-family sounds such as ㄷ, ㅌ, ㅅ, ㅆ, ㅈ, ㅊ, and ㅎ can change to ㄴ before a nasal ㄴ or ㅁ.', examples: [
        {ko:'믿는', en:'believing', audio:'믿는'},
        {ko:'있는', en:'existing / having', audio:'있는'},
        {ko:'꽃망울', en:'flower bud', audio:'꽃망울'}
      ]},
      { title: 'ㅂ / ㅍ → ㅁ Before ㄴ / ㅁ', body: 'Final ㅂ-family sounds become the nasal ㅁ before ㄴ or ㅁ.', examples: [
        {ko:'입니다', en:'is / am / are (formal)', audio:'입니다'},
        {ko:'합니다', en:'do (formal)', audio:'합니다'},
        {ko:'앞문', en:'front door', audio:'앞문'}
      ]},
      { title: 'ㅁ / ㅇ + ㄹ → ㅁ / ㅇ + ㄴ', body: 'When final ㅁ or ㅇ is followed by ㄹ, the ㄹ changes to ㄴ. This is an important nasal/liquid interaction and must be learned separately.', examples: [
        {ko:'심리', en:'psychology', audio:'심리'},
        {ko:'음료', en:'beverage', audio:'음료'},
        {ko:'대통령', en:'president', audio:'대통령'}
      ]},
      { title: '유음화 — Liquidization', body: '유음화 happens when ㄴ and ㄹ meet. The two consonants become the liquid sound ㄹㄹ, producing a double ㄹ pronunciation.', examples: [
        {ko:'설날', en:'Lunar New Year', audio:'설날'},
        {ko:'신라', en:'Silla', audio:'신라'},
        {ko:'난로', en:'heater', audio:'난로'},
        {ko:'연락', en:'contact', audio:'연락'}
      ]},
      { title: 'ㄹ + ㄴ → ㄹ + ㄹ', body: 'When ㄹ is followed by ㄴ, the ㄴ changes to ㄹ. Read the two consonants as a smooth ㄹㄹ sequence.', examples: [
        {ko:'설날', en:'Lunar New Year', audio:'설날'},
        {ko:'칼날', en:'blade / edge', audio:'칼날'},
        {ko:'일 년', en:'one year', audio:'일 년'}
      ]},
      { title: 'ㄴ + ㄹ → ㄹ + ㄹ', body: 'When ㄴ is followed by ㄹ, the ㄴ changes to ㄹ as well. Both directions result in a ㄹㄹ sound.', examples: [
        {ko:'신라', en:'Silla', audio:'신라'},
        {ko:'난로', en:'heater', audio:'난로'},
        {ko:'연락', en:'contact', audio:'연락'}
      ]},
      { title: '된소리 — Fortis Phenomenon', body: 'A following plain consonant can become a tense consonant after certain final consonant environments. The main tense sounds are ㄲ, ㄸ, ㅃ, ㅆ, and ㅉ.', examples: [
        {ko:'학교', en:'school', audio:'학교'},
        {ko:'식당', en:'restaurant', audio:'식당'},
        {ko:'국밥', en:'gukbap', audio:'국밥'}
      ]},
      { title: 'Batchim + Following ㄱ → ㄲ', body: 'In common fortis environments, a following ㄱ can become tense ㄲ. Listen for the stronger, tighter consonant.', examples: [
        {ko:'학교', en:'school', audio:'학교'},
        {ko:'식당', en:'restaurant', audio:'식당'},
        {ko:'국가', en:'nation / country', audio:'국가'}
      ]},
      { title: 'Batchim + Following ㄷ → ㄸ', body: 'A following ㄷ can become tense ㄸ after certain final consonant environments.', examples: [
        {ko:'받다', en:'to receive', audio:'받다'},
        {ko:'있다', en:'to exist / have', audio:'있다'},
        {ko:'국도', en:'national road', audio:'국도'}
      ]},
      { title: 'Batchim + Following ㅂ → ㅃ', body: 'A following ㅂ can become tense ㅃ after certain final consonant environments.', examples: [
        {ko:'잡다', en:'to catch / hold', audio:'잡다'},
        {ko:'값비싼', en:'expensive', audio:'값비싼'}
      ]},
      { title: 'Batchim + Following ㅅ → ㅆ', body: 'A following ㅅ can become tense ㅆ after certain final consonant environments.', examples: [
        {ko:'학생', en:'student', audio:'학생'},
        {ko:'옷소매', en:'sleeve', audio:'옷소매'}
      ]},
      { title: 'Batchim + Following ㅈ → ㅉ', body: 'A following ㅈ can become tense ㅉ after certain final consonant environments.', examples: [
        {ko:'국자', en:'ladle', audio:'국자'},
        {ko:'문법적', en:'grammatical', audio:'문법적'}
      ]},
      { title: 'ㄹ + Following Consonant Fortis', body: 'Some words with final ㄹ followed by a plain consonant show fortis pronunciation. Learn these as pronunciation patterns and confirm them through audio.', examples: [
        {ko:'갈비', en:'ribs', audio:'갈비'},
        {ko:'발달', en:'development', audio:'발달'},
        {ko:'결과', en:'result', audio:'결과'}
      ]},
      { title: 'Mixed Pronunciation Practice', body: 'Combine the rules. Identify the written batchim, predict the sound change, then listen and repeat. Do not rush: accurate pronunciation is more important than speed.', examples: [
        {ko:'국민', en:'people / nation', audio:'국민'},
        {ko:'설날', en:'Lunar New Year', audio:'설날'},
        {ko:'학교', en:'school', audio:'학교'},
        {ko:'같이', en:'together', audio:'같이'},
        {ko:'음료', en:'beverage', audio:'음료'}
      ]},
      { title: 'Listening & Shadowing Practice', body: 'Listen to each word or sentence, repeat it aloud, and compare your pronunciation. Focus on the changed sound rather than the spelling.', examples: [
        {ko:'국민입니다.', en:'It is the people / citizens. (formal)', audio:'국민입니다.'},
        {ko:'설날에 만나요.', en:'See you on Lunar New Year.', audio:'설날에 만나요.'},
        {ko:'학교에서 공부해요.', en:'I study at school.', audio:'학교에서 공부해요.'},
        {ko:'같이 먹어요.', en:'Let’s eat together.', audio:'같이 먹어요.'}
      ]},
      { title: 'Phase 2 Mastery Review', body: 'Review all major batchim and pronunciation phenomena. For each item, identify the rule, predict the pronunciation, listen, and then say it yourself.', examples: [
        {ko:'박물관', en:'museum — identify the nasalization pattern.', audio:'박물관'},
        {ko:'설날', en:'Lunar New Year — identify 유음화.', audio:'설날'},
        {ko:'음료', en:'beverage — identify ㅁ + ㄹ → ㅁ + ㄴ.', audio:'음료'},
        {ko:'같이', en:'together — identify ㄷ/ㅌ + 이 palatalization.', audio:'같이'},
        {ko:'학교', en:'school — identify the fortis environment.', audio:'학교'}
      ]},
      { title: 'Phase 2 Mastery Test', body: 'Final Phase 2 test. Read the written form, choose the correct pronunciation rule, listen to the answer, and practice saying it. Master these rules before moving to 조사.', examples: [
        {ko:'국민', en:'Which pronunciation phenomenon applies?', audio:'국민'},
        {ko:'설날', en:'Which pronunciation phenomenon applies?', audio:'설날'},
        {ko:'심리', en:'What happens to ㄹ after ㅁ?', audio:'심리'},
        {ko:'신라', en:'What happens when ㄴ meets ㄹ?', audio:'신라'},
        {ko:'같이', en:'What happens to ㅌ before 이?', audio:'같이'},
        {ko:'입학', en:'Which aspirated change occurs?', audio:'입학'}
      ]}
    ]
  },
  {
    id: 'phase-3', number: 3, title: '조사', subtitle: 'Core Korean Particles', icon: '조', color: 'blue',
    description: 'Learn Korean particles step by step: what each marker means, when to use it, how it attaches to words, and how similar particles differ in real sentences. Every lesson includes clear examples and Korean audio.',
    lessons: [
      { title: 'What Are 조사?', body: '조사 are particles attached to nouns and noun phrases. They show the role or relationship of a word in a sentence. Korean often uses particles where English relies more on word order. First learn what the particle does, then practice choosing it from context.', examples: [
        {ko:'저는 학생이에요.', en:'I am a student. — 는 marks the topic.', audio:'저는 학생이에요.'},
        {ko:'밥을 먹어요.', en:'I eat rice. — 을 marks the object.', audio:'밥을 먹어요.'}
      ]},
      { title: '은 / 는 — Topic Marker', body: '은/는 marks the topic: the person, thing, or idea the sentence is talking about. It can introduce the topic or contrast it with something else. It does not simply mean “is” or “as for”; its meaning depends on context.', examples: [
        {ko:'저는 학생이에요.', en:'As for me, I am a student.', audio:'저는 학생이에요.'},
        {ko:'오늘은 바빠요.', en:'As for today, it is busy / I am busy today.', audio:'오늘은 바빠요.'}
      ]},
      { title: '은 / 는 — Choosing 은 or 는', body: 'Use 은 after a noun ending in a consonant and 는 after a noun ending in a vowel. This is a sound-based form choice: consonant + 은, vowel + 는.', examples: [
        {ko:'학생은', en:'student + topic marker', audio:'학생은'},
        {ko:'저는', en:'I + topic marker', audio:'저는'},
        {ko:'한국은', en:'Korea + topic marker', audio:'한국은'},
        {ko:'학교는', en:'school + topic marker', audio:'학교는'}
      ]},
      { title: '이 / 가 — Subject Marker', body: '이/가 marks the grammatical subject. It is especially useful when introducing new information, identifying who or what performs an action, or answering a question such as “who?” or “what?”.', examples: [
        {ko:'친구가 와요.', en:'A friend is coming.', audio:'친구가 와요.'},
        {ko:'비가 와요.', en:'It is raining. Literally, rain is coming.', audio:'비가 와요.'}
      ]},
      { title: '이 / 가 — Choosing 이 or 가', body: 'Use 이 after a noun ending in a consonant and 가 after a noun ending in a vowel. The two forms have the same basic subject-marking function.', examples: [
        {ko:'학생이 와요.', en:'The student comes / is coming.', audio:'학생이 와요.'},
        {ko:'친구가 와요.', en:'The friend comes / is coming.', audio:'친구가 와요.'}
      ]},
      { title: '은 / 는 vs 이 / 가', body: 'Both can appear with a subject-like noun, but they do different jobs. 은/는 sets the topic or contrast; 이/가 identifies the subject and often presents new or focused information. Do not memorize them as simple English equivalents.', examples: [
        {ko:'저는 학생이에요.', en:'As for me, I am a student.', audio:'저는 학생이에요.'},
        {ko:'제가 학생이에요.', en:'I am the one who is the student. — subject focus.', audio:'제가 학생이에요.'},
        {ko:'오늘은 비가 와요.', en:'As for today, it rains.', audio:'오늘은 비가 와요.'}
      ]},
      { title: '을 / 를 — Object Marker', body: '을/를 marks the noun receiving or being affected by the action of the verb. Ask “what?” or “whom?” the action is done to when identifying the object.', examples: [
        {ko:'밥을 먹어요.', en:'I eat rice / a meal.', audio:'밥을 먹어요.'},
        {ko:'한국어를 공부해요.', en:'I study Korean.', audio:'한국어를 공부해요.'},
        {ko:'친구를 만나요.', en:'I meet a friend.', audio:'친구를 만나요.'}
      ]},
      { title: '을 / 를 — Choosing 을 or 를', body: 'Use 을 after a noun ending in a consonant and 를 after a noun ending in a vowel.', examples: [
        {ko:'책을 읽어요.', en:'I read a book.', audio:'책을 읽어요.'},
        {ko:'커피를 마셔요.', en:'I drink coffee.', audio:'커피를 마셔요.'}
      ]},
      { title: '에 — Destination', body: 'Use 에 after a destination or endpoint with movement verbs such as 가다, 오다, and 다니다. Think of 에 here as pointing toward the destination.', examples: [
        {ko:'학교에 가요.', en:'I go to school.', audio:'학교에 가요.'},
        {ko:'집에 와요.', en:'I come home / to the house.', audio:'집에 와요.'},
        {ko:'회사에 다녀요.', en:'I go to / commute to work.', audio:'회사에 다녀요.'}
      ]},
      { title: '에 — Time', body: 'Use 에 with a specific point in time such as a clock time, day, month, or year. It marks when an event happens. Some time words commonly omit 에, so learn the common expressions as phrases.', examples: [
        {ko:'세 시에 만나요.', en:'We meet at three o’clock.', audio:'세 시에 만나요.'},
        {ko:'월요일에 가요.', en:'I go on Monday.', audio:'월요일에 가요.'},
        {ko:'8월 15일에 만나요.', en:'We meet on August 15.', audio:'8월 15일에 만나요.'}
      ]},
      { title: '에 — Location of Existence', body: 'Use 에 with 있다/없다 to show where a person or thing exists. This is different from 에서, which marks the place where an action happens.', examples: [
        {ko:'학교에 있어요.', en:'I am at school.', audio:'학교에 있어요.'},
        {ko:'책이 책상 위에 있어요.', en:'The book is on the desk.', audio:'책이 책상 위에 있어요.'}
      ]},
      { title: '에서 — Place of Action', body: 'Use 에서 to mark the place where an action occurs. If a verb describes something you actively do in a place, 에서 is usually the correct particle.', examples: [
        {ko:'학교에서 공부해요.', en:'I study at school.', audio:'학교에서 공부해요.'},
        {ko:'집에서 밥을 먹어요.', en:'I eat at home.', audio:'집에서 밥을 먹어요.'},
        {ko:'도서관에서 책을 읽어요.', en:'I read a book at the library.', audio:'도서관에서 책을 읽어요.'}
      ]},
      { title: '에 vs 에서', body: 'Use 에 for a destination, a point in time, or the location where someone/something exists with 있다/없다. Use 에서 for the location where an action takes place. Compare the verb, not just the English word “at”.', examples: [
        {ko:'학교에 있어요.', en:'I am at school. — existence → 에', audio:'학교에 있어요.'},
        {ko:'학교에서 공부해요.', en:'I study at school. — action → 에서', audio:'학교에서 공부해요.'},
        {ko:'학교에 가요.', en:'I go to school. — destination → 에', audio:'학교에 가요.'}
      ]},
      { title: '에게 — Recipient: Person or Animal', body: '에게 marks the person or animal who receives something or toward whom an action is directed. It is used with a recipient/target that is normally a person or animal. Think “to someone / for someone” when the verb involves giving, sending, asking, telling, or speaking to that recipient.', examples: [
        {ko:'친구에게 선물을 줘요.', en:'I give a gift to a friend.', audio:'친구에게 선물을 줘요.'},
        {ko:'선생님에게 물어봐요.', en:'I ask the teacher.', audio:'선생님에게 물어봐요.'},
        {ko:'강아지에게 물을 줘요.', en:'I give water to the puppy.', audio:'강아지에게 물을 줘요.'},
        {ko:'동생에게 전화해요.', en:'I call my younger sibling.', audio:'동생에게 전화해요.'}
      ]},
      { title: '에게 — How It Differs from 에', body: '에게 identifies a recipient or target, especially a person or animal. 에 has other functions such as destination, time, and location of existence. Compare 학교에 가요 with 친구에게 줘요: the first points to a destination; the second points to a recipient.', examples: [
        {ko:'학교에 가요.', en:'I go to school. — destination.', audio:'학교에 가요.'},
        {ko:'친구에게 가요.', en:'I go to my friend. — target/person.', audio:'친구에게 가요.'},
        {ko:'친구에게 선물을 줘요.', en:'I give a gift to my friend. — recipient.', audio:'친구에게 선물을 줘요.'}
      ]},
      { title: '한테 — Spoken Alternative to 에게', body: '한테 also marks a recipient or target, especially a person or animal. It is common in everyday conversation and is generally more conversational than 에게. Learn both, but recognize that they often express the same basic relationship.', examples: [
        {ko:'친구한테 전화해요.', en:'I call my friend.', audio:'친구한테 전화해요.'},
        {ko:'엄마한테 물어봐요.', en:'I ask my mother.', audio:'엄마한테 물어봐요.'},
        {ko:'강아지한테 밥을 줘요.', en:'I give food to the puppy.', audio:'강아지한테 밥을 줘요.'}
      ]},
      { title: '의 — Possession / Relationship', body: '의 connects two nouns and shows possession, belonging, or a relationship. It is similar to “of” or the possessive “’s”. In natural speech, 의 can have reduced pronunciation, so learn the written form and listen to examples.', examples: [
        {ko:'친구의 책', en:'my friend’s book', audio:'친구의 책'},
        {ko:'한국의 음식', en:'Korean food / food of Korea', audio:'한국의 음식'},
        {ko:'저의 이름', en:'my name', audio:'저의 이름'}
      ]},
      { title: '와 / 과 — And / With', body: '와/과 connects nouns. Use 와 after a vowel and 과 after a consonant. It can mean “and” between nouns and can also mean “with” in certain sentence patterns.', examples: [
        {ko:'친구와 가족', en:'friends and family', audio:'친구와 가족'},
        {ko:'선생님과 학생', en:'teacher and student', audio:'선생님과 학생'},
        {ko:'친구와 같이 가요.', en:'I go together with a friend.', audio:'친구와 같이 가요.'}
      ]},
      { title: '하고 — And / With', body: '하고 connects nouns and is very common in conversation. It can mean “and” or “with” depending on the sentence. Unlike 와/과, it does not change form based on the final sound of the noun.', examples: [
        {ko:'친구하고 밥을 먹어요.', en:'I eat with a friend.', audio:'친구하고 밥을 먹어요.'},
        {ko:'사과하고 바나나', en:'apples and bananas', audio:'사과하고 바나나'}
      ]},
      { title: '(이)랑 — Conversational And / With', body: '이랑/랑 is another conversational way to connect nouns or express “with”. Use 이랑 after a consonant and 랑 after a vowel.', examples: [
        {ko:'친구랑 영화 봐요.', en:'I watch a movie with a friend.', audio:'친구랑 영화 봐요.'},
        {ko:'밥이랑 김치', en:'rice and kimchi', audio:'밥이랑 김치'}
      ]},
      { title: '도 — Also / Too', body: '도 means “also”, “too”, or “as well”. It can replace another particle in many simple sentences. Focus on the meaning added by 도 rather than translating it word-for-word.', examples: [
        {ko:'저도 학생이에요.', en:'I am also a student.', audio:'저도 학생이에요.'},
        {ko:'밥도 먹어요.', en:'I also eat rice.', audio:'밥도 먹어요.'},
        {ko:'학교에도 가요.', en:'I also go to school. — 도 combines with 에.', audio:'학교에도 가요.'}
      ]},
      { title: '만 — Only', body: '만 means “only” or “just”. It can attach directly to a noun and can replace another particle in many simple constructions.', examples: [
        {ko:'저만 가요.', en:'Only I go.', audio:'저만 가요.'},
        {ko:'물만 마셔요.', en:'I drink only water.', audio:'물만 마셔요.'},
        {ko:'오늘만 쉬어요.', en:'I rest only today.', audio:'오늘만 쉬어요.'}
      ]},
      { title: 'Particle Combinations', body: 'Some particles can combine, such as 에 + 도 → 에도 and 에 + 만 → 에만. Learn these as meaningful combinations instead of treating them as unrelated new particles.', examples: [
        {ko:'학교에도 가요.', en:'I also go to school.', audio:'학교에도 가요.'},
        {ko:'집에서만 공부해요.', en:'I study only at home.', audio:'집에서만 공부해요.'},
        {ko:'친구에게도 말해요.', en:'I also tell my friend.', audio:'친구에게도 말해요.'}
      ]},
      { title: 'Particle Review — Choose by Function', body: 'Before choosing a particle, identify the noun’s role: topic, subject, object, destination, time, existence location, action location, recipient, possession, connection, addition, or limitation. This prevents memorizing particles as isolated translations.', examples: [
        {ko:'저는 학교에서 한국어를 공부해요.', en:'Topic + action place + object: I study Korean at school.', audio:'저는 학교에서 한국어를 공부해요.'},
        {ko:'친구에게 책을 줘요.', en:'Recipient + object: I give a book to my friend.', audio:'친구에게 책을 줘요.'},
        {ko:'저도 친구랑 가요.', en:'Also + with: I also go with a friend.', audio:'저도 친구랑 가요.'}
      ]},
      { title: 'Phase 3 Sentence Building', body: 'Build complete sentences by identifying each noun’s role and attaching the correct particle. Read the sentence aloud, listen to the Korean audio, and repeat it.', examples: [
        {ko:'저는 친구에게 선물을 줘요.', en:'I give a gift to my friend.', audio:'저는 친구에게 선물을 줘요.'},
        {ko:'학생이 도서관에서 책을 읽어요.', en:'A student reads a book at the library.', audio:'학생이 도서관에서 책을 읽어요.'},
        {ko:'저는 학교에 가요.', en:'I go to school.', audio:'저는 학교에 가요.'},
        {ko:'저는 학교에서 공부해요.', en:'I study at school.', audio:'저는 학교에서 공부해요.'}
      ]},
      { title: 'Phase 3 Mastery Practice', body: 'Final review. For every sentence, first identify the particle and explain its function, then listen and repeat. Pay special attention to 은/는 vs 이/가, 에 vs 에서, and 에게 for a person or animal recipient.', examples: [
        {ko:'저는 학생이에요.', en:'Identify the topic marker.', audio:'저는 학생이에요.'},
        {ko:'친구가 와요.', en:'Identify the subject marker.', audio:'친구가 와요.'},
        {ko:'한국어를 공부해요.', en:'Identify the object marker.', audio:'한국어를 공부해요.'},
        {ko:'학교에 가요.', en:'Identify destination 에.', audio:'학교에 가요.'},
        {ko:'학교에서 공부해요.', en:'Identify action-place 에서.', audio:'학교에서 공부해요.'},
        {ko:'친구에게 선물을 줘요.', en:'Identify the person recipient 에게.', audio:'친구에게 선물을 줘요.'}
      ]}
    ]
  },
  {
    id: 'phase-4', number: 4, title: '지시대명사 & 기본 문장', subtitle: 'Demonstratives & Basic Sentence Patterns', icon: '지', color: 'blue',
    description: 'Learn demonstratives, question words, 입니다, 입니까?, 아닙니다, and direct and indirect negation through clear explanations, examples, audio, and practice.',
    lessons: [
      { title:'이 · 그 · 저 — Basic Demonstratives', body:'Korean has three basic demonstratives. 이 is for something near the speaker, 그 is for something associated with the listener or already mentioned, and 저 is for something far from both speaker and listener.', table:{headers:['#','Korean','Meaning','Usage'],rows:[['1','이','this','Near the speaker'],['2','그','that','Near/associated with the listener, or previously mentioned'],['3','저','that over there','Far from both speaker and listener'],['4','이것 / 그것 / 저것','this thing / that thing / that thing over there','Things / objects'],['5','이거 / 그거 / 저거','this / that / that over there','Conversational forms'],['6','여기 / 거기 / 저기','here / there / over there','Places / locations'],['7','이 사람 / 그 사람 / 저 사람','this person / that person / that person over there','People'],['8','이곳 / 그곳 / 저곳','this place / that place / that place over there','Places; somewhat more formal/written']]}, examples:[{ko:'이 책',en:'this book',audio:'이 책'},{ko:'그 책',en:'that book',audio:'그 책'},{ko:'저 책',en:'that book over there',audio:'저 책'}] },
      { title:'이것 / 그것 / 저것 — Things', body:'것 means “thing.” 이것, 그것, and 저것 can stand alone and refer to objects or things.', examples:[{ko:'이것은 책이에요.',en:'This is a book.',audio:'이것은 책이에요.'},{ko:'그것은 뭐예요?',en:'What is that?',audio:'그것은 뭐예요?'},{ko:'저것은 자동차예요.',en:'That over there is a car.',audio:'저것은 자동차예요.'}] },
      { title:'이거 / 그거 / 저거 — Conversational Forms', body:'In everyday conversation, 이것/그것/저것 are commonly shortened to 이거/그거/저거.', examples:[{ko:'이거 뭐예요?',en:'What is this?',audio:'이거 뭐예요?'},{ko:'그거 뭐예요?',en:'What is that?',audio:'그거 뭐예요?'},{ko:'저거 뭐예요?',en:'What is that over there?',audio:'저거 뭐예요?'}] },
      { title:'여기 / 거기 / 저기 — Places', body:'여기 means here, 거기 means there, and 저기 means over there. These forms refer to locations.', examples:[{ko:'여기예요.',en:'It is here.',audio:'여기예요.'},{ko:'거기예요.',en:'It is there.',audio:'거기예요.'},{ko:'저기예요.',en:'It is over there.',audio:'저기예요.'}] },
      { title:'이 사람 / 그 사람 / 저 사람', body:'사람 means person. Put 이, 그, or 저 before 사람 to identify a person according to distance or conversational context.', examples:[{ko:'이 사람은 학생이에요.',en:'This person is a student.',audio:'이 사람은 학생이에요.'},{ko:'그 사람은 선생님이에요.',en:'That person is a teacher.',audio:'그 사람은 선생님이에요.'},{ko:'저 사람은 누구예요?',en:'Who is that person over there?',audio:'저 사람은 누구예요?'}] },
      { title:'이곳 / 그곳 / 저곳', body:'곳 means place. These forms mean this place, that place, and that place over there. They are more formal or written than 여기/거기/저기.', examples:[{ko:'이곳은 학교입니다.',en:'This place is a school.',audio:'이곳은 학교입니다.'},{ko:'그곳은 어디예요?',en:'Where is that place?',audio:'그곳은 어디예요?'},{ko:'저곳은 공원이에요.',en:'That place over there is a park.',audio:'저곳은 공원이에요.'}] },
      { title:'Demonstratives + Particles', body:'Demonstratives can combine with the particles from Phase 3 to form complete sentences.', examples:[{ko:'이것은 책이에요.',en:'This is a book.',audio:'이것은 책이에요.'},{ko:'그것을 주세요.',en:'Please give me that.',audio:'그것을 주세요.'},{ko:'저기에 가요.',en:'I go over there.',audio:'저기에 가요.'},{ko:'이 사람에게 말해요.',en:'I speak to this person.',audio:'이 사람에게 말해요.'}] },
      { title:'What? — 뭐 / 무엇', body:'뭐 and 무엇 both mean “what.” 뭐 is very common in everyday speech, while 무엇 is more formal or explicit.', examples:[{ko:'이거 뭐예요?',en:'What is this?',audio:'이거 뭐예요?'},{ko:'그것은 무엇입니까?',en:'What is that?',audio:'그것은 무엇입니까?'},{ko:'뭐 먹어요?',en:'What are you eating?',audio:'뭐 먹어요?'}] },
      { title:'Who? — 누구', body:'누구 means “who” and is used to ask about a person.', examples:[{ko:'저 사람 누구예요?',en:'Who is that person over there?',audio:'저 사람 누구예요?'},{ko:'그 사람은 누구예요?',en:'Who is that person?',audio:'그 사람은 누구예요?'}] },
      { title:'Where? — 어디', body:'어디 means “where” and is used to ask about a location or destination.', examples:[{ko:'어디예요?',en:'Where is it?',audio:'어디예요?'},{ko:'학교는 어디예요?',en:'Where is the school?',audio:'학교는 어디예요?'},{ko:'어디에 가요?',en:'Where are you going?',audio:'어디에 가요?'}] },
      { title:'What Kind / Which? — 무슨 / 어느', body:'무슨 means what kind of/what before a noun. 어느 means which before a noun.', examples:[{ko:'무슨 책이에요?',en:'What kind of book is it?',audio:'무슨 책이에요?'},{ko:'무슨 음식 좋아해요?',en:'What kind of food do you like?',audio:'무슨 음식 좋아해요?'},{ko:'어느 학교예요?',en:'Which school is it?',audio:'어느 학교예요?'}] },
      { title:'입니다 — “am / is / are”', body:'입니다 is the formal-polite noun ending meaning “am, is, or are.” It identifies a person or thing and does not change according to the subject.', pattern:'Noun + 입니다', examples:[{ko:'저는 학생입니다.',en:'I am a student.',audio:'저는 학생입니다.'},{ko:'그 사람은 의사입니다.',en:'That person is a doctor.',audio:'그 사람은 의사입니다.'},{ko:'이것은 책입니다.',en:'This is a book.',audio:'이것은 책입니다.'}] },
      { title:'Sample Sentences with 입니다', body:'Practice complete identification sentences. Identify the subject and noun, then listen and repeat.', examples:[{ko:'저는 학생입니다.',en:'I am a student.',audio:'저는 학생입니다.'},{ko:'저는 한국 사람입니다.',en:'I am Korean.',audio:'저는 한국 사람입니다.'},{ko:'이것은 사과입니다.',en:'This is an apple.',audio:'이것은 사과입니다.'},{ko:'저 사람은 의사입니다.',en:'That person is a doctor.',audio:'저 사람은 의사입니다.'}] },
      { title:'입니까? — “Am / Is / Are ...?”', body:'입니까? is the formal-polite question form used with nouns. It turns an identification statement into a yes/no question.', pattern:'Noun + 입니까?', examples:[{ko:'학생입니까?',en:'Are you a student?',audio:'학생입니까?'},{ko:'의사입니까?',en:'Are you a doctor?',audio:'의사입니까?'},{ko:'책입니까?',en:'Is it a book?',audio:'책입니까?'}] },
      { title:'입니까? with Demonstratives', body:'Combine demonstratives with 입니까? to ask what something or someone is.', examples:[{ko:'이것은 책입니까?',en:'Is this a book?',audio:'이것은 책입니까?'},{ko:'그 사람은 선생님입니까?',en:'Is that person a teacher?',audio:'그 사람은 선생님입니까?'},{ko:'저것은 자동차입니까?',en:'Is that over there a car?',audio:'저것은 자동차입니까?'}] },
      { title:'아닙니다 — “am / is / are not”', body:'아닙니다 is the formal-polite negative form for nouns. The noun normally takes 이/가 before 아닙니다.', pattern:'Noun + 이/가 + 아닙니다', examples:[{ko:'학생이 아닙니다.',en:'I am not a student.',audio:'학생이 아닙니다.'},{ko:'의사가 아닙니다.',en:'I am not a doctor.',audio:'의사가 아닙니다.'},{ko:'책이 아닙니다.',en:'It is not a book.',audio:'책이 아닙니다.'}] },
      { title:'아닙니다 — 이 vs 가', body:'Use 이 아닙니다 after a noun ending in a consonant and 가 아닙니다 after a noun ending in a vowel.', table:{headers:['Noun','Ending','Pattern','Example'],rows:[['학생','Consonant','학생이 아닙니다','학생이 아닙니다.'],['책','Consonant','책이 아닙니다','책이 아닙니다.'],['의사','Vowel','의사가 아닙니다','의사가 아닙니다.'],['친구','Vowel','친구가 아닙니다','친구가 아닙니다.']]}, examples:[{ko:'저는 학생이 아닙니다.',en:'I am not a student.',audio:'저는 학생이 아닙니다.'},{ko:'저는 의사가 아닙니다.',en:'I am not a doctor.',audio:'저는 의사가 아닙니다.'}] },
      { title:'Direct Negation — 안', body:'안 is a short, direct way to negate many verbs and adjectives. It is normally placed immediately before the verb or adjective.', pattern:'안 + Verb / Adjective', examples:[{ko:'안 가요.',en:'I do not go.',audio:'안 가요.'},{ko:'안 먹어요.',en:'I do not eat.',audio:'안 먹어요.'},{ko:'안 공부해요.',en:'I do not study.',audio:'안 공부해요.'},{ko:'안 좋아요.',en:'It is not good / I do not like it.',audio:'안 좋아요.'}] },
      { title:'Indirect Negation — -지 않다', body:'-지 않다 is another major negation pattern. Attach 지 않다 to the verb or adjective stem; in polite speech, it commonly becomes -지 않아요.', pattern:'Verb/Adjective stem + 지 않아요', examples:[{ko:'가지 않아요.',en:'I do not go.',audio:'가지 않아요.'},{ko:'먹지 않아요.',en:'I do not eat.',audio:'먹지 않아요.'},{ko:'공부하지 않아요.',en:'I do not study.',audio:'공부하지 않아요.'},{ko:'좋지 않아요.',en:'It is not good.',audio:'좋지 않아요.'}] },
      { title:'안 vs -지 않다 — Compare', body:'Both patterns express negation. 안 is short and very common in everyday speech. -지 않다 is a longer negative construction and can sound more deliberate or formal depending on context.', table:{headers:['Direct','Indirect','Meaning'],rows:[['안 가요','가지 않아요','I do not go'],['안 먹어요','먹지 않아요','I do not eat'],['안 공부해요','공부하지 않아요','I do not study'],['안 좋아요','좋지 않아요','It is not good']]}, examples:[{ko:'오늘 안 가요.',en:'I am not going today.',audio:'오늘 안 가요.'},{ko:'오늘 가지 않아요.',en:'I am not going today.',audio:'오늘 가지 않아요.'}] },
      { title:'Negation Practice with Questions', body:'Combine questions with direct and indirect negation. Listen to the question and answer with the appropriate negative form.', examples:[{ko:'오늘 공부해요? — 아니요, 안 공부해요.',en:'Do you study today? — No, I do not study.',audio:'오늘 공부해요? 아니요, 안 공부해요.'},{ko:'학교에 가요? — 아니요, 가지 않아요.',en:'Are you going to school? — No, I am not going.',audio:'학교에 가요? 아니요, 가지 않아요.'}] },
      { title:'Phase 4 Sentence Building', body:'Combine demonstratives, particles, questions, 입니다, 입니까?, 아닙니다, and negation into complete sentences.', examples:[{ko:'이것은 책입니다.',en:'This is a book.',audio:'이것은 책입니다.'},{ko:'이것은 책입니까?',en:'Is this a book?',audio:'이것은 책입니까?'},{ko:'아니요, 책이 아닙니다.',en:'No, it is not a book.',audio:'아니요, 책이 아닙니다.'},{ko:'저 사람은 학생입니까?',en:'Is that person a student?',audio:'저 사람은 학생입니까?'},{ko:'아니요, 학생이 아닙니다.',en:'No, that person is not a student.',audio:'아니요, 학생이 아닙니다.'}] },
      { title:'Phase 4 Listening & Speaking Practice', body:'Listen first, identify the target grammar, then repeat the full sentence aloud.', examples:[{ko:'이거 뭐예요?',en:'What is this?',audio:'이거 뭐예요?'},{ko:'그 사람은 의사입니까?',en:'Is that person a doctor?',audio:'그 사람은 의사입니까?'},{ko:'아니요, 의사가 아닙니다.',en:'No, I am not a doctor.',audio:'아니요, 의사가 아닙니다.'},{ko:'오늘 안 가요.',en:'I do not go today.',audio:'오늘 안 가요.'},{ko:'오늘 가지 않아요.',en:'I do not go today.',audio:'오늘 가지 않아요.'}] },
      { title:'Phase 4 Mastery Test', body:'Identify the correct demonstrative, question word, noun identification form, or negation pattern, then listen and repeat.', examples:[{ko:'저것은 책입니까?',en:'Is that over there a book?',audio:'저것은 책입니까?'},{ko:'아니요, 책이 아닙니다.',en:'No, it is not a book.',audio:'아니요, 책이 아닙니다.'},{ko:'그 사람은 누구예요?',en:'Who is that person?',audio:'그 사람은 누구예요?'},{ko:'저는 학생입니다.',en:'I am a student.',audio:'저는 학생입니다.'},{ko:'안 먹어요.',en:'I do not eat.',audio:'안 먹어요.'},{ko:'먹지 않아요.',en:'I do not eat.',audio:'먹지 않아요.'}] }
    ]
  },
  {
    id: 'phase-5', number: 5, title: '숫자 & 수량 표현', subtitle: 'Numbers & Counters', icon: '123', color: 'cyan',
    description: 'Learn Sino-Korean numbers, native Korean numbers, and the most useful Korean counters.',
    lessons: [
      {title:'Sino-Korean Numbers',body:'Learn 일, 이, 삼 and the system used for dates, money, phone numbers, minutes, addresses, and many other measurements.',examples:[{ko:'일, 이, 삼, 사, 오',en:'1, 2, 3, 4, 5',audio:'일, 이, 삼, 사, 오'},{ko:'십, 백, 천, 만',en:'10, 100, 1,000, 10,000',audio:'십, 백, 천, 만'}]},
      {title:'Native Korean Numbers',body:'Learn 하나, 둘, 셋, 넷 and the native counting system used especially with people, objects, age, hours, and common counters.',examples:[{ko:'하나, 둘, 셋, 넷',en:'one, two, three, four',audio:'하나, 둘, 셋, 넷'},{ko:'다섯, 여섯, 일곱, 여덟',en:'five, six, seven, eight',audio:'다섯, 여섯, 일곱, 여덟'}]},
      {title:'Native Number Changes Before Counters',body:'Before many counters, 하나, 둘, 셋, 넷, and 스물 change to 한, 두, 세, 네, and 스무.',table:{headers:['Number','Before Counter','Example'],rows:[['하나','한','한 명'],['둘','두','두 개'],['셋','세','세 마리'],['넷','네','네 권'],['스물','스무','스무 살']]},examples:[{ko:'한 명',en:'one person',audio:'한 명'},{ko:'두 개',en:'two things',audio:'두 개'},{ko:'세 마리',en:'three animals',audio:'세 마리'},{ko:'네 권',en:'four books',audio:'네 권'}]},
      {title:'People Counters — 명 / 분',body:'명 is a common counter for people. 분 is a respectful counter used for people.',examples:[{ko:'한 명',en:'one person',audio:'한 명'},{ko:'세 명',en:'three people',audio:'세 명'},{ko:'두 분',en:'two people (respectful)',audio:'두 분'}]},
      {title:'General Object Counter — 개',body:'개 is a very common general counter for objects and things.',examples:[{ko:'한 개',en:'one thing',audio:'한 개'},{ko:'두 개',en:'two things',audio:'두 개'},{ko:'세 개',en:'three things',audio:'세 개'}]},
      {title:'Animals — 마리',body:'마리 is used for animals.',examples:[{ko:'한 마리',en:'one animal',audio:'한 마리'},{ko:'두 마리',en:'two animals',audio:'두 마리'},{ko:'세 마리',en:'three animals',audio:'세 마리'}]},
      {title:'Books — 권',body:'권 is used for books and book-like volumes.',examples:[{ko:'한 권',en:'one book',audio:'한 권'},{ko:'두 권',en:'two books',audio:'두 권'},{ko:'세 권',en:'three books',audio:'세 권'}]},
      {title:'Drinks — 잔',body:'잔 is used for cups or glasses of drinks.',examples:[{ko:'한 잔',en:'one cup/glass',audio:'한 잔'},{ko:'두 잔',en:'two cups/glasses',audio:'두 잔'}]},
      {title:'More Useful Counters',body:'Build familiarity with common counters such as 장 for flat items, 대 for machines/vehicles, 켤레 for pairs of shoes or socks, and 병 for bottles.',examples:[{ko:'사진 두 장',en:'two photos',audio:'사진 두 장'},{ko:'자동차 한 대',en:'one car',audio:'자동차 한 대'},{ko:'신발 한 켤레',en:'one pair of shoes',audio:'신발 한 켤레'},{ko:'물 두 병',en:'two bottles of water',audio:'물 두 병'}]},
      {title:'Sino vs Native — When to Use Which',body:'Learn the practical distinction instead of memorizing isolated lists. Native Korean numbers are common with many everyday counters, while Sino-Korean numbers are used for dates, money, phone numbers, minutes, addresses, and many formal measurements.',examples:[{ko:'세 명',en:'three people',audio:'세 명'},{ko:'삼 분',en:'three minutes',audio:'삼 분'},{ko:'세 시',en:'three o’clock',audio:'세 시'},{ko:'삼 월',en:'March',audio:'삼 월'}]},
      {title:'Number + Counter Sentence Building',body:'Combine numbers and counters with particles and verbs to form complete sentences.',examples:[{ko:'학생 세 명이 있어요.',en:'There are three students.',audio:'학생 세 명이 있어요.'},{ko:'책 두 권을 샀어요.',en:'I bought two books.',audio:'책 두 권을 샀어요.'},{ko:'사과 세 개를 먹어요.',en:'I eat three apples.',audio:'사과 세 개를 먹어요.'}]},
      {title:'Phase 5 Listening & Practice',body:'Listen, identify the number system and counter, then repeat the complete expression.',examples:[{ko:'한 명',en:'one person',audio:'한 명'},{ko:'삼 분',en:'three minutes',audio:'삼 분'},{ko:'두 권',en:'two books',audio:'두 권'},{ko:'세 마리',en:'three animals',audio:'세 마리'}]},
      {title:'Phase 5 Mastery Test',body:'Review number systems, counter changes, and common counters before moving to dates and time.',examples:[{ko:'두 명',en:'two people',audio:'두 명'},{ko:'삼 월',en:'March',audio:'삼 월'},{ko:'네 권',en:'four books',audio:'네 권'},{ko:'오 분',en:'five minutes',audio:'오 분'}]}
    ]
  },
  {
    id:'phase-6',number:6,title:'날짜 & 시간',subtitle:'Dates, Time & Duration',icon:'날',color:'purple',description:'Learn years, months, dates, days, clock time, and duration expressions.',
    lessons:[
      {title:'Years — 년',body:'Use Sino-Korean numbers with 년 for years.',examples:[{ko:'2026년',en:'the year 2026',audio:'이천이십육 년'},{ko:'작년',en:'last year',audio:'작년'},{ko:'내년',en:'next year',audio:'내년'}]},
      {title:'Months — 월',body:'Months use Sino-Korean numbers plus 월. June and October have special spoken forms: 유월 and 시월.',examples:[{ko:'1월',en:'January',audio:'일월'},{ko:'3월',en:'March',audio:'삼월'},{ko:'6월',en:'June',audio:'유월'},{ko:'10월',en:'October',audio:'시월'}]},
      {title:'Dates — 일',body:'Dates use Sino-Korean numbers plus 일.',examples:[{ko:'15일',en:'the 15th',audio:'십오 일'},{ko:'8월 15일',en:'August 15',audio:'팔월 십오 일'}]},
      {title:'Days of the Week',body:'Learn 월요일 through 일요일.',examples:[{ko:'월요일',en:'Monday',audio:'월요일'},{ko:'금요일',en:'Friday',audio:'금요일'},{ko:'일요일',en:'Sunday',audio:'일요일'}]},
      {title:'Full Dates',body:'Combine year, month, and date in Korean order: 년 + 월 + 일.',examples:[{ko:'2026년 8월 15일',en:'August 15, 2026',audio:'이천이십육 년 팔월 십오 일'}]},
      {title:'Hours — 시',body:'Clock hours normally use native Korean numbers with 시.',examples:[{ko:'한 시',en:'one o’clock',audio:'한 시'},{ko:'세 시',en:'three o’clock',audio:'세 시'},{ko:'열두 시',en:'twelve o’clock',audio:'열두 시'}]},
      {title:'Minutes — 분',body:'Minutes normally use Sino-Korean numbers with 분.',examples:[{ko:'삼 분',en:'three minutes',audio:'삼 분'},{ko:'삼십 분',en:'thirty minutes',audio:'삼십 분'}]},
      {title:'AM / PM — 오전 / 오후',body:'Use 오전 for AM and 오후 for PM.',examples:[{ko:'오전 세 시',en:'3 AM',audio:'오전 세 시'},{ko:'오후 세 시',en:'3 PM',audio:'오후 세 시'}]},
      {title:'Duration — 시간 / 동안',body:'Learn how to express how long something lasts.',examples:[{ko:'두 시간',en:'two hours',audio:'두 시간'},{ko:'삼 일 동안',en:'for three days',audio:'삼 일 동안'},{ko:'한 달 동안',en:'for one month',audio:'한 달 동안'}]},
      {title:'Months of Duration — 달 / 개월',body:'Learn the practical difference between native 달 expressions and Sino-Korean 개월 expressions for month duration.',examples:[{ko:'한 달',en:'one month',audio:'한 달'},{ko:'두 달',en:'two months',audio:'두 달'},{ko:'삼 개월',en:'three months',audio:'삼 개월'}]},
      {title:'Date & Time Questions',body:'Ask what day, date, or time it is.',examples:[{ko:'오늘 몇 월 며칠이에요?',en:'What month and date is it today?',audio:'오늘 몇 월 며칠이에요?'},{ko:'몇 시예요?',en:'What time is it?',audio:'몇 시예요?'},{ko:'무슨 요일이에요?',en:'What day of the week is it?',audio:'무슨 요일이에요?'}]},
      {title:'Phase 6 Mastery Practice',body:'Practice reading dates, telling time, and expressing duration.',examples:[{ko:'오후 세 시 삼십 분',en:'3:30 PM',audio:'오후 세 시 삼십 분'},{ko:'2026년 8월 15일',en:'August 15, 2026',audio:'이천이십육 년 팔월 십오 일'},{ko:'두 달 동안',en:'for two months',audio:'두 달 동안'}]}
    ]
  },
  {
    id:'phase-7',number:7,title:'문장 구조',subtitle:'Sentence Patterns',icon:'문',color:'green',description:'Build complete Korean sentences using the grammar learned so far.',
    lessons:[
      {title:'Basic Korean Word Order',body:'Korean commonly places the verb at the end. A useful beginner pattern is Subject + Object + Verb.',examples:[{ko:'저는 밥을 먹어요.',en:'I eat rice.',audio:'저는 밥을 먹어요.'}]},
      {title:'Subject + Description',body:'Use 은/는 or 이/가 to identify the topic or subject.',examples:[{ko:'저는 학생이에요.',en:'I am a student.',audio:'저는 학생이에요.'}]},
      {title:'Object + Verb',body:'Use 을/를 to mark the object of an action.',examples:[{ko:'한국어를 공부해요.',en:'I study Korean.',audio:'한국어를 공부해요.'}]},
      {title:'Location + Action',body:'Use 에 for destinations and 에서 for places where actions happen.',examples:[{ko:'학교에 가요.',en:'I go to school.',audio:'학교에 가요.'},{ko:'학교에서 공부해요.',en:'I study at school.',audio:'학교에서 공부해요.'}]},
      {title:'Sentence Building Practice',body:'Combine subjects, objects, locations, demonstratives, and verbs into complete sentences.',examples:[{ko:'저는 이 책을 읽어요.',en:'I read this book.',audio:'저는 이 책을 읽어요.'}]}
    ]
  },
  {
    id:'phase-8',number:8,title:'활용 규칙',subtitle:'Conjugation & Irregular Rules',icon:'활',color:'orange',description:'Learn core Korean verb and adjective conjugation patterns and irregular rules.',
    lessons:[
      {title:'Dictionary Form to Polite Form',body:'Learn how common dictionary-form verbs change into polite present speech.',examples:[{ko:'가다 → 가요',en:'to go → go',audio:'가요'},{ko:'먹다 → 먹어요',en:'to eat → eat',audio:'먹어요'}]},
      {title:'ㅂ Irregular',body:'Learn common ㅂ irregular verbs and adjectives.',examples:[{ko:'춥다 → 추워요',en:'cold → it is cold',audio:'추워요'},{ko:'돕다 → 도와요',en:'to help → help',audio:'도와요'}]},
      {title:'ㄷ Irregular',body:'Some ㄷ-final stems change ㄷ to ㄹ before a vowel.',examples:[{ko:'듣다 → 들어요',en:'to listen → listen',audio:'들어요'},{ko:'걷다 → 걸어요',en:'to walk → walk',audio:'걸어요'}]},
      {title:'르 Irregular',body:'Learn the common 르 conjugation pattern.',examples:[{ko:'모르다 → 몰라요',en:'to not know → do not know',audio:'몰라요'},{ko:'빠르다 → 빨라요',en:'fast → fast',audio:'빨라요'}]},
      {title:'ㅎ Irregular',body:'Learn common ㅎ irregular descriptive adjectives.',examples:[{ko:'파랗다 → 파래요',en:'blue → blue',audio:'파래요'},{ko:'하얗다 → 하얘요',en:'white → white',audio:'하얘요'}]}
    ]
  },
  {
    id:'phase-9',number:9,title:'시제',subtitle:'Present, Past & Future Tenses',icon:'시',color:'red',description:'Express when an action happens using present, past, and future patterns.',
    lessons:[
      {title:'Present Tense',body:'Talk about actions happening now or regularly.',examples:[{ko:'먹어요.',en:'I eat / I am eating.',audio:'먹어요.'},{ko:'공부해요.',en:'I study / I am studying.',audio:'공부해요.'}]},
      {title:'Past Tense',body:'Use 았어요/었어요 patterns to describe completed past actions.',examples:[{ko:'먹었어요.',en:'I ate.',audio:'먹었어요.'},{ko:'갔어요.',en:'I went.',audio:'갔어요.'}]},
      {title:'Future — -(으)ㄹ 거예요',body:'Use -(으)ㄹ 거예요 to talk about future plans or expected actions.',examples:[{ko:'먹을 거예요.',en:'I will eat.',audio:'먹을 거예요.'},{ko:'공부할 거예요.',en:'I will study.',audio:'공부할 거예요.'}]},
      {title:'Negative Tenses',body:'Combine 안 or -지 않다 with present, past, and future sentences.',examples:[{ko:'안 먹어요.',en:'I do not eat.',audio:'안 먹어요.'},{ko:'안 먹었어요.',en:'I did not eat.',audio:'안 먹었어요.'},{ko:'안 먹을 거예요.',en:'I will not eat.',audio:'안 먹을 거예요.'}]},
      {title:'Tense Comparison',body:'Change the same sentence between present, past, and future to build automatic recognition.',examples:[{ko:'오늘 공부해요.',en:'I study today.',audio:'오늘 공부해요.'},{ko:'어제 공부했어요.',en:'I studied yesterday.',audio:'어제 공부했어요.'},{ko:'내일 공부할 거예요.',en:'I will study tomorrow.',audio:'내일 공부할 거예요.'}]}
    ]
  }
];


const LESSON_PROGRESS_KEY = 'korean_vocabs_lesson_progress_v1';
let lessonProgress = {};

function loadLessonProgress() {
  try { lessonProgress = JSON.parse(localStorage.getItem(LESSON_PROGRESS_KEY) || '{}') || {}; } catch { lessonProgress = {}; }
}
function saveLessonProgress() { localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(lessonProgress)); }
function phaseProgress(phase) { return phase.lessons.filter((_, i) => lessonProgress[`${phase.id}:${i}`]).length; }
function updateLessonProgressUI() {
  const started = KOREAN_LESSONS.filter(p => phaseProgress(p) > 0).length;
  const total = KOREAN_LESSONS.length;
  const text = document.getElementById('lessons-progress-text');
  const bar = document.getElementById('lessons-progress-bar');
  if (text) text.textContent = `${started} of ${total} phases started`;
  if (bar) bar.style.width = `${(started / total) * 100}%`;
}
function renderLessonPhases() {
  const grid = document.getElementById('lesson-phase-grid');
  if (!grid) return;
  grid.innerHTML = KOREAN_LESSONS.map(phase => {
    const done = phaseProgress(phase), total = phase.lessons.length;
    const pct = Math.round(done / total * 100);
    const status = pct >= 100 ? 'Completed' : done > 0 ? 'In Progress' : 'Not Started';
    const action = pct >= 100 ? 'Review Phase' : done > 0 ? 'Continue Phase' : 'Start Phase';
    return `<article class="lesson-phase-card ${phase.color} ${pct >= 100 ? 'is-complete' : ''}">
      <button class="lesson-phase-main" type="button" data-phase-id="${phase.id}" aria-label="${action}: Phase ${phase.number} ${phase.subtitle}">
        <div class="lesson-phase-topline"><span class="lesson-phase-number">PHASE ${phase.number}</span><span class="lesson-phase-status">${status}</span></div>
        <div class="lesson-phase-icon">${phase.icon}</div>
        <h3>${phase.title}</h3>
        <strong>${phase.subtitle}</strong>
        <p>${phase.description}</p>
        <div class="lesson-card-footer"><span>${done}/${total} lessons</span><span>${pct}%</span></div>
        <div class="lesson-card-track"><span style="width:${pct}%"></span></div>
      </button>
      <button class="lesson-phase-cta" type="button" data-phase-id="${phase.id}">${action}<span>→</span></button>
    </article>`;
  }).join('');

  // Bind phase buttons after rendering. This avoids relying on inline onclick handlers
  // and keeps the phase navigation reliable when the view is dynamically injected.
  grid.querySelectorAll('[data-phase-id]').forEach(button => {
    button.addEventListener('click', () => openLessonPhase(button.dataset.phaseId));
  });

  updateLessonProgressUI();
}

function openLessonPhase(id) {
  const phase = KOREAN_LESSONS.find(p => p.id === id);
  if (!phase) { console.warn('Lesson phase not found:', id); return; }
  const detail = document.getElementById('lesson-detail');
  const backdrop = document.getElementById('lesson-detail-backdrop');
  if (!detail) return;

  detail.hidden = false;
  detail.classList.add('is-open');
  if (backdrop) { backdrop.hidden = false; backdrop.classList.add('is-open'); }
  document.body.classList.add('lesson-modal-open');

  document.getElementById('lesson-detail-phase').textContent = `PHASE ${phase.number}`;
  document.getElementById('lesson-detail-eyebrow').textContent = phase.title;
  document.getElementById('lesson-detail-title').textContent = phase.subtitle;
  document.getElementById('lesson-detail-description').textContent = phase.description;

  const list = document.getElementById('lesson-list');
  const completedCount = phaseProgress(phase);
  const phasePercent = Math.round((completedCount / phase.lessons.length) * 100);
  const modalProgress = document.getElementById('lesson-detail-progress');
  const modalProgressBar = document.getElementById('lesson-detail-progress-bar');
  if (modalProgress) modalProgress.textContent = `${completedCount}/${phase.lessons.length} lessons complete`;
  if (modalProgressBar) modalProgressBar.style.width = `${phasePercent}%`;

  let previousGroup = '';
  list.innerHTML = phase.lessons.map((lesson, i) => {
    const done = !!lessonProgress[`${phase.id}:${i}`];
    const group = lesson.group || '';
    const groupHeader = group && group !== previousGroup
      ? `<div class="lesson-group-header"><span>${group}</span><i></i></div>`
      : '';
    previousGroup = group;
    const examples = lesson.examples.map(ex => `<div class="lesson-example">
      <div class="lesson-example-ko"><span>${ex.ko}</span>${ex.roman ? `<small class="lesson-example-roman">${ex.roman}</small>` : ''}</div>
      <span>${ex.en}</span>
      ${ex.sound ? `<small class="lesson-example-sound">Pronunciation: ${ex.sound}</small>` : ''}
      <div class="lesson-example-audio" data-audio-text="${encodeURIComponent(ex.audio || ex.ko)}"></div>
    </div>`).join('');
    return `${groupHeader}<article class="lesson-item ${done ? 'is-complete' : ''}">
      <div class="lesson-item-head">
        <span class="lesson-index">${i + 1}</span>
        <div><span class="lesson-item-kicker">LESSON ${String(i + 1).padStart(2, '0')}</span><h3>${lesson.title}</h3><p>${lesson.body}</p></div>
        <button class="lesson-complete-btn" type="button" data-complete-phase="${phase.id}" data-complete-index="${i}">${done ? '✓ Completed' : 'Mark Complete'}</button>
      </div>
      <div class="lesson-examples">${examples}</div>
    </article>`;
  }).join('');

  list.querySelectorAll('[data-complete-phase]').forEach(button => {
    button.addEventListener('click', () => toggleLessonComplete(button.dataset.completePhase, Number(button.dataset.completeIndex)));
  });

  list.querySelectorAll('.lesson-example-audio').forEach(el => {
    const text = decodeURIComponent(el.dataset.audioText || '');
    if (typeof window.createAIAudioControls === 'function') el.appendChild(window.createAIAudioControls(text));
  });

  const firstIncomplete = phase.lessons.findIndex((_, i) => !lessonProgress[`${phase.id}:${i}`]);
  const target = firstIncomplete >= 0 ? list.querySelectorAll('.lesson-item')[firstIncomplete] : list.querySelector('.lesson-item');
  if (target) target.classList.add('is-next-lesson');
  setTimeout(() => detail.querySelector('.lesson-close-btn')?.focus(), 50);
}

function closeLessonDetail() {
  if (typeof window.stopKoreanAudio === 'function') window.stopKoreanAudio();
  const detail = document.getElementById('lesson-detail');
  const backdrop = document.getElementById('lesson-detail-backdrop');
  if (detail) { detail.classList.remove('is-open'); detail.hidden = true; }
  if (backdrop) { backdrop.classList.remove('is-open'); backdrop.hidden = true; }
  document.body.classList.remove('lesson-modal-open');
  renderLessonPhases();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('lesson-detail')?.classList.contains('is-open')) closeLessonDetail();
});

function toggleLessonComplete(phaseId, index) {
  const key = `${phaseId}:${index}`;
  lessonProgress[key] = !lessonProgress[key];
  saveLessonProgress();
  const phase = KOREAN_LESSONS.find(p => p.id === phaseId);
  if (phase) openLessonPhase(phaseId);
}
function resetLessonProgress() {
  if (!confirm('Reset all lesson progress?')) return;
  lessonProgress = {}; saveLessonProgress(); renderLessonPhases();
}
function initializeLessons() {
  loadLessonProgress();
  const backdrop = document.getElementById('lesson-detail-backdrop');
  if (backdrop && !backdrop.dataset.bound) {
    backdrop.dataset.bound = '1';
    backdrop.addEventListener('click', closeLessonDetail);
  }
  renderLessonPhases();
}
window.initializeLessons = initializeLessons;
window.openLessonPhase = openLessonPhase;
window.closeLessonDetail = closeLessonDetail;
window.toggleLessonComplete = toggleLessonComplete;
window.resetLessonProgress = resetLessonProgress;
