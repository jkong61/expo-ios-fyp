import React, { useState, useEffect } from "react";
import { Text as NativeText, StyleSheet, View } from "react-native";
import HttpHelper from "@http/HttpHelper";
import { BG2 } from "@assets";
import { getNetworkStatus, actuatedNormalizeSize } from "@utilities/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  BackButton,
  AnimatedHeaderFlatList,
  ErrorDialog,
  RowWrapper,
  Loader,
} from "@components";
import { MealItem } from "@components/MealHistory";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useContext } from "react";
import { useFoodProvider } from "@config/FoodProvider";
import { AuthContext } from "@config/ContextHelper";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import useLoading from "@utilities/customhooks/useLoading";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const quote =
  "“Make food a very incidental part of your life by filling your life so full of meaningful things that you’ll hardly have time to think about food.” ~ Peace Pilgrim";

export default function ClinicianPatientMealsScreen() {
  const { authState } = useContext(AuthContext);
  const [foodState] = useFoodProvider();
  const styles = StyleProvider();

  const route = useRoute();
  const navigation = useNavigation();
  const [patientId] = useState(route?.params?.patientId);
  const [patientMealRecords, setPatientMealRecords] = useState([]);
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

  async function fetchUserMealRecords() {
    if (!getNetworkStatus()) {
      handleforDialog("Network Error", "Internet Connection is required.");
      return;
    }

    let res = await HttpHelper.Get.GetClinicianAssignedUserMealRecords(
      patientId,
      authState.userToken
    );
    if (res.error) {
      handleforDialog("Server Error", res.message);
      return;
    }
    res = res.data;
    if (foodState.length > 0) {
      res = res.map((meal) => ({
        ...meal,
        food_items: meal.food_items.map((food) => ({
          ...food,
          volume_consumed: parseInt(food.volume_consumed * 100),
          food_name: foodState.find((x) => x.food_id === food.food_id)
            ?.food_name,
        })),
      }));
    }
    setPatientMealRecords(res);
  }
  const [getPatientMealsData, loadingData] = useLoading(fetchUserMealRecords);

  useEffect(() => {
    // Get the patient Records here.
    getPatientMealsData();
  }, []);

  // Render the Flatlist item
  const renderScrollViewContent = ({ item }) => (
    <MealItem
      onPress={() =>
        navigation.navigate("ClinicianSinglePatientMealRecord", {
          mealRecordData: item,
        })
      }
      key={item.meal_id}
      item={item}
    />
  );

  return (
    <View style={styles.fill}>
      <BackButton color="#fff" />
      <AnimatedHeaderFlatList
        headerImageSource={BG2}
        headerQuoteText={quote}
        headerTitleText={"Meal History"}
        refreshCallback={fetchUserMealRecords}
        data={patientMealRecords}
        renderItem={renderScrollViewContent}
        keyExtractor={(item) => item.meal_id.toString()}
        headerQuantityView={() => (
          <RowWrapper>
            <MaterialCommunityIcons
              name="food"
              color="#ffffff"
              size={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("6%")
                  : wp("3.5%")
              }
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
              {patientMealRecords?.length} records
            </NativeText>
          </RowWrapper>
        )}
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
  return StyleSheet.create({
    fill: {
      flex: 1,
    },
    whitetext: {
      color: "#ffffff",
    },
  });
}
