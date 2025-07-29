import React from 'react';
import { Reveal } from '../../common/reveal';

interface CollaborationCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export const CollaborationCard: React.FC<CollaborationCardProps> = ({ icon, title, description, buttonText, onClick }) => (
  <Reveal>
    <button 
      onClick={onClick} 
      className="h-full p-8 rounded-xl bg-brand-card-bg border border-brand-accent/20 shadow-2xl flex flex-col text-left hover:border-brand-accent transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
    >
      <div className="flex-shrink-0">
        <div className="inline-block p-4 bg-brand-accent/10 rounded-full">
          {icon}
        </div>
        <h3 className="font-quicksand text-2xl font-bold text-white mt-6">{title}</h3>
      </div>
      <div className="flex-grow mt-4">
        <p className="text-text-secondary">
          {description}
        </p>
      </div>
      <div className="mt-6">
        <span className="font-semibold text-brand-accent group-hover:underline">
          {buttonText} &rarr;
        </span>
      </div>
    </button>
  </Reveal>
);
