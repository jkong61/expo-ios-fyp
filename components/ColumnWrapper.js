import React from "react";
import { StyleSheet, View } from "react-native";
import * as helpers from "../utilities/helpers";

/**
 * Custom View component for column alignment.
 * @param {*} children
 */
const ColumnWrapper = (props) => {
  return (
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
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default ColumnWrapper;
