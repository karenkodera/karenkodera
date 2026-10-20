/** Paper-peel rustle synthesized in the browser. No sampled assets. */

let audioCtx = null;
let noiseBuffer = null;
let master = null;

function context() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
    master = audioCtx.createGain();
    master.gain.value = 0.22;
    master.connect(audioCtx.destination);
    const length = audioCtx.sampleRate;
    noiseBuffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function startPeelRustle() {
  const ctx = context();
  if (!ctx || !noiseBuffer) return { set() {}, stop() {} };

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.6;
  filter.frequency.value = 2200;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  source.connect(filter).connect(gain).connect(master);
  source.start(ctx.currentTime, Math.random() * 0.4);

  let stopped = false;
  return {
    set(progress, speed) {
      if (stopped) return;
      const now = ctx.currentTime;
      const vol = Math.min(0.55, progress * 0.22 + Math.min(speed, 1.4) * 0.16);
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(vol, now, 0.02);
      gain.gain.setTargetAtTime(vol * 0.2, now + 0.06, 0.08);
      filter.frequency.setTargetAtTime(1600 + progress * 2800 + Math.min(speed, 1) * 600, now, 0.05);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setTargetAtTime(0, now, 0.03);
      source.stop(now + 0.25);
    },
  };
}

export function playPeelSnap() {
  const ctx = context();
  if (!ctx || !noiseBuffer) return;
  const now = ctx.currentTime + 0.005;
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;
  source.playbackRate.value = 1.7;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1800;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.7, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  source.connect(filter).connect(gain).connect(master);
  source.start(now, Math.random() * 0.4);
  source.stop(now + 0.14);
}
