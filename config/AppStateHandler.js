import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { AppState } from "react-native";
import { AuthContext } from "@config/ContextHelper";
import {
  defaultNotificationContent,
  schedulePushNotification,
  identifierConstants,
} from "@config/NotificationProvider";
import { useUserProvider } from "@config/UserDetailsProvider";
import { useFoodProvider } from "@config/FoodProvider";
import HttpRequest from "@http/HttpHelper";

export const AppStateHandlerContext = createContext();

export function useNotificationProvider() {
  return useContext(AppStateHandlerContext);
}

export function AppStateHandler({ children }) {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const { healthRecordReminder } = useContext(AuthContext);
  const [userDetails] = useUserProvider();
  const [foodState, dispatch] = useFoodProvider();

  const renewReminder = () => {
    schedulePushNotification(
      identifierConstants.healthReminder,
      {
        ...defaultNotificationContent,
        title: "⏰ Health Record Reminder! @@@@@",
        subtitle: "Reminder",
        body: "Please enter your recent health status. 📝",
        data: {
          schedule: healthRecordReminder.schedule,
          navigator: "HealthNavigator",
          screen: "ViewHealthRecord",
        },
      },
      healthRecordReminder.schedule
    );
  };

  //to handle the app state changes
  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // refresh the health reminder when the user back to app
      if (userDetails.account_type === 0 && healthRecordReminder.flag) {
        //initialize the schedule notification
        renewReminder();
      }
    }
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
    console.log("App lauching@@@@");
  };

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  return (
    <AppStateHandlerContext.Provider>
      {children}
    </AppStateHandlerContext.Provider>
  );
}
