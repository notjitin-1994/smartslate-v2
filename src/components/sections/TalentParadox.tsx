import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Zap, Users, Target, BookOpenCheck } from 'lucide-react';
import { Reveal } from '../common/reveal';
import './TalentParadox.css';

interface StatIconCardProps {
  icon: React.ReactElement<{ className?: string }>;
  value: number;
  label: string;
  active: boolean;
  onClick: () => void;
}

const StatIconCard: React.FC<StatIconCardProps> = ({ 
  icon, 
  value, 
  label, 
  active, 
  onClick 
}) => (
  <div 
    className="stat-icon-card group" 
    data-active={active}
    onClick={onClick} 
    role="button" 
    tabIndex={0} 
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
  >
    <div className="icon-wrapper">
      {React.cloneElement(icon as React.ReactElement, {
        className: `${icon.props.className || ''} transition-transform duration-300 group-hover:scale-110`
      })}
    </div>
    <div className="stat-value">{Math.ceil(value)}%</div>
    <div className="stat-label">{label}</div>
  </div>
);

interface TalentParadoxProps {
  onRevealNext: () => void;
}

export const TalentParadox: React.FC<TalentParadoxProps> = ({ onRevealNext }) => {
  const [activeSection, setActiveSection] = useState('perception');
  const [counterValues, setCounterValues] = useState<{ disruption: number; perception: number; crisis: number; demand: number }>({ disruption: 0, perception: 0, crisis: 0, demand: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const data = useMemo(() => ({
    perception: { 
      value: 16, 
      label: "Perception Gap", 
      desc: <>While academic institutions believe their students are prepared, <strong className="gradient-text">industry leaders disagree</strong>, highlighting a <strong className="gradient-text">major disconnect</strong> in work-readiness.</>, 
      excerpt: "Only 16% of industry leaders believe emerging talent is work-ready.", 
      icon: <Users className="w-10 h-10" /> 
    },
    disruption: { 
      value: 40, 
      label: "Skills Disruption", 
      desc: <>Core skills required for a typical job will <strong className="gradient-text">change by 2030</strong>, demanding a <strong className="gradient-text">fundamental shift</strong> in education and training.</>, 
      excerpt: "40% of core skills will change.", 
      icon: <Zap className="w-10 h-10" /> 
    },
    crisis: { 
      value: 42.6, 
      label: "Employability Crisis", 
      desc: <>The direct result of this skills gap is a <strong className="gradient-text">shrinking talent pipeline</strong>, with the employability of emerging professionals at a <strong className="gradient-text">startling low</strong>.</>, 
      excerpt: "The employability rate for emerging talent in India has dropped to 42.6%.", 
      icon: <Target className="w-10 h-10" /> 
    },
    demand: { 
      value: 97, 
      label: "Learning Demand", 
      desc: <>The workforce is eager to adapt. This <strong className="gradient-text">ambition is the single most powerful lever</strong> for growth and retention.</>, 
      excerpt: "97% of young professionals demand on-the-job learning.", 
      icon: <BookOpenCheck className="w-10 h-10" /> 
    }
  }), []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.2 });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let animationFrameId: number;
    const duration = 1500;
    const startTime = Date.now();
    
    const updateCounters = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setCounterValues(prevValues => {
        return {
          disruption: data.disruption.value * progress,
          perception: data.perception.value * progress,
          crisis: data.crisis.value * progress,
          demand: data.demand.value * progress
        };
      });
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounters);
      }
    };
    
    updateCounters();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, data]);

  const activeData = data[activeSection as keyof typeof data];

  return (
        <section id="talent-paradox" className="relative w-full pt-6 pb-16 bg-brand-background">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="text-left mb-12 max-w-4xl">
            <h2 className="section-title whitespace-nowrap">
              <span className="gradient-text">The Talent Paradox</span>: A <span className="gradient-text">Crisis</span> of Scale
            </h2>
            <p className="text-text-secondary text-lg max-w-3xl">
              The numbers paint a clear picture. India's <strong className="gradient-text">potential is immense</strong>, but it's constrained by a <strong className="gradient-text">persistent skills gap</strong>. This isn't just a challenge—it's a <strong className="gradient-text">direct risk to our collective economic future</strong>.
            </p>
          </div>
        </Reveal>
        
        <Reveal delay={200}>
                    <div ref={ref} className="paradox-dashboard border border-brand-accent/20 rounded-xl p-8">
            <div className="visualization-container">
              <div className="chart-grid">
                {Object.entries(data).map(([key, item]) => (
                  <StatIconCard 
                    key={key}
                    active={activeSection === key}
                    value={counterValues[key as keyof typeof counterValues]}
                    label={item.label}
                    icon={item.icon}
                    onClick={() => setActiveSection(key)}
                  />
                ))}
              </div>
              
              <div className="narrative-panel">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold font-quicksand mb-2 text-white">{activeData.label}</h3>
                  <p className="stat-value text-5xl font-bold mb-4 text-brand-accent">
                    {activeData.value.toString().includes('.') 
                      ? counterValues[activeSection as keyof typeof counterValues].toFixed(1) 
                      : Math.ceil(counterValues[activeSection as keyof typeof counterValues])
                    }%
                  </p>
                  <p className="text-text-secondary">{activeData.desc}</p>
                </div>
                
                <div 
                  key={`excerpt-${activeSection}-${Date.now()}`}
                  className="excerpt-box"
                  style={{ '--fill-width': `${activeData.value}%` } as React.CSSProperties}
                >
                  <p className="text-brand-accent-dark italic">"{activeData.excerpt}"</p>
                </div>
                
                <div className="call-to-action mt-8">
                  <p className="text-text-secondary mb-6">
                    The most effective learning programs aren't bought off the shelf—<strong className="gradient-text">they're built.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-left">
            <button 
              onClick={onRevealNext}
              className="px-8 py-3 bg-brand-accent text-brand-bg font-semibold rounded-lg hover:bg-brand-accent/90 transition-colors duration-300 flex items-center space-x-2 group border border-brand-accent/50"
            >
              <span>Discover our Framework</span>
              <svg 
                className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300 animate-arrow-bounce" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </Reveal>
        

      </div>
    </section>
  );
};