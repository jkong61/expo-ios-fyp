import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import MyContainer from "@components/MyContainer";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";

export default function EmptyListComponent(props) {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();

  return (
    <MyContainer
      style={{ ...styles.container, width: wp("91%"), ...props.style }}
    >
      <AntDesign
        name="questioncircle"
        size={deviceInfo.deviceType === DeviceType.PHONE ? wp("10%") : wp("7%")}
        color={colors.primary}
      />

      <Text
        style={{
          ...styles.text,
          color: colors.primary,
          fontSize:
            deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
        }}
      >
        Nothing to see here.
      </Text>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    //marginTop: actuatedNormalizeSize(20),
    marginTop: hp("2%"),
    //paddingVertical: actuatedNormalizeSize(30),
    paddingVertical: hp("5%"),
    //marginHorizontal: actuatedNormalizeSize(20),
    marginHorizontal: wp("4.5%"),
  },
  text: {
    //fontSize: actuatedNormalizeFontSize(20),
    //marginTop: actuatedNormalizeSize(20),
    marginTop: hp("2%"),
  },
});
