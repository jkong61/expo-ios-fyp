import React, { useContext } from "react";
import { StyleSheet, View, FlatList, ScrollView } from "react-native";
import { RowWrapper, PrimaryButton, EmptyListComponent } from "@components";
import { MealCard } from "@components/MealHistory";
import HeaderImageContainer from "@components/HeaderImageContainer";
import { useTheme, Text, Button } from "react-native-paper";
import { BG3 } from "@assets";
import { useMealProvider } from "@config/MealProvider";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@config/ContextHelper";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const DietWatcherScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [mealState] = useMealProvider();
  const { deviceInfo } = useDeviceInfoProvider();
  const { bloodGlucoseReminder } = useContext(AuthContext); // for get the user token purpose

  const renderItem = ({ item }) => (
    <MealCard item={item} reminder={bloodGlucoseReminder} />
  );

  const quote = `“Tell me what you eat and I&apos;ll tell you who you are.” ~ French Proverb`;

  return (
    <ScrollView>
      <HeaderImageContainer title="Diet Watcher" quote={quote} image={BG3}>
        <View style={{ paddingHorizontal: wp("4.5%") }}>
          <Text
            style={{
              fontSize:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("4.5%")
                  : wp("2.5%"),
              backgroundColor: "transparent",
            }}
          >
            Having your meal? Tap
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
              Add Meal{" "}
            </Text>
            to create your meal entry!
          </Text>
          <PrimaryButton
            title="Add Meal"
            tfontSize={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3%")
            }
            style={{
              width:
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("40%")
                  : wp("30%"),
              marginTop: hp("3%"),
            }}
            onPress={() => navigation.navigate("AddMealStack")}
          />
          <RowWrapper
            style={{
              paddingVertical: 0,
              justifyContent: "space-between",
              marginTop: hp("3%"),
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
              Meal History
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
              onPress={() => navigation.navigate("MealHistory")}
            >
              View All
            </Button>
          </RowWrapper>
        </View>
        <FlatList
          data={mealState.slice(0, 5)} //get first 5 items from array only
          horizontal={true}
          renderItem={renderItem}
          keyExtractor={(item) => item.meal_id.toString()}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={<EmptyListComponent />}
        />
      </HeaderImageContainer>
    </ScrollView>
  );
};

export default DietWatcherScreen;
