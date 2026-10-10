import { useRef, useState } from "react";
import { DateTime } from "luxon";
import ApiService from "../../../api/ApiService";
import type { Post } from "../../../types/post";

const PosterPanel = ({ post }: { post: Post }) => {
  const [saved, setSaved] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem("savedPosts") ?? "[]").includes(post.id),
  );
  const [likes, setLikes] = useState(post.likes);
  const [hearts, setHearts] = useState(0);
  const lastTap = useRef(0);

  // "Dziś" / "Jutro" / "za 3 dni"
  const start = DateTime.fromISO(post.startDate);
  const days = Math.round(
    start.startOf("day").diff(DateTime.now().startOf("day"), "days").days,
  );
  const when =
    days < 0
      ? "Trwa"
      : days === 0
        ? "Dziś"
        : days === 1
          ? "Jutro"
          : `za ${days} dni`;

  // podwójne stuknięcie = zapisz (zapisanie jest równoznaczne z polubieniem)
  const save = async () => {
    setHearts(hearts + 1);
    if (saved) return;

    setSaved(true);
    setLikes(likes + 1);
    const ids: string[] = JSON.parse(
      localStorage.getItem("savedPosts") ?? "[]",
    );
    localStorage.setItem("savedPosts", JSON.stringify([...ids, post.id]));
    await ApiService.likePost(post.id);
  };

  const tap = async () => {
    const now = Date.now();
    const isDouble = now - lastTap.current < 300;
    lastTap.current = now;
    if (!isDouble) return;

    setHearts(hearts + 1);
    if (saved) return;

    setSaved(true);
    setLikes(likes + 1);
    const ids: string[] = JSON.parse(
      localStorage.getItem("savedPosts") ?? "[]",
    );
    localStorage.setItem("savedPosts", JSON.stringify([...ids, post.id]));
    await ApiService.likePost(post.id);
  };

  return (
    <div className="poster-panel" onClick={tap}>
      {/* rozmyta kopia plakatu wypełnia puste miejsce po bokach */}
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

      {start.isValid && <span className="poster-panel__date">{when}</span>}

      <div className="poster-panel__caption">
        <strong>{post.title}</strong>
        <small>
          <span className={saved ? "poster-panel__saved" : ""}>♥ {likes}</span>{" "}
          · 🍅 {post.slop}
        </small>
      </div>

      {hearts > 0 && (
        <span key={hearts} className="poster-panel__heart">
          ♥
        </span>
      )}
    </div>
  );
};

export default PosterPanel;
