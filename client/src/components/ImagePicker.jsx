import { useEffect, useRef, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";

export default function ImagePicker({ id, label, required = false, wide = false, file, onChange, onError }) {
  const input = useRef(null);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [pickerOpened, setPickerOpened] = useState(false);

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function selectImage(image) {
    if (!image) return;
    if (!image.type.startsWith("image/") || image.size > 5 * 1024 * 1024) {
      onError(`Choose an image up to 5 MB for ${label.toLowerCase()}.`);
      return;
    }
    onError("");
    onChange(image);
    setPickerOpened(false);
  }

  function openPicker() {
    setPickerOpened(true);
    // Keep this synchronous: browsers require a direct user click for a picker.
    try {
      if (input.current.showPicker) input.current.showPicker();
      else input.current.click();
    } catch {
      input.current.click();
    }
  }

  return (
    <div
      className={`image-picker ${wide ? "image-picker-wide" : ""} ${dragging ? "image-picker-dragging" : ""}`}
      role="group"
      aria-label={`${label} upload`}
      aria-describedby={`${id}-help`}
      tabIndex={0}
      onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        selectImage(event.dataTransfer.files[0]);
      }}
      onPaste={(event) => {
        const image = event.clipboardData.files[0];
        if (image) { event.preventDefault(); selectImage(image); }
      }}
    >
      <div className="image-picker-main">
        <span className="image-picker-preview">
          {preview ? <img src={preview} alt={`${label} preview`} /> : <ImagePlus size={25} />}
        </span>
        <div className="image-picker-details">
          <strong>{label} {required && <span aria-hidden="true">*</span>}</strong>
          <small>{required ? "Required" : "Optional"} · Image up to 5 MB</small>
          {file && <span className="image-picker-filename" role="status">{file.name}</span>}
        </div>
      </div>
      <div className="image-picker-actions">
        <button type="button" className="button button-subtle" onClick={openPicker}>
          <Upload size={14} /> {file ? "Change" : "Choose"} {label.toLowerCase()}
        </button>
        {file && (
          <button type="button" className="image-picker-clear" onClick={() => { onChange(null); onError(""); }}>
            Remove<span className="sr-only"> {label.toLowerCase()}</span>
          </button>
        )}
      </div>
      {/* File state also supports drop/paste; Auth adds it to FormData explicitly. */}
      <input
        ref={input}
        id={id}
        type="file"
        accept="image/*"
        aria-label={label}
        hidden
        onChange={(event) => { selectImage(event.target.files[0]); event.target.value = ""; }}
      />
      <p id={`${id}-help`} className="image-picker-help">
        Drop an image here, or click this box and paste an image with Ctrl+V.
      </p>
      {pickerOpened && (
        <p className="image-picker-help" role="status">
          If no file window appears, use drop/paste here or open this page in Chrome or Edge.
        </p>
      )}
    </div>
  );
}
