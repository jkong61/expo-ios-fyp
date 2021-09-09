import React, { useState, useContext } from "react";
import { StyleSheet, View } from "react-native";
import {
  MyContainer,
  RowWrapper,
  ColumnWrapper,
  SecondaryButton,
  ErrorDialog,
  Loader,
} from "..";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Text, useTheme, Divider, Dialog, Portal } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as helpers from "@utilities/helpers";
import HttpRequest from "@http/HttpHelper";
import { AuthContext } from "@config/ContextHelper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ListFoodItemsContainer = (props) => {
  //necessary state
  const { colors } = useTheme();
  const styles = StyleProvider();
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const { deviceInfo } = useDeviceInfoProvider();
  const navigation = useNavigation();

  //parent properties
  const meal = props.meal;
  const dispatch = props.dispatch;
  const containerSwitch = props.containerSwitch;

  //delete food item id
  const [targetFoodItem, setTargetFoodItem] = useState();

  //visibability of components (modals, error messages, loader)
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [visibleLoader, setVisibleLoader] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  const toggleDialog = (index = null) => {
    setTargetFoodItem(index);
    setVisibleDialog(!visibleDialog);
  };

  const addNewFood = () => {
    containerSwitch(1);
  };

  const editFood = (index) => {
    const foodItem = meal.food_items[index];
    containerSwitch(1, foodItem);
  };

  const deleteFoodItem = async () => {
    const food_item_id = meal.food_items[targetFoodItem].food_item_id;

    const networkStatus = await helpers.getNetworkStatus();
    if (networkStatus) {
      toggleDialog();
      setVisibleLoader(true);
      await HttpRequest.Delete.DeleteFoodItem(
        meal.meal_id,
        food_item_id,
        authState.userToken
      );
      meal.food_items.splice(targetFoodItem, 1);
      dispatch({ type: "updateMeal", payload: meal });
      setVisibleLoader(false);
    } else setNetworkError(true);
  };

  const renderFoodItem = () => {
    if (meal && meal?.food_items.length > 0) {
      return meal.food_items.map((food, index) => (
        <RowWrapper
          key={index}
          style={{ justifyContent: "space-between", paddingVertical: 5 }}
        >
          {/* {console.log(food.food?.food_nutritions[0])} */}

          <ColumnWrapper style={{ width: "40%" }}>
            <Text>
              {food.new_food_type ? food.new_food_type : food.food.food_name}
            </Text>
            <Text style={{ color: colors.subtext }}>
              {food.per_unit_measurement}{" "}
              {food.measurement?.measurement_description}
            </Text>
          </ColumnWrapper>
          <Text style={{ paddingHorizontal: 10, color: colors.primary }}>
            {Math.round(food.volume_consumed * 100)}%
          </Text>
          <RowWrapper
            style={{
              paddingHorizontal: 0,
              width: "auto",
            }}
          >
            <MaterialCommunityIcons
              name="playlist-edit"
              size={
                deviceInfo.deviceType === DeviceType.PHONE ? wp("7%") : wp("4%")
              }
              color={colors.error}
              style={{ paddingLeft: 15 }}
              onPress={() => editFood(index)}
            />
            <AntDesign
              name="close"
              size={
                deviceInfo.deviceType === DeviceType.PHONE ? wp("7%") : wp("4%")
              }
              color={colors.error}
              style={{ paddingLeft: 15 }}
              onPress={() => toggleDialog(index)}
            />
          </RowWrapper>

          <Divider style={{ width: "100%" }} />
        </RowWrapper>
      ));
    }
    return (
      <View style={{ alignItems: "center", padding: 20 }}>
        <FontAwesome
          name="warning"
          color={colors.text}
          size={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("7%") : wp("4%")
          }
          style={{ marginBottom: hp("1%") }}
        />
        <Text
          style={{
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("4.5%")
                : wp("3%"),
          }}
        >
          No records found.
        </Text>
      </View>
    );
  };

  return (
    <MyContainer
      style={{
        paddingBottom: hp("4%"),
      }}
    >
      <Text style={styles.contentSubTitle}>Food Items:</Text>

      {renderFoodItem()}
      {meal.food_items.length > 0 && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("DietWatcherStack", {
              screen: "FoodNutritions",
              params: { FoodItem: meal.food_items },
            })
          }
        >
          <RowWrapper>
            <AntDesign
              name="exclamationcircle"
              size={24}
              color={colors.primary}
            />
            <Text
              style={{
                paddingHorizontal: wp("3%"),
                color: colors.primary,
                textDecorationLine: "underline",
              }}
            >
              View Food Nutritions
            </Text>
          </RowWrapper>
        </TouchableOpacity>

      )}
      <View
        style={{
          position: "absolute",
          bottom: -40,
          backgroundColor: colors.background,
          borderRadius: 40,
        }}
      >
        <TouchableOpacity onPress={addNewFood}>
          <AntDesign
            name="pluscircle"
            size={48}
            color={colors.primary}
            style={{
              padding: 10,
            }}
          />
        </TouchableOpacity>
      </View>

      {/* loader */}
      <Loader visible={visibleLoader} />

      {/* Network Dialog */}
      <ErrorDialog
        visible={networkError}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={() => setNetworkError(false)}
        onPress={() => setNetworkError(false)}
      />

      {/* delete food item dialog */}
      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={toggleDialog}
          style={{ backgroundColor: colors.background }}
        >
          <Dialog.Content>
            {/* Custom list of all ethnicity */}
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4%")
                      : wp("2.5%"),
                }}
              >
                Are you sure you want to delete this meal history?
              </Text>
              <View style={{ flexDirection: "row" }}>
                <SecondaryButton
                  title="Cancel"
                  style={{
                    width: "auto",
                    marginVertical: 0,
                    marginHorizontal: 10,
                  }}
                  tfontSize={
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4%")
                      : wp("2.5%")
                  }
                  onPress={toggleDialog}
                />
                <SecondaryButton
                  title="Delete"
                  tfontSize={
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4%")
                      : wp("2.5%")
                  }
                  shadowColor="#F56182"
                  colors={["#F56182", "#F56182"]}
                  tColor={"#fff"}
                  style={{
                    width: "auto",
                    marginVertical: 0,
                    marginHorizontal: 10,
                  }}
                  onPress={() => deleteFoodItem()}
                />
              </View>
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
      marginBottom: hp("4%"),
    },
    buttonText: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
    },
    contentSubTitle: {
      alignSelf: "flex-start",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("2.5%"),
      fontWeight: "bold",
      marginBottom: hp("1.5%"),
    },
  });
}

export default ListFoodItemsContainer;
