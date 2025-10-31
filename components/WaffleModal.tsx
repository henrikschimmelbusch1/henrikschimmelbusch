
import React, { useRef } from 'react';
import type { Site } from '../types';
import { useMagnetic } from '../hooks/useMagnetic';

interface WaffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: Site[];
}

const MagneticSiteLink: React.FC<{ site: Site }> = ({ site }) => {
    const linkRef = useRef<HTMLAnchorElement>(null);
    useMagnetic(linkRef);

    return (
        <a 
            ref={linkRef}
            key={site.url} 
            href={site.url} 
            className="flex flex-col items-center justify-center text-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
            <img src={site.favicon} alt={`${site.name} favicon`} className="w-9 h-9 mb-2 rounded-lg pointer-events-none" />
            <span className="text-xs text-gray-700 truncate w-full pointer-events-none">{site.name}</span>
        </a>
    );
};

const WaffleModal: React.FC<WaffleModalProps> = ({ isOpen, onClose, sites }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4"
        style={{ maxWidth: '420px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-3 gap-y-6 gap-x-4">
          {sites.map(site => (
            <MagneticSiteLink key={site.url} site={site} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaffleModal;