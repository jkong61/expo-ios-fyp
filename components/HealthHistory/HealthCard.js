import React from "react";
import { StyleSheet, View, TouchableNativeFeedback } from "react-native";
import { useTheme, Text } from "react-native-paper";
import * as helpers from "../../utilities/helpers";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MyLinearGradient } from "..";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";

/**
 * Custom View component for row alignment.
 * @param {*} children
 */
const HealthCard = (props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const date = helpers.getDateObjFromISOString(props.data?.date_created);
  const { deviceInfo } = useDeviceInfoProvider();

  return (
    <TouchableNativeFeedback
      onPress={() =>
        navigation.navigate("HealthNavigator", {
          screen: "ViewHealthRecord",
          params: { record: props.data },
        })
      }
    >
      {/* onPress={() => console.log(props.data)}> */}
      <View
        style={{
          ...styles.recordcard,
          backgroundColor: colors.card,
          height:
            deviceInfo.deviceType === DeviceType.PHONE
              ? hp("13%")
              : hp("10.5%"),
        }}
      >
        <MyLinearGradient
          style={{
            width:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("25%")
                : wp("15%"),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ padding: 10 }}
            name="clipboard-plus-outline"
            //size={helpers.actuatedNormalizeSize(50)}
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
            //padding: 20,
            padding:
              deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("2.5%"),
            }}
          >
            {date.day} {date.month} {date.year}
          </Text>
          <Text
            style={{
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("2.5%"),
            }}
          >
            {date.timeIn12}
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  recordcard: {
    // marginLeft: 20,
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
  },
});

export default HealthCard;
