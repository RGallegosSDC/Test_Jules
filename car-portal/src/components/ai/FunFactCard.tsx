import React from 'react';

interface FunFactCardProps {
  facts: string[];
}

const FunFactCard: React.FC<FunFactCardProps> = ({ facts }) => {
  if (!facts || facts.length === 0) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-r-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Sabías que...
      </h3>
      <ul className="space-y-3">
        {facts.map((fact, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-500 font-bold mr-2">&#8227;</span>
            <p className="flex-1">{fact}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FunFactCard;