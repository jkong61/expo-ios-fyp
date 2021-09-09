import React, { useEffect, useReducer, useContext, createContext } from "react";
import HttpRequest from "@http/HttpHelper";
import { AuthContext } from "@config/ContextHelper";
import {
  removeData,
  getData,
  setData,
} from "@async_storage/AsyncStorageHelper";

const ProviderName = "AssignedClinicianProvider";

// Starting for Health Context
export const defaultAssignedClinicianState = [];

export const AssignedClinicianContext = createContext(
  defaultAssignedClinicianState
);

export function useAssignedClinicianProvider() {
  return useContext(AssignedClinicianContext);
}

export const AssignedClinicianProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducerAssignedClinician,
    defaultAssignedClinicianState
  );
  const { authState } = useContext(AuthContext); // for get the user token purpose

  const getAssignedClinicianList = async (mytoken) => {
    const token = mytoken;
    if (token) {
      try {
        let assignedClinician = await getData("allAssignedClinician");
        if (assignedClinician) {
          console.log(`${ProviderName}: Retrieving Clinicans from storage.`);
          assignedClinician = JSON.parse(assignedClinician);
          dispatch({
            type: "getAssignedClinician",
            payload: assignedClinician,
          });
        } else {
          //call api to retrieve foods
          const result = await HttpRequest.Get.GetAssignedClinicians(token);
          console.log("AssignedClinician:", " get from server..");
          //set all food into async storage
          if (result) {
            dispatch({
              type: "getAssignedClinician",
              payload: result,
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      if (authState?.userToken) {
        await getAssignedClinicianList(authState.userToken);
      } else {
        console.log(`${ProviderName}: Removing all clinician history.`);
        removeData("allAssignedClinician");
        dispatch({ type: "resetState" });
      }
    };
    console.log(`${ProviderName}: Initiate Provider.`);
    fetchdata();
  }, [authState.userToken]);

  return (
    <AssignedClinicianContext.Provider value={[state, dispatch]}>
      {children}
    </AssignedClinicianContext.Provider>
  );
};

function reducerAssignedClinician(state, action) {
  if (action.payload != {}) {
    let localrecords;
    let array;
    switch (action.type) {
      case "assignClinician":
        localrecords = state;
        localrecords.unshift(action.payload);
        setData("allAssignedClinician", JSON.stringify(localrecords));
        return localrecords;
      // Reducer used to get the initial data loading of the screen
      case "getAssignedClinician":
        setData("allAssignedClinician", JSON.stringify(action.payload));
        return action.payload;
      case "cancelAssignedClinician":
        localrecords = state;
        array = localrecords.filter(
          (x) => x.clinician_assignment_id != action.payload
        );
        setData("allAssignedClinician", JSON.stringify(array));
        return array;
      case "resetState":
        removeData("allAssignedClinician");
        return undefined;
      default:
        return state;
    }
  }
}
