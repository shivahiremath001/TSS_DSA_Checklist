import { useState, useEffect, useCallback, useRef } from "react";

interface SnakeGameModalProps {
  open: boolean;
  onClose: () => void;
}

const GRID_SIZE = 20;
const SPEED = 100; // ms per tick

type Point = { x: number; y: number };

export default function SnakeGameModal({ open, onClose }: SnakeGameModalProps) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Point>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Ref to track the current direction to avoid rapid reverse-direction deaths
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on snake
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setFood(generateFood([{ x: 10, y: 10 }]));
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!open) {
      setIsPlaying(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when playing
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (!isPlaying && !gameOver && e.key === " ") {
        setIsPlaying(true);
        return;
      }

      if (gameOver && e.key === " ") {
        resetGame();
        return;
      }

      const currDir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isPlaying, gameOver, resetGame]);

  const handleMobileControl = (dx: number, dy: number) => {
    if (!isPlaying && !gameOver) {
      setIsPlaying(true);
    }
    const currDir = directionRef.current;
    if (dx !== 0 && currDir.x === -dx) return;
    if (dy !== 0 && currDir.y === -dy) return;
    setDirection({ x: dx, y: dy });
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setHighScore((prev) => Math.max(prev, score));
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setHighScore((prev) => Math.max(prev, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, score, generateFood]);

  if (!open) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(2, 11, 24, 0.85)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: "1rem"
    }}>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--accent)",
        boxShadow: "0 0 20px var(--accent-glow)",
        padding: "2rem",
        maxWidth: "400px", width: "100%",
        position: "relative",
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "transparent", border: "none", color: "var(--fg-muted)",
            fontSize: "1.2rem", cursor: "pointer", fontFamily: "'Share Tech Mono', monospace"
          }}
        >
          ✕
        </button>

        <h2 style={{
          fontFamily: "'Orbitron', sans-serif", color: "var(--accent)",
          fontSize: "1.2rem", textTransform: "uppercase", letterSpacing: "0.1em",
          textAlign: "center", marginBottom: "0.25rem",
          textShadow: "0 0 10px var(--accent-glow)"
        }}>
          SYSTEM OVERRIDE
        </h2>
        <p style={{
          fontFamily: "'Share Tech Mono', monospace", color: "var(--fg-muted)",
          fontSize: "0.75rem", textAlign: "center", marginBottom: "1.5rem"
        }}>
          // EASTER EGG PROTOCOL ACTIVATED
        </p>

        {/* Scoreboard */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontFamily: "'Share Tech Mono', monospace" }}>
          <div>
            <span style={{ color: "var(--fg-muted)", fontSize: "0.7rem", marginRight: "0.5rem" }}>SCORE:</span>
            <span style={{ color: "var(--fg)", fontSize: "1.1rem", fontWeight: "bold" }}>{score}</span>
          </div>
          <div>
            <span style={{ color: "var(--fg-muted)", fontSize: "0.7rem", marginRight: "0.5rem" }}>HI:</span>
            <span style={{ color: "var(--gold)", fontSize: "1.1rem", fontWeight: "bold", textShadow: "0 0 8px var(--gold-glow)" }}>{highScore}</span>
          </div>
        </div>

        {/* Game Board */}
        <div style={{
          width: "100%",
          aspectRatio: "1 / 1",
          background: "rgba(0, 0, 0, 0.5)",
          border: "1px solid var(--border)",
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}>
          {!isPlaying && !gameOver && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", background: "rgba(0,0,0,0.6)", zIndex: 10
            }}>
              <p style={{ fontFamily: "'Share Tech Mono', monospace", color: "var(--fg)", fontSize: "0.9rem", marginBottom: "1rem", textAlign: "center" }}>
                Use WASD or Arrow Keys to move.
              </p>
              <button onClick={() => setIsPlaying(true)} className="btn-primary" style={{ padding: "0.5rem 1.5rem" }}>
                START HACKING
              </button>
            </div>
          )}

          {gameOver && (
            <div style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", background: "rgba(255, 61, 90, 0.15)", zIndex: 10,
              backdropFilter: "blur(2px)"
            }}>
              <p style={{ fontFamily: "'Orbitron', sans-serif", color: "var(--danger)", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem", textShadow: "0 0 10px var(--danger-glow)" }}>
                SYSTEM FAILURE
              </p>
              <button onClick={resetGame} className="btn-primary" style={{ background: "var(--danger)", borderColor: "var(--danger)", padding: "0.5rem 1.5rem" }}>
                REBOOT
              </button>
            </div>
          )}

          {/* Render Snake & Food */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                style={{
                  width: "100%", height: "100%",
                  background: isHead ? "var(--accent)" : isSnake ? "var(--accent-dim)" : isFood ? "var(--green)" : "transparent",
                  borderRadius: isFood ? "50%" : "2px",
                  boxShadow: isHead || isFood ? `0 0 8px ${isFood ? "var(--green)" : "var(--accent)"}` : "none",
                  transform: isFood ? "scale(0.7)" : isSnake ? "scale(0.9)" : "none",
                }}
              />
            );
          })}
        </div>

        {/* Mobile Controls */}
        <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", maxWidth: "180px", margin: "1.5rem auto 0" }}>
          <div />
          <button 
            className="btn-secondary" 
            style={{ padding: "0.75rem", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => handleMobileControl(0, -1)}
          >
            ↑
          </button>
          <div />
          <button 
            className="btn-secondary" 
            style={{ padding: "0.75rem", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => handleMobileControl(-1, 0)}
          >
            ←
          </button>
          <button 
            className="btn-secondary" 
            style={{ padding: "0.75rem", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => handleMobileControl(0, 1)}
          >
            ↓
          </button>
          <button 
            className="btn-secondary" 
            style={{ padding: "0.75rem", fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={() => handleMobileControl(1, 0)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
