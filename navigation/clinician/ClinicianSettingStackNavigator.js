import React, { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ClinicianSettingScreen from "@screens/clinician/ClinicianSettingScreen";
import PrivacyPolicyScreen from "@screens/PrivacyPolicyScreen";

const ClinicianSettingStack = createStackNavigator();

const ClinicianSettingStackNavigator = () => (
  <ClinicianSettingStack.Navigator headerMode="none">
    <ClinicianSettingStack.Screen
      name="Setting"
      component={ClinicianSettingScreen}
    />
    <ClinicianSettingStack.Screen
      name="PrivacyPolicy"
      component={PrivacyPolicyScreen}
    />
  </ClinicianSettingStack.Navigator>
);

export default memo(ClinicianSettingStackNavigator);
