import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionForm } from '../components/PredictionForm';
import { ResultCard } from '../components/ResultCard';
import { predictLoanDefault } from '../utils/api';
import { saveToHistory } from '../utils/historyStore';
import { Brain, AlertTriangle } from 'lucide-react';

export default function PredictPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    setFormData(data);
    setError(null);
    try {
      const response = await predictLoanDefault(data);
      setResult(response);
      saveToHistory(data, response);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to the prediction server. Make sure the backend is running on port 5000.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData(null);
    setError(null);
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 1rem',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '9999px', marginBottom: '1rem',
          }}>
            <Brain size={14} color="#6366F1" />
            <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600, letterSpacing: '0.07em' }}>
              RISK ASSESSMENT ENGINE
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900,
            color: '#f1f5f9', letterSpacing: '-0.025em', marginBottom: '0.75rem',
          }}>
            Predict Loan Default
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '36rem', margin: '0 auto', lineHeight: 1.7 }}>
            Fill in all 16 features to get an AI-driven prediction on loan default probability.
          </p>
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                padding: '1rem 1.25rem',
                background: 'rgba(244,63,94,0.08)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: '0.875rem',
                marginBottom: '1.5rem',
                color: '#fda4af',
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '0.1rem', color: '#F43F5E' }} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <PredictionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <ResultCard result={result} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
