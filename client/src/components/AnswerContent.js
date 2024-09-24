

import React, { useEffect, useState } from 'react';
import formatMetadata from './AllQuestionList';
import handleAskQuestionClick from './AllQuestionList';  
import AllQuestionList from './AllQuestionList'; 
import AnswerForm from './AnswerForm'; 
import CommentForm from './CommentForm';
import VoteButtons from './VoteButtons';

function AnswerContent({ isLoggedIn, question, onAskQuestionClick }) {
  const [answers, setAnswers] = useState([]);
  const [displayAnswerForm, setDisplayAnswerForm] = useState(false);
  const [displayAnswerContent, setDisplayAnswerContent] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');


  const [comments, setComments] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const [totalPages, setTotalPages] = useState({});

  

  
  useEffect(() => {
    if (question && question.answers) {
      setAnswers(question.answers);
      question.answers.forEach(answer => {
        answer.comments.forEach(commentId => {
          fetchComment(commentId, answer._id);
        });
      });
    }
  }, [question]);

  const fetchComment = async (commentId, answerId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/comments/${commentId}`);
      const comment = await response.json();
      setComments(prev => ({
        ...prev,
        [answerId]: [...(prev[answerId] || []), comment]
      }));
    } catch (error) {
      console.error('Error fetching comment:', error);
      setComments(prev => ({
        ...prev,
        [answerId]: [] 
      }));
    }
  };

  const handleCommentSubmit = async (answerId) => {
    if (!newCommentText.trim()) return;
    try {
      const response = await fetch(`/api/answers/${answerId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newCommentText,
          commented_by: 'username' 
        }),
      });
      const newComment = await response.json();
      setComments(prev => ({
        ...prev,
        [answerId]: [...(prev[answerId] || []), newComment]
      }));
      setNewCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  



const fetchComments = async (answerId, page = 1) => {
  try {
    const response = await fetch(`/api/answers/${answerId}/comments?page=${page}`);
    const data = await response.json();
    setComments(prev => ({ ...prev, [answerId]: data.comments }));
    setTotalPages(prev => ({ ...prev, [answerId]: data.totalPages }));
    setCurrentPage(prev => ({ ...prev, [answerId]: page }));
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const handlePages = (answerId, direction) => {
  const newPage = direction === 'next' ? currentPage[answerId] + 1 : currentPage[answerId] - 1;
  setCurrentPage(prev => ({ ...prev, [answerId]: newPage }));
  fetchComments(answerId, newPage);
};



  useEffect(() => {
    if (question && question.answers) {
      setAnswers(question.answers);
    }
  }, [question]);
  

  const handleAskAnswerClick = () => {
    setDisplayAnswerForm(true);
    setDisplayAnswerContent(false); 
  };

  // uh this is supposed to close the form but ijdkidjiorfkjmiokj
  const handleCloseForm = () => {
    setDisplayAnswerForm(false);
    setDisplayAnswerContent(true); 
  };

  function formatMetadata(date) {
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
  }

  function transformTextToHtml(text) {
    let index = 0;
    let transformedText = '';
    let lastIndex = 0;
  
    while (index < text.length) {
      index = text.indexOf('[', index);
      if (index === -1) {
        transformedText += text.substring(lastIndex);  
        break;
      }
  
      transformedText += text.substring(lastIndex, index);
  
      const closingBracketIndex = text.indexOf(']', index);
      const openParenthesisIndex = text.indexOf('(', closingBracketIndex);
      const closeParenthesisIndex = text.indexOf(')', openParenthesisIndex);
  
      if (closingBracketIndex === -1 || openParenthesisIndex !== closingBracketIndex + 1 || closeParenthesisIndex === -1) {
        transformedText += text.substring(index);
        break;
      }
  
      const linkText = text.substring(index + 1, closingBracketIndex);
      const linkUrl = text.substring(openParenthesisIndex + 1, closeParenthesisIndex).trim();
  
      if (!linkUrl.startsWith("http://") && !linkUrl.startsWith("https://")) {
        transformedText += `[${linkText}](${linkUrl})`;
      } else {
        transformedText += `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      }
      index = closeParenthesisIndex + 1;
      lastIndex = index;
    }
    return transformedText;
  }

  function addNewComment(answerId, comment) {
    setComments(prev => ({
      ...prev,
      [answerId]: prev[answerId] ? [...prev[answerId], comment] : [comment] // Check if array exists, otherwise create a new array
    }));
  }
  
  function AnswerDiv({ answer , addNewComment, onVote }) {
    const handleVote = (postId, voteType, success, votes) => {
      if (success) {
        console.log(`Vote ${voteType} was successful on post ${postId}`);
        answer.votes = votes; 
      } else {
        console.error(`Failed to vote ${voteType} on post ${postId}`);
      }
    };

    return (
      <div>
        <table className="answer-table" style={{ width: '100%', tableLayout: 'fixed' }}>
          <tbody>
            <tr>
              <td style={{ width: '70%', overflowWrap: 'break-word' }}>
                <div dangerouslySetInnerHTML={{ __html: transformTextToHtml(answer.text) }} />
                <VoteButtons postId={answer._id} postType="answers" onVote={handleVote} />
              </td>
              <td style={{ width: '30%', overflowWrap: 'break-word', textAlign: 'right' }}>
                <div>
                  <p className="green-text">{answer.ans_by}</p>
                  <p className="grey-text">answered {formatMetadata(answer.ans_date_time)}</p>
                  <p className="vote-count">{answer.votes || 0} Votes</p>
                </div>
              </td>
            </tr>
            {comments[answer._id] && comments[answer._id].map(comment => (
              <tr key={comment._id}>
                <td colSpan="2">
                  <p>{comment.text} - {comment.commented_by}</p>
                  <VoteButtons postId={comment._id} postType="comments" onVote={handleVote} />
                  {comment.votes} Votes
                </td>
              </tr>
            ))}
            {totalPages[answer._id] && (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center' }}>
                  <button onClick={() => handlePages(answer._id, 'prev')} disabled={currentPage[answer._id] <= 1}>
                    Previous
                  </button>
                  <span> Page {currentPage[answer._id]} of {totalPages[answer._id]} </span>
                  <button onClick={() => handlePages(answer._id, 'next')} disabled={currentPage[answer._id] >= totalPages[answer._id]}>
                    Next
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <CommentForm answerId={answer._id} addNewComment={addNewComment} />
      </div>
    );
  
  }
  return (
    <div>
      <table className="question-entry" style={{ width: '100%', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td style={{ width: '20%' }}>Answers: {answers.length}</td>
            <td style={{ width: '60%' }}><h2>{question.title}</h2></td>
            <td style={{ width: '20%', textAlign: 'right' }}>
              {isLoggedIn && (<button id="askQuestionBtn" className="blue-button" onClick={onAskQuestionClick}>Ask Question</button>)}
            </td>
          </tr>
          <tr>
            <td>Views: {question.views}</td>
            <td colSpan="2"><div dangerouslySetInnerHTML={{ __html: transformTextToHtml(question.text) }} /></td>
          </tr>
          {answers.map((answer, index) => (
            
            <AnswerDiv key={index} answer={answer} addNewComment={addNewComment}/>
            
          ))}
        </tbody>
      </table>
      {displayAnswerForm && (
        <AnswerForm 
          questionId={question._id}
          onAnswerSubmit={() => {
            setDisplayAnswerForm(false);
          }} 
        />
      )}
      <div>
        <button id="askAnswerBtn" className="blue-button" onClick={handleAskAnswerClick}>Answer Question</button>
      </div>
    </div>
  );
}

export default AnswerContent;





