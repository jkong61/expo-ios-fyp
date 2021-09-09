import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ClinicianHomeScreen from "@screens/clinician/ClinicianHomeScreen";
import ClinicianPatientScreen from "@screens/clinician/ClinicianPatientScreen";
import ClinicianAssignmentScreen from "@screens/clinician/ClinicianAssignmentScreen";

const Tab = createBottomTabNavigator();

const ClinicianTabNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      keyboardHidesTabBar: true,
    }}>
    <Tab.Screen
      name="Home"
      component={ClinicianHomeScreen}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color }) => (
          <Icon name="home-outline" color={color} size={25} />
        ),
      }}
    />
    <Tab.Screen
      name="Patients"
      component={ClinicianPatientScreen}
      options={{
        tabBarLabel: "Patients",
        tabBarIcon: ({ color }) => (
          <Icon name="doctor" color={color} size={25} />
        ),
      }}
    />
    <Tab.Screen
      name="Assignments"
      component={ClinicianAssignmentScreen}
      options={{
        tabBarLabel: "Assignments",
        tabBarIcon: ({ color }) => (
          <Icon name="medical-bag" color={color} size={25} />
        ),
      }}
    />

    {/* Testing Purposes only uncomment for debugging purposes and prototyping
    <Tab.Screen
      name="Test"
      component={TestScreen}
      options={{
        tabBarLabel: "Test",
        tabBarIcon: ({ color }) => (
          <Icon name="android-debug-bridge" color={color} size={25} />
        ),
      }}
    /> */}
  </Tab.Navigator>
);

export default ClinicianTabNavigator;