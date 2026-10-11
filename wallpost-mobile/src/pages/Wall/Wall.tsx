import { useContext, useRef, useState, type PointerEvent } from "react";
import { useHistoryWithDepth } from "../../hooks/useHistoryWithDepth";
import { DateTime } from "luxon";
import { PostsContext } from "../../context/Posts/PostsContext";
import type { Post } from "../../types/post";
import "./wall.scss";

const CARD_WIDTH = 150;

const Wall = () => {
  const history = useHistoryWithDepth();
  const context = useContext(PostsContext);
  const posts = context?.posts ?? [];
  const savedIds: string[] = JSON.parse(
    localStorage.getItem("savedPosts") ?? "[]",
  );
  const saved = posts.filter((post) => savedIds.includes(post.id));

  // pozycje plakatów na tablicy: { id: [x, y] }, pamiętane w telefonie
  const [positions, setPositions] = useState<Record<string, number[]>>(() =>
    JSON.parse(localStorage.getItem("wallPositions") ?? "{}"),
  );
  const [dragging, setDragging] = useState<string | null>(null); // plakat trzymany palcem
  const [onTop, setOnTop] = useState<string | null>(null); // ostatnio ruszany plakat leży na wierzchu
  const drag = useRef({
    startX: 0,
    startY: 0,
    fromX: 0,
    fromY: 0,
    moved: false,
  });

  // pozycja plakatu: zapamiętana albo domyślna (dwie kolumny, lekko nierówno)
  const place = (post: Post, index: number) =>
    positions[post.id] ?? [
      index % 2 === 0 ? 24 : window.innerWidth - CARD_WIDTH - 24,
      120 + Math.floor(index / 2) * 250 + ((Number(post.id) * 17) % 30),
    ];

  const onDown = (
    event: PointerEvent<HTMLDivElement>,
    post: Post,
    x: number,
    y: number,
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      fromX: x,
      fromY: y,
      moved: false,
    };
    setDragging(post.id);
    setOnTop(post.id);
  };

  const onMove = (event: PointerEvent<HTMLDivElement>, post: Post) => {
    if (dragging !== post.id) return;
    const dx = event.clientX - drag.current.startX;
    const dy = event.clientY - drag.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 6) drag.current.moved = true;
    if (!drag.current.moved) return;

    const x = Math.min(
      Math.max(drag.current.fromX + dx, 0),
      window.innerWidth - CARD_WIDTH,
    );
    const y = Math.max(drag.current.fromY + dy, 0);
    setPositions({ ...positions, [post.id]: [x, y] });
  };

  // puszczenie: po przesunięciu zapisujemy pozycję, po zwykłym stuknięciu otwieramy wydarzenie
  const onUp = (post: Post) => {
    if (dragging !== post.id) return;
    setDragging(null);
    if (drag.current.moved)
      localStorage.setItem("wallPositions", JSON.stringify(positions));
    else history.push(`/map?post=${post.id}`);
  };

  // tablica rośnie w dół razem z plakatami
  const height =
    Math.max(0, ...saved.map((post, index) => place(post, index)[1])) + 400;

  return (
    <div className="wall" style={{ minHeight: `max(100%, ${height}px)` }}>
      <h1 className="wall__heading">Moje wydarzenia</h1>

      {saved.length === 0 && (
        <p className="wall__empty">
          {context?.loading
            ? "Ładowanie plakatów…"
            : "Nic tu jeszcze nie wisi. Stuknij dwa razy plakat w feedzie, a przypniemy go do tablicy."}
        </p>
      )}

      {saved.map((post, index) => {
        const [x, y] = place(post, index);
        const tilt = ((Number(post.id) * 37) % 13) - 6; // stałe przekrzywienie od -6 do 6 stopni
        const start = DateTime.fromISO(post.startDate);
        const held = dragging === post.id;

        return (
          <div
            key={post.id}
            className={`wall__card ${held ? "wall__card--held" : ""}`}
            style={{
              transform: `translate(${x}px, ${y}px) rotate(${held ? 0 : tilt}deg) scale(${held ? 1.06 : 1})`,
              zIndex: onTop === post.id ? 2 : 1,
            }}
            onPointerDown={(event) => onDown(event, post, x, y)}
            onPointerMove={(event) => onMove(event, post)}
            onPointerUp={() => onUp(post)}
            onPointerCancel={() => setDragging(null)}
          >
            <img
              src={post.image}
              alt={post.title}
              decoding="async"
              draggable={false}
            />
            <strong>{post.title}</strong>
            <small>
              {start.isValid
                ? start.setLocale("pl").toFormat("d LLL, HH:mm")
                : post.startDate}
            </small>
          </div>
        );
      })}
    </div>
  );
};

export default Wall;
