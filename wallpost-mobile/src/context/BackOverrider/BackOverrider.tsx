import { useRef, useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { App as MobileApp } from "@capacitor/app";
import { useHistoryWithDepth } from "../../hooks/useHistoryWithDepth";
import { BackOverrideContext } from "./BackOverrideContext";

export const BackOverrider = () => {
  const history = useHistoryWithDepth();
  const pathname = useLocation().pathname;

  // stos nadpisań: ostatnio otwarte okno (modal, podgląd...) zamyka się pierwsze
  const overrides = useRef<(() => void)[]>([]);

  // listener poniżej rejestruje się tylko raz, więc aktualną historię
  // (głębokość + goBack) czyta z refa odświeżanego po każdym renderze
  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  });

  const contextValue = useMemo(
    () => ({
      registerOverride: (action: () => void) => {
        overrides.current.push(action);
        return () => {
          overrides.current = overrides.current.filter((x) => x !== action);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    const backButtonListener = MobileApp.addListener("backButton", () => {
      const override = overrides.current[overrides.current.length - 1];

      if (override) {
        override(); // otwarte okno - zamykamy je zamiast cofać stronę
      } else if (historyRef.current.currentDepth > 0) {
        historyRef.current.goBack();
      } else {
        MobileApp.exitApp();
      }
    });

    return () => {
      backButtonListener.then((x) => x.remove());
    };
  }, []);

  // start aplikacji: "/" podmieniamy na feed (głębokość 0 - stąd "wstecz" wychodzi z aplikacji)
  useEffect(() => {
    if (pathname === "/") history.replace("/feed", false);
  }, [pathname]);

  return (
    <BackOverrideContext.Provider value={contextValue}>
      <Outlet />
    </BackOverrideContext.Provider>
  );
};
