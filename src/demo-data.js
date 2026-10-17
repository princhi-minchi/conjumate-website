// Fixed Italian sample: no API requests or arbitrary-text conjugation.
// Forms checked against the WordReference Italian conjugator; lasciare also
// checked against Reverso. See README for the reference URLs.
export const SAMPLE_SENTENCES = [
  {
    italian: "Ogni mattina, Sofia legge qualche pagina prima del caffè.",
    english: "Every morning, Sofia reads a few pages before her coffee.",
  },
  {
    italian: "Tra le righe, scopre un mondo nuovo.",
    english: "Between the lines, she discovers a new world.",
  },
  {
    italian: "E per un momento, viaggia lontano, senza lasciare casa.",
    english: "And for a moment, she travels far away, without leaving home.",
  },
];

export function normalizeWord(word) {
  return word.normalize("NFC").toLocaleLowerCase("it");
}

let wordIndex = 0;
export const SAMPLE_TOKENS = SAMPLE_SENTENCES.flatMap(
  (sentence, sentenceIndex) => {
    const pieces = sentence.italian.match(/[\p{L}\p{M}]+|[^\p{L}\p{M}]+/gu);
    return [
      ...(sentenceIndex ? [{ text: " ", isWord: false }] : []),
      ...pieces.map((text) => {
        const isWord = /^[\p{L}\p{M}]+$/u.test(text);
        return {
          text,
          isWord,
          sentenceIndex,
          ...(isWord ? { wordIndex: wordIndex++ } : {}),
        };
      }),
    ];
  },
);
export const SAMPLE_WORDS = SAMPLE_TOKENS.filter((token) => token.isWord);

export const MOODS = [
  {
    id: "indicativo",
    label: "Indicativo",
    tenses: [
      "presente",
      "imperfetto",
      "passatoRemoto",
      "futuroSemplice",
      "passatoProssimo",
      "trapassatoProssimo",
      "trapassatoRemoto",
      "futuroAnteriore",
    ],
  },
  {
    id: "congiuntivo",
    label: "Congiuntivo",
    tenses: ["presente", "imperfetto", "passato", "trapassato"],
  },
  {
    id: "condizionale",
    label: "Condizionale",
    tenses: ["presente", "passato"],
  },
  { id: "imperativo", label: "Imperativo", tenses: ["presente"] },
  { id: "infinito", label: "Infinito", tenses: ["presente", "passato"] },
  { id: "participio", label: "Participio", tenses: ["presente", "passato"] },
  { id: "gerundio", label: "Gerundio", tenses: ["presente", "passato"] },
];

export const TENSE_LABELS = {
  presente: "Presente",
  imperfetto: "Imperfetto",
  passatoRemoto: "Passato remoto",
  futuroSemplice: "Futuro semplice",
  passatoProssimo: "Passato prossimo",
  trapassatoProssimo: "Trapassato prossimo",
  trapassatoRemoto: "Trapassato remoto",
  futuroAnteriore: "Futuro anteriore",
  passato: "Passato",
  trapassato: "Trapassato",
};

const PERSONS = ["io", "tu", "lui / lei", "noi", "voi", "loro"];
const AUXILIARY = {
  presente: ["ho", "hai", "ha", "abbiamo", "avete", "hanno"],
  imperfetto: ["avevo", "avevi", "aveva", "avevamo", "avevate", "avevano"],
  passatoRemoto: ["ebbi", "avesti", "ebbe", "avemmo", "aveste", "ebbero"],
  futuroSemplice: ["avrò", "avrai", "avrà", "avremo", "avrete", "avranno"],
  congiuntivoPresente: [
    "abbia",
    "abbia",
    "abbia",
    "abbiamo",
    "abbiate",
    "abbiano",
  ],
  congiuntivoImperfetto: [
    "avessi",
    "avessi",
    "avesse",
    "avessimo",
    "aveste",
    "avessero",
  ],
  condizionalePresente: [
    "avrei",
    "avresti",
    "avrebbe",
    "avremmo",
    "avreste",
    "avrebbero",
  ],
};

function personal(forms) {
  return forms.map((form, index) => [PERSONS[index], form]);
}

// All four verbs take avere in these active, non-reflexive sample paradigms.
// Compound forms use the corresponding auxiliary tense + past participle.
function paradigm({
  infinitive,
  pastParticiple,
  presentParticiple,
  gerund,
  indicative,
  subjunctive,
  conditional,
  imperative,
}) {
  const compound = (tense) =>
    personal(
      AUXILIARY[tense].map((auxiliary) => `${auxiliary} ${pastParticiple}`),
    );
  const participleStem = pastParticiple.slice(0, -1);
  return {
    indicativo: {
      presente: personal(indicative.presente),
      imperfetto: personal(indicative.imperfetto),
      passatoRemoto: personal(indicative.passatoRemoto),
      futuroSemplice: personal(indicative.futuroSemplice),
      passatoProssimo: compound("presente"),
      trapassatoProssimo: compound("imperfetto"),
      trapassatoRemoto: compound("passatoRemoto"),
      futuroAnteriore: compound("futuroSemplice"),
    },
    congiuntivo: {
      presente: personal(subjunctive.presente),
      imperfetto: personal(subjunctive.imperfetto),
      passato: compound("congiuntivoPresente"),
      trapassato: compound("congiuntivoImperfetto"),
    },
    condizionale: {
      presente: personal(conditional),
      passato: compound("condizionalePresente"),
    },
    imperativo: {
      presente: imperative.map((form, index) => [
        ["io", "tu", "Lei", "noi", "voi", "Loro"][index],
        form,
      ]),
    },
    infinito: {
      presente: [["forma", infinitive]],
      passato: [["forma", `avere ${pastParticiple}`]],
    },
    participio: {
      presente: [
        ["singolare", presentParticiple],
        ["plurale", `${presentParticiple.slice(0, -1)}i`],
      ],
      passato: [
        ["m. sing.", pastParticiple],
        ["f. sing.", `${participleStem}a`],
        ["m. plur.", `${participleStem}i`],
        ["f. plur.", `${participleStem}e`],
      ],
    },
    gerundio: {
      presente: [["forma", gerund]],
      passato: [["forma", `avendo ${pastParticiple}`]],
    },
  };
}

