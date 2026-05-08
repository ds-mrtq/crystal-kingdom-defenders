import type { WaveDef, EnemyKind } from '../types';

interface PendingSpawn {
  kind: EnemyKind;
  remaining: number;
  intervalMs: number;
  delayMs: number;
}

export class WaveManager {
  private waves: WaveDef[];
  private currentWaveIndex = -1;
  private pending: PendingSpawn[] = [];
  private readyForNext = true;
  private timeAccum = 0;
  private spawning = false;

  constructor(waves: WaveDef[]) {
    this.waves = waves;
  }

  get totalWaves(): number {
    return this.waves.length;
  }

  get currentWaveNumber(): number {
    return this.currentWaveIndex + 1;
  }

  isReadyForNext(): boolean {
    return this.readyForNext && this.currentWaveIndex < this.waves.length - 1;
  }

  isFinished(): boolean {
    return (
      this.currentWaveIndex >= this.waves.length - 1 &&
      !this.spawning &&
      this.pending.length === 0
    );
  }

  isSpawning(): boolean {
    return this.spawning;
  }

  startNext(): void {
    if (!this.isReadyForNext()) return;
    this.currentWaveIndex++;
    const wave = this.waves[this.currentWaveIndex];
    this.pending = wave.spawns.map((s) => ({
      kind: s.kind,
      remaining: s.count,
      intervalMs: s.spawnInterval,
      delayMs: 0,
    }));
    this.readyForNext = false;
    this.spawning = true;
    this.timeAccum = 0;
  }

  step(deltaMs: number, spawnFn: (kind: EnemyKind) => void): void {
    if (!this.spawning) return;
    this.timeAccum += deltaMs;

    let stillSpawning = false;
    for (const p of this.pending) {
      if (p.remaining <= 0) continue;
      stillSpawning = true;
      p.delayMs -= deltaMs;
      if (p.delayMs <= 0) {
        spawnFn(p.kind);
        p.remaining--;
        p.delayMs = p.intervalMs;
      }
    }
    if (!stillSpawning) {
      this.spawning = false;
    }
  }

  /** Called once all enemies of the wave are gone (dead or leaked). */
  markWaveCleared(): void {
    if (!this.spawning && !this.readyForNext) {
      this.readyForNext = true;
    }
  }

  hasMoreWaves(): boolean {
    return this.currentWaveIndex < this.waves.length - 1;
  }
}
