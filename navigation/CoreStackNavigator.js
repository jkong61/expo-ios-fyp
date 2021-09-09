import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeTabNavigator from "./HomeTabNavigator";
import MealStackNavigator from "./MealStackNavigator";
import HealthStackNavigator from "./HealthStackNavigator";
import DietWatcherStackNavigator from "./DietWatcherStackNavigator";
import ClinicianStackNavigator from "./ClinicianStackNavigator";

const CoreStack = createStackNavigator();

const CoreStackNavigator = () => (
  <CoreStack.Navigator headerMode="none">
    <CoreStack.Screen name="HomeTab" component={HomeTabNavigator} />
    <CoreStack.Screen name="AddMealStack" component={MealStackNavigator} />
    <CoreStack.Screen
      name="DietWatcherStack"
      component={DietWatcherStackNavigator}
    />
    <CoreStack.Screen name="HealthNavigator" component={HealthStackNavigator} />
    <CoreStack.Screen
      name="ClinicianNavigator"
      component={ClinicianStackNavigator}
    />
  </CoreStack.Navigator>
);

export default CoreStackNavigator;
