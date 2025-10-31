import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SITES } from '../constants';
import type { Site, GlowConfig } from '../types';
import AutocompleteMenu from './AutocompleteMenu';
import WaffleModal from './WaffleModal';
import WaffleIcon from './icons/WaffleIcon';
import SearchIcon from './icons/SearchIcon';
import { useMagnetic } from '../hooks/useMagnetic';

interface SearchComponentProps {
  baseGlowConfig: GlowConfig;
  intenseGlowConfig: GlowConfig;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ baseGlowConfig, intenseGlowConfig }) => {
  const [isTriggered, setIsTriggered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isWaffleModalOpen, setIsWaffleModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Site[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const waffleButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Weaker magnetic pull for the main search bar
  useMagnetic(formRef, { strength: 0.08, scale: 1.01 });

  // Stronger magnetic pull for the waffle button
  useMagnetic(waffleButtonRef, { strength: 0.3, scale: 1.05 });


  useEffect(() => {
    inputRef.current?.focus();
    setIsFocused(true);
  }, []);

  const resetTrigger = useCallback(() => {
    setIsTriggered(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) &&
          waffleButtonRef.current && !waffleButtonRef.current.contains(event.target as Node)) {
        resetTrigger();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [resetTrigger]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isWaffleModalOpen || inputValue.length > 0) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const shouldBeTriggered = rect.width - mouseX < 78;
    
    if (shouldBeTriggered !== isTriggered) {
      setIsTriggered(shouldBeTriggered);
    }
  };

  const handleMouseLeave = useCallback(() => {
    if (!isWaffleModalOpen) {
        resetTrigger();
    }
  }, [isWaffleModalOpen, resetTrigger]);

  const handleFocus = () => {
    setIsFocused(true);
    resetTrigger();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    resetTrigger();

    if (value.startsWith('/')) {
      const query = value.substring(1).toLowerCase();
      const filtered = SITES.filter(site =>
        site.name.toLowerCase().includes(query)
      ).slice(0, 5);
      setSuggestions(filtered);
      setSelectedSuggestionIndex(0);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      }
    }

    if (e.key === 'Enter') {
      if (inputValue.startsWith('/') && suggestions.length > 0) {
        e.preventDefault();
        const selectedSite = suggestions[selectedSuggestionIndex];
        if (selectedSite) {
          window.location.href = selectedSite.url;
        }
        return;
      }

      if (inputValue.includes('.') && !inputValue.includes(' ')) {
        e.preventDefault();
        let url = inputValue;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = `https://${url}`;
        }
        window.location.href = url;
        return;
      }
    }
     if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const showAutocomplete = inputValue.startsWith('/') && suggestions.length > 0 && isFocused;

  const glowConfig = isFocused ? intenseGlowConfig : baseGlowConfig;
  const formStyle: React.CSSProperties = {
    boxShadow: `0 0 ${glowConfig.blur}px ${glowConfig.spread}px rgba(${glowConfig.color.r}, ${glowConfig.color.g}, ${glowConfig.color.b}, ${glowConfig.color.a})`,
  };

  return (
    <>
      <div 
        className="w-full max-w-[720px] px-4 sm:w-[90vw]" 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative">
          <div className="relative flex items-center h-[58px]">
            <div
              className={`flex-grow transition-all duration-300 ease-in-out ${isTriggered ? 'mr-[73px]' : 'mr-0'}`}
            >
              <form
                ref={formRef}
                action="https://www.google.com/search"
                method="GET"
                target="_top"
                className="relative w-full h-[58px] bg-white border border-gray-300 transition-shadow duration-300 ease-in-out rounded-full overflow-hidden"
                style={formStyle}
              >
                <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  name="q"
                  value={inputValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Search the web"
                  className="w-full h-full bg-transparent text-lg pl-16 pr-6 text-gray-800 outline-none placeholder-gray-400"
                  autoComplete="off"
                />
              </form>
            </div>
            
            <div className={`absolute right-0 transition-all duration-300 ease-in-out ${isTriggered ? 'opacity-100' : 'opacity-0 -z-10'}`}>
                <button
                    ref={waffleButtonRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsWaffleModalOpen(true);
                    }}
                    className="w-[58px] h-[58px] bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300"
                    aria-label="Open apps menu"
                >
                    <WaffleIcon />
                </button>
            </div>
          </div>
          {showAutocomplete && (
             <div className="absolute top-full mt-2 left-16 z-10">
                <AutocompleteMenu suggestions={suggestions} selectedIndex={selectedSuggestionIndex} />
            </div>
          )}
        </div>
      </div>
      <WaffleModal 
        isOpen={isWaffleModalOpen} 
        onClose={() => setIsWaffleModalOpen(false)} 
        sites={SITES} 
      />
    </>
  );
};

export default SearchComponent;