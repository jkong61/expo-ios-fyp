import React, {useEffect, useReducer, useContext, createContext} from "react";
import HttpHelper from "@http/HttpHelper";
import { AuthContext } from "@config/ContextHelper";
import {
  removeData,
  getData,
  setData,
} from "@async_storage/AsyncStorageHelper";

const defaultUserState = {
  "email": undefined,
  "user_id": undefined,
  "account_type": undefined,
  "name": "",
  "contact_information": "",
  "date_created": undefined
};

const ProviderName = "UserProvider";

const USERPROVIDERASYNCKEY = "userdata";

const UserContext = createContext(defaultUserState);

export const UserDetailsProviderDispatchMethodConstants = {
  SAVECURRENTUSER: "saveUserMe",
  RESETSTATE: "resetState"
};

export function useUserProvider() {
  return useContext(UserContext);
} 

export function UserProvider({children}) {
  const [state, dispatch] = useReducer(reducerUser, defaultUserState);
  const { authState } = useContext(AuthContext); // for get the user token purpose

  const getUserDetails = async(token) => {
    if(token) {
      try {
        let userdata = await getData(USERPROVIDERASYNCKEY);
        if(userdata) {
          console.log(`${ProviderName}: Retrieving userdata from storage.`);
          userdata = JSON.parse(userdata);
          dispatch({
            type: UserDetailsProviderDispatchMethodConstants.SAVECURRENTUSER,
            payload: userdata,
          });            
        } else {
          console.log(`${ProviderName}: Retrieving userdata from API.`);
          const data = await HttpHelper.Get.GetUserMe(token);
          dispatch({type: UserDetailsProviderDispatchMethodConstants.SAVECURRENTUSER, payload: data});
          setData(USERPROVIDERASYNCKEY, JSON.stringify(data));
        }
      } catch(err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchData = async() => {
      // when there is an authentication token
      if(authState?.userToken) {
        await getUserDetails(authState.userToken);
      } else {
        // when the user logs out and the authentication token is removed
        console.log(`${ProviderName}: Removing user data from storage.`);
        removeData(USERPROVIDERASYNCKEY);
        dispatch({type: UserDetailsProviderDispatchMethodConstants.RESETSTATE});
      }
    };
    console.log(`${ProviderName}: Initiate Provider.`);
    fetchData();
  },[authState.userToken]);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
}

function reducerUser (state, action) {
  if(action.payload != {}) {
    switch(action.type) {
    case UserDetailsProviderDispatchMethodConstants.SAVECURRENTUSER:
      setData(USERPROVIDERASYNCKEY, JSON.stringify({
        ...action.payload
      }));
      return {
        ...action.payload
      };
    case UserDetailsProviderDispatchMethodConstants.RESETSTATE:
      return defaultUserState;
    default:
      return state;
    }
  }
}
