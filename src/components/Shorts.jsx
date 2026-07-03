import React, { useEffect, useRef, useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquareText,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Heart,
} from "lucide-react";
import { IoMdShareAlt } from "react-icons/io";
import { getShorts } from "../services/supabaseService";

export default function Shorts() {
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  const hideControlsTimer = useRef(null);

  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const [showControls, setShowControls] = useState(true);
  const [showPauseIcon, setShowPauseIcon] = useState(false);

  const [heartAnimation, setHeartAnimation] = useState(false);

  const [reactions, setReactions] = useState({});

  useEffect(() => {
    loadShorts();
  }, []);

  const loadShorts = async () => {
    try {
      const data = await getShorts();
      setShorts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const index = Math.round(el.scrollTop / el.clientHeight);

    if (index !== activeIndex) {
      setActiveIndex(index);
      setIsPlaying(true);
      setShowPauseIcon(false);
    }
  };

  const resetControlsTimer = () => {
    setShowControls(true);

    clearTimeout(hideControlsTimer.current);

    hideControlsTimer.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2000);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => {
      const next = !prev;

      setShowPauseIcon(!next);

      resetControlsTimer();

      return next;
    });
  };

  const toggleMute = (e) => {
    e.stopPropagation();

    setIsMuted((prev) => !prev);

    resetControlsTimer();
  };

  const handleDoubleClick = (id) => {
    setHeartAnimation(true);

    setTimeout(() => {
      setHeartAnimation(false);
    }, 800);

    if (!reactions[id]?.like) {
      toggleLike(id);
    }
  };

  const toggleLike = (id) => {
    setReactions((prev) => {
      const current = prev[id] || {
        like: false,
        dislike: false,
      };

      let updated = { ...current };

      setShorts((old) =>
        old.map((item) => {
          if (item.id !== id) return item;

          let likes = item.likes_count || 0;

          if (current.like) {
            likes--;
            updated.like = false;
          } else {
            if (current.dislike) {
              updated.dislike = false;
            }

            likes++;
            updated.like = true;
          }

          return {
            ...item,
            likes_count: likes,
          };
        })
      );

      return {
        ...prev,
        [id]: updated,
      };
    });
  };

  const toggleDislike = (id) => {
    setReactions((prev) => {
      const current = prev[id] || {
        like: false,
        dislike: false,
      };

      let updated = { ...current };

      setShorts((old) =>
        old.map((item) => {
          if (item.id !== id) return item;

          let likes = item.likes_count || 0;

          if (current.dislike) {
            updated.dislike = false;
          } else {
            if (current.like) {
              likes--;
              updated.like = false;
            }

            updated.dislike = true;
          }

          return {
            ...item,
            likes_count: likes,
          };
        })
      );

      return {
        ...prev,
        [id]: updated,
      };
    });
  };

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      video.muted = isMuted;

      if (i === activeIndex && isPlaying) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    resetControlsTimer();
  }, [activeIndex, isMuted, isPlaying, shorts]);

  useEffect(() => {
    return () => {
      clearTimeout(hideControlsTimer.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-lg font-medium">
          Loading Shorts...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white  flex justify-center">
  <div
    ref={containerRef}
    onScroll={handleScroll}
    className="w-full max-w-[430px] h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-hide bg-black"
    style={{
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    }}
  >
    <style>{`
      .scrollbar-hide::-webkit-scrollbar{
        display:none;
      }

      @keyframes heartPop{
        0%{
          transform:translate(-50%,-50%) scale(.2);
          opacity:0;
        }
        25%{
          transform:translate(-50%,-50%) scale(1.25);
          opacity:1;
        }
        100%{
          transform:translate(-50%,-50%) scale(1);
          opacity:0;
        }
      }

      @keyframes playPop{
        0%{
          transform:scale(.5);
          opacity:0;
        }
        100%{
          transform:scale(1);
          opacity:1;
        }
      }
    `}</style>

    {shorts.length === 0 ? (
      <div className="h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            No Shorts Available
          </h2>

          <p className="text-gray-300 mt-2">
            Upload your first short.
          </p>
        </div>
      </div>
    ) : (
      shorts.map((short, index) => (
        <div
          key={short.id}
          className="relative h-screen snap-start overflow-hidden"
        >
          {/* VIDEO */}

          <div
            className="absolute inset-0 cursor-pointer"
            onClick={togglePlayPause}
            onDoubleClick={() => handleDoubleClick(short.id)}
            onMouseMove={resetControlsTimer}
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={short.video_url}
              className="w-full h-full object-cover"
              playsInline
              loop
            />
          </div>

         \

          {heartAnimation && (
            <div
              className="absolute left-1/2 top-1/2 z-40 pointer-events-none"
              style={{
                animation: "heartPop .8s forwards",
              }}
            >
              <Heart
                size={110}
                className="fill-white text-white drop-shadow-2xl"
              />
            </div>
          )}

  

          {showPauseIcon && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
              <div
                className="bg-black/45 backdrop-blur-md rounded-full p-7"
                style={{
                  animation: "playPop .25s",
                }}
              >
                <Play
                  size={56}
                  className="text-white fill-white"
                />
              </div>
            </div>
          )}

    

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />



          <div
            className={`absolute left-4 top-28 flex flex-col gap-3 z-50 transition-all duration-300 ${
              showControls
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <button
              onClick={toggleMute}
              className="w-12 h-12 rounded-full bg-black/55 backdrop-blur-xl flex items-center justify-center text-white"
            >
              {isMuted ? (
                <VolumeX size={21} />
              ) : (
                <Volume2 size={21} />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="w-12 h-12 rounded-full bg-black/55 backdrop-blur-xl flex items-center justify-center text-white"
            >
              {isPlaying ? (
                <Pause size={21} />
              ) : (
                <Play size={21} />
              )}
            </button>
          </div>
         

          <div className="absolute bottom-6 left-4 right-20 text-white z-40">

            <div className="flex items-center gap-3">

              {short.channel_logo ? (
                <img
                  src={short.channel_logo}
                  alt=""
                  className="w-11 h-11 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-red-600 flex items-center justify-center font-semibold">
                  {short.channel_name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="flex flex-col">

                <span className="font-semibold text-[15px]">
                  @{short.channel_name}
                </span>

                <span className="text-xs text-gray-300">
                  {(short.views || 0).toLocaleString()} views
                </span>

              </div>

            </div>

            <h2 className="mt-4 text-[16px] font-semibold line-clamp-2">
              {short.title}
            </h2>

            {short.description && (
              <p className="text-sm text-gray-200 mt-2 line-clamp-2">
                {short.description}
              </p>
            )}

          </div>


          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-7 text-white z-50">

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(short.id);
              }}
              className="flex flex-col items-center group"
            >
              <div className="w-14 h-14 rounded-full bg-black/35 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition">

                <ThumbsUp
                  size={28}
                  className={
                    reactions[short.id]?.like
                      ? "fill-white"
                      : ""
                  }
                />

              </div>

              <span className="text-xs mt-2">
                {(short.likes_count || 0).toLocaleString()}
              </span>

            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleDislike(short.id);
              }}
              className="flex flex-col items-center group"
            >

              <div className="w-14 h-14 rounded-full bg-black/35 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition">

                <ThumbsDown
                  size={28}
                  className={
                    reactions[short.id]?.dislike
                      ? "fill-white"
                      : ""
                  }
                />

              </div>

              <span className="text-xs mt-2">
                Dislike
              </span>

            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center group"
             >

              <div className="w-14 h-14 rounded-full bg-black/35 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition">

                <MessageSquareText size={28} />

              </div>

              <span className="text-xs mt-2">
                {(short.comments_count || 0).toLocaleString()}
              </span>
              
            </button>
            
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center group"
            >

              <div className="w-14 h-14 rounded-full bg-black/35 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 transition">

                <IoMdShareAlt size={30} />

              </div>

              <span className="text-xs mt-2">
                Share
              </span>

            </button>

          </div>
          </div>
        ))
      )}
    </div>
  </div>
);
}