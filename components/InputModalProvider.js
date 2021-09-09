import React, { useContext, useReducer, createContext } from "react";
import {
  useTheme,
  TextInput,
  Text,
  Modal,
} from "react-native-paper";
import {
  MyContainer,
  ColumnWrapper,
  MyLinearGradient,
  ErrorMessage,
  RowWrapper
} from "@components";
import * as helpers from "@utilities/helpers";
import { Keyboard } from "react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

export const ModalActionsConstants = {
  TOGGLE: "toggleModal",
  STOREVALUE: "storeValue",
  SAVEVALUE: "saveValue",
  RAISEERROR: "raiseError",
  RESETVALUE: "resetValue"
};

export const ModalDataCheckConstants = {
  STRING: "string",
  NUMBER: "number",
  DATE: "date"
};

const defaultModalState = {
  title: "",
  error: false,
  errormessage: "",
  isModalVisible: false,
  value: undefined,
  callback: undefined, // for local function callback
  case: "", // used by the local function callback reducer
  inputtype: "numeric",
  checktype: ModalDataCheckConstants.STRING
};

const InputModalContext = createContext(defaultModalState);

export function useInputModalProvider() {
  return useContext(InputModalContext);
} 

export const InputModalProvider = ({children}) => {
  const [state, dispatch] = useReducer(modalReducer, defaultModalState);
  const { colors } = useTheme();

  const checkStoredValue = () => {
    let value = state.value;
    if(!helpers.stringIsNotEmpty(value)) {
      console.log("Empty String");
      dispatch({ type: ModalActionsConstants.RAISEERROR, errormessage: "Field cannot be blank." });
      return;
    }

    // Check if it is a number
    if(state.checktype === ModalDataCheckConstants.NUMBER) {
      value = parseFloat(value);
      if (typeof value === "number" && value < 1) {
        dispatch({ type: ModalActionsConstants.RAISEERROR, errormessage: "Number must be positive." });
        return;
      }
    }

    if(state.checktype === ModalDataCheckConstants.DATE) {
      const datedata = helpers.getDatefromString(value);
      if(datedata.error) {
        dispatch({ type: ModalActionsConstants.RAISEERROR, errormessage: datedata.data });
        return;
      }
    }

    dispatch({ type: ModalActionsConstants.SAVEVALUE });
    return;
  };

  return (
    <InputModalContext.Provider value={[dispatch]}>
      {children}

      {/* Include the global modal in the provider */}
      <Modal
        visible={state.isModalVisible}
        transparent={true}
        animationType="fade"
        onModalWillShow={() => dispatch({ type: ModalActionsConstants.RESETVALUE })}
        // onModalWillHide={() => dispatch({ type: ModalActionsConstants.RESETVALUE })}
        onDismiss={() => dispatch({ type: ModalActionsConstants.TOGGLE })}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <MyContainer
            style={{
              marginHorizontal: helpers.actuatedNormalizeSize(30),
              width: "auto",
            }}
          >
            <RowWrapper
              style={{
                justifyContent: "space-between",
                paddingVertical: 0,
                marginBottom: helpers.actuatedNormalizeSize(30),
              }}
            >
              <Text
                style={{
                  fontSize: helpers.actuatedNormalizeFontSize(18),
                  fontWeight: "bold",
                }}
              >
              Enter {state.title}
              </Text>
              <TouchableOpacity
                onPress={() => dispatch({ type: ModalActionsConstants.TOGGLE })}
              >
                <AntDesign name="closesquare" size={35} color={colors.error} />
              </TouchableOpacity>
            </RowWrapper>

            <ColumnWrapper style={{ alignItems: "center" }}>
              <TextInput
                label={state.title}
                placeholder={state.title}
                value={state.value}
                keyboardType={state.inputtype}
                onChangeText={(value) =>
                  dispatch({ type: ModalActionsConstants.STOREVALUE , payload: value })
                }
                style={{width: "100%"}}
              />
              {state.error && (
                <ErrorMessage message={state.errormessage} />
              )}
              {/* Save button */}
              <TouchableOpacity
                style={{ width: "100%" }}
                onPress={checkStoredValue}
              >
                <MyLinearGradient
                  style={{
                    paddingLeft: helpers.actuatedNormalizeSize(100),
                    paddingRight: helpers.actuatedNormalizeSize(100),
                    marginTop: helpers.actuatedNormalizeSize(30),
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: helpers.actuatedNormalizeFontSize(20),
                      color: "#fff",
                    }}
                  >
                  Save
                  </Text>
                </MyLinearGradient>
              </TouchableOpacity>
            </ColumnWrapper>
          </MyContainer>
        </TouchableWithoutFeedback>
      </Modal>
    </InputModalContext.Provider>
  );
};

function modalReducer(state, action) {
  switch (action.type) {
  case ModalActionsConstants.TOGGLE:
    return {
      ...state,
      isModalVisible: !state.isModalVisible,
      error: false,
      errormessage: "",
      value: action.value,
      title: action.payload,
      callback: action.callback,
      case: action.case,
      inputtype: action.inputtype,
      checktype: action.checktype ?? ModalDataCheckConstants.STRING
    };
  case ModalActionsConstants.STOREVALUE:
    return { ...state, value: action.payload };
  case ModalActionsConstants.SAVEVALUE:
    // state.callback calls localdispatch for localRecordState
    state.callback({ type: state.case, payload: state.value });
    return {
      ...state,
      isModalVisible: !state.isModalVisible,
      value: null,
      title: null,
      errormessage: "",
      error: false
    };
  case ModalActionsConstants.RAISEERROR:
    return { ...state, value: null, error: true, errormessage: action.errormessage };
  case ModalActionsConstants.RESETVALUE:
    return { ...state, value: null, error: false, errormessage: "", checktype: ModalDataCheckConstants.STRING };
  default:
    return state;
  }
}
