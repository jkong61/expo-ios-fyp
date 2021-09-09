import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { useTheme, Text, Avatar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AVATAR2 } from "@assets";
import {
  BackButton,
  ColumnWrapper,
  PrimaryButton,
  RowWrapper,
  Loader,
  ErrorDialog,
} from "@components";
import { AuthContext } from "@config/ContextHelper";
import { useClinicianListProvider } from "@config/ClinicianListProvider";
import { FlatListSlider } from "react-native-flatlist-slider";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AssignedClinicianContext } from "@config/AssignedClinicianProvider";
import HttpRequest from "@http/HttpHelper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useLoading from "@utilities/customhooks/useLoading";
import { getNetworkStatus } from "@utilities/helpers";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import useDialogHandler from "@utilities/customhooks/useDialogHandler";

const dimension = Dimensions.get("window");

const Preview = ({ item, index, itemIndex, itemLength, active, onPress }) => {
  const { colors } = useTheme();
  const { deviceInfo } = useDeviceInfoProvider();

  return (
    <View style={styles.videoContainer}>
      <View
        style={[
          {
            ...styles.imageContainer,
            height:
              deviceInfo.deviceType === DeviceType.PHONE
                ? hp("70%")
                : hp("75%"),
          },
          styles.shadow,
          active
            ? {}
            : {
              height:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? hp("60%")
                  : hp("60%"),
              opacity: 0.6,
            },
          { backgroundColor: colors.surface },
        ]}
      >
        <Avatar.Image
          source={AVATAR2}
          size={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("30%") : wp("20%")
          }
          style={{
            marginBottom: hp("3%"),
          }}
        />
        <Text
          style={{
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE ? wp("8%") : wp("5%"),
            fontWeight: "bold",
            paddingBottom: hp("2%"),
          }}
        >
          {item.name ?? "Clinician"}
        </Text>
        {/* <Text
          style={{
            textAlign: "center",
            fontSize: helpers.actuatedNormalizeFontSize(16),
            paddingHorizontal: helpers.actuatedNormalizeSize(10),
            paddingBottom: helpers.actuatedNormalizeSize(5),
          }}
        >
          Dermatologist
        </Text> */}

        <RowWrapper
          style={{
            paddingVertical: 0,
            width: "auto",
            justifyContent: "space-evenly",
          }}
        >
          <ColumnWrapper
            style={{
              width: "auto",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: wp("4%"),
            }}
          >
            <RowWrapper
              style={{
                paddingVertical: 0,
                width: "auto",
              }}
            >
              <MaterialCommunityIcons
                name="email"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("7%")
                    : wp("6%")
                }
                color={colors.text}
              />
              <Text
                style={{
                  marginLeft: wp("1%"),
                  fontWeight: "bold",
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4%")
                      : wp("2%"),
                }}
              >
                Email
              </Text>
            </RowWrapper>
            <Text
              style={{
                color: colors.primary,
                marginTop: hp("1%"),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("3.5%")
                    : wp("2%"),
              }}
            >
              {item.email}
            </Text>
          </ColumnWrapper>
          <ColumnWrapper
            style={{
              width: "auto",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: wp("4%"),
              flexWrap: "nowrap",
            }}
          >
            <RowWrapper style={{ paddingVertical: 0, width: "auto" }}>
              <MaterialCommunityIcons
                name="phone"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("7%")
                    : wp("6%")
                }
                color={colors.text}
              />
              <Text
                style={{
                  marginLeft: wp("1%"),
                  fontWeight: "bold",
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4%")
                      : wp("2%"),
                }}
              >
                Phone
              </Text>
            </RowWrapper>
            <Text
              style={{
                color: colors.primary,
                marginTop: hp("1%"),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("3.5%")
                    : wp("2%"),
              }}
            >
              {item.contact_information ?? "N/A"}
            </Text>
          </ColumnWrapper>
        </RowWrapper>
        <Text
          style={{
            textAlign: "center",
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("3.5%")
                : wp("2%"),
            marginTop: hp("1%"),
            paddingHorizontal:
              deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2%"),
          }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti
          facilis iure provident.
        </Text>
        <PrimaryButton
          title="Assign"
          tfontSize={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("3%")
          }
          style={{
            width: wp("60%"),
            marginTop: hp("4%"),
          }}
          onPress={() => onPress(item.user_id)}
        />
      </View>
    </View>
  );
};

