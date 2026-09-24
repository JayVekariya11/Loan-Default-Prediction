import React from 'react';
import { motion } from 'framer-motion';

const WarningIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CheckIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 .49-4" />
  </svg>
);

// Mini card showing one model's result
const ModelBadge = ({ name, probability, isHighRisk, primaryColor, bgColor, borderColor }) => {
  const pct = probability != null ? Math.round(probability * 100) : null;
  return (
    <div style={{
      flex: 1, minWidth: 0,
      padding: '0.875rem 1rem',
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '0.875rem',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.375rem' }}>
        {name}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: primaryColor, lineHeight: 1 }}>
        {pct != null ? `${pct}%` : (isHighRisk ? 'High' : 'Low')}
      </div>
      {pct != null && (
        <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.25rem' }}>default prob.</div>
      )}
    </div>
  );
};

export const ResultCard = ({ result, onReset }) => {
  const isHighRisk = result.prediction === 1;

  const primaryColor = isHighRisk ? '#F43F5E' : '#10B981';
  const bgColor = isHighRisk ? 'rgba(244,63,94,0.08)' : 'rgba(16,185,129,0.08)';
  const borderColor = isHighRisk ? 'rgba(244,63,94,0.25)' : 'rgba(16,185,129,0.25)';
  const glowColor = isHighRisk ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)';

  const rf  = result.models?.random_forest;
  const lr  = result.models?.logistic_regression;
  const dt  = result.models?.decision_tree;
  const ada = result.models?.adaboost;
  const bag = result.models?.bagging;
  const allModels = [
    { key: 'rf',  data: rf,  name: 'Random Forest' },
    { key: 'lr',  data: lr,  name: 'Logistic Reg.' },
    { key: 'dt',  data: dt,  name: 'Decision Tree' },
    { key: 'ada', data: ada, name: 'AdaBoost' },
    { key: 'bag', data: bag, name: 'Bagging' },
  ].filter(m => m.data != null);
  const hasModels = allModels.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{
        maxWidth: '38rem', margin: '0 auto',
        background: 'rgba(26,35,58,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${borderColor}`,
        borderRadius: '1.75rem',
        padding: '3rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 25px 60px ${glowColor}`,
        textAlign: 'center',
      }}
    >
      {/* Glow top-right */}
      <div style={{
        position: 'absolute', top: '-4rem', right: '-4rem',
        width: '14rem', height: '14rem', borderRadius: '50%',
        background: primaryColor, filter: 'blur(80px)', opacity: 0.15,
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', delay: 0.2, stiffness: 250 }}
        style={{
          width: '5.5rem', height: '5.5rem', borderRadius: '50%',
          background: bgColor, border: `1px solid ${borderColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: primaryColor, margin: '0 auto 2rem',
          boxShadow: `0 0 40px ${glowColor}`,
        }}
      >
        {isHighRisk ? <WarningIcon /> : <CheckIcon />}
      </motion.div>

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div style={{
          display: 'inline-block', padding: '0.25rem 0.875rem', borderRadius: '9999px',
          background: bgColor, border: `1px solid ${borderColor}`,
          fontSize: '0.75rem', fontWeight: 700, color: primaryColor,
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem',
        }}>
          {isHighRisk ? 'High Risk' : 'Low Risk'}
        </div>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          {result.message}
        </h2>
        {result.risk_status && (
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            {result.risk_status}
          </p>
        )}
        <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Based on the provided data, our model computed a confidence score of:
        </p>
      </motion.div>

      {/* Confidence Score */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        style={{ marginBottom: '2.5rem' }}
      >
        <div style={{
          fontSize: '5rem', fontWeight: 900, letterSpacing: '-0.03em',
          color: primaryColor,
          textShadow: `0 0 60px ${glowColor}`,
          lineHeight: 1,
        }}>
          {result.confidence}%
        </div>
        <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.5rem', fontWeight: 500 }}>
          MODEL CONFIDENCE
        </div>
      </motion.div>

      {/* Gauge Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ marginBottom: '2rem' }}
      >
        <div style={{
          height: '8px', borderRadius: '9999px',
          background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            style={{ height: '100%', borderRadius: '9999px', background: primaryColor }}
          />
        </div>
      </motion.div>

      {/* Per-model breakdown */}
      {hasModels && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
            Model Breakdown
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {allModels.map(({ key, data: m, name }) => (
              <ModelBadge
                key={key}
                name={name}
                probability={m.probability}
                isHighRisk={m.prediction === 1}
                primaryColor={m.prediction === 1 ? '#F43F5E' : '#10B981'}
                bgColor={m.prediction === 1 ? 'rgba(244,63,94,0.08)' : 'rgba(16,185,129,0.08)'}
                borderColor={m.prediction === 1 ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)'}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Key Factors */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '1rem', padding: '1.25rem 1.5rem',
          textAlign: 'left', marginBottom: '2rem',
        }}
      >
        <h3 style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.875rem' }}>
          Key Risk Factors
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {result.factors.map((factor, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5 }}>
              <span style={{ color: primaryColor, marginTop: '0.1rem', flexShrink: 0 }}>›</span>
              {factor}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1.75rem',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '0.875rem',
          color: '#94a3b8', fontWeight: 600, fontSize: '0.9375rem',
          cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.color = '#f1f5f9';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.color = '#94a3b8';
        }}
      >
        <RefreshIcon />
        <span>New Prediction</span>
      </button>
    </motion.div>
  );
};
