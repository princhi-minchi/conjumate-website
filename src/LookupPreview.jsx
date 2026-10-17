import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, MousePointer2, ShieldCheck } from "lucide-react";
import {
  DICTIONARY,
  MOODS,
  SAMPLE_SENTENCES,
  SAMPLE_TOKENS,
  SAMPLE_WORDS,
  normalizeWord,
} from "./demo-data";
import ConjugationPopup from "./ConjugationPopup";

const INITIAL_WORD = SAMPLE_WORDS.find(
  (token) => token.text === "legge",
).wordIndex;

export default function LookupPreview() {
  const [selectedIndex, setSelectedIndex] = useState(INITIAL_WORD);
  const [focusedIndex, setFocusedIndex] = useState(INITIAL_WORD);
  const [isOpen, setIsOpen] = useState(false);
  const [savedWords, setSavedWords] = useState(() => new Set());
  const [mood, setMood] = useState("indicativo");
  const [tense, setTense] = useState("presente");
  const [selectionNotice, setSelectionNotice] = useState("");
  const paragraphRef = useRef(null);
  const popupRef = useRef(null);
  const pointerTypeRef = useRef("mouse");
  const selected = SAMPLE_WORDS[selectedIndex];
  const entry = DICTIONARY[normalizeWord(selected.text)];

  useEffect(() => {
    if (!isOpen) return;
    function dismiss() {
      setIsOpen(false);
      setSelectionNotice("");
      window.getSelection()?.removeAllRanges();
    }
    function outsidePointer(event) {
      if (popupRef.current?.contains(event.target)) return;
      const word = event.target.closest?.("[data-demo-word]");
      if (word && paragraphRef.current?.contains(word)) return;
      dismiss();
    }
    function escapeKey(event) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      const focusWasInside = popupRef.current?.contains(document.activeElement);
      dismiss();
      if (focusWasInside) paragraphRef.current?.focus({ preventScroll: true });
    }
    function outsideScroll(event) {
      if (!popupRef.current?.contains(event.target)) dismiss();
    }
    document.addEventListener("pointerdown", outsidePointer, true);
    document.addEventListener("keydown", escapeKey);
    document.addEventListener("scroll", outsideScroll, true);
    window.addEventListener("resize", dismiss);
    return () => {
      document.removeEventListener("pointerdown", outsidePointer, true);
      document.removeEventListener("keydown", escapeKey);
      document.removeEventListener("scroll", outsideScroll, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [isOpen]);

  function selectWord(index) {
    const nextEntry = DICTIONARY[normalizeWord(SAMPLE_WORDS[index].text)];
    if (nextEntry.verbForm) {
      setMood(nextEntry.verbForm.mood);
      setTense(nextEntry.verbForm.tense);
    }
    setSelectedIndex(index);
    setFocusedIndex(index);
    setIsOpen(true);
    setSelectionNotice("");
  }

  // Native text selection is deliberately preserved. Only selections confined
  // to this paragraph can update its lookup, and punctuation is not a word.
  function lookupSelection() {
    const selection = window.getSelection();
    const paragraph = paragraphRef.current;
    if (
      !selection ||
      selection.isCollapsed ||
      !paragraph?.contains(selection.anchorNode) ||
      !paragraph.contains(selection.focusNode)
    )
      return false;
    const text = selection
      .toString()
      .trim()
      .replace(/^[^\p{L}\p{M}]+|[^\p{L}\p{M}]+$/gu, "");
    if (!text) return false;
    if (!/^[\p{L}\p{M}]+$/u.test(text)) {
      setSelectionNotice("Highlight one word at a time to look it up.");
      return true;
    }
    const touched = [...paragraph.querySelectorAll("[data-demo-word]")].filter(
      (element) => selection.containsNode(element, true),
    );
    const target =
      touched.find(
        (element) => normalizeWord(element.textContent) === normalizeWord(text),
      ) || (touched.length === 1 ? touched[0] : null);
    if (target) selectWord(Number(target.dataset.demoWord));
    return true;
  }

  function clickWord(event, index) {
    if (
      pointerTypeRef.current === "mouse" &&
      event.detail > 0 &&
      lookupSelection()
    )
      return;
    if (pointerTypeRef.current !== "mouse")
      window.getSelection()?.removeAllRanges();
    selectWord(index);
  }

  function wordKeyDown(event, index) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      window.getSelection()?.removeAllRanges();
      selectWord(index);
      requestAnimationFrame(() =>
        popupRef.current?.querySelector("button")?.focus(),
      );
      return;
    }
    if (event.key === "ArrowDown" && isOpen) {
      event.preventDefault();
      popupRef.current?.querySelector("button")?.focus();
      return;
    }
    if (event.shiftKey) return;
    const next =
      event.key === "ArrowRight"
        ? Math.min(index + 1, SAMPLE_WORDS.length - 1)
        : event.key === "ArrowLeft"
          ? Math.max(index - 1, 0)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? SAMPLE_WORDS.length - 1
              : null;
    if (next !== null) {
      event.preventDefault();
      setFocusedIndex(next);
    }
  }

  function changeMood(nextMood) {
    setMood(nextMood);
    const options = MOODS.find((item) => item.id === nextMood).tenses;
    if (!options.includes(tense)) setTense(options[0]);
  }

  return (
    <div className="preview-scene">
      <div className="browser-preview">
        <div className="browser-toolbar">
          <div className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <div className="browser-address">
            <ShieldCheck size={13} aria-hidden="true" />
            <span>Your reading, uninterrupted</span>
          </div>
          <span className="browser-toolbar-label">Interactive preview</span>
        </div>
        <div className="preview-content">
          <article className="reading-sample" lang="it">
            <h2>
              Il piacere delle
              <br />
              piccole cose.
            </h2>
            <p
              ref={paragraphRef}
              className="sample-paragraph"
              role="listbox"
              tabIndex={0}
              aria-label="Words in the Italian sample"
              aria-orientation="horizontal"
              aria-activedescendant={`demo-word-${focusedIndex}`}
              aria-describedby="sample-keyboard-help sample-lookup-help"
              onKeyDown={(event) => wordKeyDown(event, focusedIndex)}
              onPointerDown={(event) => {
                pointerTypeRef.current = event.pointerType;
              }}
              onPointerUp={(event) => {
                if (event.pointerType === "mouse") lookupSelection();
              }}
              onDoubleClick={lookupSelection}
              onKeyUp={lookupSelection}
            >
              {SAMPLE_TOKENS.map((token, index) =>
                token.isWord ? (
                  <span
                    key={index}
                    role="option"
                    id={`demo-word-${token.wordIndex}`}
                    data-demo-word={token.wordIndex}
                    className={`sample-word ${DICTIONARY[normalizeWord(token.text)].verb ? "sample-verb" : ""} ${isOpen && selectedIndex === token.wordIndex ? "selected" : ""} ${focusedIndex === token.wordIndex ? "keyboard-current" : ""}`}
                    aria-selected={isOpen && selectedIndex === token.wordIndex}
                    onClick={(event) => clickWord(event, token.wordIndex)}
                  >
                    {token.text}
                  </span>
                ) : (
                  token.text
                ),
              )}
            </p>
            <p id="sample-keyboard-help" className="sr-only" lang="en">
              Use Left and Right arrow keys to move between words, then Enter to
              look up a word. Home and End move to the first and last word.
              Press Down to enter an open popup and Escape to close it.
            </p>
            <div id="sample-lookup-help" className="preview-hint" lang="en">
              <MousePointer2 size={20} aria-hidden="true" />
              <span className="selection-desktop-hint">
                Highlight any word to look it up.
              </span>
              <span className="selection-touch-hint">
                Tap any word to look it up.
              </span>
            </div>
            <p className="selection-notice" role="status" lang="en">
              {selectionNotice}
            </p>
          </article>
        </div>
        <div className="browser-bottom">
          <BookOpen size={14} aria-hidden="true" /> Illustrative demo
        </div>
      </div>
      {isOpen && (
        <ConjugationPopup
          popupRef={popupRef}
          paragraphRef={paragraphRef}
          selected={selected}
          entry={entry}
          sentence={SAMPLE_SENTENCES[selected.sentenceIndex].english}
          mood={mood}
          tense={tense}
          onMoodChange={changeMood}
          onTenseChange={setTense}
          bookmarked={savedWords.has(normalizeWord(selected.text))}
          onBookmark={() =>
            setSavedWords((previous) => {
              const next = new Set(previous);
              const key = normalizeWord(selected.text);
              if (next.has(key)) next.delete(key);
              else next.add(key);
              return next;
            })
          }
        />
      )}
      <span className="floating-note">
        <Check size={14} aria-hidden="true" /> No new tab needed
      </span>
    </div>
  );
}
