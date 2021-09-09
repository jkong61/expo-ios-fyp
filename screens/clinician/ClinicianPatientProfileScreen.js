import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import { Text, Avatar, Title, useTheme } from "react-native-paper";
import HttpHelper from "@http/HttpHelper";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  actuatedNormalizeFontSize,
  getNetworkStatus,
} from "@utilities/helpers";
import {
  BackButton,
  ErrorDialog,
  Loader,
  MyContainer,
  PrimaryButton,
  ColumnWrapper,
  RowWrapper,
  TouchableSectionItem,
  RightCornerButton,
  ConfirmCancelDialog,
} from "@components/";
import { AuthContext } from "@config/ContextHelper";
import { EthnicityText } from "@config/EthnicityConstants";
import { AVATAR, AVATAR2 } from "@assets";
import {
  useClinicianProvider,
  ClinicianProviderDispatchMethodConstants,
} from "@config/ClinicianProvider";
import useLoading from "@utilities/customhooks/useLoading";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import useDialogHandler from "@utilities/customhooks/useDialogHandler";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ClinicianPatientProfileScreen() {
  const { authState } = useContext(AuthContext);
  const { colors } = useTheme();
  const styles = StyleProvider();
  const route = useRoute();
  const navigation = useNavigation();

  const [patientInfo, setPatientInfo] = useState({
    info: undefined,
    profile: undefined,
  });
  const [deleteDialogVisible, toggleDeleteDialogVisible] = useToggleDialog();
  const [, dispatchclinician] = useClinicianProvider();

  const [assignmentId, setAssignmentId] = useState();
  const [errorDialogVisible, toggleErrorDialogVisible] = useToggleDialog();
  const [errorDialogContent, toggleDialog] = useDialogHandler(
    toggleErrorDialogVisible
  );
  const { deviceInfo } = useDeviceInfoProvider();

  const userData = route?.params?.record;

  async function handleAssignmentDeletion() {
    let res = await HttpHelper.Get.GetClinicianDeleteAssignment(
      assignmentId,
      authState.userToken
    );
    if (res.error) {
      toggleDialog({
        title: "Server Error.",
        message: res.message,
      });
    } else {
      dispatchclinician({
        type: ClinicianProviderDispatchMethodConstants.REMOVEASSIGNMENT,
        payload: assignmentId,
      });
      toggleDeleteDialogVisible();
      toggleDialog({
        title: "Response Submitted",
        message: "Patient Assignment has been sucessfully removed.",
      });
    }
  }

  async function fetchPatientData(patientId) {
    if (!getNetworkStatus()) {
      toggleDialog({
        title: "Network Error",
        message: "Internet Connection is required.",
      });
      return;
    }
    try {
      let [profile, info] = await Promise.all([
        HttpHelper.Get.GetClinicianAssignedUserHealthProfile(
          patientId,
          authState.userToken
        ),
        HttpHelper.Get.GetUserById(patientId, authState.userToken),
      ]);
      setPatientInfo({
        info: info,
        profile: profile,
      });
    } catch (err) {
      toggleDialog({
        title: "Server Error",
        message: "Something went wrong, try again later.",
      });
    }
  }
  const [getPatientData, loading] = useLoading(fetchPatientData);

  const LocalContainer = (props) => (
    <MyContainer style={{ alignItems: "flex-start", marginVertical: "1%" }}>
      {props.children}
    </MyContainer>
  );

  function getBoolean(value) {
    if (value === null || value === undefined) {
      return "Not Provided";
    } else {
      return value ? "Yes" : "No";
    }
  }

  useEffect(()=>{
    getPatientData(userData?.user_id ?? userData);
    setAssignmentId(userData?.clinician_assignment_id);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <RightCornerButton
        iconname={"delete-circle"}
        onPress={toggleDeleteDialogVisible}
        color={colors.error}
        disabled={!assignmentId}
      />
      <Title style={styles.title}>
        Patient ID : {patientInfo?.info?.user_id}
      </Title>

      <View>
        <RowWrapper style={styles.avatar}>
          <Avatar.Image
            source={patientInfo?.profile?.gender == "Female" ? AVATAR : AVATAR2}
            size={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("24%") : wp("18%")
            }
          />
          <ColumnWrapper style={styles.buttoncolumn}>
            <PrimaryButton
              title="Health Records"
              style={styles.primarybutton}
              onPress={() => {
                navigation.navigate("ClinicianPatientHealthRecord", {
                  patientId: patientInfo?.info?.user_id,
                });
              }}
            />
            <PrimaryButton
              title="Meal Records"
              style={styles.primarybutton}
              onPress={() => {
                navigation.navigate("ClinicianPatientMeals", {
                  patientId: patientInfo?.info?.user_id,
                });
              }}
            />
          </ColumnWrapper>
        </RowWrapper>
      </View>
      <ScrollView style={{ paddingHorizontal: "5%" }}>
        <LocalContainer>
          <TouchableSectionItem
            title="Email"
            touchable={false}
            value={patientInfo?.info?.email}
          />
          <TouchableSectionItem
            title="Name"
            touchable={false}
            value={patientInfo?.info?.name ?? "Not Provided"}
          />
          <TouchableSectionItem
            title="Contact"
            touchable={false}
            value={patientInfo?.info?.contact_information ?? "Not Provided"}
          />
        </LocalContainer>

        <LocalContainer>
          <TouchableSectionItem
            title="Height (cm)"
            touchable={false}
            value={
              patientInfo?.profile?.height
                ? `${patientInfo.profile.height} cm`
                : "Not Provided"
            }
          />
          <TouchableSectionItem
            title="Gender"
            touchable={false}
            value={patientInfo?.profile?.gender ?? "Not Provided"}
          />
          <TouchableSectionItem
            title="Ethnicity"
            touchable={false}
            value={
              !isNaN(patientInfo?.profile?.ethnicity)
                ? EthnicityText[patientInfo.profile.ethnicity]
                : "Not Provided"
            }
          />
        </LocalContainer>

        <LocalContainer>
          <TouchableSectionItem
            title="High Blood Glucose History"
            touchable={false}
            value={getBoolean(patientInfo?.profile?.high_blood_glucose_history)}
          />
          <TouchableSectionItem
            title="High Blood Pressure History"
            touchable={false}
            value={getBoolean(
              patientInfo?.profile?.high_blood_pressure_medication_history
            )}
          />
        </LocalContainer>

        <LocalContainer>
          <Text style={styles.titleText}>Relatives with Diabetes</Text>
          <TouchableSectionItem
            title="Non - Immediate"
            touchable={false}
            value={getBoolean(
              patientInfo?.profile?.family_history_diabetes_non_immediate
            )}
          />
          <TouchableSectionItem
            title="Parents"
            touchable={false}
            value={getBoolean(
              patientInfo?.profile?.family_history_diabetes_parents
            )}
          />
          <TouchableSectionItem
            title="Siblings"
            touchable={false}
            value={getBoolean(
              patientInfo?.profile?.family_history_diabetes_siblings
            )}
          />
          <TouchableSectionItem
            title="Children"
            touchable={false}
            value={getBoolean(
              patientInfo?.profile?.family_history_diabetes_children
            )}
          />
        </LocalContainer>
      </ScrollView>

      <Loader visible={loading} />

      <ConfirmCancelDialog
        visible={deleteDialogVisible}
        title={"Delete Assignment?"}
        content={`Delete Assignment of Patient ID: ${patientInfo?.info?.user_id}`}
        positiveText={"Yes"}
        neutralText={"Cancel"}
        onConfirm={handleAssignmentDeletion}
        onDismiss={toggleDeleteDialogVisible}
      />

      <ErrorDialog
        visible={errorDialogVisible}
        title={errorDialogContent.title}
        content={errorDialogContent.content}
        onPress={toggleErrorDialogVisible}
        optionalCallback={navigation.goBack}
      />
    </SafeAreaView>
  );
}

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    title: {
      marginTop: hp("4%"),
      marginBottom: hp("3%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
      alignSelf: "center",
    },
    titleheader: {
      alignItems: "center",
    },
    avatar: {
      justifyContent: "space-around",
    },
    buttoncolumn: {
      width: "50%",
      justifyContent: "space-around",
    },
    primarybutton: {
      marginTop: 0,
      marginVertical: hp("1%"),
      width: "100%",
    },
    titleText: {
      fontWeight: "bold",
      fontSize: actuatedNormalizeFontSize(16),
    },
  });
}
