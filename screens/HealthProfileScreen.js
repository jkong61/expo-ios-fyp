import React, { useContext, useReducer, useState, useCallback } from "react";
import { useTheme, Text, Avatar, Modal } from "react-native-paper";
import {
  PrimaryButton,
  Loader,
  MyContainer,
  ErrorDialog,
  MenuButton,
  RowWrapper as MyRowWrapper,
  TouchableSectionItem,
  TwoSelections,
} from "@components";
import {
  useInputModalProvider,
  ModalActionsConstants,
  ModalDataCheckConstants,
} from "@components/InputModalProvider";
import * as helpers from "@utilities/helpers";
import { View, StyleSheet, Platform } from "react-native";
import {
  useHealthProvider,
  HealthProviderDispatchMethodConstants,
  defaultHealthState,
} from "@config/HealthProvider";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import { AuthContext } from "@config/ContextHelper";
import {
  useUserProvider,
  UserDetailsProviderDispatchMethodConstants,
} from "@config/UserDetailsProvider";
import HttpHelper from "@http/HttpHelper";
import { AVATAR, AVATAR2 } from "@assets";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { EthnicityText } from "@config/EthnicityConstants";
import useLoading from "@utilities/customhooks/useLoading";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const RowWrapper = (props) => (
  <MyRowWrapper
    style={{
      ...props.style,
      paddingVertical: hp("1%"),
      justifyContent: "space-between",
    }}
  >
    {props.children}
  </MyRowWrapper>
);

const LocalContainer = (props) => (
  <MyContainer style={{ alignItems: "flex-start", marginVertical: hp("1%") }}>
    {props.children}
  </MyContainer>
);

const TouchableContainer = (props) => {
  const { colors } = useTheme();
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();

  return (
    <TouchableOpacity style={{ width: "100%" }} onPress={props.onPress ?? null}>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: "5%",
          alignItems: "center",
        }}
      >
        <AntDesign
          name={
            props.index == props.currentState ? "checkcircle" : "checkcircleo"
          }
          size={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("4%")
          }
          color={props.index == props.currentState ? colors.primary : "grey"}
          style={{ marginRight: wp("10%") }}
        />
        <Text style={styles.titleText}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Primary Screen Code
