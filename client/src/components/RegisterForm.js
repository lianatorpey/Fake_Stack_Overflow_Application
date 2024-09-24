import React, { useState } from 'react';

function RegisterForm({ onRegisterSuccess, setActiveContent }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordVerification: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, passwordVerification } = formData;

    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      return 'Invalid email format.';
    }

    if (password.includes(firstName) || password.includes(lastName) || password.includes(email)) {
      return 'Password cannot contain your name or email.';
    }

    if (password !== passwordVerification) {
      return 'Passwords do not match.';
    }

    return null;
  };

  const handleBackClick = () => {
    setActiveContent('WelcomePage'); // Back to WelcomePage
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          setError('Email already in use. Please use a different email.');
        } else {
          const errorData = await response.json(); // Get detailed error message
          console.log(errorData);
          throw new Error('Failed to register.');
        }
        return;
      }

      console.log("successful creation")
      onRegisterSuccess();
      console.log("parent notified of sucess")
      setActiveContent('Login'); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div id="registerForm" className="login-form">
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
        <h2>Register</h2>
        <button onClick={handleBackClick} className="sorting-button">Back</button>
      </div>
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email (Username)"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Secret Password"
          required
        />
        <input
          type="password"
          name="passwordVerification"
          value={formData.passwordVerification}
          onChange={handleChange}
          placeholder="Verify Password"
          required
        />
        <button type="submit" className="blue-button">Sign Up</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default RegisterForm;
