import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView
} from "react-native";
import { Title } from "react-native-paper";
import HttpHelper from "@http/HttpHelper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { actuatedNormalizeFontSize, getNetworkStatus, dateStringFromISOString } from "@utilities/helpers";
import { 
  BackButton,
  ErrorDialog,
  Loader,
  MyContainer,
  TouchableSectionItem,
} from "@components/";
import { AuthContext } from "@config/ContextHelper";
import useLoading from "@utilities/customhooks/useLoading";
import useToggleDialog from "@utilities/customhooks/useToggleDialog";
import useDialogHandler from "@utilities/customhooks/useDialogHandler";

export default function ClinicianPatientProfileScreen() {
  const { authState } = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const [patientHealthRecordId, ] = useState(route?.params?.healthRecordId);
  const [healthDetails, setHealthDetails] = useState({});
  const [errorDialogVisible, toggleErrorDialogVisible] = useToggleDialog();
  const [errorDialogContent, toggleDialog] = useDialogHandler(toggleErrorDialogVisible);

  function handleforDialog(title, message){
    toggleDialog({
      title: title,
      message: message
    });
  }

  async function fetchPatientData(id){
    if(!getNetworkStatus()){
      handleforDialog(
        "Network Error",
        "Internet Connection is required.",
      );
      return;
    }
    let res = await HttpHelper.Get.GetClinicianAssignedSingleUserHealthRecord(id,authState.userToken);
    if(res.error){
      handleforDialog(
        "Server Error",
        res.message,
      );
    } else {
      setHealthDetails(res.data);
    }
  }
  const [getPatientData, loading] = useLoading(fetchPatientData);


  const LocalContainer = (props) => (
    <MyContainer style={{ alignItems: "flex-start", marginVertical: "1%" }}>
      {props.children}
    </MyContainer>
  );

  function getBoolean(value){
    if(value === null || value === undefined){
      return "Not Provided";
    } else {
      return value ? "Yes" : "No";
    }
  }

  useEffect(()=>{
    getPatientData(patientHealthRecordId);
  },[]);

  return (
    <SafeAreaView style={styles.container}>
      <BackButton/>
      <View style={styles.titleheader}>
        <Title style={styles.title}>
          Patient Health Record
        </Title>
      </View>

      <ScrollView style={{ paddingHorizontal: "5%"}}>
        <LocalContainer>
          {/* TODO: Need to format the date here */}
          <TouchableSectionItem
            title="Recorded Date"
            touchable={false}
            value={healthDetails?.date_created ? dateStringFromISOString(healthDetails?.date_created, true) : "Not Provided"}
          />
          <TouchableSectionItem
            title="Weight(kg)"
            touchable={false}
            value={healthDetails?.weight ?? "Not Provided"}
          />
          <TouchableSectionItem
            title="Waist Circumference(cm)"
            touchable={false}
            value={healthDetails?.waist_circumference ?? "Not Provided"}
          />
          <TouchableSectionItem
            title="Physical Exercise Duration"
            touchable={false}
            value={`${healthDetails?.physical_exercise_hours ?? 0}hrs ${healthDetails?.physical_exercise_minutes ?? 0}mins`}
          />
        </LocalContainer>

        <LocalContainer>
          <TouchableSectionItem
            title="Fruit, Berry, Vege"
            touchable={false}
            value={getBoolean(healthDetails?.vegetable_fruit_berries_consumption)}
          />
          <TouchableSectionItem
            title="Smoking"
            touchable={false}
            value={getBoolean(healthDetails?.smoking)}
          />
        </LocalContainer>

        <LocalContainer>
          <TouchableSectionItem
            title="Fasting Blood Glucose"
            touchable={false}
            value={healthDetails?.fasting_blood_glucose ?? "Not Provided"} 
          />
          <TouchableSectionItem
            title="Triglycerides"
            touchable={false}
            value={healthDetails?.triglycerides ?? "Not Provided"} 
          />
          <TouchableSectionItem
            title="Systolic Pressure"
            touchable={false}
            value={healthDetails?.systolic_pressure ?? "Not Provided"} 
          />
          <TouchableSectionItem
            title="HDL Cholesterol"
            touchable={false}
            value={healthDetails?.hdl_cholesterol ?? "Not Provided"} 
          />
        </LocalContainer>
      </ScrollView>

      <Loader visible={loading}/>

      <ErrorDialog 
        visible={errorDialogVisible}
        title={errorDialogContent.title}
        content={errorDialogContent.content}
        onPress={toggleErrorDialogVisible}
        optionalCallback={navigation.goBack}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    marginTop: "9%",
    marginBottom: 20,
    fontSize: actuatedNormalizeFontSize(24),
  },
  titleheader: {
    alignItems: "center"
  }
});