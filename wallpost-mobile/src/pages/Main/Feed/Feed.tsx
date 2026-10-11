import { useCallback, useContext, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import { PostsContext } from "../../../context/Posts/PostsContext";
import ApiService from "../../../api/ApiService";
import type { Post } from "../../../types/post";
import PostCard from "./PostCard";
import ActionButtons from "./ActionButtons";
import "./feed.scss";
import { useHistoryWithDepth } from "../../../hooks/useHistoryWithDepth";
import CameraIcon from "../../Scan/CameraIcon";
import { playTomatoAnimation } from './tomatoAnimation';

const Feed = () => {
  const context = useContext(PostsContext);
  const posts = context?.posts ?? [];
  const history = useHistoryWithDepth();

  const outerSwiper = useRef<SwiperClass | null>(null);
  const previousIndex = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [tomato, setTomato] = useState<{ id: string; src: string } | null>(
    null,
  );
  const tomatoBusy = useRef(false);
  const [saved, setSaved] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("savedPosts") ?? "[]"),
  );
  const [slopped, setSlopped] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem("slopPosts") ?? "[]"),
  );
  const [limit, setLimit] = useState(20);

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

  // zapisanie = polubienie; drugie kliknięcie je cofa
  const toggleSave = async (post: Post) => {
    const isSaved = saved.includes(post.id);
    const next = isSaved
      ? saved.filter((id) => id !== post.id)
      : [...saved, post.id];
    setSaved(next);
    localStorage.setItem("savedPosts", JSON.stringify(next));

    const result = isSaved
      ? await ApiService.unlikePost(post.id)
      : await ApiService.likePost(post.id);
    context?.updatePost({ ...post, likes: result.likes });
  };

  // rzut pomidorem = "ten plakat wygląda na AI"; animacja zawsze, licznik rośnie raz na plakat
  const activateTomato = async () => {
    if (tomatoBusy.current) return;
    tomatoBusy.current = true;
    const post = currentPost;

    const target = document.getElementById(`post-${post.id}`);
    
    if (!target) {
      tomatoBusy.current = false;
      return;
    }
    playTomatoAnimation({
      targetElement: target,
      onComplete: () => {
        // Ta funkcja wykona się automatycznie, gdy minie 60 klatek animacji
        tomatoBusy.current = false;
      }
    });

    // const src = `tomato.gif?${Date.now()}`;
    
    // setTomato({ id: post.id, src });
    //   setTimeout(() => {
    //   setTomato(null);
    //   tomatoBusy.current = false;
    // }, 1800);

    // const src = `tomato.gif?${Date.now()}`;
    // const image = new Image();
    // image.onload = () => {
    //   setTomato({ id: post.id, src });
    //   setTimeout(() => {
    //     setTomato(null);
    //     tomatoBusy.current = false;
    //   }, 1800);
    // };
    // image.onerror = () => {
    //   tomatoBusy.current = false;
    // };
    // image.src = src;

    if (slopped.includes(post.id)) return;
    const next = [...slopped, post.id];
    setSlopped(next);
    localStorage.setItem("slopPosts", JSON.stringify(next));

    const result = await ApiService.slopPost(post.id);
    context?.updatePost({ ...post, slop: result.slop });
  };

  if (posts.length === 0) {
    return (
      <div className="feed">
        <p className="feed__state">
          {context?.loading
            ? "Ładowanie plakatów…"
            : context?.error
              ? "Nie udało się pobrać wydarzeń"
              : "Brak wydarzeń"}
        </p>
      </div>
    );
  }

  return (
    <div className="feed">
      <button
        className="feed__scan"
        onClick={() => history.push("/scan")}
        aria-label="Zeskanuj plakat"
      >
        <CameraIcon />
      </button>
      <button
        className="feed__scan feed__scan--archive"
        onClick={() => history.push("/archive")}
        aria-label="Archiwum plakatów"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6h16v4H4z" />
          <path d="M5.5 10v8a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-8" />
          <path d="M10 14h4" />
        </svg>
      </button>
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
        touchAngle={45}
        onSwiper={(swiper) => {
          outerSwiper.current = swiper;
        }}
        onSlideChange={handleSlideChange}
        onSlideChangeTransitionEnd={(swiper) =>
          setLimit((old) => (swiper.activeIndex > old - 10 ? old + 20 : old))
        }
      >
        {posts.slice(0, limit).map((post, index) => {
          const near = Math.abs(index - activeIndex) <= 1;
          return (
            <SwiperSlide key={post.id} className="feed__slide">
              {near ? (
                <PostCard
                  post={post}
                  isActive={index === activeIndex}
                  onDetailsChange={handleDetailsChange}
                  tomatoSrc={tomato?.id === post.id ? tomato.src : ""}
                  saved={saved.includes(post.id)}
                  likes={post.likes}
                  slop={post.slop}
                  onToggleSave={() => toggleSave(post)}
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
          <span
            className={`feed__dot ${!detailsOpen ? "feed__dot--active" : ""}`}
          />
          <span
            className={`feed__dot ${detailsOpen ? "feed__dot--active" : ""}`}
          />
        </div>

        {currentPost && (
          <ActionButtons
            post={currentPost}
            saved={saved.includes(currentPost.id)}
            onToggleSave={() => toggleSave(currentPost)}
            slopped={slopped.includes(currentPost.id)}
            activateTomato={activateTomato}
          />
        )}
      </div>
    </div>
  );
};

export default Feed;
