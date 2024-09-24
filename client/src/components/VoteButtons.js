import React, { useState, useEffect } from 'react';

function VoteButtons({ postId, postType, userId, onVote }) {
    const [voteState, setVoteState] = useState(null);  
    const [voteCount, setVoteCount] = useState(0); 

    useEffect(() => {
        const fetchVoteState = async () => {
            try {
                const response = await fetch(`/api/${postType}/${postId}/userVote?userId=${userId}`);
                if (response.ok) {
                    const { userVote, votes } = await response.json();
                    setVoteState(userVote); 
                    setVoteCount(votes); 
                }
            } catch (error) {
                console.error('Failed to fetch current vote state:', error);
            }
        };
        fetchVoteState();
    }, [postId, postType, userId]);
  
    const handleVote = async (voteType) => {
      const isSameVote = voteType === voteState;
      const newVoteType = isSameVote ? null : voteType; // Toggle vote

      try {
        const response = await fetch(`/api/${postType}/${postId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, voteType: newVoteType })
        });
        const data = await response.json();

        if (response.ok) {
          setVoteState(newVoteType);
          onVote(data.votes); // Pass the new votes count to update UI
        } else {
          alert(data.message || 'Failed to vote');
        }
      } catch (error) {
        console.error('Error voting:', error);
      }
    };

  
    return (
        <div>
            <button onClick={() => handleVote('up')} disabled={voteState === 'up'}>Upvote</button>
            <button onClick={() => handleVote('down')} disabled={voteState === 'down'}>Downvote</button>
            <span> {voteCount} Votes</span> 
        </div>
    );
}

export default VoteButtons;
