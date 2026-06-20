/**
 * Generate WAV audio for listening questions + vocabulary using Windows SAPI TTS.
 * Run: node scripts/generate-audio.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const EXAMS_DIR = join(ROOT, "src", "data", "exams");
const VOCAB_DIR = join(ROOT, "src", "data", "vocabulary");
const AUDIO_ROOT = join(ROOT, "public", "audio");

function ensureDir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function escapePs(text) {
  return text.replace(/'/g, "''");
}

function generateWav(wavPath, text) {
  ensureDir(dirname(wavPath));
  if (existsSync(wavPath)) return false;

  const psScript = `
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
try { $synth.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female) } catch {}
$synth.SetOutputToWaveFile('${wavPath.replace(/\\/g, "\\\\")}')
$synth.Speak('${escapePs(text)}')
$synth.Dispose()
`;
  const psFile = wavPath + ".ps1";
  writeFileSync(psFile, psScript, "utf8");
  try {
    execSync(`powershell -ExecutionPolicy Bypass -File "${psFile}"`, { stdio: "pipe", timeout: 30000 });
    return existsSync(wavPath);
  } catch {
    return false;
  }
}

if (!existsSync(join(EXAMS_DIR, "manifest.json"))) {
  console.error("Run npm run generate:content first");
  process.exit(1);
}

let count = 0;
const manifest = JSON.parse(readFileSync(join(EXAMS_DIR, "manifest.json"), "utf8"));

for (const exam of manifest.exams) {
  const data = JSON.parse(readFileSync(join(EXAMS_DIR, exam.file), "utf8"));
  const examAudioDir = join(AUDIO_ROOT, "toeic", data.id);
  ensureDir(examAudioDir);

  for (const q of data.questions) {
    if (!q.transcript) continue;
    const wavPath = join(examAudioDir, `${q.id}.wav`);
    const audioUrl = `/audio/toeic/${data.id}/${q.id}.wav`;
    if (generateWav(wavPath, q.transcript)) {
      q.audioUrl = audioUrl;
      count++;
    } else if (existsSync(wavPath)) {
      q.audioUrl = audioUrl;
    }
  }
  writeFileSync(join(EXAMS_DIR, exam.file), JSON.stringify(data, null, 2));
  console.log(`✓ ${data.id}`);
}

for (const file of readdirSync(VOCAB_DIR).filter((f) => f.startsWith("topic-"))) {
  const data = JSON.parse(readFileSync(join(VOCAB_DIR, file), "utf8"));
  const topicDir = join(AUDIO_ROOT, "vocab", data.topic);
  ensureDir(topicDir);

  for (const card of data.cards) {
    const fname = card.word.replace(/\s+/g, "-").toLowerCase() + ".wav";
    const wavPath = join(topicDir, fname);
    const text = `${card.word}. ${card.exampleSentence}`;
    if (generateWav(wavPath, text)) {
      card.audioUrl = `/audio/vocab/${data.topic}/${fname}`;
      count++;
    } else if (existsSync(wavPath)) {
      card.audioUrl = `/audio/vocab/${data.topic}/${fname}`;
    }
  }
  writeFileSync(join(VOCAB_DIR, file), JSON.stringify(data, null, 2));
  console.log(`✓ vocab ${data.topic}`);
}

console.log(`\nGenerated/updated ${count} new audio files`);
