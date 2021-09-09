import React, { useState, useEffect, memo, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme, Modal, Avatar } from "react-native-paper";
import { AVATAR2 } from "@assets";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import * as helpers from "@utilities/helpers";
import {
  MyContainer,
  RowWrapper,
  ColumnWrapper,
  BackButton,
  MyLinearGradient,
  Loader,
  SecondaryButton,
} from "@components";
import HttpRequest from "@http/HttpHelper";
import { AuthContext } from "@config/ContextHelper";
import { AssignedClinicianContext } from "@config/AssignedClinicianProvider";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useLoading from "@utilities/customhooks/useLoading";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";

const AssignmentDetailScreen = ({ route, navigation }) => {
  const { colors } = useTheme(); // get the them colors
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const [, dispatch] = useContext(AssignedClinicianContext);
  const [assignment, setAssignment] = useState();
  const [visibleConfirmation, toggleConfirmation] = useToggleDialog();
  const { deviceInfo } = useDeviceInfoProvider();

  const statusColor =
    assignment?.assignment_accepted === null
      ? colors.placeholder
      : assignment?.assignment_accepted === true
        ? "#59B259"
        : colors.error;

  // const showConfirmation = () => {
  //   setVisibleConfirmation(true);
  // };

  // const hideConfirmation = () => {
  //   setVisibleConfirmation(false);
  // };

  const cancelAssignment = async () => {
    toggleConfirmation();
    const result = await HttpRequest.Delete.CancelAssignedClinician(
      assignment.clinician_assignment_id,
      authState.userToken
    );
    if (result) {
      dispatch({
        type: "cancelAssignedClinician",
        payload: assignment.clinician_assignment_id,
      });
      navigation.goBack();
    } else {
      alert("Cancel Assigned Clinician failed.");
    }
  };

  const [handleCancelAssignment, assignmentLoading] = useLoading(cancelAssignment);

  useEffect(() => {
    if (route.params?.Assignment) {
      setAssignment(route.params.Assignment); //set image to preview
    }
  }, [route.params?.Assignment]);

  return (
    <View style={styles.container}>
      <BackButton color="#ffffff" />
      <Text style={styles.title}>Assignment Detail</Text>
      <MyLinearGradient
        style={{ borderRadius: 0, width: "100%", height: "30%" }}
      ></MyLinearGradient>
      <View style={{ ...styles.body, backgroundColor: colors.surface }}>
        <Avatar.Image
          source={AVATAR2}
          size={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("35%") : wp("25%")
          }
          style={{
            top: hp("-10%"),
          }}
        />
        <View
          style={{
            top: hp("-5%"),
            width: wp("35%"),
            backgroundColor: statusColor,
            padding:
              deviceInfo.deviceType === DeviceType.PHONE ? wp("3%") : wp("2%"),
            borderRadius: 40,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              color: "#fff",
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("5%")
                  : wp("3%"),
            }}
          >
            {assignment?.assignment_accepted === null
              ? "Pending"
              : assignment?.assignment_accepted
                ? "Accepted"
                : "Declined"}
          </Text>
        </View>
        <Text
          style={{
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE ? wp("8%") : wp("5%"),
            fontWeight: "bold",
            marginBottom: hp("1%"),
          }}
        >
          {assignment?.clinician?.name ?? "Clinician"}
        </Text>

        <RowWrapper style={{ justifyContent: "space-evenly" }}>
          <ColumnWrapper style={{ alignItems: "center", width: "auto" }}>
            <View
              style={{
                width:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("18%")
                    : wp("12%"),
                height:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("18%")
                    : wp("12%"),
                borderRadius: helpers.actuatedNormalizeSize(20),
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.primary,
              }}
            >
              <MaterialCommunityIcons
                name="email"
                color="#ffffff"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("11%")
                    : wp("8%")
                }
              />
            </View>
            <Text
              style={{
                marginTop: hp("1%"),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4%")
                    : wp("2%"),
              }}
            >
              {assignment?.clinician?.email}
            </Text>
          </ColumnWrapper>
          <ColumnWrapper style={{ alignItems: "center", width: "auto" }}>
            <View
              style={{
                width:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("18%")
                    : wp("12%"),
                height:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("18%")
                    : wp("12%"),
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.primary,
              }}
            >
              <MaterialCommunityIcons
                name="phone"
                color="#ffffff"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("11%")
                    : wp("8%")
                }
              />
            </View>
            <Text
              style={{
                marginTop: hp("1%"),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4%")
                    : wp("2%"),
              }}
            >
              {assignment?.clinician?.contact_information ?? "N/A"}
            </Text>
          </ColumnWrapper>
          <Text
            style={{
              textAlign: "center",
              marginTop: hp("5%"),
              marginHorizontal: wp("4.5%"),
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4%")
                  : wp("2%"),
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore
            veniam, adipisci vitae ex reprehenderit necessitatibus error qui
            aspernatur.
          </Text>

          <SecondaryButton
            tfontSize={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%")
            }
            title="Cancel"
            shadowColor="#F56182"
            colors={["#F56182", "#F56182"]}
            tColor={"#fff"}
            onPress={toggleConfirmation}
          />
        </RowWrapper>
      </View>
      <Modal
        visible={visibleConfirmation}
        transparent={true}
        animationType="fade"
        onDismiss={toggleConfirmation}
      >
        <MyContainer
          style={{
            marginHorizontal: wp("5%"),
            width: "auto",
            paddingVertical:
              deviceInfo.deviceType === DeviceType.PHONE ? hp("3%") : hp("5%"),
          }}
        >
          <Text
            style={{
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("3%"),
              textAlign: "center",
              lineHeight: 30,
            }}
          >
            Are you sure you want to cancel this assignment?
          </Text>
          <View style={{ flexDirection: "row" }}>
            <SecondaryButton
              title="Cancel"
              tfontSize={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("3%")
              }
              style={{
                width: "auto",
                marginVertical: 0,
                marginHorizontal: wp("3%"),
              }}
              onPress={toggleConfirmation}
            />
            <SecondaryButton
              title="Confirm"
              tfontSize={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("3%")
              }
              shadowColor="#F56182"
              colors={["#F56182", "#F56182"]}
              tColor={"#fff"}
              style={{
                width: "auto",
                marginVertical: 0,
                marginHorizontal: wp("3%"),
              }}
              onPress={handleCancelAssignment}
            />
          </View>
        </MyContainer>
      </Modal>
      <Loader visible={assignmentLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  thumbnail: {
    width: "100%",
    marginTop: helpers.actuatedNormalizeSize(80),
    height: 250,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  body: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    top: -65,
  },
  image: {
    width: "95%",
    height: "100%",
    resizeMode: "cover",
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  title: {
    position: "absolute",
    fontSize: 25,
    paddingBottom: 20,
  },
  sub_title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default memo(AssignmentDetailScreen);
