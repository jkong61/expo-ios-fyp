import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import MyLinearGradient from "./MyLinearGradient";

export default CenterButton = ({ onPress }) => {
  return (
    <View style={styles.button_wrapper}>
      <TouchableOpacity onPress={onPress}>
        <MyLinearGradient style={styles.button}>
          <Icon name="restaurant-menu" size={30} style={{ color: "#ffffff" }} />
        </MyLinearGradient>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    height: 60,
    width: 60,
    bottom: 13,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60 / 2,
  },
  button_wrapper: {
    shadowColor: "#6C63FF",
    shadowOffset: { width: 1, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    zIndex: 100,
  },
});
