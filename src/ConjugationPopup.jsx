import { useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import { MOODS, TENSE_LABELS, VERBS } from "./demo-data";

const INFINITIVE_MEANINGS = {
  leggere: "to read",
  scoprire: "to discover",
  viaggiare: "to travel",
  lasciare: "to leave",
};

function CycleControl({ label, choices, value, onChange }) {
  const index = choices.findIndex((choice) => choice.id === value);
  function move(direction) {
    onChange(choices[(index + direction + choices.length) % choices.length].id);
  }
  return (
    <div
      className="popup-cycle"
      role="group"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <button
        type="button"
        aria-label={`Previous ${label.toLowerCase()}`}
        onClick={() => move(-1)}
      >
        <ChevronLeft size={21} aria-hidden="true" />
      </button>
      <span className="popup-cycle-value" lang="it">
        {choices[index].label}
      </span>
      <button
        type="button"
        aria-label={`Next ${label.toLowerCase()}`}
        onClick={() => move(1)}
      >
        <ChevronRight size={21} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ConjugationPopup({
  popupRef,
  paragraphRef,
  selected,
  entry,
  sentence,
  mood,
  tense,
  onMoodChange,
  onTenseChange,
  bookmarked,
  onBookmark,
}) {
  // A viewport-positioned portal floats over the article without changing the
  // preview's layout or being clipped by its browser frame.
  useLayoutEffect(() => {
    const popup = popupRef.current;
    const word = paragraphRef.current?.querySelector(
      `[data-demo-word="${selected.wordIndex}"]`,
    );
    if (!popup || !word) return;
    const anchor = word.getBoundingClientRect();
    const { width, height } = popup.getBoundingClientRect();
    const gutter = 12;
    const left = Math.max(
      gutter,
      Math.min(anchor.left - 20, window.innerWidth - width - gutter),
    );
    const below = anchor.bottom + 10;
    const above = anchor.top - height - 10;
    const preferredTop =
      below + height <= window.innerHeight - gutter
        ? below
        : above >= gutter
          ? above
          : below;
    const top = Math.max(
      gutter,
      Math.min(preferredTop, window.innerHeight - height - gutter),
    );
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.visibility = "visible";
    // Keep the contextual form visible even in a short viewport. Scroll only
    // the popup so the selected word and the article remain in place.
    const currentRow = popup.querySelector(".current-form");
    if (currentRow) {
      const rowBounds = currentRow.getBoundingClientRect();
      const popupBounds = popup.getBoundingClientRect();
      if (rowBounds.bottom > popupBounds.bottom - 16) {
        popup.scrollTop += rowBounds.bottom - popupBounds.bottom + 16;
      } else if (rowBounds.top < popupBounds.top + 16) {
        popup.scrollTop -= popupBounds.top + 16 - rowBounds.top;
      }
    }
  }, [popupRef, paragraphRef, selected.wordIndex, mood, tense]);

  const currentMood = MOODS.find((item) => item.id === mood);
  const rows = entry.verb ? VERBS[entry.verb][mood][tense] : [];
  return createPortal(
    <section
      ref={popupRef}
      className="conjumate-popup"
      role="dialog"
      aria-label={`ConjuMate lookup for ${selected.text}`}
      aria-describedby="popup-dismiss-help"
      style={{ visibility: "hidden" }}
    >
      <p id="popup-dismiss-help" className="sr-only">
        Click outside the popup or press Escape to close it.
      </p>
      <button
        type="button"
        className={`popup-bookmark ${bookmarked ? "is-saved" : ""}`}
        aria-label={bookmarked ? "Unsave word" : "Save word"}
        aria-pressed={bookmarked}
        onClick={onBookmark}
      >
        <Bookmark
          size={19}
          aria-hidden="true"
          fill={bookmarked ? "currentColor" : "none"}
        />
      </button>
      <div className="popup-heading" aria-live="polite" aria-atomic="true">
        <div>
          <h3 lang="it">{selected.text}</h3>
          <p className="popup-meaning">{entry.meaning}</p>
        </div>
        <div>
          <p className="popup-lemma" lang="it">
            {entry.lemma}
          </p>
          <p className="popup-infinitive-meaning">
            {entry.verb ? INFINITIVE_MEANINGS[entry.verb] : entry.partOfSpeech}
          </p>
        </div>
      </div>
      {entry.verb ? (
        <>
          <div className="popup-navigation">
            <CycleControl
              label="Mood"
              choices={MOODS}
              value={mood}
              onChange={onMoodChange}
            />
            <CycleControl
              label="Tense"
              choices={currentMood.tenses.map((id) => ({
                id,
                label: TENSE_LABELS[id],
              }))}
              value={tense}
              onChange={onTenseChange}
            />
          </div>
          <p className="sr-only" role="status">
            Showing {currentMood.label}, {TENSE_LABELS[tense]} for {entry.lemma}
            .
          </p>
          <dl
            className="popup-conjugations"
            lang="it"
            aria-label={`${currentMood.label}: ${TENSE_LABELS[tense]}`}
            style={{ "--conjugation-rows": Math.ceil(rows.length / 2) }}
          >
            {rows.map(([person, form]) => {
              const isCurrentForm =
                entry.verbForm?.mood === mood &&
                entry.verbForm?.tense === tense &&
                entry.verbForm?.person === person;
              return (
                <div
                  key={person}
                  className={isCurrentForm ? "current-form" : ""}
                  aria-current={isCurrentForm ? "true" : undefined}
                >
                  <dt>{person.replaceAll(" / ", "/")}</dt>
                  <dd>{form}</dd>
                </div>
              );
            })}
          </dl>
          {mood === "imperativo" && (
            <p className="popup-grammar-note">
              — No first-person singular imperative.
            </p>
          )}
        </>
      ) : (
        <div className="popup-word-grammar">
          <p>{entry.grammar}</p>
          <p className="popup-sentence">{sentence}</p>
        </div>
      )}
    </section>,
    document.body,
  );
}
