import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <div>
          <Logo compact />
          <p className="footer-note">A tiny independent AI builder community. Not affiliated with Hector Beverages or Paper Boat Drinks.</p>
        </div>
        <div className="footer-copy">
          <p>made for side-project people.</p>
          <p>© 2026 Paper Boat AI</p>
        </div>
      </div>
    </footer>
  );
}
