import React, { useState } from 'react';
import AnswerContent from './AnswerContent';

function AnswerForm({ questionId, onAnswerSubmit }) {
    const [formData, setFormData] = useState({
        answerText: '',
        username: ''
    });

    const [errorMessages, setErrorMessages] = useState({
        answerTextError: '',
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
            answerTextError: '',
            usernameError: '',
            formError: ''
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        clearErrorMessages();
        const { answerText, username } = formData;

        if (!answerText.trim() || !username.trim()) {
            displayError('formError', 'Answer text and username are required.');
            return;
        }

        if (answerText.trim() === '') {
            displayError('answerTextError', 'Answer text cannot be empty');
            return;
        }
        if (username.trim() === '') {
            displayError('usernameError', 'Username cannot be empty');
            return;
        }

        try {
            const response = await fetch(`/api/questions/${questionId}/answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: answerText, ans_by: username})
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                onAnswerSubmit();
                setFormData({ answerText: '', username: '' });
            }
        } catch (error) {
            console.error('Failed to post answer:', error);
            alert('Failed to post the answer. Please try again.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="answer-form">
            <h2>Post Your Answer:</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-container">
                    <div className="form-field">
                        <label htmlFor="username">Username*</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Enter your username"
                        />
                        <p className="error-message">{errorMessages.usernameError}</p>
                    </div>
                    <div className="form-field">
                        <label htmlFor="answerText">Answer Text*</label>
                        <input
                            type="text"
                            name="answerText"
                            value={formData.answerText}
                            onChange={handleInputChange}
                            placeholder="Add details"
                        />
                        <p className="error-message">{errorMessages.answerTextError}</p>
                    </div>
                    <p className="error-message">{errorMessages.formError}</p>
                    <div className="form-field">
                        <button type="submit" className='blue-button'>Post Answer</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AnswerForm;

