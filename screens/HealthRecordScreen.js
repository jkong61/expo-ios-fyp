import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  RowWrapper,
  PrimaryButton,
  MyLinearGradient,
  EmptyListComponent,
} from "@components";
import HeaderImageContainer from "@components/HeaderImageContainer";
import { HealthCard } from "@components/HealthHistory";
import { useTheme, Text, Button } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BG4 } from "@assets";
import { useHealthProvider } from "@config/HealthProvider";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const quote = `“To keep the body in good health is a duty…otherwise we shall not be
able to keep the mind strong and clear.” ~ Buddha`;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const HealthRecordScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [healthstate] = useHealthProvider();
  //const [onSelected, setOnSelected] = useState(false); // to trigger the render function
  const { deviceInfo } = useDeviceInfoProvider();

  const renderItem = ({ item }) => <HealthCard data={item} />;

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     setOnSelected(!onSelected);
  //   });
  //   return unsubscribe;
  // }, [navigation, onSelected]);

  return (
    <ScrollView>
      <HeaderImageContainer title="Health Records" quote={quote} image={BG4}>
        <View
          style={{
            paddingHorizontal: wp("4.5%"),
          }}
        >
          <Text
            style={{
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("2.5%"),
              backgroundColor: "transparent",
            }}
          >
            New health record? Tap
            <Text
              style={{
                color: colors.primary,
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4.5%")
                    : wp("2.5%"),
                fontWeight: "bold",
              }}
            >
              {" "}
              Add Health Record{" "}
            </Text>
            to create your health record!
          </Text>
          <RowWrapper>
            <PrimaryButton
              title="Add Health Record"
              tfontSize={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? SCREEN_HEIGHT < 700
                    ? wp("4%")
                    : wp("5%")
                  : wp("3%")
              }
              style={{
                width:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("50%")
                    : wp("38%"),
                marginTop: hp("3%"),
                marginEnd: wp("4%"),
              }}
              onPress={() =>
                navigation.navigate("HealthNavigator", {
                  screen: "ViewHealthRecord",
                  params: undefined,
                })
              }
            />

            {/* To traverse to health graph */}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("HealthGraph");
              }}
            >
              <MyLinearGradient
                style={{
                  flexDirection: "row",
                  padding:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("3.5%")
                      : wp("3%"),
                }}
              >
                <MaterialCommunityIcons
                  name="chart-bar"
                  size={
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? SCREEN_HEIGHT < 700
                        ? wp("5%")
                        : wp("6%")
                      : wp("4%")
                  }
                  color="white"
                />
                <Text
                  style={{
                    color: "#fff",
                    fontSize:
                      deviceInfo.deviceType === DeviceType.PHONE
                        ? SCREEN_HEIGHT < 700
                          ? wp("4%")
                          : wp("5%")
                        : wp("3%"),
                    marginLeft: wp("2%"),
                  }}
                >
                  Analysis
                </Text>
              </MyLinearGradient>
            </TouchableOpacity>
          </RowWrapper>
          <RowWrapper
            style={{
              paddingVertical: 0,
              justifyContent: "space-between",
              marginBottom: hp("2%"),
            }}
          >
            <Text
              style={{
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("5%")
                    : wp("3%"),
                fontWeight: "bold",
                backgroundColor: "transparent",
              }}
            >
              Health History
            </Text>

            <Button
              uppercase={false}
              labelStyle={{
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("5%")
                    : wp("3%"),
                color: colors.primary,
                backgroundColor: "transparent",
              }}
              onPress={() => navigation.navigate("HealthRecordHistory")}
            >
              View All
            </Button>
          </RowWrapper>
        </View>
        <FlatList
          data={healthstate.records.slice(0, 5)} //get first 5 items from array only
          horizontal={true}
          renderItem={renderItem}
          keyExtractor={(item) => item.health_record_id.toString()}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<EmptyListComponent />}
        />
      </HeaderImageContainer>
    </ScrollView>
  );
};

export default HealthRecordScreen;
