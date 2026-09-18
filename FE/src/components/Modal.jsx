export default function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        {footer && <div className="actions" style={{ marginTop: 8, justifyContent: "flex-end" }}>{footer}</div>}
      </div>
    </div>
  );
}
