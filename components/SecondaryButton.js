import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
} from "react-native";
import MyLinearGradient from "./MyLinearGradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function SecondaryButton(props) {
  const styles = StyleSheet.create({
    text: {
      backgroundColor: "transparent",
      fontSize: wp("4.5%"),
      fontWeight: "500",
      color: props.tColor ? props.tColor : "#000",
    },
    button_wrapper: {
      width: "80%",
      marginTop: hp("4%"),
      ...Platform.select({
        ios: {
          shadowColor: props.shadowColor ? props.shadowColor : "#000",
          shadowOffset: { width: 1, height: 3 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
        },
        android: {
          borderRadius: 10,
          elevation: 5,
        },
      }),
    },
    button: {
      alignItems: "center",
      padding: wp("3%"),
      borderRadius: 10,
    },
  });

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
          colors={props.colors ? props.colors : ["#FFFFFF", "#FFFFFF"]}
          style={styles.button}
        >
          <Text
            style={
              props.tfontSize == undefined
                ? styles.text
                : { ...styles.text, fontSize: props.tfontSize }
            }
          >
            {props.title}
          </Text>
        </MyLinearGradient>
      </TouchableOpacity>
    </View>
  );
}
