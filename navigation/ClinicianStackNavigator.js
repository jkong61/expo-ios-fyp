import React, { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ClinicianScreen from "@screens/ClinicianScreen";
import ClinicianDetailScreen from "@screens/ClinicianDetailScreen";
import AssignmentScreen from "@screens/AssignmentScreen";
import AssignmentDetailScreen from "@screens/AssignmentDetailScreen";

const ClinicianStack = createStackNavigator();

const ClinicianStackNavigator = () => (
  <ClinicianStack.Navigator headerMode="none">
    <ClinicianStack.Screen name="Clinician" component={ClinicianScreen} />
    <ClinicianStack.Screen
      name="ClinicianDetail"
      component={ClinicianDetailScreen}
    />
    <ClinicianStack.Screen name="Assignment" component={AssignmentScreen} />
    <ClinicianStack.Screen
      name="AssignmentDetail"
      component={AssignmentDetailScreen}
    />
  </ClinicianStack.Navigator>
);

export default memo(ClinicianStackNavigator);
