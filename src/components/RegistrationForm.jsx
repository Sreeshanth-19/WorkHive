import React, { useState } from 'react';
import './RegistrationForm.css';

// CRITICAL FIX: Added { onNavigate } inside the arguments here
function RegistrationForm({ onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '', 
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.role) {
      alert("Please select a valid role before proceeding.");
      return;
    }
    console.log('Registering WorkHive User:', formData);
  };

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
        
        <div className="glass-registration-card">
          
          <div className="brand-container">
            <h1 className="company-brand-name">WorkHive</h1>
            <p className="company-tagline">Collaborate. Assign. Achieve.</p>
          </div>

          <h2>Create your account</h2>
          <p className="login-redirect">
            {/* CHANGED: Simplified 'loginForm' to 'login' to match standard state mapping */}
            Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); onNavigate('login'); }}>Log in</a>
          </p>
          
          <form onSubmit={handleSubmit}>
            
            {/* Full Name Input */}
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

            {/* Role Dropdown Selector */}
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
                  <option value="" disabled hidden>Select Role</option>
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

            {/* Password Validation Requirements */}
            <div className="password-requirements">
              <div className={`requirement-item ${checks.length ? 'valid' : ''}`}>Use 8+ characters</div>
              <div className={`requirement-item ${checks.uppercase ? 'valid' : ''}`}>One Uppercase</div>
              <div className={`requirement-item ${checks.lowercase ? 'valid' : ''}`}>One lowercase</div>
              <div className={`requirement-item ${checks.special ? 'valid' : ''}`}>One special character</div>
              <div className={`requirement-item ${checks.number ? 'valid' : ''}`}>One number</div>
            </div>

            <p className="legal-notice">
              By registering, you agree to our <a href="#terms">Terms</a> & <a href="#privacy">Privacy Policy</a>.
            </p>

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