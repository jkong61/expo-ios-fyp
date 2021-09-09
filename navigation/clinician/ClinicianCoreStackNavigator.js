import React from "react";
import ClinicianTabNavigator from "./ClinicianTabNavigator";
import { createStackNavigator } from "@react-navigation/stack";
import ClinicianPatientProfileScreen from "@screens/clinician/ClinicianPatientProfileScreen";
import ClinicianPatientHealthsRecordScreen from "@screens/clinician/ClinicianPatientHealthRecordsScreen";
import ClinicianPatientSingleHealthRecordScreen from "@screens/clinician/ClinicianPatientSingleHealthRecordScreen";
import ClinicianPatientMealsScreen from "@screens/clinician/ClinicianPatientMealsScreen";
import ClinicianSinglePatientMealRecordScreen from "@screens/clinician/ClinicicanPatientSingleMealRecordScreen";
import ClinicianTrendAnalyserScreen from "@screens/clinician/ClinicianTrendAnalyserScreen";
import ClinicianReportScreen from "@screens/clinician/ClinicianReportScreen";
import FoodNutritionsScreen from "@screens/FoodNutritionsScreen";

const ClinicianCore = createStackNavigator();

const ClinicianCoreStack = () => (
  <ClinicianCore.Navigator headerMode="none">
    <ClinicianCore.Screen name="ClinicianTab" component={ClinicianTabNavigator}/>
    <ClinicianCore.Screen name="ClinicianPatientProfile" component={ClinicianPatientProfileScreen}/>
    <ClinicianCore.Screen name="ClinicianPatientHealthRecord" component={ClinicianPatientHealthsRecordScreen}/>
    <ClinicianCore.Screen name="ClinicianSinglePatientHealthRecord" component={ClinicianPatientSingleHealthRecordScreen}/>
    <ClinicianCore.Screen name="ClinicianPatientMeals" component={ClinicianPatientMealsScreen}/>
    <ClinicianCore.Screen name="ClinicianSinglePatientMealRecord" component={ClinicianSinglePatientMealRecordScreen}/>
    <ClinicianCore.Screen name="ClinicianTrendAnalyserScreen" component={ClinicianTrendAnalyserScreen}/>
    <ClinicianCore.Screen name="ClinicianReportScreen" component={ClinicianReportScreen}/>
    <ClinicianCore.Screen name="ClinicianPatientMealNutritionScreen" component={FoodNutritionsScreen}/>
  </ClinicianCore.Navigator>
);

export default ClinicianCoreStack;