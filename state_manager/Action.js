import * as actions from "./Constant";

export function RetrieveTokenAction(token) {
  return {
    type: actions.RETRIEVE_TOKEN,
    payload: {
      userToken: token,
    },
  };
}
export function SignInAction(token) {
  return {
    type: actions.SIGN_IN,
    payload: {
      userToken: token,
    },
  };
}
export function SignOutAction() {
  return {
    type: actions.SIGN_OUT,
  };
}