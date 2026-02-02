export default function RetroWindow({ titleLeft, titleRight, children }) {
  return (
    <div className="rw-shell">
      <div className="rw-titlebar">
        <div className="rw-title">
          <span className="rw-user">👥</span>
          <span className="rw-titleText">{titleLeft}</span>
          <span className="rw-drop">▾</span>
        </div>
        <div className="rw-controls">
          <button className="rw-btn" aria-label="minimize">—</button>
          <button className="rw-btn" aria-label="maximize">▢</button>
          <button className="rw-btn rw-close" aria-label="close">✕</button>
        </div>
      </div>

      <div className="rw-body">
  {titleRight ? <div className="rw-subtitle">{titleRight}</div> : null}
  <div className="rw-content">{children}</div>
</div>
    </div>
  );
}