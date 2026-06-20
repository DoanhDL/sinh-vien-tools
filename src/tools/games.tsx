import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import ToolLayout from "../components/ToolLayout";

const EMOJIS = ["🎓", "📚", "✏️", "🎯", "💡", "🔬", "🎨", "🎵"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export function MemoryGameTool() {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const init = useCallback(() => {
    const deck = shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({
      id: i, emoji, flipped: false, matched: false,
    }));
    setCards(deck);
    setSelected([]);
    setMoves(0);
    setWon(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  const flip = (idx: number) => {
    if (won || selected.length >= 2 || cards[idx]?.flipped || cards[idx]?.matched) return;
    const next = cards.map((c, i) => i === idx ? { ...c, flipped: true } : c);
    setCards(next);
    const sel = [...selected, idx];
    setSelected(sel);
    if (sel.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = sel;
      if (next[a!]!.emoji === next[b!]!.emoji) {
        setTimeout(() => {
          setCards((cs) => cs.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
          setSelected([]);
          setCards((cs) => {
            if (cs.every((c) => c.matched)) setWon(true);
            return cs;
          });
        }, 400);
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 700);
      }
    }
  };

  return (
    <ToolLayout icon="🧠" title="Trò nhớ hình" description="Lật thẻ tìm cặp emoji giống nhau">
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-slate-600"><span>Lượt: {moves}</span>{won && <span className="text-green-600 font-bold">🎉 Thắng!</span>}<button type="button" onClick={init} className="text-blue-600">Chơi lại</button></div>
        <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
          {cards.map((c, i) => (
            <button key={c.id} type="button" onClick={() => flip(i)} className={`aspect-square rounded-xl text-2xl font-bold transition transform ${c.flipped || c.matched ? "bg-blue-100 border-blue-300" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:scale-105"}`}>
              {(c.flipped || c.matched) ? c.emoji : "?"}
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pos = { x: number; y: number };

export function SnakeGameTool() {
  const SIZE = 15;
  const [snake, setSnake] = useState<Pos[]>([{ x: 7, y: 7 }]);
  const [dir, setDir] = useState<Dir>("RIGHT");
  const [food, setFood] = useState<Pos>({ x: 3, y: 3 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const newFood = useCallback((body: Pos[]) => {
    let f: Pos;
    do { f = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) }; }
    while (body.some((s) => s.x === f.x && s.y === f.y));
    return f;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT" };
      if (map[e.key]) { e.preventDefault(); setDir(map[e.key]!); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setSnake((prev) => {
        const d = dirRef.current;
        const head = { ...prev[0]! };
        if (d === "UP") head.y--;
        if (d === "DOWN") head.y++;
        if (d === "LEFT") head.x--;
        if (d === "RIGHT") head.x++;
        if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE || prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }
        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...prev.slice(0, ate ? prev.length : prev.length - 1)];
        if (ate) { setScore((s) => s + 10); setFood(newFood(next)); }
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [food, gameOver, newFood]);

  const reset = () => { setSnake([{ x: 7, y: 7 }]); setDir("RIGHT"); setFood({ x: 3, y: 3 }); setScore(0); setGameOver(false); };

  return (
    <ToolLayout icon="🐍" title="Rắn săn mồi" description="Dùng phím mũi tên để điều khiển">
      <div className="space-y-3 text-center">
        <p className="text-sm">Điểm: <strong>{score}</strong> {gameOver && <span className="text-red-600">— Game Over!</span>}</p>
        <div className="inline-grid gap-px bg-slate-300 p-1 rounded" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {Array.from({ length: SIZE * SIZE }, (_, i) => {
            const x = i % SIZE, y = Math.floor(i / SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isHead = snake[0]?.x === x && snake[0]?.y === y;
            const isFood = food.x === x && food.y === y;
            return <div key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${isHead ? "bg-green-600 rounded-sm" : isSnake ? "bg-green-400" : isFood ? "bg-red-500 rounded-full" : "bg-slate-100"}`} />;
          })}
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          {(["UP", "DOWN", "LEFT", "RIGHT"] as Dir[]).map((d) => (
            <button key={d} type="button" onClick={() => setDir(d)} className="px-4 py-2 border rounded-lg text-sm">{d === "UP" ? "↑" : d === "DOWN" ? "↓" : d === "LEFT" ? "←" : "→"}</button>
          ))}
        </div>
        {gameOver && <button type="button" onClick={reset} className="px-6 py-2 bg-blue-600 text-white rounded-xl">Chơi lại</button>}
      </div>
    </ToolLayout>
  );
}

export function Game2048Tool() {
  const initGrid = () => Array.from({ length: 16 }, () => 0);
  const [grid, setGrid] = useState(initGrid);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("2048_best") || 0));

  const addTile = (g: number[]) => {
    const empty = g.map((v, i) => v === 0 ? i : -1).filter((i) => i >= 0);
    if (!empty.length) return g;
    const copy = [...g];
    copy[empty[Math.floor(Math.random() * empty.length)]!] = Math.random() < 0.9 ? 2 : 4;
    return copy;
  };

  const start = () => { let g = initGrid(); g = addTile(g); g = addTile(g); setGrid(g); setScore(0); };
  useEffect(() => { start(); }, []);

  const move = (dir: "left" | "right" | "up" | "down") => {
    const size = 4;
    let g = [...grid];
    let gained = 0;
    const slide = (line: number[]) => {
      const filtered = line.filter((v) => v);
      const merged: number[] = [];
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) { merged.push(filtered[i]! * 2); gained += filtered[i]! * 2; i++; }
        else merged.push(filtered[i]!);
      }
      while (merged.length < size) merged.push(0);
      return merged;
    };
    if (dir === "left" || dir === "right") {
      for (let r = 0; r < size; r++) {
        let line = g.slice(r * size, r * size + size);
        if (dir === "right") line = line.reverse();
        line = slide(line);
        if (dir === "right") line = line.reverse();
        for (let c = 0; c < size; c++) g[r * size + c] = line[c]!;
      }
    } else {
      for (let c = 0; c < size; c++) {
        let line = [g[c]!, g[c + 4]!, g[c + 8]!, g[c + 12]!];
        if (dir === "down") line = line.reverse();
        line = slide(line);
        if (dir === "down") line = line.reverse();
        g[c] = line[0]!; g[c + 4] = line[1]!; g[c + 8] = line[2]!; g[c + 12] = line[3]!;
      }
    }
    if (g.join() !== grid.join()) {
      g = addTile(g);
      setGrid(g);
      setScore((s) => { const n = s + gained; if (n > best) { setBest(n); localStorage.setItem("2048_best", String(n)); } return n; });
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const m: Record<string, "left" | "right" | "up" | "down"> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      if (m[e.key]) { e.preventDefault(); move(m[e.key]!); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const colors: Record<number, string> = { 0: "bg-slate-200", 2: "bg-amber-100", 4: "bg-amber-200", 8: "bg-orange-300", 16: "bg-orange-400", 32: "bg-red-400", 64: "bg-red-500 text-white", 128: "bg-yellow-400", 256: "bg-yellow-500", 512: "bg-green-400", 1024: "bg-green-500 text-white", 2048: "bg-blue-600 text-white" };

  return (
    <ToolLayout icon="🔢" title="2048" description="Ghép số bằng phím mũi tên hoặc nút bấm">
      <div className="space-y-3 max-w-xs mx-auto">
        <div className="flex justify-between text-sm"><span>Điểm: {score}</span><span>Best: {best}</span><button type="button" onClick={start} className="text-blue-600">New</button></div>
        <div className="grid grid-cols-4 gap-2 bg-slate-300 p-2 rounded-xl">
          {grid.map((v, i) => (
            <div key={i} className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg ${colors[v] ?? "bg-purple-600 text-white"}`}>{v || ""}</div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 max-w-[120px] mx-auto">
          <div /><button type="button" onClick={() => move("up")} className="py-2 border rounded">↑</button><div />
          <button type="button" onClick={() => move("left")} className="py-2 border rounded">←</button>
          <button type="button" onClick={() => move("down")} className="py-2 border rounded">↓</button>
          <button type="button" onClick={() => move("right")} className="py-2 border rounded">→</button>
        </div>
      </div>
    </ToolLayout>
  );
}

type Cell = "X" | "O" | null;

export function TicTacToeGameTool() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

  const checkWin = (b: Cell[]) => lines.find(([a,c,d]) => b[a] && b[a] === b[c] && b[a] === b[d])?.map(String).join("") ?? null;

  const aiMove = (b: Cell[]) => {
    const empty = b.map((v, i) => v === null ? i : -1).filter((i) => i >= 0);
    if (!empty.length) return b;
    for (const i of empty) { const t = [...b]; t[i] = "O"; if (checkWin(t)) return t; }
    for (const i of empty) { const t = [...b]; t[i] = "X"; if (checkWin(t)) { const r = [...b]; r[i] = "O"; return r; } }
    if (b[4] === null) { const r = [...b]; r[4] = "O"; return r; }
    const pick = empty[Math.floor(Math.random() * empty.length)]!;
    const r = [...b]; r[pick] = "O"; return r;
  };

  const play = (i: number) => {
    if (board[i] || winner || turn !== "X") return;
    let b = [...board]; b[i] = "X";
    const w = checkWin(b);
    if (w) { setBoard(b); setWinner("X"); return; }
    if (b.every((c) => c)) { setBoard(b); setWinner("draw"); return; }
    b = aiMove(b);
    setBoard(b);
    setWinner(checkWin(b) ? "O" : b.every((c) => c) ? "draw" : null);
    setTurn("X");
  };

  const reset = () => { setBoard(Array(9).fill(null)); setWinner(null); setTurn("X"); };

  return (
    <ToolLayout icon="❌" title="Cờ caro 3×3" description="Đánh caro với máy (O)">
      <div className="space-y-4 max-w-xs mx-auto text-center">
        <p className="text-sm">{winner === "X" ? "🎉 Bạn thắng!" : winner === "O" ? "😅 Máy thắng!" : winner === "draw" ? "🤝 Hòa!" : "Lượt của bạn (X)"}</p>
        <div className="grid grid-cols-3 gap-2">
          {board.map((c, i) => (
            <button key={i} type="button" onClick={() => play(i)} className="aspect-square text-3xl font-bold bg-white border-2 border-slate-200 rounded-xl hover:bg-blue-50 disabled:cursor-default">{c}</button>
          ))}
        </div>
        <button type="button" onClick={reset} className="px-6 py-2 bg-blue-600 text-white rounded-xl">Chơi lại</button>
      </div>
    </ToolLayout>
  );
}

export function RPSGameTool() {
  const choices = ["✊", "✋", "✌️"] as const;
  const names = ["Búa", "Bao", "Kéo"];
  const [player, setPlayer] = useState<number | null>(null);
  const [cpu, setCpu] = useState<number | null>(null);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });

  const play = (p: number) => {
    const c = Math.floor(Math.random() * 3);
    setPlayer(p); setCpu(c);
    if (p === c) setScore((s) => ({ ...s, draw: s.draw + 1 }));
    else if ((p + 1) % 3 === c) setScore((s) => ({ ...s, lose: s.lose + 1 }));
    else setScore((s) => ({ ...s, win: s.win + 1 }));
  };

  const result = player !== null && cpu !== null ? (player === cpu ? "Hòa!" : (player + 1) % 3 === cpu ? "Thua!" : "Thắng!") : null;

  return (
    <ToolLayout icon="✊" title="Oẳn tù tì" description="Kéo búa bao với máy">
      <div className="text-center space-y-4 max-w-sm mx-auto">
        <p className="text-sm">🏆 {score.win} | 🤝 {score.draw} | 💀 {score.lose}</p>
        <div className="flex justify-center gap-8 text-5xl">
          <div><p className="text-xs text-slate-500 mb-1">Bạn</p>{player !== null ? choices[player] : "❓"}</div>
          <div><p className="text-xs text-slate-500 mb-1">Máy</p>{cpu !== null ? choices[cpu] : "❓"}</div>
        </div>
        {result && <p className="text-xl font-bold">{result}</p>}
        <div className="flex gap-3 justify-center">{choices.map((c, i) => (
          <button key={c} type="button" onClick={() => play(i)} className="text-4xl p-4 bg-white border-2 rounded-2xl hover:scale-110 transition" title={names[i]}>{c}</button>
        ))}</div>
      </div>
    </ToolLayout>
  );
}

export function GuessNumberGameTool() {
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState("Đoán số từ 1 đến 100!");
  const [won, setWon] = useState(false);

  const submit = () => {
    const n = Number(guess);
    if (isNaN(n) || n < 1 || n > 100) return;
    setAttempts((a) => a + 1);
    if (n === target) { setHint(`🎉 Đúng rồi! Số là ${target}`); setWon(true); }
    else setHint(n < target ? "📈 Lớn hơn!" : "📉 Nhỏ hơn!");
    setGuess("");
  };

  const reset = () => { setTarget(Math.floor(Math.random() * 100) + 1); setAttempts(0); setHint("Đoán số từ 1 đến 100!"); setWon(false); };

  return (
    <ToolLayout icon="🔮" title="Đoán số" description="Máy nghĩ số 1–100, bạn đoán">
      <div className="space-y-4 max-w-sm mx-auto text-center">
        <p className="text-lg font-medium">{hint}</p>
        <p className="text-sm text-slate-500">Lượt: {attempts}</p>
        {!won && (
          <div className="flex gap-2">
            <input type="number" min={1} max={100} value={guess} onChange={(e) => setGuess(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} className="flex-1 border rounded-xl px-4 py-3 text-center text-xl" placeholder="?" />
            <button type="button" onClick={submit} className="px-6 py-3 bg-blue-600 text-white rounded-xl">OK</button>
          </div>
        )}
        {won && <button type="button" onClick={reset} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold">Chơi lại</button>}
      </div>
    </ToolLayout>
  );
}

const SCRAMBLE_WORDS = ["STUDY", "LEARN", "BOOKS", "CLASS", "EXAM", "GRADE", "FOCUS", "BRAIN", "NOTES", "SKILL"];

export function ScrambleGameTool() {
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");

  const next = useCallback(() => {
    const w = SCRAMBLE_WORDS[Math.floor(Math.random() * SCRAMBLE_WORDS.length)]!;
    setWord(w);
    setScrambled(shuffle(w.split("")).join(""));
    setInput("");
    setMsg("");
  }, []);

  useEffect(() => { next(); }, [next]);

  const check = () => {
    if (input.toUpperCase() === word) { setScore((s) => s + 1); setMsg("✅ Đúng!"); setTimeout(next, 800); }
    else setMsg("❌ Sai, thử lại!");
  };

  return (
    <ToolLayout icon="🔤" title="Xếp chữ" description="Sắp xếp chữ cái thành từ tiếng Anh">
      <div className="text-center space-y-4 max-w-sm mx-auto">
        <p className="text-sm">Điểm: {score}</p>
        <p className="text-4xl font-bold tracking-widest text-purple-600">{scrambled}</p>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} className="w-full border rounded-xl px-4 py-3 text-center text-xl uppercase" placeholder="Nhập từ..." />
        <button type="button" onClick={check} className="px-8 py-3 bg-purple-600 text-white rounded-xl">Kiểm tra</button>
        {msg && <p className="font-medium">{msg}</p>}
        <button type="button" onClick={next} className="text-sm text-blue-600">Bỏ qua →</button>
      </div>
    </ToolLayout>
  );
}

const TYPING_TEXT = "Sinh vien can hoc tap cham chi moi ngay de dat ket qua tot trong ky thi sap toi.";

export function TypingGameTool() {
  const [input, setInput] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const wpm = start && done ? Math.round((TYPING_TEXT.split(" ").length / ((Date.now() - start) / 60000))) : null;

  const onChange = (v: string) => {
    if (!start) setStart(Date.now());
    setInput(v);
    if (v === TYPING_TEXT) { setDone(true); setStart((s) => s ?? Date.now()); }
  };

  return (
    <ToolLayout icon="⌨️" title="Test gõ phím" description="Gõ lại đoạn văn càng nhanh càng tốt">
      <div className="space-y-4 max-w-lg mx-auto">
        <p className="text-sm bg-slate-100 rounded-xl p-4 leading-relaxed">{TYPING_TEXT.split("").map((c, i) => (
          <span key={i} className={input[i] === c ? "text-green-600" : input[i] ? "text-red-500 bg-red-50" : ""}>{c}</span>
        ))}</p>
        <textarea value={input} onChange={(e) => onChange(e.target.value)} disabled={done} rows={3} className="w-full border rounded-xl p-3 text-sm" placeholder="Bắt đầu gõ..." />
        {done && wpm !== null && <p className="text-center text-2xl font-bold text-blue-600">⚡ {wpm} từ/phút</p>}
        <button type="button" onClick={() => { setInput(""); setStart(null); setDone(false); }} className="w-full py-2 border rounded-xl text-sm">Reset</button>
      </div>
    </ToolLayout>
  );
}

export function ReactionGameTool() {
  const [state, setState] = useState<"wait" | "ready" | "go" | "early" | "result">("wait");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("reaction_best") || 9999));
  const goTime = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const start = () => {
    setState("ready");
    const delay = 1500 + Math.random() * 3000;
    timer.current = setTimeout(() => { setState("go"); goTime.current = Date.now(); }, delay);
  };

  const click = () => {
    if (state === "ready") { clearTimeout(timer.current); setState("early"); return; }
    if (state === "go") {
      const time = Date.now() - goTime.current;
      setMs(time);
      if (time < best) { setBest(time); localStorage.setItem("reaction_best", String(time)); }
      setState("result");
    }
  };

  const colors = { wait: "bg-slate-400", ready: "bg-red-500", go: "bg-green-500", early: "bg-orange-500", result: "bg-blue-500" };
  const labels = { wait: "Bấm để bắt đầu", ready: "Chờ màu xanh...", go: "BẤM NGAY!", early: "Quá sớm! Thử lại", result: `${ms}ms — Best: ${best}ms` };

  return (
    <ToolLayout icon="⚡" title="Phản xạ nhanh" description="Bấm ngay khi màn hình chuyển xanh">
      <button type="button" onClick={state === "wait" || state === "early" || state === "result" ? start : click} className={`w-full h-48 rounded-2xl text-white text-2xl font-bold transition ${colors[state]}`}>
        {labels[state]}
      </button>
    </ToolLayout>
  );
}

export function LuckyGameTool() {
  const [dice, setDice] = useState(1);
  const [coin, setCoin] = useState<"heads" | "tails">("heads");
  const [rolling, setRolling] = useState(false);

  const rollDice = () => { setRolling(true); let i = 0; const id = setInterval(() => { setDice(Math.floor(Math.random() * 6) + 1); if (++i > 10) { clearInterval(id); setRolling(false); } }, 80); };
  const flipCoin = () => { setRolling(true); let i = 0; const id = setInterval(() => { setCoin(Math.random() > 0.5 ? "heads" : "tails"); if (++i > 10) { clearInterval(id); setRolling(false); } }, 80); };

  return (
    <ToolLayout icon="🪙" title="Xúc xắc & Tung đồng" description="Thử vận may">
      <div className="grid sm:grid-cols-2 gap-6 max-w-md mx-auto text-center">
        <div className="bg-white border rounded-2xl p-6">
          <p className="text-6xl mb-4">{["⚀","⚁","⚂","⚃","⚄","⚅"][dice - 1]}</p>
          <button type="button" onClick={rollDice} disabled={rolling} className="px-6 py-3 bg-blue-600 text-white rounded-xl disabled:opacity-50">🎲 Tung xúc xắc</button>
        </div>
        <div className="bg-white border rounded-2xl p-6">
          <p className="text-6xl mb-4">{coin === "heads" ? "👑" : "🌿"}</p>
          <p className="text-sm mb-2">{coin === "heads" ? "Ngửa (Heads)" : "Sấp (Tails)"}</p>
          <button type="button" onClick={flipCoin} disabled={rolling} className="px-6 py-3 bg-amber-500 text-white rounded-xl disabled:opacity-50">🪙 Tung đồng xu</button>
        </div>
      </div>
    </ToolLayout>
  );
}

export function MinesweeperGameTool() {
  const SIZE = 8, MINES = 10;
  const [grid, setGrid] = useState<{ mine: boolean; open: boolean; flag: boolean; count: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const init = useCallback(() => {
    const g = Array.from({ length: SIZE * SIZE }, () => ({ mine: false, open: false, flag: false, count: 0 }));
    let placed = 0;
    while (placed < MINES) {
      const i = Math.floor(Math.random() * SIZE * SIZE);
      if (!g[i]!.mine) { g[i]!.mine = true; placed++; }
    }
    for (let i = 0; i < SIZE * SIZE; i++) {
      const x = i % SIZE, y = Math.floor(i / SIZE);
      g[i]!.count = g.filter((_, j) => {
        const jx = j % SIZE, jy = Math.floor(j / SIZE);
        return g[j]!.mine && Math.abs(jx - x) <= 1 && Math.abs(jy - y) <= 1;
      }).length;
    }
    setGrid(g); setGameOver(false); setWon(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  const openCell = (idx: number) => {
    if (gameOver || grid[idx]?.open || grid[idx]?.flag) return;
    if (grid[idx]?.mine) { setGrid((g) => g.map((c) => ({ ...c, open: true }))); setGameOver(true); return; }
    const reveal = (g: typeof grid, i: number): typeof grid => {
      if (g[i]?.open || g[i]?.flag) return g;
      const copy = g.map((c) => ({ ...c }));
      copy[i]!.open = true;
      if (copy[i]!.count === 0) {
        const x = i % SIZE, y = Math.floor(i / SIZE);
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < SIZE && ny >= 0 && ny < SIZE) reveal(copy, ny * SIZE + nx);
        }
      }
      return copy;
    };
    const next = reveal(grid, idx);
    setGrid(next);
    if (next.filter((c) => !c.mine).every((c) => c.open)) setWon(true);
  };

  return (
    <ToolLayout icon="💣" title="Dò mìn" description="Minesweeper 8×8 — click trái mở, phải cắm cờ">
      <div className="space-y-3 max-w-sm mx-auto">
        <div className="flex justify-between text-sm"><span>💣 {MINES}</span>{won && <span className="text-green-600 font-bold">🎉 Thắng!</span>}{gameOver && <span className="text-red-600">💥 Nổ!</span>}<button type="button" onClick={init} className="text-blue-600">Reset</button></div>
        <div className="grid gap-px bg-slate-400" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {grid.map((c, i) => (
            <button key={i} type="button" onClick={() => openCell(i)} onContextMenu={(e) => { e.preventDefault(); setGrid((g) => g.map((cell, j) => j === i ? { ...cell, flag: !cell.flag } : cell)); }} className={`w-8 h-8 text-xs font-bold ${c.open ? (c.mine ? "bg-red-500 text-white" : "bg-slate-100") : "bg-slate-300 hover:bg-slate-200"} ${c.flag && !c.open ? "text-red-600" : ""}`}>
              {c.flag && !c.open ? "🚩" : c.open ? (c.mine ? "💣" : c.count || "") : ""}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500 text-center">Click phải để cắm cờ 🚩</p>
      </div>
    </ToolLayout>
  );
}

const SUDOKU_PUZZLE = [
  [1, 0, 0, 4], [0, 0, 3, 0], [0, 4, 0, 0], [3, 0, 0, 2],
];

export function SudokuGameTool() {
  const [board, setBoard] = useState<number[][]>(() => SUDOKU_PUZZLE.map((r) => [...r]));
  const [fixed] = useState(() => SUDOKU_PUZZLE.map((r) => r.map((v) => v !== 0)));
  const [won, setWon] = useState(false);

  const setCell = (r: number, c: number, v: number) => {
    if (fixed[r]![c]) return;
    const next = board.map((row) => [...row]);
    next[r]![c] = v;
    setBoard(next);
    const valid = (b: number[][]) => {
      for (let i = 0; i < 4; i++) {
        const row = b[i]!.filter(Boolean);
        const col = b.map((r) => r[i]).filter(Boolean);
        if (new Set(row).size !== row.length || new Set(col).size !== col.length) return false;
      }
      return b.every((row) => row.every(Boolean));
    };
    if (valid(next)) setWon(true);
  };

  return (
    <ToolLayout icon="🧩" title="Sudoku 4×4" description="Điền số 1–4, không trùng hàng/cột">
      <div className="space-y-4 max-w-xs mx-auto">
        {won && <p className="text-center text-green-600 font-bold">🎉 Hoàn thành!</p>}
        <div className="grid grid-cols-4 gap-1 bg-slate-800 p-1 rounded-xl">
          {board.map((row, r) => row.map((cell, c) => (
            <select key={`${r}-${c}`} value={cell || ""} disabled={fixed[r]![c]} onChange={(e) => setCell(r, c, Number(e.target.value))} className={`w-12 h-12 text-center text-lg font-bold rounded ${fixed[r]![c] ? "bg-slate-200" : "bg-white"}`}>
              <option value=""> </option>{[1,2,3,4].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          )))}
        </div>
        <button type="button" onClick={() => { setBoard(SUDOKU_PUZZLE.map((r) => [...r])); setWon(false); }} className="w-full py-2 border rounded-xl text-sm">Reset</button>
      </div>
    </ToolLayout>
  );
}

const SIMON_COLORS = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-400"];

export function SimonGameTool() {
  const [seq, setSeq] = useState<number[]>([]);
  const [input, setInput] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const flash = async (s: number[]) => {
    setPlaying(true);
    for (const c of s) {
      setActive(c);
      await new Promise((r) => setTimeout(r, 500));
      setActive(null);
      await new Promise((r) => setTimeout(r, 200));
    }
    setPlaying(false);
  };

  const start = async () => {
    const next = [...seq, Math.floor(Math.random() * 4)];
    setSeq(next); setInput([]); setGameOver(false);
    await flash(next);
  };

  const tap = async (c: number) => {
    if (playing || gameOver) return;
    const next = [...input, c];
    setInput(next);
    setActive(c); setTimeout(() => setActive(null), 200);
    if (c !== seq[next.length - 1]) { setGameOver(true); return; }
    if (next.length === seq.length) { setScore((s) => s + 1); setInput([]); const ns = [...seq, Math.floor(Math.random() * 4)]; setSeq(ns); await flash(ns); }
  };

  return (
    <ToolLayout icon="🎨" title="Simon Says" description="Nhớ và lặp lại thứ tự màu">
      <div className="text-center space-y-4 max-w-xs mx-auto">
        <p className="text-sm">Cấp: {score} {gameOver && <span className="text-red-600">— Game Over!</span>}</p>
        <div className="grid grid-cols-2 gap-3">
          {SIMON_COLORS.map((color, i) => (
            <button key={i} type="button" onClick={() => tap(i)} disabled={playing} className={`h-24 rounded-2xl transition ${color} ${active === i ? "opacity-100 scale-95 ring-4 ring-white" : "opacity-70 hover:opacity-90"}`} />
          ))}
        </div>
        <button type="button" onClick={start} className="px-8 py-3 bg-slate-800 text-white rounded-xl">{seq.length ? "Chơi lại" : "Bắt đầu"}</button>
      </div>
    </ToolLayout>
  );
}

export function WhackGameTool() {
  const [score, setScore] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [playing, setPlaying] = useState(false);

  const start = () => {
    setScore(0); setTimeLeft(30); setPlaying(true);
    const timer = setInterval(() => setTimeLeft((t) => { if (t <= 1) { clearInterval(timer); setPlaying(false); setActive(null); return 0; } return t - 1; }), 1000);
    const mole = setInterval(() => setActive(Math.floor(Math.random() * 9)), 700);
    setTimeout(() => clearInterval(mole), 30000);
  };

  const whack = (i: number) => {
    if (!playing || active !== i) return;
    setScore((s) => s + 1);
    setActive(null);
  };

  return (
    <ToolLayout icon="🔨" title="Đập chuột" description="Whack-a-mole — 30 giây đập càng nhiều càng tốt">
      <div className="text-center space-y-4 max-w-xs mx-auto">
        <p className="text-lg">{playing ? `⏱ ${timeLeft}s · 🎯 ${score}` : !playing && timeLeft === 0 && score > 0 ? `Kết thúc! Điểm: ${score}` : "Sẵn sàng?"}</p>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }, (_, i) => (
            <button key={i} type="button" onClick={() => whack(i)} className={`aspect-square rounded-2xl text-3xl transition ${active === i ? "bg-amber-200 scale-110" : "bg-green-800"}`}>
              {active === i ? "🐹" : ""}
            </button>
          ))}
        </div>
        {!playing && <button type="button" onClick={start} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold">{score > 0 ? "Chơi lại" : "Bắt đầu!"}</button>}
      </div>
    </ToolLayout>
  );
}

const TRIVIA = [
  { q: "Thủ đô Việt Nam?", a: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Huế"], c: 0 },
  { q: "1 + 1 = ?", a: ["1", "2", "3", "4"], c: 1 },
  { q: "H2O là?", a: ["Muối", "Nước", "Vàng", "Sắt"], c: 1 },
  { q: "Trái Đất quay quanh?", a: ["Mặt Trăng", "Mặt Trời", "Sao Hỏa", "Sao Kim"], c: 1 },
  { q: "Ngôn ngữ lập trình web phổ biến?", a: ["JavaScript", "Assembly", "Fortran", "COBOL"], c: 0 },
  { q: "Bao nhiêu chữ cái trong bảng chữ cái tiếng Anh?", a: ["24", "25", "26", "27"], c: 2 },
  { q: "Ai viết Truyện Kiều?", a: ["Nguyễn Du", "Hồ Chí Minh", "Trần Hưng Đạo", "Lý Thái Tổ"], c: 0 },
  { q: "Nước sôi ở?", a: ["50°C", "80°C", "100°C", "120°C"], c: 2 },
];

export function TriviaGameTool() {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const q = TRIVIA[idx % TRIVIA.length]!;

  const answer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.c) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx >= TRIVIA.length - 1) setDone(true);
    else { setIdx((i) => i + 1); setSelected(null); }
  };

  if (done) return (
    <ToolLayout icon="❓" title="Câu đố kiến thức" description="Quiz vui kiến thức phổ thông">
      <div className="text-center space-y-4">
        <p className="text-5xl font-bold text-blue-600">{score}/{TRIVIA.length}</p>
        <button type="button" onClick={() => { setIdx(0); setScore(0); setSelected(null); setDone(false); }} className="px-8 py-3 bg-blue-600 text-white rounded-xl">Chơi lại</button>
      </div>
    </ToolLayout>
  );

  return (
    <ToolLayout icon="❓" title="Câu đố kiến thức" description="Quiz vui kiến thức phổ thông">
      <div className="space-y-4 max-w-md mx-auto">
        <p className="text-sm text-slate-500">Câu {idx + 1}/{TRIVIA.length} · Điểm: {score}</p>
        <p className="text-xl font-bold text-center">{q.q}</p>
        <div className="grid gap-2">{q.a.map((opt, i) => {
          let style = "bg-white border hover:border-blue-300";
          if (selected !== null) {
            if (i === q.c) style = "bg-green-50 border-green-500 text-green-800";
            else if (i === selected) style = "bg-red-50 border-red-500";
            else style = "opacity-40";
          }
          return <button key={opt} type="button" onClick={() => answer(i)} disabled={selected !== null} className={`px-4 py-3 rounded-xl border text-left ${style}`}>{opt}</button>;
        })}</div>
        {selected !== null && <button type="button" onClick={next} className="w-full py-3 bg-blue-600 text-white rounded-xl">{idx >= TRIVIA.length - 1 ? "Xem kết quả" : "Câu tiếp →"}</button>}
      </div>
    </ToolLayout>
  );
}

export function BubbleGameTool() {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [popped, setPopped] = useState(0);
  const idRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setBubbles((b) => [...b.slice(-30), { id: idRef.current++, x: Math.random() * 90, y: Math.random() * 80, size: 30 + Math.random() * 40 }]);
    }, 800);
    return () => clearInterval(id);
  }, []);

  const pop = (bid: number) => {
    setBubbles((b) => b.filter((x) => x.id !== bid));
    setPopped((p) => p + 1);
  };

  return (
    <ToolLayout icon="🫧" title="Bong bóng pop" description="Pop bong bóng giải stress — không giới hạn">
      <div className="space-y-3">
        <p className="text-center text-sm">Đã pop: <strong className="text-blue-600 text-lg">{popped}</strong> bong bóng 🫧</p>
        <div className="relative h-80 bg-gradient-to-b from-sky-100 to-blue-200 rounded-2xl overflow-hidden border">
          {bubbles.map((b) => (
            <button key={b.id} type="button" onClick={() => pop(b.id)} className="absolute rounded-full bg-white/40 border-2 border-white/60 hover:scale-125 transition-transform animate-pulse" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size }} />
          ))}
        </div>
        <button type="button" onClick={() => { setBubbles([]); setPopped(0); }} className="w-full py-2 border rounded-xl text-sm">Reset</button>
      </div>
    </ToolLayout>
  );
}

export const GAME_COMPONENTS: Record<string, () => ReactElement> = {
  "game-memory": MemoryGameTool,
  "game-snake": SnakeGameTool,
  "game-2048": Game2048Tool,
  "game-tictactoe": TicTacToeGameTool,
  "game-rps": RPSGameTool,
  "game-guess": GuessNumberGameTool,
  "game-scramble": ScrambleGameTool,
  "game-typing": TypingGameTool,
  "game-reaction": ReactionGameTool,
  "game-lucky": LuckyGameTool,
  "game-minesweeper": MinesweeperGameTool,
  "game-sudoku": SudokuGameTool,
  "game-simon": SimonGameTool,
  "game-whack": WhackGameTool,
  "game-trivia": TriviaGameTool,
  "game-bubble": BubbleGameTool,
};
