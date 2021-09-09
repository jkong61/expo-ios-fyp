import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

/**
 * Custom View component.
 * @param {*} children
 */
const MyContainer = (props) => {
  const { colors } = useTheme(); // get the them colors

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      marginVertical: 10,
      padding: 20,
      borderRadius: 20,
      flexDirection: "column",
      justifyContent: "flex-start",
      backgroundColor: colors.card,
      alignItems: "center",
      shadowColor: "#000000",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
  });

  return (
    <View
      style={
        props.style == undefined
          ? styles.container
          : { ...styles.container, ...props.style }
      }
    >
      {props.children}
    </View>
  );
};

export default MyContainer;
