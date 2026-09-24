import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Target,
  BarChart3,
  Users,
  Award,
  Zap,
  DollarSign
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUser, logout } = useLeads();
  
  const [formData, setFormData] = useState({
    email: 'admin@urjafoods.com',
    password: 'admin',
    rememberMe: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleLoginSubmit = async (e, customEmail, customPass) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');

    const emailToUse = customEmail || formData.email;
    const passToUse = customPass || formData.password;

    // Extract username from email
    const username = emailToUse.includes('@') ? emailToUse.split('@')[0] : emailToUse;
    const success = await login(username, passToUse);

    setIsLoading(false);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password. Please verify your credentials.');
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'admin') {
      setFormData({ email: 'admin@urjafoods.com', password: 'admin', rememberMe: true });
      handleLoginSubmit(null, 'admin@urjafoods.com', 'admin');
    } else {
      setFormData({ email: 'sarah.smith@urjafoods.com', password: 'admin', rememberMe: true });
      handleLoginSubmit(null, 'sarah', 'admin');
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSuccess(true);
    setTimeout(() => {
      setForgotModalOpen(false);
      setResetSuccess(false);
      setResetEmail('');
    }, 2500);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f8fafc',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* LEFT MARKETING SIDE (Dark Navy Corporate) */}
      <div style={{
        flex: '1 1 46%',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '52px 60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />

        {/* 1. LMS Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2 }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.25rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
            letterSpacing: '-0.02em'
          }}>
            LMS
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>
              Lead Management System
            </h2>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: '600' }}>
              Sales & Pipeline Intelligence
            </span>
          </div>
        </div>

        {/* 2. Marketing Message & Professional Abstract Sales/Analytics Illustration */}
        <div style={{ zIndex: 2, margin: '40px 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            color: '#60a5fa',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '20px'
          }}>
            <Target size={14} />
            <span>Enterprise Sales Acceleration</span>
          </div>

          {/* Exact User Required Heading */}
          <h1 style={{
            fontSize: '2.6rem',
            fontWeight: '800',
            color: '#ffffff',
            lineHeight: 1.18,
            letterSpacing: '-0.03em',
            marginBottom: '16px'
          }}>
            Turn Opportunities into Success
          </h1>

          <p style={{
            color: '#94a3b8',
            fontSize: '1.02rem',
            lineHeight: 1.6,
            maxWidth: '500px',
            marginBottom: '32px'
          }}>
            Empower your sales executives with automated deal allocation, real-time stage tracking, and data-driven revenue forecasting.
          </p>

          {/* Professional Abstract Sales/Analytics Infographic Card */}
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} color="#3b82f6" />
                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#f8fafc' }}>
                  Pipeline Performance & Velocity
                </span>
              </div>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                color: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                padding: '3px 10px',
                borderRadius: '9999px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                +28.4% Win Rate
              </span>
            </div>

            {/* Abstract Sales Velocity Line / Curve (SVG) */}
            <div style={{ height: '70px', width: '100%', marginBottom: '16px' }}>
              <svg viewBox="0 0 400 70" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area under curve */}
                <path
                  d="M 10 60 Q 90 50, 160 38 T 300 20 T 390 10 L 390 70 L 10 70 Z"
                  fill="url(#salesGrad)"
                />
                {/* Line curve */}
                <path
                  d="M 10 60 Q 90 50, 160 38 T 300 20 T 390 10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data Points */}
                <circle cx="10" cy="60" r="4" fill="#3b82f6" />
                <circle cx="160" cy="38" r="4" fill="#3b82f6" />
                <circle cx="300" cy="20" r="4" fill="#3b82f6" />
                <circle cx="390" cy="10" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>

            {/* Pipeline Stage Bar Charts */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '65px', marginBottom: '18px' }}>
              {[
                { label: 'New', count: '38', h: '45%', color: '#3b82f6' },
                { label: 'Contact', count: '29', h: '60%', color: '#60a5fa' },
                { label: 'Qualified', count: '22', h: '75%', color: '#10b981' },
                { label: 'Proposal', count: '17', h: '55%', color: '#8b5cf6' },
                { label: 'Negotiate', count: '12', h: '85%', color: '#f59e0b' },
                { label: 'Won', count: '11', h: '100%', color: '#059669' }
              ].map(bar => (
                <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '700' }}>{bar.count}</span>
                  <div style={{
                    width: '100%',
                    height: bar.h,
                    backgroundColor: bar.color,
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{bar.label}</span>
                </div>
              ))}
            </div>

            {/* Summary Metrics Footer */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.78rem',
              color: '#94a3b8'
            }}>
              <span>Active Pipeline: <strong style={{ color: '#ffffff' }}>₹14.8 Lakh</strong></span>
              <span>Avg Win Time: <strong style={{ color: '#10b981' }}>7 Days</strong></span>
            </div>
          </div>
        </div>

        {/* 3. Footer security & trust badges */}
        <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', color: '#64748b', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#3b82f6" />
            <span>Role-Based Access</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#3b82f6" />
            <span>Activity Auditing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#3b82f6" />
            <span>SQL Server & SQLite</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: PROFESSIONAL LOGIN FORM */}
      <div style={{
        flex: '1 1 54%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Lock size={20} />
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              Welcome Back
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              Please enter your credentials to access your sales workspace.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div style={{
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              color: '#dc2626',
              padding: '11px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: '500',
              marginBottom: '20px',
              border: '1px solid rgba(220, 38, 38, 0.2)'
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Email Field */}
            <div>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '600', color: '#334155', marginBottom: '6px', display: 'block' }}>
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: '600', color: '#334155', margin: 0 }}>
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.78rem',
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    transition: 'all 0.15s ease'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer' }}
              />
              <label htmlFor="rememberMe" style={{ fontSize: '0.84rem', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                Remember me for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: '700',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '4px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to LMS'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick 1-Click Demo Login Bar */}
          <div style={{
            marginTop: '22px',
            padding: '14px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={13} color="#d97706" />
              <span>One-Click Demo Access</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                style={{
                  flex: 1,
                  padding: '7px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Admin (Ajay Bhor)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('rep')}
                style={{
                  flex: 1,
                  padding: '7px 8px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  color: '#0f172a',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                Sales Rep (Sarah)
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem', color: '#64748b' }}>
            Need an account?{' '}
            <Link to="/register" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>
              Admin Provisioning & Info
            </Link>
          </div>

          {/* Direct link to guest view */}
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'none' }}>
              Explore Dashboard as Guest →
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
              Reset Password
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '18px' }}>
              Enter your registered work email to receive password reset instructions.
            </p>

            {resetSuccess ? (
              <div style={{ padding: '12px', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '8px', fontSize: '0.84rem', fontWeight: '600' }}>
                Reset link dispatched! Please check your email inbox.
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155', marginBottom: '4px', display: 'block' }}>Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
