export default function CreatorCredit({ compact = false }) {
  return (
    <footer
      className={`creator-credit ${compact ? "creator-credit-compact" : ""}`}
    >
      <span>
        StreamTube<sup>™</sup>
      </span>
      <span className="credit-divider" aria-hidden="true">
        ·
      </span>
      <span>
        Created by <strong>@Yash</strong>
      </span>
    </footer>
  );
}
