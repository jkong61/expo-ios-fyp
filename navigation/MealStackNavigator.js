import React, { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddMealScreen from "@screens/AddMealScreen";
import CameraScreen from "@screens/CameraScreen";

const MealStack = createStackNavigator();

const MealStackNavigator = () => (
  <MealStack.Navigator headerMode="none">
    <MealStack.Screen name="AddMeal" component={AddMealScreen} />
    <MealStack.Screen name="Camera" component={CameraScreen} />
  </MealStack.Navigator>
);

export default memo(MealStackNavigator);
