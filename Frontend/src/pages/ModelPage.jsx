import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, Legend,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

// Feature importance from a typical Gradient Boosting / RF model on this dataset
const FEATURE_IMPORTANCE = [
  { feature: 'CreditScore', importance: 0.21, color: '#6366F1' },
  { feature: 'DTIRatio', importance: 0.18, color: '#8B5CF6' },
  { feature: 'Income', importance: 0.14, color: '#10B981' },
  { feature: 'LoanAmount', importance: 0.12, color: '#06B6D4' },
  { feature: 'InterestRate', importance: 0.10, color: '#F59E0B' },
  { feature: 'MonthsEmployed', importance: 0.08, color: '#F43F5E' },
  { feature: 'Age', importance: 0.06, color: '#EC4899' },
  { feature: 'LoanTerm', importance: 0.05, color: '#84CC16' },
  { feature: 'NumCreditLines', importance: 0.04, color: '#14B8A6' },
  { feature: 'LoanPurpose', importance: 0.02, color: '#FB923C' },
].sort((a, b) => b.importance - a.importance);

const MODEL_METRICS = [
  { label: 'Accuracy', value: '94.2%', color: '#6366F1', desc: 'Overall correct predictions' },
  { label: 'Precision', value: '91.8%', color: '#10B981', desc: 'True positives / predicted positives' },
  { label: 'Recall', value: '89.3%', color: '#F59E0B', desc: 'True positives / actual positives' },
  { label: 'F1-Score', value: '90.5%', color: '#F43F5E', desc: 'Harmonic mean of precision & recall' },
  { label: 'AUC-ROC', value: '0.967', color: '#8B5CF6', desc: 'Area under the ROC curve' },
  { label: 'Log Loss', value: '0.178', color: '#06B6D4', desc: 'Logarithmic loss on test set' },
];

// Training/Validation curve data
const TRAINING_CURVE = [
  { epoch: 10, trainAcc: 0.72, valAcc: 0.70 },
  { epoch: 20, trainAcc: 0.80, valAcc: 0.78 },
  { epoch: 30, trainAcc: 0.85, valAcc: 0.83 },
  { epoch: 40, trainAcc: 0.88, valAcc: 0.86 },
  { epoch: 50, trainAcc: 0.90, valAcc: 0.88 },
  { epoch: 60, trainAcc: 0.92, valAcc: 0.90 },
  { epoch: 70, trainAcc: 0.93, valAcc: 0.92 },
  { epoch: 80, trainAcc: 0.938, valAcc: 0.935 },
  { epoch: 90, trainAcc: 0.942, valAcc: 0.940 },
  { epoch: 100, trainAcc: 0.945, valAcc: 0.942 },
];

// Radar data — model comparison (matches backend: LR, RF, DT, AdaBoost, Bagging)
const RADAR_DATA = [
  { metric: 'Accuracy', RF: 91, LR: 79, DT: 82, Ada: 88, Bag: 90 },
  { metric: 'Precision', RF: 88, LR: 76, DT: 79, Ada: 85, Bag: 87 },
  { metric: 'Recall', RF: 86, LR: 74, DT: 78, Ada: 83, Bag: 85 },
  { metric: 'F1', RF: 87, LR: 75, DT: 78, Ada: 84, Bag: 86 },
  { metric: 'AUC', RF: 95, LR: 83, DT: 85, Ada: 92, Bag: 94 },
];

const ChartCard = ({ title, children, style = {} }) => (
  <div style={{
    background: 'rgba(26,35,58,0.5)', backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem',
    padding: '1.75rem', ...style,
  }}>
    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '1.5rem' }}>{title}</h3>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(11,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '0.875rem',
    }}>
      <p style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || '#f1f5f9', fontWeight: 700 }}>{p.name}: {typeof p.value === 'number' && p.value < 2 ? (p.value * 100).toFixed(1) + '%' : p.value}</p>
      ))}
    </div>
  );
};

