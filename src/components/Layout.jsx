import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <Navbar setOpen={setOpen} />

      <Sidebar open={open} setOpen={setOpen} />

      <main
        className={`
          pt-14
          transition-all
          duration-300
          ease-in-out
          ${open ? "md:ml-56" : "md:ml-20"}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;