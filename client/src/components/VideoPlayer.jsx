import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Play, RotateCcw } from "lucide-react";

export default function VideoPlayer({ video, onPlay }) {
  const player = useRef(null);
  const [status, setStatus] = useState("ready");
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (status !== "buffering") return;
    const timer = setTimeout(() => setStatus("stalled"), 8000);
    return () => clearTimeout(timer);
  }, [status]);

  function reloadVideo() {
    // Native media controls handle playback/seeking. Reload restarts the clip.
    setStatus("buffering");
    player.current.load();
    player.current.play().catch(() => {
      // A browser may require another tap on its native Play button.
      if (!player.current.error) setStatus("ready");
    });
  }

  function playVideo() {
    player.current.play().catch((error) => {
      // Pausing while a play request is pending is a normal user action.
      if (error.name !== "AbortError") setStatus("error");
    });
  }

  return (
    <>
      <div className="player-container">
        <video
          ref={player}
          controls
          playsInline
          preload="metadata"
          poster={video.image}
          aria-label={`${video.title} — sample clip`}
          onPlay={() => { setPaused(false); onPlay(); }}
          onWaiting={() => setStatus("buffering")}
          onPlaying={() => setStatus("ready")}
          onCanPlay={() => setStatus("ready")}
          onPause={() => {
            setPaused(true);
            setStatus((current) =>
              current === "buffering" || current === "stalled" ? "ready" : current,
            );
          }}
          onEnded={() => { setPaused(true); setStatus("ended"); }}
          onError={() => setStatus("error")}
        >
          <source src={video.videoFile} type="video/webm" />
          <source src={video.fallbackVideoFile} type="video/mp4" />
          Your browser does not support HTML video.
        </video>
        {paused && (status === "ready" || status === "ended") && (
          <button
            type="button"
            className="player-play-button"
            aria-label={status === "ended" ? "Replay sample clip" : "Play sample clip"}
            onClick={playVideo}
          >
            {status === "ended" ? <RotateCcw size={28} /> : <Play size={29} fill="currentColor" />}
          </button>
        )}
        {status === "buffering" && (
          <span className="player-buffering" role="status">
            <LoaderCircle size={15} className="spin" /> Loading video…
          </span>
        )}
      </div>
      <div className={`playback-status ${status === "error" ? "playback-error" : ""}`}>
        <p role="status">
          {status === "error"
            ? "This clip couldn’t play. Reload it and try again."
            : status === "stalled"
              ? "Loading is taking longer than usual. You can reload the clip."
              : status === "ended"
                ? "Sample clip finished. Use Play to watch again."
                : `Sample clip · ${video.duration} · Full-length videos coming later`}
        </p>
        {(status === "error" || status === "stalled") && (
          <button type="button" className="button button-subtle" onClick={reloadVideo}>
            <RotateCcw size={14} /> Reload video
          </button>
        )}
      </div>
    </>
  );
}
