import { DateTime } from "luxon";
import type { Post } from "../../../types/post";

const PosterPanel = ({ post }: { post: Post }) => {
  const start = DateTime.fromISO(post.startDate);

  return (
    <div className="poster-panel">
      <img
        className="poster-panel__backdrop"
        src={post.image}
        alt=""
        aria-hidden="true"
      />
      <img
        className="poster-panel__image"
        src={post.image}
        alt={post.title}
        draggable={false}
      />
      {start.isValid && (
        <span className="poster-panel__date">
          {start.setLocale("pl").toFormat("d LLL")}
        </span>
      )}
    </div>
  );
};

export default PosterPanel;
