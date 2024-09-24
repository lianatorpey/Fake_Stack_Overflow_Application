import React, { useState, useEffect } from 'react';
import AllQuestionList from './AllQuestionList';
import NewQuestionForm from './NewQuestionForm';
import AnswerForm from './AnswerForm';
import AnswerContent from './AnswerContent';
import TagsContent from './TagsContent';
import Searching from './Searching';
import WelcomePage from './WelcomePage';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import UserProfile from './UserProfilePage';
import Cookies from 'js-cookie';

function Content() {
  const [activeContent, setActiveContent] = useState(
    Cookies.get('userSession') ? 'AllQuestionList' : 'WelcomePage'
  );

  const handleLoginSuccess = () => {
    setActiveContent('AllQuestionList'); // Redirect to question list on login success
  };

  const handleRegisterSuccess = () => {
    setActiveContent('Login'); // Redirect to login on successful registration
  };

  const handleGuestClick = () => {
    setActiveContent('AllQuestionList'); // Redirect to question list as a guest
  };

  return (
    <div className="content">
      {activeContent === 'WelcomePage' && (
        <WelcomePage
          activeContent={activeContent}
          setActiveContent={setActiveContent}
          onLoginClick={() => setActiveContent('Login')}
          onRegisterClick={() => setActiveContent('Register')}
          onGuestClick={handleGuestClick}
          onBackClick={handleBackClick}/>)}
      {activeContent === 'AllQuestionList' && (
        <AllQuestionList isLoggedIn={isLoggedIn} onGuestClick={handleGuestClick} 
        activeContent={activeContent} 
        setActiveContent={setActiveContent}/>)}
      {activeContent === 'NewQuestionForm' && (
        <NewQuestionForm activeContent={activeContent} 
        setActiveContent={setActiveContent}/>)}
      {activeContent === 'AnswerForm' && (
        <AnswerForm activeContent={activeContent} 
        setActiveContent={setActiveContent}/>)}
      {activeContent === 'AnswerContent' && (
        <AnswerContent isLoggedIn={isLoggedIn} activeContent={activeContent}  
        setActiveContent={setActiveContent}/>)}
      {activeContent === 'TagsContent' && (
        <TagsContent isLoggedIn={isLoggedIn} activeContent={activeContent} 
        setActiveContent={setActiveContent}/>)}
      {activeContent === 'Searching' && (
        <Searching isLoggedIn={isLoggedIn} activeContent={activeContent} 
        setActiveContent={setActiveContent}/>)}
      {activeContent === 'Login' && (
        <LoginForm onLoginSuccess={handleLoginSuccess} 
        activeContent={activeContent} 
        setActiveContent={setActiveContent}
        onBackClick={handleBackClick}/>)}
      {activeContent === 'Register' && (
        <RegisterForm onRegisterSuccess={handleRegisterSuccess} 
        activeContent={activeContent} 
        setActiveContent={setActiveContent}
        onBackClick={handleBackClick}/>)}
      {activeContent === 'UserProfile' && (
        <UserProfile 
        activeContent={activeContent} 
        setActiveContent={setActiveContent}/>)}
    </div>
  );
}

export default Content;