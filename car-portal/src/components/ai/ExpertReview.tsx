import React from 'react';

interface ExpertReviewProps {
  comments: string[];
}

const ExpertReview: React.FC<ExpertReviewProps> = ({ comments }) => {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-6 rounded-r-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Nuestros Expertos Opinan
      </h3>
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <blockquote key={index} className="border-l-4 border-green-200 pl-4 italic">
            <p>"{comment}"</p>
          </blockquote>
        ))}
      </div>
    </div>
  );
};

export default ExpertReview;