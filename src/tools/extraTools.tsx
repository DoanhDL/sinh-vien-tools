import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react";
import ToolLayout from "../components/ToolLayout";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

function randChar(set: string) {
  return set[Math.floor(Math.random() * set.length)]!;
}

export function PasswordGeneratorTool() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [sym, setSym] = useState(true);
  const [pwd, setPwd] = useState("");

  const generate = useCallback(() => {
    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (nums) chars += "0123456789";
    if (sym) chars += "!@#$%^&*-_=+";
    if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
    setPwd(Array.from({ length: len }, () => randChar(chars)).join(""));
  }, [len, upper, lower, nums, sym]);

  useEffect(() => { generate(); }, [generate]);

  return (
    <ToolLayout icon="🔐" title="Tạo mật khẩu" description="Sinh mật khẩu mạnh — không giới hạn lần tạo">
      <div className="space-y-4 max-w-md mx-auto">
        <div className="bg-slate-100 rounded-xl p-4 font-mono text-center break-all text-lg">{pwd}</div>
        <div className="flex gap-2">
          <button type="button" onClick={generate} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium">Tạo mới</button>
          <button type="button" onClick={() => navigator.clipboard.writeText(pwd)} className="px-4 py-3 border rounded-xl">📋</button>
        </div>
        <div><label className="text-sm">Độ dài: {len}</label><input type="range" min={8} max={64} value={len} onChange={(e) => setLen(Number(e.target.value))} className="w-full" /></div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[[upper, setUpper, "Chữ hoa"], [lower, setLower, "Chữ thường"], [nums, setNums, "Số"], [sym, setSym, "Ký tự đặc biệt"]].map(([v, set, label]) => (
            <label key={label as string} className="flex items-center gap-2"><input type="checkbox" checked={v as boolean} onChange={() => (set as (b: boolean) => void)(!(v as boolean))} />{label as string}</label>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

export function StopwatchTool() {
  const [mode, setMode] = useState<"stopwatch" | "countdown">("stopwatch");
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [countdownMin, setCountdownMin] = useState(5);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setMs((m) => {
        if (mode === "countdown" && m <= 1000) { setRunning(false); return 0; }
        return mode === "stopwatch" ? m + 100 : m - 100;
      });
    }, 100);
    return () => clearInterval(id);
  }, [running, mode]);

  const display = `${String(Math.floor(ms / 60000)).padStart(2, "0")}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, "0")}.${Math.floor((ms % 1000) / 100)}`;

  return (
    <ToolLayout icon="⏱️" title="Bấm giờ" description="Stopwatch và đếm ngược linh hoạt">
      <div className="text-center space-y-6 max-w-sm mx-auto">
        <div className="flex gap-2 justify-center">
          {(["stopwatch", "countdown"] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setMs(m === "countdown" ? countdownMin * 60000 : 0); setRunning(false); }} className={`px-4 py-2 rounded-lg text-sm ${mode === m ? "bg-blue-600 text-white" : "border"}`}>{m === "stopwatch" ? "Bấm giờ" : "Đếm ngược"}</button>
          ))}
        </div>
        {mode === "countdown" && !running && ms === 0 && (
          <div className="flex gap-2 justify-center">{[1, 5, 10, 25].map((m) => (
            <button key={m} type="button" onClick={() => { setCountdownMin(m); setMs(m * 60000); }} className="px-3 py-1 border rounded-lg text-sm">{m}p</button>
          ))}</div>
        )}
        <p className="text-6xl font-bold tabular-nums">{display}</p>
        <div className="flex gap-3 justify-center">
          <button type="button" onClick={() => setRunning(!running)} className="px-8 py-3 bg-blue-600 text-white rounded-xl">{running ? "Dừng" : "Bắt đầu"}</button>
          <button type="button" onClick={() => { setRunning(false); setMs(mode === "countdown" ? countdownMin * 60000 : 0); }} className="px-6 py-3 border rounded-xl">Reset</button>
        </div>
      </div>
    </ToolLayout>
  );
}

export function RandomPickerTool() {
  const [items, setItems] = useState("An\nBình\nChi\nDung");
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const pick = () => {
    const list = items.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!list.length) return;
    const chosen = list[Math.floor(Math.random() * list.length)]!;
    setResult(chosen);
    setHistory((h) => [chosen, ...h].slice(0, 20));
  };

  return (
    <ToolLayout icon="🎲" title="Bốc thăm ngẫu nhiên" description="Chọn người trình bày, xổ số mini">
      <div className="space-y-4 max-w-md mx-auto">
        <textarea value={items} onChange={(e) => setItems(e.target.value)} rows={6} placeholder="Mỗi dòng một tên..." className="w-full border rounded-xl p-3 text-sm" />
        <button type="button" onClick={pick} className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-lg">🎲 Bốc thăm!</button>
        {result && <div className="text-center bg-yellow-50 rounded-2xl p-8"><p className="text-sm text-slate-500">Kết quả</p><p className="text-4xl font-bold text-purple-600 mt-2">{result}</p></div>}
        {history.length > 0 && <div className="text-xs text-slate-500">Lịch sử: {history.join(" · ")}</div>}
      </div>
    </ToolLayout>
  );
}

export function LoanCalculatorTool() {
  const [amount, setAmount] = useState("50000000");
  const [rate, setRate] = useState("12");
  const [months, setMonths] = useState("24");
  const p = Number(amount), r = Number(rate) / 100 / 12, n = Number(months);
  const payment = r > 0 ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
  const total = payment * n;

  return (
    <ToolLayout icon="🏦" title="Tính lãi vay" description="Ước tính trả góp hàng tháng">
      <div className="space-y-3 max-w-sm mx-auto">
        {[{ l: "Số tiền vay (VNĐ)", v: amount, s: setAmount }, { l: "Lãi suất (%/năm)", v: rate, s: setRate }, { l: "Số tháng", v: months, s: setMonths }].map(({ l, v, s }) => (
          <div key={l}><label className="text-sm">{l}</label><input type="number" value={v} onChange={(e) => s(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        ))}
        <div className="bg-blue-50 rounded-xl p-5 text-center mt-4">
          <p className="text-2xl font-bold text-blue-600">{Math.round(payment).toLocaleString("vi-VN")} ₫/tháng</p>
          <p className="text-sm text-slate-600 mt-2">Tổng trả: {Math.round(total).toLocaleString("vi-VN")} ₫</p>
          <p className="text-xs text-slate-500">Lãi: {Math.round(total - p).toLocaleString("vi-VN")} ₫</p>
        </div>
      </div>
    </ToolLayout>
  );
}

export function SplitBillTool() {
  const [total, setTotal] = useState("500000");
  const [people, setPeople] = useState("4");
  const [tip, setTip] = useState("10");
  const t = Number(total), p = Number(people) || 1;
  const withTip = t * (1 + Number(tip) / 100);
  const perPerson = withTip / p;

  return (
    <ToolLayout icon="🧾" title="Chia hóa đơn" description="Chia tiền ăn uống công bằng giữa bạn bè">
      <div className="space-y-3 max-w-sm mx-auto">
        <div><label className="text-sm">Tổng bill (VNĐ)</label><input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Số người</label><input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Tip (%)</label><input type="number" value={tip} onChange={(e) => setTip(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div className="bg-green-50 rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-green-600">{Math.round(perPerson).toLocaleString("vi-VN")} ₫</p>
          <p className="text-slate-600 mt-1">Mỗi người trả</p>
        </div>
      </div>
    </ToolLayout>
  );
}

export function AgeCalculatorTool() {
  const [dob, setDob] = useState("2004-01-01");
  const age = useMemo(() => {
    const birth = new Date(dob);
    const now = new Date();
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    if (d < 0) { m--; d += 30; }
    if (m < 0) { y--; m += 12; }
    const days = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    return { y, m, d, days };
  }, [dob]);

  return (
    <ToolLayout icon="🎂" title="Tính tuổi" description="Tính tuổi chính xác đến ngày">
      <div className="space-y-4 max-w-sm mx-auto text-center">
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        <div className="bg-pink-50 rounded-2xl p-6">
          <p className="text-4xl font-bold text-pink-600">{age.y} tuổi</p>
          <p className="text-slate-600 mt-2">{age.m} tháng · {age.d} ngày</p>
          <p className="text-sm text-slate-500 mt-2">Đã sống {age.days.toLocaleString()} ngày 🎉</p>
        </div>
      </div>
    </ToolLayout>
  );
}

export function StudyStreakTool() {
  const [data, setData] = useLocalStorage<{ dates: string[]; lastCheck: string }>("study_streak", { dates: [], lastCheck: "" });
  const today = new Date().toISOString().slice(0, 10);
  const checkedToday = data.dates.includes(today);

  const checkIn = () => {
    if (checkedToday) return;
    setData({ dates: [...data.dates, today], lastCheck: today });
  };

  const streak = useMemo(() => {
    const sorted = [...new Set(data.dates)].sort().reverse();
    let count = 0;
    const d = new Date();
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(d);
      expected.setDate(expected.getDate() - i);
      if (sorted.includes(expected.toISOString().slice(0, 10))) count++;
      else break;
    }
    return count;
  }, [data.dates]);

  return (
    <ToolLayout icon="🔥" title="Chuỗi ngày học" description="Duy trì streak học tập mỗi ngày">
      <div className="text-center space-y-6 max-w-sm mx-auto">
        <p className="text-7xl font-bold text-orange-500">{streak}</p>
        <p className="text-slate-600">ngày liên tiếp 🔥</p>
        <p className="text-sm text-slate-500">Tổng: {data.dates.length} ngày đã check-in</p>
        <button type="button" onClick={checkIn} disabled={checkedToday} className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold disabled:opacity-50">
          {checkedToday ? "✅ Đã check-in hôm nay!" : "📚 Check-in học hôm nay"}
        </button>
      </div>
    </ToolLayout>
  );
}

export function HabitTrackerTool() {
  const [habits, setHabits] = useLocalStorage<{ name: string; days: string[] }[]>("habits", [
    { name: "Đọc sách 30p", days: [] },
    { name: "Tập thể dục", days: [] },
  ]);
  const [newHabit, setNewHabit] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  const toggle = (idx: number) => {
    setHabits(habits.map((h, i) => {
      if (i !== idx) return h;
      const has = h.days.includes(today);
      return { ...h, days: has ? h.days.filter((d) => d !== today) : [...h.days, today] };
    }));
  };

  return (
    <ToolLayout icon="✨" title="Theo dõi thói quen" description="Check-in thói quen hàng ngày">
      <div className="space-y-3 max-w-md mx-auto">
        <div className="flex gap-2">
          <input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} placeholder="Thói quen mới..." className="flex-1 border rounded-lg px-3 py-2 text-sm" />
          <button type="button" onClick={() => { if (newHabit) { setHabits([...habits, { name: newHabit, days: [] }]); setNewHabit(""); } }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Thêm</button>
        </div>
        {habits.map((h, i) => (
          <div key={i} className="flex items-center gap-3 p-3 border rounded-xl">
            <button type="button" onClick={() => toggle(i)} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${h.days.includes(today) ? "bg-green-500 border-green-500 text-white" : "border-slate-300"}`}>
              {h.days.includes(today) ? "✓" : ""}
            </button>
            <div className="flex-1"><p className="font-medium">{h.name}</p><p className="text-xs text-slate-500">{h.days.length} ngày</p></div>
            <button type="button" onClick={() => setHabits(habits.filter((_, j) => j !== i))} className="text-red-400 text-sm">✕</button>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

export function DecisionWheelTool() {
  const [options, setOptions] = useState("Pizza\nBún\nCơm\nPhở\nBánh mì");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const list = options.split("\n").map((s) => s.trim()).filter(Boolean);

  const spin = () => {
    if (spinning || list.length < 2) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * list.length);
    const extra = 360 * 5 + (360 / list.length) * idx;
    setRotation((r) => r + extra);
    setTimeout(() => { setResult(list[idx]!); setSpinning(false); }, 3000);
  };

  return (
    <ToolLayout icon="🎡" title="Vòng quay quyết định" description="Không biết chọn gì? Quay thử!">
      <div className="space-y-4 max-w-md mx-auto text-center">
        <textarea value={options} onChange={(e) => setOptions(e.target.value)} rows={5} className="w-full border rounded-xl p-3 text-sm" placeholder="Mỗi dòng một lựa chọn" />
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-2xl z-10">▼</div>
          <div
            className="w-full h-full rounded-full border-4 border-slate-800 transition-transform duration-[3000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${list.map((_, i) => {
                const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#ef4444"];
                const start = (i / list.length) * 100;
                const end = ((i + 1) / list.length) * 100;
                return `${colors[i % colors.length]} ${start}% ${end}%`;
              }).join(", ")})`,
            }}
          />
        </div>
        <button type="button" onClick={spin} disabled={spinning || list.length < 2} className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold disabled:opacity-50">
          {spinning ? "Đang quay..." : "🎡 Quay!"}
        </button>
        {result && !spinning && <p className="text-2xl font-bold text-purple-600">→ {result}</p>}
      </div>
    </ToolLayout>
  );
}

function toRoman(n: number): string {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = "M CM D CD C XC L XL X IX V IV I".split(" ");
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]!) { result += syms[i]; n -= vals[i]!; }
  }
  return result;
}

function fromRoman(s: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = map[s[i]!] ?? 0;
    const next = map[s[i + 1]!] ?? 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}

export function RomanNumeralTool() {
  const [num, setNum] = useState("2026");
  const [roman, setRoman] = useState("MMXXVI");
  const n = Number(num);

  return (
    <ToolLayout icon="🏛️" title="Số La Mã" description="Chuyển đổi số thập phân ↔ số La Mã">
      <div className="space-y-4 max-w-sm mx-auto">
        <div><label className="text-sm">Số thập phân</label><input type="number" value={num} onChange={(e) => { setNum(e.target.value); const v = Number(e.target.value); if (v > 0 && v < 4000) setRoman(toRoman(v)); }} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Số La Mã</label><input value={roman} onChange={(e) => { setRoman(e.target.value.toUpperCase()); try { setNum(String(fromRoman(e.target.value.toUpperCase()))); } catch { /* */ } }} className="w-full border rounded-lg px-3 py-2 mt-1 font-serif text-xl" /></div>
        {n > 0 && n < 4000 && <div className="text-center bg-amber-50 rounded-xl p-4"><p className="text-3xl font-serif">{toRoman(n)}</p></div>}
      </div>
    </ToolLayout>
  );
}

export function TipCalculatorTool() {
  const [bill, setBill] = useState("500000");
  const [tip, setTip] = useState("10");
  const [people, setPeople] = useState("2");
  const b = Number(bill), t = Number(tip), p = Number(people) || 1;
  const tipAmt = b * t / 100;
  const total = b + tipAmt;

  return (
    <ToolLayout icon="🍽️" title="Tính tiền tip" description="Tính tip và tổng bill nhà hàng">
      <div className="space-y-3 max-w-sm mx-auto">
        <div><label className="text-sm">Bill (VNĐ)</label><input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Tip: {tip}%</label><input type="range" min={0} max={30} value={tip} onChange={(e) => setTip(e.target.value)} className="w-full" /></div>
        <div><label className="text-sm">Số người</label><input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div className="bg-orange-50 rounded-xl p-5 text-center space-y-1">
          <p className="text-sm text-slate-600">Tip: {Math.round(tipAmt).toLocaleString("vi-VN")} ₫</p>
          <p className="text-2xl font-bold text-orange-600">{Math.round(total).toLocaleString("vi-VN")} ₫</p>
          <p className="text-sm">Mỗi người: {Math.round(total / p).toLocaleString("vi-VN")} ₫</p>
        </div>
      </div>
    </ToolLayout>
  );
}

export function WaterReminderTool() {
  const [glasses, setGlasses] = useLocalStorage<number>("water_glasses", 0);
  const [goal] = useState(8);
  const today = new Date().toISOString().slice(0, 10);
  const [lastDay, setLastDay] = useLocalStorage<string>("water_day", today);

  useEffect(() => {
    if (lastDay !== today) { setGlasses(0); setLastDay(today); }
  }, [today, lastDay, setGlasses, setLastDay]);

  return (
    <ToolLayout icon="💧" title="Uống nước" description="Theo dõi lượng nước uống hôm nay">
      <div className="text-center space-y-6 max-w-sm mx-auto">
        <p className="text-6xl">{glasses >= goal ? "🎉" : "💧"}</p>
        <p className="text-4xl font-bold text-blue-600">{glasses}/{goal} ly</p>
        <div className="flex gap-1 justify-center flex-wrap">
          {Array.from({ length: goal }, (_, i) => (
            <div key={i} className={`w-8 h-10 rounded-b-full border-2 ${i < glasses ? "bg-blue-400 border-blue-500" : "border-blue-200"}`} />
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button type="button" onClick={() => setGlasses(Math.max(0, glasses - 1))} className="px-6 py-3 border rounded-xl">−</button>
          <button type="button" onClick={() => setGlasses(glasses + 1)} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">+1 ly 💧</button>
        </div>
      </div>
    </ToolLayout>
  );
}

const PREFIXES = ["Smart", "Quick", "Eco", "Digital", "Future", "Next", "Open", "Cloud", "Data", "AI"];
const SUFFIXES = ["Hub", "Lab", "Sync", "Flow", "Box", "Link", "Core", "Base", "Net", "Pro"];

export function NameGeneratorTool() {
  const [names, setNames] = useState<string[]>([]);
  const generate = () => {
    const batch = Array.from({ length: 5 }, () => {
      const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)]!;
      const s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]!;
      return `${p}${s} ${Math.floor(Math.random() * 100)}`;
    });
    setNames(batch);
  };

  return (
    <ToolLayout icon="✏️" title="Đặt tên dự án" description="Sinh tên ngẫu nhiên cho đồ án, startup mini">
      <div className="space-y-4 max-w-md mx-auto text-center">
        <button type="button" onClick={generate} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold">✨ Sinh tên mới</button>
        <div className="space-y-2">{names.map((n) => (
          <div key={n} className="bg-indigo-50 rounded-lg p-3 font-medium flex justify-between items-center">
            <span>{n}</span>
            <button type="button" onClick={() => navigator.clipboard.writeText(n)} className="text-xs text-blue-600">Copy</button>
          </div>
        ))}</div>
      </div>
    </ToolLayout>
  );
}

export function BaseConverterTool() {
  const [dec, setDec] = useState("255");
  const n = parseInt(dec, 10);
  const valid = !isNaN(n) && n >= 0;

  return (
    <ToolLayout icon="🔣" title="Chuyển hệ số" description="Nhị phân, thập phân, thập lục phân, bát phân">
      <div className="space-y-3 max-w-md mx-auto">
        <div><label className="text-sm font-medium">Thập phân</label><input type="number" min={0} value={dec} onChange={(e) => setDec(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        {valid && (
          <div className="space-y-2">
            {[
              { label: "Nhị phân (BIN)", val: n.toString(2) },
              { label: "Bát phân (OCT)", val: n.toString(8) },
              { label: "Thập lục phân (HEX)", val: n.toString(16).toUpperCase() },
            ].map(({ label, val }) => (
              <div key={label} className="bg-slate-50 rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm text-slate-600">{label}</span>
                <code className="font-mono font-bold">{val}</code>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export function SleepCalculatorTool() {
  const [wakeTime, setWakeTime] = useState("06:30");
  const cycles = [6, 5, 4, 3].map((c) => {
    const [h, m] = wakeTime.split(":").map(Number);
    const wake = new Date();
    wake.setHours(h!, m!, 0, 0);
    const sleep = new Date(wake.getTime() - c * 90 * 60000 - 15 * 60000);
    return `${String(sleep.getHours()).padStart(2, "0")}:${String(sleep.getMinutes()).padStart(2, "0")} (${c} chu kỳ)`;
  });

  return (
    <ToolLayout icon="😴" title="Tính giờ ngủ" description="Tính giờ đi ngủ tối ưu (chu kỳ 90 phút)">
      <div className="space-y-4 max-w-sm mx-auto">
        <div><label className="text-sm">Giờ thức dậy mong muốn</label><input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <p className="text-sm text-slate-600">Nên đi ngủ lúc:</p>
        <div className="space-y-2">{cycles.map((c) => (
          <div key={c} className="bg-indigo-50 rounded-xl p-4 text-center font-bold text-indigo-700">{c}</div>
        ))}</div>
      </div>
    </ToolLayout>
  );
}

export const EXTRA_TOOL_COMPONENTS: Record<string, () => ReactElement> = {
  "password-generator": PasswordGeneratorTool,
  stopwatch: StopwatchTool,
  "random-picker": RandomPickerTool,
  "loan-calculator": LoanCalculatorTool,
  "split-bill": SplitBillTool,
  "age-calculator": AgeCalculatorTool,
  "study-streak": StudyStreakTool,
  "habit-tracker": HabitTrackerTool,
  "decision-wheel": DecisionWheelTool,
  "roman-numeral": RomanNumeralTool,
  "tip-calculator": TipCalculatorTool,
  "water-reminder": WaterReminderTool,
  "name-generator": NameGeneratorTool,
  "base-converter": BaseConverterTool,
  "sleep-calculator": SleepCalculatorTool,
};
