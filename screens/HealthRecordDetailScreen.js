import React, { useEffect, useReducer, useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme, Modal } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import * as helpers from "@utilities/helpers";
import {
  MyContainer as Container,
  ColumnWrapper,
  RowWrapper as MyRowWrapper,
  BackButton,
  PrimaryButton,
  SecondaryButton,
  MySlider,
  Loader,
  ErrorDialog,
  TouchableSectionItem,
  TwoSelections,
} from "@components";
import {
  useInputModalProvider,
  ModalActionsConstants,
} from "@components/InputModalProvider";
import {
  useHealthProvider,
  HealthProviderDispatchMethodConstants,
} from "@config/HealthProvider";
import { useNavigation, useRoute } from "@react-navigation/native";
import HttpHelper from "@http/HttpHelper";
import { AuthContext } from "@config/ContextHelper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

let defaultRecordState = {
  waist_circumference: null,
  weight: null,
  blood_pressure_medication: false,
  physical_exercise_hours: 0,
  physical_exercise_minutes: 0,
  smoking: false,
  vegetable_fruit_berries_consumption: false,
  systolic_pressure: null,
  fasting_blood_glucose: null,
  hdl_cholesterol: null,
  triglycerides: null,
};

const MyContainer = (props) => (
  <Container style={{ alignItems: "flex-start", marginVertical: "1.5%" }}>
    {props.children}
  </Container>
);

const RowWrapper = (props) => (
  <MyRowWrapper
    style={{
      ...props.style,
      paddingVertical: "1%",
      justifyContent: "space-between",
    }}
  >
    {props.children}
  </MyRowWrapper>
);

const getToday = () => {
  const d = new Date();
  const today = helpers.getLocalDateTime(d);
  return today;
};

