// Results.jsx
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../supabase-client";
import { Eye } from "lucide-react";

const VideoPreview = ({ video }) => {
  if (video.thumbnail_url) {
    return (
      <img
        src={video.thumbnail_url}
        alt={video.title}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <video
      src={video.video_url}
      muted
      preload="metadata"
      className="w-full h-full object-cover"
      onLoadedMetadata={(e) => {
        try {
          e.target.currentTime = Math.min(1, e.target.duration / 2);
        } catch {}
      }}
    />
  );
};

export default function Results() {
  const [params] = useSearchParams();
  const query = params.get("search_query") || "";
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!query.trim()) {
        setVideos([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .or(
          `title.ilike.%${query}%,description.ilike.%${query}%,channel_name.ilike.%${query}%`
        )
        .order("created_at", { ascending: false });

      if (!error) setVideos(data || []);
      setLoading(false);
    };
    load();
  }, [query]);

  const views = (n=0)=>{
    if(n>=1_000_000) return (n/1_000_000).toFixed(1)+"M views";
    if(n>=1000) return (n/1000).toFixed(1)+"K views";
    return n+" views";
  };

  const ago = (d)=>{
    const days=(Date.now()-new Date(d))/86400000;
    if(days<1) return "Today";
    if(days<30) return Math.floor(days)+" days ago";
    if(days<365) return Math.floor(days/30)+" months ago";
    return Math.floor(days/365)+" years ago";
  }

  return (
    <div className="pt-20 max-w-7xl mx-auto px-3 sm:px-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-8 break-words">
        Search results for "{query}"
      </h1>

      {loading && <div className="text-gray-500">Searching...</div>}

      {!loading && videos.length===0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold">No results found</h2>
          <p className="text-gray-500 mt-2">Try another keyword.</p>
        </div>
      )}

      <div className="space-y-6">
        {videos.map(video=>(
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="flex flex-col sm:flex-row gap-3 sm:gap-6 hover:bg-gray-50 p-2 rounded-2xl transition"
          >
            <div className="w-full sm:w-[380px] aspect-video sm:h-[214px] rounded-2xl overflow-hidden bg-black shrink-0">
              <VideoPreview video={video}/>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold line-clamp-2">
                {video.title}
              </h2>

              <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <Eye size={15}/>
                <span>{views(video.views)}</span>
                <span>•</span>
                <span>{ago(video.created_at)}</span>
              </div>

              <div className="flex items-center gap-3 mt-5">
                {video.channel_logo ? (
                  <img
                    src={video.channel_logo}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center">
                    {video.channel_name?.charAt(0)}
                  </div>
                )}

                <div>
                  <p className="font-medium">{video.channel_name}</p>
                  <p className="text-xs text-gray-500">{video.email}</p>
                </div>
              </div>

              <p className="mt-4 text-gray-600 line-clamp-3">
                {video.description || "No description provided."}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
