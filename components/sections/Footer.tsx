import Link from "next/link";
import { AuditTrigger } from "@/components/AuditModal";
import { Logo } from "@/components/Logo";
import { solutions } from "@/lib/solutions";

const explore = [
  { href: "/#solutions", label: "Solutions" },
  { href: "/#calculator", label: "ROI calculator" },
  { href: "/#proof", label: "Case studies" },
  { href: "/#about", label: "About" },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <h2 className="footer__sign">
            <span className="line">Build a business that</span>
            <span className="line line--sage">runs beautifully.</span>
          </h2>
          <AuditTrigger label="Start with a roadmap" />
        </div>

        <div className="footer__cols">
          <div className="footer__brand">
            <a className="brand" href="/#top">
              <Logo size={26} />
              vaultra
            </a>
            <p>
              Custom AI agents and automated systems for mid-market operations.
              Mumbai, India.
            </p>
          </div>
          <nav aria-label="Explore">
            <p className="footer__h">Explore</p>
            <ul>
              {explore.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Solutions">
            <p className="footer__h">Solutions</p>
            <ul>
              {solutions.map((solution) => (
                <li key={solution.slug}>
                  <Link href={`/solutions/${solution.slug}`}>
                    {solution.title[0]} {solution.title[1].replace(/\.$/, "")}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer__legal">
          <span>© {new Date().getFullYear()} Vaultra Systems · Made for momentum</span>
          <span>Mumbai, India</span>
        </div>
      </div>
    </footer>
  );
}
