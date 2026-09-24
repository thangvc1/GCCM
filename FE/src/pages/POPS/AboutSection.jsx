export default function AboutSection() {
  return (
    <section className="pops-about-section" id="ve-chung-toi">
      <div className="pops-about-header">
        <span>VỀ CHÚNG TÔI</span>
        <h2>TIÊN PHONG CÔNG NGHỆ</h2>
        <p>KIẾN TẠO GIÁ TRỊ BỀN VỮNG</p>
      </div>

      <div className="pops-about-grid">
        <div className="pops-about-image-wrap">
          <img src="/dist/img/anh8.jpg" alt="Factory" />
          <div className="pops-about-image-badge">
            Tạo ra những sản phẩm chất lượng, thực hiện và vận hành đúng với mục
            tiêu từng công trình
          </div>
        </div>

        <div className="pops-about-content">
          <div className="pops-about-line" />
          <p>
            Công ty TNHH Thảm Bê Tông Việt Nam chính thức đi vào hoạt động từ
            ngày 01/08/2026, là đơn vị tiên phong đưa dây chuyền công nghệ sản
            xuất thảm bê tông từ nước ngoài về Việt Nam.
          </p>
          <p>
            Chúng tôi tập trung tạo ra các sản phẩm có giá trị bền vững, chất
            lượng cao,phục vụ các công trình dân dụng, công trình nhà nước ,nhằm
            tiết kiệm chi phí thi công ,rút ngắn thời gian và nâng cao hiệu quả
            cho mọi công trình.
          </p>
          <div className="pops-about-stats">
            <div className="pops-stat-box">
              <span className="pops-stat-date">01.08.2026</span>
              <span className="pops-stat-label">
                CHÍNH THỨC ĐI VÀO HOẠT ĐỘNG
              </span>
            </div>
            <div className="pops-stat-box">
              <span className="pops-stat-number">26+</span>
              <span className="pops-stat-label">NHÂN SỰ</span>
            </div>
          </div>

          <div className="pops-about-stats second-row">
            <div className="pops-stat-box">
              <span className="pops-stat-date">Tiên Tiến</span>
              <span className="pops-stat-label">CÔNG NGHỆ TỪ NƯỚC NGOÀI</span>
            </div>
            <div className="pops-stat-box">
              <span className="pops-stat-number">100%</span>
              <span className="pops-stat-label">SẢN XUẤT TẠI VIỆT NAM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
