/** Fictional mailbox used by every marketing illustration. Nothing here is a real message. */

export const ILLUSTRATION_NOTE = "Illustration with sample data. Nothing is sent or saved.";

export type SamplePerson = { name: string; email: string };

export type SampleReply = { id: string; label: string; draft: string };

export type SampleAction = { task: string; owner: string | null; due: string | null };

export type SampleDeadline = { what: string; when: string };

export type SampleThread = {
  id: string;
  from: SamplePerson;
  to: string;
  subject: string;
  snippet: string;
  body: string[];
  time: string;
  unread: boolean;
  newsletter: boolean;
  summary: string;
  keyPoints: string[];
  actionItems: SampleAction[];
  deadlines: SampleDeadline[];
  replies: SampleReply[];
};

export const SAMPLE_THREADS: SampleThread[] = [
  {
    id: "launch",
    from: { name: "Maya Chen", email: "maya.chen@northwind.example" },
    to: "you@studio.example",
    subject: "Launch film is locked for Friday",
    snippet: "Can you confirm the final cut by Thursday at 16:00?",
    body: [
      "Hi — the launch film is locked for a Friday premiere at Northwind Studio. I need a yes on the final cut by Thursday at 16:00 so the theater can keep the slot.",
      "The runtime is 92 seconds and the budget is unchanged. This message is sample copy, not a real production email.",
    ],
    time: "09:14",
    unread: true,
    newsletter: false,
    summary:
      "Maya needs a yes on the final launch film by Thursday at 16:00 so the Friday premiere at Northwind Studio can stay on the calendar.",
    keyPoints: [
      "Premiere is Friday at Northwind Studio.",
      "Runtime is 92 seconds and the budget is unchanged.",
      "She is waiting on your confirmation, not a new cut.",
    ],
    actionItems: [{ task: "Confirm the final cut", owner: "You", due: "Thursday 16:00" }],
    deadlines: [{ what: "Launch premiere", when: "Friday" }],
    replies: [
      {
        id: "confirm",
        label: "Confirm Thursday",
        draft: "Thursday at 16:00 works. I’ll confirm the final cut then so the Friday premiere can stay.",
      },
      {
        id: "delay",
        label: "Ask for a day",
        draft: "I need until Friday morning to review the cut. Does that still leave the theater enough time?",
      },
      {
        id: "thanks",
        label: "Short thanks",
        draft: "Thanks for the update. I’ll review the cut and reply shortly.",
      },
    ],
  },
  {
    id: "invoice",
    from: { name: "Jonas Berg", email: "jonas.berg@harbor.example" },
    to: "you@studio.example",
    subject: "Invoice 1842 for the studio rental",
    snippet: "Last month’s harbor studio rental. Due on the 20th.",
    body: [
      "Hello — invoice 1842 covers last month’s harbor studio rental. The sample total is 4,800 kr, due on the 20th.",
      "This is not a real invoice. There is no account number and nothing can be paid from this illustration.",
    ],
    time: "08:02",
    unread: true,
    newsletter: false,
    summary: "Jonas sent sample invoice 1842 for last month’s studio rental and asked for it to be reviewed by the 20th.",
    keyPoints: [
      "The invoice number is 1842.",
      "It refers to last month’s harbor studio rental.",
      "The due date in the sample is the 20th.",
    ],
    actionItems: [{ task: "Review invoice 1842", owner: "You", due: "the 20th" }],
    deadlines: [{ what: "Review invoice 1842", when: "the 20th" }],
    replies: [
      {
        id: "review",
        label: "I’ll review it",
        draft: "Thanks, Jonas. I’ll review invoice 1842 before the 20th.",
      },
      {
        id: "question",
        label: "Ask a question",
        draft: "Thanks for sending invoice 1842. Can you confirm the rental dates it covers?",
      },
    ],
  },
  {
    id: "workshop",
    from: { name: "Leo Park", email: "leo.park@fieldnote.example" },
    to: "you@studio.example",
    subject: "Still waiting on the workshop times",
    snippet: "Did Tuesday, Wednesday or Thursday afternoon work?",
    body: [
      "Checking in — did Tuesday, Wednesday or Thursday afternoon work for the brand workshop? I can hold the Fieldnote room until Friday.",
      "No reply has been sent in this sample. Leo is still waiting.",
    ],
    time: "Yesterday",
    unread: false,
    newsletter: false,
    summary: "Leo asked which of three afternoons works for the brand workshop and is still waiting on your reply.",
    keyPoints: [
      "The open days are Tuesday, Wednesday and Thursday afternoon.",
      "The Fieldnote room can be held until Friday.",
      "You have not answered in this sample.",
    ],
    actionItems: [{ task: "Choose a workshop afternoon", owner: "You", due: "Friday" }],
    deadlines: [],
    replies: [
      {
        id: "wednesday",
        label: "Wednesday works",
        draft: "Wednesday afternoon works. Please hold the Fieldnote room then.",
      },
    ],
  },
  {
    id: "lumen",
    from: { name: "Priya Nair", email: "priya.nair@lumen.example" },
    to: "you@studio.example",
    subject: "Lumen weekly — three links",
    snippet: "A short digest of studio notes. No reply needed.",
    body: [
      "Three links from the studio this week: a lighting note, a type test, and a closed-set photo. No reply needed.",
      "This sample digest is the kind of newsletter MailIQ can suggest archiving. It is not starred or marked important.",
    ],
    time: "Mon",
    unread: false,
    newsletter: true,
    summary: "Priya’s weekly digest shares three reading links and does not ask for a reply.",
    keyPoints: ["Lighting note, type test, and a closed-set photo.", "No question is addressed to you."],
    actionItems: [],
    deadlines: [],
    replies: [],
  },
  {
    id: "harbor",
    from: { name: "Harbor Notes", email: "notes@harbor.example" },
    to: "you@studio.example",
    subject: "Harbor weekly",
    snippet: "Open studio hours are Thursday evening.",
    body: [
      "Open studio hours are Thursday evening. This weekly note is safe to file away in the sample.",
      "It is not starred or marked important, so a real daily brief could suggest archiving it.",
    ],
    time: "Mon",
    unread: false,
    newsletter: true,
    summary: "Harbor’s weekly note lists Thursday open hours and does not need a reply.",
    keyPoints: ["Open studio hours are Thursday evening.", "Nothing in the note asks you to act."],
    actionItems: [],
    deadlines: [],
    replies: [],
  },
];

