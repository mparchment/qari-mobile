import React, { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { ListItem, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { openLinkInBrowser } from "../utils/openLinkInBrowser"
import { isRTL } from "../i18n"

const chainReactLogo = require("../../assets/images/demo/cr-logo.png")
const reactNativeLiveLogo = require("../../assets/images/demo/rnl-logo.png")
const reactNativeRadioLogo = require("../../assets/images/demo/rnr-logo.png")
const reactNativeNewsletterLogo = require("../../assets/images/demo/rnn-logo.png")

export const ReciterScreen: FC<DemoTabScreenProps<"Reciters">> = function ReciterScreen(_props) {
  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <Text preset="heading" tx="ReciterScreen.title" style={$title} />
      <Text tx="ReciterScreen.tagLine" style={$tagline} />

      <Text preset="subheading" tx="ReciterScreen.joinUsOnSlackTitle" />
      <Text tx="ReciterScreen.joinUsOnSlack" style={$description} />
      <ListItem
        tx="ReciterScreen.joinSlackLink"
        leftIcon="slack"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://community.infinite.red/")}
      />
      <Text
        preset="subheading"
        tx="ReciterScreen.makeIgniteEvenBetterTitle"
        style={$sectionTitle}
      />
      <Text tx="ReciterScreen.makeIgniteEvenBetter" style={$description} />
      <ListItem
        tx="ReciterScreen.contributeToIgniteLink"
        leftIcon="github"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://github.com/infinitered/ignite")}
      />

      <Text
        preset="subheading"
        tx="ReciterScreen.theLatestInReactNativeTitle"
        style={$sectionTitle}
      />
      <Text tx="ReciterScreen.theLatestInReactNative" style={$description} />
      <ListItem
        tx="ReciterScreen.reactNativeRadioLink"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={$logoContainer}>
            <Image source={reactNativeRadioLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://reactnativeradio.com/")}
      />
      <ListItem
        tx="ReciterScreen.reactNativeNewsletterLink"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={$logoContainer}>
            <Image source={reactNativeNewsletterLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://reactnativenewsletter.com/")}
      />
      <ListItem
        tx="ReciterScreen.reactNativeLiveLink"
        bottomSeparator
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={$logoContainer}>
            <Image source={reactNativeLiveLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://rn.live/")}
      />
      <ListItem
        tx="ReciterScreen.chainReactConferenceLink"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        LeftComponent={
          <View style={$logoContainer}>
            <Image source={chainReactLogo} style={$logo} />
          </View>
        }
        onPress={() => openLinkInBrowser("https://cr.infinite.red/")}
      />
      <Text preset="subheading" tx="ReciterScreen.hireUsTitle" style={$sectionTitle} />
      <Text tx="ReciterScreen.hireUs" style={$description} />
      <ListItem
        tx="ReciterScreen.hireUsLink"
        leftIcon="clap"
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
        onPress={() => openLinkInBrowser("https://infinite.red/contact")}
      />
    </Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $tagline: TextStyle = {
  marginBottom: spacing.xxl,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
}

const $sectionTitle: TextStyle = {
  marginTop: spacing.xxl,
}

const $logoContainer: ViewStyle = {
  marginEnd: spacing.md,
  flexDirection: "row",
  flexWrap: "wrap",
  alignContent: "center",
  alignSelf: "stretch",
}

const $logo: ImageStyle = {
  height: 38,
  width: 38,
}
