import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import HistoryScreen from "@screens/HistoryScreen";
import HomeScreen from "@screens/HomeScreen";
import CenterButton from "@components/CenterButton";

const HomeTab = createBottomTabNavigator();
const MealScreen = () => null;

const HomeTabNavigator = ({ navigation }) => (
  <HomeTab.Navigator>
    <HomeTab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: "Home",
        tabBarIcon: ({ color, size }) => (
          <Icon name="home-outline" color={color} size={25} />
        ),
      }}
    />
    <HomeTab.Screen
      name="Meal"
      component={MealScreen}
      options={{
        tabBarButton: () => (
          <CenterButton
            onPress={() =>
              navigation.navigate("AddMealStack", { screen: "AddMeal" })
            }
          />
        ),
      }}
    />
    <HomeTab.Screen
      name="History"
      component={HistoryScreen}
      options={{
        tabBarLabel: "History",
        tabBarIcon: ({ color, size }) => (
          <Icon name="history" color={color} size={25} />
        ),
      }}
    />
  </HomeTab.Navigator>
);

export default HomeTabNavigator;
