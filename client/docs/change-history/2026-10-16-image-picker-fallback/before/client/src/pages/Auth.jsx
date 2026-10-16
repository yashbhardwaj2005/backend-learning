import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  Play,
  ShieldCheck,
} from "lucide-react";
import { authApi, getApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Brand } from "../components/Layout";
import CreatorCredit from "../components/CreatorCredit";
import ThemeToggle from "../components/ThemeToggle";

export default function Auth({ register = false }) {
  const { user, loading, login } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const nextPage =
    location.state?.from || new URLSearchParams(location.search).get("next");
  const redirect =
    typeof nextPage === "string" &&
    nextPage.startsWith("/") &&
    !nextPage.startsWith("//")
      ? nextPage
      : "/profile";

  useEffect(() => {
    if (!avatar) {
      setAvatarUrl("");
      return;
    }
    const url = URL.createObjectURL(avatar);
    setAvatarUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  if (user && !loading) return <Navigate to={redirect} replace />;

  function chooseAvatar(event) {
    const file = event.target.files?.[0];
    // Canceling the picker keeps the previous choice in browsers that support it.
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an avatar image (JPG, PNG, WebP, etc.) up to 5 MB.");
      setAvatar(null);
      event.target.value = "";
      return;
    }
    setError("");
    setAvatar(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
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
    const cover = fields.get("coverImage");
    if (
      register &&
      cover?.size &&
      (!cover.type.startsWith("image/") || cover.size > 5 * 1024 * 1024)
    ) {
      setError("Choose a cover image smaller than 5 MB.");
      return;
    }
    if (register && !cover?.size) fields.delete("coverImage");
    setBusy(true);
    try {
      if (register) {
        // Use exactly the multipart field names expected by Multer/controller.
        fields.set("username", fields.get("username").trim().toLowerCase());
        fields.set("email", fields.get("email").trim().toLowerCase());
        fields.set("fullName", fields.get("fullName").trim());
        fields.set("avatar", avatar);
        await authApi.register(fields);
        // Registration creates the account but does not set login cookies.
        navigate("/login", {
          replace: true,
          state: { registered: true, from: redirect },
        });
      } else {
        await login(fields.get("identifier"), fields.get("password"));
        navigate(redirect, { replace: true });
      }
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
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
          <form className="auth-form" onSubmit={handleSubmit}>
            {register && (
              <>
                <div className="avatar-upload">
                  <span className="avatar-upload-circle">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar preview" />
                    ) : (
                      <ImagePlus size={25} />
                    )}
                  </span>
                  <label className="avatar-file-label" htmlFor="register-avatar">
                    <strong>Profile photo <span aria-hidden="true">*</span></strong>
                    <small id="avatar-help">Required · Image up to 5 MB</small>
                    <input
                      id="register-avatar"
                      type="file"
                      name="avatar"
                      accept="image/*"
                      required
                      aria-describedby="avatar-help"
                      onChange={chooseAvatar}
                    />
                  </label>
                </div>
                <label className="registration-cover-picker">
                  Cover image{" "}
                  <span className="field-hint">
                    Optional · Image up to 5 MB
                  </span>
                  <input name="coverImage" type="file" accept="image/*" />
                </label>
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
              disabled={busy}
            >
              {busy ? (
                <>
                  <LoaderCircle className="spin" size={18} />
                  {register ? "Creating your account…" : "Signing you in…"}
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
