import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/misc";
import { usePrefersReducedMotion } from "@/lib/motion";
import { SAMPLE_QUERIES, resolveSampleSearch } from "./fixtures";
import { DemoShell } from "./ProductFrame";

const INITIAL = SAMPLE_QUERIES[0]?.phrase ?? "";

export default function SearchDemo() {
  const reduced = usePrefersReducedMotion();
  const [text, setText] = useState(INITIAL);
  const [applied, setApplied] = useState(INITIAL);
  const result = resolveSampleSearch(applied);

  const run = (phrase: string) => {
    setText(phrase);
    setApplied(phrase);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setApplied(text);
  };

  return (
    <DemoShell
      label="Search illustration"
      title="See the Gmail query"
      lede="Type a phrase or pick one. MailIQ shows the Gmail-style query it would run, then the fictional messages that match. Nothing is searched on a server."
      reduced={reduced}
    >
      <form role="search" onSubmit={onSubmit}>
        <label htmlFor="sample-mail-search" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg-2">
          Search sample mail
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-surface-2 px-3 focus-within:border-line-strong">
            <Icon icon={Search} className="shrink-0 text-fg-2" />
            <input
              id="sample-mail-search"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Try a phrase"
              autoComplete="off"
              enterKeyHint="search"
              className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-fg outline-none placeholder:text-fg-3"
            />
          </span>
          <Button type="submit" variant="primary" size="lg">
            Search
          </Button>
        </div>
      </form>
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Sample phrases">
        {SAMPLE_QUERIES.map((query) => (
          <Chip key={query.phrase} active={applied === query.phrase} onClick={() => run(query.phrase)}>
            {query.phrase}
          </Chip>
        ))}
      </div>
      {result.gmailQuery ? (
        <div className="mt-4 rounded-[var(--radius-lg)] border border-line bg-surface px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-2">Gmail query</p>
          <p data-gmail-query className="mt-1 text-[15px] font-medium tracking-tight text-fg">
            {result.gmailQuery}
          </p>
          {result.results.length > 0 ? (
            <ul aria-label="Sample results" className="mt-3 divide-y divide-line overflow-hidden rounded-[var(--radius-md)] border border-line">
              {result.results.map((thread) => (
                <li key={thread.id} className="min-w-0 px-3 py-2.5">
                  <p className="truncate text-[13.5px] font-medium text-fg">{thread.subject}</p>
                  <p className="truncate text-[12.5px] text-fg-2">{thread.from.name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p role="status" className="mt-3 text-[13.5px] text-fg-2">
              No sample messages match that query.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-[13.5px] text-fg-2">Enter a phrase to see the query.</p>
      )}
    </DemoShell>
  );
}
