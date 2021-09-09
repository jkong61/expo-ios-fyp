import React, { useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Modal,
  Text,
  TouchableOpacity,
} from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import { useTheme } from "react-native-paper";
import { Loading } from "../assets";

/**
 * Custom View component for column alignment.
 * @param {*} children
 */
const Loader = (props) => {
  const { colors } = useTheme(); // get the them colors

  const styles = StyleSheet.create({
    loader: {
      width: 330,
      height: 180,
    },
  });

  return (
    <Modal visible={props.visible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: colors.loaderback,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image source={Loading} style={styles.loader} />
        <TouchableOpacity>
          <Text style={{ fontSize: 30, color: "#fff", fontWeight: "bold" }}>
            {props.text ? props.text : "Loading..."}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default Loader;
