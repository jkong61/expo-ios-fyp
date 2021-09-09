import * as actions from "./Constant";

const initialiedState = {
  userToken: null,
  isLoading: true,
};

export default function reducer(state = initialiedState, action) {
  switch (action.type) {
  case actions.RETRIEVE_TOKEN:
    return {
      ...state,
      userToken: action.payload.userToken,
      isLoading: false,
    };

  case actions.SIGN_IN:
    return {
      ...state,
      userToken: action.payload.userToken,
      isLoading: false,
    };
  case actions.SIGN_UP:
    return {
      ...state,
      userToken: action.payload.userToken,
      isLoading: false,
    };
  case actions.SIGN_OUT:
    return {
      ...state,
      userToken: null,
      isLoading: false,
    };
  default:
    return state;
  }
}