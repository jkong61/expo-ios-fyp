import React from "react";
import { View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Text, useTheme } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DeviceType } from "@config/DeviceInfoProvider";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const TouchableContainer = (props) => {
  const { colors } = useTheme();
  const deviceInfo = props.deviceInfo;

  return (
    <TouchableOpacity style={{ width: "100%" }} onPress={props.onPress ?? null}>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: "5%",
          alignItems: "center",
        }}
      >
        <AntDesign
          name={
            props.index == props.currentState ? "checkcircle" : "checkcircleo"
          }
          size={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("4%")
          }
          color={props.index == props.currentState ? colors.primary : "grey"}
          style={{ marginRight: wp("10%") }}
        />
        <Text
          style={{
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("4.5%")
                : wp("3%"),
          }}
        >
          {props.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TouchableContainer;