export type SampleQuery = {
  phrase: string;
  gmailQuery: string;
  match: (thread: SampleThread) => boolean;
};

export const SAMPLE_QUERIES: SampleQuery[] = [
  {
    phrase: "invoice from last month",
    gmailQuery: "invoice newer_than:30d",
    match: (thread) => /invoice/i.test(`${thread.subject} ${thread.snippet}`),
  },
  {
    phrase: "from Maya about the launch",
    gmailQuery: "from:maya.chen@northwind.example launch",
    match: (thread) => thread.from.email.startsWith("maya.chen@") && /launch/i.test(thread.subject),
  },
  {
    phrase: "unread deadlines",
    gmailQuery: "is:unread deadline",
    match: (thread) => thread.unread && thread.deadlines.length > 0,
  },
];

export const COPILOT_INSTRUCTION = "Archive newsletters from this week";

export type CopilotRow = {
  id: string;
  title: string;
  detail: string;
  defaultOn: boolean;
};

export const COPILOT_ROWS: CopilotRow[] = [
  {
    id: "lumen",
    title: "Lumen weekly — three links",
    detail: "Newsletter · Priya Nair · included",
    defaultOn: true,
  },
  {
    id: "harbor",
    title: "Harbor weekly",
    detail: "Newsletter · Harbor Notes · included",
    defaultOn: true,
  },
  {
    id: "launch",
    title: "Launch film is locked for Friday",
    detail: "Not a newsletter · off unless you include it",
    defaultOn: false,
  },
];

export const BRIEF = {
  important: ["launch", "invoice"],
  awaitingReply: ["workshop"],
  safeToArchive: ["lumen", "harbor"],
} as const;

export function threadById(id: string): SampleThread {
  const thread = SAMPLE_THREADS.find((item) => item.id === id);
  if (!thread) throw new Error(`Unknown sample thread: ${id}`);
  return thread;
}

export function resolveSampleSearch(text: string): { gmailQuery: string; results: SampleThread[] } {
  const trimmed = text.trim();
  if (!trimmed) return { gmailQuery: "", results: [] };
  const known = SAMPLE_QUERIES.find((item) => item.phrase.toLowerCase() === trimmed.toLowerCase());
  if (known) return { gmailQuery: known.gmailQuery, results: SAMPLE_THREADS.filter(known.match) };
  const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const results = SAMPLE_THREADS.filter((thread) => {
    const hay = [thread.subject, thread.snippet, thread.from.name, thread.from.email, ...thread.body]
      .join(" ")
      .toLowerCase();
    return words.every((word) => hay.includes(word));
  });
  return { gmailQuery: words.join(" "), results };
}
