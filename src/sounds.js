// ===== SOUND ENGINE =====
// Web Audio API — 外部ファイル不要！

const createAudioCtx = () => {
  try { return new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; }
};

let _ctx = null;
const getCtx = () => {
  if (!_ctx) _ctx = createAudioCtx();
  if (_ctx && _ctx.state === 'suspended') _ctx.resume();
  return _ctx;
};

const playTone = (freq, type = 'sine', duration = 0.15, vol = 0.3, delay = 0) => {
  const ctx = getCtx(); if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.05);
};

export const sounds = {
  cast: () => {
    const ctx = getCtx(); if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.25);
  },
  catch:   () => [523, 659, 784, 1047].forEach((f, i) => playTone(f, 'triangle', 0.2, 0.25, i * 0.1)),
  correct: () => [523, 659, 784, 1047, 1319].forEach((f, i) => playTone(f, 'triangle', 0.25, 0.3, i * 0.08)),
  wrong:   () => { playTone(200, 'sawtooth', 0.4, 0.3, 0); playTone(150, 'sawtooth', 0.4, 0.2, 0.15); },
  flip:    () => playTone(1000, 'sine', 0.07, 0.15),
  match:   () => { playTone(880, 'sine', 0.15, 0.2, 0); playTone(1100, 'sine', 0.15, 0.2, 0.1); },
  clear:   () => [523, 659, 784, 659, 784, 1047].forEach((f, i) => playTone(f, 'triangle', 0.25, 0.3, i * 0.13)),
  tap:     () => playTone(660, 'sine', 0.08, 0.15),
};
