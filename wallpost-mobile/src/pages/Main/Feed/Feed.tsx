import { useCallback, useContext, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { PostsContext } from "../../../context/Posts/PostsContext";
import PostCard from "./PostCard";
import ActionButtons from "./ActionButtons";
import "./feed.scss";

const Feed = () => {
  const context = useContext(PostsContext);
  const posts = context?.posts ?? [];

  const outerSwiper = useRef<SwiperClass | null>(null);
  const previousIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    const next = swiper.activeIndex;
    if (next > previousIndex.current) {
      console.log("swiped");
    }
    previousIndex.current = next;
    setActiveIndex(next);
    setDetailsOpen(false);
    swiper.allowTouchMove = true;
  }, []);

  // While the details slide of the active card is open, the outer swiper must
  // not react to vertical swipes. `allowTouchMove` is not diffed from props, so
  // it is toggled imperatively on the instance.
  const handleDetailsChange = useCallback((open: boolean) => {
    setDetailsOpen(open);
    if (outerSwiper.current) outerSwiper.current.allowTouchMove = !open;
  }, []);

  const currentPost = posts[activeIndex];

  return (
    <div className="feed">
      <Swiper
        className="feed__swiper"
        direction="vertical"
        slidesPerView="auto"
        resistanceRatio={0.1}
        speed={350}
        threshold={5}
        touchRatio={1}
        longSwipesRatio={0.2}
        shortSwipes={true}
        followFinger={true}
        watchSlidesProgress={true}
        touchAngle={45}
        onSwiper={(swiper) => {
          outerSwiper.current = swiper;
        }}
        onSlideChange={handleSlideChange}
      >
        {posts.map((post, index) => {
          const near = Math.abs(index - activeIndex) <= 1;
          return (
            <SwiperSlide key={post.id} className="feed__slide">
              {near ? (
                <PostCard
                  post={post}
                  isActive={index === activeIndex}
                  onDetailsChange={handleDetailsChange}
                />
              ) : (
                <div className="feed__slide-placeholder" />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="feed__overlay">
        <div className="feed__dots">
          <span className={`feed__dot ${!detailsOpen ? "feed__dot--active" : ""}`} />
          <span className={`feed__dot ${detailsOpen ? "feed__dot--active" : ""}`} />
        </div>

        {currentPost && <ActionButtons post={currentPost} />}
      </div>
    </div>
  );
};

export default Feed;
