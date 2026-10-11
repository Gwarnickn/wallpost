import { useHistoryWithDepth } from "../../../hooks/useHistoryWithDepth";
import { DateTime } from "luxon";
import type { Post } from "../../../types/post";
import PostMap from "./PostMap";

const DetailsPanel = ({ post, active }: { post: Post; active: boolean }) => {
  const history = useHistoryWithDepth();

  const start = DateTime.fromISO(post.startDate);
  const end = DateTime.fromISO(post.endDate);
  const startText = start.isValid
    ? start.setLocale("pl").toFormat("d LLL yyyy, HH:mm")
    : post.startDate;
  const endText = end.isValid
    ? end.setLocale("pl").toFormat("d LLL yyyy, HH:mm")
    : post.endDate;

  return (
    <div className="details-panel">
      <span className="details-panel__date">
        {startText}
        {endText && ` – ${endText}`}
      </span>

      <h2 className="details-panel__title">{post.title}</h2>

      <p className="details-panel__description">{post.description}</p>

      <div className="details-panel__map swiper-no-swiping">
        <PostMap post={post} active={active} />
        <button
          type="button"
          className="details-panel__map-button"
          onClick={() => history.push(`/map?post=${post.id}`)}
        >
          Zobacz na mapie
        </button>
      </div>
    </div>
  );
};

export default DetailsPanel;
