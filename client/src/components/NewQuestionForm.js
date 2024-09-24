import React, { useEffect, useState } from 'react';
import AllQuestionList from './AllQuestionList';
import Cookies from 'js-cookie';

function NewQuestionForm({ addQuestionToList, onSuccess, setActiveContent }) {
  const userEmail = Cookies.get('userEmail'); // Retrieve user email from cookies
  
  useEffect(() => {
    if (userEmail) {
      setFormData((prevState) => ({
        ...prevState,
        email: userEmail // Set the email field in the form data
      }));
    }
  }, [userEmail]);

  const [formData, setFormData] = useState({
    questionTitle: '',
    questionSummary: '',
    questionText: '',
    questionTags: '',
    username: userEmail
  });

  const [errorMessages, setErrorMessages] = useState({
    questionTitleError: '', 
    questionSummaryError: '',
    questionTextError: '',
    questionTagsError: '',
    usernameError: '',
    formError: ''
  });
  
  const displayError = (fieldId, message) => {
    setErrorMessages(prevState => ({
      ...prevState,
      [fieldId]: prevState[fieldId] ? `${prevState[fieldId]}\n${message}` : message
    }));
  };

  const clearErrorMessages = () => {
    setErrorMessages({
      questionTitleError: '',
      questionSummaryError: '',
      questionTextError: '',
      questionTagsError: '',
      usernameError: '',
      formError: ''
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  // handle posting a new question
  const handlePostQuestion = async () => {
    clearErrorMessages();
    const { questionTitle, questionSummary, questionText, questionTags, username } = formData;
    const tagArray = questionTags.split(' ').filter(tag => tag); 

    if (questionTitle === '' && questionSummary === '' && questionText === '' && questionTags === '' && username === '') {
      displayError('formError', 'Please fill in all required fields.');
      return;
    }
    let isValid = true;
    // Hyperlink validation logic /////////////////////////////////// opejocdjoe
    let index = 0;
    while (index < questionText.length) {
      index = questionText.indexOf('[', index);
      if (index === -1) break;  // No more '[' found

      const closingBracketIndex = questionText.indexOf(']', index);
      if (closingBracketIndex === -1) {
        displayError('questionTextError', 'Missing closing bracket for a link.');
        isValid = false;
        break;
      }

      const openParenthesisIndex = questionText.indexOf('(', closingBracketIndex);
      if (openParenthesisIndex !== closingBracketIndex + 1) {
        displayError('questionTextError', 'Missing opening parenthesis for a link after the closing bracket.');
        isValid = false;
        break;
      }

      const closeParenthesisIndex = questionText.indexOf(')', openParenthesisIndex);
      if (closeParenthesisIndex === -1) {
        displayError('questionTextError', 'Missing closing parenthesis for a link.');
        isValid = false;
        break;
      }

      const linkContent = questionText.substring(openParenthesisIndex + 1, closeParenthesisIndex).trim();
      if (!linkContent.startsWith("http://") && !linkContent.startsWith("https://")) {
        displayError('questionTextError', 'URL must begin with "http://" or "https://".');
        isValid = false;
        break;
      }
      index = closeParenthesisIndex + 1;
    }
    ////////////////////////////////////// jeoci jdeoi j
    if (questionSummary === '') {
      displayError('questionSummaryError', 'Question summary cannot be empty');
      isValid = false;
    } else if (questionSummary.length > 200) { // Summary character limit
      displayError('questionSummaryError', 'Question summary must be 200 characters or less');
      isValid = false;
    }

    if (questionTitle === '' || questionTitle.length > 100) {
      displayError('questionTitleError', 'Title must be between 1 and 100 characters');
      isValid = false;
    }
    
    if (questionText === '') {
      displayError('questionTextError', 'Question text cannot be empty');
      isValid = false;
    }

    if (questionTags === '') {
      displayError('questionTagsError', 'Please add at least one tag');
      isValid = false;
    } else {
      if (tagArray.length > 5) {
        displayError('questionTagsError', 'Cannot add more than 5 tags');
        isValid = false;
      }
      for (const tag of tagArray) {
        if (tag.length > 20) {
          displayError('questionTagsError', 'Tag cannot be more than 20 characters');
          isValid = false;
          break;
        }
      }
      if (hasDuplicates(tagArray)) {
        displayError('questionTagsError', 'Duplicate tags not allowed');
        isValid = false;
      }
    }
    if (username === '') {
      displayError('usernameError', 'Username cannot be empty');
      isValid = false;
    }

    //  make the API call to post the question 
    if (isValid) {
      try {
        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: questionTitle,
            summary: questionSummary,
            text: questionText,
            tagNames: tagArray,
            asked_by: username || 'Anonymous',
          }),
        });
  
        if (response.ok) {
          const newQuestion = await response.json();
          addQuestionToList(newQuestion); 
          onSuccess(); 
          setFormData({
            questionTitle: '',
            questionSummary: '',
            questionText: '',
            questionTags: '',
            username: ''
          });
        } else {
          const error = await response.json();
          displayError('formError', error.message || 'Failed to post question. Please try again.');
        }
      } catch (error) {
        console.error('Error posting question:', error);
        displayError('formError', 'Error posting question. Please try again.');
      }
    }
  };  

    // check for duplicate tags
  function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
  }

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

  return (
        <div id="newQuestionForm">
          <div id="menu" className="menu">
            <ul>
              <li>
                <a href="#" id="questionsLink" className={questionsLinkClass} onClick={handleQuestionsLinkClick}>Questions</a>
              </li>
              <li>
                <a href="#" id="tagsLink" className={tagsLinkClass} onClick={handleTagsLinkClick}>Tags</a>
              </li>
              <li>
                <a href="#" onClick={() => setActiveContent('UserProfile')} className="inactive">Profile</a>
              </li>
            </ul>
          </div>
          <div className="form-field">
            <label htmlFor="questionTitle">Question Title*</label>
            <p><span className="error-message" id="questionTitleError">{errorMessages.questionTitleError}</span></p>
            <input
              type="text"
              id="questionTitle"
              value={formData.questionTitle}
              onChange={handleInputChange}
              placeholder="Enter question title (max 100 characters)"
              className="form-input"
              data-hint="limit title to 100 characters or less"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="questionSummary">Question Summary*</label>
            <p><span className="error-message" id="questionSummaryError">{errorMessages.questionSummaryError}</span></p>
            <input
              type="text"
              id="questionSummary"
              value={formData.questionSummary}
              onChange={handleInputChange}
              placeholder="Question Summary (max 200 characters)"
              className="form-input"
              data-hint="limit summary to 200 characters or less"
              autoComplete="off"
              required
            />
            <div className="error-message">{errorMessages.questionSummaryError}</div>
          </div>
          <div className="form-field">
            <label htmlFor="questionText">Question Text*</label>
            <p><span className="error-message" id="questionTextError">{errorMessages.questionTextError}</span></p>
            <input
              type="text"
              id="questionText"
              value={formData.questionText}
              onChange={handleInputChange}
              placeholder="Enter question details"
              className="form-input"
              data-hint="Add details"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="questionTags">Tags*</label>
            <p><span className="error-message" id="questionTagsError">{errorMessages.questionTagsError}</span></p>
            <input
              type="text"
              id="questionTags"
              value={formData.questionTags}
              onChange={handleInputChange}
              placeholder="Enter tags separated by whitespace"
              className="form-input"
              data-hint="Add keywords separated by whitespace"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="username">Username*</label>
            <p><span className="error-message" id="usernameError">{errorMessages.usernameError}</span></p>
            <input
              type="text"
              id="username"
              value={formData.username}
              readOnly 
              className="form-input"
              autoComplete="off"
              required
            />
          </div>
          <button id="postQuestionBtn" className="blue-button" onClick={handlePostQuestion}>Post Question</button>
          <p><span className="error-message" id="formError">{errorMessages.formError}</span></p>
          <p>* indicates required fields</p>
        </div>
      );
}

export default NewQuestionForm;


