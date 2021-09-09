import React from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";

const MySlider = (props) => {
  const { colors } = useTheme();
  return (
    <Slider
      style={{ ...styles.slider, ...props.style }}
      onValueChange={props.onValueChange}
      value={props.value}
      minimumValue={props.minimumValue == undefined ? 0 : props.minimumValue}
      maximumValue={props.maximumValue == undefined ? 1 : props.maximumValue}
      step={props.step == undefined ? 0.05 : props.step}
      minimumTrackTintColor={colors.primary}
      maximumTrackTintColor="#000000"
      thumbTintColor={colors.primary}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    width: "100%",
    marginTop: 0,
  },
});

export default MySlider;
