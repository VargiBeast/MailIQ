import { faq, faqIntro } from "@/pages/marketing/content/copy";
import { Section } from "./ui";

export default function Faq() {
  return (
    <Section id={faqIntro.id} eyebrow={faqIntro.eyebrow} title={faqIntro.title} lede={faqIntro.lede}>
      <div className="mk-faq">
        {faq.map((item) => (
          <details key={item.id} id={`faq-${item.id}`}>
            <summary>
              <h3>{item.question}</h3>
            </summary>
            <p className="mk-faq-answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
