import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full mb-4"></div>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
};