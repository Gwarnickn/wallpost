import { Calendar } from "griddy-icons";
import type { Post } from "../../../types/post";
import { exportToCalendar } from "../../../services/calendar";

const TomatoIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 7.2c4.4 0 8 2.9 8 6.9 0 3.9-3.6 6.9-8 6.9s-8-3-8-6.9c0-4 3.6-6.9 8-6.9Z"
      fill="currentColor"
    />
    <path
      d="M12 7.4c-.6-1.9-2.2-3.2-4.4-3.5M12 7.4c.6-1.9 2.2-3.2 4.4-3.5M12 7.4V4.2"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

interface ActionButtonsProps {
  post: Post;
}

const ActionButtons = ({ post }: ActionButtonsProps) => {
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
        onClick={() => console.log("rzucono pomidorem")}
      >
        <TomatoIcon />
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
