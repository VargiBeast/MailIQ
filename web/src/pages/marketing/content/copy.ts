import { DELETE_ACCOUNT_PHRASE } from "@shared/settings";

/**
 * Phase 4 marketing copy, in one place so claims can be checked against
 * README.md, web/src/pages/Legal.tsx, and docs/SECURITY.md.
 *
 * Pricing is omitted on purpose. The terms say MailIQ is a preview and do not
 * state a price, so "no pricing has been announced" is not a sentence we can
 * treat as a published fact.
 */

export const navLinks = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#privacy", label: "Privacy" },
  { href: "#faq", label: "FAQ" },
] as const;

export const aiFeatures = {
  id: "features",
  eyebrow: "Reading",
  title: "Summaries that get to the point",
  lede: "Open a thread and MailIQ can summarize it: a short read, then the key points, action items and deadlines. You review every reply before it is sent.",
  items: [
    {
      title: "Key points, actions and deadlines",
      text: "A thread summary can pull out what matters, what to do, and when it is due.",
    },
    {
      title: "Quick replies",
      text: "Suggested replies fill an editable draft. Nothing is sent until you press Send and confirm.",
    },
    {
      title: "Explain this email simply",
      text: "Ask for a plain-language explanation, or ask a question about that specific thread.",
    },
    {
      title: "Rewrite",
      text: "Make a draft shorter or longer, fix spelling and grammar, or change the tone to professional, friendly, concise, warm or formal.",
    },
    {
      title: "Long-thread digest",
      text: "On conversations with four or more messages, the summary adds who wants what, what has been decided, and what is still open.",
    },
  ],
} as const;

export const dailyBrief = {
  eyebrow: "Morning",
  title: "A brief when you open MailIQ",
  lede: "The first time you open MailIQ on a day, Copilot can write a short brief in your language: important new mail, what is waiting on your reply, and what looks safe to archive.",
  points: [
    "It sits at the top of the inbox and in the AI Overview. You can turn it off in Settings.",
    "Archive asks you to confirm, and you can undo it. Starred or important mail is never suggested for archiving.",
    "Your privacy exclusions apply. The brief is generated when you open the app, cached encrypted for that day, and cleared when you clear AI history.",
  ],
} as const;

export const unifiedInbox = {
  eyebrow: "Mail",
  title: "Every mailbox in one list",
  lede: "Read more than one connected account in a single inbox, with folders, labels and categories.",
  points: [
    "Gmail accounts share one list, with Primary, Promotions, Social, Updates and Forums.",
    "Folders include Inbox, Starred, Important, Sent, Drafts, Archive, Spam, Trash and All mail, plus the labels on that mailbox.",
    "Outlook / Microsoft 365 and IMAP can be added only when the operator enables them. If they are off, they are not available.",
  ],
} as const;

export const searchSection = {
  eyebrow: "Search",
  title: "Search the way you think",
  lede: "Ask in everyday language. MailIQ turns the sentence into a mailbox query and shows you that query.",
  points: [
    "“Invoice I got last month” becomes a precise search. On Gmail, the generated Gmail query is visible before you rely on it.",
    "Ask your inbox runs up to three searches, each checked against an allowlist of operators, then answers with links to the messages it used. If nothing matches, it says so.",
  ],
} as const;

export const copilotSection = {
  eyebrow: "Copilot",
  title: "A plan you confirm",
  lede: "Tell Copilot what to do. It shows the plan first, including every conversation it would touch and the full draft text.",
  points: [
    "Nothing runs until you confirm.",
    "Moving mail to Trash and sending need an extra confirmation.",
    "Archive, star, read and label changes can be undone.",
    "The model has no tools. It cannot send, delete, forward or change mail on its own.",
  ],
} as const;

export const privacySection = {
  id: "privacy",
  eyebrow: "Privacy",
  title: "Your mail stays yours",
  lede: "MailIQ is an interface for mailboxes you choose to connect. It reads and changes mail only to show it to you and to carry out the actions you take.",
  points: [
    "Message bodies and attachments are not stored in MailIQ’s database. They are fetched live from the provider when you view them, and held only in memory while a request is processed.",
    "OAuth tokens, IMAP credentials, private notes, templates, the daily brief cache and pending Copilot plans are encrypted at rest with AES-256-GCM.",
    "An httpOnly session cookie keeps you signed in. On HTTPS it uses the __Host- prefix. State-changing requests need a CSRF token, and session identifiers are stored hashed.",
    "Email HTML is sanitised and shown in a sandboxed view. Remote images stay blocked until you allow them. The default is to ask first.",
    "Gmail data is not used for advertising, and it is not used to develop, improve or train generalised or non-personalised AI or machine-learning models. MailIQ does not sell your information.",
    "Settings → Your data exports what MailIQ stores as JSON. OAuth tokens are left out of the export.",
    `You delete your MailIQ account from Settings → Your data by typing “${DELETE_ACCOUNT_PHRASE}”. Where the provider supports it, deletion revokes access and removes MailIQ’s records. Host backups follow that host’s own schedule.`,
  ],
} as const;

