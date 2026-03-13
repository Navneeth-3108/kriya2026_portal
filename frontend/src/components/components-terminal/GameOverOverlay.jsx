// ─── GameOverOverlay ──────────────────────────────────────────────────────────
export default function GameOverOverlay({ onRestart }) {
  return (
    <div
      className="game-over-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="gameover-title"
      aria-describedby="gameover-desc"
    >
      {/* Animated skulls */}
      <div className="game-over-skulls" aria-hidden="true">
        ☠ ☠ ☠
      </div>

      <h2 id="gameover-title" className="game-over-title">
        ⚓ Shipwrecked! ⚓
      </h2>

      <p id="gameover-desc" className="game-over-subtitle">
        Ye've run out of lives, ye scurvy sailor.
        <br />
        The Kraken claims yer code — start anew,
        <br />
        brave pirate, for the treasure still awaits.
      </p>

      <div className="game-over-divider" aria-hidden="true" />

      <button
        id="restart-btn"
        className="btn-restart"
        onClick={onRestart}
        autoFocus
        aria-label="Start over — restore all lives and clear code"
      >
        🏴‍☠️ &nbsp; Sail Again, Captain!
      </button>

      <p className="game-over-epigraph">
        "A smooth sea never made a skilled pirate."
      </p>
    </div>
  );
}
