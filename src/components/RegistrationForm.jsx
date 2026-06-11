import React, { useState } from 'react';
import './RegistrationForm.css';

function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Employee', // Default role based on specs
    password: '',
    marketingConsent: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registering WorkHive User with Role Permissions:', formData);
    // Ready to connect to your Spring Boot Backend API
  };

  // Real-time password safety metric checks
  const checks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password),
    number: /[0-9]/.test(formData.password)
  };

  return (
    <div className="fullscreen-auth-wrapper">
      <div className="auth-center-stack">
        
        {/* WorkHive Brand Identification */}
        <div className="company-brand-name">WorkHive</div>

        {/* Pure White Registration Canvas */}
        <div className="glass-registration-card">
          <h2>Create your account</h2>
          <p className="login-redirect">
            Already have an account? <a href="/login">Log in</a>
          </p>

          <form onSubmit={handleSubmit}>
            
            {/* Full Name Input - Critical for Task Allocation */}
            <div className="form-field">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  required 
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-field">
              <label htmlFor="email">Work Email</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Role Dropdown Selector - Critical for WorkHive System Role Assignment */}
            <div className="form-field">
              <label htmlFor="role">Account Type / Role</label>
              <div className="input-wrapper">
                <select 
                  id="role" 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  required
                >
                  <option value="Employee">Employee (Track & Create Goals)</option>
                  <option value="Boss">Manager / Boss (Assign & Monitor Tasks)</option>
                </select>
              </div>
            </div>

            {/* Password Input */}
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  className="toggle-password-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Micro-interactive Password Rules */}
            <div className="password-requirements">
              <div className={`requirement-item ${checks.length ? 'valid' : ''}`}>Use 8 or more characters</div>
              <div className={`requirement-item ${checks.uppercase ? 'valid' : ''}`}>One Uppercase character</div>
              <div className={`requirement-item ${checks.lowercase ? 'valid' : ''}`}>One lowercase character</div>
              <div className={`requirement-item ${checks.special ? 'valid' : ''}`}>One special character</div>
              <div className={`requirement-item ${checks.number ? 'valid' : ''}`}>One number</div>
            </div>

            {/* Consent Agreement */}
            <label className="marketing-consent">
              <input 
                type="checkbox" 
                name="marketingConsent" 
                checked={formData.marketingConsent} 
                onChange={handleChange} 
              />
              <span>
                I want to receive emails about team productivity updates, feature rollouts, and announcements.
              </span>
            </label>

            <p className="legal-notice">
              By creating an account, you agree to the <a href="#terms">Terms of use</a> and <a href="#privacy">Privacy Policy</a>.
            </p>

            {/* Premium Pill Action Button */}
            <button type="submit" className="pill-submit-btn">
              Create an account
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default RegistrationForm;