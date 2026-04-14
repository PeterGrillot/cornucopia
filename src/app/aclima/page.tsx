"use client";
// ============================================================
// ACLIMA FRONTEND ENGINEERING LEAD — REACT CHALLENGE
// ============================================================
// Time: ~60–90 minutes  |  Stack: React + TypeScript (simulated)
// Topic: Hyperlocal Air Quality Dashboard
// ============================================================

import { useState, useEffect, useMemo, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// MOCK DATA  (in a real interview, this might come from an API)
// ─────────────────────────────────────────────────────────────

const POLLUTANTS = ["NO2", "PM2.5", "CO", "O3"];
type Block = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  readings: {};
};

type Blocks = Block[];

const BLOCKS: Blocks = Array.from({ length: 30 }, (_, i) => ({
  id: `block-${i + 1}`,
  label: `Block ${i + 1}`,
  lat: 37.77 + (Math.random() - 0.5) * 0.04,
  lng: -122.41 + (Math.random() - 0.5) * 0.06,
  readings: POLLUTANTS.reduce((acc, p) => {
    acc[p] = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      value: Math.round(20 + Math.random() * 80 + (h >= 7 && h <= 9 ? 40 : 0)),
    }));
    return acc;
  }, {}),
}));

type AirQuality = Array<{ hour: number; value: number }>;

// ─────────────────────────────────────────────────────────────
// PART 1 — useAirQuality hook
// ─────────────────────────────────────────────────────────────
// TODO: Implement this custom hook.
//
// It should:
//   1. Accept { pollutant, hour } as parameters
//   2. Return { data, loading, error }
//      - data: array of { id, label, lat, lng, value } for all blocks
//        at the given pollutant and hour
//   3. Simulate an async fetch (setTimeout 400ms) so loading state is visible
//   4. Re-fetch whenever pollutant or hour changes
//   5. Bonus: cancel in-flight "requests" on cleanup to avoid race conditions
//
// NOTE: Do NOT just compute synchronously. The loading state must be real.

function useAirQuality({
  pollutant,
  hour,
}: {
  pollutant: keyof Block["readings"];
  hour: number;
}): AirQuality {
  let loading = true;
  let data = [];
  data = BLOCKS.reduce((acc, item) => {
    acc.push(item.readings[pollutant][hour]);
    return acc;
  }, []);
  loading = false;

  return { data, loading, error: null };
}

// ─────────────────────────────────────────────────────────────
// PART 2 — getAQIColor(value)
// ─────────────────────────────────────────────────────────────
// TODO: Implement a pure function that maps a sensor value (0–100+)
// to a color string using this scale:
//
//   0–25   → green  (#4ade80)
//   26–50  → yellow (#facc15)
//   51–75  → orange (#f97316)
//   76–100 → red    (#ef4444)
//   >100   → purple (#a855f7)  (hazardous)
//
// Must be a PURE function — no side effects, no state.

function getAQIColor(value: number) {
  switch (true) {
    case value <= 25:
      return "#4ade80";
    case value <= 50:
      return "#facc15";
    case value <= 75:
      return "#f97316";
    case value <= 100:
      return "#ef4444";
    case value > 100:
      return "#a855f7";
    default:
      return "#cccccc";
  }
}

// ─────────────────────────────────────────────────────────────
// PART 3 — BlockGrid component
// ─────────────────────────────────────────────────────────────
// TODO: Build a component that:
//   1. Renders each block as a colored square (use getAQIColor)
//   2. Shows the block label and value on hover (tooltip or inline)
//   3. Highlights the currently selected block
//   4. Calls onSelect(block) when a block is clicked
//   5. Shows a skeleton loader while loading === true
//   6. PERFORMANCE: The grid has up to 1000 blocks in production.
//      Explain (in a comment) how you would optimize this for scale.

function BlockGrid({
  data,
  loading,
  selectedId,
  onSelect,
}: {
  data: AirQuality;
  loading: boolean;
  selectedId: number;
  onSelect: (e: any) => void;
}) {
  const handleClick = (e) => {
    onSelect(e);
  };
  return data.map((block) => (
    <button onClick={handleClick} style={{ background: getAQIColor(block.value) }}>
      Level: {block.value}
    </button>
  ));
}

// ─────────────────────────────────────────────────────────────
// PART 4 — TimeSeriesChart component
// ─────────────────────────────────────────────────────────────
// TODO: Build a simple 24-hour time-series chart for a selected block.
//   - X axis: hours 0–23
//   - Y axis: pollutant value
//   - Use SVG or Canvas (no external charting library)
//   - Show a vertical line at the currently selected hour
//   - Hovering over the chart should update the selected hour (call onHourChange)
//   - Bonus: Animate the line when selectedHour changes