export const VERBS = {
  leggere: paradigm({
    infinitive: "leggere",
    pastParticiple: "letto",
    presentParticiple: "leggente",
    gerund: "leggendo",
    indicative: {
      presente: ["leggo", "leggi", "legge", "leggiamo", "leggete", "leggono"],
      imperfetto: [
        "leggevo",
        "leggevi",
        "leggeva",
        "leggevamo",
        "leggevate",
        "leggevano",
      ],
      passatoRemoto: [
        "lessi",
        "leggesti",
        "lesse",
        "leggemmo",
        "leggeste",
        "lessero",
      ],
      futuroSemplice: [
        "leggerò",
        "leggerai",
        "leggerà",
        "leggeremo",
        "leggerete",
        "leggeranno",
      ],
    },
    subjunctive: {
      presente: ["legga", "legga", "legga", "leggiamo", "leggiate", "leggano"],
      imperfetto: [
        "leggessi",
        "leggessi",
        "leggesse",
        "leggessimo",
        "leggeste",
        "leggessero",
      ],
    },
    conditional: [
      "leggerei",
      "leggeresti",
      "leggerebbe",
      "leggeremmo",
      "leggereste",
      "leggerebbero",
    ],
    imperative: ["—", "leggi", "legga", "leggiamo", "leggete", "leggano"],
  }),
  scoprire: paradigm({
    infinitive: "scoprire",
    pastParticiple: "scoperto",
    presentParticiple: "scoprente",
    gerund: "scoprendo",
    indicative: {
      presente: [
        "scopro",
        "scopri",
        "scopre",
        "scopriamo",
        "scoprite",
        "scoprono",
      ],
      imperfetto: [
        "scoprivo",
        "scoprivi",
        "scopriva",
        "scoprivamo",
        "scoprivate",
        "scoprivano",
      ],
      passatoRemoto: [
        "scoprii / scopersi",
        "scopristi",
        "scoprì / scoperse",
        "scoprimmo",
        "scopriste",
        "scoprirono / scopersero",
      ],
      futuroSemplice: [
        "scoprirò",
        "scoprirai",
        "scoprirà",
        "scopriremo",
        "scoprirete",
        "scopriranno",
      ],
    },
    subjunctive: {
      presente: [
        "scopra",
        "scopra",
        "scopra",
        "scopriamo",
        "scopriate",
        "scoprano",
      ],
      imperfetto: [
        "scoprissi",
        "scoprissi",
        "scoprisse",
        "scoprissimo",
        "scopriste",
        "scoprissero",
      ],
    },
    conditional: [
      "scoprirei",
      "scopriresti",
      "scoprirebbe",
      "scopriremmo",
      "scoprireste",
      "scoprirebbero",
    ],
    imperative: ["—", "scopri", "scopra", "scopriamo", "scoprite", "scoprano"],
  }),
  viaggiare: paradigm({
    infinitive: "viaggiare",
    pastParticiple: "viaggiato",
    presentParticiple: "viaggiante",
    gerund: "viaggiando",
    indicative: {
      presente: [
        "viaggio",
        "viaggi",
        "viaggia",
        "viaggiamo",
        "viaggiate",
        "viaggiano",
      ],
      imperfetto: [
        "viaggiavo",
        "viaggiavi",
        "viaggiava",
        "viaggiavamo",
        "viaggiavate",
        "viaggiavano",
      ],
      passatoRemoto: [
        "viaggiai",
        "viaggiasti",
        "viaggiò",
        "viaggiammo",
        "viaggiaste",
        "viaggiarono",
      ],
      futuroSemplice: [
        "viaggerò",
        "viaggerai",
        "viaggerà",
        "viaggeremo",
        "viaggerete",
        "viaggeranno",
      ],
    },
    subjunctive: {
      presente: [
        "viaggi",
        "viaggi",
        "viaggi",
        "viaggiamo",
        "viaggiate",
        "viaggino",
      ],
      imperfetto: [
        "viaggiassi",
        "viaggiassi",
        "viaggiasse",
        "viaggiassimo",
        "viaggiaste",
        "viaggiassero",
      ],
    },
    conditional: [
      "viaggerei",
      "viaggeresti",
      "viaggerebbe",
      "viaggeremmo",
      "viaggereste",
      "viaggerebbero",
    ],
    imperative: [
      "—",
      "viaggia",
      "viaggi",
      "viaggiamo",
      "viaggiate",
      "viaggino",
    ],
  }),
  lasciare: paradigm({
    infinitive: "lasciare",
    pastParticiple: "lasciato",
    presentParticiple: "lasciante",
    gerund: "lasciando",
    indicative: {
      presente: [
        "lascio",
        "lasci",
        "lascia",
        "lasciamo",
        "lasciate",
        "lasciano",
      ],
      imperfetto: [
        "lasciavo",
        "lasciavi",
        "lasciava",
        "lasciavamo",
        "lasciavate",
        "lasciavano",
      ],
      passatoRemoto: [
        "lasciai",
        "lasciasti",
        "lasciò",
        "lasciammo",
        "lasciaste",
        "lasciarono",
      ],
      futuroSemplice: [
        "lascerò",
        "lascerai",
        "lascerà",
        "lasceremo",
        "lascerete",
        "lasceranno",
      ],
    },
    subjunctive: {
      presente: ["lasci", "lasci", "lasci", "lasciamo", "lasciate", "lascino"],
      imperfetto: [
        "lasciassi",
        "lasciassi",
        "lasciasse",
        "lasciassimo",
        "lasciaste",
        "lasciassero",
      ],
    },
    conditional: [
      "lascerei",
      "lasceresti",
      "lascerebbe",
      "lasceremmo",
      "lascereste",
      "lascerebbero",
    ],
    imperative: ["—", "lascia", "lasci", "lasciamo", "lasciate", "lascino"],
  }),
};

