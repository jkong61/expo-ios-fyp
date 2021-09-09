import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "@screens/StartScreen";
import LoginScreen from "@screens/LoginScreen";
import SignUpStack from "./SignUpStackNavigator";

const RootStack = createStackNavigator();

const AuthNavigator = () => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen name="StartScreen" component={StartScreen} />
    <RootStack.Screen name="LoginScreen" component={LoginScreen} />
    <RootStack.Screen name="SignUpScreen" component={SignUpStack} />
  </RootStack.Navigator>
);

export default AuthNavigator;