export default function HealthProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const passedData = route.params;
  const [initial, setInitial] = useState(!!passedData?.initial);
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const [healthState, healthDispatch] = useHealthProvider();
  const [localHealthstate, localdispatch] = useReducer(
    healthReducer,
    healthState.profile ?? defaultHealthState.profile
  );
  const [userDetails, userDispatch] = useUserProvider();
  const [localUserDetails, localuserdispatch] = useReducer(
    userReducer,
    userDetails
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalDispatch] = useInputModalProvider();
  const [networkError, setNetworkError] = useState(false);
  const { colors } = useTheme();
  const styles = StyleProvider();
  const { deviceInfo } = useDeviceInfoProvider();

  // For generic modal
  const toggleModal = (
    title,
    dispatchCase,
    callback,
    value,
    inputtype,
    checktype = undefined
  ) =>
    modalDispatch({
      type: ModalActionsConstants.TOGGLE,
      payload: title,
      value: value,
      callback: callback,
      case: dispatchCase,
      inputtype: inputtype,
      checktype: checktype,
    });

  // For Ethnicity Modal
  const toggleEthnicityModal = () => {
    setModalVisible(!isModalVisible);
  };

  const createProfile = async (data) => {
    if (data.height && data.date_of_birth) {
      const returneddata = await HttpHelper.Post.CreateHealthProfile(
        data,
        authState.userToken
      );
      if (returneddata) {
        healthDispatch({
          type: HealthProviderDispatchMethodConstants.CREATEPROFILE,
          payload: returneddata,
        });
      }
    }
    return;
  };

  const saveUpdateProfile = async (data) => {
    const returneddata = await HttpHelper.Put.UpdateHealthProfile(
      authState.userToken,
      data
    );
    healthDispatch({
      type: HealthProviderDispatchMethodConstants.SAVEHEALTHPROFILE,
      payload: returneddata,
    });
  };

  const updateUserDetails = async (data) => {
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
    return;
  };

  async function handleButtonPress() {
    const networkStatus = helpers.getNetworkStatus();
    if (networkStatus) {
      if (initial) {
        await createProfile(localHealthstate);
      } else {
        await saveUpdateProfile(localHealthstate);
      }
      await updateUserDetails(localUserDetails);
    } else {
      setNetworkError(true);
    }
  }

  const [buttonPress, loading] = useLoading(handleButtonPress);

  useFocusEffect(
    useCallback(() => {
      if(!healthState.profile){
        setInitial(true);
      }
      localdispatch({
        type: "setState",
        payload: healthState.profile ?? localHealthstate,
      });
      return () => {};
    }, [healthState])
  );

  return (
    <View style={styles.container}>
      <MenuButton />
      <Text style={styles.title}>Profile</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollview}
      >
        <Avatar.Image
          source={localHealthstate.gender == "Female" ? AVATAR : AVATAR2}
          size={
            deviceInfo.deviceType === DeviceType.PHONE ? wp("24%") : wp("18%")
          }
          style={{ marginBottom: hp("3%") }}
        />
        <LocalContainer>
          {/* For name */}
          <TouchableSectionItem
            title="Name"
            touchable={true}
            value={helpers.stringIsNotEmpty(localUserDetails.name) ?? "Name ?"}
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
            value={
              helpers.stringIsNotEmpty(localUserDetails.contact_information) ??
              "Contact Info ?"
            }
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

        <LocalContainer>
          <RowWrapper>
            <Text style={styles.titleText}>Gender : </Text>
            <TwoSelections
              title="Gender : "
              choice={localHealthstate.gender}
              deviceInfo={deviceInfo?.deviceType}
              select1="Male"
              select2="Female"
              press1={() =>
                localdispatch({ type: "changeGender", payload: "Male" })
              }
              press2={() =>
                localdispatch({ type: "changeGender", payload: "Female" })
              }
            />
          </RowWrapper>
        </LocalContainer>

        <LocalContainer>
          {/* Date of Birth */}
          <TouchableSectionItem
            title="Date of Birth"
            touchable={true}
            value={localHealthstate.date_of_birth ?? "Date of Birth"}
            onPress={() =>
              toggleModal(
                "D.O.B (YYYY-MM-DD)",
                "changeDOB",
                localdispatch,
                localHealthstate.date_of_birth,
                Platform.OS === "ios"
                  ? "numbers-and-punctuation"
                  : "number-pad",
                ModalDataCheckConstants.DATE
              )
            }
          />

          {/* Ethnicity */}
          <TouchableSectionItem
            title="Ethnicity"
            touchable={true}
            value={
              !isNaN(localHealthstate.ethnicity)
                ? EthnicityText[localHealthstate.ethnicity]
                : "Ethnicity?"
            }
            onPress={toggleEthnicityModal}
          />

          {/* Height */}
          <TouchableSectionItem
            title="Height (cm)"
            touchable={true}
            value={
              localHealthstate?.height
                ? `${localHealthstate?.height.toString()} cm`
                : " Height ?"
            }
            onPress={() =>
              toggleModal(
                "Height (cm)",
                "changeHeight",
                localdispatch,
                localHealthstate?.height?.toString(),
                "numeric"
              )
            }
          />
        </LocalContainer>
        <LocalContainer>
          <Text style={styles.titleText}>Blood Condition : </Text>
          <RowWrapper>
            <Text style={styles.overflowText}>
              High Blood Glucose History? :{" "}
            </Text>
            <TwoSelections
              choice={localHealthstate.high_blood_glucose_history}
              deviceInfo={deviceInfo?.deviceType}
              select1={false}
              select2={true}
              press1={() =>
                localdispatch({ type: "changeHGP", payload: false })
              }
              press2={() => localdispatch({ type: "changeHGP", payload: true })}
            />
          </RowWrapper>

          <RowWrapper>
            <Text style={styles.overflowText}>
              High Blood Pressure History? :{" "}
            </Text>
            <TwoSelections
              choice={localHealthstate.high_blood_pressure_medication_history}
              deviceInfo={deviceInfo?.deviceType}
              select1={false}
              select2={true}
              press1={() =>
                localdispatch({ type: "changeHBP", payload: false })
              }
              press2={() => localdispatch({ type: "changeHBP", payload: true })}
            />
          </RowWrapper>
        </LocalContainer>

        <LocalContainer
          style={{
            ...styles.box,
            backgroundColor: colors.card,
            padding: 10,
            borderRadius: 20,
            marginBottom: 20,
          }}
        >
          <Text style={styles.titleText}>Relatives with Diabetes : </Text>

          <RowWrapper>
            <Text style={styles.overflowText}>
              Grandparents, Aunt, First Cousin:{" "}
            </Text>
            <TwoSelections
              choice={localHealthstate.family_history_diabetes_non_immediate}
              deviceInfo={deviceInfo?.deviceType}
              select1={false}
              select2={true}
              press1={() => {
                localdispatch({ type: "changeRelatives", payload: false });
              }}
              press2={() => {
                localdispatch({ type: "changeRelatives", payload: true });
              }}
            />
          </RowWrapper>

          <RowWrapper>
            <Text style={styles.overflowText}>Parents: </Text>
            <TwoSelections
              choice={localHealthstate.family_history_diabetes_parents}
              deviceInfo={deviceInfo?.deviceType}
              select1={false}
              select2={true}
              press1={() => {
                localdispatch({ type: "changeParents", payload: false });
              }}
              press2={() => {
                localdispatch({ type: "changeParents", payload: true });
              }}
            />
          </RowWrapper>

          <RowWrapper>
            <Text style={styles.overflowText}>Siblings: </Text>
            <TwoSelections
              choice={localHealthstate.family_history_diabetes_siblings}
              deviceInfo={deviceInfo?.deviceType}
              select1={false}
              select2={true}
              press1={() => {
                localdispatch({ type: "changeSiblings", payload: false });
              }}
              press2={() => {
                localdispatch({ type: "changeSiblings", payload: true });
              }}
            />
          </RowWrapper>

          <RowWrapper>
            <Text style={styles.overflowText}>Children: </Text>
            <TwoSelections
              choice={localHealthstate.family_history_diabetes_children}
              deviceInfo={deviceInfo?.deviceType}
              select1={false}
              select2={true}
              press1={() => {
                localdispatch({ type: "changeChildren", payload: false });
              }}
              press2={() => {
                localdispatch({ type: "changeChildren", payload: true });
              }}
            />
          </RowWrapper>
        </LocalContainer>
        {/* Save button */}
        <PrimaryButton
          style={{ marginTop: hp("1.5%") }}
          title={initial ? "Create Profile" : "Save Profile"}
          onPress={buttonPress}
        />
      </ScrollView>

      {/* Ethnicity Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onDismiss={toggleEthnicityModal}
      >
        <MyContainer
          style={{
            marginHorizontal: wp("4.5%"),
            width: "auto",
          }}
        >
          <RowWrapper
            style={{
              justifyContent: "space-between",
              paddingVertical: 0,
              marginBottom: hp("3%"),
            }}
          >
            <Text
              style={{
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4.5%")
                    : wp("3%"),
                fontWeight: "bold",
              }}
            >
              Choose Enthicity
            </Text>
            <TouchableOpacity onPress={toggleEthnicityModal}>
              <AntDesign
                name="closesquare"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("8%")
                    : wp("5%")
                }
                color={colors.error}
              />
            </TouchableOpacity>
          </RowWrapper>

          {/* Custom list of all ethnicity */}
          <View>
            {Object.entries(EthnicityText).map(([key, value]) => (
              <TouchableContainer
                text={value}
                key={key}
                index={key}
                currentState={localHealthstate.ethnicity}
                onPress={() => {
                  localdispatch({
                    type: "changeEthnicity",
                    payload: parseInt(key),
                  });
                  toggleEthnicityModal();
                }}
              />
            ))}
          </View>
        </MyContainer>
      </Modal>

      {/* Network Dialog */}
      <ErrorDialog
        visible={networkError}
        title="Network Error"
        content="Internet Connection is required."
        onDismiss={() => setNetworkError(false)}
        onPress={() => setNetworkError(false)}
      />

      <Loader visible={loading} />
    </View>
  );
}

