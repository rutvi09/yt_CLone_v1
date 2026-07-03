import { createContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChannel = async (userId) => {
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .eq("owner_id", userId) 
      .maybeSingle();

    if (!error && data) {
      setChannel(data);
      return data;
    }

    return null;
  };

  const ensureChannel = async (user) => {
    if (!user) return;

    const existing = await fetchChannel(user.id);

    if (!existing) {
      const { data, error } = await supabase
        .from("channels")
        .insert([
          {
            owner_id: user.id, 
            channel_name:
              user.email?.split("@")[0] || "My Channel",

            description: "Welcome to my channel",

            logo_url:
              user.user_metadata?.avatar_url ||
              user.user_metadata?.picture ||
              "",

            banner_url: "",
          },
        ])
        .select()
        .single();

      if (!error && data) {
        setChannel(data);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user || null;

      setUser(currentUser);

      if (currentUser) {
        await ensureChannel(currentUser);
      }

      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;

        setUser(currentUser);

        if (currentUser) {
          await ensureChannel(currentUser);
        } else {
          setChannel(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const refreshChannel = async () => {
    if (!user) return;
    await fetchChannel(user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setChannel(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        channel,
        loading,
        logout,
        refreshChannel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};