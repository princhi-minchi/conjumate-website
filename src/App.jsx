import { useState } from "react";
import {
  ArrowUp,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Command,
  Menu,
  MousePointer2,
  Plus,
  X,
} from "lucide-react";
import logo from "./logo2.png";
import LookupPreview from "./LookupPreview";
import ThemeToggle from "./ThemeToggle";
import {
  CHROME_STORE_URL,
  PRIVACY_POLICY_URL,
  faqs,
  languages,
} from "./content";

function ChromeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="chrome-icon"
    >
      <path
        d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L4.78 4.5A9.96 9.96 0 0 1 12 2Z"
        fill="#EA4335"
      />
      <path
        d="M20.66 7a10 10 0 0 1-8.66 15l4.33-7.5A5 5 0 0 0 12 7h8.66Z"
        fill="#FBBC05"
      />
      <path
        d="M12 22A10 10 0 0 1 4.78 4.5l4.33 7.5a5 5 0 0 0 7.22 2.5L12 22Z"
        fill="#34A853"
      />
      <circle cx="12" cy="12" r="4.5" fill="#4285F4" stroke="white" />
    </svg>
  );
}

function InstallLink({ className = "", compact = false }) {
  return (
    <a
      className={`button button-primary ${className}`}
      href={CHROME_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {!compact && <ChromeIcon />}Add to Chrome
      {compact ? (
        <ArrowUpRight size={16} aria-hidden="true" />
      ) : (
        <ArrowRight size={18} aria-hidden="true" />
      )}
    </a>
  );
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="ConjuMate home">
      <img src={logo} alt="" width="403" height="481" />
      <span>
        Conju<span className="brand-accent">Mate</span>
      </span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu();
      }}
    >
      <div className="header-inner container">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#languages">Languages</a>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <InstallLink compact className="header-install" />
          <button
            className="menu-toggle icon-button"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-menu"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          <a href="#how-it-works" onClick={closeMenu}>
            How it works <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a href="#languages" onClick={closeMenu}>
            Languages <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <InstallLink />
        </nav>
      )}
    </header>
  );
}

function InstallIllustration() {
  return (
    <div
      className="step-illustration install-illustration"
      role="img"
      aria-label="Chrome Web Store shopping bag with the Chrome logo"
    >
      <div className="store-bag">
        <ChromeIcon />
      </div>
      <span>Chrome Web Store</span>
    </div>
  );
}

function ShortcutIllustration() {
  return (
    <div
      className="step-illustration shortcut-illustration"
      role="img"
      aria-label="Hold Ctrl or Command and click the highlighted Italian verb legge"
    >
      <div className="shortcut-keys">
        <kbd>Ctrl</kbd>
        <span>/</span>
        <kbd>
          <Command size={18} aria-hidden="true" />
        </kbd>
        <Plus size={16} aria-hidden="true" />
        <MousePointer2 size={19} aria-hidden="true" />
      </div>
      <div className="shortcut-example" lang="it">
        Sofia <mark>legge</mark> ogni mattina.
        <MousePointer2 size={22} aria-hidden="true" />
      </div>
    </div>
  );
}

