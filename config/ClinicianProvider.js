import React, {useEffect, useReducer, useContext, createContext} from "react";
import { AuthContext } from "@config/ContextHelper";
import { useUserProvider } from "@config/UserDetailsProvider";
import HttpHelper from "@http/HttpHelper";
import {
  removeData,
  getData,
  setData,
} from "@async_storage/AsyncStorageHelper";

const PROVIDERNAME = "ClinicanProvider";
const CLINISIANASYNCSTOREKEY = "clinicianassignments";
export const ClinicianProviderDispatchMethodConstants = {
  SAVEDATA: "saveAssignments",
  UPDATEASSIGNMENT: "updateAssignment",
  RESETSTATE: "resetState",
  REMOVEASSIGNMENT: "removeAssignment",
  REFRESHFROMAPI: "refreshFromAPI",
  GENERATEREPORT: "generatereport",
  COMPLETEREPORT: "completereport",
  RAISEERROR: "error"
};

const defaultClinicianState = {
  allAssignments: [],
  trend:{
    loading: false, //set to true when waiting for item from server
    parameters: undefined,
    result:{}
  }
};

const ClinicianContext = createContext(defaultClinicianState);

export function useClinicianProvider() {
  return useContext(ClinicianContext);
}

export function ClinicianProvider ({children}) {
  const [userDetails] = useUserProvider();
  const [state, dispatch] = useReducer(reducerClinician, defaultClinicianState);
  const { authState } = useContext(AuthContext); // for get the user token purpose

  async function fetchAllAssignments(token){
    console.log(`${PROVIDERNAME}: Retrieving Clinician Assignments.`);
    if(token) {
      try {
        let assignments = await getData(CLINISIANASYNCSTOREKEY);
        if(assignments) {
          console.log(`${PROVIDERNAME}: Retrieving assignments from storage.`);
          assignments = JSON.parse(assignments);
          dispatch({
            type: ClinicianProviderDispatchMethodConstants.SAVEDATA,
            payload: assignments,
          });            
        } else {
          console.log(`${PROVIDERNAME}: Retrieving Assignments from API.`);
          const res = await HttpHelper.Get.GetAllClinicianAssignments(token);
          if(res.error) {
            throw Error (res.message);
          } else {
            dispatch({type: ClinicianProviderDispatchMethodConstants.SAVEDATA, payload: res.data});
          }
        }
      } catch(err) {
        console.error(err);
      }
    }
  }

  // TODO: Generate save the report into the clinician provider
  async function generateReport(){
    console.log(`${PROVIDERNAME}: Generating Report.`);
    let response;
    try{
      // const response = await asyncDelay(10);
      // console.log(state.trend.parameters);
      response = await HttpHelper.Post.ClinicianGenerateReport(state.trend.parameters, authState.userToken);
      if(response.error) {
        throw Error (response.message);
      } else {
        console.log(`${PROVIDERNAME}: Report Completed.`);
        console.log(response);
        const data = Object.entries(response.data).map(([key,value]) => ({
          title: key,
          data: value
        }));
        dispatch({type: ClinicianProviderDispatchMethodConstants.COMPLETEREPORT, payload: data || {}});  
      }
    } catch (err) {
      console.error(err);
      dispatch({type: ClinicianProviderDispatchMethodConstants.RAISEERROR});  
    }
  }

  async function fetchData() {
    if (authState?.userToken){
      fetchAllAssignments(authState.userToken);
    }
    return;
  }

  useEffect(() => {
    // We can get the user account type after the token has already been initialized, therefore depencency can be without auth token
    console.log(`${PROVIDERNAME}: Initiate Provider.`);
    if(userDetails.account_type){
      // only perform only if the user account type = 1 (i.e. is a clinician)
      fetchData();
    }
  },[userDetails.account_type]);

  useEffect(() =>{
    if(!authState?.userToken){
      console.log(`${PROVIDERNAME}: Removing clinician data from storage.`);
      removeData(CLINISIANASYNCSTOREKEY);
      dispatch({type: ClinicianProviderDispatchMethodConstants.RESETSTATE});
    }
  },[authState.userToken]);

  // Used for generating report by changing loading to true
  useEffect(()=>{
    if(state.trend.loading) { generateReport(); }
  },[state.trend.loading]);

  return (
    <ClinicianContext.Provider value={[state, dispatch]}>
      {children}
    </ClinicianContext.Provider>
  );
}

function reducerClinician(state, action) {
  let currentassignments;
  let data;
  let array;
  if(action.payload != {}) {
    switch(action.type) {
    case ClinicianProviderDispatchMethodConstants.SAVEDATA:
      // Numbers have to be converted to strings to make fuzzysort workable
      data = action.payload.map((x) => {
        x.clinician_assignment_id = x.clinician_assignment_id.toString();
        x.user_id = x.user_id.toString();
        x.clinician_id = x.clinician_id.toString();
        return x;
      });
      setData(CLINISIANASYNCSTOREKEY, JSON.stringify(data));
      return {
        allAssignments: data,
        trend: state.trend
      };
    case ClinicianProviderDispatchMethodConstants.UPDATEASSIGNMENT:
      currentassignments = state.allAssignments;
      array = currentassignments.map((x) => {
        if(x.clinician_assignment_id == action.payload.clinician_assignment_id) {return action.payload;}
        return x;
      });
      setData(CLINISIANASYNCSTOREKEY, JSON.stringify(array));
      return {
        allAssignments : array,
        trend: state.trend
      };
    case ClinicianProviderDispatchMethodConstants.REMOVEASSIGNMENT:
      currentassignments = state.allAssignments;
      array = currentassignments.filter((x) => x.clinician_assignment_id != action.payload);
      setData(CLINISIANASYNCSTOREKEY, JSON.stringify(array));
      return {
        allAssignments : array,
        trend: state.trend
      };
    case ClinicianProviderDispatchMethodConstants.GENERATEREPORT:
      return {
        allAssignments : state.allAssignments,
        trend:{
          loading: true,
          parameters: action.payload,
          result: state.trend.result
        }
      };
    case ClinicianProviderDispatchMethodConstants.COMPLETEREPORT:
      return {
        allAssignments : state.allAssignments,
        trend:{
          loading: false,
          parameters: undefined,
          result: action.payload
        }
      };
    case ClinicianProviderDispatchMethodConstants.RAISEERROR:
      return {
        allAssignments : state.allAssignments,
        trend:{
          loading: undefined,
          parameters: undefined,
          result: state.trend.result
        }
      };
    case ClinicianProviderDispatchMethodConstants.RESETSTATE:
      return defaultClinicianState;
    default:
      return state;
    }
  }
}

//   {
//   "clinician_id": 0,
//   "clinician_assignment_id": 0,
//   "user_id": 0,
//   "assignment_accepted": true
// }