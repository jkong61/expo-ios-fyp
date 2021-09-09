import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import { BackButton } from "@components";
import { Text } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const HeaderImageContainer = (props) => {
  const { deviceInfo } = useDeviceInfoProvider();

  return (
    <View style={styles.header}>
      <BackButton color="#fff" />
      <Image source={props.image} resizeMode="cover" style={styles.bgImage} />
      <View style={styles.headerOverlap}></View>
      <Text
        style={{
          ...styles.title,
          fontSize:
            deviceInfo.deviceType === DeviceType.PHONE ? wp("8%") : wp("5%"),
        }}
      >
        {props.title}
      </Text>
      <Text
        style={{
          ...styles.quote,
          fontSize:
            deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("3%"),
        }}
      >
        {props.quote}
      </Text>
      <View style={styles.body}>{props.children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  headerOverlap: {
    position: "absolute",
    height: hp("30%"),
    width: "100%",
    backgroundColor: "#000000",
    opacity: 0.3,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  title: {
    width: "100%",
    color: "#ffffff",
    fontWeight: "bold",
    backgroundColor: "transparent",
    position: "absolute",
    textAlign: "center",
    top: hp("10%"),
  },
  quote: {
    fontSize: helpers.actuatedNormalizeFontSize(17),
    color: "#ffffff",
    backgroundColor: "transparent",
    position: "absolute",
    paddingHorizontal: wp("4.5%"),
    textAlign: "center",
    top: hp("16%"),
  },
  bgImage: {
    width: "100%",
    height: hp("30%"),
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  body: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 20,
  },
});

export default HeaderImageContainer;
