import React from "react";
import { View } from "react-native";
import Tag from "@components/Tag";

export default function TwoSelections({
  choice,
  select1,
  press1,
  select2,
  press2,
  deviceInfo = undefined,
}) {
  function Selector({ choice, select, press, style = undefined }) {
    return (
      <View>
        {choice === select ? (
          <Tag
            deviceType={deviceInfo}
            style={style}
            selected={true}
            onPress={press}
          >
            {typeof select === "boolean" ? (choice ? "Yes" : "No") : select}
          </Tag>
        ) : (
          <Tag
            deviceType={deviceInfo}
            style={style}
            selected={false}
            onPress={press}
            textStyles={{ color: "#000" }}
          >
            {typeof select === "boolean" ? (choice ? "No" : "Yes") : select}
          </Tag>
        )}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: "row", alignContent: "flex-end" }}>
      {/* First Tag */}
      <Selector choice={choice} select={select1} press={press1} />

      {/* Second Tag */}
      <Selector
        style={{ marginRight: 0 }}
        choice={choice}
        select={select2}
        press={press2}
      />
    </View>
  );
}