export const workflow = {
  eyebrow: "Workflow",
  title: "From connect to reply",
  lede: "Connect a mailbox, read the brief, summarize a thread, reply or act, then search. The keyboard is there when you want it.",
  steps: [
    {
      title: "Connect",
      text: "Sign in with Google and approve the permissions MailIQ requests. Outlook and IMAP can be added later, when the operator enables them.",
    },
    {
      title: "Brief",
      text: "On the first open of the day, read what matters, what is waiting on you, and what looks safe to archive.",
    },
    {
      title: "Read and summarize",
      text: "Move through the list and open a thread. The summary shows key points, action items and deadlines.",
    },
    {
      title: "Reply or act",
      text: "Reply in your own words, or ask Copilot for a plan you confirm. Trash and send ask again.",
    },
    {
      title: "Search",
      text: "Ask in plain language. The mailbox query stays visible.",
    },
  ],
  facts: [
    {
      title: "Undo send",
      text: "Sends wait 5 seconds by default. Settings → Appearance can set that to off, 5, 10 or 20 seconds. Leaving the page during the wait asks first.",
    },
    {
      title: "Snooze",
      text: "Later today, tomorrow, this weekend or next week. Snoozed mail comes back on the next sync after it is due.",
    },
    {
      title: "Focus mode",
      text: "Only important mail, for 30 minutes, 1 hour, or until tomorrow morning. New-mail alerts pause while it is on.",
    },
  ],
} as const;

export const shortcuts = [
  { id: "move", keys: ["j / k"], label: "Next / previous conversation" },
  { id: "archive", keys: ["e"], label: "Archive" },
  { id: "reply", keys: ["r"], label: "Reply" },
  { id: "search", keys: ["/"], label: "Search" },
  { id: "palette", keys: ["⌘/Ctrl + K"], label: "Command palette" },
  { id: "copilot", keys: ["⌘/Ctrl + J"], label: "Copilot" },
] as const;

export const shortcutHint = "Focus this list and press a key. Ctrl on Windows and Linux. The preview only highlights a shortcut. It does not change any mail.";

/** Terms of Service §1, verbatim. The only preview line on the page. */
export const PREVIEW_NOTE =
  "MailIQ is currently offered as a preview: features may change, and the service may be interrupted or discontinued.";

export const finalCta = {
  eyebrow: "Start",
  title: "Ready for a calmer inbox?",
  lede: "Sign in with Google. You approve every permission, and you approve every send.",
  /** Existing landing helper, kept as the line under the sign-in control. */
  helper: "Connects securely through Google · You approve every permission",
} as const;

export const faqIntro = {
  id: "faq",
  eyebrow: "FAQ",
  title: "Questions",
  lede: "Short answers from the privacy policy, the terms and the product. The full documents are linked below.",
} as const;

export const faq = [
  {
    id: "stored",
    question: "Where is my mail stored?",
    answer:
      "MailIQ does not store your email message bodies, attachments or full message content in its database. They are fetched live from the connected provider when you view them and held only in memory while a request is processed. Drafts you save stay in your mailbox with the provider, not as a permanent copy in MailIQ’s database.",
  },
  {
    id: "autonomy",
    question: "What can the AI do on its own?",
    answer:
      "Nothing to your mailbox. The model has no tools, and email content is treated as untrusted data. It cannot send, delete, forward or change email on its own. Copilot can propose a plan, but it shows you that plan first and nothing happens until you confirm. Moving to Trash and sending need an extra confirmation. MailIQ does not send AI-written text without your confirmation.",
  },
  {
    id: "accounts",
    question: "Which accounts can I connect?",
    answer:
      "Today you can connect Gmail with Google. When the operator enables them, you can also connect Outlook / Microsoft 365 and optional IMAP accounts. IMAP is separate from Google or Microsoft sign-in: MailIQ stores the server details and credentials you provide, encrypted at rest, and uses them only to fetch and send mail for that account.",
  },
  {
    id: "delete",
    question: "What does delete do?",
    answer:
      `In Gmail, Delete moves the message to Gmail’s Trash. The gmail.modify permission cannot permanently delete messages. Deleting your MailIQ account is separate. Settings → Your data asks you to type “${DELETE_ACCOUNT_PHRASE}”. That revokes provider access where the provider supports revocation, and removes MailIQ’s application records. Encrypted backups held by the database host follow that host’s own schedule.`,
  },
  {
    id: "preview",
    question: "What does preview mean?",
    answer: PREVIEW_NOTE,
  },
  {
    id: "provider",
    question: "Which AI provider processes text?",
    answer:
      "By default, Google’s Gemini API. The operator may configure xAI (Grok) or OpenAI instead. Only the emails or fields needed for that request are sent. For the AI Overview, only subjects and short snippets are sent. For xAI and OpenAI, MailIQ turns off the provider’s request-storage option where the API offers that control. Gemini follows Google’s Generative AI API terms for the tier the operator uses. Those terms may allow limited retention for abuse monitoring. You can turn AI off, and you can exclude senders, domains and labels. Exclusions are enforced on MailIQ’s servers before any request is sent.",
  },
  {
    id: "ads",
    question: "Is my Gmail used for ads or to train models?",
    answer:
      "No. MailIQ does not sell your information or use it for third-party advertising. Gmail data is not used for ads, including retargeting, personalised or interest-based advertising. It is not used to develop, improve or train generalised or non-personalised AI or machine-learning models.",
  },
  {
    id: "export",
    question: "Can I export what MailIQ stores?",
    answer:
      "Yes. Settings → Your data exports a JSON file of what MailIQ stores. OAuth tokens are not included. You can also clear AI history, disconnect an account, or delete the MailIQ account from the same settings area.",
  },
] as const;
