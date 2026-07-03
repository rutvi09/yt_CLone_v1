import React, { useEffect, useState } from "react";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { supabase } from "../supabase-client";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState({});

  const [showReplyBox, setShowReplyBox] = useState({});
  const [showReplies, setShowReplies] = useState({});

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [commentReactions, setCommentReactions] = useState({});
  const [loading, setLoading] = useState(true);

 

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  const getCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  };

  const getUserName = () =>
    user?.user_metadata?.username ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";


  const fetchComments = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("video_id", videoId)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setComments(data || []);

      if (user?.id && data?.length) {
        const commentIds = data.map((c) => c.id);

        const { data: reactions } = await supabase
          .from("comments_reaction")
          .select("*")
          .eq("user_id", user.id)
          .in("comment_id", commentIds);

        const map = {};

        reactions?.forEach((r) => {
          map[r.comment_id] = r.type;
        });

        setCommentReactions(map);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const rootComments = comments.filter(
    (c) => !c.parent_id
  );

  const getReplies = (commentId) => {
    return comments.filter(
      (c) => c.parent_id === commentId
    );
  };


const addComment = async () => {
  if (!text.trim()) return;
  if (!user) return;

  try {
    const { data: channel } = await supabase
      .from("channels")
      .select("channel_name, logo_url")
      .eq("owner_id", user.id)
      .single();

    const { error } = await supabase
      .from("comments")
      .insert({
        video_id: videoId,
        user_id: user.id,
        username:
          channel?.channel_name ||
          getUserName(),
        avatar:
          channel?.logo_url || null,
        comment: text.trim(),
        likes: 0,
        dislikes: 0,
        parent_id: null,
      });

    if (error) throw error;

    setText("");
    await fetchComments();
  } catch (err) {
    console.error(err);
  }
};

 const addReply = async (commentId) => {
  const reply = replyText[commentId];

  if (!reply?.trim()) return;
  if (!user) return;

  try {
    const { data: channel } = await supabase
      .from("channels")
      .select("channel_name, logo_url")
      .eq("owner_id", user.id)
      .single();

    const { error } = await supabase
      .from("comments")
      .insert({
        video_id: videoId,
        user_id: user.id,
        username:
          channel?.channel_name ||
          getUserName(),
        avatar:
          channel?.logo_url || null,
        comment: reply.trim(),
        likes: 0,
        dislikes: 0,
        parent_id: commentId,
      });

    if (error) throw error;

    setReplyText((prev) => ({
      ...prev,
      [commentId]: "",
    }));

    setShowReplies((prev) => ({
      ...prev,
      [commentId]: true,
    }));

    await fetchComments();
  } catch (err) {
    console.error(err);
  }
};


  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.comment);
  };

