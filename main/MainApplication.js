import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, Text } from "react-native-paper";
import AuthNavigator from "@navigation/AuthNavigator";
import CoreDrawerNavigator from "@navigation/CoreDrawerNavigator";
import { StatusBar, View, Modal, Platform } from "react-native";
import { AuthContext } from "@config/ContextHelper";
import DataProviders from "@config/DataProviders";
import {
  SignInAction,
  SignOutAction,
  RetrieveTokenAction,
} from "../state_manager/Action";
import HttpRequest from "@http/HttpHelper";
import {
  removeData,
  getData,
  setData,
} from "@async_storage/AsyncStorageHelper";
import AuthReducer from "../state_manager/AuthReducer";
import SplashScreen from "@screens/SplashScreen";
import GetTheme from "../theme/theme";
import { MyContainer, SecondaryButton } from "@components";
import { navigationRef } from "@navigation/RootNavigation";
import { FoodProvider } from "@config/FoodProvider";
import { NotificationProvider } from "@config/NotificationProvider";
import { DeviceInfoProvider } from "@config/DeviceInfoProvider";
import { AppStateHandler } from "@config/AppStateHandler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";

const MainApplication = () => {
  //theme state
  const [darkTheme, setTheme] = useState(false);

  //blood glucose reminder
  const [bloodGlucoseReminder, setBloodGlucoseReminder] = useState(true);

  //health record reminder
  const [healthRecordReminder, setHealthRecordReminder] = useState({
    flag: true,
    schedule: "Monthly",
  });

  //auth reducer
  const [authState, dispatch] = AuthReducer();

  // const [visible, setVisible] = useState(false);
  const [signOutVisible, toggleSignoutVisible] = useToggleDialog();

  //for auth context
  const authContext = React.useMemo(
    () => ({
      signIn: async (username, password) => {
        const res = await HttpRequest.Post.Login(username, password);
        if (!res?.error && res?.data.access_token) {
          const token = res.data.access_token;
          setData("userToken", token);
          dispatch(SignInAction(token));
          return token;
        }
        return res;
      },
      signOut: () => {
        toggleSignoutVisible();
      },
      signUp: async (email, password) => {
        const res = await HttpRequest.Post.SignUp(email, password);
        if (!res?.error) {
          // if there is no error, proceed with sign in
          const token = await authContext.signIn(email, password);
          return token;
        }
        return res;
      },
      changePassword: async (passwords, token) => {
        const res = await HttpRequest.Post.ChangePassword(passwords, token);
        if (!res?.error) {
          setData("userToken", res.data?.access_token);
          dispatch(RetrieveTokenAction(res.data?.access_token));
          return 1;
        } else {
          return res;
        }
      },
      changeTheme: (theme) => {
        setData("darkTheme", theme.toString()); // value in async storage must be string value.
        setTheme(theme);
      },
      changeBloodGlucoseReminder: (value) => {
        setData("bloodGlucoseReminder", value.toString());
        setBloodGlucoseReminder(value);
      },
      changeHealthRecordReminder: (value) => {
        setData("healthRecordReminder", JSON.stringify(value));
        setHealthRecordReminder(value);
      },
    }),
    []
  );

  const signOutOperation = async () => {
    //reset theme
    setData("darkTheme", false.toString());
    setTheme(false);

    //reset blood glucose reminder
    setData("bloodGlucoseReminder", true.toString());
    setBloodGlucoseReminder(true);

    //reset health record reminder
    setData(
      "healthRecordReminder",
      JSON.stringify({
        flag: true,
        schedule: "Monthly",
      })
    );
    setHealthRecordReminder({
      flag: true,
      schedule: "Monthly",
    });

    //remove token
    removeData("userToken");
    dispatch(SignOutAction());

    toggleSignoutVisible();
  };

  useEffect(() => {
    setTimeout(async () => {

      // Concurrently get all 3 data from async storage
      let [theme, reminder, healthreminder, token] = await Promise.all([
        getData("darkTheme"),
        getData("bloodGlucoseReminder"),
        getData("healthRecordReminder"),
        getData("userToken"),
      ]);

      //initialize app theme
      theme = theme === "true";
      setTheme(theme);

      //initialize blood glucose reminder
      if (reminder) {
        reminder = reminder === "true";
      } else {
        reminder = true;
      }
      setBloodGlucoseReminder(reminder);

      //initialize health record reminder
      if (healthreminder) {
        healthreminder = JSON.parse(healthreminder);
        setHealthRecordReminder(healthreminder);
      }

      //initialize user token
      try {
        // Perform a quick check here to see if the JWT is able to authenticate a user
        const response = await HttpRequest.Get.GetUserMe(token);
        if (response === null) {
          // JWT is invalid
          throw Error("Storage Token is invalid.");
        }
        dispatch(RetrieveTokenAction(token));
      } catch (error) {
        // Remove the token from storage and prevent the user from seeing normal page
        removeData("userToken");
        dispatch(SignOutAction());
        console.log(error.toString());
      }
    }, 1800);
  }, []);

  if (authState.isLoading) {
    return <SplashScreen />;
  }

  const mytheme = GetTheme(darkTheme);
  return (
    <Provider theme={mytheme}>
      <StatusBar
        barStyle={Platform.OS === "ios" ? mytheme.statusbar : "light-content"}
      />
      <FoodProvider>
        <DeviceInfoProvider>
          <AuthContext.Provider
            value={{
              authContext,
              authState,
              bloodGlucoseReminder,
              healthRecordReminder,
            }}
          >
            <DataProviders>
              <NavigationContainer theme={mytheme} ref={navigationRef}>
                <NotificationProvider>
                  <AppStateHandler>
                    {console.log("Render :", authState.userToken)}
                    {authState.userToken != null ? (
                      <CoreDrawerNavigator />
                    ) : (
                      <AuthNavigator />
                    )}
                  </AppStateHandler>
                </NotificationProvider>
              </NavigationContainer>
            </DataProviders>

            {signOutVisible && (
              <Modal
                visible={signOutVisible}
                transparent={true}
                animationType="fade"
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    backgroundColor: "rgba(23, 27, 38, 0.9)",
                  }}
                >
                  <MyContainer
                    style={{
                      marginHorizontal: wp("3%"),
                      width: "auto",
                    }}
                  >
                    <Text
                      style={{
                        marginTop: hp("2%"),
                        fontSize: wp("4%"),
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      Are you sure you want to sign out?
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <SecondaryButton
                        title="Cancel"
                        style={{
                          width: "auto",
                          marginVertical: 0,
                          marginHorizontal: wp("1%"),
                        }}
                        onPress={toggleSignoutVisible}
                      />
                      <SecondaryButton
                        title="Sign Out"
                        shadowColor="#F56182"
                        colors={["#F56182", "#F56182"]}
                        tColor={"#fff"}
                        style={{
                          width: "auto",
                          marginVertical: 0,
                          marginHorizontal: wp("1%"),
                        }}
                        onPress={signOutOperation}
                      />
                    </View>
                  </MyContainer>
                </View>
              </Modal>
            )}
          </AuthContext.Provider>
        </DeviceInfoProvider>
      </FoodProvider>
    </Provider>
  );
};

export default MainApplication;
