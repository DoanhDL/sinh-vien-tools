import { useCallback, useRef, useState } from "react";

interface AudioPlayerProps {
  audioUrl?: string;
  transcript?: string;
}

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;

function AudioPlayer({ audioUrl, transcript }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [playCount, setPlayCount] = useState(0);

  const handlePlayFile = () => {
    if (!audioRef.current || !audioUrl || isPlaying) return;
    audioRef.current.playbackRate = speed;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleReplay = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }
    handlePlayTts();
  };

  const handlePlayTts = useCallback(() => {
    if (!transcript || !("speechSynthesis" in window) || isPlaying) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(transcript);
    utter.lang = "en-US";
    utter.rate = speed * 0.9;
    utter.onstart = () => setIsPlaying(true);
    utter.onend = () => {
      setIsPlaying(false);
      setPlayCount((c) => c + 1);
    };
    window.speechSynthesis.speak(utter);
  }, [transcript, speed, isPlaying]);

  const handleEnded = () => {
    setIsPlaying(false);
    setPlayCount((c) => c + 1);
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const hasFile = Boolean(audioUrl);
  const hasAudio = hasFile || transcript;

  if (!hasAudio) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        🔊 Phần nghe — đọc câu hỏi và chọn đáp án phù hợp nhất.
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 space-y-3">
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} preload="auto" />
      )}

      <div className="flex flex-wrap items-center gap-2">
        {audioUrl && (
          <button
            type="button"
            onClick={isPlaying ? handlePause : handlePlayFile}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm"
          >
            {isPlaying ? "⏸ Tạm dừng" : "▶ Phát audio"}
          </button>
        )}
        {transcript && !audioUrl && (
          <button
            type="button"
            onClick={isPlaying ? handlePause : handlePlayTts}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
          >
            {isPlaying ? "⏸ Tạm dừng" : "🔊 Nghe (TTS)"}
          </button>
        )}
        <button
          type="button"
          onClick={handleReplay}
          className="bg-white border border-blue-300 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-sm font-medium"
        >
          ↺ Nghe lại
        </button>

        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-slate-500 mr-1">Tốc độ:</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => changeSpeed(s)}
              className={`px-2 py-1 rounded text-xs font-medium transition ${
                speed === s
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-blue-700">
        <span>🔊 Nghe không giới hạn — phát lại bao nhiêu lần cũng được</span>
        {playCount > 0 && <span>Đã nghe {playCount} lần</span>}
      </div>

      {transcript && (
        <details className="text-xs text-slate-600">
          <summary className="cursor-pointer text-blue-600 font-medium">
            Xem transcript
          </summary>
          <p className="mt-2 italic bg-white/60 p-3 rounded-lg leading-relaxed">
            {transcript}
          </p>
        </details>
      )}
    </div>
  );
}

export default AudioPlayer;
