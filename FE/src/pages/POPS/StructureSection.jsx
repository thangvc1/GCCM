export default function StructureSection() {
  return (
    <section className="pops-structure-section" id="cau-tao">
      <div className="pops-section-header">
        <span>CẤU TẠO SẢN PHẨM</span>
        <h2>CẤU TẠO THẢM BÊ TÔNG</h2>
        <p>3 LỚP LIÊN KẾT BỀN VỮNG — KẾT CẤU TỐI ƯU, ĐỘ BỀN VƯỢT TRỘI</p>
      </div>

      <div className="pops-structure-grid">
        <div className="pops-structure-list">
          <div className="pops-layer-item active">
            <div className="pops-layer-no">01</div>
            <div className="pops-layer-text">
              <h3>Lớp Thảm Poliester (PET)</h3>
              <p>Lớp bê mặt bị chèn xốp mền hiệu quả cao</p>
            </div>
          </div>
          <div className="pops-layer-item">
            <div className="pops-layer-no">02</div>
            <div className="pops-layer-text">
              <h3>Lớp Giữa Xi Măng &amp; Đá</h3>
              <p>PC40+50% Đá 0,5-1,5Li, lớp kết cấu cốt lõi</p>
            </div>
          </div>
          <div className="pops-layer-item">
            <div className="pops-layer-no">03</div>
            <div className="pops-layer-text">
              <h3>Lớp Bạt HDPE</h3>
              <p>Lớp nền chống thấm, tạo liên kết và vững kết cấu</p>
            </div>
          </div>
        </div>

        <div className="pops-structure-panel">
          <img src="/dist/img/anh2.jpg" alt="Structure" />
          {/* <div className="pops-panel-header">MẶT CẮT THẢM BÊ TÔNG</div>
          <div className="pops-panel-row">
            <span>01 — Lớp Thảm Polister (PET)</span>
            <span className="pops-dot" />
          </div>
          <div className="pops-panel-row">
            <span>02 — Xi Măng PC40 + Đá 0.5-1.5 Li</span>
            <span className="pops-dot" />
          </div>
          <div className="pops-panel-row dark">
            <span>03 — Lớp Bạt HDPE</span>
            <span className="pops-dot" />
          </div>

          <div className="pops-panel-metric">
            <div>
              <strong>4–15</strong>
              <span>mm độ dày</span>
            </div>
            <div>
              <strong>2 × 10m</strong>
              <span>m kích thước phổ thông</span>
            </div>
          </div> */}
        </div>
      </div>

      <div className="pops-structure-footer">
        <div className="pops-foot-item">
          <span className="pops-foot-title">CÔNG NGHỆ KHÂU XUYÊN THẤU</span>
          <p>
            Ba lớp liên kết với nhau bằng phương pháp câu xuyên thấu từ mặt thảm
            poliester tới lớp bạt HDPE mục đích tạo kết cấu,tạo liên kết,tăng
            cứng, giữ vững kết cấu
          </p>
        </div>
      </div>
    </section>
  );
}
