import React from "react";
import { StyleSheet, Text, View, Image, Animated } from "react-native";
import Logo from "@assets/splash_icon.png";

const SplashScreen = () => {
  const [LogoAnime] = React.useState(new Animated.Value(0));
  const [LogoText] = React.useState(new Animated.Value(0));
  //const [loadingSpinner, setLoadingSpinner] = React.useState(false);

  Animated.parallel([
    Animated.spring(LogoAnime, {
      toValue: 1,
      tension: 10,
      friction: 2,
      duration: 1000,
      useNativeDriver: false,
    }),
    Animated.timing(LogoText, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start(),
  ]).start();

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: LogoAnime,
          top: LogoAnime.interpolate({
            inputRange: [0, 1],
            outputRange: [80, 0],
          }),
        }}
      >
        <Image source={Logo} />
      </Animated.View>
      <Animated.View style={{ opacity: LogoText }}>
        <Text style={styles.text}>HealthApp</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    top: 60,
    padding: 30,
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "bold",
  },
});

export default SplashScreen;
