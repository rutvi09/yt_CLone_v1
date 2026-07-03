import { useState } from "react";
import { Plus, Video, Clapperboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full"
      >
        <Plus size={18} />
        <span>Create</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              navigate("/create");
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <Video size={18} />
            Upload Video
          </button>

          <button
            onClick={() => {
              navigate("/create-short");
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
          >
            <Clapperboard size={18} />
            Upload Short
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateMenu;