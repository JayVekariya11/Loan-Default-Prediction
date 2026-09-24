import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ShieldCheck, Home, Brain, BarChart2, Database, History, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/predict', label: 'Predict', icon: Brain },
  { to: '/dataset', label: 'Dataset', icon: Database },
  { to: '/model', label: 'Model', icon: BarChart2 },
  { to: '/history', label: 'History', icon: History },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(11,15,25,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{
          maxWidth: '72rem', margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '0.625rem',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldCheck size={18} color="#6366F1" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#f1f5f9', letterSpacing: '-0.01em' }}>
              LoanGuard <span style={{ color: '#6366F1' }}>AI</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="desktop-nav">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
              return (
                <NavLink
                  key={to}
                  to={to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    padding: '0.45rem 0.875rem',
                    borderRadius: '0.625rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#6366F1' : '#64748b',
                    background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(99,102,241,0.25)' : 'transparent'}`,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  <Icon size={15} />
                  {label}
                </NavLink>
              );
            })}
          </div>

          {/* Predict CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <NavLink
              to="/predict"
              style={{
                padding: '0.45rem 1.125rem',
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                borderRadius: '0.625rem',
                color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              className="hide-mobile"
            >
              Get Prediction
            </NavLink>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-menu-btn"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                padding: '0.4rem',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'none',
              }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            padding: '0.75rem 1.5rem 1.25rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', gap: '0.25rem',
          }}>
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
              return (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    textDecoration: 'none',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#6366F1' : '#94a3b8',
                    background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                    fontSize: '0.9375rem',
                  }}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              );
            })}
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
};
