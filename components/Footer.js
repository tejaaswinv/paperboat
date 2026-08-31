import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div>
          <Logo compact />
        </div>
        <div className="footer-copy">
          <p>made for side-project people.</p>
          <p>© 2026 Paper Boat AI</p>
        </div>
      </div>
    </footer>
  );
}
