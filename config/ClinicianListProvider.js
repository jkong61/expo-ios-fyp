import React, { useReducer, useContext, createContext } from "react";
import { removeData, setData } from "@async_storage/AsyncStorageHelper";

// Starting for Health Context
export const defaultClinicianListState = [];

export const ClinicianListContext = createContext(defaultClinicianListState);

export function useClinicianListProvider() {
  return useContext(ClinicianListContext);
}

export const ClinicianListProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducerClinicianList,
    defaultClinicianListState
  );

  return (
    <ClinicianListContext.Provider value={[state, dispatch]}>
      {children}
    </ClinicianListContext.Provider>
  );
};

function reducerClinicianList(state, action) {
  if (action.payload != {}) {
    switch (action.type) {
      // Reducer used to get the initial data loading of the screen
      case "getAllClinician":
        setData("allClinician", JSON.stringify(action.payload));
        return action.payload;
      case "resetState":
        removeData("allClinician");
        return undefined;
      default:
        return state;
    }
  }
}
