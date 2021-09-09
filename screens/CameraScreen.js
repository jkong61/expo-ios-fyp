import React, { useEffect } from "react";
import { StyleSheet, Alert, View, TouchableOpacity } from "react-native";
import CloseButton from "../components/CloseButton";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";

const CameraScreen = () => {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = React.useState(null); //state for camera permission
  const cameraRef = React.useRef(); //reference for camera ref
  const [isClicked, setIsClicked] = React.useState(false);

  //this function is used for check & ask the camera permission
  async function checkCameraPermission() {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") 
      setHasPermission(true);
    else 
      setHasPermission(false);
  }

  //this function is used for take picture from camera
  const takePicture = async () => {
    //ensure the camera is ready
    if (cameraRef.current) {
      // setup the options for take picture
      //quality -> 0 - 1 (higher value higher quality)
      //base64 -> true/false (image data in base64 format)
      //skipProcessing -> true/false (only for android phone, it can make process and preview the image faster, but quality option is discarded)
      const options = { quality: 0.2, base64: true, skipProcessing: true };

      //get the image object from the camera
      const data = await cameraRef.current.takePictureAsync(options);

      //only extract uri in the image object(data)
      const base64source = `data:image/jpg;base64,${data.base64}`;

      //make sure uri (source) is not null or empty
      if (base64source) {
        //pass uri back to the previous stack screen.
        navigation.navigate("AddMeal", { Source: base64source });
      }
    }
  };

  useEffect(() => {
    //call the function to check the camera permission
    checkCameraPermission();
  }, []);

  //if permission is null return nothing
  if (hasPermission == null) return <></>;

  return (
    <View style={styles.container}>
      {/* Creates a faux full screen for Camera preview */}
      {console.log("camere screen")}
      <CloseButton />
      {hasPermission ? (
        <Camera
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
          autoFocus={Camera.Constants.AutoFocus.on}
          ref={cameraRef}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                bottom: 20,
                alignSelf: "flex-end",
                backgroundColor: "#fff",
                padding: 40,
                height: 50,
                width: 50,
                borderRadius: 60,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.8,
              }}
              disabled={isClicked}
              onPress={() => {
                setIsClicked(!isClicked);
                takePicture();
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  height: 60,
                  width: 60,
                  borderWidth: 3,
                  borderColor: "#555555",
                  borderRadius: 60,
                  opacity: 0.8,
                }}
              ></View>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        Alert.alert(
          "Alert",
          "😢Sorry, we need camera roll permissions to make this work!",
          [{ text: "Ok", onPress: () => navigation.pop() }],
          { cancelable: false }
        )
        //<Text>Hello</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 50,
  },
});

export default CameraScreen;
