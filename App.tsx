
import React, { useCallback, useEffect, useRef, useState } from 'react';
import DateTimeDisplay from './components/DateTimeDisplay';
import SearchComponent from './components/SearchComponent';
import Cursor from './components/Cursor';
import Confetti, { type ConfettiHandles } from './components/Confetti';
import { MagneticProvider } from './context/MagneticContext';
import { CursorConfig, ConfettiConfig, GlowConfig } from './types';
import GlassmorphismControls from './components/GlassmorphismControls';
import GlowControls from './components/GlowControls';

const App: React.FC = () => {
  const confettiRef = useRef<ConfettiHandles>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  
  const cursorConfig: CursorConfig = {
    fillOpacity: 0,
    blurRadius: 0.75,
    edgeThickness: 2.6,
    edgeOpacity: 0.66,
    borderOpacity: 0.48,
  };

  const [confettiConfig, setConfettiConfig] = useState<ConfettiConfig>({
    count: 20,
    size: 2,
    velocity: 3.5,
    gravity: 0.27,
    fadeOut: 0.028,
  });

  const [baseGlowConfig, setBaseGlowConfig] = useState<GlowConfig>({
    blur: 40,
    spread: 15,
    color: { r: 72, g: 135, b: 202, a: 0.3 },
  });

  const [intenseGlowConfig, setIntenseGlowConfig] = useState<GlowConfig>({
    blur: 120,
    spread: 60,
    color: { r: 72, g: 135, b: 202, a: 0.8 },
  });

  const triggerConfetti = useCallback((e: MouseEvent) => {
    confettiRef.current?.create(e.clientX, e.clientY, confettiConfig);
  }, [confettiConfig]);

  useEffect(() => {
    if (isCursorVisible) {
      document.body.classList.add('custom-cursor-active');
    } else {
      document.body.classList.remove('custom-cursor-active');
    }
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [isCursorVisible]);

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', triggerConfetti);
    
    return () => {
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('click', triggerConfetti);
    };
  }, [triggerConfetti]);

  return (
    <MagneticProvider>
      <div className="relative flex flex-col items-center justify-center min-h-screen font-sans antialiased text-gray-800">
        <DateTimeDisplay />
        <main className="flex items-center justify-center w-full">
          <SearchComponent
            baseGlowConfig={baseGlowConfig}
            intenseGlowConfig={intenseGlowConfig}
          />
        </main>
      </div>
      
      {isCursorVisible && (
        <Cursor 
          intensity={0.56} 
          stretchIntensity={0.19} 
          isMouseDown={isMouseDown} 
          config={cursorConfig}
        />
      )}
      <Confetti ref={confettiRef} config={confettiConfig} />
      <GlassmorphismControls 
        confettiConfig={confettiConfig} 
        setConfettiConfig={setConfettiConfig}
        isCursorVisible={isCursorVisible}
        setIsCursorVisible={setIsCursorVisible}
      />
      <GlowControls
        baseConfig={baseGlowConfig}
        setBaseConfig={setBaseGlowConfig}
        intenseConfig={intenseGlowConfig}
        setIntenseConfig={setIntenseGlowConfig}
      />
    </MagneticProvider>
  );
};

export default App;