// Page Stylesheet
function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
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
    titleText: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
    },
    overflowText: {
      width: "60%",
    },
  });
}

function healthReducer(localHealthstate, action) {
  switch (action.type) {
    case "changeGender":
      return { ...localHealthstate, gender: action.payload };
    case "changeDOB":
      return { ...localHealthstate, date_of_birth: action.payload };
    case "changeHeight":
      return {
        ...localHealthstate,
        height: parseFloat(action.payload).toFixed(2),
      };
    case "changeHBP":
      return {
        ...localHealthstate,
        high_blood_pressure_medication_history: action.payload,
      };
    case "changeHGP":
      return {
        ...localHealthstate,
        high_blood_glucose_history: action.payload,
      };
    case "changeEthnicity":
      return { ...localHealthstate, ethnicity: action.payload };
    case "changeRelatives":
      return {
        ...localHealthstate,
        family_history_diabetes_non_immediate: action.payload,
      };
    case "changeParents":
      return {
        ...localHealthstate,
        family_history_diabetes_parents: action.payload,
      };
    case "changeChildren":
      return {
        ...localHealthstate,
        family_history_diabetes_children: action.payload,
      };
    case "changeSiblings":
      return {
        ...localHealthstate,
        family_history_diabetes_siblings: action.payload,
      };
    case "setState":
      return { ...localHealthstate, ...action.payload };
    default:
      return localHealthstate;
  }
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
