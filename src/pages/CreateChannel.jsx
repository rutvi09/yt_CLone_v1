import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase-client";
import { AuthContext } from "../context/AuthContext";

const CreateChannel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);

  const [loading, setLoading] = useState(false);

  const uploadFile = async (file, folder) => {
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${folder}/${user.id}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("channel-assets")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("channel-assets")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();

    if (!channelName.trim()) {
      alert("Channel name is required");
      return;
    }

    setLoading(true);

    try {
      const logoUrl = await uploadFile(logo, "logos");
      const bannerUrl = await uploadFile(banner, "banners");

      const { error } = await supabase.from("channels").insert([
        {
          owner_id: user.id,
          channel_name: channelName,
          description,
          logo_url: logoUrl,
          banner_url: bannerUrl,
          subscribers_count: 0,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      alert("Channel created successfully!");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex justify-center py-10 px-4">

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">

        <div className="bg-white rounded-xl shadow-md p-8">

          <h1 className="text-3xl font-bold mb-6">
            Create Your Channel
          </h1>

          <form onSubmit={handleCreateChannel} className="space-y-6">

            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Channel name"
              className="w-full border rounded-lg px-4 py-3"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Description"
              className="w-full border rounded-lg px-4 py-3"
            />

            <div>
              <p className="font-medium mb-2">Channel Logo</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLogo(e.target.files[0])}
              />
            </div>

            <div>
              <p className="font-medium mb-2">Channel Banner</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBanner(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              {loading ? "Creating..." : "Create Channel"}
            </button>

          </form>
        </div>

        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

        
          <div className="h-36 bg-gray-200">
            {banner && (
              <img
                src={URL.createObjectURL(banner)}
                className="w-full h-full object-cover"
              />
            )}
          </div>

         
          <div className="p-5 flex items-center gap-4">

            
            <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden border-2 border-white -mt-10">
              {logo && (
                <img
                  src={URL.createObjectURL(logo)}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {channelName || "Your Channel Name"}
              </h2>

              <p className="text-gray-500 text-sm">
                0 subscribers
              </p>
            </div>

            <button className="ml-auto bg-black text-white px-4 py-1 rounded-full text-sm">
              Subscribe
            </button>
          </div>

        
          <div className="px-5 pb-5">
            <p className="text-gray-600 text-sm">
              {description || "Your channel description will appear here"}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CreateChannel;