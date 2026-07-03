import { supabase } from "../supabase-client";



const buildCommentTree = (rows) => {
  const map = {};
  const comments = [];

  rows.forEach((row) => {
    map[row.id] = {
      id: row.id,
      videoId: row.video_id,
      userId: row.user_id,
      username: row.username || "Guest",
      avatarUrl: row.avatar || "",
      text: row.comment,
      createdAt: row.created_at
        ? new Date(row.created_at).getTime()
        : Date.now(),
      likes: row.likes ?? 0,
      dislikes: row.dislikes ?? 0,
      parentId: row.parent_id,
      is_pinned: row.is_pinned ?? false,
      hearted_by_creator: row.hearted_by_creator ?? false,
      replies: [],
    };
  });

  rows.forEach((row) => {
    const comment = map[row.id];

    if (row.parent_id && map[row.parent_id]) {
      map[row.parent_id].replies.push(comment);
    } else if (!row.parent_id) {
      comments.push(comment);
    }
  });

  return comments;
};



export const getVideos = async () => {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map((video) => ({
    ...video,
    email: video.email || "Unknown User"
  }));
};

export const getVideoByYoutubeId = async (youtubeId) => {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("youtube_id", youtubeId)
    .single();

  if (error) throw error;
  return data;
};


export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const createProfile = async ({
  id,
  username,
  full_name,
  avatar_url,
}) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id,
      username,
      full_name,
      avatar_url,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};



const resolveVideoId = async (videoId) => {
  if (!videoId) return null;

  const { data: byId } = await supabase
    .from("videos")
    .select("id")
    .eq("id", videoId)
    .maybeSingle();

  if (byId?.id) return byId.id;

  const { data: byYoutube } = await supabase
    .from("videos")
    .select("id")
    .eq("youtube_id", videoId)
    .maybeSingle();

  return byYoutube?.id || videoId;
};


export const getCommentsByVideoId = async (videoId) => {
  const resolvedVideoId = await resolveVideoId(videoId);

  if (!resolvedVideoId) return [];

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("video_id", resolvedVideoId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return buildCommentTree(data || []);
};

export const createComment = async ({
  videoId,
  userId,
  username,
  avatar,
  text,
  parentId = null,
}) => {
  const resolvedVideoId = await resolveVideoId(videoId);

  if (!resolvedVideoId) {
    throw new Error("Missing video id for comment");
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({
      video_id: resolvedVideoId,
      user_id: userId,
      username,
      avatar,
      comment: text,
      parent_id: parentId,
      likes: 0,
      dislikes: 0,
      is_pinned: false,
      hearted_by_creator: false,
    })
    .select("*")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    videoId: data.video_id,
    userId: data.user_id,
    username: data.username,
    avatarUrl: data.avatar,
    text: data.comment,
    createdAt: new Date(data.created_at).getTime(),
    likes: data.likes ?? 0,
    dislikes: data.dislikes ?? 0,
    parentId: data.parent_id,
    is_pinned: data.is_pinned,
    hearted_by_creator: data.hearted_by_creator,
    replies: [],
  };
};

export const updateCommentLikes = async (id, likes) => {
  const { error } = await supabase
    .from("comments")
    .update({ likes })
    .eq("id", id);

  if (error) throw error;
};

export const updateCommentDislikes = async (id, dislikes) => {
  const { error } = await supabase
    .from("comments")
    .update({ dislikes })
    .eq("id", id);

  if (error) throw error;
};
/*


export const getCommentReaction = async (commentId, userId) => {
  const { data, error } = await supabase
    .from("comment_reactions")
    .select("*")
    .eq("comment_id", commentId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const setCommentReaction = async (
  commentId,
  userId,
  reaction
) => {
  const existing = await getCommentReaction(commentId, userId);

  if (!existing) {
    const { error } = await supabase
      .from("comment_reactions")
      .insert({
        comment_id: commentId,
        user_id: userId,
        reaction,
      });

    if (error) throw error;

    return "added";
  }

  if (existing.reaction === reaction) {
    const { error } = await supabase
      .from("comment_reactions")
      .delete()
      .eq("id", existing.id);

    if (error) throw error;

    return "removed";
  }

  const { error } = await supabase
    .from("comment_reactions")
    .update({ reaction })
    .eq("id", existing.id);

  if (error) throw error;

  return "switched";
};


export const recordWatchHistory = async ({ userId, videoId }) => {
  if (!userId || !videoId) return;

  const { error } = await supabase
    .from("watch_history")
    .insert({
      user_id: userId,
      video_id: videoId,
      watched_at: new Date().toISOString(),
    });

  if (error) throw error;
};
*/


export const likeVideo = async ({ userId, videoId }) => {
  if (!userId || !videoId) return;

  const { error } = await supabase
    .from("video_likes")
    .insert({
      user_id: userId,
      video_id: videoId,
      liked: true,
    });

  if (error) throw error;
};



export const uploadVideo = async (file, metadata) => {
 
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please login first");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .single();

  
  const filePath = `${Date.now()}-${file.name}`;

  
  const { error: storageError } = await supabase.storage
    .from("videos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (storageError) {
    console.error(storageError);
    throw storageError;
  }

  
  const { data: publicUrlData } = supabase.storage
    .from("videos")
    .getPublicUrl(filePath);

  const videoUrl = publicUrlData.publicUrl;

const { data: channel, error: channelError } = await supabase
  .from("channels")
  .select("*")
  .eq("owner_id", user.id)
  .single();

if (channelError) {
  throw channelError;
}
const { data, error } = await supabase
  .from("videos")
  .insert({
    title: metadata.title,
    description: "",
    video_url: videoUrl,
    thumbnail_url: "",
    duration: metadata.duration || 0,
    views: 0,
    likes_count: 0,
    dislikes_count: 0,
    comments_count: 0,

    user_id: user.id,
    channel_id: channel.id,

    email: user.email,

    channel_name: channel.channel_name,
    channel_logo: channel.logo_url,

    avatar_url:
      channel.logo_url ||
      profile?.avatar_url ||
      null,

    type: metadata.type || "video",
  })
  .select()
  .single();

if (error) throw error;

return data;
};export const uploadShort = async (file, metadata) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Please login first");
  }

  const { data: channel, error: channelError } = await supabase
    .from("channels")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (channelError) {
    throw channelError;
  }

  const filePath = `${Date.now()}-${file.name}`;

  const { error: storageError } = await supabase.storage
    .from("shorts")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (storageError) {
    throw storageError;
  }

  const { data: publicUrlData } = supabase.storage
    .from("shorts")
    .getPublicUrl(filePath);

  const videoUrl = publicUrlData.publicUrl;

  const { data, error } = await supabase
    .from("shorts")
    .insert({
      title: metadata.title,
      description: "",
      video_url: videoUrl,
      thumbnail_url: "",
      duration: metadata.duration || 0,

      views: 0,
      likes_count: 0,
      dislikes_count: 0,
      comments_count: 0,

      user_id: user.id,
      channel_id: channel.id,

      email: user.email,

      channel_name: channel.channel_name,
      channel_logo: channel.logo_url,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
export const getShorts = async () => {
  const { data, error } = await supabase
    .from("shorts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
};