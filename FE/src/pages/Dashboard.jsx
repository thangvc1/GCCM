import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext.jsx";
import { isSameDay, num, vnd } from "../lib/format.js";

export default function Dashboard() {
  const { products, orders, customers, settings } = useStore();
  const done = orders.filter((o) => o.status !== "đã hủy");
  const todayOrders = done.filter((o) => isSameDay(o.at));
  const todayRev = todayOrders.reduce((s, o) => s + o.total, 0);
  const monthRev = done
    .filter((o) => new Date(o.at).getMonth() === new Date().getMonth())
    .reduce((s, o) => s + o.total, 0);
  const low = products.filter((p) => p.stock <= p.minStock);
  const top = [...products]
    .map((p) => ({
      ...p,
      sold: done.reduce(
        (s, o) => s + (o.items.find((i) => i.productId === p.id)?.qty || 0),
        0,
      ),
    }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const rev = done
      .filter((o) => isSameDay(o.at, d))
      .reduce((s, o) => s + o.total, 0);
    return { label: d.toLocaleDateString("vi-VN", { weekday: "short" }), rev };
  });
  const max = Math.max(...last7.map((x) => x.rev), 1);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Xin chào, {settings.shopName}</h1>
          <p className="sub">Theo dõi bán hàng, tồn kho và khách trong ngày.</p>
        </div>
      </div>

      <div className="grid stats">
        <div className="card stat">
          <div className="label">Doanh thu hôm nay</div>
          <div className="value">{vnd(todayRev)}</div>
          <div className="delta">{todayOrders.length} đơn hoàn tất</div>
        </div>
        <div className="card stat">
          <div className="label">Doanh thu tháng</div>
          <div className="value">{vnd(monthRev)}</div>
          <div className="delta">{done.length} đơn tích lũy</div>
        </div>
        <div className="card stat">
          <div className="label">Sản phẩm</div>
          <div className="value">{num(products.length)}</div>
          <div className="delta">{low.length} mặt hàng dưới định mức</div>
        </div>
        <div className="card stat">
          <div className="label">Khách hàng</div>
          <div className="value">{num(customers.length)}</div>
          <div className="delta">Kèm khách lẻ</div>
        </div>
      </div>

      <div className="grid split" style={{ marginTop: 14 }}>
        <div className="card">
          <h3 style={{ margin: "0 0 8px" }}>7 ngày gần đây</h3>
          <div className="bars">
            {last7.map((d) => (
              <div
                key={d.label}
                className="bar"
                style={{ height: `${(d.rev / max) * 100}%` }}
              >
                <span>{d.label}</span>
              </div>
            ))}
          </div>
          <p className="sub" style={{ marginTop: 28 }}>
            Cột cao nhất: {vnd(max)}
          </p>
        </div>
        <div className="card">
          <h3 style={{ margin: "0 0 8px" }}>Sắp hết hàng</h3>
          {low.length === 0 && <div className="empty">Kho đang ổn.</div>}
          {low.map((p) => (
            <div key={p.id} className="cart-item">
              <div>
                {p.emoji} {p.name}
                <div className="p-meta">
                  Tồn {p.stock} / min {p.minStock}
                </div>
              </div>
              <span className="tag warn">Nhập thêm</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 14 }}>
        <div className="card">
          <h3 style={{ margin: "0 0 8px" }}>Bán chạy</h3>
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th className="right">Đã bán</th>
              </tr>
            </thead>
            <tbody>
              {top.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.emoji} {p.name}
                  </td>
                  <td className="right">{p.sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3 style={{ margin: "0 0 8px" }}>Đơn mới nhất</h3>
          <table>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Khách</th>
                <th className="right">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id}>
                  <td>{o.code}</td>
                  <td>{o.customerName}</td>
                  <td className="right">{vnd(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
