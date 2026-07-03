import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Video,
  Upload,
  Loader2,
  Film,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { uploadShort } from "../services/supabaseService";

const CreateShorts = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

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

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    if (!selected.type.startsWith("video/")) {
      alert("Please select a video file");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!file) {
      alert("Please select a short video");
      return;
    }

    try {
      setLoading(true);
      setUploadPercent(10);

      const duration = await getVideoDuration(file);

      const fakeProgress = setInterval(() => {
        setUploadPercent((prev) => {
          if (prev >= 90) return prev;
          return prev + 5;
        });
      }, 300);

      await uploadShort(file, {
        title,
        duration,
      });

      clearInterval(fakeProgress);

      setUploadPercent(100);

      setTimeout(() => {
        navigate("/shorts");
      }, 1000);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to upload short");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create Short
            </h1>

            <p className="text-gray-500 mt-1">
              Upload and share your short video
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Upload Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Film size={20} />
              <h2 className="font-semibold text-lg">
                Short Video
              </h2>
            </div>

            {!preview ? (
              <label className="border-2 border-dashed border-gray-300 rounded-2xl h-[320px] sm:h-[450px] lg:h-[550px] flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition">
                <Upload
                  size={60}
                  className="text-red-600 mb-4"
                />

                <h3 className="font-semibold text-lg">
                  Upload Short
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  MP4, MOV, WEBM
                </p>

                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex justify-center">
                <video
                  src={preview}
                  controls
                  className="h-[320px] sm:h-[450px] lg:h-[550px] rounded-xl object-cover border"
                />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Video size={20} />
              <h2 className="font-semibold text-lg">
                Details
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Short Title
                </label>

                <input
                  type="text"
                  placeholder="Add a title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-red-500"
                />

                <p className="text-xs text-gray-500 mt-2">
                  {title.length}/100 characters
                </p>
              </div>

              {file && (
                <div className="bg-gray-50 border rounded-xl p-4">
                  <p className="font-medium truncate">
                    {file.name}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              )}

              {loading && (
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>Uploading...</span>
                    <span>{uploadPercent}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-300"
                      style={{
                        width: `${uploadPercent}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Publish Short
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShorts;