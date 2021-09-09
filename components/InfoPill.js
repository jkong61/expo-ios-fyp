/**
 * Not in Use
 */

import React from "react";
import { useTheme } from "react-native-paper";
import {View, StyleSheet} from "react-native"; 

const InfoPill = (props) => {
  const { colors } = useTheme();
  return (
    <View style={
      {
        ...props.style,
        ...styles.box,
        backgroundColor: colors.card,

      }
    }>{props.children}
    </View>
  );
};

const styles = StyleSheet.create(
  {
    box: {
      width: "100%",
      marginTop: 20,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      shadowColor: "#000000",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
      padding: 10,
      borderRadius: 20
    }
  }
);

export default InfoPill;