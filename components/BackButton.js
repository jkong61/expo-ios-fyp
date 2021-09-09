import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { actuatedNormalizeSize } from "@utilities/helpers";

export default function BackButton(props) {
  const navigation = useNavigation();
  return (
    <IconButton
      icon="keyboard-backspace"
      size={30}
      color={props.color}
      style={
        props.style == undefined
          ? styles.menuIcon
          : { ...styles.menuIcon, ...props.style }
      }
      onPress={() => {
        props.onPress ? props.onPress : navigation.goBack();
      }}
    />
  );
}

const styles = StyleSheet.create({
  menuIcon: {
    zIndex: 9,
    position: "absolute",
    top: hp("2%"),
    left: "2%",
  },
});
