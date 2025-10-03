// src/contexts/UniversityContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface UniversityContextProps {
  universityId: string | null;
  setUniversityId: (id: string) => void;
}

const UniversityContext = createContext<UniversityContextProps>({
  universityId: null,
  setUniversityId: () => {},
});

export const UniversityProvider = ({ children }: { children: ReactNode }) => {
  const [universityId, setUniversityId] = useState<string | null>(null);
  return (
    <UniversityContext.Provider value={{ universityId, setUniversityId }}>
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversity = () => useContext(UniversityContext);