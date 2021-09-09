import React, { useState, useEffect, memo, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme, Searchbar, Title } from "react-native-paper";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as helpers from "@utilities/helpers";
import {
  RowWrapper,
  ColumnWrapper,
  BackButton,
  MyLinearGradient,
  PrimaryButton,
  AnimatedHeaderFlatList,
  ErrorDialog,
  MySearchBar,
} from "@components";
import fuzzysort from "fuzzysort";
import { BG5 } from "@assets";
import { useClinicianListProvider } from "@config/ClinicianListProvider";
import { AuthContext } from "@config/ContextHelper";
import { getNetworkStatus } from "@utilities/helpers";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import HttpRequest from "@http/HttpHelper";
import { useIsFocused } from "@react-navigation/native";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ClinicianScreen = ({ navigation }) => {
  const { colors } = useTheme(); // get the them colors
  const [searchText, setSearchText] = useState();
  const { authState } = useContext(AuthContext); // for get the user token purpose
  const [clinicianState, dispatch] = useClinicianListProvider();
  const [clinicianList, setClinicianList] = useState(clinicianState);
  const { deviceInfo } = useDeviceInfoProvider();
  const isFocused = useIsFocused();

  const [errorDialogVisible, toggleErrorDialogVisible] = useToggleDialog();
  const [errorDialogContent, setErrorDialogContent] = useState({
    title: "",
    content: "",
  });

  const quote =
    "“Make food a very incidental part of your life by filling your life so full of meaningful things that you’ll hardly have time to think about food.” ~ Peace Pilgrim";

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ClinicianDetail", { Clinician: item })
      }
    >
      <View
        key={item.user_id}
        style={{
          marginHorizontal: wp("4.5%"),
          backgroundColor: colors.surface,
          marginBottom: hp("1.5%"),
          borderRadius: 10,
        }}
      >
        <RowWrapper style={{ paddingVertical: 0, margin: 0 }}>
          <MyLinearGradient style={{ margin: wp("2%") }}>
            <MaterialCommunityIcons
              // eslint-disable-next-line react-native/no-inline-styles
              //style={{ padding: 10 }}
              name="doctor"
              size={
                deviceInfo.deviceType === DeviceType.PHONE
                  ? wp("16%")
                  : wp("10%")
              }
              color="white"
            />
          </MyLinearGradient>
          <ColumnWrapper
            style={{
              width: "auto",
              marginHorizontal: wp("4.5%"),
            }}
          >
            <Title
              style={{
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("5%")
                    : wp("3%"),
              }}
            >
              {item.name ?? helpers.getEmailUserName(item.email)}
            </Title>
            <RowWrapper style={{ paddingVertical: hp("0.5%") }}>
              <MaterialCommunityIcons
                name="email"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("6%")
                    : wp("3.5%")
                }
                color={colors.text}
              />
              <Text style={{ marginLeft: wp("2%") }}>{item.email}</Text>
            </RowWrapper>
            <RowWrapper style={{ paddingVertical: 0 }}>
              <MaterialCommunityIcons
                name="phone"
                size={
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("6%")
                    : wp("3.5%")
                }
                color={colors.text}
              />
              <Text style={{ marginLeft: wp("2%") }}>
                {item.contact_information ?? "N/A"}
              </Text>
            </RowWrapper>
          </ColumnWrapper>
          <MaterialCommunityIcons
            name="information"
            color={colors.primary}
            size={
              deviceInfo.deviceType === DeviceType.PHONE ? wp("9%") : wp("6%")
            }
            style={{ position: "absolute", right: 10 }}
          />
        </RowWrapper>
      </View>
    </TouchableOpacity>
  );

  const handleSearchKeyPress = (val) => {
    setSearchText(val);
    const result = fuzzysort
      .go(val, clinicianState, {
        key: "name",
      })
      .map((s) => s.obj);

    setClinicianList(result);
    if (val === "") {
      setClinicianList(clinicianState);
    }

    console.log(result);
  };

  function handleforDialog(title, message) {
    toggleErrorDialogVisible();
    setErrorDialogContent({
      title: title,
      content: message,
    });
  }

  async function getAllClinicianList() {
    if (!getNetworkStatus()) {
      handleforDialog("Network Error", "Internet Connection is required.");
      return;
    }

    let res = await HttpRequest.Get.GetClinicians(authState.userToken);
    if (res?.error) {
      handleforDialog("Server Error", res.message);
      return;
    }

    if (res.length > 0) {
      console.log("fetched clincians");
      dispatch({
        type: "getAllClinician",
        payload: res,
      });
      setClinicianList(res);
    }
  }

  useEffect(() => {
    if (isFocused) {
      getAllClinicianList();
    }
    return () => {};
  }, [isFocused]);

  return (
    <View style={{ height: "100%" }}>
      <BackButton color="#fff" />
      <AnimatedHeaderFlatList
        headerImageSource={BG5}
        headerQuoteText={quote}
        headerTitleText="Clinician List"
        data={clinicianList.slice(0, 5)}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id.toString()}
        refreshCallback={getAllClinicianList}
        ListHeaderComponent={
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingHorizontal: wp("4.5%"),
            }}
          >
            <PrimaryButton
              title="Assignment"
              tfontSize={
                deviceInfo.deviceType === DeviceType.PHONE ? wp("5%") : wp("3%")
              }
              style={{
                marginTop: 0,
                width:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("40%")
                    : wp("25%"),
                marginBottom: hp("3%"),
                alignSelf: "flex-end",
              }}
              onPress={() => navigation.navigate("Assignment")}
            />

            <Text
              style={{
                fontSize:
                  deviceInfo.deviceType === DeviceType.PHONE
                    ? wp("4.5%")
                    : wp("2.5%"),
                marginBottom: hp("3%"),
                fontWeight: "bold",
              }}
            >
              Plan to find a clinician?
            </Text>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              {/* <Searchbar
                placeholder="Search..."
                style={{ marginTop: 0 }}
                value={searchText}
                onChangeText={handleSearchKeyPress}
                clearIcon={() => (
                  <AntDesign
                    name="closecircle"
                    size={
                      deviceInfo.deviceType === DeviceType.PHONE
                        ? wp("5.5%")
                        : wp("3%")
                    }
                    color={colors.text}
                    onPress={() => {
                      setSearchText("");
                      setClinicianList(clinicianState);
                    }}
                  />
                )}
              />

              {searchText && searchText != "" ? (
                <Text
                  style={{
                    fontSize:
                      deviceInfo.deviceType === DeviceType.PHONE
                        ? wp("4.5%")
                        : wp("2.5%"),
                    marginVertical: hp("1.5%"),
                    color: colors.primary,
                  }}
                >
                  Total searched result: {clinicianList.length}
                </Text>
              ) : (
                <Text style={{ marginVertical: hp("1%") }}></Text>
              )} */}
              <MySearchBar
                collectionChanging={clinicianList}
                collectionOriginal={clinicianState}
                placeholder="Search Patient ID.."
                searchKey={handleSearchKeyPress}
                callback={setClinicianList}
              />
            </View>
          </View>
        }
      />
      <ErrorDialog
        visible={errorDialogVisible}
        title={errorDialogContent.title}
        content={errorDialogContent.content}
        onDismiss={toggleErrorDialogVisible}
        onPress={toggleErrorDialogVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  thumbnail: {
    width: "100%",
    marginTop: 80,
    height: 250,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  image: {
    width: "95%",
    height: "100%",
    resizeMode: "cover",
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  title: {
    marginTop: 35,
    fontSize: 25,
    paddingBottom: 20,
  },
  sub_title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  navTitleView: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    opacity: 0,
  },
});

export default memo(ClinicianScreen);
