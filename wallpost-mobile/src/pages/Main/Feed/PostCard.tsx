import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { DateTime } from "luxon";
import type { Post } from "../../../types/post";
import PosterPanel from "./PosterPanel";
import DetailsPanel from "./DetailsPanel";
import { BackOverrideContext } from "../../../context/BackOverrider/BackOverrideContext";

interface PostCardProps {
  post: Post;
  isActive: boolean;
  onDetailsChange: (open: boolean) => void;
  tomatoSrc: string;
  saved: boolean;
  likes: number;
  slop: number;
  onToggleSave: () => void;
}

const PostCard = ({
  post,
  isActive,
  onDetailsChange,
  tomatoSrc,
  saved,
  likes,
  slop,
  onToggleSave,
}: PostCardProps) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [mapShown, setMapShown] = useState(false);
  const [stain, setStain] = useState("");
  if (tomatoSrc && tomatoSrc !== stain) setStain(tomatoSrc);

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

  const save = () => {
    if (!saved) onToggleSave();
  };

  const handleChange = useCallback(
    (swiper: SwiperClass) => {
      const open = swiper.activeIndex === 1;
      setDetailsOpen(open);
      if (open) setMapShown(true);
      if (isActive) onDetailsChange(open);
    },
    [isActive, onDetailsChange],
  );

  // When this card stops being the active one, snap it back to the poster so
  // it is ready the next time the user lands on it.
  useEffect(() => {
    if (!isActive && swiperRef.current && swiperRef.current.activeIndex !== 0) {
      swiperRef.current.slideTo(0, 0);
    }
  }, [isActive]);

  const backOverride = useContext(BackOverrideContext);
  useEffect(() => {
    if (isActive && detailsOpen) {
      return backOverride?.registerOverride(() =>
        swiperRef.current?.slideTo(0),
      );
    }
  }, [isActive, detailsOpen, backOverride]);

  return (
    <div id={`post-${post.id}`} className="post-card">
      {tomatoSrc && <img className="tomato" src={tomatoSrc} alt="" />}
      <Swiper
        className="post-card__swiper"
        direction="horizontal"
        slidesPerView={1}
        nested={true}
        speed={300}
        threshold={5}
        touchRatio={1}
        touchAngle={45}
        longSwipesRatio={0.2}
        shortSwipes={true}
        followFinger={true}
        resistanceRatio={0.1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={handleChange}
      >
        <SwiperSlide className="post-card__panel">
          <PosterPanel post={post} onSave={save} stain={stain} />
        </SwiperSlide>
        <SwiperSlide className="post-card__panel">
          <DetailsPanel
            post={post}
            active={isActive && detailsOpen}
            showMap={mapShown}
          />
        </SwiperSlide>
      </Swiper>
      <div className="post-card__info">
        <strong>{post.title}</strong>
        <div className="post-card__meta">
          {start.isValid && <span className="post-card__date">{when}</span>}
          <span className={saved ? "post-card__saved" : ""}>♥ {likes}</span>
          <span>🍅 {slop}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
