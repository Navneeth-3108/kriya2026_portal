import { useEffect, useRef } from "react";

// ─── PirateHeader ─────────────────────────────────────────────────────────────
export default function PirateHeader({
  lives,
  bounty,
  shiver,
  spinning,
  maxLives = 3,
}) {
  const skullRefs = useRef([]);

  useEffect(() => {
    if (shiver && lives >= 0 && lives < maxLives) {
      const el = skullRefs.current[lives];
      if (el) {
        el.classList.remove("shivering");
        void el.offsetWidth; // force reflow
        el.classList.add("shivering");
        el.addEventListener(
          "animationend",
          () => el.classList.remove("shivering"),
          { once: true },
        );
      }
    }
  }, [shiver, lives, maxLives]);

  return (
    <header className="pirate-header">
      {/* ── Left: Lives ─────────────────────── */}
      <div
        className="lives-container"
        role="group"
        aria-label="Lives remaining"
      >
        <span className="lives-label">Lives</span>
        {Array.from({ length: maxLives }).map((_, i) => (
          <span
            key={i}
            ref={(el) => (skullRefs.current[i] = el)}
            className={`skull-icon ${i < lives ? "alive" : "lost"}`}
            title={i < lives ? "Life remaining" : "Life lost"}
            role="img"
            aria-label={i < lives ? "Life" : "Lost life"}
          >
            ☠
          </span>
        ))}
      </div>


      {/* ── Right: Bounty ───────────────────── */}
      <div
        className="bounty-counter"
        aria-label={`Bounty: ${bounty} doubloons`}
      >
        <span className="coin-icon" aria-hidden="true">
          🪙
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "1px",
          }}
        >
          <span className="bounty-label">Bounty</span>
          <span className={`bounty-value${spinning ? " spinning" : ""}`}>
            {bounty.toLocaleString()}
          </span>
        </div>
        <span className="bounty-units">pts</span>
      </div>
    </header>
  );
}
