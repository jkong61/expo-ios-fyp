import React, { useState, useEffect } from "react";
import AppLoading from "expo-app-loading";
import MainApplication from "./main/MainApplication";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

const App = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      await Camera.requestPermissionsAsync(); // ask for camera permission
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // ask for gallery permission
      if (status === "granted") {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    })();
  }, []);

  //this is prevent the splashscreen start before the user allow or deny the permissions
  if (hasPermission == null) {
    return <AppLoading />;
  }

  //return the main app
  return <MainApplication />;
};

export default App;
