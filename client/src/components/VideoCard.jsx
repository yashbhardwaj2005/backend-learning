import { BadgeCheck, Bookmark, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useLibrary } from "../context/LibraryContext";

export function Avatar({ user, size = "", className = "" }) {
  const name =
    user?.fullName || user?.creator || user?.username || "StreamTube";
  return (
    <span
      className={`avatar ${size} ${className}`}
      style={{ background: user?.color || "#484848" }}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={name}
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
      <span>{user?.initials || name.slice(0, 2).toUpperCase()}</span>
    </span>
  );
}

export default function VideoCard({ video, compact = false }) {
  const { library, toggle } = useLibrary();
  const saved = library.saved.includes(video.id);

  return (
    <article className={`video-card ${compact ? "compact-card" : ""}`}>
      <div className={`thumbnail thumbnail-${video.artStyle || "plain"}`}>
        <Link to={`/watch/${video.id}`} aria-label={`Watch ${video.title}`}>
          <img
            src={video.image}
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/thumbnail-fallback.svg";
            }}
          />
          {video.artwork && (
            <div className="thumbnail-art">
              <span>{video.eyebrow}</span>
              <strong>{video.artwork}</strong>
            </div>
          )}
          <span className="play-on-hover">
            <Play size={22} fill="currentColor" />
          </span>
          <span className="duration">{video.duration}</span>
        </Link>
        <button
          className={`save-overlay ${saved ? "is-saved" : ""}`}
          onClick={() => toggle("saved", video.id)}
          aria-label={
            saved
              ? `Remove ${video.title} from Watch later`
              : `Save ${video.title} to Watch later`
          }
          aria-pressed={saved}
        >
          <Bookmark size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="video-details">
        {!compact && <Avatar user={video} />}
        <div>
          <Link className="video-title" to={`/watch/${video.id}`}>
            {video.title}
          </Link>
          <span className="creator-name">
            {video.creator}{" "}
            <BadgeCheck size={13} fill="currentColor" strokeWidth={1.5} />
          </span>
          <p className="video-meta">
            {video.views} views <span>·</span> {video.age}
          </p>
        </div>
      </div>
    </article>
  );
}

export function VideoSkeletons() {
  return (
    <div className="video-grid" role="status" aria-label="Loading videos">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton-thumbnail" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
        </div>
      ))}
    </div>
  );
}
