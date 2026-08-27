import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__grid">
          <div>
            <a className="brand" href="#top">
              <Logo size={26} />
              vaultra
            </a>
            <p className="footer__sign">
              Build a business that
              <br />
              runs beautifully.
            </p>
          </div>
          <a href="#calculator" className="btn btn--outline">
            <span>Start with a roadmap</span>
            <span className="btn__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
        <p className="footer__legal">
          © {new Date().getFullYear()} Vaultra Systems · Made for momentum
        </p>
      </div>
    </footer>
  );
}
