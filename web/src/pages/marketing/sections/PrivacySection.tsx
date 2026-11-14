import { privacySection } from "@/pages/marketing/content/copy";
import { BulletList, SectionHeading, useReveal } from "./ui";
import { cn } from "@/lib/cn";

export default function PrivacySection() {
  const titleId = "mk-privacy-title";
  const reveal = useReveal<HTMLDivElement>();
  return (
    <section id={privacySection.id} className="mk-section" aria-labelledby={titleId}>
      <div ref={reveal.ref} className={cn("ai-block mk-privacy", reveal.className)}>
        <div className="mk-privacy-grid">
          <div>
            <SectionHeading
              eyebrow={privacySection.eyebrow}
              title={privacySection.title}
              lede={privacySection.lede}
              titleId={titleId}
            />
            <p className="mk-links">
              <a href="/privacy">Privacy policy</a>
              <a href="/terms">Terms of service</a>
            </p>
          </div>
          <BulletList items={privacySection.points} />
        </div>
      </div>
    </section>
  );
}