function word(partOfSpeech, meaning, lemma, grammar, verb = null, verbForm = null) {
  return { partOfSpeech, meaning, lemma, grammar, verb, verbForm };
}

export const DICTIONARY = {
  ogni: word(
    "Determiner",
    "every / each",
    "ogni",
    "An invariable indefinite determiner used with a singular noun.",
  ),
  mattina: word(
    "Noun",
    "morning",
    "mattina",
    "Feminine singular noun. Ogni mattina means every morning.",
  ),
  sofia: word(
    "Proper noun",
    "Sofia",
    "Sofia",
    "A person’s name. Sofia is the subject of the first sentence.",
  ),
  legge: word(
    "Verb",
    "she / he reads",
    "leggere",
    "Third-person singular, present indicative of leggere (to read).",
    "leggere",
    { mood: "indicativo", tense: "presente", person: "lui / lei" },
  ),
  qualche: word(
    "Determiner",
    "some / a few",
    "qualche",
    "An indefinite determiner followed by a singular noun. Qualche pagina means a few pages.",
  ),
  pagina: word(
    "Noun",
    "page",
    "pagina",
    "Feminine singular noun; the plural is pagine.",
  ),
  prima: word(
    "Adverb",
    "before",
    "prima",
    "Used with di to form prima di (before). Prima del caffè means before coffee.",
  ),
  del: word(
    "Preposition",
    "of the",
    "di + il",
    "Combines di with the masculine singular article il. Here, prima del caffè means before coffee.",
  ),
  caffè: word(
    "Noun",
    "coffee",
    "caffè",
    "Masculine noun. Its spelling stays the same in the singular and plural.",
  ),
  tra: word(
    "Preposition",
    "between / among",
    "tra",
    "Introduces a position or relationship. Tra le righe means between the lines.",
  ),
  le: word(
    "Article",
    "the",
    "le",
    "Feminine plural definite article, agreeing with righe.",
  ),
  righe: word(
    "Noun",
    "lines",
    "riga",
    "Feminine plural of riga. Tra le righe means between the lines.",
  ),
  scopre: word(
    "Verb",
    "she / he discovers",
    "scoprire",
    "Third-person singular, present indicative of scoprire (to discover).",
    "scoprire",
    { mood: "indicativo", tense: "presente", person: "lui / lei" },
  ),
  un: word(
    "Article",
    "a / an",
    "un",
    "Masculine singular indefinite article, used here with mondo and momento.",
  ),
  mondo: word(
    "Noun",
    "world",
    "mondo",
    "Masculine singular noun; the plural is mondi.",
  ),
  nuovo: word(
    "Adjective",
    "new",
    "nuovo",
    "Masculine singular adjective agreeing with mondo. Other forms: nuova, nuovi, nuove.",
  ),
  e: word(
    "Conjunction",
    "and",
    "e",
    "Connects words or sentences. The unaccented e means and; è with an accent means is.",
  ),
  per: word("Preposition", "for", "per", "Per un momento means for a moment."),
  momento: word(
    "Noun",
    "moment",
    "momento",
    "Masculine singular noun; the plural is momenti.",
  ),
  viaggia: word(
    "Verb",
    "she / he travels",
    "viaggiare",
    "Third-person singular, present indicative of viaggiare (to travel).",
    "viaggiare",
    { mood: "indicativo", tense: "presente", person: "lui / lei" },
  ),
  lontano: word(
    "Adverb",
    "far away",
    "lontano",
    "An adverb describing the distance travelled. It modifies viaggia in this sentence.",
  ),
  senza: word(
    "Preposition",
    "without",
    "senza",
    "Before an infinitive, senza describes an action that does not happen: senza lasciare, without leaving.",
  ),
  lasciare: word(
    "Verb",
    "to leave",
    "lasciare",
    "Present infinitive of lasciare. Senza lasciare casa means without leaving home.",
    "lasciare",
    { mood: "infinito", tense: "presente", person: "forma" },
  ),
  casa: word(
    "Noun",
    "home / house",
    "casa",
    "Feminine singular noun. Lasciare casa means to leave home.",
  ),
};