const saveEdit = async (commentId) => {
  if (!editText.trim()) return;

  try {
    const { error } = await supabase
      .from("comments")
      .update({
        comment: editText.trim(),
      })
      .eq("id", commentId);

    if (error) throw error;

    setEditingId(null);
    setEditText("");

    await fetchComments();
  } catch (err) {
    console.error(err);
  }
};

  const deleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      "Delete this comment?"
    );

    if (!confirmDelete) return;

    try {
      
      await supabase
        .from("comments")
        .delete()
        .eq("parent_id", commentId);

      
      await supabase
        .from("comments_reaction")
        .delete()
        .eq("comment_id", commentId);

      
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      await fetchComments();
    } catch (err) {
      console.error(err);
    }
  };


  const toggleLike = async (commentId) => {
    if (!user) return;

    try {
      const currentReaction =
        commentReactions[commentId];

      const target = comments.find(
        (c) => c.id === commentId
      );

      if (!target) return;

      if (currentReaction === "like") {
        await supabase
          .from("comments_reaction")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", user.id);

        await supabase
          .from("comments")
          .update({
            likes: Math.max(
              (target.likes || 0) - 1,
              0
            ),
          })
          .eq("id", commentId);
      }

      
      else if (
        currentReaction === "dislike"
      ) {
        await supabase
          .from("comments_reaction")
          .update({
            type: "like",
          })
          .eq("comment_id", commentId)
          .eq("user_id", user.id);

        await supabase
          .from("comments")
          .update({
            likes:
              (target.likes || 0) + 1,
            dislikes: Math.max(
              (target.dislikes || 0) - 1,
              0
            ),
          })
          .eq("id", commentId);
      }

      else {
        await supabase
          .from("comments_reaction")
          .insert({
            comment_id: commentId,
            user_id: user.id,
            type: "like",
          });

        await supabase
          .from("comments")
          .update({
            likes:
              (target.likes || 0) + 1,
          })
          .eq("id", commentId);
      }

      await fetchComments();
    } catch (err) {
      console.error(err);
    }
  };


  const toggleDislike = async (
    commentId
  ) => {
    if (!user) return;

    try {
      const currentReaction =
        commentReactions[commentId];

      const target = comments.find(
        (c) => c.id === commentId
      );

      if (!target) return;

    
      if (
        currentReaction === "dislike"
      ) {
        await supabase
          .from("comments_reaction")
          .delete()
          .eq("comment_id", commentId)
          .eq("user_id", user.id);

        await supabase
          .from("comments")
          .update({
            dislikes: Math.max(
              (target.dislikes || 0) - 1,
              0
            ),
          })
          .eq("id", commentId);
      }

   
      else if (
        currentReaction === "like"
      ) {
        await supabase
          .from("comments_reaction")
          .update({
            type: "dislike",
          })
          .eq("comment_id", commentId)
          .eq("user_id", user.id);

        await supabase
          .from("comments")
          .update({
            likes: Math.max(
              (target.likes || 0) - 1,
              0
            ),
            dislikes:
              (target.dislikes || 0) + 1,
          })
          .eq("id", commentId);
      }

      // new dislike
      else {
        await supabase
          .from("comments_reaction")
          .insert({
            comment_id: commentId,
            user_id: user.id,
            type: "dislike",
          });

        await supabase
          .from("comments")
          .update({
            dislikes:
              (target.dislikes || 0) + 1,
          })
          .eq("id", commentId);
      }

      await fetchComments();
    } catch (err) {
      console.error(err);
    }
  };


  if (loading) {
    return (
      <div className="text-center py-6">
        Loading comments...
      </div>
    );
  }
    return (
    <div className="max-w-3xl mx-auto mt-10 px-4">

    
      <div className="flex gap-3 mb-8">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 outline-none"
        />

        <button
          onClick={addComment}
          className="bg-black text-white px-5 py-2 rounded-full"
        >
          Comment
        </button>
      </div>

      
      <div className="space-y-8">

        {rootComments.map((c) => {
          const isOwner =
            c.user_id === user?.id;

          const replies =
            getReplies(c.id);

          return (
            <div
              key={c.id}
              className="flex gap-4"
            >

              {/* AVATAR */}
              {c.avatar ? (
                <img
                  src={c.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-red-500 text-white font-bold flex items-center justify-center rounded-full">
                  {c.username?.[0]?.toUpperCase()}
                </div>
              )}

              <div className="flex-1">

               
                <p className="font-semibold">
                  @{c.username}
                </p>

                {editingId === c.id ? (
                  <div className="flex gap-2 mt-1">
                    <input
                      value={editText}
                      onChange={(e) =>
                        setEditText(
                          e.target.value
                        )
                      }
                      className="border-b flex-1 outline-none"
                    />

                    <button
                      onClick={() =>
                        saveEdit(c.id)
                      }
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-sm mt-1">
                    {c.comment}
                  </p>
                )}

                
                <div className="flex gap-4 mt-3 text-sm text-gray-600 items-center">

                  <button
                    onClick={() =>
                      toggleLike(c.id)
                    }
                    className={`flex items-center gap-1 ${
                      commentReactions[
                        c.id
                      ] === "like"
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    <FaThumbsUp />
                    {c.likes || 0}
                  </button>

                  <button
                    onClick={() =>
                      toggleDislike(c.id)
                    }
                    className={`flex items-center gap-1 ${
                      commentReactions[
                        c.id
                      ] === "dislike"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    <FaThumbsDown />
                    {c.dislikes || 0}
                  </button>

                  <button
                    onClick={() =>
                      setShowReplyBox(
                        (prev) => ({
                          ...prev,
                          [c.id]:
                            !prev[c.id],
                        })
                      )
                    }
                  >
                    Reply
                  </button>

                  {replies.length > 0 && (
                    <button
                      onClick={() =>
                        setShowReplies(
                          (prev) => ({
                            ...prev,
                            [c.id]:
                              !prev[c.id],
                          })
                        )
                      }
                      className="text-blue-600"
                    >
                      {showReplies[c.id]
                        ? "Hide replies"
                        : `View replies (${replies.length})`}
                    </button>
                  )}

                  {isOwner && (
                    <>
                      <button
                        onClick={() =>
                          startEdit(c)
                        }
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() =>
                          deleteComment(
                            c.id
                          )
                        }
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>

                
                {showReplyBox[c.id] && (
                  <div className="flex gap-2 mt-2">

                    <input
                      value={
                        replyText[c.id] ||
                        ""
                      }
                      onChange={(e) =>
                        setReplyText(
                          (prev) => ({
                            ...prev,
                            [c.id]:
                              e.target.value,
                          })
                        )
                      }
                      className=" flex-1 outline-none"
                      placeholder="Write reply..."
                    />

                    <button
                      onClick={() =>
                        addReply(c.id)
                      }
                    >
                      Reply
                    </button>

                  </div>
                )}
                
                {showReplies[c.id] && (
                  <div className="ml-8 mt-3 space-y-3 border-l pl-4">

                    {replies.map((r) => {
                      const isReplyOwner =
                        r.user_id === user?.id;

                      return (
                        <div
                          key={r.id}
                          className="flex gap-3"
                        >

                          {r.avatar ? (
                            <img
                              src={r.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                              {r.username?.[0]?.toUpperCase()}
                            </div>
                          )}

                          <div className="flex-1">

                            <p className="font-semibold text-sm">
                              @{r.username}
                            </p>

                            <p className="text-sm">
                              {r.comment}
                            </p>

                            <div className="flex gap-4 mt-2 text-xs text-gray-600 items-center">

                              <button
                                onClick={() =>
                                  toggleLike(r.id)
                                }
                                className={`flex items-center gap-1 ${
                                  commentReactions[
                                    r.id
                                  ] === "like"
                                    ? "text-blue-600"
                                    : ""
                                }`}
                              >
                                <FaThumbsUp />
                                {r.likes || 0}
                              </button>

                              <button
                                onClick={() =>
                                  toggleDislike(r.id)
                                }
                                className={`flex items-center gap-1 ${
                                  commentReactions[
                                    r.id
                                  ] === "dislike"
                                    ? "text-red-600"
                                    : ""
                                }`}
                              >
                                <FaThumbsDown />
                                {r.dislikes || 0}
                              </button>

                              {isReplyOwner && (
                                <button
                                  onClick={() =>
                                    deleteComment(
                                      r.id
                                    )
                                  }
                                >
                                  <FaTrash />
                                </button>
                              )}

                            </div>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>
            </div>
          );
        })}

        {rootComments.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No comments yet
          </div>
        )}

      </div>
    </div>
  );
};

export default CommentSection;