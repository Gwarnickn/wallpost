import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { DateTime } from "luxon";
import ApiService from "../../../api/ApiService";
import type { Post } from "../../../types/post";
import PosterPanel from "./PosterPanel";
import DetailsPanel from "./DetailsPanel";

interface PostCardProps {
  post: Post;
  isActive: boolean;
  onDetailsChange: (open: boolean) => void;
  activeTomato: boolean;
}

const PostCard = ({ post, isActive, onDetailsChange, activeTomato }: PostCardProps) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [saved, setSaved] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem("savedPosts") ?? "[]").includes(post.id),
  );
  const [likes, setLikes] = useState(post.likes);

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

  // zapisanie = polubienie; wywoływane podwójnym stuknięciem w plakat
  const save = async () => {
    if (saved) return;

    setSaved(true);
    setLikes(likes + 1);
    const ids: string[] = JSON.parse(
      localStorage.getItem("savedPosts") ?? "[]",
    );
    localStorage.setItem("savedPosts", JSON.stringify([...ids, post.id]));
    await ApiService.likePost(post.id);
  };

  const handleChange = useCallback(
    (swiper: SwiperClass) => {
      const open = swiper.activeIndex === 1;
      setDetailsOpen(open);
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

  return (
    <div className="post-card">
      {activeTomato ? <img className="tomato" src="tomato.gif" alt="" /> : ""}
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
            <PosterPanel post={post} onSave={save} />
            
          </SwiperSlide>
          <SwiperSlide className="post-card__panel">
            <DetailsPanel post={post} active={isActive && detailsOpen} />
          </SwiperSlide>
      </Swiper>
      {/* pod plakatem, poza przesuwaną częścią - zawsze widoczne */}
      <div className="post-card__info">
        <strong>{post.title}</strong>
        <div className="post-card__meta">
          {start.isValid && <span className="post-card__date">{when}</span>}
          <span className={saved ? "post-card__saved" : ""}>♥ {likes}</span>
          <span>🍅 {post.slop}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
