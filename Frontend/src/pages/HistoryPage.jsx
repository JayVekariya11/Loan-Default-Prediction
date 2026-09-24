import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, AlertTriangle, CheckCircle, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { getHistory, clearHistory } from '../utils/historyStore';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

const fmt = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

const FILTER_OPTIONS = ['All', 'High Risk', 'Low Risk'];

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const filtered = history.filter(entry => {
    if (filter === 'High Risk') return entry.result.prediction === 1;
    if (filter === 'Low Risk') return entry.result.prediction === 0;
    return true;
  });

  const highRiskCount = history.filter(e => e.result.prediction === 1).length;
  const lowRiskCount = history.filter(e => e.result.prediction === 0).length;

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 1rem', background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)', borderRadius: '9999px', marginBottom: '1rem',
          }}>
            <Clock size={14} color="#F59E0B" />
            <span style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 600, letterSpacing: '0.07em' }}>
              PREDICTION LOG
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
            Prediction History
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '34rem', margin: '0 auto', lineHeight: 1.7 }}>
            All previous predictions stored locally on your device. Last 50 entries are retained.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div {...fadeUp(0.1)} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Predictions', value: history.length, color: '#6366F1' },
            { label: 'High Risk', value: highRiskCount, color: '#F43F5E' },
            { label: 'Low Risk', value: lowRiskCount, color: '#10B981' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'rgba(26,35,58,0.5)', backdropFilter: 'blur(16px)',
              border: `1px solid ${color}20`, borderRadius: '1rem', padding: '1.25rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.35rem' }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Filter + Clear */}
        <motion.div {...fadeUp(0.15)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Filter size={16} color="#475569" style={{ marginTop: '0.35rem' }} />
            {FILTER_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{
                padding: '0.4rem 0.875rem', borderRadius: '0.625rem',
                border: `1px solid ${filter === opt ? '#6366F1' : 'rgba(255,255,255,0.08)'}`,
                background: filter === opt ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: filter === opt ? '#6366F1' : '#64748b',
                fontWeight: filter === opt ? 600 : 400,
                fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}>{opt}</button>
            ))}
          </div>
          {history.length > 0 && (
            <button onClick={handleClear} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.875rem', borderRadius: '0.625rem',
              border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.08)',
              color: '#F43F5E', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </motion.div>

        {/* History List */}
        {filtered.length === 0 ? (
          <motion.div {...fadeUp(0.2)} style={{
            textAlign: 'center', padding: '5rem 2rem',
            background: 'rgba(26,35,58,0.5)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.5rem',
          }}>
            <Clock size={48} color="#334155" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>No predictions yet</h3>
            <p style={{ color: '#334155' }}>Run a prediction on the <strong style={{ color: '#6366F1' }}>Predict</strong> page to see results here.</p>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <AnimatePresence>
              {filtered.map((entry, i) => {
                const isRisk = entry.result.prediction === 1;
                const color = isRisk ? '#F43F5E' : '#10B981';
                const isOpen = expanded === entry.id;

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      background: 'rgba(26,35,58,0.5)', backdropFilter: 'blur(16px)',
                      border: `1px solid ${color}20`, borderRadius: '1.25rem', overflow: 'hidden',
                    }}
                  >
                    {/* Summary Row */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : entry.id)}
                      style={{
                        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                        padding: '1.125rem 1.5rem',
                        display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'inherit',
                      }}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: '0.75rem', flexShrink: 0,
                        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {isRisk ? <AlertTriangle size={18} color={color} /> : <CheckCircle size={18} color={color} />}
                      </div>

                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f1f5f9' }}>{entry.result.message}</span>
                          <span style={{
                            padding: '0.15rem 0.5rem', borderRadius: '0.375rem',
                            fontSize: '0.75rem', fontWeight: 700,
                            color, background: `${color}15`, border: `1px solid ${color}30`,
                          }}>
                            {entry.result.confidence}% confidence
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.2rem' }}>
                          {fmt(entry.timestamp)} · Age: {entry.inputs.age} · Income: ${entry.inputs.income?.toLocaleString()} · Credit Score: {entry.inputs.creditScore}
                        </div>
                      </div>

                      {isOpen ? <ChevronUp size={18} color="#475569" /> : <ChevronDown size={18} color="#475569" />}
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            padding: '1.25rem 1.5rem',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                          }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.625rem', marginBottom: '1rem' }}>
                              {Object.entries(entry.inputs).map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', fontSize: '0.8125rem' }}>
                                  <span style={{ color: '#475569' }}>{k}</span>
                                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>{String(v)}</span>
                                </div>
                              ))}
                            </div>
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.875rem' }}>
                              <p style={{ fontSize: '0.8125rem', color: '#475569', fontWeight: 600, marginBottom: '0.5rem' }}>KEY FACTORS</p>
                              {entry.result.factors.map((f, fi) => (
                                <p key={fi} style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.5 }}>
                                  <span style={{ color }}> › </span>{f}
                                </p>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
