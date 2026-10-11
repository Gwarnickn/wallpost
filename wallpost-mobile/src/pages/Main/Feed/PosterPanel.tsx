import { useRef, useState } from "react";
import type { Post } from "../../../types/post";

const PosterPanel = ({
  post,
  onSave,
  stain,
}: {
  post: Post;
  onSave: () => void;
  stain: string;
}) => {
  const [hearts, setHearts] = useState(0); // licznik podwójnych stuknięć, odpala animację serca
  const lastTap = useRef(0); // czas poprzedniego stuknięcia

  const seed = Number(stain.split("?")[1] ?? 0) % 100000;
  const random = (n: number) => ((seed * (n * 9973 + 7)) % 1000) / 1000;

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

      {stain &&
        [0, 1, 2].map((i) => (
          <span
            key={stain + i}
            className="poster-panel__stain"
            style={{
              left: `${15 + random(i * 4 + 1) * 70}%`,
              top: `${15 + random(i * 4 + 2) * 60}%`,
              ["--size" as string]: `${60 + random(i * 4 + 3) * 30}vw`,
              transform: random(i * 4 + 4) > 0.5 ? "scaleX(-1)" : "none",
              animationDelay: `${0.9 + i * 0.08}s`,
            }}
          />
        ))}

      {hearts > 0 && (
        <span key={hearts} className="poster-panel__heart">
          ♥
        </span>
      )}
    </div>
  );
};

export default PosterPanel;
