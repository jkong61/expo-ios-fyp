import React, { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SettingScreen from "@screens/SettingScreen";
import PrivacyPolicyScreen from "@screens/PrivacyPolicyScreen";
import HealthRecordReminderScreen from "@screens/HealthRecordReminderScreen";

const SettingStack = createStackNavigator();

const SettingStackNavigator = () => (
  <SettingStack.Navigator headerMode="none">
    <SettingStack.Screen name="Setting" component={SettingScreen} />
    <SettingStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    <SettingStack.Screen
      name="HealthRecordReminder"
      component={HealthRecordReminderScreen}
    />
  </SettingStack.Navigator>
);

export default memo(SettingStackNavigator);
