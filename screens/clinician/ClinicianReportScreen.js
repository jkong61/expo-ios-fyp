import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  FlatList,
} from "react-native";
import {
  BackButton,
  EmptyListComponent,
  MyContainer,
  RowWrapper,
} from "@components";
import PatientItem from "@components/Patient/PatientItem";
import { Text, Title, Badge, useTheme } from "react-native-paper";
import { useClinicianProvider } from "@config/ClinicianProvider";
import { useNavigation } from "@react-navigation/core";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ClinicianReportScreen() {
  const [clinicianState] = useClinicianProvider();
  const { deviceInfo } = useDeviceInfoProvider();
  const styles = StyleProvider();
  const { colors } = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [result, setResult] = useState(getPatientInfo());

  function getPatientInfo(resultIndex = 0) {
    const patientIDs = clinicianState.trend.result[resultIndex].data.toString();
    let assignmentInfo = clinicianState.allAssignments.map((ass) => {
      if (patientIDs.includes(ass.user_id)) return ass;
    });
    assignmentInfo = assignmentInfo.filter(Boolean);
    return assignmentInfo;
  }

  const clickOnTab = (index) => {
    setSelectedTab(index);
    setResult(getPatientInfo(index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <View style={styles.titleheader}>
        <Title
          style={{
            ...styles.title,
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
          }}
        >
          Patients Report
        </Title>
      </View>
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={result}
          renderItem={({ item }) => <PatientItem item={item} />}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          ListEmptyComponent={<EmptyListComponent />}
        />
      </View>
      <MyContainer style={styles.mock}>
        <RowWrapper style={styles.wrapper}>
          <TouchableOpacity onPress={() => clickOnTab(0)}>
            <RowWrapper style={styles.tab}>
              <Text
                style={
                  selectedTab === 0 ? styles.tabTextActive : styles.tabText
                }
              >
                Normal Patient
              </Text>
              <Badge style={selectedTab !== 0 ? styles.badgeInactive : null}>
                {clinicianState.trend.result[0].data.length}
              </Badge>
            </RowWrapper>
          </TouchableOpacity>
          <View
            style={{
              width: 1,
              height: 40,
              opacity: 0.5,
              backgroundColor: colors.placeholder,
            }}
          />
          <TouchableOpacity onPress={() => clickOnTab(1)}>
            <RowWrapper style={styles.tab}>
              <Text
                style={
                  selectedTab === 1 ? styles.tabTextActive : styles.tabText
                }
              >
                Abnormal Patient
              </Text>
              <Badge style={selectedTab !== 1 ? styles.badgeInactive : null}>
                {clinicianState.trend.result[1].data.length}
              </Badge>
            </RowWrapper>
          </TouchableOpacity>
        </RowWrapper>
      </MyContainer>
    </SafeAreaView>
  );
}

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    body: {
      marginHorizontal: 16,
    },
    item: {
      backgroundColor: "#f9c2ff",
      padding: 20,
      marginVertical: 8,
      width: "100%",
    },
    sectionHeader: {
      width: wp("90%"),
    },
    headerText: {
      fontSize: hp("4.5%"),
      textAlign: "left",
    },
    renderedtitle: {
      fontSize: hp("3%"),
    },
    titleText: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.5%") : wp("2.5%"),
    },
    title: {
      marginTop: Platform.OS === "ios" ? hp("2%") : hp("4%"),
      marginBottom: hp("2%"),
      alignSelf: "center",
    },
    titleheader: {
      alignItems: "center",
    },
    scrolllistcontentstyle: {
      alignItems: "center",
    },
    mock: {
      position: "absolute",
      bottom: 0,
      marginVertical: 0,
      paddingVertical: 0,
      padding: 0,
    },
    wrapper: {
      justifyContent: "space-evenly",
      alignItems: "center",
      paddingVertical: 10,
    },
    tab: {
      width: wp("45%"),
      padding: 10,
      justifyContent: "center",
    },
    tabTextActive: {
      textAlign: "center",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.55%") : wp("2.5%"),
      fontWeight: "bold",
      color: colors.primary,
      paddingRight: 5,
    },
    tabText: {
      textAlign: "center",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.55%") : wp("2.5%"),
      fontWeight: "bold",
      color: "grey",
      paddingRight: 5,
    },
    badgeInactive: {
      backgroundColor: "grey",
      color: "white",
    },
  });
}
