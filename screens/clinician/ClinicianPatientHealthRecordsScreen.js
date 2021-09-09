import React, { useState, useEffect } from "react";
import { Text as NativeText, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import HttpHelper from "@http/HttpHelper";
import { BG1 } from "@assets";
import { getNetworkStatus, getDateObjFromISOString } from "@utilities/helpers";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import {
  BackButton,
  AnimatedHeaderFlatList,
  ErrorDialog,
  RowWrapper,
  ColumnWrapper,
  MyLinearGradient,
  Loader,
} from "@components";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "@config/ContextHelper";
import { TouchableOpacity } from "react-native-gesture-handler";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import useLoading from "@utilities/customhooks/useLoading";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const quote =
  "“I believe that the greatest gift that you can give your family and the world is a healthy you.” ~ Joyce Meyer";

export default function ClinicianPatientHealthRecordsScreen() {
  const { colors } = useTheme();
  const { authState } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const styles = StyleProvider();
  const [patientId] = useState(route?.params?.patientId);
  const [patientHealthRecords, setPatientHealthRecords] = useState([]);
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

  async function fetchUserHealthRecord() {
    if (!getNetworkStatus()) {
      handleforDialog("Network Error", "Internet Connection is required.");
      return;
    }
    let res = await HttpHelper.Get.GetClinicianAssignedUserHealthRecords(
      patientId,
      authState.userToken
    );
    if (res.error) {
      handleforDialog("Server Error", res.message);
    } else {
      setPatientHealthRecords(res.data);
    }
  }
  const [getPatientData, loadingData] = useLoading(fetchUserHealthRecord);

  useEffect(() => {
    // Get the patient Records here.
    getPatientData();
  }, []);

  // Render the Flatlist item
  const renderScrollViewContent = ({ item }) => {
    const date = getDateObjFromISOString(item.date_created);
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ClinicianSinglePatientHealthRecord", {
            healthRecordId: item.health_record_id,
          })
        }
      >
        <View key={item.health_record_id} style={styles.row}>
          <RowWrapper style={styles.renderContent}>
            <MyLinearGradient style={{ margin: wp("2%") }}>
              <FontAwesome5
                name="file-medical"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("11%")
                    : wp("7%")
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
              <View>
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

  return (
    <View style={styles.fill}>
      <BackButton color="#fff" />
      <AnimatedHeaderFlatList
        headerImageSource={BG1}
        headerQuoteText={quote}
        headerTitleText={"Health History"}
        refreshCallback={fetchUserHealthRecord}
        data={patientHealthRecords}
        renderItem={renderScrollViewContent}
        keyExtractor={(item) => item.health_record_id.toString()}
        headerQuantityView={() => (
          <RowWrapper>
            <FontAwesome5
              name="file-medical"
              color="#ffffff"
              size={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("6%")
                  : wp("3.5%")
              }
              style={{ marginRight: wp("2%") }}
            />
            <NativeText style={styles.whitetext}>
              {patientHealthRecords?.length} records
            </NativeText>
          </RowWrapper>
        )}
        ListHeaderComponent={
          <View
            style={{
              paddingHorizontal: wp("4.5%"),
            }}
          />
        }
      />

      <ErrorDialog
        visible={errorDialogVisible}
        title={errorDialogContent.title}
        content={errorDialogContent.content}
        onDismiss={toggleErrorDialogVisible}
        onPress={toggleErrorDialogVisible}
      />

      <Loader visible={loadingData} />
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
      paddingVertical: 0,
      margin: 0,
    },
    whitetext: {
      color: "#ffffff",
    },
  });
}
