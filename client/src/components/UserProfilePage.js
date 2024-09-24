import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function UserProfilePage({ userId, setActiveContent, setSelectedQuestion, setSelectedAnswer }) {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [tags, setTags] = useState([]);
  const [answers, setAnswers] = useState([]);
  
  const userEmail = Cookies.get('userEmail'); // Fetch email from cookies
  console.log('User Email:', userEmail); // Debug statement to ensure correct retrieval

  useEffect(() => {
    if (!userEmail) {
      console.error("User email is undefined");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user data from:', `/api/user/${encodeURIComponent(userEmail)}`);
        const response = await fetch(`/api/user/${encodeURIComponent(userEmail)}`);
        console.log("response:", response)
        if (response.ok) {
          const data = await response.json();
          console.log('User Data:', data);
          setUser(data.user);
          setQuestions(data.questions);
          setTags(data.tags);
          setAnswers(data.answers);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserProfile();
  }, [userEmail]);

  const handleDeleteQuestion = async (questionId) => {
    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId));
      } else {
        throw new Error('Failed to delete question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  let questionsLinkClass = "inactive";
  const handleQuestionsLinkClick = () => {
    setActiveContent('AllQuestionList');
    questionsLinkClass = "active"
    tagsLinkClass = "inactive"
  };

  let tagsLinkClass = "inactive";
  const handleTagsLinkClick = () => {
    setActiveContent('TagsContent');
    questionsLinkClass = "inactive"
    tagsLinkClass = "active"
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      const response = await fetch(`/api/answers/${answerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAnswers((prevAnswers) => prevAnswers.filter((a) => a._id !== answerId));
      } else {
        console.error('Failed to delete answer');
      }
    } catch (error) {
      console.error('Error deleting answer:', error);
    }
  };

  const handleDeleteTag = async (tagId) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTags((prevTags) => prevTags.filter((t) => t._id !== tagId));
      } else {
        throw new Error('Failed to delete tag');
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  if (!user) {
    return (
      <div>
      <div id="menu" className="menu">
        <ul>
          <li>
            <a href="#" id="questionsLink" className="inactive" onClick={handleQuestionsLinkClick}>Questions</a>
          </li>
          <li>
            <a href="#" id="tagsLink" className="inactive" onClick={handleTagsLinkClick}>Tags</a>
          </li>
        </ul>
      </div>
    <div>User not found</div>
    </div>
    );
  }

  const formatMetadata = (date) => {
    const currentDate = new Date();
    const diff = currentDate - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days >= 365) {
      return `${new Date(date).toLocaleString('en-us', { month: 'short', day: 'numeric', year: 'numeric' })} at ${new Date(date).toLocaleTimeString('en-us')}`;
    } else if (days >= 1) {
      return `${new Date(date).toLocaleString('en-us', { month: 'short', day: 'numeric' })} at ${new Date(date).toLocaleTimeString('en-us')}`;
    } else if (hours >= 1) {
      return `${hours} hours ago`;
    } else if (minutes >= 1) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  };

  const hasQuestions = questions.length > 0;
  const hasTags = tags.length > 0;
  const hasAnswers = answers.length > 0;

  return (
    <div className="user-profile">
      <div id="menu" className="menu">
        <ul>
          <li>
            <a href="#" id="questionsLink" className="inactive" onClick={handleQuestionsLinkClick}>Questions</a>
          </li>
          <li>
            <a href="#" id="tagsLink" className="inactive" onClick={handleTagsLinkClick}>Tags</a>
          </li>
        </ul>
      </div>
      <h1>{user.firstName} {user.lastName}</h1>
      <p>Email: {userEmail}</p> {/* Display email address */}
      
      {/* Membership section */}
      <h2>Membership</h2>
      <p>Member since: {formatMetadata(user.createdAt)}</p>
      <p>Reputation: {user.reputation || 0}</p>

      {/* Questions section */}
      <h2>Questions Posted</h2>
      {!hasQuestions ? (
        <p>No data found for {user.firstName} {user.lastName}.</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q._id}>
              <span
                onClick={() => {
                  setSelectedQuestion(q._id); // Set the selected question
                  setActiveContent('EditQuestion'); // Navigate to edit question page
                }}
              >
                {q.title}
              </span>
              <button onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {/* Tags section */}
      <h2>Tags</h2>
      {!hasTags ? (
        <p>No data found for {user.firstName} {user.lastName}.</p>
      ) : (
        <ul>
          {tags.map((t) => (
            <li key={t._id}>
              <span>{t.name}</span>
              <button onClick={() => handleDeleteTag(t._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {/* Answers section */}
      <h2>Answers</h2>
      {!hasAnswers ? (
        <p>No data found for {user.firstName} {user.lastName}.</p>
      ) : (
        <ul>
          {answers.map((a) => (
            <li key={a._id}>
              <span
                onClick={() => {
                  setSelectedAnswer(a._id); // Set the selected answer
                  setActiveContent('EditAnswer'); // Navigate to edit answer page
                }}
              >
                {a.questionTitle}
              </span>
              <button onClick={() => handleDeleteAnswer(a._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserProfilePage;
