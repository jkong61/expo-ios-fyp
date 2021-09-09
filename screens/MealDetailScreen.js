import React, { useState, memo, useContext, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, useTheme, Modal } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import * as helpers from "@utilities/helpers";
import {
  MyContainer,
  RowWrapper,
  ColumnWrapper,
  BackButton,
  Loader,
  SecondaryButton,
  ErrorDialog,
} from "@components";
import ListFoodItemsContainer from "@components/MealHistory/ListFoodItemsContainer";
import AddEditFoodItemContainer from "@components/MealHistory/AddEditFoodItemContainer";
import BloodGlucoseContainer from "@components/MealHistory/BloodGlucoseContainer";
import HttpRequest from "@http/HttpHelper";
import { useMealProvider } from "@config/MealProvider";
import { useFoodProvider } from "@config/FoodProvider";
import { AuthContext } from "@config/ContextHelper";
import { BASE_URL } from "@http/Constant";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import useLoading from "@utilities/customhooks/useLoading";

const MealDetailScreen = ({ route, navigation }) => {
  //necessary state
  const styles = StyleProvider();
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const [foodState] = useFoodProvider();
  const [, mealDispatch] = useMealProvider();
  const [containerIndex, setContainerIndex] = useState({
    index: 0,
    payload: null,
  });

  //const [bloodGlucose, setBloodGlucose] = useState();
  const [networkError, toggleNetworkError] = useToggleDialog();
  const { deviceInfo } = useDeviceInfoProvider();

  //visibability of components (modals, error messages, loader)
  const [visibleBGModal, toggleVisibleBGModal] = useToggleDialog();
  const [visibleConfirmation, toggleVisibleConfirmation] = useToggleDialog();

  //to receive meal data from last screen.
  const passedData = route.params;
  const currentstate = passedData?.Meal ?? null;
  const [meal, setMeal] = useState(currentstate);
  const dateObj = helpers.getDateObjFromISOString(meal?.date_created);

  const containerSwitch = (index, payload = null) => {
    setContainerIndex({ index, payload });
  };

  const containerRender = () => {
    switch (containerIndex.index) {
    case 0:
      return (
        <ListFoodItemsContainer
          containerSwitch={containerSwitch}
          dispatch={mealDispatch}
          meal={meal}
        />
      );
    case 1:
      return (
        <AddEditFoodItemContainer
          containerSwitch={containerSwitch}
          meal={meal}
          dispatch={mealDispatch}
          allFood={foodState.allFood}
          allFoodIds={foodState.foodIds}
          foodItem={containerIndex.payload}
        />
      );
    }
  };

  // toggle blood glucose modal
  // const toggleBGModal = () => {
  //   setVisibleBGModal(!visibleBGModal); //update modal visible state
  // };

  //toggle confirmation modal
  // const toggleConfirmationModal = () => {
  //   setVisibleConfirmation(!visibleConfirmation);
  // };

  const deleteMeal = async () => {
    toggleVisibleConfirmation();
    const networkStatus = await helpers.getNetworkStatus();
    if (networkStatus) {
      await HttpRequest.Delete.DeleteMeal(meal.meal_id, authState.userToken);
      mealDispatch({
        type: "deleteMeal",
        payload: meal.meal_id,
      });
      navigation.goBack();
    } else {
      toggleNetworkError();
    }
  };

  //to get predictions of the meal, if there is not exists in the meal state
  const getPredictions = async () => {
    let predictions = await HttpRequest.Get.GetPredictionsById(
      meal.meal_id,
      authState.userToken
    );
    let mymeal = { ...meal, food_predictions: predictions }; // append food_predictions into meal state
    setMeal(mymeal); // update local meal state

    mealDispatch({ type: "updateMeal", payload: mymeal }); // update the global meal state
  };

  const [handleDeleteMeal, deleteMealLoading] = useLoading(deleteMeal);
  const [handlePredictions, predictionsLoading] = useLoading(getPredictions);

  useEffect(() => {
    if (meal.food_predictions == null || meal.food_predictions.length == 0) {
      handlePredictions();
    }
  }, []);

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <View style={styles.thumbnail}>
          {meal && (
            <Image
              source={{
                uri: `${BASE_URL}image/${meal?.user_id}/${meal?.image}`,
              }}
              style={styles.image}
            />
          )}
        </View>
        <View style={{ margin: wp("4%") }}>
          <RowWrapper style={{ paddingVertical: 0 }}>
            <MyContainer>
              <ColumnWrapper>
                <Text style={styles.contentSubTitle}>Consumed Date:</Text>
                <Text style={styles.contentText}>
                  {meal &&
                    `${dateObj.day} ${dateObj.month} ${dateObj.year} \t\t\t ${dateObj.weekday} | ${dateObj.timeIn12}`}
                </Text>
              </ColumnWrapper>
            </MyContainer>
            <BloodGlucoseContainer
              meal={meal}
              dispatch={mealDispatch}
              visible={visibleBGModal}
              toggleModal={toggleVisibleBGModal}
            />

            {containerRender()}
          </RowWrapper>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: hp("1%"),
            }}
          >
            <SecondaryButton
              tfontSize={
                deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3%")
              }
              title="Delete"
              shadowColor="#F56182"
              colors={["#F56182", "#F56182"]}
              tColor={"#fff"}
              onPress={toggleVisibleConfirmation}
            />
          </View>
        </View>
      </ScrollView>

      <Loader visible={deleteMealLoading || predictionsLoading} />

      {/* Network Dialog */}
      <ErrorDialog
        visible={networkError}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={toggleNetworkError}
        onPress={toggleNetworkError}
      />

      {/* modal for delete meal */}
      <Modal
        visible={visibleConfirmation}
        transparent={true}
        animationType="fade"
        onDismiss={toggleVisibleConfirmation}
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
                  ? wp("4%")
                  : wp("2.5%"),
              textAlign: "center",
              lineHeight: 30,
            }}
          >
            Are you sure you want to delete this meal history?
          </Text>
          <View style={{ flexDirection: "row" }}>
            <SecondaryButton
              title="Cancel"
              tfontSize={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("2.5%")
              }
              style={{
                width: "auto",
                marginVertical: 0,
                marginHorizontal: wp("1%"),
              }}
              onPress={toggleVisibleConfirmation}
            />
            <SecondaryButton
              title="Delete"
              tfontSize={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("2.5%")
              }
              shadowColor="#F56182"
              colors={["#F56182", "#F56182"]}
              tColor={"#fff"}
              style={{
                width: "auto",
                marginVertical: 0,
                marginHorizontal: wp("1%"),
              }}
              onPress={handleDeleteMeal}
            />
          </View>
        </MyContainer>
      </Modal>
    </View>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
    },
    thumbnail: {
      marginTop: hp("9%"),
      width: "100%",
      height:
        deviceInfo.deviceType === DeviceType.PHONE ? hp("30%") : hp("35%"),
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexDirection: "column",
    },
    contentSubTitle: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("2.5%"),
      fontWeight: "bold",
      marginBottom: hp("1.5%"),
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
    image: {
      width: "100%",
      height: "100%",
      //marginLeft: wp("4%"),
      resizeMode: "cover",
      //borderTopLeftRadius: 50,
      borderRadius: 50,
      // borderBottomLeftRadius: 50,
      // borderBottomRightRadius: 50,
    },
    modalHeaderBar: {
      justifyContent: "space-between",
      paddingVertical: 0,
      marginBottom: hp("3%"),
    },
    modalText: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
      fontWeight: "bold",
    },
  });
}

export default memo(MealDetailScreen);
