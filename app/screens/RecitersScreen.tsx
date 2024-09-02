import React, { FC, useState, useEffect } from "react"
import {
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  Text as RNText,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { ref, listAll, getDownloadURL } from "firebase/storage"
import { storage } from "../firebase"
import { formatTitle } from "app/utils/formatTitle"
import { observer } from "mobx-react-lite"
import { audioStore } from "../stores/audioStore"
import AudioPlayer from "app/components/AudioPlayer"
import { biographies } from "app/utils/biographies"

interface Reciter {
  name: string
  imageUrl: string
}

interface Collection {
  id: number
  name: string
  imageUrl: string
}

interface Audio {
  name: string
  url: string
  title: string
}

interface DetailedReciter extends Reciter {
  bio?: string
}

type View = "reciters" | "reciter" | "collection"

export const ReciterScreen: FC<DemoTabScreenProps<"Reciters">> = observer(function ReciterScreen(
  _props,
) {
  const [reciters, setReciters] = useState<Reciter[]>([])
  const [selectedReciter, setSelectedReciter] = useState<DetailedReciter | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const [audios, setAudios] = useState<Audio[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<View>("reciters")

  useEffect(() => {
    const fetchReciters = async () => {
      try {
        const listRef = ref(storage, "audio/")
        const res = await listAll(listRef)

        const reciterList = res.prefixes.map((folderRef) => ({
          name: folderRef.name,
          imageUrl: `/assets/images/reciters/${folderRef.name}.jpg`,
        }))

        setReciters(reciterList)
      } catch (error) {
        console.error("Error fetching reciters:", error)
      }
    }

    fetchReciters()
  }, [])

  useEffect(() => {
    const fetchReciterDetails = async () => {
      if (!selectedReciter || collections.length > 0) return

      setLoading(true)
      setError(null)

      try {
        const reciterPath = `audio/${selectedReciter.name}`
        const listRef = ref(storage, reciterPath)

        const res = await listAll(listRef)
        const collectionList = res.prefixes.map((folderRef, index) => ({
          id: index + 1,
          name: folderRef.name,
          imageUrl: `/qari/${folderRef.name}.jpg`,
        }))

        // Simulate fetching biography, replace with actual logic
        const biography = biographies[selectedReciter.name] || "Biography not available."

        setSelectedReciter({
          ...selectedReciter,
          bio: biography,
        })
        setCollections(collectionList)
      } catch (error) {
        console.error("Error fetching reciter details:", error)
        setError("Failed to fetch reciter details.")
      } finally {
        setLoading(false)
      }
    }

    if (selectedReciter && !collections.length) {
      fetchReciterDetails()
    }
  }, [selectedReciter, collections])

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      if (!selectedCollection || !selectedReciter) return

      setLoading(true)
      setError(null)

      try {
        const collectionPath = `audio/${selectedReciter.name}/${selectedCollection}`
        const listRef = ref(storage, collectionPath)

        const res = await listAll(listRef)
        const audioList = await Promise.all(
          res.items.map(async (itemRef) => {
            try {
              const url = await getDownloadURL(itemRef)
              return {
                name: itemRef.name,
                url,
                title: itemRef.name.split(".")[0],
              }
            } catch (urlError) {
              console.error("Error fetching download URL:", urlError)
              return null
            }
          }),
        )

        setAudios(audioList.filter((item) => item !== null) as Audio[])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching collection details:", error)
        setError("Failed to fetch collection details.")
        setLoading(false)
      }
    }

    fetchCollectionDetails()
  }, [selectedCollection, selectedReciter])

  const handleReciterPress = (reciter: Reciter) => {
    setSelectedReciter({ ...reciter })
    setCollections([])
    setSelectedCollection(null)
    setAudios([])
    setCurrentView("reciter")
  }

  const handleCollectionPress = (collectionName: string) => {
    setSelectedCollection(collectionName)
    setCurrentView("collection")
  }

  const handleBack = () => {
    if (currentView === "collection") {
      setSelectedCollection(null)
      setAudios([])
      setCurrentView("reciter")
    } else if (currentView === "reciter") {
      setSelectedReciter(null)
      setCollections([])
      setCurrentView("reciters")
    }
  }

  const handleAudioPress = (audio: Audio) => {
    audioStore.setAudio(
      audio.title,
      audio.url,
      selectedReciter?.name || "",
      selectedCollection || "",
    )
  }

  const renderBackButton = () => {
    if (currentView !== "reciters") {
      return (
        <TouchableOpacity onPress={handleBack} style={$backButton}>
          <RNText style={$backButtonText}>{"< Back"}</RNText>
        </TouchableOpacity>
      )
    }
    return null
  }

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      {renderBackButton()}
      <View>
        {currentView === "reciters" ? (
          <View style={$gridContainer}>
            {reciters.map((reciter, index) => (
              <TouchableOpacity
                key={index}
                style={$gridItem}
                onPress={() => handleReciterPress(reciter)}
              >
                <Image source={{ uri: reciter.imageUrl }} style={$image} resizeMode="cover" />
                <RNText style={$reciterName}>{formatTitle(reciter.name)}</RNText>
              </TouchableOpacity>
            ))}
          </View>
        ) : currentView === "reciter" ? (
          <View>
            <Image
              source={{ uri: selectedReciter?.imageUrl }}
              style={$reciterImage}
              resizeMode="cover"
            />
            <RNText style={$reciterName}>{formatTitle(selectedReciter?.name || "")}</RNText>
            <Text style={$bio}>{selectedReciter?.bio || "Biography not available."}</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
              <RNText style={$error}>{error}</RNText>
            ) : (
              <View style={$collectionsContainer}>
                {collections.map((collection) => (
                  <TouchableOpacity
                    key={collection.id}
                    style={$collectionItem}
                    onPress={() => handleCollectionPress(collection.name)}
                  >
                    <Image
                      source={{ uri: collection.imageUrl }}
                      style={$collectionImage}
                      resizeMode="cover"
                    />
                    <RNText style={$collectionName}>{formatTitle(collection.name)}</RNText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <ScrollView>
            <RNText style={$collectionTitle}>{`Collection: ${formatTitle(
              selectedCollection || "",
            )}`}</RNText>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
              <RNText style={$error}>{error}</RNText>
            ) : (
              <View style={$audiosContainer}>
                {audios.map((audio, index) => (
                  <TouchableOpacity
                    key={index}
                    style={$audioItem}
                    onPress={() => handleAudioPress(audio)}
                  >
                    <RNText style={$audioTitle}>{audio.title}</RNText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Screen>
  )
})

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $reciterImage: ImageStyle = {
  width: 150,
  height: 150,
  borderRadius: 75,
  alignSelf: "center",
  marginBottom: 16,
}

const $reciterName: TextStyle = {
  marginTop: 8,
  fontSize: 18,
  fontWeight: "500",
  color: "#4A5568",
  textAlign: "center",
}

const $bio: TextStyle = {
  marginTop: 16,
  fontSize: 14,
  color: "#4A5568",
  textAlign: "center",
}

const $collectionsContainer: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
}

const $collectionItem: ViewStyle = {
  width: "45%",
  marginBottom: spacing.md,
  alignItems: "center",
}

const $collectionImage: ImageStyle = {
  width: 96,
  height: 96,
  borderRadius: 48,
}

const $collectionName: TextStyle = {
  marginTop: 8,
  fontSize: 14,
  fontWeight: "500",
  color: "#4A5568",
  textAlign: "center",
}

const $gridContainer: ViewStyle = {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-evenly",
}

const $gridItem: ViewStyle = {
  width: "45%",
  alignItems: "center",
  marginBottom: 24,
}

const $image: ImageStyle = {
  width: 96,
  height: 96,
  borderRadius: 48,
}

const $error: TextStyle = {
  color: "red",
  textAlign: "center",
}

const $collectionTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "500",
  color: "#4A5568",
  textAlign: "center",
  marginVertical: 16,
}

const $audiosContainer: ViewStyle = {
  marginTop: 24,
}

const $audioItem: ViewStyle = {
  marginBottom: 16,
}

const $audioTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "500",
  color: "#4A5568",
}

const $backButton: ViewStyle = {
  marginBottom: spacing.md,
}

const $backButtonText: TextStyle = {
  fontSize: 16,
  color: "#007AFF",
}
