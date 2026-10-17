import test from "node:test";
import assert from "node:assert/strict";
import {
  DICTIONARY,
  MOODS,
  SAMPLE_SENTENCES,
  SAMPLE_TOKENS,
  SAMPLE_WORDS,
  VERBS,
  normalizeWord,
} from "../src/demo-data.js";

test("every word occurrence, including accented words and the fourth verb, has a contextual lookup", () => {
  assert.equal(
    SAMPLE_TOKENS.map((token) => token.text).join(""),
    SAMPLE_SENTENCES.map((sentence) => sentence.italian).join(" "),
  );
  SAMPLE_WORDS.forEach((token, index) => {
    assert.equal(token.wordIndex, index);
    const entry = DICTIONARY[normalizeWord(token.text)];
    assert.ok(
      entry?.meaning && entry.grammar && entry.partOfSpeech,
      token.text,
    );
    assert.ok(SAMPLE_SENTENCES[token.sentenceIndex].english);
    if (entry.verb) assert.ok(VERBS[entry.verb]);
  });
  assert.equal(DICTIONARY[normalizeWord("CAFFE\u0300")].meaning, "coffee");
  assert.equal(DICTIONARY.lasciare.verb, "lasciare");
  assert.equal(DICTIONARY.righe.lemma, "riga");
});

test("all four verbs cover all seven moods and 21 mood/tense combinations", () => {
  assert.equal(Object.keys(VERBS).length, 4);
  assert.equal(MOODS.length, 7);
  assert.equal(MOODS.flatMap((mood) => mood.tenses).length, 21);
  for (const [verb, paradigm] of Object.entries(VERBS)) {
    for (const mood of MOODS) {
      for (const tense of mood.tenses) {
        const rows = paradigm[mood.id][tense];
        assert.ok(rows?.length, `${verb} ${mood.id} ${tense}`);
        assert.ok(rows.every(([person, form]) => person && form));
        if (
          ["indicativo", "congiuntivo", "condizionale", "imperativo"].includes(
            mood.id,
          )
        )
          assert.equal(rows.length, 6);
      }
    }
  }
});

test("sample verbs open at their contextual mood, tense, and person", () => {
  const verbs = SAMPLE_WORDS.filter(
    (token) => DICTIONARY[normalizeWord(token.text)].verb,
  );
  assert.deepEqual(verbs.map((token) => token.text), [
    "legge", "scopre", "viaggia", "lasciare",
  ]);
  for (const token of verbs) {
    const entry = DICTIONARY[normalizeWord(token.text)];
    const expectedMood = token.text === "lasciare" ? "infinito" : "indicativo";
    assert.equal(entry.verbForm.mood, expectedMood);
    assert.equal(entry.verbForm.tense, "presente");
    const row = VERBS[entry.verb][expectedMood].presente.find(
      ([person]) => person === entry.verbForm.person,
    );
    assert.equal(row?.[1], token.text);
  }
  assert.equal(DICTIONARY.caffè.verbForm, null);
});

test("irregular and spelling-sensitive reference forms remain correct", () => {
  assert.deepEqual(
    VERBS.leggere.indicativo.passatoRemoto.map((row) => row[1]),
    ["lessi", "leggesti", "lesse", "leggemmo", "leggeste", "lessero"],
  );
  assert.equal(
    VERBS.scoprire.indicativo.passatoRemoto[5][1],
    "scoprirono / scopersero",
  );
  assert.equal(VERBS.viaggiare.indicativo.futuroSemplice[0][1], "viaggerò");
  assert.equal(VERBS.lasciare.condizionale.presente[0][1], "lascerei");
  assert.equal(VERBS.viaggiare.congiuntivo.presente[5][1], "viaggino");
  assert.equal(VERBS.lasciare.imperativo.presente[0][1], "—");
});

test("compound and non-finite forms use the correct auxiliary and participle", () => {
  assert.equal(VERBS.leggere.indicativo.passatoProssimo[0][1], "ho letto");
  assert.equal(
    VERBS.scoprire.indicativo.trapassatoRemoto[2][1],
    "ebbe scoperto",
  );
  assert.equal(
    VERBS.viaggiare.congiuntivo.trapassato[3][1],
    "avessimo viaggiato",
  );
  assert.equal(VERBS.lasciare.condizionale.passato[5][1], "avrebbero lasciato");
  assert.equal(VERBS.leggere.infinito.passato[0][1], "avere letto");
  assert.equal(VERBS.viaggiare.gerundio.passato[0][1], "avendo viaggiato");
  assert.deepEqual(
    VERBS.scoprire.participio.passato.map((row) => row[1]),
    ["scoperto", "scoperta", "scoperti", "scoperte"],
  );
});
