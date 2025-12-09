// Sound effects using Web Audio API
class SoundEffects {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(frequency, duration, type = 'sine') {
    if (!this.enabled) return;
    
    try {
      this.init();
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      // Softer volume for click sounds
      const initialGain = type === 'sine' ? 0.15 : 0.3;
      gainNode.gain.setValueAtTime(initialGain, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.log('Sound disabled or not supported');
    }
  }

  success() {
    this.playTone(523.25, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.2), 200); // G5
  }

  error() {
    this.playTone(200, 0.2, 'sawtooth');
  }

  achievement() {
    this.playTone(523.25, 0.1); // C5
    setTimeout(() => this.playTone(659.25, 0.1), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.1), 200); // G5
    setTimeout(() => this.playTone(1046.50, 0.3), 300); // C6
  }

  click() {
    this.playTone(600, 0.04, 'sine');
  }

  levelUp() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.playTone(400 + i * 100, 0.1);
      }, i * 100);
    }
  }

  toggle(enabled) {
    this.enabled = enabled;
  }

  // Haptic feedback for mobile
  vibrate(pattern = [10]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
}

export const soundEffects = new SoundEffects();

