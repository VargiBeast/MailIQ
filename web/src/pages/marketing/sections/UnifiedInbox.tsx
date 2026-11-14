import { useId, type ReactNode } from "react";
import { unifiedInbox } from "@/pages/marketing/content/copy";
import { BulletList, SectionHeading, useReveal, VisualSlot } from "./ui";
import { cn } from "@/lib/cn";

export default function UnifiedInbox({ demo }: { demo?: ReactNode }) {
  const titleId = useId();
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="mk-section" aria-labelledby={titleId}>
      <div ref={reveal.ref} className={cn("mk-split", reveal.className)}>
        <div>
          <SectionHeading eyebrow={unifiedInbox.eyebrow} title={unifiedInbox.title} lede={unifiedInbox.lede} titleId={titleId} />
          <BulletList items={unifiedInbox.points} />
        </div>
        <VisualSlot demo={demo} stage="inbox" />
      </div>
    </section>
  );
}
