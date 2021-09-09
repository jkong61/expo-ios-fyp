import React, { useEffect, useReducer, useContext, createContext } from "react";
import HttpRequest from "@http/HttpHelper";
import { AuthContext } from "@config/ContextHelper";
import {
  removeData,
  getData,
  setData,
} from "@async_storage/AsyncStorageHelper";

const ProviderName = "MealProvider";
const MEALASYNCKEY = "@allMeal";

// Starting for Health Context
export const defaultMealState = [];

export const MealContext = createContext(defaultMealState);

export function useMealProvider() {
  return useContext(MealContext);
}

export const MealProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducerMeal, defaultMealState);
  const { authState } = useContext(AuthContext); // for get the user token purpose

  const getAllMeal = async (mytoken) => {
    console.log(`${ProviderName}: Retrieving Meal history.`);
    const token = mytoken;
    if (token) {
      try {
        let meals = await getData(MEALASYNCKEY);
        if (meals && meals.length > 0) {
          console.log(`${ProviderName}: Retrieving Meal from storage.`);
          meals = JSON.parse(meals);
          dispatch({
            type: "getAllMealHistory",
            payload: meals,
          });
        } else {
          let result = await HttpRequest.Get.GetMeals(token);
          console.log(`${ProviderName}: Retrieving Meal from server.`);
          dispatch({
            type: "getAllMealHistory",
            payload: result,
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      if (authState?.userToken) {
        await getAllMeal(authState.userToken);
      } else {
        console.log(`${ProviderName}: Removing all meal history.`);
        removeData(MEALASYNCKEY);
        dispatch({ type: "resetState" });
      }
    };
    console.log(`${ProviderName}: Initiate Provider.`);
    fetchdata();
  }, [authState.userToken]);

  return (
    <MealContext.Provider value={[state, dispatch]}>
      {children}
    </MealContext.Provider>
  );
};

function reducerMeal(state, action) {
  if (action.payload != {}) {
    let localrecords;
    let array;
    switch (action.type) {
    //add meal
    case "addMealHistory":
      localrecords = state;
      localrecords.unshift(action.payload);
      array = localrecords.map((rec) => rec);
      setData(MEALASYNCKEY, JSON.stringify(array));
      return array;
      // Reducer used to get the initial data loading of the screen
    case "getAllMealHistory":
      setData(MEALASYNCKEY, JSON.stringify(action.payload));
      return action.payload;
    case "updateMeal":
      localrecords = state;
      array = localrecords.map((x) => {
        if (x.meal_id === action.payload.meal_id) {
          return action.payload;
        }
        return x;
      });
      setData(MEALASYNCKEY, JSON.stringify(array));
      return array;
    case "deleteMeal":
      localrecords = state;
      array = localrecords.filter((x) => x.meal_id != action.payload);
      setData(MEALASYNCKEY, JSON.stringify(array));
      return array;
    case "resetState":
      removeData(MEALASYNCKEY);
      return undefined;
    default:
      return state;
    }
  }
}
