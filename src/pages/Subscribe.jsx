import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase-client";

const Subscribe = () => {
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribedData();
  }, []);


  useEffect(() => {
    const channel = supabase
      .channel("realtime-channels")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "channels" },
        () => {
          fetchSubscribedData(); // refresh instantly
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return h > 0
      ? `${h}:${m.toString().padStart(2, "0")}:${s
          .toString()
          .padStart(2, "0")}`
      : `${m}:${s.toString().padStart(2, "0")}`;
  };

  const fetchSubscribedData = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: subs } = await supabase
        .from("subscriptions")
        .select("channel_id")
        .eq("subscriber_id", user.id);

      if (!subs?.length) {
        setVideos([]);
        setChannels([]);
        setLoading(false);
        return;
      }

      const channelIds = [...new Set(subs.map((s) => s.channel_id))];

      const { data: channelData } = await supabase
        .from("channels")
        .select("*")
        .in("id", channelIds);

      setChannels(channelData || []);

      const { data: videoData, error } = await supabase
        .from("videos")
        .select("*")
        .in("channel_id", channelIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setVideos(videoData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getChannel = (channelId) => {
    return channels.find((c) => c.id === channelId);
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  return (
    <div className="px-4 md:px-6 py-4">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
      </div>


      {channels.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-600 mb-3">
            Subscribed channels
          </h2>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {channels.map((ch) => (
              <Link
                to={`/channel/${ch.id}`}
                key={ch.id}
                className="flex flex-col items-center min-w-[80px]"
              >
                {ch.logo_url ? (
                  <img
                    src={ch.logo_url}
                    className="w-14 h-14 rounded-full object-cover"
                    alt="logo"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                    {ch.channel_name?.charAt(0)}
                  </div>
                )}

                <p className="text-xs mt-1 truncate w-[80px] text-center">
                  {ch.channel_name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => {
          const channel = getChannel(video.channel_id);

          return (
            <div key={video.id}>
              <Link to={`/watch/${video.id}`}>
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden group">
                  <video
                    src={video.video_url}
                    muted
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />

                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                </div>
              </Link>

              <div className="flex gap-3 mt-3">
                <Link to={`/channel/${video.channel_id}`}>
                  {channel?.logo_url ? (
                    <img
                      src={channel.logo_url}
                      className="w-9 h-9 rounded-full object-cover"
                      alt="logo"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                      {channel?.channel_name?.charAt(0) || "U"}
                    </div>
                  )}
                </Link>

                <div className="min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {channel?.channel_name || "Unknown"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {video.views} views •{" "}
                    {new Date(video.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {channels.length === 0 && videos.length === 0 && (
        <p className="text-gray-500 mt-10">No subscriptions yet.</p>
      )}
    </div>
  );
};

export default Subscribe;