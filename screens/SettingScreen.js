import React, { useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@config/ContextHelper";
import { MenuButton, MyContainer, RowWrapper } from "@components";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Constants from "expo-constants";

const SettingScreen = () => {
  const navigation = useNavigation();
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();

  const {
    authContext: { changeTheme, changeBloodGlucoseReminder },
    bloodGlucoseReminder,
    healthRecordReminder,
  } = useContext(AuthContext);

  const theme = useTheme();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MenuButton />
      <Text style={styles.title}>Settings</Text>
      <View style={styles.body}>
        <Text style={styles.subtitle}>Preference</Text>
        <MyContainer style={{ alignItems: "flex-start", paddingVertical: 5 }}>
          <RowWrapper style={{ justifyContent: "space-between" }}>
            <View style={{ width: "80%" }}>
              <Text
                style={{
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4.5%")
                      : wp("3%"),
                }}
              >
                Dark Theme
              </Text>
              <Text
                style={{
                  color: theme.dark
                    ? theme.colors.primary
                    : theme.colors.subtext,
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4%")
                      : wp("2.5%"),
                  paddingTop: 5,
                }}
              >
                {theme.dark
                  ? `On`
                  : `Turn on dark mode to reduces the light emitted by phone screens.`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => changeTheme(!theme.dark)}
              style={{
                width: "20%",
                alignItems: "flex-end",
              }}
            >
              <View pointerEvents="none">
                {Platform.OS === "ios" ? (
                  <Switch
                    trackColor={{ true: theme.colors.primary }}
                    value={theme.dark}
                  />
                ) : (
                  <Switch
                    trackColor={{ true: "#4B429D" }}
                    thumbColor={theme.dark ? theme.colors.primary : "#F6F6F6"}
                    value={theme.dark}
                  />
                )}
              </View>
            </TouchableOpacity>
          </RowWrapper>
        </MyContainer>
        <Text style={styles.subtitle}>Reminder</Text>
        <MyContainer>
          <RowWrapper style={{ justifyContent: "space-between" }}>
            <View style={{ width: "80%" }}>
              <Text
                style={{
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4.5%")
                      : wp("3%"),
                }}
              >
                Blood Glucose Indicator
              </Text>
              <Text
                style={{
                  color: bloodGlucoseReminder
                    ? theme.colors.primary
                    : theme.colors.subtext,
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4%")
                      : wp("2.5%"),
                  paddingTop: 5,
                }}
              >
                {bloodGlucoseReminder
                  ? `On`
                  : `After activation, the meal records that have not recorded blood glucose will be marked with a red dot.`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => changeBloodGlucoseReminder(!bloodGlucoseReminder)}
              style={{
                width: "20%",
                alignItems: "flex-end",
              }}
            >
              <View pointerEvents="none">
                {Platform.OS === "ios" ? (
                  <Switch
                    trackColor={{ true: theme.colors.primary }}
                    value={bloodGlucoseReminder}
                  />
                ) : (
                  <Switch
                    trackColor={
                      theme.dark ? { true: "#4B429D" } : { true: "#9D97FF" }
                    }
                    thumbColor={
                      bloodGlucoseReminder ? theme.colors.primary : "#F6F6F6"
                    }
                    value={bloodGlucoseReminder}
                  />
                )}
              </View>
            </TouchableOpacity>
          </RowWrapper>
          <View
            style={{
              borderBottomColor: theme.colors.divider,
              borderBottomWidth: 1,
              width: "100%",
              opacity: 0.3,
            }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("HealthRecordReminder")}
          >
            <RowWrapper style={{ justifyContent: "space-between" }}>
              <View style={{ width: "100%" }}>
                <Text
                  style={{
                    fontSize:
                      deviceInfo.deviceType === DeviceType.PHONE
                        ? wp("4.5%")
                        : wp("3%"),
                  }}
                >
                  Health Record Reminder
                </Text>
                <Text
                  style={{
                    color: healthRecordReminder.flag
                      ? theme.colors.primary
                      : theme.colors.subtext,
                    fontSize:
                      deviceInfo.deviceType === DeviceType.PHONE
                        ? wp("4%")
                        : wp("2.5%"),
                    paddingTop: 5,
                  }}
                >
                  {healthRecordReminder.flag
                    ? `${healthRecordReminder.schedule}`
                    : `Turn on reminders to remind you to update your health status regularly.`}
                </Text>
              </View>
            </RowWrapper>
          </TouchableOpacity>
        </MyContainer>
        <MyContainer
          style={{ alignItems: "flex-start", paddingVertical: hp("1.5%") }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            <RowWrapper style={{ justifyContent: "space-between" }}>
              <View style={{ width: "80%" }}>
                <Text
                  style={{
                    fontSize:
                      deviceInfo.deviceType === DeviceType.PHONE
                        ? wp("4.5%")
                        : wp("3%"),
                  }}
                >
                  Privacy Policy
                </Text>
              </View>
              <View
                style={{
                  width: "20%",
                  alignItems: "flex-end",
                  paddingRight: 10,
                }}
              >
                <AntDesign
                  name="right"
                  size={20}
                  color={theme.colors.subtext}
                  style={{ marginLeft: wp("2.5%") }}
                />
              </View>
            </RowWrapper>
          </TouchableOpacity>
        </MyContainer>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          flex: 1,
          marginVertical: 35,
        }}
      >
        <Text style={{ fontSize: 13, color: theme.colors.subtext }}>
          Version - {Constants.manifest.version}
        </Text>
        <Text style={{ fontSize: 13, color: theme.colors.subtext }}>
          Copyright © 2020-2021 {Constants.manifest.name}.
        </Text>
        <Text style={{ fontSize: 13, color: theme.colors.subtext }}>
          All Rights Reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      //flex: 1,
      flexGrow: 1,
      flexDirection: "column",
    },
    title: {
      marginTop: hp("4%"),
      marginBottom: hp("3%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
      alignSelf: "center",
    },

    subtitle: {
      marginTop: hp("2%"),
      marginHorizontal: wp("2%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
      fontWeight: "bold",
    },
    body: {
      marginHorizontal: 20,
    },
  });
}

export default SettingScreen;
