import React from "react";
import { StyleSheet, View } from "react-native";
import { MyContainer, PrimaryButton, SecondaryButton } from "..";
import { Text } from "react-native-paper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ConfirmDialog = (props) => {
  const { deviceInfo } = useDeviceInfoProvider();

  return (
    <MyContainer style={{ marginTop: hp("1%") }}>
      <Text
        style={{
          fontSize:
            deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
        }}
      >
        Confirm continue with this picture?
      </Text>
      <View style={styles.box}>
        <PrimaryButton
          tfontSize={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%")
          }
          title={"Yes"}
          onPress={() => props.onPressYes()}
          style={{ width: "40%", margin: 20 }}
        />
        <SecondaryButton
          tfontSize={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%")
          }
          title={"No"}
          onPress={() => props.onPressNo()}
          style={{ width: "40%", margin: 20 }}
        />
      </View>
    </MyContainer>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ConfirmDialog;
