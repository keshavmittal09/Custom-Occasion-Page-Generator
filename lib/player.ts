"use client";
import { createSynthPlayer } from "@/lib/synth";

// One interface for every music source: built-in synth tracks, library mp3s and uploads.
// Must be created/played from a user gesture (tap) so mobile browsers allow sound.
export type Player = { play(): Promise<void>; pause(): void; stop(): void };

export function createPlayer(src: string, { loop = true, volume = 0.8 } = {}): Player {
  if (src.startsWith("synth:")) return createSynthPlayer(src.slice(6));

  const audio = new Audio(src);
  audio.loop = loop;
  audio.volume = volume;
  audio.preload = "auto";
  return {
    play: () => audio.play().then(() => undefined),
    pause: () => audio.pause(),
    stop: () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    },
  };
}
