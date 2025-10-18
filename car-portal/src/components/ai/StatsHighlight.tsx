import React from 'react';

interface StatsHighlightProps {
  stats: string[];
}

const StatsHighlight: React.FC<StatsHighlightProps> = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="bg-purple-50 border-l-4 border-purple-500 text-purple-800 p-6 rounded-r-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        Estadísticas Clave
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const [key, value] = stat.split(':');
          return (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm flex flex-col">
              <span className="text-sm font-semibold text-purple-600">{key}</span>
              <span className="text-lg font-bold text-gray-800">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsHighlight;