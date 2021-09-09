import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import {
  BackButton,
  ErrorDialog,
  MyContainer,
  RowWrapper,
  ColumnWrapper,
  MySlider,
  TwoSelections,
  RightCornerButton,
  PrimaryButton,
} from "@components";
import { useTheme, Text, Title } from "react-native-paper";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { TrendFeatures } from "@config/TrendFeatureConstants";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import useDialogHandler from "@utilities/customhooks/useDialogHandler";
import {
  useClinicianProvider,
  ClinicianProviderDispatchMethodConstants,
} from "@config/ClinicianProvider";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatText(str) {
  // Special case just for BMI
  if (str === "bmi") {
    return "BMI";
  }
  return str.split("_").map(capitalize).join(" ");
}

function TouchableContainer(props) {
  const { colors } = useTheme();
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();
  return (
    <TouchableOpacity style={{ width: "100%" }} onPress={props.onPress ?? null}>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: hp("1%"),
          alignItems: "center",
        }}
      >
        <AntDesign
          name={props.state ? "checkcircle" : "checkcircleo"}
          size={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%")
          }
          color={props.state ? colors.primary : "grey"}
          style={{ marginRight: "5%" }}
        />
        <Text style={styles.titleText}>{formatText(props.text)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const defaultTrendAnalyserConfig = {
  selected_features: [],
  ranking_type_top_n: true,
  ranking_ascending: true,
  threshold: 0,
};

function ClinicianTrendAnalyserScreen() {
  const { colors } = useTheme();
  const [trendFeatures] = useState(TrendFeatures);
  const [clinicianState, dispatchClinician] = useClinicianProvider();
  const [localSelectedFeatures, dispatchSelectedFeatures] = useReducer(
    featuresReducer,
    defaultTrendAnalyserConfig
  );
  const [errorDialogVisible, toggleErrorDialogVisible] = useToggleDialog();
  const [errorDialogContent] = useDialogHandler(toggleErrorDialogVisible);
  const { deviceInfo } = useDeviceInfoProvider();
  const styles = StyleProvider();
  const navigation = useNavigation();

  useEffect(() => {}, [localSelectedFeatures]);

  useFocusEffect(
    useCallback(() => {
      dispatchSelectedFeatures({
        type: "reset",
      });
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <RightCornerButton
        iconname={"clipboard-text-multiple"}
        color={clinicianState.trend.result?.length > 0 ? "#3CB043" : "#000"}
        disabled={!(clinicianState.trend.result.length > 0)}
        onPress={() => navigation.navigate("ClinicianReportScreen")}
      />
      <View style={styles.titleheader}>
        <Title
          style={{
            ...styles.title,
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
          }}
        >
          Trend Analyser
        </Title>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        <MyContainer
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <Text style={styles.subtitle}>
            Please select the features that you want to analyze.
          </Text>
          {trendFeatures.map((value, index) => (
            <TouchableContainer
              text={value}
              key={index}
              state={localSelectedFeatures.selected_features?.includes(value)}
              onPress={() => {
                dispatchSelectedFeatures({
                  type: localSelectedFeatures.selected_features?.includes(value)
                    ? "removefeature"
                    : "addfeature",
                  payload: value,
                });
              }}
            />
          ))}
          <RowWrapper
            style={{
              justifyContent: "center",
              paddingVertical: 0,
              marginTop: hp("2%"),
            }}
          >
            <MaterialIcons
              name="info"
              size={
                deviceInfo.deviceType === DeviceType.PHONE ? wp("8%") : wp("5%")
              }
              color={colors.primary}
            />
            {localSelectedFeatures.selected_features?.length > 0 ? (
              <Text
                style={styles.textStyle}
              >{`Selected ${localSelectedFeatures.selected_features?.length} features.`}</Text>
            ) : (
              <Text style={styles.textStyle}>{`Nothing selcted.`}</Text>
            )}
          </RowWrapper>
        </MyContainer>

        <MyContainer
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <RowWrapper
            style={{ justifyContent: "space-between", paddingVertical: 10 }}
          >
            <Text style={styles.titleText}>Ranking Type Top</Text>
            <TwoSelections
              deviceInfo={deviceInfo?.deviceType}
              choice={localSelectedFeatures.ranking_type_top_n}
              select1={false}
              select2={true}
              press1={() =>
                dispatchSelectedFeatures({
                  type: "changerankingtype",
                  payload: false,
                })
              }
              press2={() =>
                dispatchSelectedFeatures({
                  type: "changerankingtype",
                  payload: true,
                })
              }
            />
          </RowWrapper>

          <RowWrapper
            style={{ justifyContent: "space-between", paddingVertical: 10 }}
          >
            <Text style={styles.titleText}>Ranking Ascending</Text>
            <TwoSelections
              deviceInfo={deviceInfo.deviceType}
              choice={localSelectedFeatures.ranking_ascending}
              select1={false}
              select2={true}
              press1={() =>
                dispatchSelectedFeatures({
                  type: "changerankingascending",
                  payload: false,
                })
              }
              press2={() =>
                dispatchSelectedFeatures({
                  type: "changerankingascending",
                  payload: true,
                })
              }
            />
          </RowWrapper>

          <ColumnWrapper style={{ paddingVertical: 10 }}>
            <Text style={styles.titleText}>
              Threshold : {localSelectedFeatures.threshold}
            </Text>
            <MySlider
              style={{ marginTop: hp("1%") }}
              value={localSelectedFeatures.threshold}
              minimumValue={0}
              maximumValue={10}
              step={1}
              onValueChange={(val) =>
                dispatchSelectedFeatures({
                  type: "changethreshold",
                  payload: val,
                })
              }
            />
          </ColumnWrapper>
        </MyContainer>
        <View style={{ alignItems: "center" }}>
          <PrimaryButton
            title="Generate Report"
            tfontSize={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3%")
            }
            style={{
              width: "80%",
              marginVertical: hp("1%"),
            }}
            onPress={() =>
              dispatchClinician({
                type: ClinicianProviderDispatchMethodConstants.GENERATEREPORT,
                payload: localSelectedFeatures,
              })
            }
            loading={!!clinicianState?.trend?.loading}
          />
        </View>
      </ScrollView>

      <ErrorDialog
        visible={errorDialogVisible}
        title={errorDialogContent.title}
        content={errorDialogContent.content}
        onPress={toggleErrorDialogVisible}
      />
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
    subtitle: {
      textAlign: "left",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("3%"),
      marginBottom: hp("3%"),
    },
    textStyle: {
      marginHorizontal: wp("1.5%"),
      paddingVertical: hp("1%"),
      color: colors.primary,
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
    },
    body: {
      marginHorizontal: wp("5%"),
      paddingBottom: hp("5%"),
    },
    buttonContainer: {
      zIndex: 0,
      width: "auto",
      bottom: 0,
    },
    modal: {
      zIndex: 9,
      alignSelf: "center",
    },
  });
}

export default ClinicianTrendAnalyserScreen;

function featuresReducer(state, action) {
  let features;

  switch (action.type) {
    case "addfeature":
      features = [...state.selected_features];
      if (!features?.includes(action.payload)) {
        features.push(action.payload);
      }
      return {
        selected_features: [...features],
        ranking_type_top_n: state.ranking_type_top_n,
        ranking_ascending: state.ranking_ascending,
        threshold: state.threshold,
      };
    case "removefeature":
      features = [...state.selected_features];
      if (features?.includes(action.payload)) {
        features = features.filter((item) => item !== action.payload);
      }
      return {
        selected_features: [...features],
        ranking_type_top_n: state.ranking_type_top_n,
        ranking_ascending: state.ranking_ascending,
        threshold: state.threshold,
      };
    case "changerankingtype":
      return {
        selected_features: state.selected_features,
        ranking_type_top_n: action.payload,
        ranking_ascending: state.ranking_ascending,
        threshold: state.threshold,
      };
    case "changerankingascending":
      return {
        selected_features: state.selected_features,
        ranking_type_top_n: state.ranking_type_top_n,
        ranking_ascending: action.payload,
        threshold: state.threshold,
      };
    case "changethreshold":
      return {
        selected_features: state.selected_features,
        ranking_type_top_n: state.ranking_type_top_n,
        ranking_ascending: state.ranking_ascending,
        threshold: action.payload,
      };
    case "reset":
      return defaultTrendAnalyserConfig;
    default:
      return state;
  }
}
