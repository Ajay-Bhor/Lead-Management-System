import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { useLeads } from '../context/LeadContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAdmin, currentUser } = useLeads();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Sales Executive',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (formData.password.length < 5) {
      setError('Password must be at least 5 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role
    });

    setIsLoading(false);
    if (result.success) {
      setSuccessMsg('Account created successfully! Redirecting to workspace...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f8fafc'
    }}>
      {/* Left Marketing Banner (Dark Navy) */}
      <div style={{
        flex: '1 1 42%',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        padding: '56px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle grid pattern background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.4,
          pointerEvents: 'none'
        }} />

        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.25rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)'
          }}>
            LMS
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Lead Management System
            </h2>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Sales Team Onboarding
            </span>
          </div>
        </div>

        {/* Center Marketing Content */}
        <div style={{ zIndex: 2, margin: '36px 0' }}>
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
            <Sparkles size={14} />
            <span>Join 500+ Sales Champions</span>
          </div>

          <h1 style={{
            fontSize: '2.4rem',
            fontWeight: '800',
            color: '#ffffff',
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            marginBottom: '16px'
          }}>
            Scale Your Revenue with Urja LMS
          </h1>

          <p style={{
            color: '#94a3b8',
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: '460px',
            marginBottom: '32px'
          }}>
            Equip your sales organization with automated lead distribution, task follow-up alerts, and full visibility into conversion lifecycles.
          </p>

          {/* Role Access Card */}
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '460px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '0.84rem', fontWeight: '700', color: '#f8fafc', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#3b82f6" />
              <span>Role-Based Workspace Access</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }}></span>
                <span><strong style={{ color: '#ffffff' }}>Admin:</strong> Full pipeline controls, team assignments, and system audit logs.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
                <span><strong style={{ color: '#ffffff' }}>Sales Manager:</strong> Territory performance, conversion reports, and quota tracking.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                <span><strong style={{ color: '#ffffff' }}>Sales Executive:</strong> Assigned lead management, meetings, and activity logs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer badges */}
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', color: '#64748b', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#3b82f6" />
            <span>Enterprise Security</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#3b82f6" />
            <span>Instant Role Setup</span>
          </div>
        </div>
      </div>

      {/* Right Form Container */}
      <div style={{
        flex: '1 1 58%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 32px',
        overflowY: 'auto'
      }}>
        {!isAdmin ? (
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '44px 40px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              border: '1px solid #bfdbfe'
            }}>
              <Lock size={26} />
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              fontSize: '0.78rem',
              fontWeight: '700',
              marginBottom: '14px'
            }}>
              <ShieldCheck size={14} />
              <span>Admin Authorization Required</span>
            </div>

            <h2 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              Account Registration Restricted
            </h2>

            <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
              Direct self-registration is disabled. In accordance with enterprise data security protocols, only verified <strong>System Administrators</strong> can provision new user accounts and assign roles.
            </p>

            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '16px 18px',
              textAlign: 'left',
              marginBottom: '28px',
              fontSize: '0.84rem',
              color: '#475569'
            }}>
              <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                Need an account for your sales territory?
              </div>
              <div>
                Please contact your LMS System Administrator at <strong>admin@urjafoods.com</strong> to have your profile and territory access configured.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/login" className="btn-primary" style={{
                justifyContent: 'center',
                padding: '12px 20px',
                fontSize: '0.92rem',
                textDecoration: 'none'
              }}>
                Return to Sign In
              </Link>
              <Link to="/login" style={{
                fontSize: '0.85rem',
                color: '#2563eb',
                fontWeight: '600',
                textDecoration: 'none',
                marginTop: '4px'
              }}>
                Log in with Administrator Credentials →
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '36px 40px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#dc2626',
                fontSize: '0.74rem',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                <ShieldCheck size={13} />
                <span>Admin Provisioning Mode</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                Create New Member Account
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                Provision a sales profile and assign role credentials as Administrator ({currentUser?.name || 'Admin'}).
              </p>
            </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: '500',
              marginBottom: '18px',
              border: '1px solid rgba(220, 38, 38, 0.2)'
            }}>
              {error}
            </div>
          )}

          {successMsg && (
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              color: '#059669',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: '500',
              marginBottom: '18px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Full Name */}
            <div>
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            {/* Email and Phone side-by-side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="form-label">Email Address *</label>
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
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                  />
                </div>
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="form-label">System Role *</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1 }} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                  style={{ paddingLeft: '38px', cursor: 'pointer' }}
                >
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Password and Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 5 chars"
                    className="form-input"
                    style={{ paddingLeft: '38px', paddingRight: '36px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      display: 'flex'
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="form-input"
                    style={{ paddingLeft: '38px', paddingRight: '36px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      display: 'flex'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms text */}
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              By registering, you agree to Urja LMS organization security policies and sales activity auditing protocols.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '0.92rem',
                marginTop: '6px'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create LMS Account'}
            </button>
          </form>

          {/* Already have an account */}
          <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.86rem', color: '#64748b' }}>
            <Link to="/users" style={{ color: '#2563eb', fontWeight: '700', textDecoration: 'none' }}>
              ← Return to Team Directory
            </Link>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Register;
