import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme, Text } from "react-native-paper";
import * as helpers from "../../utilities/helpers";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

/**
 * Custom View component for row alignment.
 * @param {*} children
 */
const AssignmentItem = (props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { deviceInfo } = useDeviceInfoProvider();

  const statusColor =
    props.item.assignment_accepted === null
      ? colors.placeholder
      : props.item.assignment_accepted === true
      ? "#59B259"
      : colors.error;

  return (
    <TouchableOpacity
      key={props.item.clinician_assignment_id}
      onPress={() =>
        navigation.navigate("AssignmentDetail", { Assignment: props.item })
      }
    >
      <View
        style={{
          width: wp("100%"),
          paddingHorizontal: wp("4.5%"),
          alignSelf: "center",
        }}
      >
        <View
          style={{
            width: "auto",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingVertical:
              deviceInfo.deviceType === DeviceType.PHONE ? hp("2%") : hp("2%"),
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              borderRadius: 10,
              backgroundColor: colors.card,
              padding:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("2.5%")
                  : wp("2%"),
            }}
          >
            <FontAwesome5
              style={{
                padding:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("2.5%")
                    : wp("2%"),
              }}
              name="clipboard-list"
              size={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("12%")
                  : wp("6%")
              }
              color={colors.accent}
            />
          </View>
          <View style={{ marginLeft: wp("6%") }}>
            <Text
              style={{
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("5%")
                    : wp("3%"),
              }}
            >
              Clinician:
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("5%")
                    : wp("3%"),
              }}
            >
              {props.item.clinician?.name ?? "unknown"}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: statusColor,
                padding:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("2.5%")
                    : wp("1.5%"),
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4%")
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

          <View style={{ marginHorizontal: "5%" }} />
        </View>
        <View
          style={{
            width: "100%",
            borderBottomColor: "grey",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        ></View>
      </View>
    </TouchableOpacity>
  );
};

export default AssignmentItem;
