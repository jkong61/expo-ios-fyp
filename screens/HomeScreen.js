import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useHealthProvider } from "@config/HealthProvider";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import { useMealProvider } from "@config/MealProvider";
import { useAssignedClinicianProvider } from "@config/AssignedClinicianProvider";
import { useTheme, Text, Avatar } from "react-native-paper";
import { ITEM1, ITEM2, ITEM3, AVATAR, AVATAR2 } from "@assets";
import * as allquotes from "@assets/quotes.json";
import {
  CardItem,
  MenuButton,
  MyLinearGradient,
  ConfirmCancelDialog,
  LargeCardItem,
} from "@components";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as helpers from "@utilities/helpers";
import { useUserProvider } from "@config/UserDetailsProvider";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import { getRandomInt } from "@utilities/helpers";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";


const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const getToday = () => {
  const d = new Date();
  return helpers.getLocalDateTime(d);
};

const Clock = (props) => {
  const styles = StyleProvider();

  return (
    <View style={styles.clockstyle}>
      <Text style={styles.clockText}>{props.time}</Text>
    </View>
  );
};

// React Component
const HomeScreen = () => {
  const styles = StyleProvider();
  const navigation = useNavigation();
  const [userDetails] = useUserProvider();
  const [healthState] = useHealthProvider();
  const [mealState] = useMealProvider();
  const [assignedClinicianState] = useAssignedClinicianProvider();
  const [dateTime, setDateTime] = useState(getToday);
  const [errorDialog, toggleErrorDialog] = useToggleDialog();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const { deviceInfo } = useDeviceInfoProvider();
  const { quotes } = allquotes;

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDateTime(getToday);
    }, 1000);
    return () => clearInterval(secTimer);
  });

  useFocusEffect(
    useCallback(() => {
      setQuoteIndex(getRandomInt(0, 9));
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <MenuButton color="#ffffff" />
      <MyLinearGradient style={{ borderRadius: 0 }}>
        <View style={styles.header}>
          <Avatar.Image
            source={healthState.profile?.gender == "Female" ? AVATAR : AVATAR2}
            //size={helpers.actuatedNormalizeSize(100)}
            size={
              deviceInfo.deviceType === DeviceType.PHONE
                ? SCREEN_HEIGHT < 700
                  ? wp("21%")
                  : wp("24%")
                : wp("18%")
            }
          />
          <Text style={styles.nameTitle}>
            Hello,{" "}
            {helpers.getFirstName(userDetails.name) ??
              helpers.getEmailUserName(userDetails.email) ??
              "there"}
            !
          </Text>
          <Text>
            <Text style={styles.quoteText}>
              &quot;
              {quotes[quoteIndex]?.quote ?? "Stay safe and stay healthy."}
            </Text>
            <Text style={styles.quoteAuthor}>
              &quot; - {quotes[quoteIndex]?.author}
            </Text>
          </Text>
          <Clock time={dateTime} />
        </View>
      </MyLinearGradient>
      <View style={styles.body}>
        <View style={styles.cardcontainer}>
          <CardItem
            source={ITEM1}
            title="Diet Watcher"
            paragraph={`${mealState?.length ?? 0} records`}
            onPress={() => navigation.navigate("DietWatcherStack")}
          />
          <CardItem
            source={ITEM2}
            title="Health Records"
            paragraph={`${healthState?.records?.length ?? 0} records`}
            onPress={() => {
              // Add a check here to see if there is a profile then make user create profile
              if (healthState.profile == null) {
                toggleErrorDialog();
              } else {
                navigation.navigate("HealthNavigator", {
                  screen: "HealthRecord",
                });
              }
            }}
          />
          <LargeCardItem
            source={ITEM3}
            title="Clinician Assignment"
            paragraph={`${assignedClinicianState?.length ?? 0} records`}
            onPress={() => {
              // Add a check here to see if there is a profile then make user create profile
              if (healthState.profile == null) {
                toggleErrorDialog();
              } else {
                navigation.navigate("ClinicianNavigator");
              }
            }}
          />
          <ConfirmCancelDialog
            visible={errorDialog}
            title={"Profile Required"}
            content={"You need to create a profile to use this feature."}
            onDismiss={toggleErrorDialog}
            onConfirm={async () => {
              navigation.navigate("HealthNavigator", {
                screen: "HealthProfile",
                params: { initial: true },
              });
              toggleErrorDialog();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

// View stylesheet
function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();
  return StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles
    container: {
      flex: 1,
    },
    // eslint-disable-next-line react-native/no-unused-styles
    header: {
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      //paddingHorizontal: 20,
      paddingHorizontal: wp("5%"),
      //marginTop: SCREEN_HEIGHT * 0.03,
      marginTop: hp("3%"),
      //backgroundColor: "#f3355f",
    },
    // eslint-disable-next-line react-native/no-unused-styles
    body: {
      position: "absolute",
      width: "100%",
      //height: hp("40%"),
      // height:
      //   SCREEN_HEIGHT < 700
      //     ? helpers.actuatedNormalizeSize(SCREEN_HEIGHT * 0.45)
      //     : helpers.actuatedNormalizeSize(SCREEN_HEIGHT * 0.4),
      height: hp("40%"),
      //height: "40%",
      //height: dimension.height * 0.35,
      flexDirection: "row",
      justifyContent: "center",
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      bottom: 0,
      backgroundColor: colors.background,
    },
    // eslint-disable-next-line react-native/no-unused-styles
    cardcontainer: {
      height: "100%",
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      zIndex: 20,
      //top: helpers.actuatedNormalizeSize(-85),
      top: hp("-8%"),
    },
    // eslint-disable-next-line react-native/no-unused-styles
    clockstyle: {
      //marginTop: 15,
      marginTop: hp("2%"),
      //padding: 10,
      padding: wp("2%"),
      backgroundColor: "#fff",
      borderRadius: 30,
      shadowColor: "#fff",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    // eslint-disable-next-line react-native/no-unused-styles
    clockText: {
      color: colors.primary,
      //fontSize: helpers.actuatedNormalizeFontSize(15),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.5%") : wp("2.5%"),
    },
    // eslint-disable-next-line react-native/no-unused-styles
    nameTitle: {
      //marginTop: helpers.actuatedNormalizeSize(10),
      //fontSize: helpers.actuatedNormalizeFontSize(30),
      marginTop: hp("1%"),
      marginBottom: hp("1%"),
      fontSize: wp("7%"),
      fontWeight: "bold",
      color: "#ffffff",
    },
    // eslint-disable-next-line react-native/no-unused-styles
    quoteText: {
      //fontSize: helpers.actuatedNormalizeFontSize(14),
      marginTop: helpers.actuatedNormalizeSize(10),
      color: "#ffffff",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE
          ? SCREEN_HEIGHT < 700
            ? wp("3.5%")
            : wp("4%")
          : wp("2.5%"),
    },
    // eslint-disable-next-line react-native/no-unused-styles
    quoteAuthor: {
      //fontSize: helpers.actuatedNormalizeFontSize(14),
      color: "#ffffff",
      fontWeight: "bold",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE
          ? SCREEN_HEIGHT < 700
            ? wp("3.5%")
            : wp("4%")
          : wp("2.5%"),
    },
  });
}
