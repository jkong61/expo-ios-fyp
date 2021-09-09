import React, { useState, useContext } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import {
  BackButton,
  PrimaryButton,
  Loader,
  ErrorMessage,
  ErrorDialog,
} from "@components";
import { TextInput, Text } from "react-native-paper";
import { AuthContext } from "@config/ContextHelper";
import { getNetworkStatus, stringIsNotEmpty } from "@utilities/helpers";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import useLoading from "@utilities/customhooks/useLoading";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const LoginScreen = () => {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [networkDialogVisible, toggleNetworkDialog] = useToggleDialog();
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const { authContext } = useContext(AuthContext);
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();

  const handleUsernameChange = (val) => {
    setData({
      ...data,
      username: val,
    });
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  const handleLogin = async (username, password) => {
    setError(false);
    if (!getNetworkStatus()) {
      toggleNetworkDialog();
      return;
    }

    // Checks if the user or password is empty
    if (!stringIsNotEmpty(username) || !stringIsNotEmpty(password)) {
      setErrorMessage("Username or Password cannot be empty.");
      setError(true);
      return;
    }

    const result = await authContext.signIn(username, password);
    if (result?.error) {
      // Error signing in into service, i.e. wrong password or username
      setErrorMessage(result.message);
      setError(true);
      return;
    }

    // Login should be successful at this point.
    return;
  };

  const [performLogin, loading] = useLoading(handleLogin);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <View style={styles.panel}>
        <Text style={styles.text}> Login </Text>
        <TextInput
          label="Email"
          style={styles.textinput}
          placeholder="user@example.com"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(val) => handleUsernameChange(val)}
        />
        <TextInput
          label="Password"
          style={styles.textinput}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(val) => handlePasswordChange(val)}
        />
      </View>
      <PrimaryButton
        title="Login"
        onPress={async () => await performLogin(data.username, data.password)}
        tfontSize={
          deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%")
        }
      />
      {error && <ErrorMessage message={errorMessage} />}

      <ErrorDialog
        visible={networkDialogVisible}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={toggleNetworkDialog}
        onPress={toggleNetworkDialog}
      />

      <Loader visible={loading} />
    </SafeAreaView>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
    },
    text: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("10%") : wp("6%"),
      fontWeight: "600",
      marginBottom: hp("6%"),
    },
    panel: {
      top: hp("9%"),
      width: wp("80%"),
      marginBottom: hp("10%"),
    },
    textinput: {
      marginBottom: hp("2.5%"),
      backgroundColor: "transparent",
    },
  });
}

export default LoginScreen;
