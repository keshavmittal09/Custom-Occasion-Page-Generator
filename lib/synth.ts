// Tiny Web Audio sequencer for the built-in "synth:*" tracks.
// A lookahead scheduler queues notes slightly ahead of time so playback stays steady.

type Note = [midi: number | null, beats: number];

const HAPPY_BIRTHDAY: Note[] = [
  [67, 0.75], [67, 0.25], [69, 1], [67, 1], [72, 1], [71, 2],
  [67, 0.75], [67, 0.25], [69, 1], [67, 1], [74, 1], [72, 2],
  [67, 0.75], [67, 0.25], [79, 1], [76, 1], [72, 1], [71, 1], [69, 2],
  [77, 0.75], [77, 0.25], [76, 1], [72, 1], [74, 1], [72, 2], [null, 2],
];

// C – G – Am – F arpeggios for "Soft piano"
const CHORDS = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]];
const SOFT_PIANO: Note[] = CHORDS.flatMap((c) => [c[0], c[1], c[2], c[3], c[2], c[1], c[2], c[3]].map((n): Note => [n, 0.5]));

const freq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

type Voice = "musicbox" | "square" | "piano";
const TRACKS: Record<string, { notes: Note[]; beat: number; voice: Voice; bass?: boolean }> = {
  "music-box-birthday": { notes: HAPPY_BIRTHDAY, beat: 0.42, voice: "musicbox" },
  "8bit-birthday": { notes: HAPPY_BIRTHDAY, beat: 0.28, voice: "square", bass: true },
  "soft-piano": { notes: SOFT_PIANO, beat: 0.36, voice: "piano" },
};

export type SynthPlayer = { play(): Promise<void>; pause(): void; stop(): void };

export function createSynthPlayer(id: string): SynthPlayer {
  const track = TRACKS[id] ?? TRACKS["music-box-birthday"];
  const AC: typeof AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
  const ctx = new AC();

  // gentle echo for a "room" feel
  const master = ctx.createGain();
  master.gain.value = 0.55;
  const delay = ctx.createDelay();
  delay.delayTime.value = track.voice === "square" ? 0.18 : 0.28;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.25;
  master.connect(ctx.destination);
  master.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(ctx.destination);

  const tone = (f: number, at: number, len: number, type: OscillatorType, vol: number, decay: number) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(vol, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    osc.connect(g).connect(master);
    osc.start(at);
    osc.stop(at + Math.max(len, decay) + 0.05);
  };

  const playNote = (midi: number, at: number, beats: number) => {
    const f = freq(midi);
    const len = beats * track.beat;
    if (track.voice === "musicbox") {
      tone(f * 2, at, len, "sine", 0.25, 1.4);
      tone(f * 4, at, len, "sine", 0.05, 0.5);
    } else if (track.voice === "square") {
      tone(f, at, len * 0.9, "square", 0.07, len * 0.9);
      if (track.bass) tone(f / 4, at, len, "triangle", 0.18, len);
    } else {
      tone(f, at, len, "triangle", 0.2, 1.6);
      tone(f * 2, at, len, "sine", 0.05, 0.8);
    }
  };

  let index = 0;
  let nextTime = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  const schedule = () => {
    while (nextTime < ctx.currentTime + 0.25) {
      const [midi, beats] = track.notes[index];
      if (midi !== null) playNote(midi, nextTime, beats);
      nextTime += beats * track.beat;
      index = (index + 1) % track.notes.length;
    }
  };

  return {
    async play() {
      await ctx.resume();
      if (!timer) {
        nextTime = Math.max(nextTime, ctx.currentTime + 0.05);
        timer = setInterval(schedule, 25);
      }
    },
    pause() {
      if (timer) clearInterval(timer);
      timer = null;
      ctx.suspend().catch(() => {});
    },
    stop() {
      if (timer) clearInterval(timer);
      timer = null;
      ctx.close().catch(() => {});
    },
  };
}
