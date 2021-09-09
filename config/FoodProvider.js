import React, { useEffect, useReducer, useContext, createContext } from "react";
import HttpRequest from "@http/HttpHelper";
import {
  removeData,
  getData,
  setData,
} from "@async_storage/AsyncStorageHelper";

const ProviderName = "FoodProvider";
const FOODASYNCKEY = "@foodData";
// Starting for Health Context
export const defaultFoodState = {
  foodIds: [],
  allFood: [],
};

export const FoodProviderDispatchMethodConstants = {
  GETFOODDATA: "getAllFoodData",
  UPDATEFOODSTATE: "updateNewFoodState",
  RESETSTATE: "resetState",
};

const FoodContext = createContext(defaultFoodState);

export function useFoodProvider() {
  return useContext(FoodContext);
}

export const FoodProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducerFood, defaultFoodState);

  const getAllFood = async () => {
    try {
      let foods = await getData(FOODASYNCKEY);
      if (foods) {
        console.log(`${ProviderName}: Retrieving Food from storage.`);
        foods = JSON.parse(foods);

        console.log(`${ProviderName}: Checking for any updates.`);
        // current food length

        const index = foods.allFood.length;
        // console.log(index);
        if (index != 0) {
          HttpRequest.Get.GetFoods(index)
            .then((result) => {
            //if got new food then update
              if (result.length > 0) {
                dispatch({ type: FoodProviderDispatchMethodConstants.UPDATEFOODSTATE, payload: result });
                console.log(`${ProviderName}: Updates found.`, result);
              } else {
                console.log(`${ProviderName}: No Updates found.`);
              }
            })
            .catch(error => console.log(error));
        }

        dispatch({
          type: FoodProviderDispatchMethodConstants.GETFOODDATA,
          payload: foods,
        });
        //console.log(foods);
      } else {
        console.log(`${ProviderName}: Retrieving Food from server.`);
        Promise.all([
          HttpRequest.Get.GetFoodIdsString(),
          HttpRequest.Get.GetFoods(),
        ])
          .then((results) => {
            dispatch({
              type: FoodProviderDispatchMethodConstants.GETFOODDATA,
              payload: {
                foodIds: results[0],
                allFood: results[1],
              },
            });
            // Health profile saved in memory
            setData(
              FOODASYNCKEY,
              JSON.stringify({
                foodIds: results[0],
                allFood: results[1],
              })
            );
          })
          .catch((err) => console.error(err));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      // if (authState?.userToken) {
      //   await getAllFood();
      // } else {
      //   console.log(`${ProviderName}: Removing all traces of food data.`);
      //   //removeData("foodData");
      //   dispatch({ type: "resetState" });
      // }
      await getAllFood();
    };
    console.log(`${ProviderName}: Initiate Provider.`);
    fetchdata();
  }, []);

  return (
    <FoodContext.Provider value={[state, dispatch]}>
      {children}
    </FoodContext.Provider>
  );
};

function reducerFood(state, action) {
  if (action.payload != {}) {
    let localrecords;
    let array;
    switch (action.type) {
    // Reducer used to get the initial data loading of the screen
    case FoodProviderDispatchMethodConstants.GETFOODDATA:
      return {
        ...action.payload,
      };
    case FoodProviderDispatchMethodConstants.UPDATEFOODSTATE:
      localrecords = state;
      localrecords.allFood.push(...action.payload);
      array = JSON.parse(JSON.stringify(localrecords));
      setData(FOODASYNCKEY, JSON.stringify(array));
      return array;
    case FoodProviderDispatchMethodConstants.RESETSTATE:
      removeData(FOODASYNCKEY);
      return {
        foodIds: undefined,
        allFood: undefined,
      };
    default:
      return state;
    }
  }
}
