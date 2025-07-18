import React from 'react';
import { LucideIcon, Clock } from 'lucide-react';

interface CourseCardProps {
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  Icon: LucideIcon;
  comingSoon?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  category,
  tags,
  imageUrl,
  Icon,
  comingSoon = false,
}) => {
  return (
    <div className="group relative cursor-pointer rounded-xl border border-white/10 bg-brand-card-bg p-4 transition-all duration-300 hover:border-brand-accent/40 hover:bg-[#2E2A8A]">
      <div className="absolute inset-0 -z-10 rounded-xl bg-brand-card-bg" />
      
      {/* Glow effect */}
      <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
           style={{
             background: 'radial-gradient(400px at 50% 50%, hsl(var(--brand-accent) / 0.15), transparent 80%)'
           }}
      />

      {comingSoon && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-yellow-300 ring-1 ring-inset ring-yellow-300/20 backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          Coming Soon
        </div>
      )}

      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
        <img 
          src={imageUrl} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          width="341" 
          height="192" 
          loading="lazy" 
          decoding="async" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/20 backdrop-blur-sm ring-1 ring-inset ring-brand-accent/30">
            <Icon className="h-7 w-7 text-brand-accent-light" />
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-brand-accent">{category}</div>
        <h3 className="mt-1 text-xl font-bold text-text-main">{title}</h3>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
      </div>

      <div className="mt-4 flex flex-col items-start gap-2">
        {tags.map((tag) => (
          <div key={tag} className="flex-initial">
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-inset ring-white/10">
              {tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
