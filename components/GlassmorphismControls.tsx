
import React, { useState } from 'react';
import { ConfettiConfig } from '../types';
import SettingsIcon from './icons/SettingsIcon';

interface ControlsProps {
  confettiConfig: ConfettiConfig;
  setConfettiConfig: React.Dispatch<React.SetStateAction<ConfettiConfig>>;
  isCursorVisible: boolean;
  setIsCursorVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlassmorphismControls: React.FC<ControlsProps> = ({ 
  confettiConfig, 
  setConfettiConfig,
  isCursorVisible,
  setIsCursorVisible,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfettiChange = (key: keyof ConfettiConfig, value: string) => {
    setConfettiConfig(c => ({ ...c, [key]: parseFloat(value) }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[10001] w-14 h-14 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors duration-200"
        aria-label="Open settings"
      >
        <SettingsIcon />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[10001] p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-lg w-64 text-gray-800 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Settings</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
      </div>
      
      {/* Cursor Section */}
      <section className="mb-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 border-b pb-1">Cursor</h4>
          <div className="flex items-center justify-between pt-2">
              <label htmlFor="cursor-visibility" className="text-sm text-gray-700">
                  Show Custom Cursor
              </label>
              <input
                  type="checkbox"
                  id="cursor-visibility"
                  checked={isCursorVisible}
                  onChange={(e) => setIsCursorVisible(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
          </div>
      </section>

      {/* Confetti Section */}
      <section>
        <h4 className="text-xs font-semibold text-gray-700 mb-2 border-b pb-1">Confetti</h4>
        <div className="flex flex-col gap-3 pt-2">
          {/* Particle Count */}
          <div>
            <label htmlFor="count" className="text-xs text-gray-600 flex justify-between">
              <span>Particle Count</span>
              <span>{Math.round(confettiConfig.count)}</span>
            </label>
            <input
              type="range" id="count" min="10" max="200" step="5" value={confettiConfig.count}
              onChange={e => handleConfettiChange('count', e.target.value)}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          {/* Particle Size */}
          <div>
            <label htmlFor="size" className="text-xs text-gray-600 flex justify-between">
              <span>Particle Size</span>
              <span>{confettiConfig.size.toFixed(1)}</span>
            </label>
            <input
              type="range" id="size" min="1" max="10" step="0.5" value={confettiConfig.size}
              onChange={e => handleConfettiChange('size', e.target.value)}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          {/* Initial Velocity */}
          <div>
            <label htmlFor="velocity" className="text-xs text-gray-600 flex justify-between">
              <span>Initial Velocity</span>
              <span>{confettiConfig.velocity.toFixed(1)}</span>
            </label>
            <input
              type="range" id="velocity" min="1" max="15" step="0.5" value={confettiConfig.velocity}
              onChange={e => handleConfettiChange('velocity', e.target.value)}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          {/* Gravity */}
          <div>
            <label htmlFor="gravity" className="text-xs text-gray-600 flex justify-between">
              <span>Gravity</span>
              <span>{confettiConfig.gravity.toFixed(2)}</span>
            </label>
            <input
              type="range" id="gravity" min="0.05" max="0.5" step="0.01" value={confettiConfig.gravity}
              onChange={e => handleConfettiChange('gravity', e.target.value)}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          {/* Fade Out */}
          <div>
            <label htmlFor="fadeOut" className="text-xs text-gray-600 flex justify-between">
              <span>Fade Out Speed</span>
              <span>{confettiConfig.fadeOut.toFixed(3)}</span>
            </label>
            <input
              type="range" id="fadeOut" min="0.005" max="0.05" step="0.001" value={confettiConfig.fadeOut}
              onChange={e => handleConfettiChange('fadeOut', e.target.value)}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default GlassmorphismControls;