import React, { useState } from 'react';
import Cookies from 'js-cookie';

function Banner({ isLoggedIn, activeContent, setSearchResults, setActiveContent, onLogoutSuccess }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    if (!isLoggedIn) {
      // If user is in guest mode, just switch to the WelcomePage without server request
      setActiveContent('WelcomePage');
      return;
    }
    try {
      // Clear JWT token stored in cookies
      Cookies.remove('authToken'); // Change from 'userSession' to 'authToken'
      Cookies.remove('userEmail'); // Remove user email
      
      // Call the server-side endpoint for logout, if needed
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        Cookies.remove('userSession'); // Remove the user session cookie
          localStorage.removeItem('userId'); // Removing user ID from local storage
        onLogoutSuccess(); // Notify parent component that logout was successful
        // Notify the parent component that logout was successful
        onLogoutSuccess(); 
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = async (event) => {
    if (event.key === 'Enter' && searchTerm.trim()) {
      const trimmedSearchTerm = searchTerm.trim();
      try {
        const response = await fetch(`/api/search?searchTerm=${encodeURIComponent(trimmedSearchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data); // Pass results to parent state
          console.log(data)
          setActiveContent('Searching'); // Switch to search results page
        } else {
          console.error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error during search:', error);
      }
    }
  };

  const isLogoutDisabled = activeContent === 'Login' || activeContent === 'Register';

  // Disable search and logout based on active content
  const isSearchDisabled =
  activeContent === 'WelcomePage' || activeContent === 'Login' || activeContent === 'Register';

  return (
    <div className="banner">
      <div>
      {/* User Profile button, visible only if logged in */}
      {isLoggedIn && (
        <button
          onClick={() => setActiveContent('UserProfile')} // Change active content to user profile
          className="blue-button"
        >
          User Profile
        </button>
      )}
      <button onClick={handleLogout} className="blue-button" disabled={isLogoutDisabled}>Logout</button> {/* Logout button */}
      </div>
      <h1>Fake Stack Overflow</h1>
      <input
        type="text"
        id="searchBar"
        className="searchBar"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyUp={handleSearch} 
        disabled={isSearchDisabled} 
      />
    </div>
  );
}

export default Banner;