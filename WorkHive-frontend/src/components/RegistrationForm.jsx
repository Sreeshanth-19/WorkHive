import React, { useState } from 'react';
import './RegistrationForm.css';

// Base URL points to your Vercel Environment Variable or falls back to local for testing
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function RegistrationForm({ onNavigate }) {
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    role: '', 
    password: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🌟 Added loading state protection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // 🌟 Block form mashing immediately

    if (!formData.role) {
      setError("Please select a valid role before proceeding.");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending registration request to:", `${API_BASE}/api/users/register`);
      
      const response = await fetch(`${API_BASE}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      // 1. Read response as plain text first to prevent JSON parsing crashes
      const responseText = await response.text(); 
      
      // 2. Safely try to parse it as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseBodyError) {
        data = null; // It's plain text, not JSON
      }

      if (!response.ok) {
        // Handle validation error map from GlobalExceptionHandler
        if (data && typeof data === 'object') {
          const combinedErrors = Object.values(data).join(" | ");
          throw new Error(combinedErrors);
        }
        throw new Error(responseText || "Registration failed. Please check your credentials.");
      }

      // 3. Determine display name cleanly whether backend returned an object or a text string
      const displayUsername = (data && data.username) ? data.username : formData.username;
      
      setSuccess(`Account for ${displayUsername} created successfully! Redirecting to login...`);
      
      // Automatically route to login window after 2.5 seconds
      setTimeout(() => {
        onNavigate('login');
      }, 2500);

    } catch (err) {
      console.error("Registration error encountered:", err);
      setError(err.message || "A network error occurred. Please try again.");
    } finally {
      setLoading(false); // 🌟 Release form controls when finished
    }
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
            Already have an account? <a href="#login" onClick={(e) => { e.preventDefault(); if(!loading) onNavigate('login'); }}>Log in</a>
          </p>

          {/* Dynamic Notifications */}
          {error && <div style={{ color: '#ff4d4d', backgroundColor: 'rgba(255,77,77,0.1)', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', textAlign: 'center', border: '1px solid rgba(255,77,77,0.2)' }}>{error}</div>}
          {success && <div style={{ color: '#2ecc71', backgroundColor: 'rgba(46,204,113,0.1)', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', textAlign: 'center', border: '1px solid rgba(46,204,113,0.2)' }}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            
            {/* Username Input */}
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                  placeholder="janedoe"
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                >
                  <option value="" disabled hidden>Select Role</option>
                  <option value="EMPLOYEE">Employee (Track & Create Goals)</option>
                  <option value="BOSS">Manager / Boss (Assign & Monitor Tasks)</option>
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
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="toggle-password-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Password Validation Requirements Checkers */}
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

            <button type="submit" className="pill-submit-btn" disabled={loading}>
              {loading ? "Creating Account (Waking Up Server)..." : "Create an account"}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default RegistrationForm;