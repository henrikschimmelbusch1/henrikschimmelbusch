
import React, { useRef, createRef } from 'react';
import type { Site } from '../types';
import { useMagnetic } from '../hooks/useMagnetic';

interface AutocompleteMenuProps {
  suggestions: Site[];
  selectedIndex: number;
}

const AutocompleteMenuItem: React.FC<{ site: Site; isSelected: boolean }> = ({ site, isSelected }) => {
  const itemRef = useRef<HTMLLIElement>(null);
  useMagnetic(itemRef, { scale: 1.03, strength: 0.2 });

  return (
    <li
      ref={itemRef}
      key={site.url}
      className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 ${
        isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
      }`}
    >
      <img src={site.favicon} alt={`${site.name} favicon`} className="w-6 h-6 mr-4 rounded-md" />
      <span className="text-gray-800">{site.name}</span>
    </li>
  );
};


const AutocompleteMenu: React.FC<AutocompleteMenuProps> = ({ suggestions, selectedIndex }) => {
  return (
    <div className="w-64 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      <ul>
        {suggestions.map((site, index) => (
          <AutocompleteMenuItem key={site.url} site={site} isSelected={index === selectedIndex} />
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteMenu;