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

export function PomodoroTool() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s > 0) return s - 1;
        if (minutes > 0) {
          setMinutes((m) => m - 1);
          return 59;
        }
        setRunning(false);
        if (mode === "work") {
          setSessions((n) => n + 1);
          setMode("break");
          setMinutes(5);
        } else {
          setMode("work");
          setMinutes(25);
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, minutes, mode]);

  const reset = () => {
    setRunning(false);
    setMode("work");
    setMinutes(25);
    setSeconds(0);
  };

  return (
    <ToolLayout icon="🍅" title="Pomodoro Timer" description="25 phút tập trung, 5 phút nghỉ — không giới hạn phiên học">
      <div className="text-center space-y-6">
        <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${mode === "work" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {mode === "work" ? "🎯 Tập trung" : "☕ Nghỉ ngơi"}
        </span>
        <p className="text-7xl font-bold tabular-nums text-slate-800">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </p>
        <p className="text-slate-500">Đã hoàn thành {sessions} phiên Pomodoro</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button type="button" onClick={() => setRunning(!running)} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
            {running ? "Tạm dừng" : "Bắt đầu"}
          </button>
          <button type="button" onClick={reset} className="px-6 py-3 border rounded-xl hover:bg-slate-50">Reset</button>
        </div>
        <div className="flex gap-2 justify-center">
          {[15, 25, 45].map((m) => (
            <button key={m} type="button" onClick={() => { setMinutes(m); setSeconds(0); setMode("work"); }} className="px-3 py-1 text-sm border rounded-lg hover:border-blue-400">{m}p</button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function StudyScheduleTool() {
  const [schedule, setSchedule] = useLocalStorage<Record<string, string>>("study_schedule", {});

  return (
    <ToolLayout icon="📅" title="Lịch học tuần" description="Lập thời khóa biểu cá nhân cho từng ngày">
      <div className="space-y-3">
        {DAYS.map((day) => (
          <div key={day} className="flex gap-3 items-start">
            <span className="w-10 font-bold text-blue-600 pt-2">{day}</span>
            <textarea
              value={schedule[day] ?? ""}
              onChange={(e) => setSchedule({ ...schedule, [day]: e.target.value })}
              placeholder={`Môn học, giờ, phòng... (${day})`}
              rows={2}
              className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-300 outline-none resize-none"
            />
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

interface Deadline { id: number; title: string; date: string; done: boolean }

export function DeadlineTrackerTool() {
  const [items, setItems] = useLocalStorage<Deadline[]>("deadlines", []);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  const add = () => {
    if (!title || !date) return;
    setItems([...items, { id: Date.now(), title, date, done: false }]);
    setTitle("");
    setDate("");
  };

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ToolLayout icon="⏰" title="Theo dõi deadline" description="Quản lý bài tập và deadline — không giới hạn số lượng">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tên bài tập" className="flex-1 min-w-[150px] border rounded-lg px-3 py-2" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-lg px-3 py-2" />
          <button type="button" onClick={add} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Thêm</button>
        </div>
        {sorted.length === 0 ? <p className="text-slate-500 text-center py-6">Chưa có deadline nào</p> : sorted.map((item) => {
          const daysLeft = Math.ceil((new Date(item.date).getTime() - Date.now()) / 86400000);
          return (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-lg border ${item.done ? "bg-green-50 opacity-60" : "bg-white"}`}>
              <input type="checkbox" checked={item.done} onChange={() => setItems(items.map((i) => i.id === item.id ? { ...i, done: !i.done } : i))} />
              <div className="flex-1">
                <p className={`font-medium ${item.done ? "line-through" : ""}`}>{item.title}</p>
                <p className="text-xs text-slate-500">{item.date} {daysLeft >= 0 ? `· Còn ${daysLeft} ngày` : "· Đã quá hạn"}</p>
              </div>
              <button type="button" onClick={() => setItems(items.filter((i) => i.id !== item.id))} className="text-red-500 text-sm hover:underline">Xóa</button>
            </div>
          );
        })}
      </div>
    </ToolLayout>
  );
}

export function ExamCountdownTool() {
  const [exams, setExams] = useLocalStorage<{ id: number; name: string; date: string }[]>("exam_countdowns", []);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [, tick] = useState(0);
  useEffect(() => { const id = setInterval(() => tick((t) => t + 1), 60000); return () => clearInterval(id); }, []);

  const add = () => {
    if (!name || !date) return;
    setExams([...exams, { id: Date.now(), name, date }]);
    setName("");
    setDate("");
  };

  return (
    <ToolLayout icon="🗓️" title="Đếm ngược kỳ thi" description="Theo dõi thời gian còn lại đến ngày thi">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên kỳ thi" className="flex-1 border rounded-lg px-3 py-2" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border rounded-lg px-3 py-2" />
          <button type="button" onClick={add} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Thêm</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {exams.map((exam) => {
            const diff = new Date(exam.date).getTime() - Date.now();
            const days = Math.max(0, Math.ceil(diff / 86400000));
            return (
              <div key={exam.id} className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-5 text-center relative">
                <button type="button" onClick={() => setExams(exams.filter((e) => e.id !== exam.id))} className="absolute top-2 right-2 text-white/70 hover:text-white text-xs">✕</button>
                <p className="font-semibold">{exam.name}</p>
                <p className="text-4xl font-bold mt-2">{days}</p>
                <p className="text-sm opacity-80">ngày còn lại</p>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}

export function WordCounterTool() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter(Boolean).length : 0;

  return (
    <ToolLayout icon="📝" title="Đếm từ văn bản" description="Đếm từ, ký tự, câu cho bài luận và báo cáo">
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Dán hoặc gõ văn bản vào đây..." rows={10} className="w-full border rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {[{ label: "Từ", val: words }, { label: "Ký tự", val: chars }, { label: "Ký tự (không space)", val: charsNoSpace }, { label: "Câu", val: sentences }, { label: "Đoạn", val: paragraphs }].map(({ label, val }) => (
          <div key={label} className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{val}</p>
            <p className="text-xs text-slate-600">{label}</p>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}

export function ReadingTimeTool() {
  const [text, setText] = useState("");
  const [wpm, setWpm] = useState(200);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const minutes = words > 0 ? Math.ceil(words / wpm) : 0;

  return (
    <ToolLayout icon="📖" title="Thời gian đọc" description="Ước tính thời gian đọc tài liệu học tập">
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-600">Tốc độ đọc: {wpm} từ/phút</label>
          <input type="range" min={100} max={400} value={wpm} onChange={(e) => setWpm(Number(e.target.value))} className="w-full mt-1" />
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Dán nội dung cần đọc..." rows={8} className="w-full border rounded-lg p-4 text-sm outline-none focus:ring-2 focus:ring-blue-300" />
        <div className="text-center bg-indigo-50 rounded-xl p-6">
          <p className="text-4xl font-bold text-indigo-600">{minutes} phút</p>
          <p className="text-slate-600 mt-1">{words} từ · ~{wpm} từ/phút</p>
        </div>
      </div>
    </ToolLayout>
  );
}

interface FlashCard { id: number; front: string; back: string }

export function FlashcardMakerTool() {
  const [cards, setCards] = useLocalStorage<FlashCard[]>("custom_flashcards", []);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const add = () => {
    if (!front || !back) return;
    setCards([...cards, { id: Date.now(), front, back }]);
    setFront("");
    setBack("");
  };

  const current = cards[idx];

  return (
    <ToolLayout icon="🃏" title="Tạo flashcard" description="Tạo và ôn flashcard tùy chỉnh — không giới hạn số thẻ">
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <input value={front} onChange={(e) => setFront(e.target.value)} placeholder="Mặt trước" className="flex-1 border rounded-lg px-3 py-2" />
          <input value={back} onChange={(e) => setBack(e.target.value)} placeholder="Mặt sau" className="flex-1 border rounded-lg px-3 py-2" />
          <button type="button" onClick={add} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Thêm thẻ</button>
        </div>
        {cards.length > 0 && current && (
          <div className="space-y-3">
            <button type="button" onClick={() => setFlipped(!flipped)} className="w-full min-h-[160px] bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-2xl p-6 text-xl font-medium shadow-lg hover:scale-[1.02] transition">
              {flipped ? current.back : current.front}
            </button>
            <div className="flex justify-between items-center">
              <button type="button" disabled={idx === 0} onClick={() => { setIdx(idx - 1); setFlipped(false); }} className="px-4 py-2 border rounded-lg disabled:opacity-40">← Trước</button>
              <span className="text-sm text-slate-500">{idx + 1}/{cards.length}</span>
              <button type="button" disabled={idx >= cards.length - 1} onClick={() => { setIdx(idx + 1); setFlipped(false); }} className="px-4 py-2 border rounded-lg disabled:opacity-40">Sau →</button>
            </div>
          </div>
        )}
        <p className="text-sm text-slate-500 text-center">Tổng: {cards.length} thẻ</p>
      </div>
    </ToolLayout>
  );
}

export function MarkdownPreviewTool() {
  const [md, setMd] = useState("# Tiêu đề\n\n**In đậm** và *nghiêng*\n\n- Mục 1\n- Mục 2");

  const html = useMemo(() => {
    return md
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, "<br/>");
  }, [md]);

  return (
    <ToolLayout icon="📄" title="Xem Markdown" description="Soạn thảo và xem trước Markdown cho ghi chú học tập">
      <div className="grid md:grid-cols-2 gap-4">
        <textarea value={md} onChange={(e) => setMd(e.target.value)} rows={14} className="w-full border rounded-lg p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-blue-300" />
        <div className="border rounded-lg p-4 bg-slate-50 overflow-auto text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </ToolLayout>
  );
}

export function PercentageTool() {
  const [score, setScore] = useState("");
  const [total, setTotal] = useState("10");
  const pct = score && total && Number(total) > 0 ? ((Number(score) / Number(total)) * 100).toFixed(1) : null;

  return (
    <ToolLayout icon="％" title="Tính phần trăm" description="Tính % điểm thi, tỷ lệ hoàn thành bài tập">
      <div className="space-y-4 max-w-sm mx-auto">
        <div><label className="text-sm text-slate-600">Điểm đạt được</label><input type="number" value={score} onChange={(e) => setScore(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm text-slate-600">Tổng điểm</label><input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        {pct !== null && (
          <div className="text-center bg-green-50 rounded-xl p-6">
            <p className="text-5xl font-bold text-green-600">{pct}%</p>
            <div className="mt-3 h-3 bg-green-100 rounded-full"><div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${Math.min(100, Number(pct))}%` }} /></div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

type UnitType = "length" | "weight" | "temp";

export function UnitConverterTool() {
  const [type, setType] = useState<UnitType>("length");
  const [value, setValue] = useState("1");
  const num = Number(value) || 0;

  const results = useMemo(() => {
    if (type === "length") return { km: num, mile: num * 0.621371, m: num * 1000, ft: num * 3280.84 };
    if (type === "weight") return { kg: num, lb: num * 2.20462, g: num * 1000, oz: num * 35.274 };
    return { celsius: num, fahrenheit: num * 9 / 5 + 32, kelvin: num + 273.15 };
  }, [type, num]);

  return (
    <ToolLayout icon="📐" title="Chuyển đổi đơn vị" description="Chuyển đổi km, mile, kg, lb, °C, °F...">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(["length", "weight", "temp"] as UnitType[]).map((t) => (
            <button key={t} type="button" onClick={() => setType(t)} className={`px-4 py-2 rounded-lg text-sm ${type === t ? "bg-blue-600 text-white" : "border"}`}>
              {t === "length" ? "Chiều dài" : t === "weight" ? "Khối lượng" : "Nhiệt độ"}
            </button>
          ))}
        </div>
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full border rounded-lg px-4 py-3 text-lg" placeholder={type === "length" ? "Nhập km" : type === "weight" ? "Nhập kg" : "Nhập °C"} />
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(results).map(([unit, val]) => (
            <div key={unit} className="bg-slate-50 rounded-lg p-3">
              <p className="text-lg font-bold">{val.toFixed(2)}</p>
              <p className="text-xs text-slate-500 uppercase">{unit}</p>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

const RATES: Record<string, number> = { VND: 1, USD: 25400, EUR: 27500, JPY: 170, KRW: 19, CNY: 3500 };

export function CurrencyTool() {
  const [amount, setAmount] = useState("1000000");
  const [from, setFrom] = useState("VND");
  const num = Number(amount) || 0;
  const inVnd = num * (RATES[from] ?? 1);

  return (
    <ToolLayout icon="💱" title="Chuyển đổi tiền tệ" description="Chuyển đổi VND, USD, EUR, JPY... (tỷ giá tham khảo)">
      <div className="space-y-4">
        <div className="flex gap-2">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 border rounded-lg px-4 py-3 text-lg" />
          <select value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded-lg px-3">
            {Object.keys(RATES).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid gap-2">
          {Object.entries(RATES).filter(([c]) => c !== from).map(([currency, rate]) => (
            <div key={currency} className="flex justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium">{currency}</span>
              <span>{(inVnd / rate).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-amber-600 text-center">⚠ Tỷ giá tham khảo, không phải tỷ giá ngân hàng</p>
      </div>
    </ToolLayout>
  );
}

export function BmiTool() {
  const [height, setHeight] = useState("170");
  const [weight, setWeight] = useState("65");
  const h = Number(height) / 100;
  const w = Number(weight);
  const bmi = h > 0 && w > 0 ? w / (h * h) : null;
  const label = bmi ? bmi < 18.5 ? "Thiếu cân" : bmi < 23 ? "Bình thường" : bmi < 25 ? "Thừa cân" : "Béo phì" : null;

  return (
    <ToolLayout icon="⚖️" title="Tính BMI" description="Chỉ số khối cơ thể cho sinh viên">
      <div className="space-y-4 max-w-sm mx-auto">
        <div><label className="text-sm">Chiều cao (cm)</label><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Cân nặng (kg)</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        {bmi !== null && (
          <div className="text-center bg-blue-50 rounded-xl p-6">
            <p className="text-5xl font-bold text-blue-600">{bmi.toFixed(1)}</p>
            <p className="text-lg mt-2 font-medium">{label}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export function AttendanceTool() {
  const [total, setTotal] = useState("30");
  const [attended, setAttended] = useState("28");
  const [maxAbsence, setMaxAbsence] = useState("20");
  const t = Number(total), a = Number(attended), max = Number(maxAbsence);
  const rate = t > 0 ? (a / t) * 100 : 0;
  const canMiss = t > 0 ? Math.floor(t * max / 100) - (t - a) : 0;

  return (
    <ToolLayout icon="✅" title="Tính điểm danh" description="Tính tỷ lệ điểm danh và số buổi được phép vắng">
      <div className="space-y-4 max-w-sm mx-auto">
        <div><label className="text-sm">Tổng buổi học</label><input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Số buổi đã đi</label><input type="number" value={attended} onChange={(e) => setAttended(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">% vắng tối đa cho phép</label><input type="number" value={maxAbsence} onChange={(e) => setMaxAbsence(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div className="bg-green-50 rounded-xl p-5 text-center space-y-2">
          <p className="text-3xl font-bold text-green-600">{rate.toFixed(1)}%</p>
          <p className="text-slate-600">Tỷ lệ điểm danh hiện tại</p>
          <p className={`text-lg font-semibold ${canMiss >= 0 ? "text-blue-600" : "text-red-600"}`}>
            {canMiss >= 0 ? `Còn được vắng ${canMiss} buổi` : `Đã vượt ${Math.abs(canMiss)} buổi cho phép`}
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}

export function SemesterCostTool() {
  const [tuition, setTuition] = useState("15000000");
  const [rent, setRent] = useState("2500000");
  const [food, setFood] = useState("3000000");
  const [other, setOther] = useState("1000000");
  const total = [tuition, rent, food, other].reduce((s, v) => s + (Number(v) || 0), 0);

  return (
    <ToolLayout icon="💸" title="Chi phí học kỳ" description="Ước tính tổng chi phí học tập mỗi học kỳ">
      <div className="space-y-3 max-w-md mx-auto">
        {[{ label: "Học phí", val: tuition, set: setTuition }, { label: "Thuê nhà/KTX", val: rent, set: setRent }, { label: "Ăn uống", val: food, set: setFood }, { label: "Chi phí khác", val: other, set: setOther }].map(({ label, val, set }) => (
          <div key={label}><label className="text-sm">{label} (VNĐ)</label><input type="number" value={val} onChange={(e) => set(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        ))}
        <div className="bg-purple-50 rounded-xl p-5 text-center mt-4">
          <p className="text-3xl font-bold text-purple-600">{total.toLocaleString("vi-VN")} ₫</p>
          <p className="text-slate-600 mt-1">Tổng chi phí / học kỳ</p>
          <p className="text-sm text-slate-500 mt-1">~{(total / 5).toLocaleString("vi-VN")} ₫ / tháng (5 tháng)</p>
        </div>
      </div>
    </ToolLayout>
  );
}

export function GpaTargetTool() {
  const [currentGpa, setCurrentGpa] = useState("3.2");
  const [currentCredits, setCurrentCredits] = useState("60");
  const [targetGpa, setTargetGpa] = useState("3.5");
  const [nextCredits, setNextCredits] = useState("18");
  const cg = Number(currentGpa), cc = Number(currentCredits), tg = Number(targetGpa), nc = Number(nextCredits);
  const needed = cc > 0 && nc > 0 ? ((tg * (cc + nc)) - cg * cc) / nc : null;

  return (
    <ToolLayout icon="🎯" title="GPA mục tiêu" description="Tính GPA cần đạt kỳ tới để đạt mục tiêu tích lũy">
      <div className="space-y-3 max-w-sm mx-auto">
        <div><label className="text-sm">GPA hiện tại (hệ 4)</label><input type="number" step="0.01" value={currentGpa} onChange={(e) => setCurrentGpa(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Tín chỉ đã tích lũy</label><input type="number" value={currentCredits} onChange={(e) => setCurrentCredits(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">GPA mục tiêu</label><input type="number" step="0.01" value={targetGpa} onChange={(e) => setTargetGpa(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Tín chỉ kỳ tới</label><input type="number" value={nextCredits} onChange={(e) => setNextCredits(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        {needed !== null && (
          <div className={`rounded-xl p-5 text-center ${needed <= 4 ? "bg-blue-50" : "bg-red-50"}`}>
            <p className="text-3xl font-bold">{needed.toFixed(2)}</p>
            <p className="text-slate-600 mt-1">GPA cần đạt kỳ tới</p>
            {needed > 4 && <p className="text-red-600 text-sm mt-2">Mục tiêu không khả thi với hệ 4</p>}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export function GroupGeneratorTool() {
  const [names, setNames] = useState("");
  const [groupSize, setGroupSize] = useState("4");
  const [groups, setGroups] = useState<string[][]>([]);

  const generate = useCallback(() => {
    const list = names.split("\n").map((n) => n.trim()).filter(Boolean);
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    const size = Number(groupSize) || 4;
    const result: string[][] = [];
    for (let i = 0; i < shuffled.length; i += size) {
      result.push(shuffled.slice(i, i + size));
    }
    setGroups(result);
  }, [names, groupSize]);

  return (
    <ToolLayout icon="👥" title="Tạo nhóm ngẫu nhiên" description="Chia nhóm công bằng cho bài tập nhóm">
      <div className="space-y-4">
        <textarea value={names} onChange={(e) => setNames(e.target.value)} placeholder="Nhập tên sinh viên, mỗi dòng một tên..." rows={6} className="w-full border rounded-lg p-3 text-sm" />
        <div className="flex gap-3 items-center">
          <label className="text-sm">Số người/nhóm:</label>
          <input type="number" min={2} value={groupSize} onChange={(e) => setGroupSize(e.target.value)} className="w-20 border rounded-lg px-2 py-1" />
          <button type="button" onClick={generate} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Chia nhóm</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {groups.map((g, i) => (
            <div key={i} className="bg-blue-50 rounded-xl p-4">
              <p className="font-bold text-blue-700 mb-2">Nhóm {i + 1}</p>
              <ul className="text-sm space-y-1">{g.map((n) => <li key={n}>• {n}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

export function CitationTool() {
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");

  const citation = author && year && title
    ? `${author} (${year}). ${title}.${source ? ` ${source}.` : ""}`
    : null;

  return (
    <ToolLayout icon="📚" title="Trích dẫn APA" description="Tạo trích dẫn APA cơ bản cho bài luận">
      <div className="space-y-3 max-w-lg mx-auto">
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Tác giả (VD: Nguyễn, V. A.)" className="w-full border rounded-lg px-3 py-2" />
        <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Năm xuất bản" className="w-full border rounded-lg px-3 py-2" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề bài/báo" className="w-full border rounded-lg px-3 py-2" />
        <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Nguồn (tạp chí, URL...)" className="w-full border rounded-lg px-3 py-2" />
        {citation && (
          <div className="bg-slate-50 rounded-xl p-4 mt-4">
            <p className="text-sm font-mono leading-relaxed">{citation}</p>
            <button type="button" onClick={() => navigator.clipboard.writeText(citation)} className="mt-3 text-sm text-blue-600 hover:underline">📋 Sao chép</button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

export function ScholarshipTool() {
  const [gpa, setGpa] = useState("3.5");
  const [credits, setCredits] = useState("45");
  const [activities, setActivities] = useState("3");
  const g = Number(gpa), c = Number(credits), a = Number(activities);
  const score = g * 25 + Math.min(c, 60) * 0.5 + a * 5;
  const level = score >= 120 ? "Xuất sắc — Loại I" : score >= 100 ? "Giỏi — Loại II" : score >= 80 ? "Khá — Loại III" : "Chưa đủ điều kiện";

  return (
    <ToolLayout icon="🏆" title="Học bổng ước tính" description="Kiểm tra mức học bổng khả năng đạt được (thang điểm tham khảo)">
      <div className="space-y-3 max-w-sm mx-auto">
        <div><label className="text-sm">GPA (hệ 4)</label><input type="number" step="0.01" value={gpa} onChange={(e) => setGpa(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Tín chỉ tích lũy</label><input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div><label className="text-sm">Hoạt động ngoại khóa</label><input type="number" value={activities} onChange={(e) => setActivities(e.target.value)} className="w-full border rounded-lg px-3 py-2 mt-1" /></div>
        <div className="bg-amber-50 rounded-xl p-5 text-center">
          <p className="text-4xl font-bold text-amber-600">{score.toFixed(0)}</p>
          <p className="text-lg font-medium mt-2">{level}</p>
          <p className="text-xs text-slate-500 mt-2">Thang điểm tham khảo, không phải kết quả chính thức</p>
        </div>
      </div>
    </ToolLayout>
  );
}

export function CalculatorTool() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);

  const input = (val: string) => {
    setDisplay((d) => (d === "0" && val !== "." ? val : d + val));
  };

  const calculate = (a: number, b: number, operation: string) => {
    switch (operation) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      case "^": return Math.pow(a, b);
      default: return b;
    }
  };

  const handleOp = (operation: string) => {
    setPrev(Number(display));
    setOp(operation);
    setDisplay("0");
  };

  const equals = () => {
    if (prev !== null && op) {
      setDisplay(String(calculate(prev, Number(display), op)));
      setPrev(null);
      setOp(null);
    }
  };

  const buttons = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0", ".", "=", "+"];

  return (
    <ToolLayout icon="🔢" title="Máy tính" description="Máy tính khoa học cơ bản cho sinh viên">
      <div className="max-w-xs mx-auto">
        <div className="bg-slate-800 text-white text-right text-3xl font-mono p-4 rounded-t-xl min-h-[60px]">{display}</div>
        <div className="grid grid-cols-4 gap-1 bg-slate-200 p-1 rounded-b-xl">
          <button type="button" onClick={() => { setDisplay("0"); setPrev(null); setOp(null); }} className="col-span-2 bg-red-400 text-white p-4 rounded font-bold">C</button>
          <button type="button" onClick={() => handleOp("^")} className="bg-slate-600 text-white p-4 rounded">x^y</button>
          <button type="button" onClick={() => setDisplay(String(Math.sqrt(Number(display))))} className="bg-slate-600 text-white p-4 rounded">√</button>
          {buttons.map((b) => (
            <button key={b} type="button" onClick={() => b === "=" ? equals() : ["+", "-", "×", "÷"].includes(b) ? handleOp(b) : input(b)} className={`p-4 rounded font-bold ${b === "=" ? "bg-blue-600 text-white" : ["+", "-", "×", "÷"].includes(b) ? "bg-orange-400 text-white" : "bg-white"}`}>{b}</button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}

export function QuickNotesTool() {
  const [notes, setNotes] = useLocalStorage<string>("quick_notes", "");

  return (
    <ToolLayout icon="📋" title="Ghi chú nhanh" description="Ghi chú tự động lưu — không giới hạn dung lượng">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Ghi chú bài học, ý tưởng, to-do..."
        rows={16}
        className="w-full border rounded-lg p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-blue-300 resize-none"
      />
      <p className="text-xs text-slate-500 mt-2 text-center">Tự động lưu · {notes.length} ký tự · {notes.trim() ? notes.trim().split(/\s+/).length : 0} từ</p>
    </ToolLayout>
  );
}

export const TOOL_COMPONENTS: Record<string, () => ReactElement> = {
  pomodoro: PomodoroTool,
  "study-schedule": StudyScheduleTool,
  "deadline-tracker": DeadlineTrackerTool,
  "exam-countdown": ExamCountdownTool,
  "word-counter": WordCounterTool,
  "reading-time": ReadingTimeTool,
  "flashcard-maker": FlashcardMakerTool,
  "markdown-preview": MarkdownPreviewTool,
  percentage: PercentageTool,
  "unit-converter": UnitConverterTool,
  currency: CurrencyTool,
  bmi: BmiTool,
  attendance: AttendanceTool,
  "semester-cost": SemesterCostTool,
  "gpa-target": GpaTargetTool,
  "group-generator": GroupGeneratorTool,
  citation: CitationTool,
  scholarship: ScholarshipTool,
  calculator: CalculatorTool,
  "quick-notes": QuickNotesTool,
};
