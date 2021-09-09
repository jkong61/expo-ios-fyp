import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import MyLinearGradient from "./MyLinearGradient";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function PrimaryButton(props) {
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();

  return (
    <View
      style={
        props.style == undefined
          ? styles.button_wrapper
          : { ...styles.button_wrapper, ...props.style }
      }
    >
      <TouchableOpacity onPress={props.onPress != undefined && props.onPress}>
        <MyLinearGradient
          colors={props.colors ?? undefined}
          style={styles.button}
        >
          <View style={{ flexDirection: "row" }}>
            {props.loading && (
              <ActivityIndicator
                size="small"
                color="#fff"
                style={{ marginHorizontal: wp("2%") }}
              />
            )}

            <Text
              style={
                props.tfontSize == undefined
                  ? styles.text
                  : { ...styles.text, fontSize: props.tfontSize }
              }
            >
              {props.title}
            </Text>
          </View>
        </MyLinearGradient>
      </TouchableOpacity>
    </View>
  );
}

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    text: {
      backgroundColor: "transparent",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
      fontWeight: "500",
      color: "#fff",
    },
    button_wrapper: {
      width: "80%",
      marginTop: hp("4%"),
      ...Platform.select({
        ios: {
          shadowColor: "#6C63FF",
          shadowOffset: { width: 1, height: 5 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
        },
        android: {
          borderRadius: 10,
          elevation: 1,
        },
      }),
    },
    button: {
      alignItems: "center",
      padding: wp("3%"),
      borderRadius: 10,
    },
  });
}
