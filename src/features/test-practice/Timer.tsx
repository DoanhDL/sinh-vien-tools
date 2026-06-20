interface TimerProps {
  secondsRemaining: number;
}

function Timer({ secondsRemaining }: TimerProps) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isLow = secondsRemaining <= 300;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold ${
        isLow
          ? "bg-red-100 text-red-700 animate-pulse"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      <span>⏱</span>
      <span>
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </span>
      {isLow && <span className="text-sm font-normal">Sắp hết giờ!</span>}
    </div>
  );
}

export default Timer;
