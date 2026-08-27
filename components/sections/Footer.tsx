import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Logo size={20} />
          <span className="footer__brand-text">Vaultra</span>
        </div>
        <p className="footer__meta">
          Automation for mid-market operations · Mumbai, India · ©{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
