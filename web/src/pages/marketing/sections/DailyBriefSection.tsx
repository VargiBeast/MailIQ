import { useId, type ReactNode } from "react";
import { dailyBrief } from "@/pages/marketing/content/copy";
import { BulletList, SectionHeading, useReveal, VisualSlot } from "./ui";
import { cn } from "@/lib/cn";

export default function DailyBriefSection({ demo }: { demo?: ReactNode }) {
  const titleId = useId();
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section className="mk-section" aria-labelledby={titleId}>
      <div ref={reveal.ref} className={cn("mk-split is-reverse", reveal.className)}>
        <div>
          <SectionHeading eyebrow={dailyBrief.eyebrow} title={dailyBrief.title} lede={dailyBrief.lede} titleId={titleId} />
          <BulletList items={dailyBrief.points} />
        </div>
        <VisualSlot demo={demo} stage="brief" />
      </div>
    </section>
  );
}
