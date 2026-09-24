import React from 'react';

export const FormInput = ({ label, id, error, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label htmlFor={id} className="label-text">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="input-field"
        style={error ? { borderColor: 'rgba(239,68,68,0.5)' } : {}}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '0.25rem' }}>{error}</span>
      )}
    </div>
  );
};