// Main Screen
const HealthRecordDetailScreen = () => {
  const styles = StyleProvider();
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const [healthState, healthDispatch] = useHealthProvider(); //get global context
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { deviceInfo } = useDeviceInfoProvider();

  // Able to access params from this hook
  // if no params use default record else use existing data
  const passedData = route.params;

  // alter defaultRecordState based on daily metric
  defaultRecordState = {
    ...defaultRecordState,
    systolic_pressure: healthState.dailymetric?.systolic_pressure ?? null,
    fasting_blood_glucose:
      healthState.dailymetric?.fasting_blood_glucose ?? null,
    hdl_cholesterol: healthState.dailymetric?.hdl_cholesterol ?? null,
    triglycerides: healthState.dailymetric?.triglycerides ?? null,
  };

  const currentstate = passedData?.record ?? defaultRecordState;
  const [localRecordState, localDispatch] = useReducer(
    recordReducer,
    currentstate
  );
  const dateObj = helpers.getDateObjFromISOString(
    localRecordState?.date_created ?? helpers.getLocalDateTime(new Date())
  );
  const [bmi, setBMI] = useState(undefined);
  const [modalDispatch] = useInputModalProvider();
  const [isLoading, setLoading] = useState(false);
  const [visibleConfirmation, setVisibleConfirmation] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const handleExerciseChange = (val, exerciseType) => {
    switch (exerciseType) {
      case "hours":
        localDispatch({ type: "saveHours", payload: val });
        break;
      case "mins":
        localDispatch({ type: "saveMins", payload: val });
        break;
      default:
        return;
    }
  };

  // Passes health record back to server
  const addHealthRecordtoAPI = async (passedData, localRecordState) => {
    const networkStatus = helpers.getNetworkStatus();
    if (!networkStatus) {
      // No Network detected
      setVisibleConfirmation(false);
      setNetworkError(true);
      return;
    }
    setLoading(true);
    const callback = passedData
      ? await HttpHelper.Put.UpdateHealthRecord(
          localRecordState,
          passedData.record.health_record_id,
          authState.userToken
        )
      : await HttpHelper.Post.CreateHealthRecord(
          localRecordState,
          authState.userToken
        );

    const returnedData = callback;
    healthDispatch({
      type: passedData
        ? HealthProviderDispatchMethodConstants.UPDATEHEALTHRECORD
        : HealthProviderDispatchMethodConstants.ADDHEALTHRECORD,
      payload: returnedData,
    });

    // Only update the provider and Async Store if it is a newly created Health Record
    if (!passedData) {
      healthDispatch({
        type: HealthProviderDispatchMethodConstants.UPDATEDAILYMETRIC,
        payload: {
          systolic_pressure: localRecordState?.systolic_pressure ?? null,
          fasting_blood_glucose:
            localRecordState?.fasting_blood_glucose ?? null,
          hdl_cholesterol: localRecordState?.hdl_cholesterol ?? null,
          triglycerides: localRecordState?.triglycerides ?? null,
        },
      });
    }

    setLoading(false);
    navigation.goBack();
  };

  // Delete health record
  const deleteHealthRecord = async (passedData) => {
    setLoading(true);
    const networkStatus = helpers.getNetworkStatus();
    if (networkStatus) {
      const response = await HttpHelper.Delete.DeleteHealthRecord(
        passedData.record.health_record_id,
        authState.userToken
      );
      if (response) {
        // Delete successful
        healthDispatch({
          type: HealthProviderDispatchMethodConstants.DELETEHEALTHRECORD,
          payload: passedData.record.health_record_id,
        });
        setLoading(false);
        navigation.goBack();
      } else {
        // Delete unsuccessful and turn off loading
        setLoading(false);
      }
    } else {
      // No Network detected
      setVisibleConfirmation(false);
      setNetworkError(true);
      setLoading(false);
    }
  };

  const showConfirmation = () => {
    setVisibleConfirmation(true);
  };
  const hideConfirmation = () => {
    setVisibleConfirmation(false);
  };

  const toggleModal = (title, dispatchCase, value = undefined) =>
    modalDispatch({
      type: ModalActionsConstants.TOGGLE,
      payload: title,
      value: value,
      callback: localDispatch,
      case: dispatchCase,
      inputtype: "numeric",
    });

  // For BMI calculation
  useEffect(() => {
    if (localRecordState.weight && healthState.profile.height) {
      let bmi =
        localRecordState.weight / (healthState.profile.height / 100) ** 2;
      setBMI(bmi.toPrecision(3));
    } else {
      setBMI("0.0");
    }
  }, [localRecordState.weight, healthState.profile.height]);

  // For getting the latest health record
  useEffect(() => {
    const fetchdata = async () => {
      if (!passedData?.record) {
        const data = await HttpHelper.Get.GetLatestHealthRecord(
          authState.userToken
        );
        if (data) {
          localDispatch({ type: "setState", payload: data });
        }
      }
    };
    if (helpers.getNetworkStatus()) {
      fetchdata();
    }
  }, [authState.userToken, passedData?.record]);

  return (
    <View style={styles.container}>
      <BackButton />
      <View style={styles.header}>
        <Text style={styles.title}>
          {passedData ? "Update Health Record" : "Add Health Record"}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollview}>
        <MyContainer>
          <ColumnWrapper>
            <Text style={styles.wrapper_title}>Recorded Date:</Text>
            <Text
              style={{
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("3.8%")
                    : wp("2.8%"),
                color: colors.primary,
              }}
            >
              {localRecordState.date_created
                ? `${dateObj.day} ${dateObj.month} ${dateObj.year} \t\t ${dateObj.weekday} | ${dateObj.timeIn12}`
                : getToday()}
            </Text>
          </ColumnWrapper>
        </MyContainer>

        <MyContainer>
          <ColumnWrapper>
            <Text style={styles.wrapper_title}>Daily Record:</Text>
          </ColumnWrapper>

          <TouchableSectionItem
            title="Waist Circumference(cm)"
            touchable={true}
            value={`${localRecordState.waist_circumference ?? "0.0"} cm`}
            onPress={() =>
              toggleModal(
                "Waist Circumference(cm)",
                "saveWaist",
                localRecordState.waist_circumference?.toString()
              )
            }
          />

          <TouchableSectionItem
            title="Weight(kg)"
            touchable={true}
            value={`${localRecordState.weight ?? "0.0"} kg`}
            onPress={() =>
              toggleModal(
                "Weight(kg)",
                "saveWeight",
                localRecordState.weight?.toString()
              )
            }
          />

          <TouchableSectionItem title="BMI" value={bmi} />
        </MyContainer>

        <MyContainer>
          <ColumnWrapper>
            <Text style={styles.wrapper_title}>Weekly Physical Exercise: </Text>
          </ColumnWrapper>

          <ColumnWrapper>
            <Text
              style={{
                marginTop: hp("2%"),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4%")
                    : wp("3%"),
              }}
            >
              {localRecordState.physical_exercise_hours} Hours
            </Text>
            <MySlider
              value={localRecordState.physical_exercise_hours}
              minimumValue={0}
              maximumValue={10}
              step={1}
              onValueChange={(val) => handleExerciseChange(val, "hours")}
            />
          </ColumnWrapper>

          <ColumnWrapper>
            <Text
              style={{
                marginTop: hp("2%"),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4%")
                    : wp("3%"),
              }}
            >
              {localRecordState.physical_exercise_minutes} Minutes
            </Text>
            <MySlider
              value={localRecordState.physical_exercise_minutes}
              minimumValue={0}
              maximumValue={55}
              step={5}
              onValueChange={(val) => handleExerciseChange(val, "mins")}
            />
          </ColumnWrapper>
          <Text
            style={{
              marginTop: 10,
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4%")
                  : wp("3%"),
            }}
          >
            {`Total: ${localRecordState.physical_exercise_hours} hours, ${localRecordState.physical_exercise_minutes} minutes`}
          </Text>
        </MyContainer>

        <MyContainer>
          <RowWrapper>
            <Text style={styles.overflowText}>
              Are you currently taking medication for high blood pressure?
            </Text>
            <TwoSelections
              choice={localRecordState.blood_pressure_medication}
              deviceInfo={deviceInfo?.deviceType}
              select1={false}
              select2={true}
              press1={() =>
                localDispatch({ type: "saveBPMed", payload: false })
              }
              press2={() => localDispatch({ type: "saveBPMed", payload: true })}
            />
          </RowWrapper>
          <RowWrapper style={{ marginVertical: "2%" }}>
            <Text style={styles.overflowText}>
              Do you currently smoke cigarettes or any other tobacco products on
              a daily basis?
            </Text>
            <TwoSelections
              choice={localRecordState.smoking}
              deviceInfo={deviceInfo?.deviceType}
              select1={false}
              select2={true}
              press1={() =>
                localDispatch({ type: "saveSmoking", payload: false })
              }
              press2={() =>
                localDispatch({ type: "saveSmoking", payload: true })
              }
            />
          </RowWrapper>
          <RowWrapper>
            <Text style={styles.overflowText}>
              Do you consume vegetables, fruit or berries every day?
            </Text>
            <TwoSelections
              choice={localRecordState.vegetable_fruit_berries_consumption}
              deviceInfo={deviceInfo?.deviceType}
              select1={false}
              select2={true}
              press1={() =>
                localDispatch({ type: "saveFruitVege", payload: false })
              }
              press2={() =>
                localDispatch({ type: "saveFruitVege", payload: true })
              }
            />
          </RowWrapper>
        </MyContainer>

        <MyContainer>
          <ColumnWrapper>
            <Text style={styles.wrapper_title}>Optional:</Text>
          </ColumnWrapper>

          <TouchableSectionItem
            title="Systolic Blood Pressure (mmHg)"
            touchable={true}
            value={localRecordState.systolic_pressure ?? "-"}
            onPress={() =>
              toggleModal(
                "Systolic Blood Pressure (mmHg)",
                "saveSysBP",
                localRecordState.systolic_pressure?.toString()
              )
            }
          />

          <TouchableSectionItem
            title="Fasting Blood Glucose (mmol/l)"
            touchable={true}
            value={localRecordState.fasting_blood_glucose ?? "-"}
            onPress={() =>
              toggleModal(
                "Fasting Blood Glucose (mmol/l)",
                "saveFastingGlu",
                localRecordState.fasting_blood_glucose?.toString()
              )
            }
          />

          <TouchableSectionItem
            title="HDL Cholesterol (mmol/l)"
            touchable={true}
            value={localRecordState.hdl_cholesterol ?? "-"}
            onPress={() =>
              toggleModal(
                "HDL Cholesterol (mmol/l)",
                "saveHDL",
                localRecordState.hdl_cholesterol?.toString()
              )
            }
          />

          <TouchableSectionItem
            title="Triglycerides (mg/dl)"
            touchable={true}
            value={localRecordState.triglycerides ?? "-"}
            onPress={() =>
              toggleModal(
                "Triglycerides (mg/dl)",
                "saveTri",
                localRecordState.triglycerides?.toString()
              )
            }
          />
        </MyContainer>

        <View style={styles.button_container}>
          {/* Update button */}
          <PrimaryButton
            tfontSize={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3%")
            }
            title={passedData ? "Update Health Record" : "Add Health Record"}
            onPress={async () => {
              if (
                localRecordState.weight &&
                localRecordState.waist_circumference
              ) {
                const networkStatus = helpers.getNetworkStatus();
                networkStatus
                  ? addHealthRecordtoAPI(passedData, localRecordState)
                  : setNetworkError(true);
              } else {
                alert("Please enter Waist Circumference and/or Weight");
              }
            }}
          />
          {/* Delete button */}
          {passedData && (
            <SecondaryButton
              title="Delete"
              shadowColor="#F56182"
              colors={["#F56182", "#F56182"]}
              tColor={"#fff"}
              tfontSize={helpers.actuatedNormalizeFontSize(20)}
              onPress={showConfirmation}
            />
          )}
        </View>
      </ScrollView>

      {/* Delete confirmation model */}
      <Modal
        visible={visibleConfirmation}
        transparent={true}
        animationType="fade"
        onDismiss={hideConfirmation}
      >
        <MyContainer
          style={{
            marginHorizontal: wp("3%"),
            width: "auto",
          }}
        >
          <Text
            style={{
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("3%"),
              width: "100%",
              textAlign: "center",
              lineHeight: 30,
            }}
          >
            Are you sure you want to delete this health history?
          </Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 20,
            }}
          >
            <SecondaryButton
              title="Cancel"
              tfontSize={
                deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3%")
              }
              style={{
                width: "auto",
                marginVertical: 0,
                marginHorizontal: wp("1%"),
              }}
              onPress={hideConfirmation}
            />
            <SecondaryButton
              title="Delete"
              tfontSize={
                deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3%")
              }
              shadowColor="#F56182"
              colors={["#F56182", "#F56182"]}
              tColor={"#fff"}
              style={{
                width: "auto",
                marginVertical: 0,
                marginHorizontal: wp("1%"),
              }}
              onPress={() => deleteHealthRecord(passedData)}
            />
          </View>
        </MyContainer>
      </Modal>

      {/* Network Dialog */}
      <ErrorDialog
        visible={networkError}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={() => setNetworkError(false)}
        onPress={() => setNetworkError(false)}
      />

      {/* Modal End */}
      <Loader visible={isLoading} />
    </View>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    header: {
      justifyContent: "center",
      alignSelf: "center",
    },
    title: {
      marginTop:
        deviceInfo.deviceType === DeviceType.PHONE ? hp("4%") : hp("3%"),
      marginBottom: hp("2%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
    },
    wrapper_title: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.8%") : wp("2.8%"),
      fontWeight: "bold",
      paddingRight: 10,
      marginBottom: 10,
    },
    sub_title: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.8%") : wp("2.8%"),
    },
    scrollview: {
      paddingBottom: 25,
      paddingHorizontal: "5%",
      flexGrow: 1,
      alignItems: "center",
    },
    titleText: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.8%") : wp("2.8%"),
    },
    modalView: {
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      justifyContent: "flex-end",
    },
    button_container: {
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
    },
    overflowText: {
      width: "60%",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.5%") : wp("2.5%"),
    },
  });
}

