import React, { useEffect, useState } from 'react';
import SortingButtons from './SortingButtons';
import AnswerContent from './AnswerContent';
import NewQuestionForm from './NewQuestionForm';
import '../stylesheets/App.css';
import Cookies from 'js-cookie';

function Searching({ isLoggedIn, searchResults, activeContent, setActiveContent }) {
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [displayNewQuestionForm, setDisplayNewQuestionForm] = useState(false);
    const [displayAnswerContent, setDisplayAnswerContent] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // Track the current page
    const pageSize = 5; // Number of questions per page
    const totalPages = Math.ceil(searchResults.length / pageSize); // Calculate total pages

    const setSortedQuestions = (sortedQuestions) => {
      setQuestions(sortedQuestions);
    };

    useEffect(() => {
      const fetchSearchResults = async () => {
          const searchTerm = 'example';  
          try {
              const response = await fetch(`/api/search?searchTerm=${encodeURIComponent(searchTerm)}`);
              if (response.ok) {
                  const data = await response.json();
                  setQuestions(data);
              } else {
                  throw new Error('Failed to fetch search results');
              }
          } catch (error) {
              console.error('Error fetching search results:', error);
          }
      };
  
      fetchSearchResults();
  }, []); 
  
    const formatMetadata = (date) => {
        const currentDate = new Date();
        const diff = currentDate - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        return days >= 365 ? `${new Date(date).toLocaleString('en-us', { month: 'short', day: 'numeric', year: 'numeric' })} at ${new Date(date).toLocaleTimeString('en-us')}` :
               days >= 1 ? `${new Date(date).toLocaleString('en-us', { month: 'short', day: 'numeric' })} at ${new Date(date).toLocaleTimeString('en-us')}` :
               hours >= 1 ? `${hours} hours ago` :
               minutes >= 1 ? `${minutes} minutes ago` :
               `${seconds} seconds ago`;
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

      searchResults = searchResults.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

      const addQuestionToList = (newQuestion) => {
        setQuestions(prevQuestions => [
          { ...newQuestion, id: prevQuestions.length + 1 },
          ...prevQuestions
        ]);
      };

    return (
        <div id="Searching">
            <div id="menu" className="menu">
                <ul>
                    <li>
                        <a href="#" className="active" onClick={() => setActiveContent('AllQuestionList')}>Questions</a>
                    </li>
                    <li>
                        <a href="#" className="inactive" onClick={() => setActiveContent('TagsContent')}>Tags</a>
                    </li>
                    <li>
                        <a href="#" onClick={() => setActiveContent('UserProfile')} className="inactive">Profile</a>
                    </li>
                </ul>
            </div>
            {displayNewQuestionForm ? (
                <NewQuestionForm
                    activeContent={activeContent}
                    setActiveContent={setActiveContent}
                    onSuccess={() => {
                        setDisplayNewQuestionForm(false);
                        setActiveContent('AllQuestionList');
                    }}
                />
            ) : displayAnswerContent && selectedQuestion ? (
                <AnswerContent question={selectedQuestion} onAskQuestionClick={handleAskQuestionClick}/>
            ) : (
                <>
                    <div className="header-row">
                        <h2 className="title">Search Results</h2>
                        {isLoggedIn && (<button className="blue-button" onClick={handleAskQuestionClick} disabled={!isLoggedIn}>Ask Question</button>)}
                    </div>
                    <div className="button-row">
                        <p className="button-text">
                            <span>{searchResults.length}</span> questions
                        </p>
                        <SortingButtons setSortedQuestions={setSortedQuestions} />
                    </div>
                    <div id="allQuestionList">
                        {searchResults.length === 0 ? (
                            <p>No questions found.</p>
                        ) : (
                            searchResults.map((question) => (
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
                                        </div>
                                      </div>
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
                                <div className="pagination-controls" style={{ textAlign: 'center', paddingTop: '10px' }}>
                                  <button
                                    onClick={handlePrevClick}
                                    disabled={currentPage === 0} // Disable if on the first page
                                  >
                                    Prev
                                  </button>
                                  <span>Page {currentPage + 1} of {totalPages}</span> {/* Page count display */}
                                  <button
                                    onClick={handleNextClick}
                                    disabled={currentPage === totalPages - 1} // Disable if on the last page
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
                    

export default Searching;