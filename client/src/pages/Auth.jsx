import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LoaderCircle,
  Play,
  ShieldCheck,
} from "lucide-react";
import { authApi, getApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Brand } from "../components/Layout";
import CreatorCredit from "../components/CreatorCredit";
import ThemeToggle from "../components/ThemeToggle";
import ImagePicker from "../components/ImagePicker";

export default function Auth({ register = false }) {
  const { user, loading, connecting, login } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [waitingForServer, setWaitingForServer] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const serverStarting = connecting || waitingForServer;
  const nextPage =
    location.state?.from || new URLSearchParams(location.search).get("next");
  const redirect =
    typeof nextPage === "string" &&
    nextPage.startsWith("/") &&
    !nextPage.startsWith("//")
      ? nextPage
      : "/profile";

  if (user && !loading) return <Navigate to={redirect} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy || loading) return;
    setError("");
    const fields = new FormData(event.currentTarget);
    if (
      register &&
      (!avatar ||
        !avatar.type.startsWith("image/") ||
        avatar.size > 5 * 1024 * 1024)
    ) {
      setError("Please choose an avatar image smaller than 5 MB.");
      return;
    }
    const cover = coverImage;
    if (
      register &&
      cover?.size &&
      (!cover.type.startsWith("image/") || cover.size > 5 * 1024 * 1024)
    ) {
      setError("Choose a cover image smaller than 5 MB.");
      return;
    }
    setBusy(true);
    try {
      if (register) {
        // Use exactly the multipart field names expected by Multer/controller.
        fields.set("username", fields.get("username").trim().toLowerCase());
        fields.set("email", fields.get("email").trim().toLowerCase());
        fields.set("fullName", fields.get("fullName").trim());
        fields.set("avatar", avatar);
        if (coverImage) fields.set("coverImage", coverImage);
        await authApi.register(fields, setWaitingForServer);
        // Registration creates the account but does not set login cookies.
        navigate("/login", {
          replace: true,
          state: { registered: true, from: redirect },
        });
      } else {
        await login(
          fields.get("identifier"),
          fields.get("password"),
          setWaitingForServer
        );
        navigate(redirect, { replace: true });
      }
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setBusy(false);
      setWaitingForServer(false);
    }
  }

  return (
    <div className={`auth-page ${register ? "auth-register" : ""}`}>
      <section className="auth-visual">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=90"
          alt=""
        />
        <div className="auth-visual-shade" />
        <Brand />
        <div className="auth-visual-copy">
          <span className="hero-tag">
            <span /> A WORLD WORTH WATCHING
          </span>
          <h1>
            A little curiosity.
            <br />
            Endless possibilities.
          </h1>
          <p>
            Discover your people, find your inspiration,
            <br />
            and get lost in something good.
          </p>
          <div className="auth-visual-footer">
            <span>
              <Play size={15} fill="currentColor" />
            </span>{" "}
            Your next favorite thing is waiting.
          </div>
        </div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-topbar">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to exploring
          </Link>
          <ThemeToggle />
        </div>
        <div className="auth-form-content">
          <p className="eyebrow">
            {register ? "MAKE YOURSELF AT HOME" : "GOOD TO SEE YOU AGAIN"}
          </p>
          <h1>
            {register ? "Find your people." : "Welcome back."}
            <span className="text-accent">✳</span>
          </h1>
          <p className="auth-intro">
            {register
              ? "A new account. A whole world of possibility."
              : "Pick up where your curiosity left off."}
          </p>
          {!register && location.state?.registered && (
            <div className="form-message success" role="status">
              <Check size={16} /> Your account is ready. Sign in to get started.
            </div>
          )}
          {error && (
            <div className="form-message error" role="alert">
              {error}
            </div>
          )}
          {serverStarting && (
            <div className="form-message info" role="status" aria-live="polite">
              <LoaderCircle className="spin" size={16} />
              Connecting to the server. It may take up to two minutes to wake
              up. Your form will stay here while you wait.
            </div>
          )}
          <form className="auth-form" onSubmit={handleSubmit}>
            {register && (
              <>
                <div className="registration-images">
                  <ImagePicker id="register-avatar" label="Avatar" required file={avatar} onChange={setAvatar} onError={setError} />
                  <ImagePicker id="register-cover" label="Cover image" wide file={coverImage} onChange={setCoverImage} onError={setError} />
                </div>
                <label>
                  Full name
                  <input
                    name="fullName"
                    placeholder="What should we call you?"
                    autoComplete="name"
                    required
                    maxLength={100}
                  />
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label>
                    Username
                    <input
                      name="username"
                      placeholder="yourname"
                      autoComplete="username"
                      pattern="[A-Za-z0-9_]{3,30}"
                      title="3–30 letters, numbers or underscores"
                      required
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>
              </>
            )}
            {!register && (
              <label>
                Email or username
                <input
                  name="identifier"
                  placeholder="you@example.com"
                  autoComplete="username"
                  required
                  autoFocus
                />
              </label>
            )}
            <label>
              Password
              <span className="password-field">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    register
                      ? "Create a strong password"
                      : "Enter your password"
                  }
                  autoComplete={register ? "new-password" : "current-password"}
                  required
                  minLength={register ? 8 : undefined}
                  maxLength={72}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
              {register && (
                <small className="field-hint">Use 8–72 characters.</small>
              )}
            </label>
            <button
              className="button button-primary auth-submit"
              disabled={busy || loading}
            >
              {busy || loading ? (
                <>
                  <LoaderCircle className="spin" size={18} />
                  {serverStarting
                    ? "Connecting to server…"
                    : loading
                      ? "Checking your session…"
                      : register
                        ? "Creating your account…"
                        : "Signing you in…"}
                </>
              ) : (
                <>
                  {register ? "Create your account" : "Let’s get you in"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <p className="auth-switch">
            {register ? "Already part of the story?" : "New around here?"}{" "}
            <Link
              to={register ? "/login" : "/register"}
              state={{ from: redirect }}
            >
              {register ? "Sign in" : "Join StreamTube"} <ArrowUpRightIcon />
            </Link>
          </p>
          <div className="auth-security">
            <ShieldCheck size={16} /> Your session is protected with secure,
            HTTP-only cookies.
          </div>
        </div>
        <CreatorCredit compact />
      </section>
    </div>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight size={13} className="arrow-diagonal" />;
}
