import reducer from "./Reducer";
import { useReducer } from "react";

const initialiedState = {
  userToken: null,
  isLoading: true,
};

const AuthReducer = () => {
  const [authState, dispatch] = useReducer(reducer, initialiedState);
  return [authState, dispatch];
};

export default AuthReducer;