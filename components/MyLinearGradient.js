import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { actuatedNormalizeSize } from "@utilities/helpers";

/**
 * Custom LinearGradient component.
 * @param {*} children
 */
const MyLinearGradient = (props) => (
  <LinearGradient
    colors={props.colors ?? ["#6C63FF", "#9D97FF"]}
    start={[0.0, 0.5]}
    end={[1.0, 0.5]}
    locations={[0.0, 1.0]}
    style={
      props.style
        ? { ...styles.button, ...props.style }
        : styles.button
    }
  >
    {props.children}
  </LinearGradient>
);

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    padding: actuatedNormalizeSize(15),
    borderRadius: 10,
  },
});

export default MyLinearGradient;