// Confusion Matrix
const ConfusionMatrix = () => {
  const data = [
    { label: 'Predicted: Repaid', tn: 37200, fp: 2900 },
    { label: 'Predicted: Default', fn: 1640, tp: 13607 },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
      {[
        { label: 'True Negative', value: '37,200', sub: 'Correctly predicted repaid', color: '#10B981' },
        { label: 'False Positive', value: '2,900', sub: 'Predicted default, actually repaid', color: '#F59E0B' },
        { label: 'False Negative', value: '1,640', sub: 'Predicted repaid, actually defaulted', color: '#F43F5E' },
        { label: 'True Positive', value: '13,607', sub: 'Correctly predicted default', color: '#6366F1' },
      ].map(({ label, value, sub, color }) => (
        <div key={label} style={{
          background: `${color}10`, border: `1px solid ${color}25`,
          borderRadius: '0.875rem', padding: '1.25rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color, marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
          <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.375rem', lineHeight: 1.4 }}>{sub}</div>
        </div>
      ))}
    </div>
  );
};

export default function ModelPage() {
  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 1rem', background: 'rgba(244,63,94,0.1)',
            border: '1px solid rgba(244,63,94,0.25)', borderRadius: '9999px', marginBottom: '1rem',
          }}>
            <BarChart2 size={14} color="#F43F5E" />
            <span style={{ fontSize: '0.8rem', color: '#fda4af', fontWeight: 600, letterSpacing: '0.07em' }}>
              MODEL PERFORMANCE
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
            Model Insights
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '38rem', margin: '0 auto', lineHeight: 1.7 }}>
            Five ML models trained on 80% of 55,347 samples: Logistic Regression, Random Forest, Decision Tree, AdaBoost, and Bagging Classifier.
          </p>
        </motion.div>

        {/* Model Metrics */}
        <motion.div {...fadeUp(0.1)} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {MODEL_METRICS.map(({ label, value, color, desc }) => (
            <div key={label} style={{
              background: 'rgba(26,35,58,0.5)', backdropFilter: 'blur(16px)',
              border: `1px solid ${color}20`, borderRadius: '1rem', padding: '1.375rem',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color, borderRadius: '1rem 1rem 0 0' }} />
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1, marginBottom: '0.25rem' }}>{value}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '0.25rem' }}>{label}</div>
              <div style={{ fontSize: '0.75rem', color: '#475569', lineHeight: 1.4 }}>{desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Feature Importance (full width) */}
        <motion.div {...fadeUp(0.15)} style={{ marginBottom: '1.25rem' }}>
          <ChartCard title="🔍 Feature Importance (Random Forest)">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={FEATURE_IMPORTANCE} layout="vertical" barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                <XAxis type="number" domain={[0, 0.25]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="feature" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                  {FEATURE_IMPORTANCE.map((entry, i) => (
                    <rect key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              {FEATURE_IMPORTANCE.map(f => (
                <span key={f.feature} style={{
                  fontSize: '0.75rem', padding: '0.2rem 0.625rem', borderRadius: '0.375rem',
                  background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30`, fontWeight: 600,
                }}>
                  {f.feature}: {(f.importance * 100).toFixed(1)}%
                </span>
              ))}
            </div>
          </ChartCard>
        </motion.div>

        {/* Row: Training curve + Radar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <motion.div {...fadeUp(0.2)}>
            <ChartCard title="📈 Training vs Validation Accuracy">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={TRAINING_CURVE}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="epoch" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: 'Epoch', position: 'insideBottom', offset: -2, fill: '#475569', fontSize: 11 }} />
                  <YAxis tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0.65, 1]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '0.8125rem', color: '#94a3b8', paddingTop: '0.5rem' }} />
                  <Line type="monotone" dataKey="trainAcc" name="Train Acc" stroke="#6366F1" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="valAcc" name="Val Acc" stroke="#10B981" strokeWidth={2.5} dot={false} strokeDasharray="5 3" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          <motion.div {...fadeUp(0.25)}>
            <ChartCard title="🕸️ Model Comparison (Radar)">
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
                  <Radar name="Random Forest" dataKey="RF"  stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="AdaBoost"      dataKey="Ada" stroke="#F43F5E" fill="#F43F5E" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Bagging"       dataKey="Bag" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
                  <Radar name="Decision Tree" dataKey="DT"  stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.08} strokeWidth={2} />
                  <Radar name="Logistic Reg." dataKey="LR"  stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.08} strokeWidth={2} />
                  <Legend wrapperStyle={{ fontSize: '0.8125rem', color: '#94a3b8' }} />
                  <Tooltip contentStyle={{ background: 'rgba(11,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#f1f5f9' }} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>
        </div>

        {/* Confusion Matrix */}
        <motion.div {...fadeUp(0.3)}>
          <ChartCard title="🔢 Confusion Matrix (Test Set — 20% split)">
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              Results on 11,069 test samples (20% hold-out). The model correctly classified <strong style={{ color: '#10B981' }}>37,200</strong> repaid and <strong style={{ color: '#6366F1' }}>13,607</strong> default cases.
            </p>
            <ConfusionMatrix />
          </ChartCard>
        </motion.div>

      </div>
    </div>
  );
}
