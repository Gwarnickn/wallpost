import { useRef, useState } from "react";
import type { Post } from "../../../types/post";

const PosterPanel = ({ post, onSave }: { post: Post; onSave: () => void }) => {
  const [hearts, setHearts] = useState(0); // licznik podwójnych stuknięć, odpala animację serca
  const lastTap = useRef(0); // czas poprzedniego stuknięcia

  // dwa stuknięcia w ciągu 300 ms = serce + zapis
  const tap = () => {
    const now = Date.now();
    const isDouble = now - lastTap.current < 300;
    lastTap.current = now;
    if (!isDouble) return;

    setHearts(hearts + 1);
    onSave();
  };

  return (
    <div className="poster-panel" onClick={tap}>
      {/* rozmyta kopia plakatu wypełnia puste miejsce po bokach */}
      <img
        className="poster-panel__backdrop"
        src={post.image}
        alt=""
        aria-hidden="true"
        decoding="async"
      />
      <img
        className="poster-panel__image"
        src={post.image}
        alt={post.title}
        draggable={false}
        decoding="async"
      />

      {hearts > 0 && (
        <span key={hearts} className="poster-panel__heart">
          ♥
        </span>
      )}
    </div>
  );
};

export default PosterPanel;
