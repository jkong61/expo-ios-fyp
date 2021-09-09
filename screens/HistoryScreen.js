import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, FlatList, Dimensions } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import {
  MenuButton,
  RowWrapper,
  ErrorDialog,
  EmptyListComponent,
} from "@components/";
import { useHealthProvider } from "@config/HealthProvider";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import HistoryTabCard from "@components/HistoryTabCard";
import { MealCard } from "@components/MealHistory";
import { HealthCard } from "@components/HealthHistory";
import { AssignmentCard } from "@components/AssignmentHistory";
import { useMealProvider } from "@config/MealProvider";
import { useAssignedClinicianProvider } from "@config/AssignedClinicianProvider";
import { AuthContext } from "@config/ContextHelper";
import { getNetworkStatus } from "@utilities/helpers";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import HttpRequest from "@http/HttpHelper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

/**
 * Main History Scren
 */
const HistoryScreen = () => {
  const { colors } = useTheme();
  const styles = StyleProvider();
  const [healthstate] = useHealthProvider();
  const [mealState] = useMealProvider();
  const [assignedClinicianState, dispatch] = useAssignedClinicianProvider();
  const { bloodGlucoseReminder, authState } = useContext(AuthContext); // for get the user token purpose

  // Uses state to toggle if is meal or health records
  const navigation = useNavigation();
  const [state, setState] = useState(0);

  const [errorDialogVisible, toggleErrorDialogVisible] = useToggleDialog();
  const [errorDialogContent, setErrorDialogContent] = useState({
    title: "",
    content: "",
  });
  const { deviceInfo } = useDeviceInfoProvider();

  const cardData = [
    {
      id: 0,
      title: "Meal History",
      type: "meal",
    },
    {
      id: 1,
      title: "Health History",
      type: "health",
    },
    {
      id: 2,
      title: "Assignment History",
      type: "assignedClinician",
    },
  ];

  const renderCardItem = ({ item }) => {
    if (item.type === "meal") {
      return (
        <HistoryTabCard
          state={0}
          currentState={state === 0}
          title={item.title}
          paragraph={`${mealState?.length} records`}
          onPress={() => setState(0)}
        />
      );
    } else if (item.type == "health") {
      return (
        <HistoryTabCard
          state={1}
          currentState={state === 1}
          title={item.title}
          paragraph={`${healthstate?.records?.length} records`}
          onPress={() => setState(1)}
        />
      );
    } else {
      return (
        <HistoryTabCard
          state={2}
          currentState={state === 2}
          title={item.title}
          paragraph={`${assignedClinicianState.length} records`}
          onPress={() => setState(2)}
        />
      );
    }
  };

  const renderItem = ({ item }) => {
    return state === 0 ? (
      <MealCard item={item} reminder={bloodGlucoseReminder} />
    ) : state === 1 ? (
      <HealthCard data={item} />
    ) : (
      <AssignmentCard item={item} />
    );
  };

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

  return (
    <View style={styles.container}>
      <ScrollView>
        <MenuButton />
        <View style={styles.body}>
          <Text
            style={{
              ...styles.title,
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("8%")
                  : wp("5%"),
            }}
          >
            History
          </Text>

          <FlatList
            style={{ flex: 1 }}
            horizontal={true}
            data={cardData}
            renderItem={renderCardItem}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
          />

          <View style={styles.subtitleContainer}>
            <Text
              style={{
                ...styles.subtitle,
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("5%")
                    : wp("3%"),
              }}
            >
              {state === 0
                ? "Meal History"
                : state === 1
                ? "Health Records"
                : "Assignment History"}
            </Text>
            <Button
              uppercase={false}
              labelStyle={{
                //fontSize: helpers.actuatedNormalizeFontSize(18),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("5%")
                    : wp("3%"),
              }}
              onPress={() =>
                state === 0
                  ? navigation.navigate("DietWatcherStack", {
                      screen: "MealHistory",
                    })
                  : state === 1
                  ? navigation.navigate("HealthNavigator", {
                      screen: "HealthRecordHistory",
                    })
                  : navigation.navigate("ClinicianNavigator", {
                      screen: "Assignment",
                    })
              }
            >
              View All
            </Button>
          </View>
        </View>
        <FlatList
          style={{ flex: 1 }}
          data={
            state === 0
              ? mealState.slice(0, 5)
              : state === 1
              ? healthstate.records.slice(0, 5)
              : assignedClinicianState.slice(0, 5)
          }
          horizontal={true}
          renderItem={renderItem}
          keyExtractor={
            state === 0
              ? (item) => item.meal_id.toString()
              : state === 1
              ? (item) => item.health_record_id.toString()
              : (item) => item.clinician_assignment_id.toString()
          }
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<EmptyListComponent />}
        />
      </ScrollView>
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

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    body: {
      flex: 1,
      marginTop: hp("10%"),
      //marginHorizontal: "5%",
      flexDirection: "column",
    },
    subtitleContainer: {
      flexDirection: "row",
      marginTop: hp("5%"),
      alignItems: "baseline",
      justifyContent: "space-between",
      marginHorizontal: wp("4.5%"),
      marginBottom: hp("2%"),
    },
    title: {
      fontWeight: "bold",
      marginHorizontal: wp("4.5%"),
      //fontSize: helpers.actuatedNormalizeFontSize(30),
    },
    subtitle: {
      //fontSize: helpers.actuatedNormalizeFontSize(22),

      fontWeight: "bold",
      //marginLeft: wp("4.5%"),
    },
  });
}

export default HistoryScreen;
