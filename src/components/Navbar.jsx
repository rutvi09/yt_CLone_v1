import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import youtube from "../assets/youtube.png";
import { Search, Mic, Ellipsis, Plus, Bell } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { IoMdMenu } from "react-icons/io";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../supabase-client";


const Navbar = ({ setOpen }) => {
   const [searchQuery, setSearchQuery] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const [channel, setChannel] = useState(null);
  const [notifications, setNotifications] = useState([]);
const [showNotifications, setShowNotifications] = useState(false);
const unreadCount = notifications?.filter(n => n.read === false).length || 0;
  const menuRef = useRef(null);

  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
 const handleSearch = () => {
  if (!searchQuery.trim()) return;

  navigate(`/results?search_query=${searchQuery}`);
}; 
 useEffect(() => {
  if (!user?.id) {
    setProfile(null);
    setChannel(null);
    return;
  }

  const fetchData = async () => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(profileData);

      const { data: channels } = await supabase
        .from("channels")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      setChannel(channels?.[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  fetchData();

  const channelSubscription = supabase
    .channel(`channel-${user.id}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "channels",
      },
      () => {
        fetchData();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channelSubscription);
  };
}, [user]);

 useEffect(() => {
  if (!user?.id) return;


 

const fetchNotifications = async () => {
 const { data, error } = await supabase
  .from("notifications")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

console.log(data);
console.log(error);
  if (error) {
    console.error(error);
    return;
  }

  setNotifications(data || []);
};
  fetchNotifications();
}, [user]);

useEffect(() => {
  if (!user?.id) return;

  const notificationChannel = supabase
    .channel(`notifications-${user.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      },
      (payload) => {
        setNotifications((prev) => [payload.new, ...prev]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(notificationChannel);
  };
}, [user]);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showMenu]);

  

   const newUnreadCount = notifications.filter(
  (n) => !n.read
).length;
  const Avatar = ({ size = "w-8 h-8" }) => {
   console.log(notifications);
    if (!user) {

      return <CgProfile className="text-2xl text-gray-700" />;
    }

    
    if (channel?.logo_url) {
      
      return (
        <img
          src={channel.logo_url}
          alt="Channel"
          className={`${size} rounded-full object-cover`}
        />
      );
    }

   
    if (profile?.avatar_url) {
      return (
        <img
          src={profile.avatar_url}
          alt="Profile"
          className={`${size} rounded-full object-cover`}
        />
      );
    }
const handleUploadNotification = async (video) => {
  const { data: subs, error } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("channel_id", video.channel_id);

  if (error) {
    console.log(error);
    return;
  }

 const { data: channelData } = await supabase
  .from("channels")
  .select("channel_name, logo_url")
  .eq("id", video.channel_id)
  .single();

const notifications = subs.map((sub) => ({
  user_id: sub.user_id,
  video_id: video.id,
  channel_id: video.channel_id,
  type: "new_video",
  uploader_name: channelData.channel_name,
  channel_logo: channelData.logo_url,
  read: false,
}));

console.log(notifications);
  await supabase.from("notifications").insert(notifications);
  
};

    return (
      <div
        className={`${size} rounded-full bg-red-600 text-white flex items-center justify-center font-semibold`}
      >
        {(
          channel?.channel_name ||
          profile?.full_name ||
          profile?.username ||
          user?.email ||
          "U"
        )
          .charAt(0)
          .toUpperCase()}
      </div>
    );
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">

       
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <IoMdMenu className="text-2xl" />
          </button>

          <Link to="/" className="flex items-center">
            <img
              src={youtube}
              alt="YouTube"
              className="h-14 object-contain"
            />
          </Link>
        </div>

        
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() =>
              setMobileSearchOpen((prev) => !prev)
            }
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Search size={20} />
          </button>
        </div>

        
        <div className="hidden md:flex items-center w-[50%] max-w-[720px]">
          <div className="flex flex-1 relative">
            {isFocused && (
              <Search
                size={18}
                className="absolute left-4 top-2.5 text-gray-500"
              />
            )}
<input
  type="text"
  placeholder="Search"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  className={`flex-1 h-10 border border-gray-300 rounded-l-full text-sm outline-blue-500 ${
    isFocused ? "pl-11" : "pl-4"
  }`}
/>
<button
  onClick={handleSearch}
  className="h-10 px-6 border border-l-0 border-gray-300 rounded-r-full bg-gray-50 hover:bg-gray-100"
>
  <Search size={20} />
</button>             
          </div>

          <button className="ml-3 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200">
            <Mic size={20} />
          </button>
        </div>


        <div className="relative flex items-center gap-3">

          {user ? (
            <>
             
           <div className="relative">
  <button
    onClick={() => setShowCreateMenu((prev) => !prev)}
    className="flex items-center gap-2 px-2.5 md:px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium"
  >
    <Plus size={18} />
    <span className="hidden md:inline">Create</span>
  </button>

  {showCreateMenu && (
    <div className="absolute right-0 top-12 w-48 md:w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
      <button
        onClick={() => {
          navigate("/create");
          setShowCreateMenu(false);
        }}
        className="w-full px-4 py-3 text-left hover:bg-gray-100"
      >
         Upload Video
      </button>

      <button
        onClick={() => {
          navigate("/create-shorts");
          setShowCreateMenu(false);
        }}
        className="w-full px-4 py-3 text-left hover:bg-gray-100"
      >
        Upload Short
      </button>
    </div>
  )}
</div>
             
            <button
  onClick={() => setShowNotifications((prev) => !prev)}
  className="p-2 rounded-full hover:bg-gray-100 relative"
>
  <Bell size={22} />

  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</button>

{showNotifications && (
  <div className="fixed md:absolute left-2 right-2 md:left-auto md:right-0 top-14 md:top-12 w-auto md:w-[420px] max-w-full max-h-[600px] overflow-y-auto bg-white border rounded-xl shadow-2xl z-50">

    <div className="p-3 border-b font-semibold">
      Notifications
    </div>

    {notifications.length === 0 ? (
      <div className="p-4 text-sm text-gray-500">
        No notifications
      </div>
    ) : (
      notifications.map((notification) => (
        <button
          key={notification.id}
          onClick={async () => {
            await supabase
              .from("notifications")
              .update({ read: true })
              .eq("id", notification.id);

            setNotifications((prev) =>
              prev.map((n) =>
                n.id === notification.id
                  ? { ...n, read: true }
                  : n
              )
            );

            navigate(`/watch/${notification.video_id}`);
            setShowNotifications(false);
          }}
          className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-100 text-left ${
            !notification.read ? "bg-blue-50" : ""
          }`}
        >
          {!notification.read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-5 shrink-0" />
          )}

{notification.channel_logo ? (
    <img
    src={notification.channel_logo}
    alt=""
    className="w-10 h-10 rounded-full object-cover"
  />
) : (
  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-semibold">
{notification.uploader_name?.charAt(0)?.toUpperCase() || "U"}
  </div>
)}
          <div className="flex-1 min-w-0">
    <p className="text-sm line-clamp-2">
  <span className="font-semibold">
  {notification.uploader_name}
</span>
  {" uploaded: New Video - Watch Now! "} 
  {notification.videos?.title}
</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(
                notification.created_at
              ).toLocaleString()}
            </p>
          </div>

          {notification.videos?.thumbnail_url && (
            <img
              src={notification.videos.thumbnail_url}
              alt=""
              className="w-24 h-14 object-cover rounded-lg shrink-0"
            />
          )}
        </button>
      ))
    )}
  </div>
)}
      


              <button
           onClick={() =>
           setShowMenu((prev) => !prev)
           }
           className="rounded-full"
            >
           <Avatar size="w-8 h-8" />
           </button>

           </>

           ) : (
            <>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Ellipsis size={22} />
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-2 border border-blue-500 rounded-full text-blue-600 hover:bg-blue-50 text-sm font-medium"
              >
                <CgProfile size={18} />
                Sign In
              </button>
            </>
          )}
          

          {showMenu && user && (
            <div
              ref={menuRef}
              className="fixed md:absolute left-2 right-2 md:left-auto md:right-0 top-14 md:top-12 w-auto md:w-80 max-w-full bg-white rounded-xl shadow-xl border overflow-hidden"
            >

              
              <div className="p-4 flex gap-3 border-b">

                <Avatar size="w-12 h-12" />

                <div className="flex-1">

                  <h3 className="font-semibold">
                    {channel?.channel_name ||
                      profile?.full_name ||
                      profile?.username ||
                      user?.email?.split("@")[0]}
                  </h3>

                  {channel && (
                    <p className="text-xs text-gray-500">
                      @{channel.channel_name}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    {user.email}
                  </p>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowMenu(false);
                    }}
                    className="text-blue-600 text-sm mt-2 hover:underline"
                  >
                    View your channel
                  </button>
                </div>
              </div>

              <div className="py-2">

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                >
                  Your Channel
                </button>

                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                >
                  YouTube Studio
                </button>

                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                >
                  Switch Account
                </button>

                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                >
                  Purchases and memberships
                </button>

                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                >
                  Settings
                </button>

                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
                >
                  Help
                </button>

                <hr className="my-2" />

                <button
                  onClick={async () => {
                    await logout();
                    setShowMenu(false);
                    navigate("/");
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-500 text-sm"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      
      {mobileSearchOpen && (
        <div className="fixed top-14 inset-x-0 z-50 bg-white p-3 shadow-lg md:hidden">
          <div className="flex gap-2">

            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    setMobileSearchOpen(false);
                  }
                }}
                className="w-full h-10 pl-11 pr-4 border border-gray-300 rounded-full text-sm outline-blue-500"
              />
            </div>

            <button
              onClick={() => {
                handleSearch();
                setMobileSearchOpen(false);
              }}
              className="h-10 px-4 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Search
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;