function ResultIllustration() {
  return (
    <div
      className="step-illustration result-illustration"
      role="img"
      aria-label="Example lookup: legge means she or he reads; io leggo and tu leggi are two conjugations of leggere"
    >
      <div className="result-reading-lines" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="result-example">
        <div className="result-example-heading">
          <strong lang="it">legge</strong>
          <span lang="it">leggere</span>
        </div>
        <span className="result-example-meaning">she / he reads</span>
        <div className="result-example-forms" lang="it">
          <span>
            io <b>leggo</b>
          </span>
          <span>
            tu <b>leggi</b>
          </span>
        </div>
        <span className="result-check">
          <Check size={14} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-heading">
          <div className="hero-glow" aria-hidden="true" />
          <div className="container hero-inner">
            <h1 id="hero-heading">
              Conjugate and Translate,
              <br />
              <span>Without Changing Tabs</span>
            </h1>
            <p className="hero-description">
              Instant translations and verb conjugations, right where you read.
            </p>
            <div className="hero-actions">
              <InstallLink />
            </div>
            <LookupPreview />
          </div>
        </section>
        <section
          className="how-section section-space"
          id="how-it-works"
          aria-labelledby="how-heading"
        >
          <div className="container how-grid">
            <div className="how-copy">
              <h2 id="how-heading">A new word. A familiar feeling.</h2>
              <p className="section-description">
                ConjuMate fits into the way you already browse. Here’s how to
                get started.
              </p>
              <ol className="steps">
                <li>
                  <InstallIllustration />
                  <div className="step-copy">
                    <span className="step-number">01</span>
                    <div>
                      <h3>Make yourself at home</h3>
                      <p>Add ConjuMate to Chrome from the Chrome Web Store.</p>
                    </div>
                  </div>
                </li>
                <li>
                  <ShortcutIllustration />
                  <div className="step-copy">
                    <span className="step-number">02</span>
                    <div>
                      <h3>Find a word that sparks curiosity</h3>
                      <p>
                        Read something in Italian. Use Cmd/Ctrl + Click on a
                        word to look it up.
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <ResultIllustration />
                  <div className="step-copy">
                    <span className="step-number">03</span>
                    <div>
                      <h3>Understand it. Keep reading.</h3>
                      <p>
                        See its meaning, explore the conjugations, and pick up
                        right where you left off.
                      </p>
                    </div>
                  </div>
                </li>
              </ol>
              <a
                className="text-link"
                href={CHROME_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Give your next read a little help{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
        <section
          className="languages-section section-space container"
          id="languages"
          aria-labelledby="languages-heading"
        >
          <div className="section-heading">
            <h2 id="languages-heading">
              Four languages.
              <br />A world of stories.
            </h2>
            <p>
              Start exploring Italian today.
              <br />
              Spanish, French, and Portuguese are on the way.
            </p>
          </div>
          <div className="language-grid">
            {languages.map((language) => (
              <article
                key={language.name}
                className={`language-card ${language.available ? "available" : ""}`}
              >
                <span
                  className="language-flag"
                  role="img"
                  aria-label={`${language.name} flag`}
                >
                  {language.flag}
                </span>
                <span className="language-greeting" lang={language.code}>
                  {language.greeting}
                </span>
                <h3>{language.name}</h3>
                <span
                  className={`availability ${language.available ? "live" : ""}`}
                >
                  {language.available && <span className="status-dot" />}
                  {language.available ? "Available now" : "Coming soon"}
                </span>
              </article>
            ))}
          </div>
        </section>
        <section
          className="faq-section section-space container"
          aria-labelledby="faq-heading"
        >
          <div className="faq-intro">
            <span className="eyebrow">A FEW THINGS TO KNOW</span>
            <h2 id="faq-heading">
              Curious? <br />
              Good.
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <ChevronDown size={19} aria-hidden="true" />
                </summary>
                <div className="faq-answer">
                  {faq.answer}
                  {faq.privacy && (
                    <>
                      {" "}
                      Read the{" "}
                      <a
                        href={PRIVACY_POLICY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        privacy policy{" "}
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>{" "}
                      for details.
                    </>
                  )}
                </div>
              </details>
            ))}
          </div>
        </section>
        <section
          className="closing-section container"
          aria-labelledby="closing-heading"
        >
          <h2 id="closing-heading">
            Your next “aha”
            <br />
            is a click away.
          </h2>
          <InstallLink />
        </section>
      </main>
      <footer className="site-footer container">
        <div>
          <Brand />
        </div>
        <nav aria-label="Footer navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#languages">Languages</a>
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy policy <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </nav>
        <span className="copyright">
          © {new Date().getFullYear()} ConjuMate
        </span>
      </footer>
      <a className="back-to-top" href="#top" aria-label="Back to top">
        <ArrowUp size={18} aria-hidden="true" />
      </a>
    </>
  );
}

export default App;
