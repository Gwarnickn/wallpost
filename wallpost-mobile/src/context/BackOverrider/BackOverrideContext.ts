import { createContext } from "react";

interface BackOverrideContextType {
  registerOverride: (action: () => void) => void;
  clearOverride: () => void;
}

export const BackOverrideContext = createContext<BackOverrideContextType | null>(null);


