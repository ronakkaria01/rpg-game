import React from 'react';

interface TextBlockProps {
  content: string;
  className?: string;
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, className = '' }) => {
  return (
    <div className={`text-gray-100 leading-relaxed mb-4 ${className}`}>
      {content}
    </div>
  );
};
