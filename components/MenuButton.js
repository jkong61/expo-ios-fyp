import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme, IconButton } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

//const window = Dimensions.get("window");

const MenuButton = (props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <IconButton
      icon="menu"
      size={32}
      color={props.color ? props.color : colors.text}
      style={styles.menuIcon}
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    zIndex: 20,
    position: "absolute",
    top: hp("2%"),
  },
});

export default MenuButton;
