import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HealthProfileScreen from "@screens/HealthProfileScreen";
import HealthRecordScreen from "@screens/HealthRecordScreen";
import HealthRecordDetailScreen from "@screens/HealthRecordDetailScreen";
import HealthRecordHistory from "@screens/HealthRecordHistory";
import HealthGraph from "@screens/HealthGraphScreen";

const HealthStack = createStackNavigator();

const HealthStackNagivator = () => (
  <HealthStack.Navigator headerMode="none">
    <HealthStack.Screen
      name="HealthProfile"
      component={HealthProfileScreen}
    />
    <HealthStack.Screen name="HealthRecord" component={HealthRecordScreen} />
    <HealthStack.Screen
      name="ViewHealthRecord"
      component={HealthRecordDetailScreen}
    />
    <HealthStack.Screen
      name="HealthRecordHistory"
      component={HealthRecordHistory}
    />
    <HealthStack.Screen name="HealthGraph" component={HealthGraph} />
  </HealthStack.Navigator>
);

export default HealthStackNagivator;
