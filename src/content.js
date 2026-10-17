export const CHROME_STORE_URL =
  "https://chromewebstore.google.com/detail/conjumate-translator-and/lddadpilkaeiijmioafidgdngomiknmn?authuser=0&hl=en";
export const PRIVACY_POLICY_URL =
  "https://github.com/princhi-minchi/conjumate-legal/blob/main/PRIVACY_POLICY.md";

export const languages = [
  {
    name: "Italian",
    code: "it",
    greeting: "Ciao!",
    flag: "🇮🇹",
    available: true,
  },
  {
    name: "Spanish",
    code: "es",
    greeting: "¡Hola!",
    flag: "🇪🇸",
    available: false,
  },
  {
    name: "French",
    code: "fr",
    greeting: "Bonjour!",
    flag: "🇫🇷",
    available: false,
  },
  {
    name: "Portuguese",
    code: "pt",
    greeting: "Olá!",
    flag: "🇵🇹",
    available: false,
  },
];

export const faqs = [
  {
    question: "What is ConjuMate?",
    answer:
      "ConjuMate is a Chrome extension that helps you understand words while browsing. Look up translations and explore verb conjugations without leaving the page you’re reading.",
  },
  {
    question: "How do I use it?",
    answer:
      "Install ConjuMate from the Chrome Web Store, open a page in Italian, and use Cmd + Click on Mac or Ctrl + Click on Windows or Linux to look up a word.",
  },
  {
    question: "Which languages can I use today?",
    answer:
      "Italian is available now. We’re preparing support for Spanish, French, and Portuguese. These three languages are coming soon and aren’t available in the current extension.",
  },
  {
    question: "Is ConjuMate free to use?",
    answer:
      "ConjuMate offers free translation and conjugation lookups with daily usage limits. See the Chrome Web Store listing for current product details.",
  },
  {
    question: "What happens to the text I look up?",
    answer:
      "When you perform a lookup, your selected text and its surrounding sentence are sent to the service to provide translations and conjugations. The extension also uses an anonymous identifier to manage daily usage limits.",
    privacy: true,
  },
];
