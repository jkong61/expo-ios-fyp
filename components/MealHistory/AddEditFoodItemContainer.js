import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import {
  MyContainer,
  RowWrapper,
  ColumnWrapper,
  MySlider,
  Tag,
  Loader,
  TouchableSectionItem,
  TouchableContainer,
  ErrorDialog,
} from "..";

import { AntDesign } from "@expo/vector-icons";
import { TextInput, Text, useTheme, Dialog, Portal } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import HttpRequest from "@http/HttpHelper";
import { AuthContext } from "@config/ContextHelper";
import { TouchableOpacity } from "react-native-gesture-handler";
import fuzzysort from "fuzzysort";
import ErrorMessage from "../ErrorMessage";
import { MEASUREMENT } from "@config/MeasurementConstants";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useLoading from "@utilities/customhooks/useLoading";

const AddEditFoodItemContainer = (props) => {
  //necessary state
  const { colors } = useTheme();
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const { deviceInfo } = useDeviceInfoProvider();
  const styles = StyleProvider();

  //parent properties
  const meal = props.meal;
  const dispatch = props.dispatch;
  const containerSwitch = props.containerSwitch;
  const food_Item = props.foodItem ?? null;
  const addMode = food_Item == null;
  //const isAddMeal = props.addMeal ?? false;

  //food item states
  const [foodTags, setFoodTags] = useState();
  const [foodItem, setFoodItem] = useState({
    index: food_Item?.index ?? null,
    id: food_Item?.food?.food_id ?? null,
    name: food_Item?.food?.food_name ?? food_Item?.new_food_type,
    volume_consumed: food_Item?.volume_consumed ?? 0,
    quantity: food_Item?.per_unit_measurement?.toString() ?? "1",
    measurement: food_Item?.measurement
      ? MEASUREMENT.find((m) => m.value === food_Item.measurement.suffix)
      : MEASUREMENT[0],
  });

  //visibability of components (modals, error messages, loader)
  const [visibleDialog, setVisibleDialog] = useState(false);
  //const [visibleLoader, setVisibleLoader] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    visible: false,
    message: "",
  });

  const toggleDialog = () => setVisibleDialog(!visibleDialog);

  const handleFoodTypeKeyPress = (val) => {
    //search food from all foods
    let result = fuzzysort
      .go(val, props.allFood, {
        keys: ["food_name", "asc"],
      })
      .map((s) => s[0].target);

    // get object from all food filtered by searched food name and remove underfined from array
    result = props.allFood
      .map((food) => {
        if (result.includes(food.food_name)) {
          return food;
        }
      })
      .filter(Boolean);

    //concat the search result with all food and filtered duplicated value from the array
    result = [...result, ...props.meal.predictions];
    result = Array.from(new Set(result));


    // get top 3 item
    if (result.length > 3) {
      result = result.slice(0, 3);
    }

    //search matched food from all food
    const matchedFood = result.find(
      (food) => val.toLowerCase() === food.food_name.toLowerCase()
    );

    //assign the food id
    if (matchedFood != null) {
      setFoodItem({
        ...foodItem,
        id: matchedFood.food_id,
        name: matchedFood.food_name,
      });
    } else {
      setFoodItem({ ...foodItem, id: null, name: val });
    }


    setFoodTags(result);
    setErrorMessage({ ...errorMessage, visible: false });
  };

  function getPredictionsById() {
    const result = props.meal?.food_predictions;
    if (result != null) {
      let filteredFood = result
        .split(",")
        .map((prediction_id) =>
          props.allFood.find(
            (food) => food.food_id == props.allFoodIds[prediction_id]
          )
        ); //reorder the array according to the highest posibility food item
      filteredFood = filteredFood.slice(0, 3); // get the first 3 highest posibility food item type
      props.meal.predictions = filteredFood;
      setFoodTags(filteredFood);
    }
  }

  const pressTag = (val) => {
    setFoodItem({ ...foodItem, id: val.food_id, name: val.food_name });

    //reset error message
    setErrorMessage({ ...errorMessage, visible: false });
  };

  const handleVolumeChange = (val) => {
    setFoodItem({ ...foodItem, volume_consumed: Math.round(val * 100) / 100 });
  };

  const handleQuantityChange = (val) => {
    if (val == null || isNaN(Number(val))) {
      return;
    }
    setFoodItem({ ...foodItem, quantity: val });
  };

  const renderTags = () => {
    if (foodTags && foodTags.length > 0) {
      return foodTags.map((food, index) => (
        <Tag
          key={index}
          deviceType={deviceInfo?.deviceType}
          onPress={() => pressTag(food)}
          selected={foodItem.id == food.food_id}
        >
          {food.food_name}
        </Tag>
      ));
    }
  };

  const addFoodItem = async () => {
    //to check the input value before to submit to server
    const ERROR_MESSAGE = {
      FOOD_EMPTY: "Please enter a food type.",
      INVALID_QTY: "Please enter valid quantity value.",
      DUPLICATE_FOOD: "This food item already added into this meal.",
    };

    //checking food name is whether valid or not
    if (foodItem.name === "" || foodItem.name == null) {
      setErrorMessage({ visible: true, message: ERROR_MESSAGE.FOOD_EMPTY });
      return;
    }
    //checking quantity is whether valid or not
    if (
      foodItem.quantity === "" ||
      foodItem.quantity == null ||
      isNaN(Number(foodItem.quantity))
    ) {
      setErrorMessage({
        visible: true,
        message: ERROR_MESSAGE.INVALID_QTY,
      });
      return;
    }
    //checking if there is duplicate food item in the meal (only check in add food item)
    if (
      addMode &&
      meal.food_items.some((item) => item.food?.food_id === foodItem.id)
    ) {
      setErrorMessage({
        visible: true,
        message: ERROR_MESSAGE.DUPLICATE_FOOD,
      });
      return;
    } else if (!addMode) {
      //for edit mode to check got duplicate food item
      //remove self from food items
      const newFoodItems = meal.food_items.filter(
        (item) => item.food_item_id != food_Item.food_item_id
      );
      //check the exclude food items list is whether got duplicate food item
      if (newFoodItems.some((item) => item.food?.food_id === foodItem.id)) {
        setErrorMessage({
          visible: true,
          message: ERROR_MESSAGE.DUPLICATE_FOOD,
        });
        return;
      }
    }
    //reset error message
    setErrorMessage({ ...errorMessage, visible: false });

    const networkStatus = await helpers.getNetworkStatus();
    if (networkStatus) {
      if (!addMode) {
        //send put request to update food item
        const updatedFoodItem = await HttpRequest.Put.UpdateFoodItem(
          food_Item.food_item_id,
          foodItem,
          authState.userToken
        );

        //get the index of food item in the meal state
        const index = meal.food_items.findIndex(
          (item) => item.food_item_id === food_Item.food_item_id
        );
        //replace the old food item with updated food item
        meal.food_items[index] = updatedFoodItem;
      } else {
        //send post request to add new food item
        let addedFoodItem = await HttpRequest.Post.CreateFoodItem(
          foodItem,
          meal.meal_id,
          authState.userToken
        );
        //append the new food item into the meal
        meal.food_items.push(addedFoodItem);
      }

      dispatch({ type: "updateMeal", payload: meal });
      containerSwitch(0);
    } else {
      setNetworkError(true);
      return;
    }
  };

  const pressClose = () => {
    containerSwitch(0);
  };

  useEffect(() => {
    getPredictionsById();
  }, []);

  const [handleAddFoodItem, addFoodItemLoading] = useLoading(addFoodItem);

  return (
    <MyContainer>
      <RowWrapper
        style={{ paddingVertical: 0, justifyContent: "space-between" }}
      >
        <Text style={styles.sub_title}>
          {food_Item ? "Edit Food Item" : "Add Food Item"}
        </Text>
        <AntDesign
          name="closesquare"
          size={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("8%") : wp("5%")
          }
          color="#F56182"
          onPress={pressClose}
        />
      </RowWrapper>
      <ColumnWrapper>
        <TextInput
          label="Food Type"
          placeholder={
            foodTags && foodTags.length > 0
              ? foodTags[0].food_name
              : "Nasi Lemak"
          }
          style={{
            marginTop: hp("1.5%"),
            width: "100%",
          }}
          value={foodItem.name}
          onChangeText={handleFoodTypeKeyPress}
        />
      </ColumnWrapper>
      <RowWrapper>{renderTags()}</RowWrapper>

      <RowWrapper
        style={{ justifyContent: "space-between", paddingVertical: 10 }}
      >
        <Text
          style={{
            marginRight: 50,
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("4%")
                : wp("2.5%"),
          }}
        >
          Per Unit Measurement:
        </Text>
        <TextInput
          mode={"outlined"}
          style={{
            width: wp("15%"),
            height: 30,
            textAlign: "center",
          }}
          value={foodItem.quantity}
          onChangeText={handleQuantityChange}
        />
      </RowWrapper>
      <RowWrapper
        style={{ justifyContent: "space-between", paddingVertical: 10 }}
      >
        <TouchableSectionItem
          title="Unit Measurement"
          touchable={true}
          value={foodItem.measurement.desc}
          onPress={toggleDialog}
        />
      </RowWrapper>
      <ColumnWrapper>
        <Text
          style={{
            marginTop: hp("1.5%"),
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("4%")
                : wp("2.5%"),
          }}
        >
          Volume Consumed
        </Text>
        <Text style={{ marginTop: hp("1.5%"), color: colors.primary }}>
          {Math.round(foodItem.volume_consumed * 100)}%
        </Text>
        <MySlider
          onValueChange={handleVolumeChange}
          value={foodItem.volume_consumed}
        />
      </ColumnWrapper>

      {errorMessage.visible && <ErrorMessage message={errorMessage.message} />}

      <View style={{ marginBottom: hp("3%") }}></View>

      <View
        style={{
          position: "absolute",
          bottom: -40,
          backgroundColor: colors.background,
          borderRadius: 40,
        }}
      >
        <TouchableOpacity onPress={() => handleAddFoodItem()}>
          <AntDesign
            name="checkcircle"
            size={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("12%") : wp("7%")
            }
            color={colors.primary}
            style={{
              padding: 10,
            }}
          />
        </TouchableOpacity>
      </View>

      {/* loader */}
      <Loader visible={addFoodItemLoading} />

      {/* Network Dialog */}
      <ErrorDialog
        visible={networkError}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={() => setNetworkError(false)}
        onPress={() => setNetworkError(false)}
      />

      {/* measurement dialog */}
      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={toggleDialog}
          style={{ backgroundColor: colors.background }}
        >
          <Dialog.Content>
            <RowWrapper
              style={{
                paddingVertical: 0,
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.sub_title}>Choose a measurement Unit</Text>
              <AntDesign
                name="closesquare"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("8%")
                    : wp("5%")
                }
                color="#F56182"
                onPress={toggleDialog}
              />
            </RowWrapper>

            <View style={{ marginHorizontal: wp("4%") }}>
              {Object.entries(MEASUREMENT).map(([key, value]) => (
                <TouchableContainer
                  deviceInfo={deviceInfo}
                  text={`${value.desc} (approx. ${value?.measurement_conversion_to_g ?? 0}g)`}
                  key={key}
                  index={value.value}
                  currentState={foodItem.measurement.value}
                  onPress={() =>
                    setFoodItem({ ...foodItem, measurement: value })
                  }
                />
              ))}
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </MyContainer>
  );
};
function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();

  return StyleSheet.create({
    sub_title: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
      marginBottom: hp("2%"),
    },
  });
}

export default AddEditFoodItemContainer;
