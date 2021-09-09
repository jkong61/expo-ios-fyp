import React from "react";
import { StyleSheet, View } from "react-native";
import * as helpers from "../utilities/helpers";

/**
 * Custom View component for row alignment.
 * @param {*} children
 */
const RowWrapper = (props) => (
  <View
    style={
      props.style == undefined
        ? styles.wrapper
        : { ...styles.wrapper, ...props.style }
    }
  >
    {props.children}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: helpers.actuatedNormalizeSize(15),
    flexWrap: "wrap",
  },
});

export default RowWrapper;
