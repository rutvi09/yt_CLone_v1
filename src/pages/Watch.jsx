import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bell,
} from "lucide-react";
import CommentSection from "../components/CommentSection";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userReaction, setUserReaction] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [bellOn, setBellOn] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

 

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);


  useEffect(() => {
    if (id) {
      fetchVideo();
      fetchRecommended();
      fetchCommentCount();
    }
  }, [id, user]);


  const fetchVideo = async () => {
    setLoading(true);

    const { data: video } = await supabase
      .from("videos")
      .select("*")  
      .eq("id", id)
      .single();

    setVideoData(video);

    await supabase.rpc("increment_video_view", {
      video_id_input: id,
    });

    const { data: reactions } = await supabase
      .from("video_reactions")
      .select("type")
      .eq("video_id", id);

    let likes = 0;
    let dislikes = 0;

    reactions?.forEach((r) => {
      if (r.type === "like") likes++;
      if (r.type === "dislike") dislikes++;
    });

    setLikeCount(likes);
    setDislikeCount(dislikes);

    if (user) {
      const { data: myReaction } = await supabase
        .from("video_reactions")
        .select("type")
        .eq("video_id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      setUserReaction(myReaction?.type || null);

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("subscriber_id", user.id)
        .eq("channel_id", video.channel_id)
        .maybeSingle();

      setIsSubscribed(!!sub);
      setBellOn(sub?.notifications || false);
    }

    setLoading(false);
  };

  const fetchCommentCount = async () => {
    const { count } = await supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("video_id", id);

    setCommentCount(count || 0);
  };

  
  const fetchRecommended = async () => {
    const { data } = await supabase
      .from("videos")
      .select("*")
      .neq("id", id)
      .order("created_at", { ascending: false })
      .limit(10);

    setRecommendedVideos(data || []);
  };

  
  const handleLike = async () => {
    if (!user) return;

    if (userReaction === "like") {
      await supabase.from("video_reactions")
        .delete()
        .eq("video_id", id)
        .eq("user_id", user.id);

      setUserReaction(null);
      setLikeCount((p) => p - 1);
      return;
    }

    if (userReaction === "dislike") setDislikeCount((p) => p - 1);

    await supabase.from("video_reactions").upsert({
      video_id: id,
      user_id: user.id,
      type: "like",
    });

    setUserReaction("like");
    setLikeCount((p) => p + 1);
  };


  const handleDislike = async () => {
    if (!user) return;

    if (userReaction === "dislike") {
      await supabase.from("video_reactions")
        .delete()
        .eq("video_id", id)
        .eq("user_id", user.id);

      setUserReaction(null);
      setDislikeCount((p) => p - 1);
      return;
    }

    if (userReaction === "like") setLikeCount((p) => p - 1);

    await supabase.from("video_reactions").upsert({
      video_id: id,
      user_id: user.id,
      type: "dislike",
    });

    setUserReaction("dislike");
    setDislikeCount((p) => p + 1);
  };

  
  const toggleSubscribe = async () => {
    if (!user) return;

    if (isSubscribed) {
      await supabase
        .from("subscriptions")
        .delete()
        .eq("subscriber_id", user.id)
        .eq("channel_id", videoData.channel_id);

      setIsSubscribed(false);
      setBellOn(false);
    } else {
      await supabase.from("subscriptions").insert({
        subscriber_id: user.id,
        channel_id: videoData.channel_id,
        notifications: true,
      });

      setIsSubscribed(true);
      setBellOn(true);
    }
  };

  const toggleBell = async () => {
    if (!user || !isSubscribed) return;

    const newState = !bellOn;

    await supabase
      .from("subscriptions")
      .update({ notifications: newState })
      .eq("subscriber_id", user.id)
      .eq("channel_id", videoData.channel_id);

    setBellOn(newState);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 p-4 md:p-6">

    
      <div className="flex-1">

      
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video src={videoData?.video_url} controls autoPlay className="w-full h-full" />
        </div>


        <div className="mt-3">

          <h1 className="text-lg sm:text-xl font-semibold break-words">
            {videoData?.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">


            <div className="flex items-center gap-3">

              {videoData?.avatar_url ? (
                <img
                  src={videoData.avatar_url}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                  {videoData?.email?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-medium">
                  {videoData?.email?.split("@")[0]}
                </p>

                <p className="text-xs text-gray-500">
                  {(videoData?.views || 0).toLocaleString()} views • {commentCount.toLocaleString()} comments
                </p>
              </div>
            </div>

         
            <div className="flex items-center gap-2">

              <button
                onClick={toggleBell}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <Bell size={18} className={bellOn ? "text-yellow-500" : ""} />
              </button>

              <button
                onClick={toggleSubscribe}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  isSubscribed
                    ? "bg-gray-200 text-black"
                    : "bg-red-600 text-white"
                }`}
              >
                {isSubscribed ? "Subscribed ✓" : "Subscribe"}
              </button>

            </div>
          </div>
        </div>

        
        <div className="flex flex-wrap items-center gap-2 mt-4">

          <button
            onClick={handleLike}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full"
          >
            <ThumbsUp size={16} className={userReaction === "like" ? "text-blue-500" : ""} />
            {likeCount}
          </button>

          <button
            onClick={handleDislike}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full"
          >
            <ThumbsDown size={16} className={userReaction === "dislike" ? "text-red-500" : ""} />
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full"
          >
            <Share2 size={16} />
            Share
          </button>

        </div>

        
        <div className="mt-4 bg-gray-100 p-3 rounded-lg text-sm">
          {videoData?.description}
        </div>

        
        <div className="mt-5">
          <CommentSection videoId={id} />
        </div>

      </div>


      <div className="w-full xl:w-[360px]">
        <h2 className="font-semibold mb-3">Recommended</h2>

        <div className="space-y-3">
          {recommendedVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => navigate(`/watch/${video.id}`)}
              className="flex gap-2 cursor-pointer"
            >
              <video src={video.video_url} className="w-32 h-20 rounded-md object-cover" muted />
              <div>
                <p className="text-sm font-medium line-clamp-2">{video.title}</p>
                <p className="text-xs text-gray-500">
                  {video.email?.split("@")[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Watch;