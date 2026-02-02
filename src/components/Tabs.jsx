export default function Tabs({ value, onChange, items }) {
  return (
    <div className="rw-tabs">
      {items.map((t) => (
        <button
          key={t}
          className={`rw-tab ${value === t ? "is-active" : ""}`}
          onClick={() => onChange(t)}
          type="button"
        >
          {t}
        </button>
      ))}
    </div>
  );
}