import React, { useState, useContext } from "react";
import { StyleSheet, View, Keyboard } from "react-native";
import {
  RowWrapper,
  ColumnWrapper,
  MyLinearGradient,
  ErrorMessage,
  Loader,
  ErrorDialog,
} from "..";
import { AntDesign } from "@expo/vector-icons";
import { Text, useTheme, TextInput, Dialog, Portal } from "react-native-paper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AuthContext } from "@config/ContextHelper";
import * as helpers from "@utilities/helpers";
import HttpRequest from "@http/HttpHelper";
import useLoading from "@utilities/customhooks/useLoading";
import MyContainer from "@components/MyContainer";

const BloodGlucoseContainer = (props) => {
  //necessary state
  const { colors } = useTheme();
  const styles = StyleProvider();
  const { authState, bloodGlucoseReminder } = useContext(AuthContext); // for get the user token purpose
  const [networkError, setNetworkError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    visible: false,
    message: "",
  });
  const { deviceInfo } = useDeviceInfoProvider();

  //parent properties
  const visible = props.visible;
  const toggleBGModal = props.toggleModal;
  const meal = props.meal;
  const dispatch = props.dispatch;
  const isAddMeal = props.isAddMeal;

  const [bloodGlucose, setBloodGlucose] = useState(
    meal.blood_glucose ? meal.blood_glucose.toString() : null
  );

  // to handle the blood glucose value changes
  const handleBloodGlucoseKeyPress = (val) => {
    setBloodGlucose(val);
  };

  // update the blood glucose
  const updateBloodGlucose = async () => {
    if (bloodGlucose == null || bloodGlucose == "") {
      setErrorMessage({ visible: true, message: "Cannot be empty!" });
      return;
    }
    if (isNaN(Number(bloodGlucose))) {
      setErrorMessage({ visible: true, message: "Invalid value entry!" });
      return;
    }
    setErrorMessage({ ...errorMessage, visible: false });
    const networkStatus = await helpers.getNetworkStatus();
    if (networkStatus) {
      meal.blood_glucose = Number(bloodGlucose);
      await HttpRequest.Put.UpdateBloodGlucose(
        meal.blood_glucose,
        meal.meal_id,
        authState.userToken
      );
      dispatch({ type: "updateMeal", payload: meal });
      //setData("allMeal", JSON.stringify(mealState));
    } else setNetworkError(true);
    toggleBGModal();
  };

  const [handleUpdateBG, bloodGlucoseLoading] = useLoading(updateBloodGlucose);

  return (
    <>
      <MyContainer>
        <ColumnWrapper>
          <RowWrapper style={{ paddingVertical: 0 }}>
            <Text style={styles.contentSubTitle}>
              Blood Glucose After Meal:
            </Text>
            {meal && meal.blood_glucose ? (
              <></>
            ) : (
              !isAddMeal &&
              bloodGlucoseReminder && (
                <View style={{ height: 25 }}>
                  <View style={styles.redDot} />
                </View>
              )
            )}
          </RowWrapper>
          <Text
            style={{
              ...styles.contentText,
              textDecorationLine: "underline",
            }}
            onPress={toggleBGModal}
          >
            {meal && meal.blood_glucose
              ? meal.blood_glucose.toFixed(1) + " mmol/L "
              : "Enter Blood Glucose? "}
          </Text>
        </ColumnWrapper>
      </MyContainer>
      <Portal>
        <Dialog
          visible={visible}
          transparent={true}
          animationType="fade"
          onDismiss={toggleBGModal}
          style={{ backgroundColor: colors.background }}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Dialog.Content>
              <RowWrapper
                style={{ paddingVertical: 0, justifyContent: "space-between" }}
              >
                <Text style={styles.sub_title}>Update Blood Glucose</Text>
                <TouchableOpacity onPress={toggleBGModal}>
                  <AntDesign
                    name="closesquare"
                    size={
                      deviceInfo.deviceType === DeviceType.PHONE
                        ? wp("8%")
                        : wp("5%")
                    }
                    color="#F56182"
                  />
                </TouchableOpacity>
              </RowWrapper>
              <ColumnWrapper style={{ width: "100%", alignItems: "center" }}>
                <TextInput
                  label="Blood Glucose After Meal"
                  placeholder="5.0"
                  keyboardType="numeric"
                  style={{
                    width: "100%",
                  }}
                  value={bloodGlucose}
                  onChangeText={handleBloodGlucoseKeyPress}
                />
                {errorMessage.visible && (
                  <ErrorMessage message={errorMessage.message} />
                )}

                <TouchableOpacity
                  style={{ width: "100%" }}
                  onPress={() => handleUpdateBG()}
                >
                  <MyLinearGradient
                    style={{
                      paddingHorizontal:
                        deviceInfo.deviceType === DeviceType.PHONE
                          ? wp("20%")
                          : wp("15%"),
                      marginTop:
                        deviceInfo.deviceType === DeviceType.PHONE
                          ? hp("5%")
                          : hp("3%"),
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize:
                          deviceInfo.deviceType === DeviceType.PHONE
                            ? wp("4.5%")
                            : wp("3%"),
                        color: "#fff",
                      }}
                    >
                      Save
                    </Text>
                  </MyLinearGradient>
                </TouchableOpacity>
              </ColumnWrapper>
            </Dialog.Content>
          </TouchableWithoutFeedback>
        </Dialog>
      </Portal>
      {/* loader */}
      <Loader visible={bloodGlucoseLoading} />
      {/* Network Dialog */}
      <ErrorDialog
        visible={networkError}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={() => setNetworkError(false)}
        onPress={() => setNetworkError(false)}
      />
    </>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();

  return StyleSheet.create({
    sub_title: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
      marginBottom: hp("4%"),
    },
    contentSubTitle: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("2.5%"),
      fontWeight: "bold",
      marginBottom: hp("2.5%"),
    },
    contentText: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.5%") : wp("2%"),
      color: colors.primary,
    },
    redDot: {
      marginLeft: 10,
      width: 12,
      height: 12,
      borderRadius: 13 / 2,
      backgroundColor: colors.error,
    },
  });
}

export default BloodGlucoseContainer;
