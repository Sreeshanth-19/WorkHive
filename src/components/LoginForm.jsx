import React, { useState } from 'react';
import './LoginForm.css';

// CRITICAL FIX: Added { onNavigate } inside the arguments here
function LoginForm({ onNavigate }) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Authenticating WorkHive User:', credentials);
  };

  return (
    <div className="fullscreen-auth-wrapper">
      <div className="auth-center-stack">
        
        <div className="glass-login-card">
          
          <div className="brand-container">
            <h1 className="company-brand-name">WorkHive</h1>
            <p className="company-tagline">Collaborate. Assign. Achieve.</p>
          </div>

          <h2>Sign in to your workspace</h2>
          <p className="register-redirect">
            New to WorkHive? <a href="#register" onClick={(e) => { e.preventDefault(); onNavigate('register'); }}>Create an account</a>
          </p>

          <form onSubmit={handleSubmit}>
            
            {/* Inline Work Email Data Field */}
            <div className="form-field">
              <label htmlFor="email">Work Email</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={credentials.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Inline Password Data Field */}
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  value={credentials.password} 
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

            {/* Indented Utilities Row: Remember Me & Forgot Password Link */}
            <div className="login-utilities-row">
              <label className="remember-me-consent">
                <input 
                  type="checkbox" 
                  name="rememberMe" 
                  checked={credentials.rememberMe} 
                  onChange={handleChange}
                />
                <span>Keep me signed in</span>
              </label>
              <a href="#forgot" className="forgot-password-link">Forgot password?</a>
            </div>

            <p className="legal-notice">
              By logging in, you agree to our <a href="#terms">Terms</a> & <a href="#privacy">Privacy Policy</a>.
            </p>

            <button type="submit" className="pill-submit-btn">
              Sign In
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default LoginForm;