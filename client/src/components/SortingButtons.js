import React from 'react';

function SortingButtons({ setSortedQuestions }) {
  const fetchSortedQuestions = async (sortType) => {
    try {
      const response = await fetch(`/api/sorting?sort=${sortType}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse the JSON data
      setSortedQuestions(data); // Update the question list with sorted data
    } catch (error) {
      console.error('Failed to fetch and sort questions:', error);
    }
  };

  return (
    <div className="button-group">
      <button onClick={() => fetchSortedQuestions('newest')} className="sorting-button">Newest</button>
      <button onClick={() => fetchSortedQuestions('active')} className="sorting-button">Active</button>
      <button onClick={() => fetchSortedQuestions('unanswered')} className="sorting-button">Unanswered</button>
    </div>
  );
}

export default SortingButtons;
