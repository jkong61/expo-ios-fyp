import React from "react";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default CloseButton = () => {
  const navigation = useNavigation();
  return (
    <MaterialIcons
      name="close"
      color="#000000"
      size={40}
      style={styles.closeIcon}
      onPress={() => {
        navigation.pop(); // pop out the current stack screen.
      }}
    />
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    zIndex: 2,
    position: "absolute",
    alignSelf: "flex-end",
    color: "#fff",
    right: 20,
    top: 40,
  },
});
