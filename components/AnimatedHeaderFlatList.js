/* eslint-disable react-native/no-unused-styles */
import React, { useState, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
} from "react-native";
import { Text } from "react-native-paper";
import { BG5 } from "@assets";
import EmptyListComponent from "@components/EmptyListComponent";
import { useTheme } from "@react-navigation/native";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const HEADER_MAX_HEIGHT = hp("40%");
const HEADER_MIN_HEIGHT = hp("14%");
// const HEADER_MAX_HEIGHT = getScreenHeightPercentage("40%");
// const HEADER_MIN_HEIGHT =
//   Platform.OS === "ios"
//     ? getScreenHeightPercentage("16%")
//     : getScreenHeightPercentage("14%");
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// adapted from https://medium.com/appandflow/react-native-scrollview-animated-header-10a18cb9469e
export default function AnimatedHeaderFlatList({
  headerImageSource,
  headerTitleText,
  headerQuoteText,
  headerQuantityView,
  refreshCallback = undefined,
  ...FlatListProps
}) {
  const styles = StyleProvider();
  const { colors } = useTheme();
  const flatList = useRef(null);
  const scrollOffsetY = useRef(
    new Animated.Value(Platform.OS === "ios" ? -HEADER_MAX_HEIGHT : 0)
  ).current;
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = Animated.add(
    scrollOffsetY,
    Platform.OS === "ios" ? HEADER_MAX_HEIGHT : 0
  );
  const { deviceInfo } = useDeviceInfoProvider();

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: "clamp",
  });
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0.6, 0.6, 0.3],
    extrapolate: "clamp",
  });
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });
  const imageScale = scrollY.interpolate({
    inputRange: [-HEADER_SCROLL_DISTANCE, 0],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0.75],
    extrapolate: "clamp",
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 4, HEADER_SCROLL_DISTANCE],
    // outputRange: [0, 0, -(68)],
    outputRange: [
      0,
      -hp("2%"),
      deviceInfo.deviceType === DeviceType.PHONE ? -hp("9%") : -hp("11%"),
    ],
    extrapolate: "clamp",
  });

  const quoteOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 4, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });
  const quoteTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 4, HEADER_SCROLL_DISTANCE],
    outputRange: [
      0,
      -(deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("6%")),
      -(deviceInfo.deviceType === DeviceType.PHONE ? wp("7%") : wp("10%")),
    ],
    extrapolate: "clamp",
  });
  const quantityTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 4],
    outputRange: [
      0,
      deviceInfo.deviceType === DeviceType.PHONE ? -wp("10%") : -wp("25%"),
    ],
    extrapolate: "clamp",
  });

  function onScrollEndSnapToEdge(event) {
    const offsety = event.nativeEvent.contentOffset.y;
    const y = offsety + (Platform.OS === "ios" ? HEADER_MAX_HEIGHT : 0);
    if (0 < y && y < HEADER_MAX_HEIGHT / 4) {
      if (flatList.current) {
        flatList.current
          .getNativeScrollRef()
          .scrollTo({ y: Platform.OS === "ios" ? -HEADER_MAX_HEIGHT : 0 });
      }
    } else if (HEADER_MAX_HEIGHT / 4 <= y && y < HEADER_MAX_HEIGHT) {
      if (flatList.current) {
        try {
          // flatList.current.scrollToIndex({
          //   index: 0,
          //   viewPosition: 0,
          //   viewOffset: actuatedNormalizeSize(HEADER_MAX_HEIGHT / 2.5),
          // });
          flatList.current.getNativeScrollRef().scrollTo({
            y: Platform.OS === "ios" ? 0 : 180,
          });
        } catch {
          // just to catch empty lists especially for iOS
        }
      }
    }
  }

  return (
    <View style={styles.fill}>
      <AnimatedFlatList
        {...FlatListProps}
        // style={styles.flatlist}
        ref={flatList}
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScrollEndDrag={onScrollEndSnapToEdge}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          refreshCallback && (
            <RefreshControl
              refreshing={refreshing}
              colors={[colors.primary, "gray"]} // used by Android
              tintColor={colors.primary} // used by iOS
              onRefresh={async () => {
                setRefreshing(true);
                // to double check if there is a callback for refreshing the list
                if (typeof refreshCallback !== undefined) {
                  await refreshCallback();
                }
                setTimeout(() => setRefreshing(false), 1000);
              }}
              // Android offset for RefreshControl
              progressViewOffset={HEADER_MAX_HEIGHT}
            />
          )
        }
        // iOS offset for RefreshControl
        contentInset={{
          top: HEADER_MAX_HEIGHT,
        }}
        contentOffset={{
          x: 0,
          y: Platform.select({ android: 0, ios: -HEADER_MAX_HEIGHT }),
        }}
        automaticallyAdjustContentInsets={false}
        ListEmptyComponent={<EmptyListComponent />}
        ListHeaderComponentStyle={styles.flatlistheader}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslate }] },
        ]}
      >
        <Animated.Image
          style={[
            styles.backgroundImage,
            {
              opacity: imageOpacity,
              transform: [
                { scale: imageScale },
                { translateY: imageTranslate },
              ],
            },
          ]}
          source={headerImageSource ?? BG5}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.quote,
          {
            opacity: quoteOpacity,
            transform: [{ translateY: quoteTranslate }],
          },
        ]}
      >
        {headerQuoteText && (
          <Text style={styles.quoteText}>{headerQuoteText}</Text>
        )}

        {/* Only if quantity of records are available */}
        {headerQuantityView && (
          <Animated.View
            style={[
              styles.quantity,
              {
                transform: [{ translateX: quantityTranslateX }],
              },
            ]}
          >
            {headerQuantityView()}
          </Animated.View>
        )}
      </Animated.View>
      <Animated.View
        style={[
          styles.bar,
          {
            transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
          },
        ]}
      >
        <Text style={styles.title}>{headerTitleText ?? "Header Title"}</Text>
      </Animated.View>
    </View>
  );
}

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    fill: {
      flex: 1,
    },
    content: {
      paddingTop: Platform.select({
        android: HEADER_MAX_HEIGHT,
        ios: 0,
      }),
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: "#000000",
      overflow: "hidden",
      height: HEADER_MAX_HEIGHT,
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
    },
    backgroundImage: {
      position: "absolute",
      top: -30,
      left: 0,
      right: 0,
      width: null,
      height: HEADER_MAX_HEIGHT + 30,
      resizeMode: "cover",
    },
    bar: {
      //flex: 1,
      flexDirection: "row",
      marginTop: hp("10%"),
      textAlign: "center",
      //height: hp("18%"),
      // alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    },
    quote: {
      backgroundColor: "transparent",
      zIndex: 2,
      //marginTop: getScreenHeightPercentage("20%"),
      marginTop: hp("18%"),
      //marginHorizontal: actuatedNormalizeSize(14),
      marginHorizontal: wp("4.5%"),
      // alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    },
    quoteText: {
      color: "white",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("3%"),
    },
    title: {
      color: "white",

      fontWeight: "bold",
      marginHorizontal: wp("4.5%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("8%") : wp("5%"),
      //fontSize: actuatedNormalizeFontSize(36),
    },
    quantity: {
      color: "white",
      textAlign: "left",
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("8%") : wp("5%"),
    },
    flatlistheader: {
      marginTop: hp("2%"),
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
