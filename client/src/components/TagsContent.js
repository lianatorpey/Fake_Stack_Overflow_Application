

import React, { useState, useEffect } from 'react';
import NewQuestionForm from './NewQuestionForm'; 
import TagResults from './TagResults';
import '../stylesheets/App.css';

function Tags({ isLoggedIn, activeContent, setActiveContent }) {
    const [tags, setTags] = useState([]);
    const [displayNewQuestionForm, setDisplayNewQuestionForm] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [displayTagResult, setDisplayTagResult] = useState(false);
        const setQuestions = useState([])[1];

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('/api/tags');
                if (!response.ok) {
                    throw new Error('Failed to fetch tags');
                }
                const fetchedTags = await response.json();
                setTags(fetchedTags);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const handleAskQuestionClick = () => {
        setDisplayNewQuestionForm(true); 
    };

    const handleTagLinkClick = (tagName) => {
        console.log("tag link clicked: " + tagName);
        setDisplayTagResult(true);
        setSelectedTag(tagName); 
    };

    // Function to add a new question to the list
    const addQuestionToList = (newQuestion) => {
        setQuestions(prevQuestions => [
            { ...newQuestion, id: prevQuestions.length + 1 }, // Ensure each question has a unique ID
            ...prevQuestions
        ]);
    };

    let questionsLinkClass = "inactive";
    const handleQuestionsLinkClick = () => {
        setActiveContent('AllQuestionList');
        questionsLinkClass = "active"
        tagsLinkClass = "inactive"
    };

    let tagsLinkClass = "active";
    const handleTagsLinkClick = () => {
        setActiveContent('TagsContent');
        questionsLinkClass = "inactive"
        tagsLinkClass = "active"
    };

    return (
        <div id="tag-container">
            <div id="menu" className="menu">
                <ul>
                    <li>
                        <a href="#questions" id="questionsLink" className={activeContent === 'AllQuestionList' ? "active" : "inactive"} onClick={handleQuestionsLinkClick}>
                            Questions
                        </a>
                    </li>
                    <li>
                        <a href="#tags" id="tagsLink" className={activeContent === 'TagsContent' ? "active" : "inactive"} onClick={handleTagsLinkClick}>
                            Tags
                        </a>
                    </li>
                </ul>
            </div>
            {displayNewQuestionForm ? (
                <NewQuestionForm
                    setActiveContent={setActiveContent}
                    onSuccess={() => {
                        setDisplayNewQuestionForm(false);
                        setActiveContent('AllQuestionList');
                    }}
                />
            ) : (
                <>
                    <div className="header-row" id="header-row">
                        <h2 id="allQuestionTitle" className="title">All Tags</h2>
                        {isLoggedIn && (<button id="askQuestionBtn" className="blue-button" onClick={() => setDisplayNewQuestionForm(true)}>
                            Ask Question
                        </button>)}
                    </div>
                    <div className="tag-header-row" id="tag-header-row">
                        <p id="totalNumTags" className="button-text">
                            <span id="totalQuestions">{tags.length}</span> tags
                        </p>
                    </div>
                    <div className="tag-container-table">
                        {tags.map(tag => (
                            <div key={tag.name} className="tag-box">
                                <a href="#tag" className="tag-link" onClick={() => {
                                    setDisplayTagResult(true);
                                    setSelectedTag(tag.name);
                                }}>{tag.name}</a>
                                <span className="num-questions">{tag.count || 0} questions</span>
                            </div>
                        ))}
                    </div>
                    {displayTagResult && selectedTag && (
                        <TagResults tagName={selectedTag} />
                    )}
                </>
            )}
        </div>
    );    
}

export default Tags;





