import React, { useState } from 'react';

function CommentForm({ answerId, addNewComment }) {
    const [newCommentText, setNewCommentText] = useState('');

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
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

            if (response.ok) {
                const newComment = await response.json();
                addNewComment(answerId, newComment);
                setNewCommentText('');
            } else {
                throw new Error('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    return (
        <form onSubmit={handleCommentSubmit}>
            <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a comment..."
            />
            <button type="submit">Post Comment</button>
        </form>
    );
}

export default CommentForm;
