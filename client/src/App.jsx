import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout, { EmptyState } from "./components/Layout";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Library from "./pages/Library";

export default function App() {
  const location = useLocation();
  useEffect(() => {
    const name = location.pathname.split("/")[1];
    document.title = name
      ? `${name.charAt(0).toUpperCase() + name.slice(1)} — StreamTube`
      : "StreamTube — Find your next obsession.";
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Auth key="login" />} />
      <Route path="/register" element={<Auth key="register" register />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="watch/:id" element={<Watch />} />
        <Route path="profile" element={<Profile />} />
        <Route path="upload" element={<Upload />} />
        <Route path="library/:collection" element={<Library />} />
        <Route
          path="*"
          element={
            <EmptyState
              title="A little off the beaten path."
              action="Take me home"
            >
              That page doesn’t exist, but your next favorite video might.
            </EmptyState>
          }
        />
      </Route>
    </Routes>
  );
}
