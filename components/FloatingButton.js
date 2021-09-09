import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { MyLinearGradient } from ".";
import { AntDesign } from "@expo/vector-icons";
import * as helpers from "../utilities/helpers";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const FloatingButton = (props) => {
  const { deviceInfo } = useDeviceInfoProvider();

  return (
    <View
      style={{
        ...styles.floatingbutton,
        borderRadius:
          deviceInfo.deviceType === DeviceType.PHONE
            ? wp("16%") / 2
            : wp("10%") / 2,
      }}
    >
      <TouchableOpacity onPress={props.onPress}>
        <MyLinearGradient
          style={{
            ...styles.container,
            height:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("16%")
                : wp("10%"),
            width:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("16%")
                : wp("10%"),
            borderRadius:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("16%") / 2
                : wp("10%") / 2,
          }}
        >
          <AntDesign
            name="plus"
            size={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("8%") : wp("6%")
            }
            color={"#fff"}
          />
        </MyLinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingbutton: {
    position: "absolute",
    backgroundColor: "#000",
    bottom: hp("8%"),
    right: wp("8%"),
    borderRadius: helpers.actuatedNormalizeSize(40),
    shadowColor: "#888",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
  container: {
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FloatingButton;
