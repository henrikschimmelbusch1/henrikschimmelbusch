
import React, { createContext, useState, useMemo } from 'react';

interface MagneticContextType {
  isMagnetic: boolean;
  setIsMagnetic: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MagneticContext = createContext<MagneticContextType>({
  isMagnetic: false,
  setIsMagnetic: () => {},
});

export const MagneticProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isMagnetic, setIsMagnetic] = useState(false);

  const value = useMemo(() => ({ isMagnetic, setIsMagnetic }), [isMagnetic]);

  return (
    <MagneticContext.Provider value={value}>
      {children}
    </MagneticContext.Provider>
  );
};