// React Component
const ClinicianDetailScreen = () => {
  const navigation = useNavigation();

  const route = useRoute();
  const { colors } = useTheme();
  const [clinicianState] = useClinicianListProvider();
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const [, dispatch] = useContext(AssignedClinicianContext);
  const [clinicians, setClinicians] = useState([]);
  const [dialogVisible, toggleDialog] = useToggleDialog();
  const [dialogContent, handleToggleDialog] = useDialogHandler(toggleDialog);
  const { deviceInfo } = useDeviceInfoProvider();

  const assignClinicianHandler = async (id) => {
    if (!getNetworkStatus()) {
      handleToggleDialog({
        title: "Network Error",
        message: "Internet Connection is required."
      });
      return Promise.resolve();
    }

    console.log(id);
    try{
    const result = await HttpRequest.Post.AssignClinician(
      id,
      authState.userToken
    );
      if (result?.error) {
        throw Error(result.message);
    } else {
      //dispatch({ type: "assignClinician", payload: result });
      navigation.navigate("Assignment");
    }
    } catch (error) {
      handleToggleDialog({
        title: "Error Encountered",
        message: error.toString()
      });
    }
  };

  const [handleClinicianAssignment, clinicianAssignmentLoading] = useLoading(assignClinicianHandler);

  useEffect(() => {
    if (route.params?.Clinician) {
      const index = clinicianState.findIndex(
        (item) => route.params.Clinician.user_id == item.user_id
      );
      let result = clinicianState.filter((elem, i) => i !== index);
      result = [route.params.Clinician, ...result];
      setClinicians(result);
    }
  }, [route.params?.Clinician]);

  return (
    <View style={{ ...styles.container, backgroundColor: colors.primary }}>
      <BackButton color="#ffffff" />
      <Text
        style={{
          ...styles.title,
          fontSize:
            deviceInfo.deviceType === DeviceType.PHONE ? wp("8%") : wp("6%"),
          marginTop:
            deviceInfo.deviceType === DeviceType.PHONE ? hp("4%") : hp("3%"),
        }}
      >
        Clinicians
      </Text>
      <View style={{ marginTop: hp("3%") }}>
        {clinicians.length > 0 && (
          <FlatListSlider
            data={clinicians}
            width={dimension.width}
            loop={false}
            autoscroll={false}
            component={<Preview />}
            onPress={handleClinicianAssignment}
            indicatorStyle={{ padding: 0, margin: 0 }}
            indicatorContainerStyle={{ padding: 0, margin: 0 }}
            indicatorActiveWidth={40}
            indicatorActiveColor={"#fff"}
            indicatorInActiveColor={"#000"}
            contentContainerStyle={
              {
                // paddingHorizontal: helpers.actuatedNormalizeFontSize(
                //   (dimension.width * 0.3) / 2
                // ),
              }
            }
          />
        )}
      </View>
      <Loader visible={clinicianAssignmentLoading} />

      <ErrorDialog
        visible={dialogVisible}
        title={dialogContent.title}
        content={dialogContent.content}
        onDismiss={toggleDialog}
        onPress={toggleDialog}
      />
    </View>
  );
};

// View stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  videoContainer: {
    width: wp("78%"),
    //paddingVertical: helpers.actuatedNormalizeSize(20),
    marginHorizontal: wp("22%") / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  videoPreview: {
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    height: hp("70%"),
    marginHorizontal: wp("22%") / 2,
    width: wp("78%"),
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default ClinicianDetailScreen;
