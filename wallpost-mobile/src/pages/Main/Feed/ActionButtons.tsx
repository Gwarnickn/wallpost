import { Calendar } from "griddy-icons";
import type { Post } from "../../../types/post";
import { exportToCalendar } from "../../../services/calendar";

interface ActionButtonsProps {
  post: Post;
  saved: boolean;
  onToggleSave: () => void;
  activateTomato: () => void;
}

const ActionButtons = ({
  post,
  saved,
  onToggleSave,
  activateTomato,
}: ActionButtonsProps) => {
  return (
    <div className="action-buttons">
      <button
        type="button"
        className="action-buttons__button"
        aria-label="Dodaj do kalendarza"
        onClick={() => exportToCalendar(post)}
      >
        <Calendar size={26} />
      </button>

      <button
        type="button"
        className={`action-buttons__button action-buttons__button--like ${saved ? "action-buttons__button--liked" : ""}`}
        aria-label={saved ? "Cofnij polubienie" : "Polub"}
        onClick={onToggleSave}
      >
        ❤︎⁠
      </button>

      <button
        type="button"
        className="action-buttons__button"
        aria-label="Rzuć pomidorem"
        onClick={activateTomato}
      >
        🍅
      </button>
    </div>
  );
};

export default ActionButtons;
