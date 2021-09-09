import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text as NativeText } from "react-native";
import { useTheme } from "react-native-paper";
import HttpHelper from "@http/HttpHelper";
import { BG6 } from "@assets";
import { getNetworkStatus } from "@utilities/helpers";
import {
  BackButton,
  ErrorDialog,
  AnimatedHeaderFlatList,
  RowWrapper,
  MySearchBar,
} from "@components";
import PatientItem from "@components/Patient/PatientItem";
import { useFocusEffect } from "@react-navigation/native";
import {
  useClinicianProvider,
  ClinicianProviderDispatchMethodConstants,
} from "@config/ClinicianProvider";
import { useContext } from "react";
import { AuthContext } from "@config/ContextHelper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const medicinequote =
  "“We should be concerned not only about the health of individual patients, but also the health of our entire society.” ~ Ben Carson";

// adapted from https://medium.com/appandflow/react-native-scrollview-animated-header-10a18cb9469e
export default function ClinicianPatientScreen() {
  const styles = StyleProvider();
  const { authState } = useContext(AuthContext);
  const [clinicianstate, dispatchclinician] = useClinicianProvider();
  const [dialogVisible, toggleDialogVisible] = useToggleDialog();
  const { deviceInfo } = useDeviceInfoProvider();

  // const [originalCollection, setOriginalCollection] = useState(clinicianstate.allAssignments.filter((assignment) => assignment.assignment_accepted === true));

  const [originalCollection, setOriginalCollection] = useState(undefined);
  const [patientSearchCollection, setPatientSearchCollection] = useState(
    originalCollection
  );
  const [dialogContent, setDialogContent] = useState({
    title: "",
    content: "",
  });

  function handlerForDialog(title, message) {
    toggleDialogVisible();
    setDialogContent({
      title: title,
      content: message,
    });
  }

  async function fetchAllAssignments() {
    if (!getNetworkStatus()) {
      handlerForDialog("Network Error", "Internet Connection is required.");
      return;
    }
    console.log("Getting New Assignments");
    const res = await HttpHelper.Get.GetAllClinicianAssignments(
      authState.userToken
    );
    if (res.error) {
      handlerForDialog("Server Error", res.message);
      return;
    }
    const data = res.data;
    dispatchclinician({
      type: ClinicianProviderDispatchMethodConstants.SAVEDATA,
      payload: data,
    });
    return;
  }

  // Render the Flatlist item
  const renderScrollViewContent = ({ item }) => <PatientItem item={item} />;

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
        (assignment) => assignment.assignment_accepted === true
      )
    );
    setPatientSearchCollection(
      clinicianstate.allAssignments.filter(
        (assignment) => assignment.assignment_accepted === true
      )
    );
  }, [clinicianstate.allAssignments]);

  return (
    <View style={styles.fill}>
      <BackButton color="#fff" />
      <AnimatedHeaderFlatList
        headerImageSource={BG6}
        headerTitleText={"Patients"}
        headerQuoteText={medicinequote}
        data={patientSearchCollection}
        keyExtractor={(item) => item.clinician_assignment_id.toString()}
        // refreshCallback={fetchAllAssignments}
        renderItem={renderScrollViewContent}
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
              collectionChanging={patientSearchCollection}
              collectionOriginal={originalCollection}
              placeholder="Search Patient ID.."
              searchKey={"user_id"}
              callback={setPatientSearchCollection}
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

      <ErrorDialog
        visible={dialogVisible}
        title={dialogContent.title}
        content={dialogContent.content}
        onDismiss={toggleDialogVisible}
        onPress={toggleDialogVisible}
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
      backgroundColor: colors.surface,
      marginBottom: hp("1.5%"),
      borderRadius: 10,
      marginHorizontal: wp("4.5%"),
    },
    renderContent: {
      paddingVertical: 0,
      margin: 0,
    },
    whitetext: {
      color: "#ffffff",
    },
  });
}
