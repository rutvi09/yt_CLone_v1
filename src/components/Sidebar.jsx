import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoHome, IoMusicalNotes } from "react-icons/io5";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions, MdHistory } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaChild } from "react-icons/fa";
import { FaFire, FaShoppingBag, FaGamepad, FaNewspaper, FaTrophy, FaPodcast } from "react-icons/fa";
import { FaClapperboard } from "react-icons/fa6";
import { IoRadioOutline } from "react-icons/io5";
import { PiTelevisionSimpleFill } from "react-icons/pi";
import { SiYoutubemusic } from "react-icons/si";
import { SiYoutubekids } from "react-icons/si";
import { SiYoutube } from "react-icons/si";
import { BsHandbag } from "react-icons/bs";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Clapperboard } from "lucide-react";
import profile from "../pages/Profile";
import subscribe from "../pages/Subscribe";

const Sidebar = ({ open, setOpen }) => {
  const [showMore, setShowMore] = useState(false);

  const closeOnMobile = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setOpen?.(false);
    }
  };

  const exploreItems = [
    { icon: <FaShoppingBag />, label: "Shopping" },
    { icon: <IoMusicalNotes />, label: "Music" },
    { icon: <FaClapperboard />, label: "Movies" },
    { icon: <IoRadioOutline />, label: "Live" },
    { icon: <FaGamepad />, label: "Gaming" },
    { icon: <FaNewspaper />, label: "News" },
    { icon: <FaTrophy />, label: "Sports" },
  ];

  const moreItems = [
    { icon: <FaPodcast />, label: "Podcasts" },
    { icon: <BsHandbag />, label: "Fashion & Beauty" },
    
  ];

  return (
    <>
      {/* Mobile backdrop for the slide-in drawer */}
      {open && (
        <div
          onClick={() => setOpen?.(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      <aside
        className={`
          fixed top-14 left-0
          h-[calc(100vh-56px)]
          bg-white
          border-r border-gray-100
          transition-all duration-300
          overflow-y-auto
          z-40
          w-64
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${open ? "md:w-60" : "md:w-[72px]"}
        `}
      >
      <div className="px-2 py-3">


        <SidebarItem icon={<IoHome />} label="Home" open={open} to="/" onNavigate={closeOnMobile} />
        <SidebarItem icon={<SiYoutubeshorts />} label="Shorts" open={open} to="/shorts" onNavigate={closeOnMobile} />
        <SidebarItem icon={<MdOutlineSubscriptions />} label="Subscriptions" open={open} to="/subscriptions" onNavigate={closeOnMobile} />
        <SidebarItem icon={<CgProfile />} label="You" open={open} to="/profile" onNavigate={closeOnMobile} />

        {open && (
          <>
            <hr className="my-3" />

          
            <h3 className="px-3 text-xs text-gray-500 uppercase tracking-wider mb-2">
              Explore
            </h3>

            {exploreItems.map((item, i) => (
              <SidebarItem
                key={i}
                icon={item.icon}
                label={item.label}
                open={open}
              />
            ))}

          
            {showMore &&
              moreItems.map((item, i) => (
                <SidebarItem
                  key={i}
                  icon={item.icon}
                  label={item.label}
                  open={open}
                />
              ))}

        
            <div
              onClick={() => setShowMore(!showMore)}
              className="
                flex items-center gap-5
                p-3 rounded-xl
                cursor-pointer
                hover:bg-gray-200
                transition
              "
            >
              <span className="text-lg">
                {showMore ? <FaChevronUp /> : <FaChevronDown />}
              </span>

              <span className="text-sm">
                {showMore ? "Show less" : "Show more"}
              </span>
            </div>

            <hr className="my-3" />

          
            <h3 className="px-3 text-xs text-gray-500 uppercase tracking-wider mb-2">
              More from YouTube
            </h3>

            <SidebarItem icon={<SiYoutube />} label="YouTube Premium" open={open} />
            <SidebarItem icon={<SiYoutubemusic />} label="YouTube Music" open={open} />
            <SidebarItem icon={<SiYoutubekids />} label="YouTube Kids" open={open} />

            <SidebarItem icon={<MdHistory />} label="History" open={open} />
          </>
        )}
      </div>
      </aside>
    </>
  );
};

const SidebarItem = ({ icon, label, open, to, onNavigate }) => {
  const content = (
    <div
      className={`
        flex items-center
        ${open ? "justify-start" : "justify-center"}
        gap-5
        p-3
        rounded-xl
        cursor-pointer
        hover:bg-gray-200
        transition
      `}
    >
      <span className="text-xl">{icon}</span>

      {open && (
        <span className="text-sm text-gray-800">
          {label}
        </span>
      )}
    </div>
  );

  return to ? (
    <Link to={to} className="block" onClick={onNavigate}>
      {content}
    </Link>
  ) : (
    content
  );
};

export default Sidebar;