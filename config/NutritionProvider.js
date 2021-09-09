import React, { useEffect, useReducer, createContext, useContext } from "react";
import {
  removeData,
  getData,
  setData,
} from "@async_storage/AsyncStorageHelper";
import { AuthContext } from "@config/ContextHelper";

const defaultNutritionState = ["ENERC_KCAL", "FAT", "PROCNT"];

const ProviderName = "NutritionProvider";

const NUTRITION_ASYNC_KEY = "nutritionSetting";

const NutritionContext = createContext(defaultNutritionState);

export function useNutritionProvider() {
  return useContext(NutritionContext);
}

export const NutritionProviderDispatchMethodConstants = {
  UPDATESTATE: "updateState",
  RESETSTATE: "resetState",
};

export function NutritionProvider({ children }) {
  const [state, dispatch] = useReducer(reducerNutrition, defaultNutritionState);
  const { authState } = useContext(AuthContext); // for get the user token purpose

  const getNutritionSetting = async () => {
    try {
      let nutritionSetting = await getData(NUTRITION_ASYNC_KEY);
      if (nutritionSetting) {
        console.log(
          `${ProviderName}: Retrieving nutrition setting from storage.`
        );
        nutritionSetting = JSON.parse(nutritionSetting);
        dispatch({
          type: NutritionProviderDispatchMethodConstants.UPDATESTATE,
          payload: nutritionSetting,
        });
      } else {
        console.log(
          `${ProviderName}: Retrieving nutrition setting by default.`
        );
        dispatch({
          type: NutritionProviderDispatchMethodConstants.UPDATESTATE,
          payload: defaultNutritionState,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // when there is an authentication token
      if (authState?.userToken) {
        await getNutritionSetting();
      } else {
        // when the user logs out and the authentication token is removed
        console.log(
          `${ProviderName}: Removing nutrition setting from storage.`
        );
        removeData(NUTRITION_ASYNC_KEY);
        dispatch({
          type: NutritionProviderDispatchMethodConstants.RESETSTATE,
        });
      }
    };
    console.log(`${ProviderName}: Initiate Provider.`);
    fetchData();
  }, [authState.userToken]);

  return (
    <NutritionContext.Provider value={[state, dispatch]}>
      {children}
    </NutritionContext.Provider>
  );
}

function reducerNutrition(state, action) {
  if (action.payload != {}) {
    switch (action.type) {
      case NutritionProviderDispatchMethodConstants.UPDATESTATE:
        setData(NUTRITION_ASYNC_KEY, JSON.stringify(action.payload));
        return action.payload;
      case NutritionProviderDispatchMethodConstants.RESETSTATE:
        return defaultNutritionState;
      default:
        return state;
    }
  }
}
