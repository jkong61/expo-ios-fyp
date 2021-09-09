import React, { useState, useEffect, useContext, memo } from "react";
import { StyleSheet, View, Image } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import * as helpers from "@utilities/helpers";
import { AuthContext } from "@config/ContextHelper";
import { useFoodProvider } from "@config/FoodProvider";
import { useMealProvider } from "@config/MealProvider";
import HttpRequest from "@http/HttpHelper";
import {
  SquareButton,
  MyContainer,
  RowWrapper,
  ColumnWrapper,
  BackButton,
  ErrorDialog,
  Loader,
} from "@components";
import { ConfirmDialog } from "@components/AddMeal";
import { BASE_URL } from "@http/Constant";
import ListFoodItemsContainer from "@components/MealHistory/ListFoodItemsContainer";
import AddEditFoodItemContainer from "@components/MealHistory/AddEditFoodItemContainer";
import BloodGlucoseContainer from "@components/MealHistory/BloodGlucoseContainer";

import { useRoute } from "@react-navigation/native";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useLoading from "@utilities/customhooks/useLoading";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";

Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
};

const getToday = () => {
  let d = new Date().addHours(8); //malaysia GMT+8
  const dateObj = helpers.getDateObjFromISOString(d);
  return `${dateObj.day} ${dateObj.month} ${dateObj.year}\t\t${dateObj.weekday} | ${dateObj.timeIn12}`;
};

