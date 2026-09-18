import { useMemo } from "react";
import { useStore } from "../store/StoreContext.jsx";
import { isSameDay, vnd } from "../lib/format.js";

export default function Reports() {
  const { orders, products } = useStore();
  const done = orders.filter((o) => o.status !== "đã hủy");

  const byPay = useMemo(() => {
    const map = {};
    done.forEach((o) => {
      map[o.payMethod] = (map[o.payMethod] || 0) + o.total;
    });
    return Object.entries(map);
  }, [done]);

  const profit = useMemo(() => {
    return done.reduce((sum, o) => {
      const cost = o.items.reduce((s, i) => {
        const p = products.find((x) => x.id === i.productId);
        return s + (p?.cost || 0) * i.qty;
      }, 0);
      return sum + (o.total - cost);
    }, 0);
  }, [done, products]);

  const today = done.filter((o) => isSameDay(o.at)).reduce((s, o) => s + o.total, 0);
  const all = done.reduce((s, o) => s + o.total, 0);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const rev = done.filter((o) => isSameDay(o.at, d)).reduce((s, o) => s + o.total, 0);
    return { label: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }), rev };
  });
  const max = Math.max(...last7.map((x) => x.rev), 1);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Báo cáo</h1>
          <p className="sub">Doanh thu, lợi nhuận ước tính theo giá vốn.</p>
        </div>
      </div>
      <div className="grid stats">
        <div className="card stat">
          <div className="label">Doanh thu hôm nay</div>
          <div className="value">{vnd(today)}</div>
        </div>
        <div className="card stat">
          <div className="label">Tổng doanh thu</div>
          <div className="value">{vnd(all)}</div>
        </div>
        <div className="card stat">
          <div className="label">Lợi nhuận ước tính</div>
          <div className="value">{vnd(profit)}</div>
        </div>
        <div className="card stat">
          <div className="label">Đơn hoàn tất</div>
          <div className="value">{done.length}</div>
        </div>
      </div>
      <div className="grid two" style={{ marginTop: 14 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Doanh thu 7 ngày</h3>
          <div className="bars">
            {last7.map((d) => (
              <div key={d.label} className="bar" style={{ height: `${(d.rev / max) * 100}%` }}>
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Theo hình thức thanh toán</h3>
          {byPay.map(([k, v]) => (
            <div className="cart-item" key={k}>
              <span>{k}</span>
              <strong>{vnd(v)}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
