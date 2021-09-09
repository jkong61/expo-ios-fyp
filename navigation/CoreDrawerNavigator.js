import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "./DrawerContent";
import HealthProfileScreen from "@screens/HealthProfileScreen";
import ChangePasswordScreen from "@screens/ChangePasswordScreen";
import CoreStackNavigator from "./CoreStackNavigator";
import SettingStack from "./SettingStackNavigator";
import ClinicianStackNavigator from "./ClinicianStackNavigator";
import ClinicianSettingStack from "./clinician/ClinicianSettingStackNavigator";
import ClinicianCoreStack from "./clinician/ClinicianCoreStackNavigator";
import ClinicianProfileScreen from "@screens/clinician/ClinicianProfileScreen";
import TransitioningScreen from "@screens/TransitioningScreen";
import { useUserProvider } from "@config/UserDetailsProvider";

const Drawer = createDrawerNavigator();

const CoreDrawerNavigator = () => {
  const [userDetails] = useUserProvider();

  // Used to slow down the retrieval of the navigator
  const getComponent = () => {
    if (userDetails.account_type === undefined) {
      return <TransitioningScreen />;
    } else if (userDetails.account_type === 0) {
      return <CoreStackNavigator />;
    } else {
      return <ClinicianCoreStack />;
    }
  };

  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="DrawerHome" component={getComponent} />
      <Drawer.Screen
        name="Profile"
        component={
          userDetails.account_type
            ? ClinicianProfileScreen
            : HealthProfileScreen
        }
      />
      <Drawer.Screen name="Change" component={ChangePasswordScreen} />
      <Drawer.Screen
        name="ClinicianStack"
        component={ClinicianStackNavigator}
      />
      <Drawer.Screen
        name="Setting"
        component={
          userDetails.account_type ? ClinicianSettingStack : SettingStack
        }
      />
    </Drawer.Navigator>
  );
};

export default CoreDrawerNavigator;