const AddMealScreen = ({ navigation }) => {
  const { colors } = useTheme(); // get the them colors
  const [isFood, setIsFood] = useState(null); // for detect image is contain food or not
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const [, dispatch] = useMealProvider();
  const [foodState] = useFoodProvider();
  const route = useRoute();
  const { deviceInfo } = useDeviceInfoProvider();
  const styles = StyleProvider();

  const [visibleBGModal, toggleVisibleBGModal] = useToggleDialog();
  const [networkError, toggleNetworkError] = useToggleDialog();
  const [containerIndex, setContainerIndex] = useState({
    index: 0,
    payload: null,
  });
  const defaultMealState = {
    meal_id: null,
    image: null,
    consumed_date: "",
    blood_glucose: null,
    predictions: [],
    food_items: [
      {
        id: null,
        name: null,
        volume_consumed: 0,
      },
    ],
    editIndex: 0,
  };

  const [meal, setMeal] = useState(defaultMealState);

  //check the image is whether contain food or not
  const foodDetect = async (image, token) => {
    const networkStatus = await helpers.getNetworkStatus();
    if (networkStatus) {
      const result = await HttpRequest.Post.FoodDetect(image, token);
      setIsFood(result);
    } else {
      toggleNetworkError();
      clearImage();
    }
  };

  const [handleFoodDetect, foodDetectLoading] = useLoading(foodDetect);

  //to create the meal
  const createMeal = async () => {
    const networkStatus = await helpers.getNetworkStatus();
    if (networkStatus) {
      const result = await HttpRequest.Post.CreateMeal(
        meal.image,
        authState.userToken
      );
      //initialize food_item
      result.food_items = [];
      dispatch({ type: "addMealHistory", payload: result });

      setMeal(result);
    } else {
      toggleNetworkError();
    }
  };

  //clear the image
  const clearImage = () => {
    setMeal({
      ...meal,
      image: null,
    });
    setIsFood(null);
  };

  //this function is used for pic image from gallery
  const pickImage = async () => {
    //checking or asking storage permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    //check the status of permission
    if (status !== "granted") {
      alert("😢Sorry, we need storage permissions to make this work!");
    } else {
      //get the result from image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        //mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
      });
      //if image is picked, then re-render the screen to show the preview thumbnail
      if (!result.cancelled) {
        const base64source = `data:image/jpg;base64,${result.base64}`;
        setMeal({
          ...meal,
          image: base64source,
        });
        handleFoodDetect(base64source, authState.userToken);
      }
    }
  };

  const [handleCreateMeal, createMealLoading] = useLoading(createMeal);

  const containerSwitch = (index, payload = null) => {
    setContainerIndex({ index, payload });
  };

  const containerRender = () => {
    switch (containerIndex.index) {
      case 0:
        return (
          <ListFoodItemsContainer
            containerSwitch={containerSwitch}
            dispatch={dispatch}
            meal={meal}
          />
        );
      case 1:
        return (
          <AddEditFoodItemContainer
            containerSwitch={containerSwitch}
            meal={meal}
            dispatch={dispatch}
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

  useEffect(() => {
    if (route.params?.Source) {
      console.log("effect inside");
      setMeal({
        ...meal,
        image: route.params.Source,
      }); //set image to preview
      handleFoodDetect(route.params.Source, authState.userToken); // call the food detect function
    }
  }, [route.params?.Source]); // if camere screen send back params (uri) back to here then re-render

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Add Meal Entry</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <View style={styles.thumbnail}>
          {meal && meal.image ? (
            <Image
              source={{
                uri: meal.image.includes("data:image/jpg;base64")
                  ? meal.image
                  : `${BASE_URL}image/${meal?.user_id}/${meal?.image}`,
              }}
              style={styles.image}
              key={meal.image}
            />
          ) : (
            <FontAwesome
              name="image"
              size={wp("20%")}
              style={{ color: colors.primary }}
            />
          )}
        </View>
        {isFood == null ? (
          networkError && (
            <View style={styles.error_box}>
              <FontAwesome
                name="warning"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("5%")
                    : wp("3%")
                }
                style={{ color: "red", paddingHorizontal: 5 }}
              ></FontAwesome>
              <Text style={styles.error_message}>No Network Detected</Text>
            </View>
          )
        ) : isFood ? (
          <View style={styles.success_box}>
            <FontAwesome
              name="check"
              size={
                deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3%")
              }
              style={{ color: "#fff", paddingHorizontal: 5 }}
            ></FontAwesome>
            <Text style={styles.success_message}>Image contain food.</Text>
          </View>
        ) : (
          <View style={styles.error_box}>
            <FontAwesome
              name="warning"
              size={
                deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3%")
              }
              style={{ color: "red", paddingHorizontal: 5 }}
            ></FontAwesome>
            <Text style={styles.error_message}>
              Image may not contain food.
            </Text>
          </View>
        )}

        {meal.meal_id == null && (
          <>
            <Text
              style={{
                marginTop: hp("3%"),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4%")
                    : wp("3%"),
              }}
            >
              Take a picture/ choose a picture
            </Text>
            <RowWrapper>
              <SquareButton onPress={() => navigation.navigate("Camera")}>
                <FontAwesome
                  name="camera"
                  size={
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("8%")
                      : wp("5%")
                  }
                  style={{ color: "#ffffff" }}
                />
              </SquareButton>
              <SquareButton onPress={pickImage}>
                <MaterialCommunityIcons
                  name="folder-image"
                  size={
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("10%")
                      : wp("7%")
                  }
                  style={{ color: "#ffffff" }}
                />
              </SquareButton>
            </RowWrapper>
          </>
        )}

        <MyContainer>
          <ColumnWrapper>
            <Text style={styles.contentSubTitle}>Consumed Date:</Text>
            <Text style={styles.contentText}>{getToday()}</Text>
          </ColumnWrapper>
        </MyContainer>

        {meal.meal_id === null ? (
          meal.image &&
          isFood != null && (
            <ConfirmDialog
              onPressYes={handleCreateMeal}
              onPressNo={clearImage}
            />
          )
        ) : (
          <>
            <BloodGlucoseContainer
              meal={meal}
              dispatch={dispatch}
              visible={visibleBGModal}
              toggleModal={toggleVisibleBGModal}
              isAddMeal={true}
            />
            {containerRender()}
          </>
        )}
        <View style={{ paddingBottom: hp("5%") }} />
      </ScrollView>
      {/* Network Dialog */}
      <ErrorDialog
        visible={networkError}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={toggleNetworkError}
        onPress={toggleNetworkError}
      />
      <Loader visible={foodDetectLoading || createMealLoading} />
    </View>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme(); // get the them colors

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    thumbnail: {
      width: "100%",
      height:
        deviceInfo.deviceType === DeviceType.PHONE ? hp("30%") : hp("35%"),
      flexDirection: "column",
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.card,
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
      borderRadius: 30,
    },
    title: {
      marginTop:
        deviceInfo.deviceType === DeviceType.PHONE ? hp("4%") : hp("3%"),
      marginBottom: hp("2%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
    },
    sub_title: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("2%"),
      marginBottom: 20,
    },
    error_box: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: hp("2.5%"),
      padding: deviceInfo.deviceType === DeviceType.PHONE ? wp("3%") : wp("2%"),
      borderRadius: 50,
      backgroundColor: "pink",
    },
    success_box: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: hp("2%"),
      padding: 10,
      borderRadius: 50,
      backgroundColor: "#59B259",
    },
    error_message: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2%"),
      color: "red",
      textAlign: "center",
    },
    success_message: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2%"),
      color: "#fff",
      textAlign: "center",
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
  });
}

function areEqual(prevProps, nextProps) {
  console.log("prev: ", prevProps);
  console.log("next: ", nextProps);
  return false;
}

export default memo(AddMealScreen, areEqual);
