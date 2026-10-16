import { useEffect, useState } from "react";
import {
  Check,
  ChevronRight,
  CloudUpload,
  Eye,
  Film,
  ImagePlus,
  Info,
  X,
} from "lucide-react";
import { PageHeading } from "../components/Layout";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      setVideoUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    if (!thumbnail) {
      setImageUrl("");
      return;
    }
    const url = URL.createObjectURL(thumbnail);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnail]);

  function selectVideo(selected) {
    setError("");
    setPreview(false);
    if (!selected) return;
    if (!selected.type.startsWith("video/")) {
      setError("Choose a video file such as MP4 or WebM.");
      return;
    }
    if (selected.size > 500 * 1024 * 1024) {
      setError(
        "Please choose a video smaller than 500 MB for the local preview."
      );
      return;
    }
    setFile(selected);
    if (!title)
      setTitle(selected.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
  }

  return (
    <div className="page-container upload-page">
      <PageHeading
        eyebrow="THE CREATOR STUDIO"
        title="Good stories start with you."
      >
        <span className="small-tag">
          <Film size={13} /> Local preview
        </span>
      </PageHeading>
      <p className="page-intro">
        A big idea, a small moment, something worth sharing. Make it yours.
      </p>
      <div className="info-banner">
        <Info size={19} />
        <div>
          <strong>Your studio is taking shape.</strong>
          <p>
            Video publishing is coming when your backend upload API is ready.
            For now, prepare and preview a video here. Files stay on your device
            and are cleared when you leave.
          </p>
        </div>
      </div>
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      <div className="upload-layout">
        <form
          className="panel upload-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!file) {
              setError("Choose a video before opening the preview.");
              return;
            }
            setError("");
            setPreview(true);
          }}
        >
          <div className="panel-heading">
            <h2>The details</h2>
            <span className="step-count">01 / 02</span>
          </div>
          <label
            className={`upload-dropzone ${file ? "has-file" : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              selectVideo(event.dataTransfer.files[0]);
            }}
          >
            <input
              type="file"
              accept="video/*"
              onChange={(event) => selectVideo(event.target.files?.[0])}
            />
            <span className="dropzone-icon">
              {file ? <Check size={27} /> : <CloudUpload size={29} />}
            </span>
            <strong>
              {file ? file.name : "Drop your next great story here"}
            </strong>
            <span>
              {file
                ? `${(file.size / 1024 / 1024).toFixed(1)} MB · Click to choose another video`
                : "Drag a video here, or click to browse"}
            </span>
            <small>
              MP4 or WebM recommended · Up to 500 MB · Local preview only
            </small>
          </label>
          <label>
            Video title
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setPreview(false);
              }}
              placeholder="Give your story a name"
              required
              maxLength={120}
            />
            <small className="field-hint">
              {title.length}/120 · A little intrigue goes a long way.
            </small>
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                setPreview(false);
              }}
              placeholder="What’s the story behind the story?"
              rows={5}
              maxLength={5000}
            />
          </label>
          <label className="thumbnail-picker">
            <ImagePlus size={23} />
            <span>
              <strong>
                {thumbnail ? thumbnail.name : "Choose a thumbnail"}
              </strong>
              <small>The first impression of your video · Max 5 MB</small>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const selected = event.target.files?.[0];
                if (!selected) return;
                if (
                  !selected.type.startsWith("image/") ||
                  selected.size > 5 * 1024 * 1024
                ) {
                  setError("Choose a thumbnail image smaller than 5 MB.");
                  return;
                }
                setError("");
                setThumbnail(selected);
              }}
            />
            <ChevronRight size={18} />
          </label>
          <button className="button button-primary" type="submit">
            <Eye size={17} /> Preview your video
          </button>
        </form>
        <aside className="upload-preview">
          <section className="panel">
            <div className="panel-heading">
              <h2>A first look</h2>
              <span className="step-count">02 / 02</span>
            </div>
            {videoUrl ? (
              <video
                src={videoUrl}
                poster={imageUrl || undefined}
                controls
                playsInline
                className="local-video-preview"
              />
            ) : (
              <div className="upload-placeholder">
                <Film size={35} />
                <span>Your video will feel right at home here.</span>
              </div>
            )}
            <h3>{title || "Your next great story"}</h3>
            <p>
              {description ||
                "Add a title and description to bring your video to life."}
            </p>
            <span className="small-tag">Private · On this device</span>
          </section>
          {preview && (
            <div className="form-message success preview-message" role="status">
              <Check size={20} />
              <div>
                <strong>Looking good. Your preview is ready.</strong>
                <p>
                  Nothing has been uploaded. Publishing will be available once
                  the backend supports video uploads.
                </p>
              </div>
              <button
                aria-label="Dismiss preview message"
                onClick={() => setPreview(false)}
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="creator-tip">
            <span>✳</span>
            <h3>Start with what you love.</h3>
            <p>
              The best stories don’t need to be perfect. They just need to be
              yours.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
