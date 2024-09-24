import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Banner from './Banner';
import AllQuestionList from './AllQuestionList';
import NewQuestionForm from './NewQuestionForm';
import Answers from './AnswerForm';
import TagsContent from './TagsContent';
import Searching from './Searching';
import WelcomePage from './WelcomePage';
import LoginPage from './LoginForm';
import RegisterPage from './RegisterForm';
import UserProfile from './UserProfilePage';

function FakeStackOverflow() {
  const [activeContent, setActiveContent] = useState('WelcomePage');
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const userSession = Cookies.get('userSession');
    if (userSession) {
      setIsLoggedIn(true);
      setActiveContent('AllQuestionList'); // Redirect to question list
    } else if (isLoggedOut) {
      setActiveContent('WelcomePage'); // Redirect to welcome page on logout
    }
  }, [isLoggedOut]); // Dependency on isLoggedOut to trigger change on logout

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveContent('AllQuestionList'); // Redirect to question list on successful login
  };

  const handleRegisterSuccess = () => {
    setActiveContent('Login'); // Redirect to login after successful registration
  };

  const handleLogoutSuccess = () => {
    setIsLoggedIn(false);
    setIsLoggedOut(true); // Set the logout state to true
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'WelcomePage' :
        return <WelcomePage  activeContent={activeContent} setActiveContent={setActiveContent}/>;
      case 'UserProfile' :
        return <UserProfile  activeContent={activeContent} setActiveContent={setActiveContent}/>;
      case 'AllQuestionList':
        return <AllQuestionList isLoggedIn={isLoggedIn} activeContent={activeContent} setActiveContent={setActiveContent} searchResults={searchResults} />;
      case 'NewQuestionForm':
        return <NewQuestionForm activeContent={activeContent} setActiveContent={setActiveContent} searchResults={searchResults} />;
      case 'Answers':
        return <Answers  isLoggedIn={isLoggedIn} activeContent={activeContent} setActiveContent={setActiveContent} searchResults={searchResults} />;
      case 'TagsContent':
        return <TagsContent isLoggedIn={isLoggedIn} activeContent={activeContent} setActiveContent={setActiveContent} searchResults={searchResults} />;
      case 'Searching':
        return <Searching isLoggedIn={isLoggedIn} activeContent={activeContent} setActiveContent={setActiveContent} searchResults={searchResults} setSearchResults={setSearchResults} />;
      case 'Login' :
        return <LoginPage  onLoginSuccess={handleLoginSuccess} activeContent={activeContent} setActiveContent={setActiveContent} />;
      case 'Register' :
        return <RegisterPage  onRegisterSuccess={handleRegisterSuccess} activeContent={activeContent} setActiveContent={setActiveContent} />;
      default:
        return null;
    }
  };

  return (
    <div className="fakestackoverflow">
      <Banner  isLoggedIn={isLoggedIn} onLogoutSuccess={handleLogoutSuccess} activeContent={activeContent} setSearchResults={setSearchResults} setActiveContent={setActiveContent} />
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
}

export default FakeStackOverflow;