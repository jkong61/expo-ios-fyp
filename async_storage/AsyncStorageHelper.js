import AsyncStorage from "@react-native-async-storage/async-storage";

export const setData = (key, data) => {
  try {
    AsyncStorage.setItem(key, data);
  } catch (err) {
    console.log(err);
  }
};

export const getData = async(key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (err) {
    console.log(err);
  }
};

export const removeData = (key) => {
  try {
    AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(err);
  }
};