import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase-client";

const Channel = () => {
  const { id } = useParams();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s
          .toString()
          .padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  const fetchChannel = async () => {
    setLoading(true);

    try {
      // Fetch channel details
      const { data: channelData, error: channelError } = await supabase
        .from("channels")
        .select("*")
        .eq("id", id)
        .single();

      if (channelError) throw channelError;

      setChannel(channelData);

      // Fetch channel videos
      const { data: videoData, error: videoError } = await supabase
        .from("videos")
        .select("*")
        .eq("channel_id", id)
        .order("created_at", { ascending: false });

      if (videoError) throw videoError;

      setVideos(videoData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">

      {/* Channel Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">

        {channel?.logo_url ? (
          <img
            src={channel.logo_url}
            alt={channel.channel_name}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl font-bold shrink-0">
            {channel?.channel_name?.charAt(0)?.toUpperCase() || "C"}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold">
            {channel?.channel_name || "Channel"}
          </h1>

          <p className="text-gray-500">
            @{channel?.handle || ""}
          </p>

          <p className="text-sm text-gray-500 mt-1">
            {channel?.subscribers_count || 0} subscribers • {videos.length} videos
          </p>

          {channel?.description && (
            <p className="text-gray-700 mt-2">
              {channel.description}
            </p>
          )}
        </div>

      </div>

      {/* Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {videos.map((video) => (
          <Link
            key={video.id}
            to={`/watch/${video.id}`}
            className="group"
          >
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden">

              {video.thumbnail_url ? (
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <video
                  src={video.video_url}
                  muted
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              )}

              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </span>

            </div>

            <div className="flex gap-3 mt-3">

              {channel?.logo_url ? (
                <img
                  src={channel.logo_url}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                  {channel?.channel_name?.charAt(0)?.toUpperCase() || "C"}
                </div>
              )}

              <div className="flex-1">

                <h3 className="font-semibold line-clamp-2">
                  {video.title}
                </h3>

                <p className="text-sm text-gray-600">
                  {channel?.channel_name}
                </p>

                <p className="text-xs text-gray-500">
                  {video.views || 0} views •{" "}
                  {new Date(video.created_at).toLocaleDateString()}
                </p>

              </div>

            </div>

          </Link>
        ))}

      </div>

      {videos.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No videos uploaded yet.
        </div>
      )}
    </div>
  );
};

export default Channel;