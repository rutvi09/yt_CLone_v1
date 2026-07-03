import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../supabase-client";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  MdEdit,
  MdVideoLibrary,
  MdSubscriptions,
} from "react-icons/md";

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

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");

  // NEW
  const [editing, setEditing] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [handle, setHandle] = useState("");
const [bannerFile, setBannerFile] = useState(null);
const [logoFile, setLogoFile] = useState(null);
const [bannerPreview, setBannerPreview] = useState("");
const [logoPreview, setLogoPreview] = useState("");

  const loadProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data: channels } = await supabase
        .from("channels")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      const latestChannel = channels?.[0] || null;

      setChannel(latestChannel);
if (latestChannel) {
  setChannelName(latestChannel.channel_name || "");
  setDescription(latestChannel.description || "");
  setHandle(latestChannel.handle || "");

  setBannerPreview(latestChannel.banner_url || "");
  setLogoPreview(latestChannel.logo_url || "");
}

      const { data: videosData } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setVideos(videosData || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  const saveChannel = async () => {
  try {
    let bannerUrl = channel?.banner_url || "";
    let logoUrl = channel?.logo_url || "";

    // Upload Banner
    if (bannerFile) {
      const bannerName = `banner-${user.id}-${Date.now()}`;

      const { error: bannerError } = await supabase.storage
        .from("channel-assets")
        .upload(bannerName, bannerFile, {
          upsert: true,
        });

      if (bannerError) throw bannerError;

      const { data } = supabase.storage
        .from("channel-assets")
        .getPublicUrl(bannerName);

      bannerUrl = data.publicUrl;
    }

    // Upload Logo
    if (logoFile) {
      const logoName = `logo-${user.id}-${Date.now()}`;

      const { error: logoError } = await supabase.storage
        .from("channel-assets")
        .upload(logoName, logoFile, {
          upsert: true,
        });

      if (logoError) throw logoError;

      const { data } = supabase.storage
        .from("channel-assets")
        .getPublicUrl(logoName);

      logoUrl = data.publicUrl;
    }

    // Update Channel
    const { error: channelError } = await supabase
      .from("channels")
      .update({
        channel_name: channelName,
        description,
        handle,
        banner_url: bannerUrl,
        logo_url: logoUrl,
      })
      .eq("id", channel.id);

    if (channelError) throw channelError;

    // Update all existing videos
    const { error: videoError } = await supabase
      .from("videos")
      .update({
        channel_name: channelName,
        channel_logo: logoUrl,
        avatar_url: logoUrl,
      })
      .eq("user_id", user.id);

    if (videoError) {
      console.error("Video update error:", videoError);
    }

    setChannel((prev) => ({
      ...prev,
      channel_name: channelName,
      description,
      handle,
      banner_url: bannerUrl,
      logo_url: logoUrl,
    }));

    setEditing(false);

    alert("Channel updated successfully!");
  } catch (error) {
    console.error("Save Channel Error:", error);
    alert(error.message || "Failed to update channel");
  }
};  const deleteVideo = async (videoId) => {
    const confirmDelete = window.confirm(
      "Delete this video?"
    );

    if (!confirmDelete) return;

    try {
      await supabase
        .from("videos")
        .delete()
        .eq("id", videoId);

      setVideos((prev) =>
        prev.filter((v) => v.id !== videoId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please login first
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">
          Create your channel
        </h1>

        <p className="text-gray-500 mb-8">
          Upload videos, grow your audience and
          build your brand.
        </p>

        <button
          onClick={() => navigate("/create-channel")}
          className="bg-black text-white px-6 py-3 rounded-full"
        >
          Create Channel
        </button>
      </div>
    );
  }
  return (
  <div className="min-h-screen bg-white">

   
    <div className="w-full h-52 md:h-72 lg:h-80 bg-gray-200 overflow-hidden">
      {channel.banner_url ? (
        <img
          src={channel.banner_url}
          alt="Banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-gray-300 to-gray-200" />
      )}
    </div>

    <div className="max-w-7xl mx-auto px-4 md:px-8">

      <div className="py-8 flex flex-col md:flex-row gap-6">

        <div>
          {channel.logo_url ? (
            <img
              src={channel.logo_url}
              alt="Channel"
              className="w-36 h-36 rounded-full object-cover"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-black text-white flex items-center justify-center text-5xl font-bold">
              {channel.channel_name?.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1">

          {editing ? (
           <div className="space-y-4">

  <input
    type="text"
    value={channelName}
    onChange={(e) => setChannelName(e.target.value)}
    placeholder="Channel Name"
    className="w-full border rounded-xl p-3"
  />

  <input
    type="text"
    value={handle}
    onChange={(e) => setHandle(e.target.value)}
    placeholder="@handle"
    className="w-full border rounded-xl p-3"
  />

  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    placeholder="Channel Description"
    rows={4}
    className="w-full border rounded-xl p-3"
  />

  <div>
    <p className="font-medium mb-2">Channel Logo</p>

    {logoPreview && (
      <img
        src={logoPreview}
        alt=""
        className="w-24 h-24 rounded-full object-cover mb-2"
      />
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      }}
    />
  </div>

  <div>
    <p className="font-medium mb-2">Banner Image</p>

    {bannerPreview && (
      <img
        src={bannerPreview}
        alt=""
        className="w-full h-40 object-cover rounded-xl mb-2"
      />
    )}

    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (!file) return;

        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
      }}
    />
  </div>

</div>
          ) : (
            <>
              <h1 className="text-4xl font-bold">
                {channel.channel_name}
              </h1>
            </>
          )}

          <div className="flex flex-wrap gap-3 text-gray-600 text-sm mt-2">
            <span>
             @{channel.handle || channel.channel_name?.replace(/\s+/g, "").toLowerCase()}
            </span>

            <span>
              {channel.subscribers_count || 0} subscribers
            </span>

            <span>
              {videos.length} videos
            </span>

            <span>
              Joined {formatDate(channel.created_at)}
            </span>
          </div>

          {!editing && channel.description && (
            <p className="mt-4 text-gray-700 max-w-3xl">
              {channel.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-6">

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full hover:bg-gray-800"
              >
                <MdEdit />
                Edit Channel
              </button>
            ) : (
              <>
                <button
                  onClick={saveChannel}
                  className="px-5 py-2 bg-black text-white rounded-full"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setEditing(false);
                    setChannelName(channel.channel_name);
                    setDescription(
                      channel.description || ""
                    );
                  }}
                  className="px-5 py-2 bg-gray-100 rounded-full"
                >
                  Cancel
                </button>
              </>
            )}

            <button
              onClick={() => navigate("/create")}
              className="px-5 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Upload Video
            </button>
            <button
              onClick={() => navigate("/create-shorts")}
              className="px-5 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Upload Shorts
            </button>

          </div>
        </div>
      </div>

      <div className=" flex gap-8 text-sm font-medium">

        <button
          onClick={() => setActiveTab("videos")}
          className={`pb-3 ${
            activeTab === "videos"
              ? "border-b-2 border-black"
              : ""
          }`}
        >
          Videos
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`pb-3 ${
            activeTab === "about"
              ? "border-b-2 border-black"
              : ""
          }`}
        >
          About
        </button>

      </div>

      {activeTab === "about" && (
        <div className="py-8">

          <h2 className="text-xl font-semibold mb-4">
            Description
          </h2>

          <p className="text-gray-700">
            {channel.description ||
              "No description added."}
          </p>

        </div>
      )}


      {activeTab === "videos" && (
        <div className="py-8">

          {videos.length === 0 ? (
            <div className="text-center py-20">

              <MdVideoLibrary
                size={70}
                className="mx-auto text-gray-400"
              />

              <h2 className="text-xl font-semibold mt-4">
                No videos yet
              </h2>

              <p className="text-gray-500 mt-2">
                Upload your first video.
              </p>

            </div>
          ) : (
            <div className="grid gap-x-4 gap-y-8 [grid-template-columns:repeat(auto-fill,minmax(100%,1fr))] sm:[grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">

              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group cursor-pointer"
                >
                  <div
                    onClick={() =>
                      navigate(`/watch/${video.id}`)
                    }
                  >
                    <div className="relative rounded-xl overflow-hidden bg-black">

                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full aspect-video object-cover rounded-xl group-hover:scale-[1.03] transition"
                        />
                      ) : (
                        <video
                          src={video.video_url}
                          className="w-full aspect-video object-cover"
                        />
                      )}

                      <span className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video.duration)}
                      </span>

                    </div>
                  </div>

                  <div className="flex gap-3 mt-3">

                    {channel.logo_url ? (
                      <img
                        src={channel.logo_url}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                        {channel.channel_name?.charAt(0)}
                      </div>
                    )}

                    <div className="flex-1">

                      <h3
                        className="font-medium text-sm"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {video.title}
                      </h3>

                      <p className="text-xs text-gray-600 mt-1">
                        {channel.channel_name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {video.views || 0} views
                      </p>

                    </div>

                    <div className="relative">
                      <button
                        className="p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      <div className="opacity-0 group-hover:opacity-100 transition">

                        <button
                          onClick={() =>
                            navigate(
                              `/edit-video/${video.id}`
                            )
                          }
                          className="text-xs block mb-2"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteVideo(video.id)
                          }
                          className="text-xs text-red-500"
                        >
                          Delete
                        </button>

                      </div>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      )}

    </div>
  </div>
);
};

export default Profile;