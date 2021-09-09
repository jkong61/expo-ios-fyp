import { Dimensions, PixelRatio, Platform } from "react-native";
import * as Network from "expo-network";
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Used for normalizing font sizes across devices
 */
export function actuatedNormalize(size) {
  // based on smallest screen size "Iphone 5"
  const scale = SCREEN_WIDTH / 320;

  const newSize = size * scale;
  if (Platform.OS == "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export function getScreenHeightPercentage(stringPercentage) {
  const percentage = parseFloat(stringPercentage) / 100;
  return Dimensions.get("screen").height * percentage;
}

export function getScreenWidthPercentage(stringPercentage) {
  const percentage = parseFloat(stringPercentage) / 100;
  return Dimensions.get("screen").width * percentage;
}

//for components
export function actuatedNormalizeSize(size) {
  const current_scale = SCREEN_HEIGHT / SCREEN_WIDTH;
  if (Platform.OS === "ios") {
    const based_scale = 736 / 414; // based on iphone 8 plus
    if (current_scale >= based_scale) {
      return size;
    } else {
      let ratio = based_scale - current_scale;
      ratio = 1 - Math.round(ratio * 10) / 10; //with one decimal place
      const sizegap = size - size * ratio;
      return size * ratio + sizegap / 2.5;
      //return size * ratio;
    }
  } else if (Platform.OS === "android") {
    const based_scale = 845.7 / 411.4; // based on samsung note 9
    if (current_scale >= based_scale) {
      return size;
    } else {
      let ratio = based_scale - current_scale;
      ratio = 1 - Math.round(ratio * 10) / 10; //with one decimal place
      const sizegap = size - size * ratio;
      return size * ratio + sizegap / 2.5;
      //return size * ratio;
    }
  }
}

//for font size
export function actuatedNormalizeFontSize(size) {
  const based_scale = 845.7 / 411.4; // based on samsung note 9
  const current_scale = SCREEN_HEIGHT / SCREEN_WIDTH;

  if (current_scale >= based_scale) {
    return size;
  } else {
    if (SCREEN_HEIGHT <= 690) {
      let ratio = based_scale - current_scale;
      ratio = 1 - Math.round(ratio * 10) / 10; //with one decimal place
      const sizegap = size - size * ratio;

      return size - sizegap / 2;
    }
  }
  return size;
}

export function getLocalDateTime(date) {
  let hours = date.getHours();

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  let timeOfDay = hours < 12 ? "AM" : "PM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  let month = "";
  switch (date.getMonth() + 1) {
  case 1:
    month = "Jan";
    break;
  case 2:
    month = "Feb";
    break;
  case 3:
    month = "Mar";
    break;
  case 4:
    month = "Apr";
    break;
  case 5:
    month = "May";
    break;
  case 6:
    month = "Jun";
    break;
  case 7:
    month = "Jul";
    break;
  case 8:
    month = "Aug";
    break;
  case 9:
    month = "Sep";
    break;
  case 10:
    month = "Oct";
    break;
  case 11:
    month = "Nov";
    break;
  case 12:
    month = "Dec";
    break;
  }

  let day = "";
  switch (date.getDay()) {
  case 0:
    day = "Sun";
    break;
  case 1:
    day = "Mon";
    break;
  case 2:
    day = "Tue";
    break;
  case 3:
    day = "Wed";
    break;
  case 4:
    day = "Thu";
    break;
  case 5:
    day = "Fri";
    break;
  case 6:
    day = "Sat";
    break;
  }

  // return month + '/' + date.getDate() + '/' + date.getFullYear() + ', ' + hours + ':' + minutes + " " + timeOfDay;
  return `${date.getDate()} ${month} ${date.getFullYear()} \t ${day} | ${hours}:${minutes} ${timeOfDay}`;
}

/**
 * Returns date object from ISOTimeString
 * @param {*} ISOTimeString
 */
export function getDateObjFromISOString(ISOTimeString) {
  const prefixes = [1, 2, 3, 4, 5];

  let date = parseTimestamp(ISOTimeString); // parses to miliseconds from start of epoc
  if (isNaN(date)) {
    return {};
  }
  const dateString = date.toString().split(" ", 5);
  let timeOfDay = date.getHours() < 12 ? "AM" : "PM";
  let hours = date.getHours();
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let seconds = date.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;
  let numOfWeek = prefixes[Math.floor(date.getDate() / 7)];

  return {
    weekday: dateString[0],
    month: dateString[1],
    monthNum: date.getMonth(),
    day: dateString[2],
    numOfWeek: numOfWeek,
    year: dateString[3],
    time: dateString[4],
    timeIn12: `${hours}:${minutes}:${seconds} ${timeOfDay}`,
    timeIn12NoSecs: `${hours}:${minutes} ${timeOfDay}`,
    timeOfDay: timeOfDay,
  };

  // 2020-10-12T03:53:34.895Z - ISOString
  // Mon Oct 12 2020 03:53:34 GMT+0000 (Coordinated Universal Time) .toString() format
  // [ 'Mon', 'Oct', '12', '2020', '03:53:34' ] => dateString after split function with limit of 5
}

export function getYYYYMMDD(ISOTimeString = new Date().toISOString()) {
  const dateobj = getDateObjFromISOString(ISOTimeString);
  return `${dateobj.year}-${dateobj.month}-${dateobj.day}`;
}

function parseTimestamp(timestampStr) {
  return new Date(
    new Date(timestampStr).getTime() +
      (Platform.OS === "ios"
        ? 0
        : new Date(timestampStr).getTimezoneOffset() * 60 * 1000)
  );
  // return new Date(new Date(timestampStr).getTime() + new Date().getTimezoneOffset() * 60 * 1000);
  // return new Date(new Date(timestampStr).getTime());
}

export function dateStringFromISOString(ISOTimeString, timeIn12 = false) {
  const time = getDateObjFromISOString(ISOTimeString);
  if (timeIn12) {
    return `${time.day} ${time.month} ${time.year} | ${time.timeIn12NoSecs}`;
  }
  return `${time.day} ${time.month} ${time.year} | ${time.time} ${time.timeOfDay}`;
}

// Checks if a string is able to be parsed into a date
export function getDatefromString(stringdate) {
  let datedata = {
    error: false,
    data: undefined,
  };

  let regex = /(\d{4})-(\d{2})-(\d{2})/;
  let date = new Date(stringdate);
  if (isNaN(date) || !regex.test(stringdate)) {
    datedata = {
      error: true,
      data: "Invalid Date Format.",
    };
  } else if (date > new Date()) {
    datedata = {
      error: true,
      data: "Provided a date greater than today.",
    };
  } else {
    datedata.data = date;
  }
  return datedata;
}

export function getEmailUserName(email) {
  try {
    return email.split("@", 1)[0];
  } catch (err) {
    return null;
  }
}

export function getFirstName(name) {
  try {
    return name.split(" ", 1)[0];
  } catch (err) {
    return null;
  }
}

export function stringIsNotEmpty(string) {
  if (!string || string.length === 0) {
    return undefined;
  }
  return string;
}

/**
 * Helper function to retrieve device network status
 * @returns {boolean} Returns True if device has access to Internet
 */
export async function getNetworkStatus() {
  const networkStatus = await Network.getNetworkStateAsync();
  return networkStatus?.isConnected && networkStatus?.isInternetReachable;
}

// Function used to process all health records for the chart
export function processHealthRecordArray(array) {
  return array.map((element) => {
    let obj = selectSomeProperties(element, [
      "waist_circumference",
      "weight",
      "systolic_pressure",
      "fasting_blood_glucose",
      "hdl_cholesterol",
      "triglycerides",
      "date_created",
    ]);
    obj["date_created"] = getDateObjFromISOString(obj["date_created"]);
    return obj;
  });
}

// function used to return a new json object with "included keys"
function selectSomeProperties(json, includes = []) {
  return Object.keys(json).reduce((obj, k) => {
    if (includes.includes(k)) {
      obj[k] = json[k];
    }

    return obj;
  }, {});
}

export function isLeapYear(year) {
  return !(year % 4 || (!(year % 100) && year % 400));
}

// Used for mocking API calls , mainly for testing purposes
export async function asyncDelay(seconds = 1, supposedtofail = false) {
  let promise = new Promise(function (resolve, reject) {
    // the function is executed automatically when the promise is constructed
    // after 1 second signal that the job is done with the result "done"
    if (supposedtofail) {
      setTimeout(() => reject(new Error("failed")), seconds * 1000);
    } else {
      setTimeout(() => resolve("completed"), seconds * 1000);
    }
  });
  return promise;
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function processNutritionName(n) {
  const word = n.nutrition.nutrition_name.split("_");
  const new_word = word.map(x => 
    x[0].toUpperCase() + x.slice(1)
  );
  return new_word.join(" ");
}