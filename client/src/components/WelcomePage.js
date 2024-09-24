import React, { useEffect, useState } from 'react';

function WelcomePage({ setActiveContent }) {
  return (
    <div id="welcomePage_Content" style={{ minHeight: '400px' }}>
      <div id="menu" className="menu">
        <ul>
          <li>
            <a href="#" className="inactive">Questions</a>
          </li>
          <li>
            <a href="#" className="inactive">Tags</a>
          </li>
        </ul>
      </div>
      <div>
        <h1>Welcome to Fake Stack Overflow!</h1>
        <button onClick={() => setActiveContent('Register')} className="sorting-button">Create Account</button> {/* Switch to Register */}
        <button onClick={() => setActiveContent('Login')} className="sorting-button">Login</button> {/* Switch to Login */}
        <button onClick={() => setActiveContent('AllQuestionList')} className="sorting-button">Continue as Guest</button> {/* Continue as guest */}
      </div>
    </div>
  );
}

export default WelcomePage;
