import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import {
  ArrowUp,
  ArrowUpRight,
  Bookmark,
  CircleAlert,
  Compass,
  LoaderCircle,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { api, getApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { videos } from "../data/mockVideos";
import "./AskAI.css";

// Send listing information only. Media, account details, and cookies stay out
// of the AI prompt; the backend uses our cookie to check that we're signed in.
const catalog = videos.slice(0, 9).map((video) => ({
  id: video.id,
  title: video.title,
  creator: video.creator,
  category: video.category,
  description: video.description.slice(0, 350),
}));

function recommendedVideos(reply) {
  const text = reply.toLowerCase();
  return videos
    .filter(
      (video) =>
        text.includes(video.id.toLowerCase()) ||
        text.includes(video.title.toLowerCase())
    )
    .slice(0, 3);
}

export default function AskAI({ open, onClose }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const watchMatch = useMatch("/watch/:id");
  const currentVideo = videos.find(
    (video) => video.id === watchMatch?.params.id
  );
  const userId = user?._id || "";
  const dialogRef = useRef(null);
  const conversationRef = useRef(null);
  const requestRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const loginUrl = `/login?next=${encodeURIComponent(
    location.pathname + location.search + location.hash
  )}`;

  function stopRequest() {
    const active = requestRef.current;
    if (!active) return;
    requestRef.current = null;
    active.controller.abort();
    setPending(false);
    setMessages((previous) => previous.slice(0, -1));
    setDraft((previous) => previous || active.question);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open) {
      if (dialog.open) dialog.close();
      stopRequest();
    }
  }, [open]);

  // A shared browser should never show the previous account's conversation.
  useEffect(() => {
    requestRef.current?.controller.abort();
    requestRef.current = null;
    setMessages([]);
    setDraft("");
    setPending(false);
    setError(null);
  }, [userId]);

  useEffect(
    () => () => {
      requestRef.current?.controller.abort();
      requestRef.current = null;
    },
    []
  );

  useEffect(() => {
    const conversation = conversationRef.current;
    if (open && conversation)
      conversation.scrollTop = conversation.scrollHeight;
  }, [open, messages, pending, error]);

  async function ask(questionText) {
    const question = questionText.trim().slice(0, 1000);
    if (!user || pending || requestRef.current || !question) return;

    const controller = new AbortController();
    const active = { controller, question };
    requestRef.current = active;
    setMessages((previous) => [
      ...previous,
      { role: "user", content: question },
    ]);
    setDraft("");
    setError(null);
    setPending(true);

    try {
      const { data } = await api.post(
        "/ai/ask",
        {
          message: question,
          history: messages.slice(-4).map(({ role, content }) => ({
            role,
            content: content.slice(0, 800),
          })),
          catalog,
          currentVideoId: currentVideo?.id || "",
        },
        { signal: controller.signal }
      );
      if (requestRef.current !== active) return;
      const reply = data.data?.reply;
      if (typeof reply !== "string" || !reply.trim())
        throw new Error("The assistant returned an empty reply.");
      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: reply.trim().slice(0, 10000) },
      ]);
    } catch (requestError) {
      if (requestRef.current !== active || controller.signal.aborted) return;
      const status = requestError.response?.status;
      setError({
        message:
          status === 503
            ? "Ask AI is getting ready. Please come back a little later."
            : status === 429
              ? "Ask AI needs a short break. Please wait a minute and try again."
              : status === 401
                ? "Your session has ended. Sign in again to keep chatting."
                : status === 502
                  ? "The AI service is unavailable for a moment. Please try again shortly."
                  : status === 504
                    ? "The AI service took too long to answer. Please try again."
                : getApiError(requestError),
        signIn: status === 401,
      });
      // Restore a failed question so it can be edited or retried.
      setMessages((previous) => previous.slice(0, -1));
      setDraft(question);
    } finally {
      if (requestRef.current === active) {
        requestRef.current = null;
        setPending(false);
      }
    }
  }

  function resetChat() {
    stopRequest();
    setMessages([]);
    setDraft("");
    setError(null);
  }

  function closeFromBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      onClose();
  }

  const prompts = [
    currentVideo
      ? "What does the description tell me about this listing?"
      : "Help me find something worth watching.",
    "Find a video about technology or learning.",
    "How do I save a video for later?",
    "Can I upload my own videos here?",
  ];

  return (
    <dialog
      ref={dialogRef}
      className="ask-ai-dialog"
      aria-labelledby="ask-ai-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={closeFromBackdrop}
    >
      <div className="ask-ai-panel">
        <header className="ask-ai-header">
          <span className="ask-ai-mark" aria-hidden="true">
            <Sparkles size={21} />
          </span>
          <div>
            <h2 id="ask-ai-title">Ask AI</h2>
            <p>A little help finding your next favorite.</p>
          </div>
          <div className="ask-ai-header-actions">
            {user && messages.length > 0 && (
              <button
                type="button"
                className="icon-button"
                aria-label="Start a new AI conversation"
                title="New conversation"
                onClick={resetChat}
              >
                <RotateCcw size={17} />
              </button>
            )}
            <button
              type="button"
              className="icon-button"
              aria-label="Close Ask AI"
              onClick={onClose}
            >
              <X size={21} />
            </button>
          </div>
        </header>

        {currentVideo && (
          <div className="ask-ai-context">
            <img src={currentVideo.image} alt="" />
            <div>
              <span>YOU’RE ASKING ABOUT A DEMO LISTING</span>
              <p>{currentVideo.title}</p>
            </div>
          </div>
        )}

        <div className="ask-ai-conversation" ref={conversationRef}>
          {authLoading ? (
            <p className="ask-ai-auth-loading" role="status">
              <LoaderCircle size={20} className="ask-ai-spinner" />
              Checking your session…
            </p>
          ) : !user ? (
            <div className="ask-ai-welcome ask-ai-sign-in">
              <span className="ask-ai-welcome-icon">
                <LockKeyhole size={28} />
              </span>
              <span className="ask-ai-eyebrow">A LITTLE CURIOSITY, A LITTLE AI</span>
              <h3>Good questions.<br />Better discoveries.</h3>
              <p>
                Sign in to find videos, ask about a listing, or get a hand
                around StreamTube.
              </p>
              <Link
                to={loginUrl}
                className="button button-primary"
                onClick={onClose}
              >
                Sign in to ask <ArrowUpRight size={17} />
              </Link>
              <p className="ask-ai-small-note">
                No transcripts are available. AI uses demo titles and
                descriptions, not the video footage.
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="ask-ai-welcome">
              <span className="ask-ai-welcome-icon">
                <Sparkles size={29} />
              </span>
              <span className="ask-ai-eyebrow">FOLLOW YOUR CURIOSITY</span>
              <h3>What’s on your mind?</h3>
              <p>
                Find something to watch, ask about this listing, or learn your
                way around StreamTube.
              </p>
              <div className="ask-ai-prompts" aria-label="Suggested questions">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => ask(prompt)}
                    disabled={pending}
                  >
                    {prompt} <ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
              <p className="ask-ai-small-note">
                Demo listings have no transcripts. I use titles and
                descriptions and can’t watch the footage.
              </p>
            </div>
          ) : (
            <div className="ask-ai-messages" role="log" aria-label="AI conversation" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`ask-ai-message ask-ai-message-${message.role}`}
                >
                  <span className="ask-ai-message-label">
                    {message.role === "assistant" && <Sparkles size={13} />}
                    {message.role === "assistant" ? "StreamTube AI" : "You"}
                  </span>
                  <p>{message.content}</p>
                  {message.role === "assistant" &&
                    recommendedVideos(message.content).map((video) => (
                      <Link
                        key={video.id}
                        className="ask-ai-video"
                        to={`/watch/${encodeURIComponent(video.id)}`}
                        onClick={onClose}
                      >
                        <img src={video.image} alt="" loading="lazy" />
                        <span>
                          <strong>{video.title}</strong>
                          <small>{video.creator} · {video.category}</small>
                        </span>
                        <ArrowUpRight size={16} />
                      </Link>
                    ))}
                </div>
              ))}
            </div>
          )}
          {pending && (
            <div className="ask-ai-thinking" role="status">
              <LoaderCircle size={16} className="ask-ai-spinner" />
              Thinking about your question…
            </div>
          )}
          {error && (
            <div className="ask-ai-error" role="alert">
              <CircleAlert size={17} />
              <div>
                <p>{error.message}</p>
                {error.signIn && (
                  <Link to={loginUrl} onClick={onClose}>Sign in again</Link>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="ask-ai-bottom">
          <nav className="ask-ai-shortcuts" aria-label="Explore StreamTube">
            <Link to="/?view=explore" onClick={onClose}>
              <Compass size={14} /> Explore
            </Link>
            <Link to="/library/saved" onClick={onClose}>
              <Bookmark size={14} /> Watch later
            </Link>
          </nav>
          {user && (
            <>
              <form
                className="ask-ai-composer"
                onSubmit={(event) => {
                  event.preventDefault();
                  ask(draft);
                }}
              >
                <label className="sr-only" htmlFor="ask-ai-question">
                  Your question for Ask AI
                </label>
                <textarea
                  id="ask-ai-question"
                  placeholder="Ask about a video or StreamTube…"
                  rows={2}
                  maxLength={1000}
                  value={draft}
                  autoFocus
                  disabled={pending}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                      event.preventDefault();
                      ask(draft);
                    }
                  }}
                />
                <div className="ask-ai-composer-bottom">
                  <span>{draft.length}/1,000 · Shift+Enter for a new line</span>
                  <button
                    type="submit"
                    aria-label="Send question"
                    disabled={pending || !draft.trim()}
                  >
                    {pending ? <LoaderCircle size={18} className="ask-ai-spinner" /> : <ArrowUp size={19} />}
                  </button>
                </div>
              </form>
              <p className="ask-ai-disclosure">
                Messages and listing details are sent to Google Gemini. Account
                details aren’t added to prompts. AI can make mistakes.
              </p>
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
