import { AuditTrigger } from "@/components/AuditModal";
import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <a className="brand" href="/#top">
              <Logo size={26} />
              vaultra
            </a>
            <p className="footer__sign">
              Build a business that
              <br />
              runs beautifully.
            </p>
          </div>
          <AuditTrigger label="Start with a roadmap" variant="outline" />
        </div>
        <p className="footer__legal">
          © {new Date().getFullYear()} Vaultra Systems · Made for momentum
        </p>
      </div>
    </footer>
  );
}
