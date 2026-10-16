import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Play,
  Search,
  Sparkles,
} from "lucide-react";
import { categories, videos } from "../data/mockVideos";
import VideoCard from "../components/VideoCard";
import { EmptyState } from "../components/Layout";

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState("recommended");
  const category = params.get("category") || "All";
  const query = params.get("q") || "";
  const view = params.get("view");

  function changeCategory(value) {
    const next = new URLSearchParams(params);
    if (value === "All") next.delete("category");
    else next.set("category", value);
    setParams(next);
  }

  // Demo listings are immediate. A future feed request can use VideoSkeletons.
  let filtered = videos.filter(
    (video) =>
      (category === "All" ||
        category === "For you" ||
        video.category === category) &&
      `${video.title} ${video.creator} ${video.category}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );
  if (sort === "views" || view === "trending")
    filtered = [...filtered].sort((a, b) => b.viewCount - a.viewCount);
  if (sort === "newest")
    filtered = [...filtered].sort((a, b) => {
      const days = (age) =>
        Number(age.split(" ")[0]) * (age.includes("week") ? 7 : 1);
      return days(a.age) - days(b.age);
    });

  const isLanding = !query && !view && category === "All";
  const title = query
    ? `Results for “${query}”`
    : view === "trending"
      ? "What’s making waves."
      : view === "explore"
        ? "Follow your curiosity."
        : category !== "All"
          ? `${category}. Your next rabbit hole.`
          : "A good place to get lost.";

  return (
    <div className="home-page page-container">
      <div className="category-bar" aria-label="Video categories">
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => changeCategory(item)}
            className={`category-pill ${category === item ? "selected" : ""}`}
            aria-pressed={category === item}
          >
            {item === "For you" && <Sparkles size={13} />}
            {item}
          </button>
        ))}
      </div>

      {isLanding && (
        <section className="hero-banner" aria-label="Featured video">
          <img
            className="hero-photo"
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=90"
            alt="Sunlight falling on dramatic mountain peaks in the Dolomites"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <span className="hero-tag">
              <span /> THE WORLD IS WORTH WATCHING
            </span>
            <h1>
              Find your next
              <br />
              <span>obsession.</span>
            </h1>
            <p>
              Big ideas. Small escapes. Stories that stay.
              <br />
              There’s a whole world waiting for you.
            </p>
            <Link to="/watch/demo-alpine" className="hero-watch">
              <Play size={15} fill="currentColor" /> Explore the extraordinary{" "}
              <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="hero-feature">
            <span className="feature-line" />
            <span>IN THE SPOTLIGHT</span>
            <Link to="/watch/demo-alpine">
              A little further from ordinary
              <ArrowUpRight size={17} />
            </Link>
            <p>
              Alex Rivers <span>·</span> 8 min of pure escape
            </p>
          </div>
          <div className="hero-index">
            <span className="current" />
            <span />
            <span />
          </div>
        </section>
      )}

      <section className="feed-section" aria-labelledby="feed-title">
        <div className="feed-heading">
          <div>
            <p className="eyebrow">
              {query
                ? "A LITTLE DISCOVERY"
                : view === "trending"
                  ? "THE CONVERSATION STARTS HERE"
                  : "YOUR DAILY DOSE OF DISCOVERY"}
            </p>
            <h2 id="feed-title">
              {title}
              <span className="heading-star">✳</span>
            </h2>
          </div>
          <label className="sort-control">
            <span className="sr-only">Sort videos</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="views">Most watched</option>
              <option value="newest">Newest first</option>
            </select>
          </label>
        </div>
        {filtered.length ? (
          <div className="video-grid">
            {filtered.map((video) => (
              <VideoCard video={video} key={video.id} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="Nothing here just yet."
            action="Explore all videos"
          >
            Try another search or choose a different category.
          </EmptyState>
        )}
      </section>

      <div className="discovery-note">
        <span className="discovery-icon">
          <Compass size={22} />
        </span>
        <div>
          <strong>A world of stories. A space for yours.</strong>
          <p>Keep watching. Keep wondering. Keep creating.</p>
        </div>
        <Link to="/upload">
          Make your first video <ArrowRight size={17} />
        </Link>
      </div>
      <footer className="page-footer">
        <span>
          <span className="status-dot" /> You’re exploring the demo collection
        </span>
        <span>Real curiosity. Sample videos. Made for discovery.</span>
      </footer>
    </div>
  );
}
