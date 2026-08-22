import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon: Icon = FileQuestion,
  actionText,
  actionHref
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-neutral-800 rounded-lg bg-[#111]">
      <div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-neutral-500" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-neutral-400 max-w-sm mb-6">{description}</p>
      
      {actionText && actionHref && (
        <Link 
          to={actionHref}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
