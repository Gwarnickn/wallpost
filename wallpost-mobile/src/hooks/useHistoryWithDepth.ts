import { useNavigate, useLocation } from "react-router-dom";

export const useHistoryWithDepth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentDepth =
    (location.state as { currentDepth?: number } | null)?.currentDepth ?? 0;

  const push = (path: string, withViewTransition = false) => {
    navigate(path, {
      viewTransition: withViewTransition,
      state: { currentDepth: currentDepth + 1 },
    });
  };

  const replace = (path: string, withViewTransition = false) => {
    navigate(path, {
      replace: true,
      viewTransition: withViewTransition,
      state: { currentDepth },
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  return { currentDepth, push, replace, goBack };
};
