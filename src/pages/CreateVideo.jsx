import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../services/supabaseService";

const CreateVideo = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");

      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(Math.floor(video.duration));
      };

      video.onerror = () => {
        reject(new Error("Could not read video duration"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a video title");
      return;
    }

    if (!file) {
      alert("Please select a video file");
      return;
    }

    try {
      setLoading(true);

      const duration = await getVideoDuration(file);

      console.log("Detected duration:", duration);

      await uploadVideo(file, {
        title,
        duration,
      });

      alert("Video uploaded successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex justify-center py-10 px-4">
      
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
      

          <h1 className="text-3xl font-bold text-gray-800 mt-4">
            Upload Video
          </h1>

          <p className="text-gray-500 mt-1">
            Share your video with the world
          </p>
        </div>

        <form
          onSubmit={handleUpload}
          className="bg-white shadow-lg rounded-2xl border p-6 space-y-6"
        >

          <div>
            <label className="text-sm font-medium text-gray-700">
              Video Title
            </label>

            <input
              type="text"
              placeholder="Add a title that describes your video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full p-3 rounded-xl "
            />
          </div>

    
          <div>
            <label className="text-sm font-medium text-gray-700">
             Upload File
            </label>

            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition">
              
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full cursor-pointer"
              />

              
            </div>
          </div>

        
          {file && (
            <div className="bg-gray-50 border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {file.name}
                </p>

                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <span className="text-green-600 text-sm font-semibold">
                Ready
              </span>
            </div>
          )}

       <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Publish"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateVideo;