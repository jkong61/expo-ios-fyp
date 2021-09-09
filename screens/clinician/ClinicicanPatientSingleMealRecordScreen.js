import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Divider, Text, Title } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import {
  MyContainer,
  RowWrapper,
  TouchableSectionItem,
  BackButton,
} from "@components";
import { BASE_URL } from "@http/Constant";
import { AuthContext } from "@config/ContextHelper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ClinicianPatientSingleMealRecordScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const styles = StyleProvider();
  const [mealData, setMealData] = useState(route.params?.mealRecordData);
  const { allFood } = useContext(AuthContext);
  
  const LocalContainer = useCallback((props) => (
    <MyContainer style={styles.mycontainerstyle}>{props.children}</MyContainer>
  ),[styles.mycontainerstyle]);


  useEffect(() => {
    if (route.params?.mealRecordData) {
      setMealData(route.params.mealRecordData);
    } //set image to preview
    // console.log(route.params.mealRecordData);
  }, [route.params?.mealRecordData]);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />

      <View style={styles.titleheader}>
        <Title style={styles.title}>Patient Meal Record</Title>
      </View>

      <View style={styles.thumbnail}>
        {mealData && (
          <Image
            source={{
              uri: `${BASE_URL}image/${mealData?.user_id}/${mealData?.image}`,
            }}
            style={styles.image}
          />
        )}
      </View>

      <ScrollView style={styles.scrollviewstyle}>
        <LocalContainer>
          <TouchableSectionItem
            title="Meal Date"
            touchable={false}
            value={
              helpers.dateStringFromISOString(mealData?.date_created, true) ??
              "Not Provided"
            }
          />
          <TouchableSectionItem
            title="Blood Glucose"
            touchable={false}
            value={mealData?.blood_glucose ?? "Not Provided"}
          />
          <TouchableSectionItem
            title="Nutrition Consumed"
            touchable={mealData?.food_items.length > 0}
            value={mealData?.food_items.length > 0 ? "View Nutrition" : "Not Provided"}
            onPress = {() => {
              navigation.navigate("ClinicianPatientMealNutritionScreen", {
                FoodItem: mealData.food_items 
              });
            }}
          />
        </LocalContainer>

        {mealData?.food_items && (
          <LocalContainer>
            <RowWrapper style={{ justifyContent: "space-between" }}>
              <Text style={styles.foodheader}>Food Items</Text>
              <Text style={styles.foodheader}>Amount Consumed</Text>
            </RowWrapper>
            {mealData.food_items.map((food_item) => (
              <View 
                key={food_item.food_item_id}
              >
                <Divider style={styles.divider}/>
                <TouchableSectionItem
                  style={styles.touchableSection}
                  title={food_item?.food?.food_name ?? food_item.new_food_type}
                  touchable={false}
                  value={`${Math.round(food_item.per_unit_measurement)} ${food_item?.measurement?.suffix ?? "N/A"}`}
                />
              </View>
            ))}
          </LocalContainer>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();

  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
    },
    thumbnail: {
      width: "100%",
      height:
        deviceInfo.deviceType === DeviceType.PHONE ? hp("30%") : hp("35%"),
      justifyContent: "flex-end",
      alignItems: "flex-end",
      flexDirection: "column",
      marginBottom: hp("2%"),
    },
    image: {
      width: "95%",
      height: "100%",
      marginLeft: wp("4%"),
      resizeMode: "cover",
      borderTopLeftRadius: 50,
      borderBottomLeftRadius: 50,
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
    scrollviewstyle: {
      width: "100%",
      paddingHorizontal: "5%",
    },
    foodheader: {
      fontWeight: "bold",
      fontSize: helpers.actuatedNormalizeFontSize(16),
    },
    mycontainerstyle: {
      alignItems: "flex-start",
      marginVertical: "1%",
      width: "100%",
    },
    divider:{
      marginVertical: deviceInfo.deviceType === DeviceType.PHONE ? wp("2%") : wp("5%")
    }
  });
}
