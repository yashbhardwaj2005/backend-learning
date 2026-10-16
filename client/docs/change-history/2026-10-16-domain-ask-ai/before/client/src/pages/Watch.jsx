import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Check,
  ChevronDown,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { videos } from "../data/mockVideos";
import VideoCard, { Avatar } from "../components/VideoCard";
import { EmptyState } from "../components/Layout";
import { useLibrary } from "../context/LibraryContext";
import VideoPlayer from "../components/VideoPlayer";

export default function Watch() {
  const { id } = useParams();
  const video = videos.find((item) => item.id === id);
  const { library, toggle, remember } = useLibrary();
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setExpanded(false);
    setMessage("");
  }, [id]);

  if (!video)
    return (
      <EmptyState title="This video wandered off." action="Back to discovering">
        The demo video you’re looking for doesn’t exist.
      </EmptyState>
    );

  const liked = library.liked.includes(id);
  const saved = library.saved.includes(id);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage("Video link copied. Pass the curiosity on.");
    } catch {
      setMessage(`Copy this link: ${window.location.href}`);
    }
  }

  return (
    <div className="page-container watch-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to discovering
      </Link>
      <div className="watch-layout">
        <section className="watch-main">
          <VideoPlayer key={id} video={video} onPlay={() => remember(id)} />
          <div className="watch-category">
            <span className="status-dot" /> DEMO VIDEO <span> / </span>
            {video.category}
          </div>
          <h1 className="watch-title">{video.title}</h1>
          <div className="watch-actions">
            <div className="creator-info">
              <Avatar user={video} size="large" />
              <div>
                <strong>{video.creator}</strong>
                <span>Independent creator · Demo channel</span>
              </div>
            </div>
            <div className="action-buttons">
              <button
                className={`button button-subtle ${liked ? "toggled" : ""}`}
                onClick={() => toggle("liked", id)}
                aria-pressed={liked}
              >
                <ThumbsUp size={17} />
                {liked ? "Liked" : "Like"}
              </button>
              <button
                className={`button button-subtle ${saved ? "toggled" : ""}`}
                onClick={() => toggle("saved", id)}
                aria-pressed={saved}
              >
                {saved ? <Check size={17} /> : <Bookmark size={17} />}
                {saved ? "Saved" : "Save"}
              </button>
              <button
                className="icon-button share-button"
                aria-label="Copy video link"
                onClick={share}
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
          {message && (
            <p className="form-message success" role="status">
              {message}
            </p>
          )}
          <div className={`description-card ${expanded ? "expanded" : ""}`}>
            <p className="description-meta">
              {video.views} views <span>·</span> {video.age}
            </p>
            <p>{video.description}</p>
            {expanded && (
              <div className="sample-credit">
                <strong>About this demo</strong>
                <p>
                  Titles, creators, artwork, and view counts are sample content.
                  Playback uses a short, locally bundled sample clip; the card
                  shows its actual length. Like and save actions are kept
                  on this device.
                </p>
                <p>Sample footage: {video.sampleCredit}.</p>
                <p>
                  Photography: Unsplash. Video upload and feed APIs have not
                  been implemented in the backend yet.
                </p>
              </div>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
            >
              {expanded ? "Show less" : "Show more"}
              <ChevronDown size={15} className={expanded ? "rotate" : ""} />
            </button>
          </div>
          <div className="comments-placeholder">
            <span className="eyebrow">GOOD STORIES START CONVERSATIONS</span>
            <h2>More to come.</h2>
            <p>
              Comments and subscriptions will arrive when their backend APIs are
              ready.
            </p>
          </div>
        </section>
        <aside className="related-videos">
          <div className="related-heading">
            <h2>Keep the curiosity going</h2>
            <span>{videos.length - 1} videos</span>
          </div>
          {videos
            .filter((item) => item.id !== id)
            .map((item) => (
              <VideoCard key={item.id} video={item} compact />
            ))}
        </aside>
      </div>
    </div>
  );
}
