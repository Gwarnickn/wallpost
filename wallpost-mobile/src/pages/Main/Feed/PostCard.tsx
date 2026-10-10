import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import type { Post } from "../../../types/post";
import PosterPanel from "./PosterPanel";
import DetailsPanel from "./DetailsPanel";

interface PostCardProps {
  post: Post;
  isActive: boolean;
  onDetailsChange: (open: boolean) => void;
}

const PostCard = ({ post, isActive, onDetailsChange }: PostCardProps) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
          <PosterPanel post={post} />
        </SwiperSlide>
        <SwiperSlide className="post-card__panel">
          <DetailsPanel post={post} active={isActive && detailsOpen} />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default PostCard;
