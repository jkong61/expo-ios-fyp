import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Tag, RowWrapper, ColumnWrapper } from "..";
import { useTheme, Text, Card } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { BASE_URL } from "@http/Constant";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";

/**
 * Custom View component for row alignment.
 * @param {*} children
 */
const MealCard = (props) => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { deviceInfo } = useDeviceInfoProvider();

  const { item, setItem, reminder } = props;
  const dateObj = helpers.getDateObjFromISOString(item.date_created);
  let consumed = item.food_items.reduce(
    (sum, food) => sum + food?.volume_consumed,
    0
  );
  consumed = consumed / item.food_items.length;
  consumed *= 100;

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      //marginLeft: 20,
      marginLeft: wp("4.5%"),
      //marginBottom: helpers.actuatedNormalizeSize(50),
      marginBottom: hp("4%"),
      //paddingBottom: helpers.actuatedNormalizeSize(20),
      paddingBottom: hp("2%"),
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5.84,
      elevation: 5,
    },
    image: {
      //width: window.width - 100,
      width: deviceInfo.deviceType === DeviceType.PHONE ? wp("75%") : wp("55%"),
      // height: helpers.actuatedNormalizeSize(140),
      height: hp("16%"),
      resizeMode: "cover",
      borderRadius: 20,
    },
  });

  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("DietWatcherStack", {
          screen: "MealDetail",
          params: { Meal: item, SetMeal: setItem },
        })
      }
    >
      <Card style={styles.card}>
        <Image
          style={styles.image}
          source={{
            uri: `${BASE_URL}image/${item.user_id}/${item.image}`,
          }}
        />
        <RowWrapper
          style={{
            width:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("75%")
                : wp("55%"),
            flexWrap: "nowrap",
            justifyContent: "space-between",
          }}
        >
          <ColumnWrapper
            style={{
              paddingHorizontal: helpers.actuatedNormalizeSize(20),
              marginTop: helpers.actuatedNormalizeSize(10),
              width: "auto",
            }}
          >
            <RowWrapper style={{ paddingVertical: 0 }}>
              <Text
                style={{
                  //fontSize: helpers.actuatedNormalizeFontSize(20),
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4.5%")
                      : wp("3%"),
                  fontWeight: "bold",
                }}
              >
                {`${dateObj.day} ${dateObj.month} ${dateObj.year}`}
              </Text>
              {item && item.blood_glucose ? (
                <></>
              ) : (
                reminder && (
                  <View
                    style={{
                      height:
                        deviceInfo.deviceType === DeviceType.PHONE
                          ? hp("4%")
                          : hp("3%"),
                    }}
                  >
                    <View
                      style={{
                        marginLeft: 10,
                        width:
                          deviceInfo.deviceType === DeviceType.PHONE
                            ? wp("3%")
                            : wp("1.5%"),
                        height:
                          deviceInfo.deviceType === DeviceType.PHONE
                            ? wp("3%")
                            : wp("1.5%"),
                        borderRadius:
                          deviceInfo.deviceType === DeviceType.PHONE
                            ? wp("3%") / 2
                            : wp("1.5%") / 2,
                        backgroundColor: colors.error,
                      }}
                    ></View>
                  </View>
                )
              )}
            </RowWrapper>
            <Text
              style={{
                //fontSize: helpers.actuatedNormalizeFontSize(14),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("3.5%")
                    : wp("2.5%"),
                marginTop: 5,
              }}
            >
              {`${dateObj.weekday} | ${dateObj.timeIn12}`}
            </Text>
          </ColumnWrapper>
          <View
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                //fontSize: helpers.actuatedNormalizeFontSize(14),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("3.5%")
                    : wp("2.5%"),
              }}
            >
              Consumed %
            </Text>
            <Text
              style={{
                color: colors.primary,
                fontWeight: "bold",
                //fontSize: helpers.actuatedNormalizeFontSize(25),
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("6.5%")
                    : wp("4%"),
              }}
            >
              {consumed ? Number(consumed).toFixed(1) : 0}
            </Text>
          </View>
        </RowWrapper>

        <RowWrapper
          style={{
            paddingVertical: 0,
            paddingHorizontal: helpers.actuatedNormalizeSize(20),
            width:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("75%")
                : wp("55%"),
          }}
        >
          {item.food_items.map((food) => {
            if (food.new_food_type !== null) {
              return (
                <Tag
                  key={food.new_food_type}
                  deviceType={deviceInfo.deviceType}
                >
                  {food.new_food_type}
                </Tag>
              );
            } else {
              return (
                <Tag key={food.food.food_id} deviceType={deviceInfo.deviceType}>
                  {food.food.food_name}
                </Tag>
              );
            }
          })}
        </RowWrapper>
      </Card>
    </TouchableWithoutFeedback>
  );
};

export default MealCard;
