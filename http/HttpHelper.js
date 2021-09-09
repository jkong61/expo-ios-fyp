import Axios from "axios";
import * as ConfigGenerator from "./ConfigGenerator";
import * as Constant from "./Constant";

/**
 * Private function used to make Axios Request
 * @param {Object} httpConfig Provide a HTTP Configuration Object.
 */
async function makeAxiosRequest(httpConfig) {
  const data = await Axios(httpConfig)
    .then((response) => {
      const res = response.status == 200 ? response.data : null;
      return res; // 200 if okay
    })
    .catch((e) => { 
      if(e.message === "Network Error"){
        console.log("Unable to reach Server");
      } else {
        console.log("Error Response: ", e.response);
      }
      return null;
    });
  return data;
}

/**
 * Private function used to make Axios Request (different version that includes outputting errors and messages from server)
 * @param {Object} httpConfig Provide a HTTP Configuration Object.
 */
async function makeV2AxiosRequest(httpConfig) {
  let returndata = {
    error: false,
    data: undefined,
    message: "",
  };
  const data = await Axios(httpConfig)
    .then((response) => {
      const res = response.status == 200 ? response.data : null;
      return { ...returndata, data: res, message: "OK" }; // 200 if okay
    })
    .catch((e) => {
      console.log("Error Response: ", e.response);
      let message;
      if(e.message === "Network Error" || e.code === "ECONNABORTED"){
        message = "Unable to reach Server. Please try again later.";
      }
      return { ...returndata, error: true, message: message ?? e.response.data.detail };
    });
  return data;
}

