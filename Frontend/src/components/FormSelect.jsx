import React from 'react';

const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const FormSelect = ({ label, id, options, error, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', position: 'relative' }}>
      <label htmlFor={id} className="label-text">
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <select
          id={id}
          name={id}
          className="input-field"
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
            paddingRight: '2.5rem',
            ...(error ? { borderColor: 'rgba(239,68,68,0.5)' } : {}),
          }}
          {...props}
        >
          <option value="" disabled style={{ background: '#1A233A', color: '#64748b' }}>
            Select an option
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: '#1A233A', color: '#f1f5f9' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div style={{
          position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
          pointerEvents: 'none', color: '#64748b',
        }}>
          <ChevronIcon />
        </div>
      </div>
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.25rem' }}>{error}</span>
      )}
    </div>
  );
};
