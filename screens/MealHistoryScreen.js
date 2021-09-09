import React, { useContext, useState } from "react";
import { StyleSheet, View, Text as NativeText } from "react-native";
import {
  BackButton,
  RowWrapper,
  AnimatedHeaderFlatList,
  ErrorDialog,
} from "@components";
import { getNetworkStatus } from "@utilities/helpers";
import HttpRequest from "@http/HttpHelper";
import FloatingButton from "@components/FloatingButton";
import { MealItem } from "@components/MealHistory";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BG2 } from "@assets";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { AuthContext } from "@config/ContextHelper";
import { MealContext } from "@config/MealProvider";
import { useFoodProvider } from "@config/FoodProvider";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const quote =
  "“Make food a very incidental part of your life by filling your life so full of meaningful things that you’ll hardly have time to think about food.” ~ Peace Pilgrim";

/**
 * Main Record Scren
 */

const MealHistoryScreen = () => {
  const navigation = useNavigation();
  const [foodState] = useFoodProvider();
  const [mealState, dispatch] = useContext(MealContext);
  const { authState, bloodGlucoseReminder } = useContext(AuthContext); // for get all meal purpose
  const [errorDialogVisible, toggleErrorDialogVisible] = useToggleDialog();
  const [errorDialogContent, setErrorDialogContent] = useState({
    title: "",
    content: "",
  });
  const { deviceInfo } = useDeviceInfoProvider(); // for get device info
  //const isFocused = useIsFocused(); // for trigger re-render when this screen is focused

  const renderItem = ({ item }) => (
    <MealItem
      onPress={() => navigation.navigate("MealDetail", { Meal: item })}
      key={item.meal_id}
      item={item}
      reminder={bloodGlucoseReminder}
    />
  );

  function handleforDialog(title, message) {
    toggleErrorDialogVisible();
    setErrorDialogContent({
      title: title,
      content: message,
    });
  }

  async function fetchUserMealRecords() {
    if (!getNetworkStatus()) {
      handleforDialog("Network Error", "Internet Connection is required.");
      return;
    }

    let res = await HttpRequest.Get.GetMeals(authState.userToken);
    if (res?.error) {
      handleforDialog("Server Error", res.message);
      return;
    }

    if (foodState.allFood.length > 0) {
      res = res.map((meal) => ({
        ...meal,
        food_items: meal.food_items.map((food) => ({
          ...food,
          volume_consumed: parseFloat(food.volume_consumed),
          food_name: foodState.allFood.find((x) => x.food_id === food.food_id)
            ?.food_name,
        })),
      }));
      dispatch({ type: "getAllMealHistory", payload: res });
    }
  }

  return (
    <View style={{ height: "100%", flex: 1 }}>
      {console.log("meal history here")}
      <BackButton color="#fff" />
      <AnimatedHeaderFlatList
        headerImageSource={BG2}
        headerQuoteText={quote}
        headerTitleText={"Meal History"}
        data={mealState}
        renderItem={renderItem}
        refreshCallback={fetchUserMealRecords}
        keyExtractor={(item) => item.meal_id.toString()}
        headerQuantityView={() => (
          <RowWrapper>
            <MaterialCommunityIcons
              name="food"
              color="#ffffff"
              size={wp("5%")}
              style={{ marginRight: wp("2%") }}
            />
            <NativeText
              style={{
                ...styles.whitetext,
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4%")
                    : wp("3%"),
              }}
            >
              {mealState?.length ?? 0} records
            </NativeText>
          </RowWrapper>
        )}
      />
      <FloatingButton onPress={() => navigation.navigate("AddMealStack")} />
      <ErrorDialog
        visible={errorDialogVisible}
        title={errorDialogContent.title}
        content={errorDialogContent.content}
        onDismiss={toggleErrorDialogVisible}
        onPress={toggleErrorDialogVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  whitetext: {
    color: "#ffffff",
  },
});

export default MealHistoryScreen;