const HttpRequest = {
  Post: {
    Login: async (username, password) => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.LoginHttpRequestConfig(
        username,
        password
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    SignUp: async (email, password) => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.SignUpHttpRequestConfig(
        email,
        password
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    FoodDetect: async (image, token) => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.FoodDetectHttpRequestConfig(
        image,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    CreateMeal: async (image, token) => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.CreateMealHttpRequestConfig(
        image,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    CreateFoodItem: async (foodItem, meal_id, token) => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.CreateFoodItemHttpRequestConfig(
        foodItem,
        meal_id,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    CreateHealthProfile: async (profile, token) => {
      const HttpRequestConfig = ConfigGenerator.ProfileHttpRequestConfig(
        profile,
        token,
        Constant.METHOD.POST
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    CreateHealthRecord: async (record, token) => {
      const HttpRequestConfig = ConfigGenerator.CreateGetHealthRecordsHttpRequestConfig(
        token,
        Constant.METHOD.POST,
        record
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    ChangePassword: async (passwords, token) => {
      const HttpRequestConfig = ConfigGenerator.ChangePasswordHttpRequestConfig(
        passwords,
        token
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    AssignClinician: async (clinician_id, token) => {
      const HttpRequestConfig = ConfigGenerator.AssignClinicianHttpRequestConfig(
        clinician_id,
        token
      );
      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    ClinicianGenerateReport: async (params, token) => {
      const HttpRequestConfig = ConfigGenerator.ClinicianPostTrendAnalyserGenerateReport(
        params,
        token
      );
      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    UpdatePushToken: async (push_token = undefined, auth_token) => {
      const HttpRequestConfig = ConfigGenerator.UpdateExpoPushToken(
        push_token,
        auth_token
      );
      return await makeAxiosRequest(HttpRequestConfig);
    },
  },
  Get: {
    GetFoods: async (skip = 0) => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.GetFoodsHttpRequestConfig(skip);

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetFoodIdsString: async () => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.GetFoodIdsStringHttpRequestConfig();

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetPredictionsById: async (id, token) => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.GetPredictionsIdHttpRequestConfig(
        id,
        token
      );
      // //http request to api get token
      // const data = await Axios(HttpRequestConfig)
      //   .then((response) => {
      //     const res = response.data.food_predictions;
      //     return res;
      //   })
      //   .catch((e) => {
      //     console.log("Opps!", e);
      //     return null;
      //   });

      // TODO: Possible error point leaving old code for quick revert
      const data = await makeAxiosRequest(HttpRequestConfig);
      return data?.food_predictions ?? data;
    },
    GetHealthProfile: async (token) => {
      const HttpRequestConfig = ConfigGenerator.ProfileHttpRequestConfig(
        undefined,
        token,
        Constant.METHOD.GET
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetHealthRecords: async (token) => {
      const HttpRequestConfig = ConfigGenerator.CreateGetHealthRecordsHttpRequestConfig(
        token,
        Constant.METHOD.GET
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetMeals: async (token) => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.GetMealsHttpRequestConfig(
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetMealById: async (mealId, token) => {
      //generate a http request config for http request
      const HttpRequestConfig = ConfigGenerator.GetMealByIdHttpRequestConfig(
        mealId,
        token
      );
      //http request to api get token

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetUserMe: async (token) => {
      const HttpRequestConfig = ConfigGenerator.GetUserDetailsMeHttpRequestConfig(
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetUserById: async (userId, token) => {
      // This API always returns status 200 with null data if not found
      const HttpRequestConfig = ConfigGenerator.GetUserByIdHttpRequestConfig(
        token,
        userId
      );
      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetClinicians: async (token) => {
      const HttpRequestConfig = ConfigGenerator.GetCliniciansHttpRequestConfig(
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetLatestHealthRecord: async (token) => {
      const HttpRequestConfig = ConfigGenerator.GetLatestHealthRecordHttpRequestConfig(
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetAssignedClinicians: async (token) => {
      const HttpRequestConfig = ConfigGenerator.GetAssignedCliniciansHttpRequestConfig(
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetAllClinicianAssignments: async (token) => {
      const HttpRequestConfig = ConfigGenerator.GetClinicianAssignmentsHttpRequestConfig(
        token
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    GetClinicianAcceptAssignment: async (assignId, token) => {
      const HttpRequestConfig = ConfigGenerator.GetClinicianAcceptAssignmentHttpRequestConfig(
        assignId,
        token
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    GetClinicianDeleteAssignment: async (assignId, token) => {
      const HttpRequestConfig = ConfigGenerator.GetClinicianDeleteAssignmentHttpRequestConfig(
        assignId,
        token
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    GetClinicianAssignedUserHealthProfile: async (userid, token) => {
      const HttpRequestConfig = ConfigGenerator.GetClinicianAssignedUserHealthProfileHttpRequestConfig(
        userid,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    GetClinicianAssignedUserHealthRecords: async (userid, token) => {
      const HttpRequestConfig = ConfigGenerator.GetClinicianAssignedUserHealthRecordsHttpRequestConfig(
        userid,
        token
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    GetClinicianAssignedUserMealRecords: async (userid, token) => {
      const HttpRequestConfig = ConfigGenerator.GetClinicianAssignedUserMealRecordsHttpRequestConfig(
        userid,
        token
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    GetClinicianAssignedSingleUserHealthRecord: async (recordid, token) => {
      const HttpRequestConfig = ConfigGenerator.GetClinicianAssignedUserViewHealthRecordHttpRequestConfig(
        recordid,
        token
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    GetClinicianAssignedSingleUserMealRecord: async (mealid, token) => {
      const HttpRequestConfig = ConfigGenerator.GetClinicianAssignedUserViewMealRecordHttpRequestConfig(
        mealid,
        token
      );

      return await makeV2AxiosRequest(HttpRequestConfig);
    },
    GetTrendAnalyserFeatures: async () => {
      const HttpRequestConfig = ConfigGenerator.ClinicianGetTrendAnalyserFeatures();
      return await makeV2AxiosRequest(HttpRequestConfig);
    },
  },
  Put: {
    UpdateBloodGlucose: async (blood, id, token) => {
      const HttpRequestConfig = ConfigGenerator.UpdateBloodGlucoseHttpRequestConfig(
        blood,
        id,
        token
      );
      // const data = await Axios(HttpRequestConfig)
      //   .then((response) => {
      //     const res = response.data.food_predictions;
      //     return res;
      //   })
      //   .catch((e) => {
      //     console.log("Opps!", e);
      //     return null;
      //   });

      // TODO: Possible error point leaving old code for quick revert
      const data = await makeAxiosRequest(HttpRequestConfig);
      return data?.food_predictions ?? data;
    },
    UpdateHealthRecord: async (record, record_id, token) => {
      const HttpRequestConfig = ConfigGenerator.UpdateHealthRecordsHttpRequestConfig(
        record,
        record_id,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    UpdateHealthProfile: async (token, profile) => {
      const HttpRequestConfig = ConfigGenerator.ProfileHttpRequestConfig(
        profile,
        token,
        Constant.METHOD.PUT
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    UpdateFoodItem: async (foodItemId, foodItem, token) => {
      const HttpRequestConfig = ConfigGenerator.UpdateFoodItemHttpRequestConfig(
        foodItemId,
        foodItem,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    UpdateUserMe: async (token, userdata) => {
      const HttpRequestConfig = ConfigGenerator.UpdateUserDetailsHttpRequestConfig(
        userdata,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
  },
  Delete: {
    DeleteFoodItem: async (mealId, foodItemId, token) => {
      const HttpRequestConfig = ConfigGenerator.DeleteFoodItemHttpRequestConfig(
        mealId,
        foodItemId,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    DeleteMeal: async (mealId, token) => {
      const HttpRequestConfig = ConfigGenerator.DeleteMealHttpRequestConfig(
        mealId,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    DeleteHealthRecord: async (record_id, token) => {
      const HttpRequestConfig = ConfigGenerator.DeleteHealthRecordHttpRequestConfig(
        record_id,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
    CancelAssignedClinician: async (clinician_assignment_id, token) => {
      const HttpRequestConfig = ConfigGenerator.CancelClinicianAssignmentHttpRequestConfig(
        clinician_assignment_id,
        token
      );

      return await makeAxiosRequest(HttpRequestConfig);
    },
  },
};

export default HttpRequest;
