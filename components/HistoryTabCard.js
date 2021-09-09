import React from "react";
import { StyleSheet, View, TouchableNativeFeedback } from "react-native";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { Text, useTheme } from "react-native-paper";
import { MyLinearGradient } from ".";
//import * as helpers from "../utilities/helpers";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";

/**
 * Custom View component for column alignment.
 * @param {*} children
 */
const HistoryTabCard = (props) => {
  const { colors } = useTheme();
  const { state, currentState, title, paragraph, onPress } = props;
  const { deviceInfo } = useDeviceInfoProvider();

  const Icon =
    state === 0
      ? MaterialIcons
      : state === 1
      ? MaterialCommunityIcons
      : FontAwesome5;
  const iconName =
    state === 0
      ? "restaurant-menu"
      : state === 1
      ? "clipboard-text"
      : "notes-medical";

  const white = "#ffffff";

  const styles = StyleSheet.create({
    card: { marginLeft: wp("4.5%"), marginTop: wp("3.5%") },
    title: {
      fontWeight: "bold",
      //fontSize: helpers.actuatedNormalizeFontSize(15),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
      color: currentState ? white : colors.text,
      marginTop: wp("1.5%"),
    },
    content: {
      //fontSize: helpers.actuatedNormalizeFontSize(15),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
      color: currentState ? white : colors.text,
    },
  });

  return (
    <TouchableNativeFeedback onPress={onPress}>
      <View style={styles.card}>
        <MyLinearGradient
          colors={!currentState ? [colors.card, colors.card] : null}
          style={{
            paddingHorizontal:
              deviceInfo.deviceType === DeviceType.PHONE ? wp("7%") : wp("5%"),
          }}
        >
          <Icon
            name={iconName}
            //size={helpers.actuatedNormalizeSize(40)}
            size={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("10%") : wp("7%")
            }
            color={currentState ? "#FFFFFF" : "#6C63FF"}
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{paragraph}</Text>
        </MyLinearGradient>
      </View>
    </TouchableNativeFeedback>
  );
};

export default HistoryTabCard;
