import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Mail,
  ShieldCheck,
  UserRound,
  Video,
} from "lucide-react";
import { authApi, getApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Avatar, VideoSkeletons } from "../components/VideoCard";
import { EmptyState } from "../components/Layout";
import PasswordForm from "../components/PasswordForm";

export default function Profile() {
  const { user, loading, updateUser, logout } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState(false);
  const [channel, setChannel] = useState(null);
  const [channelError, setChannelError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Your space — StreamTube";
  }, []);

  useEffect(() => {
    if (!user?.username) {
      setChannel(null);
      return;
    }
    let active = true;
    setChannelError("");
    authApi
      .channel(user.username)
      .then(({ data }) => {
        if (active) setChannel(data.data);
      })
      .catch((requestError) => {
        if (active) setChannelError(getApiError(requestError));
      });
    return () => {
      active = false;
    };
  }, [user?.username]);

  if (loading)
    return (
      <div className="page-container">
        <VideoSkeletons />
      </div>
    );
  if (!user)
    return (
      <EmptyState
        icon={UserRound}
        title="A little space, just for you."
        action="Sign in to your account"
        to={`/login?next=${encodeURIComponent(location.pathname)}`}
      >
        Sign in to see your real account details and make yourself at home.
      </EmptyState>
    );

  async function saveAccount(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const { data } = await authApi.updateAccount({
        fullName: form.get("fullName").trim(),
        email: form.get("email").trim().toLowerCase(),
      });
      updateUser(data.data);
      setSuccess("Your account details have been updated.");
      setEdit(false);
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setBusy(false);
    }
  }

  async function changeImage(event, field) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }
    setError("");
    setSuccess("");
    setBusy(true);
    const form = new FormData();
    form.append(field, file);
    try {
      const { data } =
        field === "avatar"
          ? await authApi.updateAvatar(form)
          : await authApi.updateCover(form);
      updateUser(data.data);
      setSuccess(
        field === "avatar"
          ? "New photo. Same you. Your avatar is updated."
          : "Your channel cover is updated."
      );
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setBusy(false);
      input.value = "";
    }
  }

  async function signOut() {
    setBusy(true);
    setError("");
    try {
      await logout();
      navigate("/");
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-container profile-page">
      <div className="profile-cover">
        {user.coverImage && (
          <img src={user.coverImage} alt="Your channel cover" />
        )}
        <span className="cover-wordmark">A space to be you.</span>
        <span className="cover-star">✳</span>
        <label className="cover-upload-button">
          <ImagePlus size={16} />
          Change cover
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            aria-label="Change cover image"
            disabled={busy}
            onChange={(event) => changeImage(event, "coverImage")}
          />
        </label>
      </div>
      <div className="profile-overview">
        <div className="profile-identity">
          <label className="profile-avatar-upload" title="Change avatar">
            <Avatar user={user} size="profile-avatar" />
            <span>
              <ImagePlus size={17} />
            </span>
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              aria-label="Change your avatar"
              disabled={busy}
              onChange={(event) => changeImage(event, "avatar")}
            />
          </label>
          <div>
            <p className="eyebrow">YOUR OWN LITTLE CORNER</p>
            <h1>{user.fullName}</h1>
            <p>@{user.username}</p>
            {channel && (
              <div className="channel-stats">
                <span>
                  <strong>{channel.subscribersCount}</strong> subscribers
                </span>
                <span>
                  <strong>{channel.channelsSubscribedToCount}</strong>{" "}
                  subscriptions
                </span>
              </div>
            )}
          </div>
        </div>
        <Link to="/upload" className="button button-primary">
          Create something <ArrowUpRight size={17} />
        </Link>
      </div>
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      {channelError && (
        <p className="form-message error" role="alert">
          Channel profile: {channelError}
        </p>
      )}
      {success && (
        <p className="form-message success" role="status">
          <Check size={16} />
          {success}
        </p>
      )}
      <div className="profile-layout">
        <div className="space-y-5">
          <section className="panel account-panel">
            <div className="panel-heading">
              <h2>Account details</h2>
              <ShieldCheck size={19} />
            </div>
            {edit ? (
              <form className="auth-form" onSubmit={saveAccount}>
                <label>
                  Full name
                  <input
                    name="fullName"
                    defaultValue={user.fullName}
                    required
                    maxLength={100}
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    required
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <button className="button button-primary" disabled={busy}>
                    {busy ? (
                      <LoaderCircle className="spin" size={17} />
                    ) : (
                      "Save changes"
                    )}
                  </button>
                  <button
                    type="button"
                    className="button button-subtle"
                    onClick={() => setEdit(false)}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="account-detail">
                  <UserRound size={18} />
                  <div>
                    <span>Username</span>
                    <strong>@{user.username}</strong>
                  </div>
                </div>
                <div className="account-detail">
                  <Mail size={18} />
                  <div>
                    <span>Email address</span>
                    <strong>{user.email}</strong>
                  </div>
                </div>
                <button
                  className="button button-subtle full-width"
                  onClick={() => setEdit(true)}
                  disabled={busy}
                >
                  Edit account details
                </button>
              </>
            )}
            <button className="logout-button" onClick={signOut} disabled={busy}>
              <LogOut size={16} />
              {busy ? "Please wait…" : "Sign out"}
            </button>
          </section>
          <PasswordForm />
        </div>
        <section className="panel profile-videos">
          <div className="panel-heading">
            <h2>Your videos</h2>
            <span className="small-tag">Coming soon</span>
          </div>
          <EmptyState
            icon={Video}
            title="Your next chapter starts here."
            action="Explore the upload studio"
            to="/upload"
          >
            Your profile is connected to the backend. Your videos will appear
            when the video APIs are ready.
          </EmptyState>
        </section>
      </div>
    </div>
  );
}
