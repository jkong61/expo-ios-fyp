import React, {useEffect, useReducer, useContext, createContext} from "react";
import HttpRequest from "@http/HttpHelper";
import { AuthContext } from "@config/ContextHelper";
import {
  removeData,
  getData,
  setData,
} from "@async_storage/AsyncStorageHelper";
import { getYYYYMMDD } from "@utilities/helpers";
  
const ProviderName = "HealthProvider";
const HEALTHASYNCKEY = "@healthprofile";

// Starting for Health Context
export const defaultHealthState = {
  profile: {
    gender: "Male",
    date_of_birth: null,
    height: null,
    high_blood_glucose_history: false,
    high_blood_pressure_medication_history: false,
    ethnicity: 99,
    family_history_diabetes_non_immediate: false,
    family_history_diabetes_parents: false,
    family_history_diabetes_children: false,
    family_history_diabetes_siblings: false,
  },
  records: [],
  dailymetric: {
    date: getYYYYMMDD(),
    systolic_pressure: null,
    fasting_blood_glucose: null,
    hdl_cholesterol: null,
    triglycerides: null,
  }
};

const HealthContext = createContext(defaultHealthState);

export function useHealthProvider() {
  return useContext(HealthContext);
}

export const HealthProviderDispatchMethodConstants = {
  CREATEPROFILE: "createProfile",
  SAVEHEALTHPROFILE: "saveHealthStateProfile",
  ADDHEALTHRECORD: "addHealthRecord",
  UPDATEHEALTHRECORD: "updateRecord",
  GETPROFILERECORDS: "getProfileRecords",
  DELETEHEALTHRECORD: "deleteHealthRecord",
  UPDATEDAILYMETRIC: "updateDailyMetric",
  RESETDAILYMETRIC: "resetDailyMetric",
  RESETSTATE: "resetState"
};

export const HealthProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducerHealth, defaultHealthState);
  const { authState } = useContext(AuthContext); // for get the user token purpose

  const getHealthProfile = async (mytoken) => {
    console.log(`${ProviderName}: Retrieving Health Profile.`);
    const token = mytoken;
    if (token) {
      try {
        let health = await getData(HEALTHASYNCKEY);
        if (health) {
          console.log(`${ProviderName}: Retrieving Health from storage.`);
          health = JSON.parse(health);
          dispatch({
            type: HealthProviderDispatchMethodConstants.GETPROFILERECORDS,
            payload: health,
          });

          // find the date of the async health profile and check if date is earlier than today
          if(health?.dailymetric?.date < getYYYYMMDD()){
            // Then reset the daily metric, is also written into async store
            dispatch({type: HealthProviderDispatchMethodConstants.RESETDAILYMETRIC});
          } 

        } else {
          console.log(`${ProviderName}: Retrieving Health from server.`);
          const [fetchProfile, fetchRecords] = await Promise.all([
            HttpRequest.Get.GetHealthProfile(authState.userToken),
            HttpRequest.Get.GetHealthRecords(authState.userToken),
          ]);
          dispatch({
            type: HealthProviderDispatchMethodConstants.GETPROFILERECORDS,
            payload: {
              profile: fetchProfile,
              records: fetchRecords,
              dailymetric: state.dailymetric
            },
          });
          // Health profile saved in memory
          setData(
            HEALTHASYNCKEY,
            JSON.stringify({
              profile: fetchProfile,
              records: fetchRecords,
              dailymetric: state.dailymetric
            })
          );
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      if (authState?.userToken) {
        await getHealthProfile(authState.userToken);
      } else {
        console.log(`${ProviderName}: Removing all traces of user health.`);
        removeData(HEALTHASYNCKEY);
        dispatch({type: HealthProviderDispatchMethodConstants.RESETSTATE});
      }
    };
    console.log(`${ProviderName}: Initiate Provider.`);
    fetchdata();
  }, [authState.userToken]);

  return (
    <HealthContext.Provider value={[state, dispatch]}>
      {children}
    </HealthContext.Provider>
  );
};

