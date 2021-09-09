import React, { memo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "@screens/SignUpScreen";
import PrivacyPolicyScreen from "@screens/PrivacyPolicyScreen";

const SignUpStack = createStackNavigator();

const SignUpStackNavigator = () => (
  <SignUpStack.Navigator headerMode="none">
    <SignUpStack.Screen name="SignUpScreen" component={SignUpScreen} />
    <SignUpStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
  </SignUpStack.Navigator>
);

export default memo(SignUpStackNavigator);
