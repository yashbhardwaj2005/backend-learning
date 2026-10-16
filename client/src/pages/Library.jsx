import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bookmark, History, ThumbsUp } from "lucide-react";
import { useLibrary } from "../context/LibraryContext";
import { useAuth } from "../context/AuthContext";
import { authApi, getApiError } from "../api/client";
import { videos } from "../data/mockVideos";
import { EmptyState, PageHeading } from "../components/Layout";
import VideoCard from "../components/VideoCard";

const collections = {
  saved: {
    title: "For a little later.",
    label: "WATCH LATER",
    empty: "Good things are worth saving.",
    icon: Bookmark,
    hint: "Tap the bookmark on a video to keep it here for another day.",
  },
  liked: {
    title: "Your kind of good.",
    label: "LIKED VIDEOS",
    empty: "Find something you love.",
    icon: ThumbsUp,
    hint: "Like a video while watching, and your favorites will find a home here.",
  },
  history: {
    title: "Follow your own trail.",
    label: "WATCH HISTORY",
    empty: "Every rabbit hole starts somewhere.",
    icon: History,
    hint: "Play a demo video to start your trail. Recently played videos appear here.",
  },
};

export default function Library() {
  const { collection } = useParams();
  const { library } = useLibrary();
  const { user } = useAuth();
  const [backendHistory, setBackendHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");
  const info = collections[collection];

  useEffect(() => {
    if (collection !== "history" || !user) return;
    let active = true;
    setHistoryLoading(true);
    setError("");
    authApi
      .history()
      .then(({ data }) => {
        if (active) setBackendHistory(data.data || []);
      })
      .catch((requestError) => {
        if (active) setError(getApiError(requestError));
      })
      .finally(() => {
        if (active) setHistoryLoading(false);
      });
    return () => {
      active = false;
    };
  }, [collection, user]);

  if (!info)
    return (
      <EmptyState
        title="This collection doesn’t exist."
        action="Back to exploring"
      >
        There are plenty of good stories on the home page.
      </EmptyState>
    );
  const selected = library[collection]
    .map((id) => videos.find((video) => video.id === id))
    .filter(Boolean);

  return (
    <div className="page-container library-page">
      <PageHeading eyebrow={info.label} title={info.title}>
        <span className="small-tag">
          {selected.length} demo {selected.length === 1 ? "video" : "videos"}
        </span>
      </PageHeading>
      <p className="page-intro">
        Your demo collection stays on this device. A little corner of the
        internet, curated by you.
      </p>
      {selected.length ? (
        <div className="video-grid">
          {selected.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={info.icon}
          title={info.empty}
          action="Discover something good"
        >
          {info.hint}
        </EmptyState>
      )}
      {collection === "history" && user && (
        <section className="panel backend-history">
          <div className="panel-heading">
            <h2>From your account</h2>
            <span className="small-tag">Connected to backend</span>
          </div>
          {historyLoading ? (
            <p role="status">Loading your account history…</p>
          ) : error ? (
            <p className="form-message error" role="alert">
              {error}
            </p>
          ) : backendHistory.length ? (
            <div className="history-list">
              {backendHistory.map((video) => (
                <div className="history-entry" key={video._id}>
                  <img src={video.thumbnail} alt="" />
                  <div>
                    <h3>{video.title}</h3>
                    <p>{video.owner?.fullName || "Creator"}</p>
                    {video.videoFile && (
                      <video
                        src={video.videoFile}
                        controls
                        preload="none"
                        playsInline
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>
              No account watch history yet. Demo playback stays in your device
              collection above.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
