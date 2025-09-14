import React, { createContext, useState, useContext, ReactNode } from 'react';

type DietProfile = 'Vegetarian' | 'Jain' | 'Vegan' | 'Sattvic';

interface AppContextType {
  dietProfile: DietProfile | null;
  setDietProfile: (profile: DietProfile) => void;
  allergies: string[];
  setAllergies: (allergies: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [dietProfile, setDietProfile] = useState<DietProfile | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);

  const value: AppContextType = {
    dietProfile,
    setDietProfile: (profile: DietProfile) => {
      console.log('Setting diet profile:', profile);
      setDietProfile(profile);
    },
    allergies,
    setAllergies,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
