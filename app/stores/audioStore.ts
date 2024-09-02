import { makeAutoObservable } from 'mobx';
import { Audio } from 'expo-av';

class AudioStore {
  currentAudio: { title: string; url: string; reciter: string; collection: string } | null = null;
  sound: Audio.Sound | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async setAudio(title: string, url: string, reciter: string, collection: string) {
    // Stop and unload the previous sound
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
    }

    this.currentAudio = { title, url, reciter, collection };

    // Create a new Sound instance
    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: true }
    );

    this.sound = sound;

    // Handle playback status updates
    this.sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish && !status.isLooping) {
        this.stopAudio();
      }
    });
  }

  async stopAudio() {
    if (this.sound) {
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
    }
    this.currentAudio = null;
  }

  // Computed property to check if audio is playing
  get isPlaying() {
    return this.currentAudio !== null;
  }
}

export const audioStore = new AudioStore();
