import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native"
import Slider from "@react-native-community/slider"
import { observer } from "mobx-react-lite"
import { audioStore } from "../stores/audioStore"
import { Audio } from "expo-av"
import { formatTitle } from "app/utils/formatTitle"
import Icon from "react-native-vector-icons/MaterialIcons"
import { colors } from "app/theme"

const AudioPlayer: React.FC = observer(() => {
  const [status, setStatus] = useState<Audio.PlaybackStatus | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isBuffering, setIsBuffering] = useState<boolean>(false)
  const [seekValue, setSeekValue] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  useEffect(() => {
    if (audioStore.sound) {
      const handlePlaybackStatusUpdate = (status: Audio.PlaybackStatus) => {
        setStatus(status)
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying)
          setIsBuffering(status.isBuffering)
          setSeekValue(
            status.durationMillis > 0 ? status.positionMillis / status.durationMillis : 0,
          )
          setCurrentTime(status.positionMillis)
          setDuration(status.durationMillis || 0)
        } else {
          console.error("Playback status error:", status)
        }
      }

      audioStore.sound.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate)

      return () => {
        audioStore.sound?.setOnPlaybackStatusUpdate(null)
      }
    }
  }, [audioStore.sound])

  const handlePlayPause = async () => {
    if (audioStore.sound) {
      try {
        if (isPlaying) {
          await audioStore.sound.pauseAsync()
        } else {
          await audioStore.sound.playAsync()
        }
      } catch (error) {
        console.error("Error handling play/pause:", error)
      }
    }
  }

  const handleSeek = async (value: number) => {
    if (audioStore.sound && status?.isLoaded) {
      const positionMillis = value * (status.durationMillis || 0)
      try {
        await audioStore.sound.setPositionAsync(positionMillis)
      } catch (error) {
        console.error("Error seeking:", error)
      }
    }
  }

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(Math.max(milliseconds, 0) / 60000)
    const seconds = Math.floor((Math.max(milliseconds, 0) % 60000) / 1000)
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  return (
    <View style={styles.container}>
      {isBuffering ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <>
          <View style={styles.audioHeader}>
            <View style={styles.audioInfo}>
              <Image
                source={{ uri: `/assets/images/reciters/${audioStore.currentAudio?.reciter}.jpg` }}
                style={styles.albumArt}
              />
              <View style={styles.info}>
                <Text style={styles.title}>
                  {audioStore.currentAudio?.title || "No audio playing"}
                </Text>
                <Text style={styles.artist}>
                  {formatTitle(audioStore.currentAudio?.reciter) || ""}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handlePlayPause} style={styles.playPauseButton}>
              <Icon name={isPlaying ? "pause" : "play-arrow"} size={30} color="#fff" />
            </TouchableOpacity>
          </View>
          <Slider
            style={styles.slider}
            value={seekValue}
            minimumValue={0}
            maximumValue={1}
            onValueChange={(value) => setSeekValue(value)}
            onSlidingComplete={handleSeek}
            disabled={!status?.isLoaded}
            minimumTrackTintColor={colors.tint}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.tint}
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  albumArt: {
    borderRadius: 5,
    height: 60,
    marginRight: 10,
    width: 60,
  },
  artist: {
    color: "#666",
    fontSize: 14,
  },
  audioHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  audioInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  info: {
    flexDirection: "column",
    justifyContent: "center",
  },
  playPauseButton: {
    padding: 10,
    backgroundColor: colors.palette.primary500,
    borderRadius: 5,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default AudioPlayer
