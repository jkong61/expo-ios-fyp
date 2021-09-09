import React, { useState, useContext, useReducer, useCallback } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import {
  MenuButton,
  PrimaryButton,
  Loader,
  ErrorMessage,
  ErrorDialog,
} from "@components";
import { TextInput, Text } from "react-native-paper";
import { AuthContext } from "@config/ContextHelper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getNetworkStatus } from "@utilities/helpers";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useLoading from "@utilities/customhooks/useLoading";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";

const initialdata = {
  oldpassword: "",
  newpassword: "",
};

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [error, setError] = useState(false);
  const {
    authState,
    authContext: { changePassword },
  } = useContext(AuthContext);
  const [passwords, passwordDispatch] = useReducer(reducer, initialdata);
  const [errorMessage, setErrorMessage] = useState(
    "Invalid Password. Please try again."
  );
  const [networkErrorVisible, toggleNetworkErrorVisible] = useToggleDialog();
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();

  const handleOldPasswordChange = (val) => {
    passwordDispatch({
      type: "changeOld",
      payload: val,
    });
  };

  const handleNewPasswordChange = (val) => {
    passwordDispatch({
      type: "changeNew",
      payload: val,
    });
  };

  const handleError = (message) => {
    setError(true);
    setErrorMessage(message);
  };

  const passwordChange = async (passwords) => {
    setError(false);
    if (passwords.oldpassword === "" || passwords.newpassword === "") {
      handleError("One or both passwords are empty");
      return;
    }

    if (passwords.oldpassword === passwords.newpassword) {
      handleError("Passwords cannot be the same");
      return;
    }

    // Checks if the passwords both have correct length of between 8 and 128
    if (
      passwords.oldpassword.length < 8 ||
      passwords.oldpassword.length > 128 ||
      passwords.newpassword.length < 8 ||
      passwords.newpassword.length > 128
    ) {
      handleError("Password should be between 8 to 128 characters");
      return;
    }

    const networkStatus = await getNetworkStatus();
    if (networkStatus) {
      const res = await changePassword(passwords, authState.userToken);
      if (res.error) {
        handleError(res.message);
      } else {
        navigation.goBack();
      }
    } else {
      toggleNetworkErrorVisible();
    }
  };

  const [handlePasswordChange, passwordChangeLoading] = useLoading(passwordChange);

  useFocusEffect(
    useCallback(() => {
      // Reset the entire state of the screen
      setError(false);
      passwordDispatch({ type: "reset" });
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <MenuButton />
      <Text style={styles.title}>Change Password</Text>
      <View style={styles.panel}>
        <TextInput
          label="Current Password"
          style={styles.textinput}
          secureTextEntry={true}
          autoCapitalize="none"
          value={passwords.oldpassword}
          onChangeText={(val) => handleOldPasswordChange(val)}
        />
        <TextInput
          label="New Password"
          style={styles.textinput}
          secureTextEntry={true}
          autoCapitalize="none"
          value={passwords.newpassword}
          onChangeText={(val) => handleNewPasswordChange(val)}
        />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <PrimaryButton
          title="Change Password"
          onPress={async () => {
            setError(false);
            handlePasswordChange(passwords);
          }}
        />
      </View>
      {error && <ErrorMessage message={errorMessage} />}
      {/* Network Dialog */}
      <ErrorDialog
        visible={networkErrorVisible}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={toggleNetworkErrorVisible}
        onPress={toggleNetworkErrorVisible}
      />
      <Loader visible={passwordChangeLoading} />
    </View>
  );
};

function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      marginTop: hp("4%"),
      marginBottom: hp("2%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
      alignSelf: "center",
    },
    panel: {
      marginTop: hp("3%"),
      paddingHorizontal: wp("4%"),
      justifyContent: "center",
    },
    textinput: {
      marginBottom: hp("2%"),
      backgroundColor: "transparent",
    },
  });
}

function reducer(state, action) {
  switch (action.type) {
    case "changeOld":
      return {
        ...state,
        oldpassword: action.payload,
      };
    case "changeNew":
      return {
        ...state,
        newpassword: action.payload,
      };
    case "reset":
      return initialdata;
    default:
      return state;
  }
}

export default ChangePasswordScreen;
