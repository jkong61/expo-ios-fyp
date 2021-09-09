import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import RowWrapper from "@components/RowWrapper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

/**
 * Custom RowWrapper just for this Screen
 * @param {*} props
 */
const MyRowWrapper = (props) => (
  <TouchableOpacity onPress={props.onPress ?? null}>
    <RowWrapper
      style={{
        ...props.style,
        paddingVertical: hp("1%"),
      }}
    >
      {props.children}
    </RowWrapper>
  </TouchableOpacity>
);

const TouchableSectionItem = (props) => {
  const { deviceInfo } = useDeviceInfoProvider();
  const styles = StyleProvider();

  return (
    <MyRowWrapper onPress={props.onPress}>
      <View style={styles.container}>
        <Text
          style={{...props.style,
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("3.8%")
                : wp("2.8%"),
          }}
        >
          {props.title} :{" "}
        </Text>
        {/* The touchable text */}
        <Text
          style={{
            ...styles.textstyle,
            textDecorationLine: props.touchable ? "underline" : "none",
          }}
        >
          {props.value}
        </Text>
      </View>
    </MyRowWrapper>
  );
};
function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      width: "100%",
    },
    textstyle: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.8%") : wp("2.8%"),
      fontWeight: "bold",
      color: colors.primary,
    },
  });
}

export default TouchableSectionItem;
