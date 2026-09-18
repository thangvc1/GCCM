export default function LandingHeader() {
  return (
    <header className="landing-header">
      <div className="landing-brand">
        <div className="brand-badge-box">TM</div>
        <div className="brand-text-wrap">
          <span className="brand-title">THẢM XI MĂNG</span>
          <span className="brand-sub">Việt Nam</span>
        </div>
      </div>

      <nav className="landing-nav-links">
        <a href="#bang-gia">Bảng giá</a>
        <a href="#uu-diem">Ưu điểm</a>
        <a href="#lien-he">Liên hệ</a>
      </nav>

      <a href="tel:0979749602" className="btn-header-phone">
        <span className="phone-ico">📞</span>
        <strong>0979 749 602</strong>
      </a>
    </header>
  );
}
