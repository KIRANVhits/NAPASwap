import React, { createContext, useState } from 'react';

export const SelectedNFTsContext = createContext<any[]>([]);

export const SelectedNFTsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedNFTs, setSelectedNFTs] = useState<any[]>([]);

  return (
    <SelectedNFTsContext.Provider value={[selectedNFTs, setSelectedNFTs]}>
      {children}
    </SelectedNFTsContext.Provider>
  );
};
