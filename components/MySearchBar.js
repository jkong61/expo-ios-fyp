import React, { useState } from "react";
import fuzzysort from "fuzzysort";
import { View, StyleSheet } from "react-native";
import { Text, Searchbar, useTheme } from "react-native-paper";
import {
  actuatedNormalizeSize,
  actuatedNormalizeFontSize,
  stringIsNotEmpty,
} from "@utilities/helpers";
import { AntDesign } from "@expo/vector-icons";
import { useCallback } from "react";
import { useEffect } from "react";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

function search(val, collection, key) {
  let result = fuzzysort
    .go(val, collection, {
      key: key,
    })
    .map((s) => s.obj);
  return result;
}

export default function MySearchBar({
  collectionChanging,
  collectionOriginal,
  searchKey,
  callback,
  ...props
}) {
  const { colors } = useTheme();
  // For handling the Search Bar
  const [collection, setCollection] = useState(collectionChanging);
  const [searchText, setSearchText] = useState("");
  const searchCallback = useCallback(callback, [callback]);
  const { deviceInfo } = useDeviceInfoProvider();

  // For handling the Search Bar
  function handleSearchKeyPress(val) {
    setSearchText(val);
    let result = search(val, collection, searchKey);
    setCollection(result);
    if (!stringIsNotEmpty(val)) {
      setCollection(collectionOriginal);
      result = collectionOriginal;
    }
    searchCallback(result);
  }

  useEffect(() => {
    setCollection(collectionChanging);
  }, [collectionChanging]);

  return (
    <View style={styles.container}>
      <Searchbar
        {...props}
        style={styles.searchbar}
        value={searchText}
        onChangeText={handleSearchKeyPress}
        clearIcon={() => (
          <AntDesign
            name="closecircle"
            size={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("5.5%") : wp("3%")
            }
            color={colors.text}
            onPress={() => {
              setSearchText("");
              setCollection(collectionOriginal);
              searchCallback(collectionOriginal);
            }}
          />
        )}
      />

      {searchText && searchText != "" ? (
        <Text
          style={{
            fontSize:
              deviceInfo.deviceType === DeviceType.PHONE
                ? wp("4.5%")
                : wp("2.5%"),
            marginVertical: hp("1.5%"),
            color: colors.primary,
            textAlign: "center",
          }}
        >
          Total searched result: {collection?.length}
        </Text>
      ) : (
        <Text style={{ marginVertical: hp("1%") }}></Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    marginTop: 0,
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
