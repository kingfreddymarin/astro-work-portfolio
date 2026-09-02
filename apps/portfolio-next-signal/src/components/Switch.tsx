interface Props {
  id: string;
  label: string;
  checked?: boolean;
}

export default function Switch({ id, label, checked = false }: Props) {
  return (
    <div
      className="switch-group"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem',
      }}
    >
      <span
        className="drawer-meta-title"
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '10px',
          color: 'var(--ink-2)',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <label
        className="switch"
        htmlFor={id}
        style={{ position: 'relative', display: 'inline-block', width: '38px', height: '20px' }}
      >
        {/* Uncontrolled on purpose — the Nav effect syncs it with the legacy
            hints button and the strict-branding flag, exactly as in Astro. */}
        <input
          type="checkbox"
          id={id}
          defaultChecked={checked}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
}
