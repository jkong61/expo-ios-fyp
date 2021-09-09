import React, { useContext, useReducer, useState } from "react";
import { Text, Avatar } from "react-native-paper";
import {
  PrimaryButton,
  Loader,
  MyContainer,
  MenuButton,
  ErrorDialog,
  TouchableSectionItem,
} from "@components";
import * as helpers from "@utilities/helpers";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "@config/ContextHelper";
import {
  useUserProvider,
  UserDetailsProviderDispatchMethodConstants,
} from "@config/UserDetailsProvider";
import { useInputModalProvider } from "@components/InputModalProvider";
import HttpHelper from "@http/HttpHelper";
import { AVATAR, AVATAR2 } from "@assets";
import { ScrollView } from "react-native-gesture-handler";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const LocalContainer = (props) => (
  <MyContainer style={{ alignItems: "flex-start", marginVertical: hp("1%") }}>
    {props.children}
  </MyContainer>
);

// Primary Screen Code
const ClinicianProfileScreen = () => {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const [userDetails, userDispatch] = useUserProvider();
  const [localUserDetails, localuserdispatch] = useReducer(
    userReducer,
    userDetails
  );
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [modalDispatch] = useInputModalProvider();
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();

  const localHealthstate = undefined;

  // For generic modal
  const toggleModal = (title, dispatchCase, callback, value, inputtype) =>
    modalDispatch({
      type: "toggleModal",
      payload: title,
      value: value,
      callback: callback,
      case: dispatchCase,
      inputtype: inputtype,
    });

  const updateUserDetails = async (data) => {
    const networkStatus = await helpers.getNetworkStatus();
    if (!networkStatus) {
      setDialogVisible(true);
      return;
    }

    setLoading(true);
    const returneddata = await HttpHelper.Put.UpdateUserMe(
      authState.userToken,
      data
    );
    if (returneddata) {
      userDispatch({
        type: UserDetailsProviderDispatchMethodConstants.SAVECURRENTUSER,
        payload: returneddata,
      });
      navigation.goBack();
    }
    setLoading(false);
    return;
  };

  return (
    <View style={styles.container}>
      <MenuButton />
      <Text style={styles.title}>Clinician Profile</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollview}
      >
        <Avatar.Image
          source={localHealthstate?.gender == "Female" ? AVATAR : AVATAR2}
          size={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("24%") : wp("18%")
          }
          style={styles.image}
        />
        <LocalContainer>
          {/* For name */}
          <TouchableSectionItem
            title="Name"
            touchable={true}
            value={localUserDetails.name ?? "Name ?"}
            onPress={() =>
              toggleModal(
                "Name",
                "changeName",
                localuserdispatch,
                localUserDetails.name,
                "default"
              )
            }
          />

          {/* Contact information */}
          <TouchableSectionItem
            title="Contact Info"
            touchable={true}
            value={localUserDetails.contact_information ?? "Contact Info ?"}
            onPress={() =>
              toggleModal(
                "Contact Info",
                "changeContact",
                localuserdispatch,
                localUserDetails.contact_information,
                "phone-pad"
              )
            }
          />
        </LocalContainer>

        {/* Save button */}
        <PrimaryButton
          style={{ marginTop: hp("1.5%") }}
          title={"Save Profile"}
          onPress={async () => {
            await updateUserDetails(localUserDetails);
          }}
        />
      </ScrollView>

      {/* Network Dialog */}
      <ErrorDialog
        visible={dialogVisible}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={() => setDialogVisible(false)}
        onPress={() => setDialogVisible(false)}
      />

      {/* Modal Start */}
      <Loader visible={isLoading} />
    </View>
  );
};

// Page Stylesheet
function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    image: {
      marginBottom: hp("3%"),
      zIndex: 1,
    },
    scrollview: {
      height: "auto",
      paddingVertical: hp("2%"),
      paddingHorizontal: wp("4%"),
      alignItems: "center",
    },
    title: {
      marginTop: hp("4%"),
      marginBottom: hp("2%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
      alignSelf: "center",
    },
  });
}

function userReducer(state, action) {
  switch (action.type) {
    case "changeName":
      return {
        ...state,
        name: action.payload,
      };
    case "changeContact":
      return {
        ...state,
        contact_information: action.payload,
      };
    default:
      return state;
  }
}

export default ClinicianProfileScreen;
