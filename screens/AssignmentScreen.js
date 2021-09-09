import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text as NativeText } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { BG6 } from "@assets";
import HttpRequest from "@http/HttpHelper";
import {
  BackButton,
  RowWrapper,
  AnimatedHeaderFlatList,
  ErrorDialog,
} from "@components";
import { AssignmentItem } from "@components/AssignmentHistory";
import { getNetworkStatus } from "@utilities/helpers";
import { AuthContext } from "@config/ContextHelper";
import { useAssignedClinicianProvider } from "@config/AssignedClinicianProvider";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

/*
 * global variable
 */
const quote =
  "“Make food a very incidental part of your life by filling your life so full of meaningful things that you’ll hardly have time to think about food.” ~ Peace Pilgrim";

const renderItem = ({ item }) => (
  <AssignmentItem key={item.clinician_assignment_id} item={item} />
);

// React Component
const AssignmentScreen = () => {
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const [assignedClinicianState, dispatch] = useAssignedClinicianProvider();

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

  async function fetchAssignedClinicianRecords() {
    if (!getNetworkStatus()) {
      handleforDialog("Network Error", "Internet Connection is required.");
      return;
    }

    let res = await HttpRequest.Get.GetAssignedClinicians(authState.userToken);
    if (res?.error) {
      handleforDialog("Server Error", res.message);
      return;
    }

    if (res.length > 0) {
      console.log("fetched");
      dispatch({
        type: "getAssignedClinician",
        payload: res,
      });
    }
  }

  useEffect(() => {
    fetchAssignedClinicianRecords();
    return () => {};
  }, []);

  return (
    <View style={{ height: "100%" }}>
      <BackButton color="#fff" />
      <AnimatedHeaderFlatList
        headerImageSource={BG6}
        headerQuoteText={quote}
        headerTitleText="Clinician Assignment"
        data={assignedClinicianState}
        renderItem={renderItem}
        refreshCallback={fetchAssignedClinicianRecords}
        keyExtractor={(item) => item.clinician_assignment_id.toString()}
        headerQuantityView={() => (
          <RowWrapper>
            <FontAwesome5
              name="clipboard-list"
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
              {assignedClinicianState?.length ?? 0} records
            </NativeText>
          </RowWrapper>
        )}
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

// View stylesheet
const styles = StyleSheet.create({
  whitetext: {
    color: "#ffffff",
  },
});

export default AssignmentScreen;
