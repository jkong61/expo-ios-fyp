import React from "react";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import RowWrapper from "./RowWrapper";
import * as helpers from "../utilities/helpers";

const ErrorMessage = (props) => {
  return (
    <RowWrapper
      style={
        props.style == undefined
          ? styles.wrapper
          : { ...props.style, ...styles.wrapper }
      }
    >
      <AntDesign name="closecircle" size={25} style={styles.icon}></AntDesign>
      <Text style={styles.text}>{props.message}</Text>
    </RowWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    marginTop: "3%",
  },
  text: {
    fontSize: helpers.actuatedNormalizeFontSize(15),
    color: "#F56182",
  },
  icon: {
    color: "#F56182",
    paddingHorizontal: 5,
  },
});

export default ErrorMessage;
