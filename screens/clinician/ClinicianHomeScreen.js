import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useHealthProvider } from "@config/HealthProvider";
import { useTheme, Text, Avatar } from "react-native-paper";
import { ITEM4, AVATAR, AVATAR2 } from "@assets";
import {
  LargeCardItem,
  MenuButton,
  MyLinearGradient,
  RightCornerButton,
} from "@components";
import { useNavigation } from "@react-navigation/native";
import * as helpers from "@utilities/helpers";
import { useUserProvider } from "@config/UserDetailsProvider";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const getToday = () => {
  const d = new Date();
  return helpers.getLocalDateTime(d);
};

const Clock = (props) => {
  const styles = StyleProvider();
  return (
    <View style={styles.clock}>
      <Text style={styles.clocktext}>{props.time}</Text>
    </View>
  );
};

// React Component
const ClinicianHomeScreen = () => {
  const navigation = useNavigation();
  const styles = StyleProvider();
  const [userDetails] = useUserProvider();
  const [healthState] = useHealthProvider();
  const [dt, setDt] = useState(getToday);
  const { deviceInfo } = useDeviceInfoProvider();

  useEffect(() => {
    let secTimer = setInterval(() => {
      setDt(getToday);
    }, 1000);
    return () => clearInterval(secTimer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <MenuButton color="#ffffff" />
      <RightCornerButton
        iconname={"information-outline"}
        color={"#fff"}
        onPress={() => {}}
      />
      <MyLinearGradient style={{ borderRadius: 0 }}>
        <View style={styles.header}>
          <Avatar.Image
            source={healthState.profile?.gender == "Female" ? AVATAR : AVATAR2}
            size={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("24%") : wp("18%")
            }
          />
          <Text style={styles.title}>
            Hello,{" "}
            {helpers.getFirstName(userDetails.name) ??
              helpers.getEmailUserName(userDetails.email) ??
              "there"}
            !
          </Text>
          <Text style={styles.quote}>&quot;Stay safe, Stay healthy.&quot;</Text>
          <Clock time={dt} />
        </View>
      </MyLinearGradient>
      <View style={styles.body}>
        <View style={styles.cardcontainer}>
          <LargeCardItem
            source={ITEM4}
            title="Trend Analyser"
            onPress={() => navigation.navigate("ClinicianTrendAnalyserScreen")}
          />
        </View>
      </View>
    </View>
  );
};

// View stylesheet
function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      paddingHorizontal: wp("5%"),
      marginTop: hp("3%"),
      //backgroundColor: "#f3355f",
    },
    body: {
      position: "absolute",
      width: "100%",
      height: hp("40%"),
      backgroundColor: colors.background,
      //height: "40%",
      //height: dimension.height * 0.35,
      flexDirection: "row",
      justifyContent: "center",
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      bottom: 0,
    },
    cardcontainer: {
      height: "100%",
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
      zIndex: 20,
      top: hp("-8%"),
    },
    title: {
      marginTop: hp("1%"),
      fontSize: wp("7%"),
      fontWeight: "bold",
      color: "#ffffff",
    },
    quote: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
      marginTop: hp("1%"),
      color: "#ffffff",
    },
    clock: {
      marginTop: hp("2%"),
      padding: wp("2%"),
      backgroundColor: "#fff",
      borderRadius: 30,
      shadowColor: "#fff",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
    clocktext: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("3.5%") : wp("2.5%"),
      color: colors.primary,
    },
  });
}

export default ClinicianHomeScreen;
