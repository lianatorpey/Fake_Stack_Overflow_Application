import React, { useEffect, useState } from 'react';
import AnswerContent from './AnswerContent';
import '../stylesheets/App.css';
import Cookies from 'js-cookie';

function TagResults({ isLoggedIn, tagName, activeContent, setActiveContent }) {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [displayAnswerContent, setDisplayAnswerContent] = useState(false);

    useEffect(() => {
        const fetchQuestionsByTag = async () => {
            try {
                const response = await fetch(`/api/questions/tag/${tagName}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions for tag:', error);
            }
        };

        fetchQuestionsByTag();
    }, [tagName]);

    const formatMetadata = (date) => {
        const currentDate = new Date();
        const diff = currentDate - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days >= 365) {
            return `${date.toLocaleString('en-us', { month: 'short', day: 'numeric', year: 'numeric' })} at ${date.toLocaleTimeString('en-us')}`;
        } else if (days >= 1) {
            return `${date.toLocaleString('en-us', { month: 'short', day: 'numeric' })} at ${date.toLocaleTimeString('en-us')}`;
        } else if (hours >= 1) {
            return `${hours} hours ago`;
        } else if (minutes >= 1) {
            return `${minutes} minutes ago`;
        } else {
            return `${seconds} seconds ago`;
        }
    };

    const handleClickOnQuestion = (question) => {
        setDisplayAnswerContent(true);
        setSelectedQuestion(question); 
    };

    return (
        <div id="tagResults">
            {displayAnswerContent && selectedQuestion ? (
                <AnswerContent question={selectedQuestion} />
            ) : (
                <>
                    <h2 id="tagResultsTitle">[{tagName}] Tag Results</h2>
                    {questions.length === 0 ? (
                        <p>No questions found for tag {tagName}.</p>
                    ) : (
                        questions.map(question => (
                            <div key={question._id} className="question-entry">
                                <div onClick={() => {
                                    setDisplayAnswerContent(true);
                                    setSelectedQuestion(question);
                                }}>
                                    <h3>{question.title}</h3>
                                </div>
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
}

export default TagResults;

