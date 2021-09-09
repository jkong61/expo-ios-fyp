import React, { useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  Text,
  useTheme,
  Chip,
  Searchbar,
  Divider,
  Dialog,
  Portal,
  ProgressBar,
} from "react-native-paper";
import { BackButton, RowWrapper, MyContainer } from "@components";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FOOD_NUTRITIONS } from "@config/NutritionConstants";
import {
  useNutritionProvider,
  NutritionProviderDispatchMethodConstants,
} from "@config/NutritionProvider";
import fuzzysort from "fuzzysort";
import { processNutritionName } from "@utilities/helpers";
import { useRoute } from "@react-navigation/core";

const FoodNutritionsScreen = () => {
  const route = useRoute();
  const styles = StyleProvider();
  const { colors } = useTheme();
  const { deviceInfo } = useDeviceInfoProvider();
  const [nutritionState, nutritionDispatch] = useNutritionProvider();

  const passedData = route.params;
  const currentstate = passedData?.FoodItem ?? null;
  const [foodItem] = useState(currentstate);

  const totalFood = useCallback((foodItemsArray, defaultNutrition) => {
    // For making a deep copy
    const nutritions = JSON.parse(JSON.stringify(defaultNutrition));
    const copy = JSON.parse(JSON.stringify(foodItemsArray));

    // console.log(copy);
    const array = copy.map((item) => {
      const factor_value =
        item.per_unit_measurement *
        (item.measurement?.measurement_conversion_to_g ?? 0) *
        item.volume_consumed;

      //make a deep copy for nutrions (prevent override the value)
      let copyNutritions = JSON.parse(JSON.stringify(nutritions));
      return copyNutritions.map((nutrition) => {

        if(item?.food?.food_nutritions.length <= 0 || !(item?.food?.food_nutritions)){
          return nutrition;
        }

        let nutritionIndex = item?.food?.food_nutritions.findIndex(n => n.nutrition.nutrition_code === nutrition.nutrition.nutrition_code);

        if(nutritionIndex === -1){
          return nutrition;
        }

        nutrition.nutrition_value = item?.food?.food_nutritions[nutritionIndex]?.nutrition_value * factor_value;
        return nutrition;
      });
    });

    //to display all the nutrtion value for each food item (for testing purpose)
    //console.log(array.map((a) => a.map((i) => i.nutrition_value)));

    return array.reduce((acc, value) => {
      // if value is empty array, for each does not execute
      value.forEach((k, index) => {
        acc[index].nutrition_value += k.nutrition_value;
      });
      return acc;
    }, nutritions);
  }, []);

  const [foodNutritions, setFoodNutritions] = useState(
    FOOD_NUTRITIONS.map((f) => ({
      ...f,
      selected: nutritionState.includes(f.nutrition.nutrition_code),
    }))
  );
  const foodNutritionsDesc = FOOD_NUTRITIONS.map(
    (f) => f.nutrition.nutrition_name
  );
  const [filterNutritionDesc, setFilterNutritionDesc] = useState([]);

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [viewAll, setViewAll] = useState(false);

  const toggleDialog = () => {
    setViewAll(false);
    setFilterNutritionDesc([]);
    setVisibleDialog(!visibleDialog);
  };

  const selectHandler = (nut_code) => {
    setFoodNutritions(
      foodNutritions.map((f) => {
        if (f.nutrition.nutrition_code === nut_code) {
          return { ...f, selected: !f.selected };
        }
        return f;
      })
    );
    //copy nutriton state
    let currentNutrition = nutritionState;

    //find the existing index from array
    const index = currentNutrition.findIndex((n) => n === nut_code);
    if (index != -1) {
      //remove the uncheck nutrition
      currentNutrition.splice(index, 1);
    } else {
      //add the new check nutrition
      currentNutrition.push(nut_code);
    }
    // update the context state
    nutritionDispatch({
      type: NutritionProviderDispatchMethodConstants.UPDATESTATE,
      payload: currentNutrition,
    });
  };

  const handleNutritionKeyPress = (val) => {
    //search food from all foods
    let result = fuzzysort.go(val, foodNutritionsDesc).map((s) => s.target);
    setFilterNutritionDesc(result);
  };

  const renderNutritionChip = () => {
    const minNumberToShow = deviceInfo.deviceType === DeviceType.PHONE ? 8 : 16;
    let count = 0;
    if (viewAll) {
      return foodNutritions.map((n) => {
        if (
          filterNutritionDesc.length == 0 ||
          filterNutritionDesc.includes(n.nutrition.nutrition_name)
        ) {
          return (
            <Chip
              key={n.nutrition.nutrition_code}
              selected={n.selected}
              onPress={() => selectHandler(n.nutrition.nutrition_code)}
              textStyle={{ color: n.selected ? "#fff" : colors.text }}
              style={{...styles.chipStyle,
                backgroundColor: n.selected
                  ? colors.primary
                  : colors.background,
              }}
            >
              {`${processNutritionName(n)} (${
                n.nutrition.nutrition_measurement_suffix
              })`}
            </Chip>
          );
        }
      });
    } else {
      return foodNutritions.map((n) => {
        if (
          count < minNumberToShow &&
          (filterNutritionDesc.length == 0 ||
            filterNutritionDesc.includes(n.nutrition.nutrition_name))
        ) {
          ++count;
          return (
            <Chip
              key={n.nutrition.nutrition_code}
              selected={n.selected}
              onPress={() => selectHandler(n.nutrition.nutrition_code)}
              textStyle={{ color: n.selected ? "#fff" : colors.text }}
              style={{...styles.chipStyle,
                backgroundColor: n.selected
                  ? colors.primary
                  : colors.background,
              }}
            >
              {`${
                processNutritionName(n)
              } (${n.nutrition.nutrition_measurement_suffix})`}
            </Chip>
          );
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Nutritions</Text>

      {/* Toggle Nutrition Container */}
      <View style={styles.toggleTextContainer}>
        <RowWrapper style={{ justifyContent: "center" }}>
          <TouchableOpacity onPress={toggleDialog}>
            <Text style={styles.toggleText}>
                Click here to change your nutritions list.
            </Text>
          </TouchableOpacity>
        </RowWrapper>
      </View>

      <ScrollView style={styles.scrollviewstyle}>
        <View style={styles.body}>
          {/* For Total Calculated Nutrition */}
          <View>
            <RowWrapper style={{ justifyContent: "space-between", alignItems: "center" }}>
              <View>
                <Text style={styles.foodTitle}>
                Total Meal Nutrition
                </Text>
              </View>
              {nutritionState.length > 0 ? (
                totalFood(foodItem,foodNutritions).map((n, i) => {
                  if (n.selected) {
                    return (
                      <RowWrapper
                        key={i}
                        style={{
                          justifyContent: "space-between",
                          paddingVertical: hp("1.2%"),
                        }}
                      >
                        <Text style={styles.nutritionTitle}>{`${
                          processNutritionName(n)
                        } (${n.nutrition.nutrition_measurement_suffix})`}</Text>
                        <Text style={styles.nutritionValue}>
                          {n.nutrition_value.toFixed(2)}
                        </Text>
                        <Divider style={{ width: "100%" }} />
                      </RowWrapper>
                    );
                  }
                })
              ) : (
                <MyContainer>
                  <RowWrapper
                    style={{
                      justifyContent: "center",
                      paddingVertical: 0,
                    }}
                  >
                    <AntDesign
                      name="questioncircle"
                      size={
                        deviceInfo.deviceType === DeviceType.PHONE
                          ? wp("6%")
                          : wp("7%")
                      }
                      color={colors.primary}
                    />
                    <Text style={{ paddingHorizontal: wp("1.5%") }}>
                    Please select nutrition to show.
                    </Text>
                  </RowWrapper>
                </MyContainer>
              )}
            </RowWrapper>
          </View>

          {foodItem.map((item, indx) => (
            <RowWrapper
              key={indx}
              style={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <View>
                <Text style={styles.foodTitle}>
                  {item.new_food_type ?? item.food.food_name}
                </Text>
                <Text style={styles.foodMeasurementText}>
                  {item.per_unit_measurement}{" "}
                  {item.measurement?.measurement_description}
                </Text>
              </View>
  
              {/* View for consumed foods */}
              <View>
                <Text
                  style={{
                    fontSize:
                      deviceInfo.deviceType === DeviceType.PHONE
                        ? wp("3.5%")
                        : wp("2%"),
                  }}
                >
                  Consumed: {Math.round(item.volume_consumed * 100)}%
                </Text>
                <ProgressBar
                  progress={item.volume_consumed}
                  color={colors.primary}
                  style={{ height: 8, width: wp("35%"), borderRadius: 10 }}
                />
              </View>
              {nutritionState.length > 0 ? (
                foodNutritions.map((n) => {

                  let value = undefined;
                  let nutritionIndex = item?.food?.food_nutritions.findIndex(nutrition => nutrition.nutrition.nutrition_code === n.nutrition.nutrition_code);

                  if (nutritionIndex === -1) {
                    value = 0;
                  }

                  if (n.selected) {
                    return (
                      <RowWrapper
                        key={n.nutrition.nutrition_code}
                        style={{
                          justifyContent: "space-between",
                          paddingVertical: hp("1.2%"),
                        }}
                      >
                        <Text style={styles.nutritionTitle}>{`${
                          processNutritionName(n)
                        } (${n.nutrition.nutrition_measurement_suffix})`}</Text>
                        <Text style={styles.nutritionValue}>
                          {(value ?? (
                            item.per_unit_measurement *
                                (item.measurement?.measurement_conversion_to_g ?? 0) *
                                (item.food?.food_nutritions.length > 0
                                  ? item?.food?.food_nutritions[nutritionIndex]?.nutrition_value
                                  : 0) *
                                item.volume_consumed
                          )).toFixed(2)}
                        </Text>
  
                        <Divider style={{ width: "100%" }} />
                      </RowWrapper>
                    );
                  }
                })
              ) : (
                <MyContainer>
                  <RowWrapper
                    style={{
                      justifyContent: "center",
                      paddingVertical: 0,
                    }}
                  >
                    <AntDesign
                      name="questioncircle"
                      size={
                        deviceInfo.deviceType === DeviceType.PHONE
                          ? wp("6%")
                          : wp("7%")
                      }
                      color={colors.primary}
                    />
                    <Text style={{ paddingHorizontal: wp("1.5%") }}>
                      Please select nutrition to show.
                    </Text>
                  </RowWrapper>
                </MyContainer>
              )}
            </RowWrapper>
          ))}
        </View>
      </ScrollView>

      {/* Dialog Modal for Changing all Nutrition types */}
      <Portal>
        <Dialog
          visible={visibleDialog}
          onDismiss={toggleDialog}
          style={{ backgroundColor: colors.surface }}
        >
          <Dialog.Content>
            <RowWrapper
              style={{ paddingVertical: 0, justifyContent: "space-between" }}
            >
              <Text style={styles.sub_title}>Nutritions</Text>
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
              <Text
                style={styles.dialogSelectorText}
              >
                Please choose the nutrition that you want to see.
              </Text>
              <Searchbar
                placeholder={"Search..."}
                onChangeText={handleNutritionKeyPress}
              />
            </RowWrapper>
          </Dialog.Content>
          <Dialog.ScrollArea>
            <ScrollView
              style={{ maxHeight: hp("40%") }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.nutritionScrollView}
            >
              {renderNutritionChip()}
            </ScrollView>
          </Dialog.ScrollArea>
          {!viewAll && (
            <RowWrapper
              style={{ justifyContent: "center", paddingVertical: hp("2.5%") }}
            >
              <TouchableOpacity onPress={() => setViewAll(true)}>
                <Text style={styles.seeMoreStyle}>
                  See more
                </Text>
              </TouchableOpacity>
            </RowWrapper>
          )}
        </Dialog>
      </Portal>

    </SafeAreaView>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      flexGrow: 1,
      flexDirection: "column",
    },
    scrollviewstyle: {
      width: "100%",
      paddingHorizontal: "5%",
    },
    title: {
      marginTop: hp("4%"),
      marginBottom: hp("3%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
      alignSelf: "center",
    },
    subtitle: {
      marginTop: hp("2%"),
      marginHorizontal: wp("2%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
      fontWeight: "bold",
    },
    body: {
      // marginHorizontal: 20,
    },
    sub_title: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
      marginBottom: hp("2%"),
    },
    foodTitle: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3.5%"),
      fontWeight: "bold",
    },
    foodMeasurementText: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.5%") : wp("2.5%"),
      color: colors.primary,
    },
    nutritionTitle: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.5%") : wp("2.5%"),
      paddingHorizontal: wp("2%"),
    },
    nutritionValue: {
      paddingHorizontal: wp("2%"),
      color: colors.primary,
    },
    nutritionScrollView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      paddingVertical: hp("1%"),
    },
    toggleText: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
      color: colors.primary,
      textDecorationLine: "underline",
    },
    toggleTextContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      flexWrap: "wrap",
      marginBottom: hp("2%"),
    },
    chipStyle: {
      marginRight: 10,
      marginBottom: 10
    },
    dialogSelectorText:{
      width: "100%",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE
          ? wp("3.5%")
          : wp("2%"),
      paddingVertical: hp("1.5%"),
    },
    seeMoreStyle: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE
          ? wp("4.5%")
          : wp("3%"),
      color: colors.primary,
      textDecorationLine: "underline",
    }
  });
}

export default FoodNutritionsScreen;