function recordReducer(state, action) {
  switch (action.type) {
    case "saveWaist":
      return {
        ...state,
        waist_circumference: parseFloat(action.payload).toFixed(2),
      };
    case "saveWeight":
      return { ...state, weight: parseFloat(action.payload).toFixed(2) };
    case "saveHours":
      return { ...state, physical_exercise_hours: action.payload };
    case "saveMins":
      return { ...state, physical_exercise_minutes: action.payload };
    case "saveSysBP":
      return {
        ...state,
        systolic_pressure: parseFloat(action.payload).toFixed(2),
      };
    case "saveFastingGlu":
      return {
        ...state,
        fasting_blood_glucose: parseFloat(action.payload).toFixed(2),
      };
    case "saveHDL":
      return {
        ...state,
        hdl_cholesterol: parseFloat(action.payload).toFixed(2),
      };
    case "saveTri":
      return { ...state, triglycerides: parseFloat(action.payload).toFixed(2) };
    case "saveBPMed":
      return { ...state, blood_pressure_medication: action.payload };
    case "saveSmoking":
      return { ...state, smoking: action.payload };
    case "saveFruitVege":
      return { ...state, vegetable_fruit_berries_consumption: action.payload };
    case "setState":
      return {
        ...state,
        ...action.payload,
        date_created: null,
      };
    default:
      return state;
  }
}

/**
 * Schema available for API call
 * {
  "waist_circumference": 0,
  "weight": 0,
  "blood_pressure_medication": true,
  "physical_exercise_hours": 0,
  "physical_exercise_minutes": 0,
  "smoking": true,
  "vegetable_fruit_berries_consumption": true,
  "systolic_pressure": 0,
  "fasting_blood_glucose": 0,
  "hdl_cholesterol": 0,
  "triglycerides": 0
}
 */

export default HealthRecordDetailScreen;
