import { createContext } from "react";

interface BackOverrideContextType {
  // rejestruje akcję pod przycisk "wstecz"; zwraca funkcję, która ją wyrejestrowuje
  registerOverride: (action: () => void) => () => void;
}

export const BackOverrideContext =
  createContext<BackOverrideContextType | null>(null);
