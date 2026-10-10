import { useEffect, useMemo, useRef, useState, type UIEvent } from "react";
import { useSearchParams } from "react-router-dom";
import L from "leaflet";
import "leaflet.markercluster";
import { maplibreGL } from "@maplibre/maplibre-gl-leaflet";
import { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { DateTime } from "luxon";
import ApiService, { type Post } from "../../api/ApiService";
import Modal from "../../components/Modal/Modal";
import "./map.scss";

setWorkerUrl(workerUrl);

const WROCLAW: L.LatLngTuple = [51.1079, 17.0385];
const CARD_STEP = 252; // szerokość karty w karuzeli (240px) + odstęp (12px)

const FILTERS = [
  ["all", "Wszystkie"],
  ["today", "Dziś"],
  ["tomorrow", "Jutro"],
  ["weekend", "Weekend"],
];

const meIcon = L.divIcon({
  className: "",
  html: '<div class="map-me"></div>',
  iconSize: [20, 20],
});

// ładna data, a jeśli format jest nietypowy - pokazuje to, co przyszło z API
const formatDate = (value: string) => {
  const date = DateTime.fromISO(value);
  return date.isValid
    ? date.setLocale("pl").toFormat("d LLL yyyy, HH:mm")
    : value;
};

const MapPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const activeCard = useRef(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState<Post | null>(null);
  const [me, setMe] = useState<L.LatLng | null>(null);
  const [filter, setFilter] = useState("all");
  const [saved, setSaved] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("savedPosts") ?? "[]"),
  );
  const [slopped, setSlopped] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("slopPosts") ?? "[]"),
  );
  const [searchParams] = useSearchParams();
  const focusedId = searchParams.get("post");

  // pobranie wydarzeń + wycentrowanie na wydarzeniu otwartym z description (/map?post=ID)
  useEffect(() => {
    ApiService.getPosts()
      .then((data) => {
        setPosts(data);
        const focused = data.find((post) => post.id === focusedId);
        if (focused) mapRef.current?.setView([focused.lat, focused.lng], 17);
      })
      .catch(console.error);
  }, []);

  // utworzenie mapy (raz)
  useEffect(() => {
    const map = L.map(containerRef.current!, {
      zoomControl: false,
      attributionControl: false,
      maxZoom: 19,
    }).setView(WROCLAW, 13);

    L.control
      .attribution({ position: "bottomleft", prefix: false })
      .addAttribution(
        "&copy; OpenFreeMap &copy; OpenMapTiles &copy; OpenStreetMap",
      )
      .addTo(map);

    const glMap = maplibreGL({
      style: "https://tiles.openfreemap.org/styles/bright",
    })
      .addTo(map)
      .getMaplibreMap();

    // minimalizm: chowamy ikonki miejsc, numery dróg, strzałki i lotniska
    glMap.on("load", () => {
      glMap.getStyle().layers.forEach((layer) => {
        if (/poi|shield|oneway|airport/.test(layer.id)) {
          glMap.setLayoutProperty(layer.id, "visibility", "none");
        }
      });
    });

    // lokalizacja użytkownika; przy wejściu z description nie przesuwamy widoku
    map.on("locationfound", (event) => setMe(event.latlng));
    map.locate({ setView: !focusedId, maxZoom: 14 });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // kropka "tu jesteś"
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !me) return;

    const marker = L.marker(me, { icon: meIcon, interactive: false }).addTo(
      map,
    );
    return () => {
      marker.remove();
    };
  }, [me]);

  // filtr po dacie; zakończone wydarzenia znikają zawsze
  const visible = useMemo(() => {
    const today = DateTime.now().startOf("day");
    const ranges: Record<string, DateTime[]> = {
      today: [today, today.endOf("day")],
      tomorrow: [today.plus({ days: 1 }), today.plus({ days: 1 }).endOf("day")],
      weekend: [today.startOf("week").plus({ days: 5 }), today.endOf("week")],
    };

    return posts.filter((post) => {
      const start = DateTime.fromISO(post.startDate);
      if (!start.isValid) return true; // nieznany format daty - pokazujemy
      const end = DateTime.fromISO(post.endDate);
      const last = end.isValid ? end : start;

      if (last < today) return false;
      if (filter === "all") return true;

      const [from, to] = ranges[filter];
      return start <= to && last >= from;
    });
  }, [posts, filter]);

  // pinezki z miniaturką plakatu, pogrupowane gdy są blisko siebie
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      disableClusteringAtZoom: 17,
      iconCreateFunction: (group) =>
        L.divIcon({
          className: "",
          html: `<div class="map-cluster">${group.getChildCount()}</div>`,
          iconSize: [44, 44],
        }),
    }).addTo(map);

    visible.forEach((post) => {
      const pin = document.createElement("div");
      pin.className = "map-pin";
      if (saved.includes(post.id)) pin.classList.add("map-pin--saved");
      if (post.id === focusedId) pin.classList.add("map-pin--focused");
      pin.style.backgroundImage = `url(${JSON.stringify(post.image)})`;

      L.marker([post.lat, post.lng], {
        icon: L.divIcon({ className: "", html: pin, iconSize: [48, 48] }),
      })
        .on("click", () => setSelected(post))
        .addTo(cluster);
    });

    return () => {
      cluster.remove();
    };
  }, [visible, saved, focusedId]);

  // przycisk "wróć do mnie"
  const goToMe = () => {
    const map = mapRef.current;
    if (!map) return;
    if (me) map.setView(me, 15);
    else map.locate({ setView: true, maxZoom: 15 });
  };

  // przesunięcie karuzeli przenosi mapę na wydarzenie z aktualnej karty
  const onCarouselScroll = (event: UIEvent<HTMLDivElement>) => {
    const index = Math.round(event.currentTarget.scrollLeft / CARD_STEP);
    const post = visible[index];
    const map = mapRef.current;
    if (!post || !map || index === activeCard.current) return;

    activeCard.current = index;
    map.setView([post.lat, post.lng], Math.max(map.getZoom(), 15));
  };

  // zapisanie = polubienie
  const toggleSave = async (post: Post) => {
    const isSaved = saved.includes(post.id);
    const result = isSaved
      ? await ApiService.unlikePost(post.id)
      : await ApiService.likePost(post.id);
    const updated = { ...post, likes: result.likes };

    setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
    setSelected(updated);

    const next = isSaved
      ? saved.filter((x) => x !== post.id)
      : [...saved, post.id];
    setSaved(next);
    localStorage.setItem("savedPosts", JSON.stringify(next));
  };

  // rzut pomidorem = "ten plakat wygląda na AI"; raz na plakat
  const throwTomato = async (post: Post) => {
    if (slopped.includes(post.id)) return;

    const result = await ApiService.slopPost(post.id);
    const updated = { ...post, slop: result.slop };

    setPosts(posts.map((p) => (p.id === post.id ? updated : p)));
    setSelected(updated);

    const next = [...slopped, post.id];
    setSlopped(next);
    localStorage.setItem("slopPosts", JSON.stringify(next));
  };

  const distance =
    me && selected ? me.distanceTo([selected.lat, selected.lng]) : null;

  return (
    <div className="map-wrap">
      <div className="map-page" ref={containerRef} />

      <div className="map-filters">
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            className={`map-chip ${filter === key ? "map-chip--active" : ""}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        className="map-locate"
        onClick={goToMe}
        aria-label="Moja lokalizacja"
      >
        ◎
      </button>

      <div className="map-carousel" onScroll={onCarouselScroll}>
        {visible.map((post) => (
          <button
            key={post.id}
            className="map-card"
            onClick={() => setSelected(post)}
          >
            <img src={post.image} alt="" />
            <span className="map-card__text">
              <strong>{post.title}</strong>
              <small>{formatDate(post.startDate)}</small>
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <Modal
          bottom
          className="event-sheet"
          handleClose={() => setSelected(null)}
        >
          <div className="event-sheet__image">
            <img src={selected.image} alt="" />
            <span className="event-sheet__handle" />
          </div>

          <div className="event-sheet__body">
            <span className="event-sheet__date">
              {formatDate(selected.startDate)}
              {selected.endDate && ` – ${formatDate(selected.endDate)}`}
            </span>
            <h2 className="event-sheet__title">{selected.title}</h2>

            {distance !== null && (
              <p className="event-sheet__distance">
                {distance < 1000
                  ? `${Math.round(distance / 10) * 10} m od Ciebie`
                  : `${(distance / 1000).toFixed(1)} km od Ciebie`}
              </p>
            )}

            <p className="event-sheet__description">{selected.description}</p>

            <div className="event-sheet__actions">
              <button
                className={saved.includes(selected.id) ? "active" : ""}
                onClick={() => toggleSave(selected)}
              >
                ♥ {selected.likes}
              </button>
              <button
                className={slopped.includes(selected.id) ? "tomato" : ""}
                onClick={() => throwTomato(selected)}
              >
                🍅 {selected.slop}
              </button>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                target="_blank"
                rel="noreferrer"
              >
                ➤ Prowadź
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MapPage;
