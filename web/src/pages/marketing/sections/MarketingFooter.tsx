import { CONTACT_EMAIL } from "@/pages/Legal";
import { Logo } from "@/components/ui/misc";
import { navLinks } from "@/pages/marketing/content/copy";

const legalLinks = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
] as const;

export default function MarketingFooter() {
  return (
    <footer className="mk-footer">
      <div className="mk-section is-quiet">
        <div className="mk-footer-row">
          <Logo />
          <nav aria-label="Footer">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
            {legalLinks.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
