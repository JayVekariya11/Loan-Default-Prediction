import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';

const EDUCATION_OPTIONS = [
  { label: "High School", value: "High School" },
  { label: "Bachelor's", value: "Bachelor's" },
  { label: "Master's", value: "Master's" },
  { label: "PhD", value: "PhD" },
];

const EMPLOYMENT_OPTIONS = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Self-employed", value: "Self-employed" },
  { label: "Unemployed", value: "Unemployed" },
];

const MARITAL_OPTIONS = [
  { label: "Single", value: "Single" },
  { label: "Married", value: "Married" },
  { label: "Divorced", value: "Divorced" },
];

const YES_NO_OPTIONS = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

const LOAN_PURPOSE_OPTIONS = [
  { label: "Auto", value: "Auto" },
  { label: "Business", value: "Business" },
  { label: "Education", value: "Education" },
  { label: "Home", value: "Home" },
  { label: "Other", value: "Other" },
];

const SECTION_COLORS = [
  { num: '#6366F1', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.2)' },
  { num: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)' },
  { num: '#F43F5E', bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.2)' },
];

const SectionCard = ({ title, index, children }) => {
  const color = SECTION_COLORS[index];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.1, duration: 0.5 }}
      className="glass-card"
      style={{ borderRadius: '1.5rem', padding: '2rem', marginBottom: 0 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
        <div style={{
          width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem',
          background: color.bg, border: `1px solid ${color.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color.num, fontWeight: 700, fontSize: '0.9375rem',
        }}>
          {index + 1}
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f1f5f9' }}>{title}</h3>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1.25rem',
      }}>
        {children}
      </div>
    </motion.div>
  );
};

const LoaderIcon = () => (
  <svg
    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: 'spin 1s linear infinite' }}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </svg>
);

export const PredictionForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    age: '', education: '', employmentType: '', maritalStatus: '', hasDependents: '',
    income: '', creditScore: '', monthsEmployed: '', dtiRatio: '', hasMortgage: '',
    loanAmount: '', numCreditLines: '', interestRate: '', loanTerm: '', loanPurpose: '', hasCoSigner: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = { ...formData };
    ['age', 'income', 'creditScore', 'monthsEmployed', 'dtiRatio', 'loanAmount', 'numCreditLines', 'interestRate', 'loanTerm']
      .forEach(k => { parsed[k] = parseFloat(formData[k]) || 0; });
    onSubmit(parsed);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Section 1: Personal */}
      <SectionCard title="Personal Information" index={0}>
        <FormInput label="Age" id="age" type="number" min="18" max="100" required value={formData.age} onChange={handleChange} placeholder="e.g. 35" />
        <FormSelect label="Education" id="education" required options={EDUCATION_OPTIONS} value={formData.education} onChange={handleChange} />
        <FormSelect label="Employment Type" id="employmentType" required options={EMPLOYMENT_OPTIONS} value={formData.employmentType} onChange={handleChange} />
        <FormSelect label="Marital Status" id="maritalStatus" required options={MARITAL_OPTIONS} value={formData.maritalStatus} onChange={handleChange} />
        <FormSelect label="Has Dependents?" id="hasDependents" required options={YES_NO_OPTIONS} value={formData.hasDependents} onChange={handleChange} />
      </SectionCard>

      {/* Section 2: Financial */}
      <SectionCard title="Financial Information" index={1}>
        <FormInput label="Annual Income ($)" id="income" type="number" min="0" required value={formData.income} onChange={handleChange} placeholder="e.g. 75000" />
        <FormInput label="Credit Score" id="creditScore" type="number" min="300" max="850" required value={formData.creditScore} onChange={handleChange} placeholder="300 – 850" />
        <FormInput label="Months Employed" id="monthsEmployed" type="number" min="0" required value={formData.monthsEmployed} onChange={handleChange} placeholder="e.g. 48" />
        <FormInput label="DTI Ratio" id="dtiRatio" type="number" step="0.01" min="0" max="1" required value={formData.dtiRatio} onChange={handleChange} placeholder="0.00 – 1.00" />
        <FormSelect label="Has Mortgage?" id="hasMortgage" required options={YES_NO_OPTIONS} value={formData.hasMortgage} onChange={handleChange} />
      </SectionCard>

      {/* Section 3: Loan */}
      <SectionCard title="Loan Details" index={2}>
        <FormInput label="Loan Amount ($)" id="loanAmount" type="number" min="100" required value={formData.loanAmount} onChange={handleChange} placeholder="e.g. 15000" />
        <FormInput label="# Credit Lines" id="numCreditLines" type="number" min="0" required value={formData.numCreditLines} onChange={handleChange} placeholder="e.g. 4" />
        <FormInput label="Interest Rate (%)" id="interestRate" type="number" step="0.1" min="0" required value={formData.interestRate} onChange={handleChange} placeholder="e.g. 5.5" />
        <FormInput label="Loan Term (Months)" id="loanTerm" type="number" min="12" step="12" required value={formData.loanTerm} onChange={handleChange} placeholder="e.g. 36" />
        <FormSelect label="Loan Purpose" id="loanPurpose" required options={LOAN_PURPOSE_OPTIONS} value={formData.loanPurpose} onChange={handleChange} />
        <FormSelect label="Has Co-Signer?" id="hasCoSigner" required options={YES_NO_OPTIONS} value={formData.hasCoSigner} onChange={handleChange} />
      </SectionCard>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}
      >
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? (
            <>
              <LoaderIcon />
              <span>Analyzing Data...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4" /><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              </svg>
              <span>Predict Default Risk</span>
            </>
          )}
        </button>
      </motion.div>
    </form>
  );
};
