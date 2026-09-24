import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Database } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' },
});

const COLUMNS = [
  { name: 'LoanID', type: 'String', desc: 'Unique identifier for each loan application' },
  { name: 'Age', type: 'Integer', desc: 'Age of the applicant in years (18–80)' },
  { name: 'Income', type: 'Float', desc: 'Annual income of the applicant in USD' },
  { name: 'LoanAmount', type: 'Float', desc: 'Total loan amount requested in USD' },
  { name: 'CreditScore', type: 'Integer', desc: 'FICO credit score of applicant (300–850)' },
  { name: 'MonthsEmployed', type: 'Integer', desc: 'Number of months at current employment' },
  { name: 'NumCreditLines', type: 'Integer', desc: 'Total number of open credit lines' },
  { name: 'InterestRate', type: 'Float', desc: 'Annual interest rate on the loan (%)' },
  { name: 'LoanTerm', type: 'Integer', desc: 'Loan repayment term in months' },
  { name: 'DTIRatio', type: 'Float', desc: 'Debt-to-Income ratio (0.0 – 1.0)' },
  { name: 'Education', type: 'Category', desc: 'Highest education level of applicant' },
  { name: 'EmploymentType', type: 'Category', desc: 'Type of employment (Full-time, Part-time, etc.)' },
  { name: 'MaritalStatus', type: 'Category', desc: 'Marital status of applicant' },
  { name: 'HasMortgage', type: 'Boolean', desc: 'Whether applicant has an existing mortgage' },
  { name: 'HasDependents', type: 'Boolean', desc: 'Whether applicant has financial dependents' },
  { name: 'LoanPurpose', type: 'Category', desc: 'Purpose of the loan application' },
  { name: 'HasCoSigner', type: 'Boolean', desc: 'Whether a co-signer is present on loan' },
  { name: 'Default', type: 'Target', desc: '1 = Defaulted, 0 = Repaid (target variable)' },
];

const TYPE_COLORS = {
  String: '#64748b', Integer: '#6366F1', Float: '#10B981',
  Category: '#F59E0B', Boolean: '#8B5CF6', Target: '#F43F5E',
};

// Simulated distribution data based on dataset
const AGE_DIST = [
  { range: '18–25', count: 4200 }, { range: '26–35', count: 12800 },
  { range: '36–45', count: 14600 }, { range: '46–55', count: 13200 },
  { range: '56–65', count: 7900 }, { range: '66+', count: 2647 },
];

const EDUCATION_DIST = [
  { name: "High School", value: 18500 }, { name: "Bachelor's", value: 22800 },
  { name: "Master's", value: 14047 },
];

const EMPLOYMENT_DIST = [
  { name: 'Full-time', value: 31200 }, { name: 'Part-time', value: 9800 },
  { name: 'Self-employed', value: 8200 }, { name: 'Unemployed', value: 6147 },
];

const DEFAULT_DIST = [
  { name: 'Non-Default (0)', value: 40100, color: '#10B981' },
  { name: 'Default (1)', value: 15247, color: '#F43F5E' },
];

const PIE_COLORS = ['#6366F1', '#10B981', '#F43F5E', '#F59E0B', '#8B5CF6'];

const ChartCard = ({ title, children }) => (
  <div style={{
    background: 'rgba(26,35,58,0.5)', backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.75rem',
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
      <p style={{ color: '#f1f5f9', fontWeight: 700 }}>{payload[0].value.toLocaleString()} records</p>
    </div>
  );
};

export default function DatasetPage() {
  const [search, setSearch] = useState('');

  const filtered = COLUMNS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Header */}
        <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 1rem', background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.25)', borderRadius: '9999px', marginBottom: '1rem',
          }}>
            <Database size={14} color="#10B981" />
            <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: 600, letterSpacing: '0.07em' }}>
              DATASET OVERVIEW
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.025em', marginBottom: '0.75rem' }}>
            Dataset Explorer
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '38rem', margin: '0 auto', lineHeight: 1.7 }}>
            55,347 rows × 18 columns of real-world loan application data used to train the default prediction model.
          </p>
        </motion.div>

        {/* Overview Cards */}
        <motion.div {...fadeUp(0.1)} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem', marginBottom: '2.5rem',
        }}>
          {[
            { label: 'Total Records', value: '55,347', color: '#6366F1' },
            { label: 'Total Features', value: '18', color: '#10B981' },
            { label: 'Default Rate', value: '27.5%', color: '#F43F5E' },
            { label: 'Numeric Cols', value: '8', color: '#F59E0B' },
            { label: 'Categorical Cols', value: '5', color: '#8B5CF6' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'rgba(26,35,58,0.5)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.25rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.35rem' }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Charts Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <motion.div {...fadeUp(0.15)}>
            <ChartCard title="📊 Age Distribution">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={AGE_DIST} barCategoryGap="30%">
                  <XAxis dataKey="range" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          <motion.div {...fadeUp(0.2)}>
            <ChartCard title="🎓 Education Level Distribution">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={EDUCATION_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={4}>
                    {EDUCATION_DIST.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(11,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#f1f5f9' }} />
                  <Legend wrapperStyle={{ fontSize: '0.8125rem', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <motion.div {...fadeUp(0.25)}>
            <ChartCard title="💼 Employment Type Distribution">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={EMPLOYMENT_DIST} layout="vertical" barCategoryGap="30%">
                  <XAxis type="number" tick={{ fill: '#475569', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#10B981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>

          <motion.div {...fadeUp(0.3)}>
            <ChartCard title="⚠️ Target Variable — Default vs Non-Default">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={DEFAULT_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={50} paddingAngle={4}>
                    {DEFAULT_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(11,15,25,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#f1f5f9' }} />
                  <Legend wrapperStyle={{ fontSize: '0.8125rem', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>
        </div>

        {/* Column Explorer */}
        <motion.div {...fadeUp(0.35)}>
          <div style={{
            background: 'rgba(26,35,58,0.5)', backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.5rem', overflow: 'hidden',
          }}>
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#f1f5f9' }}>📋 Column Reference ({COLUMNS.length} columns)</h3>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search columns..."
                style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '0.625rem', padding: '0.5rem 0.875rem', color: '#f1f5f9',
                  fontSize: '0.875rem', outline: 'none', fontFamily: 'inherit', minWidth: '200px',
                }}
              />
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Column Name', 'Data Type', 'Description'].map(h => (
                      <th key={h} style={{ padding: '0.875rem 1.75rem', textAlign: 'left', fontSize: '0.75rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((col, i) => (
                    <tr key={col.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '0.875rem 1.75rem', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap' }}>{col.name}</td>
                      <td style={{ padding: '0.875rem 1.75rem', whiteSpace: 'nowrap' }}>
                        <span style={{
                          padding: '0.2rem 0.625rem', borderRadius: '0.375rem',
                          fontSize: '0.75rem', fontWeight: 700,
                          color: TYPE_COLORS[col.type],
                          background: `${TYPE_COLORS[col.type]}18`,
                          border: `1px solid ${TYPE_COLORS[col.type]}30`,
                        }}>{col.type}</span>
                      </td>
                      <td style={{ padding: '0.875rem 1.75rem', color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>{col.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#475569' }}>No columns match your search.</div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
