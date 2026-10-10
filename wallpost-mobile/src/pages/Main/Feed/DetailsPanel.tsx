import type { Post } from "../../../types/post";
import PostMap from "./PostMap";

const DetailsPanel = ({ post, active }: { post: Post; active: boolean }) => {
  return (
    <div className="details-panel">
      <div className="details-panel__content">
        <h2 className="details-panel__title">{post.title}</h2>

        <div className="details-panel__fields">
          <p className="details-panel__field">
            <span className="details-panel__label">Miejsce: </span>
            <span className="details-panel__value">
              {post.lat}, {post.lng}
            </span>
          </p>
          <p className="details-panel__field">
            <span className="details-panel__label">Data: </span>
            <span className="details-panel__value">{post.startDate}</span>
          </p>
          <p className="details-panel__field">
            <span className="details-panel__label">Opis: </span>
            <span className="details-panel__value">{post.description}</span>
          </p>
        </div>
      </div>

      <div className="details-panel__map swiper-no-swiping">
        <PostMap post={post} active={active} />
      </div>
    </div>
  );
};

export default DetailsPanel;
