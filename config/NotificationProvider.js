import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { Platform } from "react-native";
import { AuthContext } from "@config/ContextHelper";
import * as RootNavigation from "@navigation/RootNavigation";
import HttpRequest from "@http/HttpHelper";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PROVIDERNAME = "NotificationProvider";

export const identifierConstants = { healthReminder: "HEALTH-RECORD-REMINDER" };

export const defaultNotificationState = { pushToken: null };

export const NotificationContext = createContext(defaultNotificationState);

export const defaultNotificationContent = {
  title: null,
  subtitle: null,
  body: null,
  sound: true,
  badge: 1,
  data: null,
  android: {
    sound: true,
    vibrate: true
  },
  ios: {
    sound: true,
  },
};

export function useNotificationProvider() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [notificationJWT, setNotificationJWT] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();
  const { authState, healthRecordReminder } = useContext(AuthContext);

  async function updateTokenInServer(auth_token, push_token = "") {
    if (auth_token) {
      try {
        // TODO: Handle any errors from the server
        const response = await HttpRequest.Post.UpdatePushToken(
          push_token,
          auth_token
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    // to retrieve the push token
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      if (healthRecordReminder.flag) {
        //initialize the schedule notification
        schedulePushNotification(
          identifierConstants.healthReminder,
          {
            ...defaultNotificationContent,
            title: "⏰ Health Record Reminder!",
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
      } else {
        // remove existings schedule notification
        Notifications.cancelScheduledNotificationAsync(
          identifierConstants.healthReminder
        );
        if (Platform.OS === "ios") {
          Notifications.setBadgeCountAsync(0);
        }
      }
    });

    //for foreground receive notification listener
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
        //console.log("hehehe");
      }
    );

    //for background receive notification listener
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("rep", response);
        // checking if the navigator and screen are exists
        if (
          response.notification.request.content.data.navigator &&
          response.notification.request.content.data.screen
        ) {
          //navigate to that specific screen
          RootNavigation.navigate(
            response.notification.request.content.data.navigator,
            {
              screen: response.notification.request.content.data.screen,
            }
          );
          
          if (Platform.OS === "ios") {
            Notifications.setBadgeCountAsync(0);
          }  
        }
        // if (healthRecordReminder.flag) {
        //   //initialize the schedule notification
        //   schedulePushNotification(
        //     identifierConstants.healthReminder,
        //     {
        //       ...defaultNotificationContent,
        //       title: "⏰ Health Record Reminder! ",
        //       subtitle: "Reminder",
        //       body: "Please enter your recent health status. 📝",
        //       data: {
        //         schedule: healthRecordReminder.schedule,
        //         navigator: "HealthNavigator",
        //         screen: "ViewHealthRecord",
        //       },
        //     },
        //     healthRecordReminder.schedule
        //   );
        // } else {
        //   //remove existings schedule notification
        //   Notifications.cancelScheduledNotificationAsync(
        //     identifierConstants.healthReminder
        //   );
        // }
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  useEffect(() => {
    console.log(`${PROVIDERNAME}: Service starting..`);
    // When user logs in token is available
    if(authState?.userToken && expoPushToken){
      console.log(`${PROVIDERNAME}: Updating push token in server with - ${expoPushToken}`);
      updateTokenInServer(authState.userToken, expoPushToken); // update the new push token to the server

      // Save a copy of the JWT in Notification Provider
      setNotificationJWT(authState.userToken);
    } else if (notificationJWT){
      // User logs out
      console.log(`${PROVIDERNAME}: Resetting push token in server`);
      updateTokenInServer(notificationJWT, "");
      // Clear Notification's own copy of the JWT
      setNotificationJWT("");
    }

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [authState.userToken, expoPushToken]);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
}

// for generate the date for trigger the push notification (for health record reminder)
async function generateDateForScedule(mode) {
  let trigger = new Date(Date.now()); // for next schedule

  switch (mode) {
  case "Monthly":
    let today = new Date(Date.now()); // get current date time
    let nxtM = new Date(today); // clone the current date time
    nxtM.setMonth(nxtM.getMonth() + 1); // next month
    nxtM.setDate(1); // first of month
    nxtM.setHours(17); // 5pm
    nxtM.setMinutes(30); // 30 Minutes
    nxtM.setSeconds(0); // 0 Second
    let seconds = nxtM.getTime() - today.getTime(); // differentiate
    seconds = seconds / 1000; // convert from miliseconds to seconds
    seconds = Math.abs(seconds); // absolute value of a number
    // return the object as TimeIntervalTriggerInput Interface
    return { seconds: seconds, repeats: true };

  case "Weekly":
    return { weekday: 1, hour: 17, minute: 30, repeats: true };
  default:
    return trigger.setSeconds(trigger.getSeconds() + 5);
  }
}

//generate a local push notification
export async function schedulePushNotification(
  notiIdentifier,
  notContent,
  mode
) {
  const trigger = await generateDateForScedule(mode);
  Notifications.scheduleNotificationAsync({
    identifier: notiIdentifier,
    content: notContent,
    trigger: trigger
  });
}

export async function testNotification(notContent, trigger) {
  Notifications.scheduleNotificationAsync({
    identifier: identifierConstants.healthReminder,
    content: notContent,
    trigger,
  });
}

//to remove all the scheduled notification
export function cancelAllScheduledNotificaiton() {
  Notifications.cancelAllScheduledNotificationsAsync();
}

//to remove a specific schedule notification
export function cancelScheduleNotification(identifier) {
  Notifications.cancelScheduledNotificationAsync(identifier);
}

//to retrieve all schedule notifications
export async function getAllScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

//to initialize the notification (get permission and initialization)
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      //alert("Please allow notification permission!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    //alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
