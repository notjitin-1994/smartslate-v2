import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames

interface HeaderProps {
  onContactClick: (formType?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onContactClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/courses', label: 'Courses' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/smartslate-difference', label: 'The Smartslate Difference', gradient: true },
    { path: '/collaborate', label: 'Collaborate & Partner' }
  ];

  const navLinkClasses = ({ isActive, gradient }: { isActive: boolean; gradient?: boolean }): string => {
    if (isActive) {
      // Active link styles
      if (gradient) {
        return cn(
          'text-sm whitespace-nowrap transition-all duration-300 font-bold',
          'text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(243,72%,68%)]',
          'bg-size-200 animate-gradient',
          'hover:brightness-125'
        );
      }
      return cn('text-sm whitespace-nowrap transition-colors duration-300 font-medium', 'text-[hsl(var(--primary))]');
    }
    // Inactive link
    return cn(
      'text-sm whitespace-nowrap transition-colors duration-300 font-medium',
      gradient ? 'gradient-text hover:font-semibold' : 'text-text-secondary/90 hover:text-white'
    );
  };

  const mobileNavLinkClasses = ({ isActive, gradient }: { isActive: boolean; gradient?: boolean }): string => {
    if (isActive) {
      if (gradient) {
        return cn('block py-2 font-semibold', 'text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-[hsl(var(--primary))]');
      }
      return cn('block py-2 font-semibold', 'text-[hsl(var(--primary))]');
    }
    return cn('block py-2 font-semibold', gradient ? 'gradient-text' : 'text-text-secondary hover:text-white');
  };

  return (
    <header id="main-header" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/70 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="py-2">
            <img 
              src="/images/Final-Dark-BG.png"
              alt="smartslate.io logo"
              className="h-8 w-auto"
              width="160"
              height="32"
              loading="lazy"
              decoding="async"
            />
          </NavLink>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map(link => (
              <NavLink key={link.path} to={link.path} className={({ isActive }) => navLinkClasses({ isActive, gradient: link.gradient })}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-white focus:outline-none z-50" 
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-6 relative">
                <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 top-2.5' : 'top-1'}`}></span>
                <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'top-2.5'}`}></span>
                <span className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 top-2.5' : 'top-4'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="px-6 pb-4 border-t border-brand-card-bg flex flex-col space-y-2">
          {navLinks.map(link => (
            <NavLink 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsMenuOpen(false)} 
              className={({ isActive }) => mobileNavLinkClasses({ isActive, gradient: link.gradient })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};