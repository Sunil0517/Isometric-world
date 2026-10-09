import { useGame } from "../store";
let context: AudioContext | null = null;
export type Cue =
  | "strike"
  | "crystal"
  | "rune"
  | "arrow"
  | "bloom"
  | "gem"
  | "heart"
  | "bounce"
  | "boost"
  | "hurt"
  | "splash"
  | "stomp"
  | "win"
  | "draw"
  | "bullseye"
  | "shrine"
  | "critter"
  | "cheer"
  | "twinkle";
// [frequency Hz, glide ratio, oscillator type, gap seconds between notes]
const cues: Record<
  Cue,
  { notes: number[]; glide: number; type: OscillatorType; gap: number }
> = {
  crystal: { notes: [523, 659, 784], glide: 0.95, type: "sine", gap: 0.07 },
  bloom: { notes: [523, 659, 784], glide: 0.95, type: "sine", gap: 0.07 },
  strike: { notes: [180, 720], glide: 0.95, type: "triangle", gap: 0.07 },
  arrow: { notes: [220], glide: 0.2, type: "sine", gap: 0.07 },
  rune: { notes: [440, 660], glide: 0.95, type: "sine", gap: 0.07 },
  gem: { notes: [880, 1320], glide: 1.02, type: "sine", gap: 0.05 },
  heart: { notes: [523, 659, 784, 1047], glide: 1, type: "sine", gap: 0.08 },
  bounce: { notes: [240, 480], glide: 1.9, type: "sine", gap: 0.05 },
  boost: { notes: [330, 495, 660], glide: 1.3, type: "sawtooth", gap: 0.04 },
  hurt: { notes: [260, 170], glide: 0.6, type: "square", gap: 0.09 },
  splash: { notes: [420, 260, 180], glide: 0.5, type: "triangle", gap: 0.05 },
  stomp: { notes: [320, 190], glide: 0.7, type: "triangle", gap: 0.05 },
  win: {
    notes: [523, 659, 784, 1047, 1319],
    glide: 1,
    type: "sine",
    gap: 0.11,
  },
  draw: { notes: [140, 180, 220], glide: 1.2, type: "triangle", gap: 0.06 },
  bullseye: {
    notes: [659, 880, 1318, 1760],
    glide: 1.02,
    type: "sine",
    gap: 0.05,
  },
  shrine: {
    notes: [440, 554, 659, 880, 1108, 1318],
    glide: 1.01,
    type: "sine",
    gap: 0.06,
  },
  critter: { notes: [700, 950, 600], glide: 1.4, type: "sine", gap: 0.04 },
  cheer: {
    notes: [440, 554, 659, 880, 1108],
    glide: 1.05,
    type: "triangle",
    gap: 0.07,
  },
  twinkle: { notes: [1200, 1600, 2000], glide: 0.98, type: "sine", gap: 0.04 },
};
export function playCue(kind: Cue) {
  const game = useGame.getState();
  if (!game.sound || document.hidden) return;
  context ??= new AudioContext();
  if (context.state === "suspended") void context.resume();
  const now = context.currentTime,
    cue = cues[kind],
    // Square and sawtooth are harsher than sine at the same gain.
    level = cue.type === "square" || cue.type === "sawtooth" ? 0.09 : 0.22;
  cue.notes.forEach((frequency, i) => {
    const oscillator = context!.createOscillator(),
      gain = context!.createGain(),
      t = now + i * cue.gap;
    oscillator.type = cue.type;
    oscillator.frequency.setValueAtTime(frequency, t);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * cue.glide,
      t + 0.2,
    );
    gain.gain.setValueAtTime(game.volume * level, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    oscillator.connect(gain);
    gain.connect(context!.destination);
    oscillator.start(t);
    oscillator.stop(t + 0.3);
  });
}
