import React from "react";
import { RowWrapper, MyLinearGradient, ColumnWrapper } from "@components";
import { View, TouchableOpacity } from "react-native";
import { useTheme, Text, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Fontisto, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

/**
 * Custom View component for row alignment.
 * @param {*} children
 */
const PatientItem = (props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { deviceInfo } = useDeviceInfoProvider();
  const item = props.item;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ClinicianPatientProfile", { record: item })
      }
    >
      <View
        key={item.clinician_assignment_id}
        style={{
          backgroundColor: colors.surface,
          marginBottom: hp("1.5%"),
          borderRadius: 10,
          marginHorizontal: wp("4.5%"),
        }}
      >
        <RowWrapper style={{ paddingVertical: 0, margin: 0 }}>
          <MyLinearGradient style={{ margin: wp("2%") }}>
            <Fontisto
              name="bed-patient"
              size={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("13%")
                  : wp("8%")
              }
              color="white"
            />
          </MyLinearGradient>
          <ColumnWrapper
            style={{
              width: "auto",
              marginHorizontal: wp("4.5%"),
            }}
          >
            <Title
              style={{
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("5%")
                    : wp("3%"),
              }}
            >
              Patient ID: {item.user_id}
            </Title>
            <RowWrapper style={{ paddingVertical: hp("0.5%") }}>
              <MaterialCommunityIcons
                name="clipboard-plus"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("6%")
                    : wp("3.5%")
                }
                color={colors.text}
              />
              <Text style={{ marginLeft: wp("2%") }}>
                Assignment ID: {item.clinician_assignment_id}
              </Text>
            </RowWrapper>
          </ColumnWrapper>
          <MaterialCommunityIcons
            name="information"
            color={colors.primary}
            size={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("9%") : wp("6%")
            }
            style={{ position: "absolute", right: 10 }}
          />
        </RowWrapper>
      </View>
    </TouchableOpacity>
  );
};

export default PatientItem;
