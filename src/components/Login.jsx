import React, { useState } from 'react';
import './Auth.css'; // Make sure this path is correct

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Authenticating user:', credentials);
    // TODO: Connect to Spring Boot backend for JWT authentication
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        
        {/* Left Side: Hidden on mobile, shows an image on desktop */}
        <div className="auth-image-side"></div>

        {/* Right Side: The Form */}
        <div className="auth-form-side">
          <h2>WorkHive Login</h2>
          <p className="subtitle">
            Please sign in using your WorkHive username to access your dashboard and tasks.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Your Username"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Your Password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn">
              Sign In
            </button>
          </form>

          <div className="support-text">
            <p>
              Having trouble signing in? Please contact your IT administrator or reach out to{' '}
              <a href="mailto:support@workhive.com">support@workhive.com</a> for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;