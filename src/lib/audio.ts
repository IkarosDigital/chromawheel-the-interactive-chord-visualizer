export type Waveform = 'sine' | 'square' | 'sawtooth' | 'triangle';
export interface ADSR {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeVoices: Map<number, { oscillator: OscillatorNode; gain: GainNode }> = new Map();
  public waveform: Waveform = 'triangle';
  public adsr: ADSR = { attack: 0.02, decay: 0.1, sustain: 0.8, release: 0.5 };
  public volume: number = 0.8;
  private initialize(): boolean {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        this.masterGain.connect(this.audioContext.destination);
        return true;
      } catch (e) {
        console.error("Web Audio API is not supported in this browser", e);
        return false;
      }
    }
    return true;
  }
  private midiToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }
  public noteOn(midiNote: number, velocity: number = 100): void {
    if (!this.initialize() || !this.audioContext || !this.masterGain) return;
    if (this.activeVoices.has(midiNote)) {
      this.noteOff(midiNote); // Note re-trigger
    }
    const now = this.audioContext.currentTime;
    const frequency = this.midiToFrequency(midiNote);
    const voiceGain = this.audioContext.createGain();
    voiceGain.connect(this.masterGain);
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = this.waveform;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.connect(voiceGain);
    const attackTime = now + this.adsr.attack;
    const decayTime = attackTime + this.adsr.decay;
    const noteVelocity = velocity / 127;
    voiceGain.gain.setValueAtTime(0, now);
    voiceGain.gain.linearRampToValueAtTime(noteVelocity, attackTime);
    voiceGain.gain.linearRampToValueAtTime(noteVelocity * this.adsr.sustain, decayTime);
    oscillator.start(now);
    this.activeVoices.set(midiNote, { oscillator, gain: voiceGain });
  }

  public noteOff(midiNote: number): void {
    if (!this.audioContext) return;
    const voice = this.activeVoices.get(midiNote);
    if (voice) {
      const now = this.audioContext.currentTime;
      const releaseTime = now + this.adsr.release;
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
      voice.gain.gain.linearRampToValueAtTime(0, releaseTime);
      voice.oscillator.stop(releaseTime);
      this.activeVoices.delete(midiNote);
    }
  }

  public playChord(midiNotes: number[], duration: number = 1): void {
    midiNotes.forEach(note => this.noteOn(note));
    setTimeout(() => {
      midiNotes.forEach(note => this.noteOff(note));
    }, duration * 1000);
  }
  public setVolume(volume: number): void {
    this.volume = volume;
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.05);
    }
  }

  public setWaveform(waveform: Waveform): void {
    this.waveform = waveform;
  }

  public setADSR(adsr: Partial<ADSR>): void {
    this.adsr = { ...this.adsr, ...adsr };
  }
  public async resume(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
}
export const audioEngine = new AudioEngine();