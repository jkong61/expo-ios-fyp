import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useTheme, Text } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { calories } from "@assets";

/**
 * Custom View component for row alignment.
 * @param {*} children
 */
const NutritionCircle = (props) => {
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();
  const value = props.value;
  const label = props.label;

  return (
    <View style={{ marginRight: 25 }}>
      <View
        style={
          props.bgcolor == undefined
            ? styles.container
            : { ...styles.container, backgroundColor: props.bgcolor }
        }
      >
        <Text style={{ textAlign: "center", fontSize: 10 }}>{label}</Text>
        {/* <Image source={calories} /> */}
      </View>
      <Text style={{ textAlign: "center" }}>{value}</Text>
    </View>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
      width: 80,
      height: 30,
      borderRadius: 60 / 2,
      backgroundColor: colors.primary,
    },
  });
}
export default NutritionCircle;
