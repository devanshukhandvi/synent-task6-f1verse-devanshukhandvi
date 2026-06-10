// Procedural Web Audio API Sound Synthesizer for F1VERSE production client
export class SoundEngine {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Audio context is initialized on first user interaction
  }

  public init(): void {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.engineOsc = this.ctx.createOscillator();
      this.engineOsc.type = 'sawtooth';

      this.engineGain = this.ctx.createGain();
      this.engineGain.gain.setValueAtTime(0.0, this.ctx.currentTime);

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = 'lowpass';
      this.noiseFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

      this.engineOsc.connect(this.noiseFilter);
      this.noiseFilter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);

      this.engineOsc.start();
    } catch (e) {
      console.warn("Web Audio Context blocked by sandbox environment:", e);
    }
  }

  public setRPM(rpm: number): void {
    if (!this.ctx || !this.engineOsc || !this.engineGain || this.isMuted) return;
    
    // Map RPM (0 to 15,000) linearly to Frequency (90Hz to 900Hz)
    const targetFreq = 90 + (rpm / 15000) * 810;
    this.engineOsc.frequency.setValueAtTime(targetFreq, this.ctx.currentTime);

    // Dynamic amplitude mapping
    const targetGain = 0.01 + (rpm / 15000) * 0.12;
    this.engineGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
  }

  public playTireScreech(): void {
    if (!this.ctx || this.isMuted) return;

    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2400, this.ctx.currentTime);
    filter.Q.setValueAtTime(7, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noiseSource.start();
  }

  public playBeep(): void {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.engineGain && this.ctx) {
      this.engineGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();
