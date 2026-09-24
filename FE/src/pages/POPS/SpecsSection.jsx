export default function SpecsSection() {
  return (
    <section className="pops-spec-section" id="thong-so">
      <div className="pops-spec-header">
        <span>THÔNG SỐ</span>
        <h2>THÔNG SỐ SẢN PHẨM</h2>
      </div>

      <div className="pops-spec-grid">
        <div className="pops-spec-table-wrap">
          <table className="pops-spec-table">
            <thead>
              <tr>
                <th>Độ Dày</th>
                <th>Khối Lượng</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>4mm</td>
                <td>4 kg/m²</td>
              </tr>
              <tr>
                <td>6mm</td>
                <td>6 kg/m²</td>
              </tr>
              <tr>
                <td>8mm</td>
                <td>8 kg/m²</td>
              </tr>
              <tr>
                <td>10mm</td>
                <td>10 kg/m²</td>
              </tr>
              <tr>
                <td>12mm</td>
                <td>12 kg/m²</td>
              </tr>
              <tr>
                <td>15mm</td>
                <td>15 kg/m²</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pops-spec-box-wrap">
          <div className="pops-spec-box">
            <div className="pops-spec-number">2 × 10m</div>
            <p>Kích thước tiêu chuẩn phổ thông</p>
          </div>
          <div className="pops-spec-meta">
            <div>
              <span>Bề Ngang</span>
              <strong>1m | 2m | 4m</strong>
            </div>
            <div>
              <span>Chiều Dài</span>
              <strong>5 - 15m</strong>
            </div>
          </div>
          <p className="pops-spec-note">
            Kích thước có thể điều chỉnh linh hoạt theo yêu cầu và điều kiện
            từng công trình. Sản xuất theo yêu cầu số lượng lớn.
          </p>
        </div>
      </div>
    </section>
  );
}
