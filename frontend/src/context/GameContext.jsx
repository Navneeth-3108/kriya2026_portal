// src/context/GameContext.jsx
import { createContext, useContext, useMemo, useRef, useState, useEffect } from "react";

const GameContext = createContext(null);

const seaNames = [
  "Black Sea (Ammand the Corsair)",
  "Caspian Sea (Hector Barbossa)",
  "Mediterranean Sea (Chevalle)",
  "Pacific Ocean (Mistress Ching)",
  "Atlantic Ocean (Gentleman Jocard)",
  "Caribbean Sea (Jack Sparrow)",
  "Indian Ocean (Sri Sumbhajee Angria)",
];

const slots = [
  { left: 12, top: 55 },
  { left: 28, top: 38 },
  { left: 50, top: 18 },
  { left: 70, top: 26 },
  { left: 86, top: 30 },
  { left: 83, top: 68 },
  { left: 58, top: 58 },
];

const STORAGE_KEY = "pirate_game_v1";

function loadSaved() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function GameProvider({ children }) {
  const saved = loadSaved();

  const [points, setPoints] = useState(() => Number(saved?.points ?? 0));
  const [opened, setOpened] = useState(() => {
    const arr = Array.isArray(saved?.opened) ? saved.opened : [];
    return new Set(arr.map((x) => Number(x)).filter((n) => Number.isFinite(n)));
  });
  const [cards, setCards] = useState(() =>
    Array.isArray(saved?.cards) ? saved.cards : []
  );

  const openedRef = useRef(opened);
  useEffect(() => { openedRef.current = opened; }, [opened]);

  useEffect(() => {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ points, opened: Array.from(opened), cards })
    );
  }, [points, opened, cards]);

  const chests = useMemo(() => {
    return seaNames.map((name, index) => {
      const id = index + 1;
      return { id, name, left: slots[index].left, top: slots[index].top, opened: opened.has(id) };
    });
  }, [opened]);

  const seasCleared = opened.size;

  const addCard = (card) => {
    if (!card) return;
    const key = String(card.id ?? card.name ?? "").trim();
    if (!key) return;

    setCards(prev => {
      const exists = prev.some(c => String(c.id ?? c.name) === key);
      return exists ? prev : [...prev, { ...card, id: key }];
    });
  };

  const markSeaOpened = (seaId, earnedPoints = 0, card = null) => {
    const sid = Number(seaId);
    const pts = Number(earnedPoints);

    if (!Number.isFinite(sid) || sid < 1 || sid > seaNames.length) return;
    if (openedRef.current.has(sid)) return;

    setOpened(prev => { const next = new Set(prev); next.add(sid); return next; });
    if (Number.isFinite(pts) && pts !== 0) setPoints(p => p + pts);
    addCard(card);
  };

  const resetGame = () => {
    setPoints(0);
    setOpened(new Set());
    setCards([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return <GameContext.Provider value={{ chests, points, seasCleared, cards, addCard, markSeaOpened, resetGame }}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}