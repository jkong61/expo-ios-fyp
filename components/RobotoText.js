import React from "react";
import { StyleSheet, Text } from "react-native";
import { useTheme } from "react-native-paper";

export const LightText = ({ text }) => {
  const { colors, fonts } = useTheme();
  const styles = StyleSheet.create({
    light_text: {
      color: colors.text,
      fontFamily: fonts.thin.fontFamily,
      fontWeight: fonts.light.fontWeight,
    },
  });
  return <Text style={styles.light_text}>{text}</Text>;
};

/*export const BoldText = () => {
  const Theme = GetTheme(theme);
  const styles = StyleSheet.create({
    bold_text: {
      color: theme.colors.text,
      fontFamily: theme.fonts.medium,
    },
  });

  return <Text style={styles.bold_text}>Hello</Text>;
};*/
