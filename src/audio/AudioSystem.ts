/**
 * Procedural audio via Web Audio API.
 * Generates chiptune music + SFX without any external audio files.
 */

type SfxName =
  | 'click'
  | 'fire_arrow'
  | 'fire_magic'
  | 'fire_cannon'
  | 'fire_frost'
  | 'enemy_die'
  | 'enemy_leak'
  | 'coin'
  | 'meteor'
  | 'heal'
  | 'place'
  | 'upgrade'
  | 'victory'
  | 'defeat'
  | 'wave_start';

export class AudioSystem {
  private static instance: AudioSystem | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private muted = false;
  private currentMusic: { stop: () => void } | null = null;

  private constructor() {
    // lazy init on first user gesture
  }

  static get(): AudioSystem {
    if (!AudioSystem.instance) AudioSystem.instance = new AudioSystem();
    return AudioSystem.instance;
  }

  private ensureCtx(): boolean {
    if (this.muted) return false;
    if (!this.ctx) {
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new Ctor();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.7;
        this.masterGain.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.35;
        this.musicGain.connect(this.masterGain);
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.6;
        this.sfxGain.connect(this.masterGain);
      } catch (err) {
        console.warn('AudioContext failed', err);
        return false;
      }
    }
    return this.ctx !== null;
  }

  resume(): void {
    if (!this.ensureCtx()) return;
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  setMuted(m: boolean): void {
    this.muted = m;
    if (this.masterGain) this.masterGain.gain.value = m ? 0 : 0.7;
  }

  isMuted(): boolean {
    return this.muted;
  }

  /** Plays a single tone at given frequency for given ms. */
  private tone(
    freq: number,
    durationMs: number,
    type: OscillatorType = 'square',
    gainPeak = 0.3,
    delay = 0,
  ): void {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime + delay / 1000;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + durationMs / 1000 + 0.05);
  }

  /** Noise burst for percussive SFX. */
  private noise(durationMs: number, gainPeak = 0.3, hi = false): void {
    if (!this.ensureCtx() || !this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * (durationMs / 1000), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (hi ? 1 : 0.6);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainPeak, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
    const filter = this.ctx.createBiquadFilter();
    filter.type = hi ? 'highpass' : 'lowpass';
    filter.frequency.value = hi ? 2000 : 800;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    src.start(now);
    src.stop(now + durationMs / 1000);
  }

  play(name: SfxName): void {
    if (this.muted) return;
    switch (name) {
      case 'click':
        this.tone(880, 80, 'triangle', 0.18);
        break;
      case 'fire_arrow':
        this.tone(720, 60, 'square', 0.12);
        this.tone(540, 70, 'square', 0.1, 30);
        break;
      case 'fire_magic':
        this.tone(660, 120, 'sine', 0.14);
        this.tone(990, 100, 'sine', 0.1, 40);
        break;
      case 'fire_cannon':
        this.noise(180, 0.4, false);
        this.tone(120, 100, 'sawtooth', 0.18);
        break;
      case 'fire_frost':
        this.tone(1320, 90, 'triangle', 0.12);
        this.tone(1760, 70, 'triangle', 0.08, 30);
        break;
      case 'enemy_die':
        this.tone(440, 80, 'square', 0.12);
        this.tone(220, 110, 'square', 0.1, 30);
        break;
      case 'enemy_leak':
        this.tone(180, 240, 'sawtooth', 0.18);
        break;
      case 'coin':
        this.tone(1320, 60, 'square', 0.12);
        this.tone(1760, 80, 'square', 0.1, 40);
        break;
      case 'meteor':
        this.noise(380, 0.5, false);
        this.tone(80, 280, 'sawtooth', 0.22, 80);
        break;
      case 'heal':
        this.tone(880, 100, 'sine', 0.14);
        this.tone(1320, 100, 'sine', 0.14, 80);
        this.tone(1760, 140, 'sine', 0.14, 160);
        break;
      case 'place':
        this.tone(660, 70, 'triangle', 0.16);
        this.tone(880, 90, 'triangle', 0.12, 40);
        break;
      case 'upgrade':
        this.tone(660, 60, 'square', 0.14);
        this.tone(880, 60, 'square', 0.14, 60);
        this.tone(1320, 100, 'square', 0.14, 120);
        break;
      case 'victory':
        [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 200, 'square', 0.16, i * 140));
        break;
      case 'defeat':
        [523, 415, 311, 196].forEach((f, i) => this.tone(f, 240, 'sawtooth', 0.18, i * 160));
        break;
      case 'wave_start':
        this.tone(440, 80, 'square', 0.14);
        this.tone(660, 100, 'square', 0.14, 80);
        break;
    }
  }

  // -------- Music --------
  /** Loops a simple chord-based melody. */
  private playLoop(notes: Array<[number, number]>, type: OscillatorType = 'triangle'): { stop: () => void } {
    if (!this.ensureCtx() || !this.ctx || !this.musicGain) return { stop: () => {} };
    let stopped = false;
    let timeoutId: number | null = null;

    const totalDuration = notes.reduce((s, n) => s + n[1], 0);
    const ctx = this.ctx;
    const musicGain = this.musicGain;

    const playOnce = (startOffset: number): void => {
      if (stopped) return;
      let acc = 0;
      notes.forEach(([freq, durMs]) => {
        if (freq > 0) {
          const now = ctx.currentTime + (startOffset + acc) / 1000;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = type;
          osc.frequency.value = freq;
          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(0.15, now + 0.02);
          g.gain.linearRampToValueAtTime(0.1, now + durMs / 1000 - 0.05);
          g.gain.exponentialRampToValueAtTime(0.0001, now + durMs / 1000);
          osc.connect(g);
          g.connect(musicGain);
          osc.start(now);
          osc.stop(now + durMs / 1000 + 0.02);
        }
        acc += durMs;
      });
      timeoutId = window.setTimeout(() => playOnce(0), totalDuration);
    };

    playOnce(0);
    return {
      stop: () => {
        stopped = true;
        if (timeoutId !== null) window.clearTimeout(timeoutId);
      },
    };
  }

  playMenuTheme(): void {
    if (this.currentMusic) this.currentMusic.stop();
    // Cheerful arpeggio: C-E-G-C-G-E
    const notes: Array<[number, number]> = [
      [523, 250],
      [659, 250],
      [784, 250],
      [1047, 250],
      [784, 250],
      [659, 250],
      [523, 250],
      [659, 250],
      [880, 250],
      [784, 250],
      [659, 250],
      [523, 250],
      [392, 250],
      [523, 250],
      [659, 500],
      [0, 500],
    ];
    this.currentMusic = this.playLoop(notes, 'triangle');
  }

  playBattleTheme(): void {
    if (this.currentMusic) this.currentMusic.stop();
    const notes: Array<[number, number]> = [
      [392, 200],
      [466, 200],
      [523, 200],
      [466, 200],
      [392, 200],
      [349, 200],
      [392, 400],
      [0, 100],
      [523, 200],
      [466, 200],
      [392, 200],
      [349, 200],
      [311, 200],
      [349, 200],
      [392, 400],
      [0, 200],
    ];
    this.currentMusic = this.playLoop(notes, 'square');
  }

  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }
}
