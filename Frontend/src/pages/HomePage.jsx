import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Brain, Database, BarChart2, Clock,
  TrendingUp, Users, Zap, ChevronRight, ArrowRight
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

const STATS = [
  { label: 'Dataset Records', value: '55,347', icon: Database, color: '#6366F1' },
  { label: 'Input Features', value: '16', icon: BarChart2, color: '#10B981' },
  { label: 'Model Accuracy', value: '94.2%', icon: TrendingUp, color: '#F43F5E' },
  { label: 'Predictions Made', value: '∞', icon: Zap, color: '#F59E0B' },
];

const FEATURES = [
  {
    icon: Brain, color: '#6366F1', bg: 'rgba(99,102,241,0.1)',
    title: 'AI-Powered Prediction',
    desc: 'Advanced ML model trained on 55,347 real loan records to predict default risk.',
  },
  {
    icon: BarChart2, color: '#10B981', bg: 'rgba(16,185,129,0.1)',
    title: 'Insightful Analytics',
    desc: 'Visualize feature importance, model performance, and dataset distributions.',
  },
  {
    icon: ShieldCheck, color: '#F43F5E', bg: 'rgba(244,63,94,0.1)',
    title: 'Risk Assessment',
    desc: 'Get instant credit risk scores with confidence levels and key risk factors.',
  },
  {
    icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',
    title: 'Prediction History',
    desc: 'Track every prediction you run, stored locally for review at any time.',
  },
];

const PAGES = [
  { label: 'Make a Prediction', path: '/predict', color: '#6366F1', desc: 'Enter applicant data and get instant risk assessment' },
  { label: 'Explore Dataset', path: '/dataset', color: '#10B981', desc: 'Browse the full dataset structure and feature stats' },
  { label: 'Model Insights', path: '/model', color: '#F43F5E', desc: 'View accuracy, AUC, feature importance charts' },
  { label: 'View History', path: '/history', color: '#F59E0B', desc: 'Review all your past prediction results' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center', maxWidth: '56rem', margin: '0 auto' }}>
        <motion.div {...fadeUp(0)}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.3rem 1rem',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '9999px', marginBottom: '1.75rem',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366F1', display: 'inline-block' }} />
            <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, letterSpacing: '0.07em' }}>
              AI-POWERED RISK ANALYSIS
            </span>
          </div>
        </motion.div>

        <motion.h1 {...fadeUp(0.1)} style={{
          fontSize: 'clamp(2.75rem, 7vw, 5rem)',
          fontWeight: 900, letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #6366F1 50%, #F43F5E 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', lineHeight: 1.05, marginBottom: '1.5rem',
        }}>
          Loan Default<br />Predictor
        </motion.h1>

        <motion.p {...fadeUp(0.2)} style={{
          fontSize: '1.125rem', color: '#64748b', lineHeight: 1.8,
          maxWidth: '38rem', margin: '0 auto 2.5rem',
        }}>
          An intelligent ML-powered system that predicts the probability of loan default using 16 financial and personal features from real-world data.
        </motion.p>

        <motion.div {...fadeUp(0.3)} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/predict')}
            style={{
              padding: '0.9rem 2rem',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: 'none', borderRadius: '1rem',
              color: '#fff', fontWeight: 700, fontSize: '1rem',
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Try Prediction <ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/model')}
            style={{
              padding: '0.9rem 2rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '1rem',
              color: '#94a3b8', fontWeight: 600, fontSize: '1rem',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f1f5f9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            View Model Insights
          </button>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: '2rem 1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {STATS.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              {...fadeUp(0.1 * i + 0.1)}
              style={{
                background: 'rgba(26,35,58,0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '0.875rem',
                background: `${color}18`,
                border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.8125rem', color: '#475569', marginTop: '0.25rem' }}>{label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div {...fadeUp(0.1)} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', marginBottom: '0.75rem' }}>
            Everything You Need
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem' }}>A complete ML project frontend in one place</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {FEATURES.map(({ icon: Icon, color, bg, title, desc }, i) => (
            <motion.div
              key={title}
              {...fadeUp(0.1 * i + 0.1)}
              style={{
                background: 'rgba(26,35,58,0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '1.25rem',
                padding: '1.75rem',
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '0.875rem',
                background: bg, border: `1px solid ${color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>{title}</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Nav */}
      <section style={{ padding: '2rem 1.5rem 5rem', maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div {...fadeUp(0.1)} style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f1f5f9' }}>Explore the App</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {PAGES.map(({ label, path, color, desc }, i) => (
            <motion.button
              key={path}
              {...fadeUp(0.08 * i + 0.1)}
              onClick={() => navigate(path)}
              style={{
                background: 'rgba(26,35,58,0.5)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${color}20`,
                borderRadius: '1.25rem',
                padding: '1.5rem',
                cursor: 'pointer', fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}60`; e.currentTarget.style.background = `${color}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}20`; e.currentTarget.style.background = 'rgba(26,35,58,0.5)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{label}</span>
                <ChevronRight size={18} color={color} />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>{desc}</p>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}
