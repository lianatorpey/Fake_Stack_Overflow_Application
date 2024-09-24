import React, { useState } from 'react';
import Cookies from 'js-cookie';

function LoginForm({ onLoginSuccess, setActiveContent }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Pass email and password
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
  
      const data = await response.json(); // Get token and email
      const token = data.token;
  
      // Save JWT token and email to cookies
      Cookies.set('authToken', token, { expires: 7, path: '/' });
      Cookies.set('userEmail', email, { expires: 7, path: '/' }); // Email should be saved correctly
  
      onLoginSuccess();
      setActiveContent('AllQuestionList');
    } catch (error) {
      setError(error.message);
    }
  };


  const handleBackClick = () => {
    setActiveContent('WelcomePage'); // Back to WelcomePage
  };

  return (
    <div id="login" className="login-form">
      <div id="menu" className="menu">
        <ul>
          <li>
            <a href="#" className="inactive">Questions</a>
          </li>
          <li>
            <a href="#" className="inactive">Tags</a>
          </li>
          <li>
            <a href="#" onClick={() => setActiveContent('UserProfile')} className="inactive">Profile</a>
          </li>
        </ul>
      </div>
      <div className="header-row">
        <h2>Login</h2>
        <button onClick={handleBackClick} className="sorting-button">Back</button> {/* Back button to navigate */}
      </div>
      <form onSubmit={handleLogin}> {/* Trigger handleLogin on form submit */}
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (Username)"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="blue-button">Login</button> {/* Submit triggers handleLogin */}
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message if any */}
    </div>
  );
}

export default LoginForm;
