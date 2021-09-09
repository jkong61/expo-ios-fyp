import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import * as helpers from "../utilities/helpers";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

/**
 * Custom View component for column alignment.
 * @param {*} children
 */
const SquareButton = (props) => {
  const { colors } = useTheme(); // get the them colors
  const { deviceInfo } = useDeviceInfoProvider();

  const styles = StyleSheet.create({
    square_button: {
      width: deviceInfo.deviceType === DeviceType.PHONE ? wp("16%") : wp("10%"),
      height:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("16%") : wp("10%"),
      padding: 5,
      borderRadius: 15,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: wp("4%"),
    },
  });

  return (
    <View style={styles.square_button}>
      <TouchableOpacity onPress={props.onPress}>
        {props.children}
      </TouchableOpacity>
    </View>
  );
};

export default SquareButton;
