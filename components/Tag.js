import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MyLinearGradient from "./MyLinearGradient";
import { DeviceType } from "@config/DeviceInfoProvider";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

/**
 * Custom View component for tag.
 * @param {*} children
 */
const Tag = (props) => {
  const isSelected = () => {
    if (props.selected != undefined && !props.selected) {
      return ["#9C9C9C", "#9C9C9C"];
    }
    return null;
  };

  return (
    <TouchableOpacity
      onPress={props.onPress != undefined ? props.onPress : null}
      disabled={props.selected != undefined ? props.selected : null}
    >
      <View
        style={
          props == undefined ? styles.tag : { ...styles.tag, ...props.style }
        }
      >
        <MyLinearGradient
          style={{
            ...styles.linear,
            ...props.linearStyle,
            padding:
              props.deviceType && props.deviceType === DeviceType.PHONE
                ? wp("2.5%")
                : wp("1.5%"),
          }}
          colors={isSelected()}
        >
          <Text
            style={{
              ...styles.text,
              ...props.textStyle,
              fontSize:
                props.deviceType && props.deviceType === DeviceType.PHONE
                  ? wp("4%")
                  : wp("2.5%"),
            }}
          >
            {props.children}
          </Text>
        </MyLinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tag: {
    marginVertical: 5,
    marginRight: 10,
  },
  text: {
    color: "#fff",
  },
  linear: {
    borderRadius: 18,
  },
});

export default Tag;
