'use client';

export default function Footer() {
  return (
    <footer className="footer-one-line">
      <div className="footer-content">
        <img
          src="https://i.postimg.cc/4yNW4Ts2/mzlogotransap.png"
          alt="MZPrimer Logo"
          className="footer-logo"
        />
        <span className="footer-text">© {new Date().getFullYear()} MZPrimer LTD. All rights reserved.</span>
      </div>
    </footer>
  );
}