import type { Post } from "../../../types/post";

const PosterPanel = ({ post }: { post: Post }) => {
  return (
    <div className="poster-panel">
      <img
        className="poster-panel__image"
        src={post.image}
        alt={post.title}
        draggable={false}
      />
    </div>
  );
};

export default PosterPanel;