function TimeSeriesChart({ block, pollutant, selectedHour, onHourChange }) {
  if (!block) return <p style={{ color: "#666" }}>Select a block to see its time series.</p>;
  // ← your implementation here
  return <div>TimeSeriesChart not yet implemented</div>;
}

// ─────────────────────────────────────────────────────────────
// PART 5 — AverageStats component
// ─────────────────────────────────────────────────────────────
// TODO: Given the full `data` array, compute and display:
//   - Mean value across all blocks for the current hour
//   - The block with the highest reading (name + value)
//   - The block with the lowest reading (name + value)
//
// REQUIREMENT: Use useMemo — stats must NOT be recomputed on every render
// unless `data` actually changes.

function AverageStats({ data }) {
  // ← your implementation here
  return <div>AverageStats not yet implemented</div>;
}

// ─────────────────────────────────────────────────────────────
// APP SHELL — already wired up, do not modify
// ─────────────────────────────────────────────────────────────

export default function AclimaDashboard() {
  const [pollutant, setPollutant] = useState("NO2");
  const [hour, setHour] = useState(8);
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  const { data, loading, error } = useAirQuality({ pollutant, hour });

  const selectedBlock = useMemo(
    () => BLOCKS.find((b) => b.id === selectedBlockId) ?? null,
    [selectedBlockId]
  );

  console.log(data, loading);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>🌍 Aclima Air Quality Explorer</h1>
        <div style={styles.controls}>
          <label style={styles.label}>
            Pollutant&nbsp;
            <select
              value={pollutant}
              onChange={(e) => setPollutant(e.target.value)}
              style={styles.select}
            >
              {POLLUTANTS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label style={styles.label}>
            Hour: {String(hour).padStart(2, "0")}:00&nbsp;
            <input
              type="range"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              style={styles.slider}
            />
          </label>
        </div>
      </header>

      {error && <div style={styles.error}>Error: {error}</div>}

      <AverageStats data={data} />

      <div style={styles.main}>
        <BlockGrid
          data={data}
          loading={loading}
          selectedId={selectedBlockId}
          onSelect={(block) => setSelectedBlockId(block.id)}
        />
        <aside style={styles.aside}>
          <TimeSeriesChart
            block={selectedBlock}
            pollutant={pollutant}
            selectedHour={hour}
            onHourChange={setHour}
          />
        </aside>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BONUS QUESTIONS (answer as comments at the bottom of the file)
// ─────────────────────────────────────────────────────────────
//
// Q1. The grid needs to render 5,000 blocks with live updates every
//     30 seconds. Describe your optimization strategy.
//
// Q2. The TimeSeriesChart is embedded in a dashboard that re-renders
//     frequently. How would you prevent unnecessary re-renders?
//
// Q3. Aclima's data pipeline produces readings for 50+ pollutants
//     across 10,000 blocks. How would you architect the data-fetching
//     layer (caching, pagination, cancellation)?
//
// Q4. A colleague opens a PR adding a 200-line useEffect with no
//     cleanup and three setState calls inside it. How do you approach
//     this in code review?

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

const styles = {
  app: {
    fontFamily: "system-ui, sans-serif",
    maxWidth: 1100,
    margin: "0 auto",
    padding: 24,
    background: "#0f172a",
    minHeight: "100vh",
    color: "#e2e8f0",
  },
  header: { marginBottom: 24 },
  title: {
    fontSize: 22,
    fontWeight: 700,
    margin: "0 0 16px",
    color: "#38bdf8",
  },
  controls: { display: "flex", gap: 32, "flex-wrap": "wrap" },
  label: { fontSize: 14, display: "flex", alignItems: "center", gap: 8 },
  select: {
    background: "#1e293b",
    color: "#e2e8f0",
    border: "1px solid #334155",
    borderRadius: 6,
    padding: "4px 8px",
  },
  slider: { accentColor: "#38bdf8", width: 140 },
  main: {
    display: "grid",
    gridTemplateColumns: "1fr 50%",
    gap: 24,
    marginTop: 24,
  },
  aside: { background: "#1e293b", borderRadius: 12, padding: 20 },
  error: {
    color: "#f87171",
    background: "#450a0a",
    padding: "10px 16px",
    borderRadius: 8,
    marginBottom: 16,
  },
};
