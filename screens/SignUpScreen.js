import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import {
  BackButton,
  Loader,
  PrimaryButton,
  ErrorMessage,
  ErrorDialog,
} from "@components";
import { TextInput, Text, useTheme } from "react-native-paper";
import { AuthContext } from "@config/ContextHelper";
import { getNetworkStatus } from "@utilities/helpers";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import useLoading from "@utilities/customhooks/useLoading";
import { useNavigation } from "@react-navigation/core";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SignUpScreen = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
    comfirm_password: "",
  });
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();
  const navigation = useNavigation();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [networkDialogVisible, toggleNetworkDialog] = useToggleDialog();

  const {
    authContext: { signUp },
  } = useContext(AuthContext);

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
  const handleConfirmPasswordChange = (val) => {
    setData({
      ...data,
      comfirm_password: val,
    });
  };
  const handleError = () => {
    setError(true);
    Keyboard.dismiss();
  };
  const handleSignUp = async (data) => {
    setError(false);

    const networkStatus = getNetworkStatus();

    // First check for any network before any checks
    if (!networkStatus) {
      toggleNetworkDialog();
      return;
    }

    try {
      // checks if the username is empty and has whitespaces
      if (!data.username || data.username.indexOf(" ") >= 0) {
        throw Error("User cannot be empty and must be without spaces.");
      }

      // checks if the username is valid email
      if (data.username && !validateEmail(data.username)) {
        throw Error("Email address is not valid.");
      }

      // Checks if the passwords both available
      if (!data.password || !data.comfirm_password) {
        throw Error("Both passwords must not be blank");
      }

      // Checks if the passwords both have correct length of between 8 and 128
      if (
        data.password.length < 8 ||
        data.password.length > 128 ||
        data.comfirm_password.length < 8 ||
        data.comfirm_password.length > 128
      ) {
        throw Error("Password should be between 8 to 128 characters");
      }

      // Checks if the passwords are not the same
      if (data.password !== data.comfirm_password) {
        throw Error("The passwords do not match.");
      }

      if (data.password && data.comfirm_password && data.username) {
        const result = await signUp(data.username.trim(), data.password.trim());
        if (result?.error) {
          throw Error(result?.message);
        }
        // Sign up is successful
        return;
      }
    } catch (error) {
      setErrorMessage(error?.message);
      handleError();
    }
  };

  const [performSignUp, loading] = useLoading(handleSignUp);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <View style={styles.panel}>
        <Text style={styles.text}> Sign Up </Text>
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
        <TextInput
          label="Confirm Password"
          style={styles.textinput}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(val) => handleConfirmPasswordChange(val)}
        />
      </View>
      <PrimaryButton
        title="Sign up"
        tfontSize={
          deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%")
        }
        onPress={() => {
          performSignUp(data);
        }}
      />
      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={styles.forgot_password}> Already have an account ? </Text>
      </TouchableOpacity>
      {error && <ErrorMessage message={errorMessage} />}
      <ErrorDialog
        visible={networkDialogVisible}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={toggleNetworkDialog}
        onPress={toggleNetworkDialog}
      />
      <Loader visible={loading} />
      <View style={styles.privacyContainer}>
        <Text
          style={styles.privacyText}
          onPress={() => navigation.navigate("PrivacyPolicy")}
        >
          Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
};

function StyleProvider() {
  const { colors } = useTheme();
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
    forgot_password: {
      color: "#AAAAAA",
      paddingTop: hp("5%"),
      textDecorationLine: "underline",
    },
    privacyContainer: {
      justifyContent: "flex-end",
      alignItems: "center",
      flex: 1,
      marginBottom: hp("5.5%"),
    },
    privacyText: {
      color: colors.primary,
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
      textDecorationLine: "underline",
    },
  });
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export default SignUpScreen;
