import React from "react";
import {
  StyleSheet,
  View,
  TouchableNativeFeedback,
  Dimensions,
} from "react-native";
import { useTheme, Text } from "react-native-paper";
import * as helpers from "../../utilities/helpers";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { MyLinearGradient } from "..";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Custom View component for row alignment.
 * @param {*} children
 */
const AssignmentCard = (props) => {
  const styles = StyleProvider();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const statusColor =
    props.item.assignment_accepted === null
      ? colors.placeholder
      : props.item.assignment_accepted === true
      ? "#59B259"
      : colors.error;
  const { deviceInfo } = useDeviceInfoProvider();

  return (
    <TouchableNativeFeedback
      onPress={() =>
        navigation.navigate("ClinicianNavigator", {
          screen: "AssignmentDetail",
          params: { Assignment: props.item },
        })
      }
    >
      <View style={styles.recordcard}>
        <MyLinearGradient style={styles.cardIconBox}>
          <FontAwesome5
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              padding: 10,
            }}
            name="clipboard-list"
            size={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("10%") : wp("6%")
            }
            color="white"
          />
        </MyLinearGradient>
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            alignContent: "center",
            padding:
              deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
            justifyContent: "center",
          }}
        >
          <Text style={styles.text}>Clinician :</Text>
          <Text style={styles.text}>
            {props.item.clinician.name ? props.item.clinician.name : "unknown"}
          </Text>
          <View
            style={{
              backgroundColor: statusColor,
              padding: 10,
              marginTop: hp("1%"),
              alignItems: "center",
              textAlign: "center",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("3%")
                    : wp("2%"),
              }}
            >
              {props.item.assignment_accepted === null
                ? "Pending"
                : props.item.assignment_accepted === true
                ? "Accepted"
                : "Declined"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();
  return StyleSheet.create({
    recordcard: {
      marginLeft: wp("4.5%"),
      borderRadius: 10,
      justifyContent: "space-between",
      flexDirection: "row",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      backgroundColor: colors.card,
      height:
        deviceInfo.deviceType === DeviceType.PHONE ? hp("14%") : hp("12.5%"),
    },
    cardIconBox: {
      width: deviceInfo.deviceType === DeviceType.PHONE ? wp("25%") : wp("15%"),
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE
          ? SCREEN_HEIGHT < 700
            ? wp("4%")
            : wp("5%")
          : wp("3%"),
    },
  });
}

export default AssignmentCard;
