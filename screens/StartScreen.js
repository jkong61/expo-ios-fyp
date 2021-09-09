import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text } from "react-native-paper";
import { PrimaryButton, SecondaryButton } from "../components";
import { useNavigation } from "@react-navigation/native";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const StartScreen = () => {
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.title_text}> Your health manager. </Text>
        <Text style={styles.app_name}> HealthOnline. </Text>
      </View>
      <Text style={styles.text}> Enjoy the experience. </Text>

      <Image source={require("../assets/t1.png")} style={styles.image} />

      <View style={styles.button_container}>
        <PrimaryButton
          title="Login"
          tfontSize={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%")
          }
          onPress={() => navigation.navigate("LoginScreen")}
        />
        <SecondaryButton
          title="Sign up"
          tfontSize={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%")
          }
          onPress={() => navigation.navigate("SignUpScreen")}
        />
      </View>
    </View>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      top: hp("10%"),
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
    },
    button_container: {
      flex: 8,
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      paddingVertical: hp("1%"),
    },
    title_text: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("5.5%") : wp("4%"),
      fontWeight: "bold",
    },
    app_name: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("5.5%") : wp("4%"),
      fontWeight: "900",
      color: "#6C63FF",
    },
    text: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
      color: "#AAAAAA",
      marginBottom: hp("4%"),
    },
    image: {
      flex: 5,
      width: "90%",
      resizeMode: "contain",
      marginBottom: hp("2%"),
    },
  });
}

export default StartScreen;
