import React, { useEffect, useState } from 'react';
import SortingButtons from './SortingButtons';
import AnswerContent from './AnswerContent';
import NewQuestionForm from './NewQuestionForm';
import Cookies from 'js-cookie';
import '../stylesheets/App.css';
import VoteButtons from './VoteButtons';

function AllQuestionList({ isLoggedIn, activeContent, setActiveContent }) {
  console.log(isLoggedIn)
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [displayNewQuestionForm, setDisplayNewQuestionForm] = useState(false);
  const [displayAnswerContent, setDisplayAnswerContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(0); // Track the current page
  const pageSize = 5; // Number of questions per page
  const totalPages = Math.ceil(questions.length / pageSize); // Calculate total pages

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
          console.log(data)
        } else {
          console.error('Failed to fetch questions');
          throw new Error('Could not fetch questions.');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  
    fetchQuestions();
  }, []);

  const onVote = (postId, voteType, success) => {
    if (success) {
      console.log(`Vote ${voteType} was successful on post ${postId}`);
      // Here, you might want to update your state or re-fetch some data
    } else {
      console.error(`Failed to vote ${voteType} on post ${postId}`);
    }
  };

  const handleAskQuestionClick = () => {
    setDisplayNewQuestionForm(true);
  };

  const handleClickOnQuestion = async (question) => {
    setDisplayAnswerContent(true);
    setSelectedQuestion(question);
  };

  const handlePrevClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1); // Move to the previous page
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1); // Move to the next page
    } else {
      setCurrentPage(0); // Wrap around to the first page if on the last page
    }
  };

  const displayedQuestions = questions.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

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

  const setSortedQuestions = (sortedQuestions) => {
    setQuestions(sortedQuestions);
  };

  const addQuestionToList = (newQuestion) => {
    setQuestions(prevQuestions => [
      { ...newQuestion, id: prevQuestions.length + 1 },
      ...prevQuestions
    ]);
  };

    let questionsLinkClass = "active";
  const handleQuestionsLinkClick = () => {
    setActiveContent('AllQuestionList');
    questionsLinkClass = "active"
    tagsLinkClass = "inactive"
  };

  let tagsLinkClass;
  const handleTagsLinkClick = () => {
    setActiveContent('TagsContent');
    questionsLinkClass = "inactive"
    tagsLinkClass = "active"
  };

  return (
    <div id="questionList" style={{ minHeight: '400px' }}>
      <div id="menu" className="menu">
        <ul>
          <li>
            <a href="#" id="questionsLink" className="active" onClick={handleQuestionsLinkClick}>Questions</a>
          </li>
          <li>
            <a href="#" id="tagsLink" className="inactive" onClick={handleTagsLinkClick}>Tags</a>
          </li>
        </ul>
      </div>
      {displayNewQuestionForm ? (
        <NewQuestionForm
          activeContent={activeContent} setActiveContent={setActiveContent}
          addQuestionToList={addQuestionToList}
          onSuccess={() => {
            setDisplayNewQuestionForm(false);
            setActiveContent('AllQuestionList');
          }}
        />
      ) : displayAnswerContent && selectedQuestion ? (
        <AnswerContent
          question={selectedQuestion}
          onAskQuestionClick={handleAskQuestionClick} 
          disabled={!isLoggedIn}
        />
      ) : (
        <>
          <div className="header-row" id="header-row">
            <h2 id="allQuestionTitle" className="title">All Questions</h2>
            {isLoggedIn && (
              <button id="askQuestionBtn" className="blue-button" onClick={handleAskQuestionClick}>Ask Question</button>
            )}
          </div>
          <div className="button-row" id="button-row">
            <p id="totalNumQues" className="button-text">
              <span id="totalQuestions">{questions.length}</span> questions
            </p>
            <SortingButtons setSortedQuestions={setSortedQuestions} />
          </div>
          <div id="allQuestionList" style={{ overflowY: 'auto' }}>
            {questions.length === 0 ? (
              <p>No questions found.</p>
            ) : (
              displayedQuestions.map(question => (
                <div key={question._id} className="question-entry" onClick={() => handleClickOnQuestion(question)}>
                  <div className="title-row" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="answer-views" style={{ paddingRight: '15px' }}>
                      <p className="grey-text">Answers: {question.answers?.length || 0}</p>
                      <p className="grey-text">Views: {question.views}</p>
                    </div>
                    <h2 className="blue-text">{question.title}</h2>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                      <p className="red-text">{question.asked_by}</p>
                      <p className="grey-text">asked {formatMetadata(question.ask_date_time)}</p>
                      <p className="vote-count">{question.votes || 0} Votes</p>
                    </div>
                  </div>
                  <VoteButtons postId={question._id} postType="questions" onVote={onVote} />
                  <p className="question-summary">{question.summary}</p>
                  <div className="tag-containerQuest">
                    {question.tags?.map(tag => (
                      <span key={tag._id} className="tag">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))                            
            )}
            {totalPages > 1 && (
            <div className="page-controls" style={{ textAlign: 'center', paddingTop: '10px' }}>
              <button
                onClick={handlePrevClick}
                disabled={currentPage === 0} 
              >
                Prev
              </button>
              <button
                onClick={handleNextClick}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AllQuestionList;

