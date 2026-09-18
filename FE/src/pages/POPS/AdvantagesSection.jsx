const advantages = [
  {
    icon: "🏗️",
    title: "Bền 8–10 năm",
    description:
      "Bê tông cuộn sản xuất đạt tiêu chuẩn công nghệ, chịu lực nén cao, không nứt vỡ theo thời gian.",
  },
  {
    icon: "💧",
    title: "Chống thấm tuyệt đối",
    description:
      "Bề mặt xử lý đặc biệt, chống thấm nước và dầu mỡ, dễ vệ sinh bằng áp lực nước.",
  },
  {
    icon: "🔇",
    title: "Cách âm, cách nhiệt",
    description:
      "Lớp bê tông dày giúp giảm tiếng ồn và cách nhiệt hiệu quả cho không gian phía dưới.",
  },
  {
    icon: "⚡",
    title: "Lắp đặt nhanh",
    description:
      "Không cần trộn vữa, không chờ khô. Rải là hoàn thành – tiết kiệm 80% thời gian thi công.",
  },
  {
    icon: "🏭",
    title: "Hỗ trợ thi công",
    description:
      "Công trình trên 5.000m² được đội ngũ kỹ thuật hỗ trợ thi công trực tiếp tại công trình.",
  },
  {
    icon: "📦",
    title: "Giao hàng toàn quốc",
    description:
      "Hệ thống vận chuyển chuyên dụng, đảm bảo sản phẩm đến tay khách hàng nguyên vẹn.",
  },
];

export default function AdvantagesSection() {
  return (
    <section className="lp-advantages-section" id="uu-diem">
      <div className="lp-section-header">
        <span className="section-kicker">TẠI SAO CHỌN CHÚNG TÔI</span>
        <h2 className="advantages-heading">Ưu điểm vượt trội</h2>
      </div>
      <div className="lp-advantages-grid">
        {advantages.map((advantage) => (
          <article className="adv-card" key={advantage.title}>
            <div className="adv-icon" aria-hidden="true">
              {advantage.icon}
            </div>
            <h3 className="adv-title">{advantage.title}</h3>
            <p className="adv-desc">{advantage.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
