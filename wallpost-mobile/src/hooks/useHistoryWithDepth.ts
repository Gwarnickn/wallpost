import { useNavigate, useLocation } from "react-router-dom";

export const useHistoryWithDepth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const currentDepth = (location.state as { currentDepth?: number })?.currentDepth || 0;

    const pushWithDepth = (path: string, withViewTransition?: boolean) => {
        navigate(path, {viewTransition: withViewTransition ?? true, state: {currentDepth: currentDepth + 1}})
    }
    
    const goBack = () => {
        navigate(-1)
    }

    return {
        ...history,
        currentDepth,
        goBack,
        push: pushWithDepth,
    }
}