function reducerHealth(state, action) {
  if (action.payload != {}) {
    let index;
    let localrecords;
    let array;
    switch(action.type) {
    case HealthProviderDispatchMethodConstants.CREATEPROFILE:
      // console.log("Creating Profile");
      return {
        profile : {
          ...action.payload,
        },
        records : [],
        dailymetric: state.dailymetric
      };
    case HealthProviderDispatchMethodConstants.SAVEHEALTHPROFILE:
      // console.log("Health State saved");
      setData(HEALTHASYNCKEY, JSON.stringify({
        profile : {
          ...state.profile,
          ...action.payload,
          height: parseFloat(action.payload?.height) ?? null,
        },
        records : state.records,
        dailymetric: state.dailymetric
      }));
      return {
        profile : {
          ...state.profile,
          ...action.payload,
          height: parseFloat(action.payload?.height) ?? null,
        },
        records : state.records,
        dailymetric: state.dailymetric
      };
    case HealthProviderDispatchMethodConstants.ADDHEALTHRECORD:
      // perform await function to get server time
      // var record = {...action.payload, date_created: "servertime", date_modified: null, date_deleted: null }
      // console.log("Adding Health Log");
      localrecords = state.records;
      localrecords.unshift(action.payload);
      setData(HEALTHASYNCKEY, JSON.stringify({
        profile : state.profile,
        records : localrecords,
        dailymetric: state.dailymetric
      }));
      return {
        profile : state.profile,
        records : localrecords,
        dailymetric: state.dailymetric
      };
    case HealthProviderDispatchMethodConstants.UPDATEHEALTHRECORD:
      // Should only always have one record to update, not mass update
      localrecords = state.records;

      // Return the index of localrecords where the ID matches
      index = localrecords.findIndex(x => x.health_record_id === action.payload.health_record_id);
      if(index !== -1){
        localrecords[index] = action.payload;
      }
      array = localrecords;

      // array = localrecords.map((x) => {
      //   if(x.health_record_id === action.payload.health_record_id) {return action.payload;}
      //   return x;
      // });

      setData(HEALTHASYNCKEY, JSON.stringify({
        profile : state.profile,
        records : array,
        dailymetric: state.dailymetric
      }));
      return {
        profile : state.profile,
        records : array,
        dailymetric: state.dailymetric
      };
            
      // Reducer used to get the initial data loading of the screen
    case HealthProviderDispatchMethodConstants.GETPROFILERECORDS:
      return {
        ...action.payload
      };
            
      // Reducer to remove a data point
    case HealthProviderDispatchMethodConstants.DELETEHEALTHRECORD:
      localrecords = state.records;
      array = localrecords.filter((x) => x.health_record_id != action.payload);
      setData(HEALTHASYNCKEY, JSON.stringify({
        profile : state.profile,
        records : array,
        dailymetric: state.dailymetric
      }));
      return {
        profile : state.profile,
        records : array,
        dailymetric: state.dailymetric
      };
    case HealthProviderDispatchMethodConstants.UPDATEDAILYMETRIC:
      setData(HEALTHASYNCKEY, JSON.stringify({
        profile : state.profile,
        records : state.records,
        dailymetric: {
          date: getYYYYMMDD(),
          ...action.payload
        }
      }));
      return {
        profile : state.profile,
        records : state.records,
        dailymetric: {
          date: getYYYYMMDD(),
          ...action.payload
        }
      };
    case HealthProviderDispatchMethodConstants.RESETDAILYMETRIC:
      setData(HEALTHASYNCKEY, JSON.stringify({
        profile : state.profile,
        records : state.records,
        dailymetric: {
          ...defaultHealthState.dailymetric
        }
      }));
      return {
        profile : state.profile,
        records : state.records,
        dailymetric: {
          ...defaultHealthState.dailymetric
        }
      };
    case HealthProviderDispatchMethodConstants.RESETSTATE:
      return defaultHealthState;
    default:
      return state;
    }
  }
}

/**
 * Example Schema from API
 * {
  "date_of_birth": "2020-10-06",
  "gender": "string",
  "height": 0,
  "ethnicity": 0,
  "family_history_diabetes_non_immediate": true,
  "family_history_diabetes_parents": true,
  "family_history_diabetes_siblings": true,
  "family_history_diabetes_children": true,
  "high_blood_glucose_history": true,
  "high_blood_pressure_medication_history": true,
  "date_created": "2020-10-06T05:09:07.745Z",
  "date_modified": "2020-10-06T05:09:07.745Z",
  "profile_id": 0,
  "user_id": 0
}
 */
