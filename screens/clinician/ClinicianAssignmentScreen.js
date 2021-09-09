import React, { useState, useCallback } from "react";
import { Text as NativeText, StyleSheet, View } from "react-native";
import { Text, Title, useTheme } from "react-native-paper";
import HttpHelper from "@http/HttpHelper";
import { BG5 } from "@assets";
import { getNetworkStatus, actuatedNormalizeSize } from "@utilities/helpers";
import { MaterialCommunityIcons, Fontisto } from "@expo/vector-icons";
import {
  BackButton,
  AnimatedHeaderFlatList,
  ErrorDialog,
  ConfirmCancelDialog,
  RowWrapper,
  ColumnWrapper,
  MyLinearGradient,
  MySearchBar,
} from "@components";
import { useFocusEffect } from "@react-navigation/native";
import {
  useClinicianProvider,
  ClinicianProviderDispatchMethodConstants,
} from "@config/ClinicianProvider";
import { useContext } from "react";
import { AuthContext } from "@config/ContextHelper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect } from "react";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const quote =
  "“Your assignment must at least better the lives of people around you and the world at large.” ~ D.S. Mashego";

export default function ClinicianAssignmentScreen() {
  const { colors } = useTheme();
  const styles = StyleProvider();
  const { authState } = useContext(AuthContext);
  const [clinicianstate, dispatchclinician] = useClinicianProvider();
  const [originalCollection, setOriginalCollection] = useState(
    clinicianstate.allAssignments.filter(
      (assignment) => assignment.assignment_accepted === null
    )
  );
  const [pendingSearchAssignments, setPendingSearchAssignments] = useState(
    originalCollection
  );
  const [dialogVisible, toggleDialogVisible] = useToggleDialog();
  const [assignmentDialogContent, setAssignmentDialogContent] = useState("");
  const [assignmentId, setAssignmentId] = useState(undefined);
  const [errorDialogVisible, toggleErrorDialogVisible] = useToggleDialog();
  const [errorDialogContent, setErrorDialogContent] = useState({
    title: "",
    content: "",
  });
  const { deviceInfo } = useDeviceInfoProvider();

  function handleforDialog(title, message) {
    toggleErrorDialogVisible();
    setErrorDialogContent({
      title: title,
      content: message,
    });
  }

  async function toggleConfirmDialog(userId, assignId) {
    if (!getNetworkStatus()) {
      handleforDialog("Network Error", "Internet Connection is required.");
      return;
    }

    const data = await HttpHelper.Get.GetUserById(userId, authState.userToken);
    if (!data) {
      handleforDialog("Server Error.", "User not found.");
      return;
    }
    setAssignmentDialogContent(
      `Email: ${data.email}\nName: ${
        data.name ?? "Not Provided"
      }\nContact Info: ${data.contact_information ?? "Not Provided"}`
    );
    setAssignmentId(assignId);
    toggleDialogVisible();
  }

  async function handleAssignmentAcceptDecline(isAccepted) {
    let res;
    if (isAccepted) {
      console.log("Accepting assignment");
      // API returns the assignment object as data
      res = await HttpHelper.Get.GetClinicianAcceptAssignment(
        assignmentId,
        authState.userToken
      );
    } else {
      console.log("Declining assignment");
      // API only returns boolen as data
      res = await HttpHelper.Get.GetClinicianDeleteAssignment(
        assignmentId,
        authState.userToken
      );
    }
    if (res.error) {
      handleforDialog("Server Error.", res.message);
      return;
    } else {
      // update the local state with the new data
      if (isAccepted) {
        dispatchclinician({
          type: ClinicianProviderDispatchMethodConstants.UPDATEASSIGNMENT,
          payload: res.data,
        });
      } else {
        dispatchclinician({
          type: ClinicianProviderDispatchMethodConstants.REMOVEASSIGNMENT,
          payload: assignmentId,
        });
      }
    }
    toggleDialogVisible();
    handleforDialog("Response Recorded", "Successfully submitted response.");
    setAssignmentId(undefined);
  }

  async function fetchAllAssignments() {
    if (!getNetworkStatus()) {
      handleforDialog("Network Error", "Internet Connection is required.");
      return;
    }
    console.log("Getting New Assignments");
    const res = await HttpHelper.Get.GetAllClinicianAssignments(
      authState.userToken
    );
    if (res.error) {
      handleforDialog("Server Error", res.message);
      return;
    }
    const data = res.data;
    dispatchclinician({
      type: ClinicianProviderDispatchMethodConstants.SAVEDATA,
      payload: data,
    });
    return;
  }

  // Perform a check on the API to get the latest assignments when focusing into tab
  useFocusEffect(
    useCallback(() => {
      async function fetchData() {
        await fetchAllAssignments();
      }
      fetchData();
      return () => {};
    }, [])
  );

  useEffect(() => {
    setOriginalCollection(
      clinicianstate.allAssignments.filter(
        (assignment) => assignment.assignment_accepted === null
      )
    );
    setPendingSearchAssignments(
      clinicianstate.allAssignments.filter(
        (assignment) => assignment.assignment_accepted === null
      )
    );
  }, [clinicianstate.allAssignments]);

  // Render the Flatlist item
  const renderScrollViewContent = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        toggleConfirmDialog(item.user_id, item.clinician_assignment_id)
      }
    >
      <View key={item.clinician_assignment_id} style={styles.row}>
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

  return (
    <View style={styles.fill}>
      <BackButton color="#fff" />
      <AnimatedHeaderFlatList
        headerImageSource={BG5}
        headerQuoteText={quote}
        headerTitleText={"Pending Assignments"}
        refreshCallback={fetchAllAssignments}
        data={pendingSearchAssignments}
        renderItem={renderScrollViewContent}
        keyExtractor={(item) => item.clinician_assignment_id.toString()}
        ListHeaderComponent={
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingHorizontal: wp("4.5%"),
            }}
          >
            <MySearchBar
              collectionChanging={pendingSearchAssignments}
              collectionOriginal={originalCollection}
              placeholder="Search Assignment.."
              searchKey={"user_id"}
              callback={setPendingSearchAssignments}
            />
          </View>
        }
        headerQuantityView={() => (
          <RowWrapper>
            <MaterialCommunityIcons
              name="clipboard-plus"
              color="#ffffff"
              size={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("6%")
                  : wp("3.5%")
              }
              style={{ marginRight: wp("2%") }}
            />
            <NativeText style={styles.whitetext}>
              {originalCollection?.length} records
            </NativeText>
          </RowWrapper>
        )}
      />

      <ConfirmCancelDialog
        visible={dialogVisible}
        title={"Accept Assignment?"}
        content={assignmentDialogContent}
        positiveText={"Accept"}
        neutralText={"Cancel"}
        negativeText={"Decline"}
        onConfirm={() => handleAssignmentAcceptDecline(true)}
        onDismiss={toggleDialogVisible}
        onDecline={() => handleAssignmentAcceptDecline(false)}
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
}

function StyleProvider() {
  const { colors } = useTheme();
  return StyleSheet.create({
    fill: {
      flex: 1,
    },
    row: {
      marginHorizontal: wp("4.5%"),
      backgroundColor: colors.surface,
      marginBottom: hp("1.5%"),
      borderRadius: 10,
    },
    renderContent: {
      paddingHorizontal: 10,
      justifyContent: "space-between",
    },
    whitetext: {
      color: "#ffffff",
    },
  });
}
