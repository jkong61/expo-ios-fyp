import React from "react";
import { StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function RightCornerButton(props) {
  const { deviceInfo } = useDeviceInfoProvider();

  return (
    <IconButton
      icon={props.iconname}
      size={deviceInfo.deviceType === DeviceType.PHONE ? wp("7%") : wp("5%")}
      color={props.color}
      style={
        props.style == undefined
          ? styles.menuIcon
          : { ...styles.menuIcon, ...props.style }
      }
      onPress={props.onPress}
      disabled={props.disabled ?? true}
    />
  );
}

const styles = StyleSheet.create({
  menuIcon: {
    zIndex: 9,
    position: "absolute",
    right: wp("2%"),
    top: hp("2%"),
  },
});
