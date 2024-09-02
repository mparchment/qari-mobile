import React, { FC, useRef, useState } from "react"
import { Image, ImageStyle, View, ViewStyle } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { ListView, ListViewRef, Text } from "../components"
import { Demo } from "../screens/DemoShowroomScreen/DemoShowroomScreen" // Import Demo interface
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { DrawerIconButton } from "../screens/DemoShowroomScreen/DrawerIconButton"
import { translate } from "../i18n"

const logo = require("../../../assets/images/logo.png")

interface DrawerMenuProps {
  data: Demo[]
  onSelectItem: (sectionIndex: number, itemIndex?: number) => void
}

const DrawerMenu: FC<DrawerMenuProps> = ({ data, onSelectItem }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<ListViewRef<any>>(null)
  const $drawerInsets = useSafeAreaInsetsStyle(["top"])

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="back"
      drawerPosition="left"
      renderDrawerContent={() => (
        <View style={[$drawer, $drawerInsets]}>
          <View style={$logoContainer}>
            <Image source={logo} style={$logoImage} />
          </View>
          <ListView
            ref={menuRef}
            contentContainerStyle={$listContentContainer}
            estimatedItemSize={250}
            data={data.map((d) => ({
              name: d.name,
              useCases: d.data.map((u) => translate(u.props.name)),
            }))}
            keyExtractor={(item) => item.name}
            renderItem={({ item, index: sectionIndex }) => (
              <View>
                <Text
                  onPress={() => onSelectItem(sectionIndex)}
                  preset="bold"
                  style={$menuContainer}
                >
                  {item.name}
                </Text>
                {item.useCases.map((u, index) => (
                  <Text
                    key={`section${sectionIndex}-${u}`}
                    onPress={() => onSelectItem(sectionIndex, index + 1)}
                  >
                    {u}
                  </Text>
                ))}
              </View>
            )}
          />
        </View>
      )}
    >
      <DrawerIconButton onPress={toggleDrawer} />
    </Drawer>
  )
}

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
}

const $logoImage: ImageStyle = {
  height: 42,
  width: 77,
}

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  height: 56,
  paddingHorizontal: spacing.lg,
}

const $listContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
}

export default DrawerMenu
