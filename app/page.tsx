"use client";

import { useState, useCallback } from "react";

const SIDES = [4, 6, 8, 10, 12, 20] as const;
type Sides = (typeof SIDES)[number];

const TILE_COLORS = [
  "#e74c3c", "#e67e22", "#f1c40f", "#2ecc71",
  "#1abc9c", "#3498db", "#9b59b6", "#e91e63",
  "#ff5722", "#00bcd4",
];

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

interface DieResult {
  value: number;
  color: string;
}

export default function DiceRoller() {
  const [numDice, setNumDice] = useState(2);
  const [sides, setSides] = useState<Sides>(6);
  const [results, setResults] = useState<DieResult[]>([]);
  const [rolling, setRolling] = useState(false);
  const [animFrame, setAnimFrame] = useState(0);

  const roll = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    setResults([]);

    let ticks = 0;
    const maxTicks = 12;
    const interval = setInterval(() => {
      ticks++;
      setAnimFrame(ticks);
      // Show random scrambled values during animation
      setResults(
        Array.from({ length: numDice }, (_, i) => ({
          value: rollDie(sides),
          color: TILE_COLORS[i % TILE_COLORS.length],
        }))
      );
      if (ticks >= maxTicks) {
        clearInterval(interval);
        // Final settled values
        setResults(
          Array.from({ length: numDice }, (_, i) => ({
            value: rollDie(sides),
            color: TILE_COLORS[i % TILE_COLORS.length],
          }))
        );
        setRolling(false);
        setAnimFrame(0);
      }
    }, 60);
  }, [rolling, numDice, sides]);

  const total = results.reduce((sum, r) => sum + r.value, 0);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Dice Roller</h1>

      {/* Controls */}
      <div style={styles.controls}>
        <label style={styles.label}>
          Number of dice
          <select
            value={numDice}
            onChange={(e) => setNumDice(Number(e.target.value))}
            style={styles.select}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Die type
          <div style={styles.dieButtons}>
            {SIDES.map((s) => (
              <button
                key={s}
                onClick={() => setSides(s)}
                style={{
                  ...styles.dieButton,
                  ...(sides === s ? styles.dieButtonActive : {}),
                }}
              >
                d{s}
              </button>
            ))}
          </div>
        </label>
      </div>

      {/* Roll button */}
      <button
        onClick={roll}
        disabled={rolling}
        style={{
          ...styles.rollButton,
          ...(rolling ? styles.rollButtonDisabled : {}),
        }}
      >
        {rolling ? "Rolling…" : "Roll!"}
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div style={styles.resultsArea}>
          <div style={styles.tileGrid}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  ...styles.tile,
                  background: r.color,
                  transform: rolling ? `rotate(${((animFrame + i) % 3 - 1) * 8}deg) scale(0.95)` : "rotate(0deg) scale(1)",
                  transition: rolling ? "transform 0.06s ease" : "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                <span style={styles.tileValue}>{r.value}</span>
                <span style={styles.tileSides}>d{sides}</span>
              </div>
            ))}
          </div>

          {!rolling && (
            <div style={styles.total}>
              Total: <strong>{total}</strong>
              {numDice > 1 && (
                <span style={styles.totalSub}>
                  {" "}({numDice}d{sides})
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0f0f13",
    color: "#e2e2e2",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 20px",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 700,
    marginBottom: "2rem",
    letterSpacing: "-0.02em",
    color: "#ffffff",
  },
  controls: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "500px",
    marginBottom: "2rem",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.95rem",
    color: "#a0a0b0",
    fontWeight: 500,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
  select: {
    background: "#1e1e2e",
    color: "#e2e2e2",
    border: "1px solid #3a3a52",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "1.1rem",
    cursor: "pointer",
    outline: "none",
  },
  dieButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  dieButton: {
    background: "#1e1e2e",
    color: "#a0a0b0",
    border: "1px solid #3a3a52",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  dieButtonActive: {
    background: "#5b4ae8",
    color: "#ffffff",
    border: "1px solid #7b6cf8",
  },
  rollButton: {
    background: "linear-gradient(135deg, #5b4ae8, #8b5cf6)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "16px 48px",
    fontSize: "1.3rem",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.04em",
    boxShadow: "0 4px 24px rgba(91,74,232,0.4)",
    transition: "transform 0.1s, box-shadow 0.1s",
    marginBottom: "2.5rem",
  },
  rollButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
  resultsArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "700px",
  },
  tileGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    justifyContent: "center",
  },
  tile: {
    width: "90px",
    height: "90px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 18px rgba(0,0,0,0.5)",
    userSelect: "none",
  },
  tileValue: {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#ffffff",
    lineHeight: 1,
    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
  },
  tileSides: {
    fontSize: "0.75rem",
    color: "rgba(255,255,255,0.7)",
    fontWeight: 600,
    marginTop: "2px",
  },
  total: {
    fontSize: "1.6rem",
    color: "#e2e2e2",
    background: "#1e1e2e",
    border: "1px solid #3a3a52",
    borderRadius: "12px",
    padding: "12px 32px",
  },
  totalSub: {
    fontSize: "1rem",
    color: "#6a6a8a",
    fontWeight: 400,
  },
};
