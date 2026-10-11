import { useContext, useEffect, useRef } from "react";
import { BackOverrideContext } from "../context/BackOverrider/BackOverrideContext";

// Dopóki `active` jest true, natywny przycisk "wstecz" wywołuje `action`
// (np. zamknięcie okna) zamiast cofać stronę.
export const useBackOverride = (active: boolean, action: () => void) => {
  const backOverride = useContext(BackOverrideContext);

  // zawsze najnowsza wersja akcji, bez ponownej rejestracji przy każdym renderze
  const actionRef = useRef(action);
  useEffect(() => {
    actionRef.current = action;
  });

  useEffect(() => {
    if (!active || !backOverride) return;
    return backOverride.registerOverride(() => actionRef.current());
  }, [active, backOverride]);
};
