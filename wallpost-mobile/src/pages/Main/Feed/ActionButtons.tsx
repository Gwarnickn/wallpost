import { Calendar } from "griddy-icons";
import type { Post } from "../../../types/post";
import { exportToCalendar } from "../../../services/calendar";

interface ActionButtonsProps {
  post: Post;
  activateTomato: () => void;
}

const ActionButtons = ({ post, activateTomato }: ActionButtonsProps) => {
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
        className="action-buttons__button"
        aria-label="Rzuć pomidorem"
        onClick={activateTomato}
      >
        🍅 
      </button>

      <button
        type="button"
        className="action-buttons__button action-buttons__button--ai"
        aria-label="AI"
        onClick={() => {
          // TODO: implement AI action
        }}
      >
        AI
      </button>
    </div>
  );
};

export default ActionButtons;
