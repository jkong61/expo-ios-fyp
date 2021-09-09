import React, { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MealDetailScreen from "@screens/MealDetailScreen";
import DietWatcherScreen from "@screens/DietWatcherScreen";
import MealHistoryScreen from "@screens/MealHistoryScreen";
import FoodNutritionsScreen from "@screens/FoodNutritionsScreen";

const DietWatcherStack = createStackNavigator();

const DietWatcherStackNavigator = () => (
  <DietWatcherStack.Navigator headerMode="none">
    <DietWatcherStack.Screen name="DietWatcher" component={DietWatcherScreen} />
    <DietWatcherStack.Screen name="MealHistory" component={MealHistoryScreen} />
    <DietWatcherStack.Screen name="MealDetail" component={MealDetailScreen} />
    <DietWatcherStack.Screen
      name="FoodNutritions"
      component={FoodNutritionsScreen}
    />
  </DietWatcherStack.Navigator>
);

export default memo(DietWatcherStackNavigator);
