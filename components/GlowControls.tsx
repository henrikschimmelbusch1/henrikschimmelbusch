import React, { useState } from 'react';
import { GlowConfig } from '../types';
import GlowIcon from './icons/GlowIcon';

interface GlowControlsProps {
  baseConfig: GlowConfig;
  setBaseConfig: React.Dispatch<React.SetStateAction<GlowConfig>>;
  intenseConfig: GlowConfig;
  setIntenseConfig: React.Dispatch<React.SetStateAction<GlowConfig>>;
}

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: string) => void;
  displayValue?: string;
}> = ({ label, value, min, max, step, onChange, displayValue }) => (
  <div>
    <label className="text-xs text-gray-600 flex justify-between">
      <span>{label}</span>
      <span>{displayValue ?? value}</span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

const GlowControls: React.FC<GlowControlsProps> = ({
  baseConfig,
  setBaseConfig,
  intenseConfig,
  setIntenseConfig,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfigChange = (
    key: 'blur' | 'spread',
    value: string,
    isBase: boolean
  ) => {
    const setter = isBase ? setBaseConfig : setIntenseConfig;
    setter(c => ({ ...c, [key]: parseFloat(value) }));
  };
  
  const handleColorChange = (
    key: 'r' | 'g' | 'b' | 'a',
    value: string,
    isBase: boolean
  ) => {
    const setter = isBase ? setBaseConfig : setIntenseConfig;
    setter(c => ({
      ...c,
      color: { ...c.color, [key]: parseFloat(value) },
    }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[10001] w-14 h-14 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white transition-colors duration-200"
        aria-label="Open glow settings"
      >
        <GlowIcon />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[10001] p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-lg w-72 text-gray-800 max-h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Glow Controls</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
      </div>

      {/* Unfocused Glow Section */}
      <section className="mb-4">
        <h4 className="text-xs font-semibold text-gray-700 mb-2 border-b pb-1">Unfocused Glow</h4>
        <div className="flex flex-col gap-3">
          <Slider label="Blur" value={baseConfig.blur} min={0} max={200} step={1} onChange={v => handleConfigChange('blur', v, true)} />
          <Slider label="Spread" value={baseConfig.spread} min={0} max={100} step={1} onChange={v => handleConfigChange('spread', v, true)} />
          <Slider label="Red" value={baseConfig.color.r} min={0} max={255} step={1} onChange={v => handleColorChange('r', v, true)} />
          <Slider label="Green" value={baseConfig.color.g} min={0} max={255} step={1} onChange={v => handleColorChange('g', v, true)} />
          <Slider label="Blue" value={baseConfig.color.b} min={0} max={255} step={1} onChange={v => handleColorChange('b', v, true)} />
          <Slider label="Opacity" value={baseConfig.color.a} min={0} max={1} step={0.01} onChange={v => handleColorChange('a', v, true)} displayValue={baseConfig.color.a.toFixed(2)} />
        </div>
      </section>

      {/* Focused Glow Section */}
      <section>
        <h4 className="text-xs font-semibold text-gray-700 mb-2 border-b pb-1">Focused Glow</h4>
        <div className="flex flex-col gap-3">
          <Slider label="Blur" value={intenseConfig.blur} min={0} max={200} step={1} onChange={v => handleConfigChange('blur', v, false)} />
          <Slider label="Spread" value={intenseConfig.spread} min={0} max={100} step={1} onChange={v => handleConfigChange('spread', v, false)} />
          <Slider label="Red" value={intenseConfig.color.r} min={0} max={255} step={1} onChange={v => handleColorChange('r', v, false)} />
          <Slider label="Green" value={intenseConfig.color.g} min={0} max={255} step={1} onChange={v => handleColorChange('g', v, false)} />
          <Slider label="Blue" value={intenseConfig.color.b} min={0} max={255} step={1} onChange={v => handleColorChange('b', v, false)} />
          <Slider label="Opacity" value={intenseConfig.color.a} min={0} max={1} step={0.01} onChange={v => handleColorChange('a', v, false)} displayValue={intenseConfig.color.a.toFixed(2)} />
        </div>
      </section>
    </div>
  );
};

export default GlowControls;