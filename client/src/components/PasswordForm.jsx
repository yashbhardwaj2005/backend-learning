import { useState } from "react";
import { Check, KeyRound, LoaderCircle } from "lucide-react";
import { authApi, getApiError } from "../api/client";

export default function PasswordForm() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function changePassword(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    setError("");
    setSuccess("");
    if (fields.get("newPassword") !== fields.get("confirmPassword")) {
      setError("Your new passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await authApi.changePassword({
        oldPassword: fields.get("oldPassword"),
        newPassword: fields.get("newPassword"),
      });
      form.reset();
      setSuccess(
        "Password updated. Use your new password the next time you sign in."
      );
    } catch (requestError) {
      setError(getApiError(requestError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel account-panel">
      <div className="panel-heading">
        <h2>Password & security</h2>
        <KeyRound size={19} />
      </div>
      <p className="security-intro">
        Choose a new password using your current one.
      </p>
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="form-message success" role="status">
          <Check size={16} />
          {success}
        </p>
      )}
      <form className="auth-form" onSubmit={changePassword}>
        <label>
          Current password
          <input
            name="oldPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <label>
          New password
          <input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
          />
        </label>
        <label>
          Confirm new password
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
          />
        </label>
        <button className="button button-primary" disabled={busy}>
          {busy ? (
            <>
              <LoaderCircle size={16} className="spin" />
              Updating…
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </section>
  );
}
