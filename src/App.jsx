import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import VideoCard from "./components/VideoCard";
import Shorts from "./components/Shorts";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import CreateVideo from "./pages/CreateVideo";
import Profile from "./pages/Profile";
import CreateChannel from "./pages/CreateChannel";
import Subscribe from "./pages/Subscribe"; // NEW
import Channel from "./pages/Channel";
import CreateShorts from "./pages/CreateShorts";
import Results from "./pages/Results";
import Purchase from "./pages/Purchase";
function App() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>

        <Route path="/" element={<VideoCard />} />

        <Route path="/watch/:id" element={<Watch />} />

        <Route path="/shorts" element={<Shorts />} />

        {/* NEW SUBSCRIPTIONS PAGE */}
        <Route path="/subscriptions" element={<Subscribe />} />

        <Route path="/create-channel" element={<CreateChannel />} />

        <Route path="/create" element={<CreateVideo />} />

        <Route path="/create-shorts" element={<CreateShorts />} />
        <Route path="/profile" element={<Profile />} />

<Route path="/results" element={<Results />} />
        <Route path="/channel/:id" element={<Channel />} />
        <Route path="/purchase" element={<Purchase />} />

      </Route>

    </Routes>
  );
}

export default App;