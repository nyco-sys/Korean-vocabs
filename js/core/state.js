let vocabularies = [];
    let filteredVocab = [];
    let currentIndex = 0;
    let inputJamoSequence = [];
    let isShiftActive = false;
    let textVocabularies = [];
    let filteredTextVocab = [];
    let currentTextIndex = 0;
    let textInputJamoSequence = [];
    let isTextShiftActive = false;
    let addTextInputJamoSequence = [];
    let isAddTextShiftActive = false;
    let imageQuizMode = 'typing';
    let textQuizMode = 'typing';
    let audioContext = null;

    // Physical QWERTY to Hangul mapping
    const qwertyMap = {
      'q':'ㅂ', 'Q':'ㅃ', 'w':'ㅈ', 'W':'ㅉ', 'e':'ㄷ', 'E':'ㄸ', 'r':'ㄱ', 'R':'ㄲ', 't':'ㅅ', 'T':'ㅆ',
      'y':'ㅛ', 'u':'ㅕ', 'i':'ㅑ', 'o':'ㅐ', 'O':'ㅒ', 'p':'ㅔ', 'P':'ㅖ',
      'a':'ㅁ', 's':'ㄴ', 'd':'ㅇ', 'f':'ㄹ', 'g':'ㅎ', 'h':'ㅗ', 'j':'ㅓ', 'k':'ㅏ', 'l':'ㅣ',
      'z':'ㅋ', 'x':'ㅌ', 'c':'ㅍ', 'v':'ㅊ', 'b':'ㅠ', 'n':'ㅜ', 'm':'ㅡ'
    };


    // Study session state
    let imageStudySession = { active: false, total: 10, completed: 0, correct: 0, skipped: 0, category: 'ALL', mode: 'typing', review: false };
    let textStudySession = { active: false, total: 10, completed: 0, correct: 0, skipped: 0, category: 'ALL', mode: 'typing', review: false };

// Mistake review state
let reviewMistakes = [];
let reviewFilter = 'ALL';
