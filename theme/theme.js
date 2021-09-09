import {
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from "react-native-paper";
import {
  DefaultTheme as NavigatorDefaultTheme,
  DarkTheme as NavigatorDarkTheme,
} from "@react-navigation/native";

const DarkTheme = {
  ...PaperDarkTheme,
  ...NavigatorDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigatorDarkTheme.colors,
    accent: "#6C63FF",
    background: "#181C27",
    card: "#232838",
    loaderback: "rgba(23, 27, 38, 0.9)",
    primary: "#6C63FF",
    surface: "#232838",
    text: "#FFFFFF",
    subtext: "#939393",
    divider: "#AAAAAA",
    error: "#F56182",
  },
  statusbar: "light-content",
  roundness: 15,
};

const DefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigatorDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigatorDefaultTheme.colors,
    accent: "#6C63FF",
    background: "#F5F7F9",
    loaderback: "rgba(23, 27, 38, 0.9)",
    primary: "#6C63FF",
    text: "#000000",
    subtext: "#939393",
    divider: "#AAAAAA",
    error: "#F56182",
  },
  statusbar: "dark-content",
  roundness: 15,
};

const GetTheme = (mode) => {
  switch (mode) {
    case false:
      return DefaultTheme;
    case true:
      return DarkTheme;
    default:
      return DefaultTheme;
  }
};

export default GetTheme;
