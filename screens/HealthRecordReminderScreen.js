import React, { useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { Tag } from "@components";
import { Text, useTheme } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import { SCHEDULETEXT } from "@config/ReminderConstants";
import { BackButton, MyContainer, RowWrapper } from "@components";
import { AuthContext } from "@config/ContextHelper";
import {
  defaultNotificationContent,
  schedulePushNotification,
  identifierConstants,
  cancelScheduleNotification,
} from "@config/NotificationProvider";
import { useNotificationProvider } from "@config/NotificationProvider"; // for checking the notificaiton permissin is grant or not
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useCallback } from "react";

const HealthRecordReminderScreen = () => {
  const {
    authContext: { changeHealthRecordReminder },
    healthRecordReminder,
  } = useContext(AuthContext);
  const { expoPushToken } = useNotificationProvider();

  const theme = useTheme();
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();

  const changeSchedule = useCallback(
    (value) => {
      changeHealthRecordReminder({ ...healthRecordReminder, schedule: value });
      if (healthRecordReminder.flag) {
        schedulePushNotification(
          identifierConstants.healthReminder,
          {
            ...defaultNotificationContent,
            title: "⏰ Health Record Reminder!!!! ",
            subtitle: "Reminder",
            body: "Please enter your recent health status. 📝",
            data: {
              schedule: value,
              navigator: "HealthNavigator",
              screen: "ViewHealthRecord",
            },
          },
          value
        );
      } else {
        cancelScheduleNotification(identifierConstants.healthReminder);
      }
    },
    [changeHealthRecordReminder, healthRecordReminder]
  );

  const toggleHealthReminder = () => {
    changeHealthRecordReminder({
      ...healthRecordReminder,
      flag: !healthRecordReminder.flag,
    });
    if (!healthRecordReminder.flag) {
      schedulePushNotification(
        identifierConstants.healthReminder,
        {
          ...defaultNotificationContent,
          title: "⏰ Health Record Reminder! ",
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
      cancelScheduleNotification(identifierConstants.healthReminder);
    }
  };

  useEffect(() => {
    if (!expoPushToken) {
      Alert.alert(
        "Notification Permission 💬",
        "For this reminder feauture 📬, please allow the app to send notification."
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Health Record Reminder</Text>
      <View style={styles.body}>
        <MyContainer style={{ alignItems: "flex-start", paddingVertical: 5 }}>
          <RowWrapper style={{ justifyContent: "space-between" }}>
            <View style={{ width: "80%" }}>
              <Text style={{ fontSize: helpers.actuatedNormalizeFontSize(20) }}>
                {healthRecordReminder.flag ? "On" : "Off"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleHealthReminder()}
              style={{
                width: "20%",
                alignItems: "flex-end",
              }}
            >
              <View pointerEvents="none">
                {Platform.OS === "ios" ? (
                  <Switch
                    trackColor={{ true: theme.colors.primary }}
                    value={healthRecordReminder.flag}
                  />
                ) : (
                  <Switch
                    trackColor={
                      theme.dark ? { true: "#4B429D" } : { true: "#9D97FF" }
                    }
                    thumbColor={
                      healthRecordReminder.flag
                        ? theme.colors.primary
                        : "#F6F6F6"
                    }
                    value={healthRecordReminder.flag}
                  />
                )}
              </View>
            </TouchableOpacity>
          </RowWrapper>
        </MyContainer>
        <Text style={styles.textStyle}>
          Reminders will send push notifications at the time you set.
        </Text>

        <Text style={styles.subtitle}>Schedule</Text>
        <MyContainer style={{ padding: 0 }}>
          <RowWrapper style={{ justifyContent: "space-evenly" }}>
            {SCHEDULETEXT.map((value, index) => (
              <Tag
                linearStyle={{
                  paddingHorizontal: wp("10%"),
                  paddingVertical: hp("2%"),
                }}
                deviceType={deviceInfo?.deviceType}
                textStyle={{ fontWeight: "bold" }}
                key={index}
                selected={healthRecordReminder.schedule === value}
                onPress={() => changeSchedule(value)}
                disabled={healthRecordReminder.schedule === value}
              >
                {value}
              </Tag>
            ))}
          </RowWrapper>
        </MyContainer>
        <Text style={styles.messageStyle}>
          {healthRecordReminder.schedule === "Monthly"
            ? "The reminder will be reminded every first of month."
            : "The reminder will be reminded every Sunday."}
        </Text>
      </View>
      {/* <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Button
          onPress={() => testToggle()}
          title="Push Notification"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={async () =>
            console.log(await getAllScheduledNotifications())
          }
          title="Get All"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={() => cancelAllScheduledNotificaiton()}
          title="Clear All"
          accessibilityLabel="Learn more about this purple button"
        />
      </View> */}
    </View>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    title: {
      marginTop: hp("4%"),
      marginBottom: hp("2%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),

      alignSelf: "center",
    },
    subtitle: {
      marginTop: hp("1%"),
      marginHorizontal: wp("4%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
      fontWeight: "bold",
    },
    textStyle: {
      marginTop: 10,
      marginHorizontal: wp("4%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
      marginBottom: hp("4%"),
    },
    messageStyle: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.8%") : wp("2.3%"),
      marginHorizontal: wp("4%"),
      color: "#6C63FF",
    },
    body: {
      marginHorizontal: wp("4%"),
    },
  });
}

export default HealthRecordReminderScreen;
