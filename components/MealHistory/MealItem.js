import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { Tag, RowWrapper, ColumnWrapper } from "..";
import { useTheme, Text } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BASE_URL } from "@http/Constant";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

/**
 * Custom View component for row alignment.
 * @param {*} children
 */
const MealItem = (props) => {
  const { colors } = useTheme();
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();

  const item = props.item;
  const reminder = props.reminder;
  const dateObj = helpers.getDateObjFromISOString(item.date_created);
  let consumed =
    item.food_items.reduce((sum, food) => sum + food.volume_consumed, 0) /
    item.food_items.length;
  consumed = consumed * 100;

  return (
    <TouchableOpacity onPress={props.onPress}>
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <RowWrapper style={{ flexWrap: "nowrap" }}>
          <View style={{}}>
            <Image
              style={styles.image}
              source={{
                uri: `${BASE_URL}image/${item.user_id}/${item.image}`,
              }}
            />
          </View>
          <ColumnWrapper
            style={{
              width: "auto",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingHorizontal: wp("3%"),
            }}
          >
            <RowWrapper style={{ paddingVertical: 0 }}>
              <Text
                style={{
                  fontSize:
                    deviceInfo.deviceType === DeviceType.PHONE
                      ? wp("4.5%")
                      : wp("2.5%"),
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
                      height: 20,
                    }}
                  >
                    <View
                      style={{
                        marginLeft: 10,
                        width: 12,
                        height: 12,
                        borderRadius: 13 / 2,
                        backgroundColor: colors.error,
                      }}
                    ></View>
                  </View>
                )
              )}
            </RowWrapper>

            <Text
              style={{
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4.5%")
                    : wp("2.5%"),
              }}
            >{`${dateObj.weekday} | ${dateObj.timeIn12}`}</Text>
            <RowWrapper
              style={{
                width: wp("60%"),
                alignItems: "flex-start",
                paddingVertical: 0,
              }}
            >
              {item.food_items.map((food) => {
                if (food.new_food_type !== null)
                  return (
                    <Tag
                      key={food.new_food_type}
                      deviceType={deviceInfo.deviceType}
                    >
                      {food.new_food_type}
                    </Tag>
                  );
                else
                  return (
                    <Tag
                      key={food.food.food_id}
                      deviceType={deviceInfo.deviceType}
                    >
                      {food.food.food_name}
                    </Tag>
                  );
              })}
            </RowWrapper>
          </ColumnWrapper>
        </RowWrapper>
        <View
          style={{
            width: "100%",
            borderBottomColor: "grey",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        ></View>
      </View>
    </TouchableOpacity>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();

  return StyleSheet.create({
    image: {
      width: deviceInfo.deviceType === DeviceType.PHONE ? wp("25%") : wp("15%"),
      height:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("25%") : wp("15%"),
      resizeMode: "cover",
      borderRadius: 20,
    },
  });
}
export default MealItem;
