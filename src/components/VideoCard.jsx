import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getVideos } from "../services/supabaseService";

const categories = [
  "All",
  "Music",
  "Gaming",
  "React",
  "Programming",
  "Live",
  "News",
  "Podcasts",
];

const formatDuration = (seconds) => {
  const totalSeconds = Number(seconds);

  if (!totalSeconds || isNaN(totalSeconds)) {
    return "0:00";
  }

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  }

  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const VideoCard = () => {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
  loadVideos();

  const channelSubscription = getVideos; 

  const interval = setInterval(() => {
    loadVideos();
  }, 5000);

  return () => clearInterval(interval);
}, []);

  const loadVideos = async () => {
  try {
    const data = await getVideos();

    console.log("Videos from Supabase:", data);

    if (data?.length) {
      console.log("channel_logo =", data[0].channel_logo);
      console.log("channel_name =", data[0].channel_name);
      console.log("avatar_url =", data[0].avatar_url);
      console.log("first video =", data[0]);
    }

    setVideos(data || []);
  } catch (error) {
    console.error("Error fetching videos:", error);
  } finally {
    setLoading(false);
  }
};

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter(
          (video) =>
            video.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <h2 className="text-lg font-semibold">Loading Videos...</h2>
      </div>
    );
  }

  return (
    <section className="px-3 sm:px-6 py-4 pb-10">
      <div className="sticky top-14 z-30 bg-white py-2 mb-5 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>


      <div className="grid gap-x-4 gap-y-8 [grid-template-columns:repeat(auto-fill,minmax(100%,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => navigate(`/watch/${video.id}`)}
            className="group cursor-pointer"
          >
      
            <div className="relative overflow-hidden rounded-xl bg-black">
              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full aspect-video object-cover rounded-xl transition-transform duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <video
                  src={video.video_url}
                  className="w-full aspect-video object-cover rounded-xl"
                  muted
                  preload="metadata"
                />
              )}

              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </span>
            </div>

          
            <div className="flex gap-3 mt-3">
              {video.channel_logo ? (
  <img
    src={video.channel_logo}
    alt="Channel"
    className="w-10 h-10 rounded-full object-cover"
    onError={(e) => {
      e.target.style.display = "none";
    }}
  />
) : (
             <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-semibold">
                  {(
  video.channel_name?.charAt(0) ||
  video.email?.charAt(0) ||
  "U"
).toUpperCase()}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h2
                  className="text-sm font-medium leading-5 overflow-hidden"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {video.title}
                </h2>

<p className="text-xs text-gray-600 mt-1 truncate">
  {video.channel_name ||
    video.email?.split("@")[0] ||
    "Unknown User"}
</p>

                <p className="text-xs text-gray-500">
                  {video.views || 0} views
                </p>
              </div>

              <BsThreeDotsVertical className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>

      {!loading && videos.length === 0 && (
        <div className="text-center mt-10">
          <h2 className="text-gray-500 text-lg">
            No videos uploaded yet.
          </h2>
        </div>
      )}
    </section>
  );
};

export default VideoCard;