import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, View, Text as NativeText } from "react-native";
import { Text, useTheme } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import HttpRequest from "@http/HttpHelper";
import { getNetworkStatus } from "@utilities/helpers";
import {
  BackButton,
  RowWrapper,
  ErrorDialog,
  ConfirmCancelDialog,
  AnimatedHeaderFlatList,
} from "@components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import FloatingButton from "@components/FloatingButton";
import { BG1 } from "@assets";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import { AuthContext } from "@config/ContextHelper";
import {
  useHealthProvider,
  HealthProviderDispatchMethodConstants,
} from "@config/HealthProvider";
import { setData } from "@async_storage/AsyncStorageHelper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

/*
 * global variable
 */
const quote =
  "“I believe that the greatest gift that you can give your family and the world is a healthy you.” ~ Joyce Meyer";

/**
 * Main Record Screen
 */
const HealthRecordHistory = () => {
  const [healthstate, healthDispatch] = useHealthProvider();
  const [numHealthRecords, setNumHealthRecords] = useState(
    healthstate.records.length
  );
  const { colors, dark } = useTheme();
  const { authState } = useContext(AuthContext); // for get all meal purpose
  const [errorDialog, toggleErrorDialog] = useToggleDialog();
  const [errorDialogVisible, toggleErrorDialogVisible] = useToggleDialog();
  const [errorDialogContent, setErrorDialogContent] = useState({
    title: "",
    content: "",
  });
  const navigation = useNavigation();
  const { deviceInfo } = useDeviceInfoProvider();

  function handleforDialog(title, message) {
    toggleErrorDialogVisible();
    setErrorDialogContent({
      title: title,
      content: message,
    });
  }

  async function fetchUserHealthRecords() {
    if (!getNetworkStatus()) {
      handleforDialog("Network Error", "Internet Connection is required.");
      return;
    }

    try {
      const [fetchProfile, fetchRecords] = await Promise.all([
        HttpRequest.Get.GetHealthProfile(authState.userToken),
        HttpRequest.Get.GetHealthRecords(authState.userToken),
      ]);
      healthDispatch({
        type: HealthProviderDispatchMethodConstants.GETPROFILERECORDS,
        payload: {
          profile: fetchProfile,
          records: fetchRecords,
        },
      });
      // Health profile saved in memory
      setData(
        "healthprofile",
        JSON.stringify({
          profile: fetchProfile,
          records: fetchRecords,
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    setNumHealthRecords(healthstate?.records?.length);
  }, [healthstate]);

  const renderItem = ({ item }) => {
    const date = helpers.getDateObjFromISOString(item.date_created);
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        underlayColor={dark ? "#000000" : "#DDDDDD"}
        onPress={() =>
          navigation.navigate("ViewHealthRecord", { record: item })
        }
        key={item.health_record_id}
      >
        <View
          style={{
            width: wp("100%"),
            paddingHorizontal: wp("4.5%"),
            alignSelf: "center",
          }}
        >
          <RowWrapper style={{ justifyContent: "space-between" }}>
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
              <MaterialCommunityIcons
                style={{
                  padding:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("2.5%")
                      : wp("2%"),
                }}
                name="clipboard-plus-outline"
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
            <View style={{ marginHorizontal: "5%" }}>
              {/* Blank view to be a spacer */}
            </View>
            <View>
              <MaterialCommunityIcons
                name="information"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("8%")
                    : wp("5%")
                }
                color={colors.text}
                onPress={() =>
                  navigation.navigate("ViewHealthRecord", { record: item })
                }
              />
            </View>
          </RowWrapper>
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

  return (
    <View style={{ height: "100%", flex: 1 }}>
      <BackButton color="#fff" />
      <AnimatedHeaderFlatList
        headerImageSource={BG1}
        headerQuoteText={quote}
        headerTitleText={"Health History"}
        data={healthstate?.records}
        renderItem={renderItem}
        refreshCallback={fetchUserHealthRecords}
        keyExtractor={(item) => item.health_record_id.toString()}
        headerQuantityView={() => (
          <RowWrapper>
            <MaterialCommunityIcons
              name="clipboard-plus-outline"
              color="#ffffff"
              size={wp("5%")}
              style={{ marginRight: wp("2%") }}
            />
            <NativeText
              style={{
                ...styles.whitetext,
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4%")
                    : wp("3%"),
              }}
            >
              {numHealthRecords ?? 0} records
            </NativeText>
          </RowWrapper>
        )}
      />

      <FloatingButton
        onPress={() => {
          if (healthstate.profile == null) {
            toggleErrorDialog();
          } else {
            navigation.navigate("HealthNavigator", {
              screen: "ViewHealthRecord",
              params: undefined,
            });
          }
        }}
      />
      <ConfirmCancelDialog
        visible={errorDialog}
        title={"Profile Required"}
        content={"You need to create a profile to use this feature."}
        onDismiss={toggleErrorDialog}
        onConfirm={async function () {
          navigation.navigate("HealthNavigator", {
            screen: "HealthProfile",
            params: { initial: true },
          });
          toggleErrorDialog();
        }}
      />
      <ErrorDialog
        visible={errorDialogVisible}
        title={errorDialogContent.title}
        content={errorDialogContent.content}
        onDismiss={toggleErrorDialogVisible}
        onPress={toggleErrorDialogVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  whitetext: {
    color: "#ffffff",
  },
});

export default HealthRecordHistory;
