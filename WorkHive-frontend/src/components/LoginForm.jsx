import React, { useState } from 'react';
import './LoginForm.css';
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
function LoginForm({ onNavigate }) {
  const [credentials, setCredentials] = useState({
    username: '', // Aligned with Spring Boot backend entity key
    password: '',
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: credentials.username.trim(),
          password: credentials.password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid username or password.");
      }

      // Read matching profile data directly from MySQL
      const userProfile = await response.json();

      // Save user session details in browser storage
      localStorage.setItem("workhive_user", JSON.stringify(userProfile));

      // Dynamic routing using your existing layout hooks
      if (userProfile.role === "BOSS") {
        console.log('Access Granted: Manager Session Initialized.');
        onNavigate('boss');
      } else if (userProfile.role === "EMPLOYEE") {
        console.log('Access Granted: Employee Session Initialized.');
        onNavigate('employee');
      } else {
        throw new Error("System Error: Unknown profile role designation.");
      }

    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
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

          {/* Conditional Error Alert Display */}
          {errorMessage && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginBottom: '1rem',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* Username Input Field */}
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={credentials.username} 
                  onChange={handleChange} 
                  required 
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input Field */}
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
                  disabled={loading}
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

            {/* Utilities Row: Remember Me & Forgot Password Link */}
            <div className="login-utilities-row">
              <label className="remember-me-consent">
                <input 
                  type="checkbox" 
                  name="rememberMe" 
                  checked={credentials.rememberMe} 
                  onChange={handleChange}
                  disabled={loading}
                />
                <span>Keep me signed in</span>
              </label>
              <a href="#forgot" className="forgot-password-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>

            <p className="legal-notice">
              By logging in, you agree to our <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a> & <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
            </p>

            <button type="submit" className="pill-submit-btn" disabled={loading}>
              {loading ? "Connecting..." : "Sign In"}
            </button>
          </form>

          {/* Connected Live Database Helper Panel */}
          <div style={{
            marginTop: '1.5rem',
            padding: '12px',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            border: '1px dashed rgba(16, 185, 129, 0.25)',
            borderRadius: '10px',
            fontSize: '0.78rem',
            color: '#065f46'
          }}>
            <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>🚀 Live Database Sync Enabled:</strong>
            <div>You can now create real customized accounts on the registration screen and log in with them instantly!</div>
          </div>

        </div>
        
      </div>
    </div>
  );
}

export default LoginForm;