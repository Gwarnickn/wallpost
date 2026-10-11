import { useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { PostsContext } from "../../context/Posts/PostsContext";
import type { Post } from "../../types/post";
import { useBackOverride } from "../../hooks/useBackOverride";
import "./archive.scss";

const formatDate = (value: string) => {
  const date = DateTime.fromISO(value);
  return date.isValid
    ? date.setLocale("pl").toFormat("d LLL yyyy, HH:mm")
    : value;
};

const Archive = () => {
  const posts = useContext(PostsContext)?.posts ?? [];
  const [open, setOpen] = useState<Post | null>(null); // plakat oglądany na pełnym ekranie

  // natywny "wstecz" zamyka podgląd plakatu zamiast cofać stronę
  useBackOverride(open !== null, () => setOpen(null));

  // od najnowszych, pogrupowane miesiącami: { "październik 2026": [...] }
  const grid = useMemo(() => {
    const now = DateTime.now();
    const groups: Record<string, Post[]> = {};
    [...posts]
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
      .forEach((post) => {
        const start = DateTime.fromISO(post.startDate);
        const month = start.isValid
          ? start.setLocale("pl").toFormat("LLLL yyyy")
          : "Bez daty";
        (groups[month] ??= []).push(post);
      });

    return Object.entries(groups).map(([month, items]) => (
      <section key={month}>
        <h2 className="archive__month">{month}</h2>
        <div className="archive__grid">
          {items.map((post) => (
            <button
              key={post.id}
              className="archive__card"
              onClick={() => setOpen(post)}
            >
              <span className="archive__picture">
                <img src={post.image} alt="" loading="lazy" decoding="async" />
                {DateTime.fromISO(post.endDate || post.startDate) < now && (
                  <span className="archive__ended">Zakończone</span>
                )}
              </span>
              <strong>{post.title}</strong>
              <small>{formatDate(post.startDate)}</small>
            </button>
          ))}
        </div>
      </section>
    ));
  }, [posts]);

  return (
    <div className="archive">
      <h1 className="archive__heading">Archiwum plakatów</h1>
      <p className="archive__lead">
        Plakaty znikają ze ścian. Tutaj zostają.
        {posts.length > 0 && ` Zachowane: ${posts.length}.`}
      </p>

      {posts.length === 0 && (
        <p className="archive__empty">Archiwum jest jeszcze puste.</p>
      )}

      {grid}

      {open && (
        <div className="archive__viewer" onClick={() => setOpen(null)}>
          <button className="archive__close" aria-label="Zamknij">
            ×
          </button>
          <img src={open.image} alt={open.title} />

          <div
            className="archive__label"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="archive__date">{formatDate(open.startDate)}</span>
            <h2>{open.title}</h2>
            <p>{open.description}</p>
            <small>
              ♥ {open.likes} · 🍅 {open.slop}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default Archive;
