import * as Constant from "./Constant";

/**
 * Generates new HTTP Configuration Object
 * @param {string} method - The method used to call the endpoint GET, POST, PUT, DELETE.
 * @param {string} url - The URL of the endpoint. (e.g. "profile/")
 * @param {string} contentType - The Header content type to be used. (i.e. "Content-Type: application/x-www-form-urlencoded", "Content-Type: application/json")
 * @param {Object} data - The data to be passed into the HTTP Request body.
 * @param {string} token - The Authorization Token to be passed to the endpoint.
 * @param {string} params - Parameters to be passed to the endpoint.
 */
class Config {
  constructor(
    method,
    url,
    contentType,
    data = null,
    token = null,
    params = null
  ) {
    this.method = method;
    this.url = url;
    this.data = data ?? undefined;
    this.timeout = 10 * 1000; // 10 seconds timeout if the server is responding
    this.params = params;
    this.headers["Content-Type"] = contentType;
    this.headers.Authorization = token ? ` Bearer ${token}` : null;
  }
  baseURL = Constant.BASE_URL;
  headers = {
    Authorization: null,
  };
}

export const LoginHttpRequestConfig = (username, password) => {
  //create an instance of form data
  let body = new FormData();
  body.append("username", username);
  body.append("password", password);

  return new Config(
    Constant.METHOD.POST,
    Constant.URL.LOGIN,
    Constant.CONTENT_TYPE.FORM,
    body
  );
};

export const SignUpHttpRequestConfig = (email, password) => {
  //create an instance of data
  let body = {
    email: email,
    password: password,
  };

  return new Config(
    Constant.METHOD.POST,
    Constant.URL.SIGNUP,
    Constant.CONTENT_TYPE.JSON,
    body
  );
};

export const FoodDetectHttpRequestConfig = (image, token) => {
  //create body for http request
  let body = { data: image };

  return new Config(
    Constant.METHOD.POST,
    Constant.URL.FOODDETECT,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};

export const CreateMealHttpRequestConfig = (image, token) => {
  //create body for http request
  let body = { image: image };

  return new Config(
    Constant.METHOD.POST,
    Constant.URL.MEAL,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};
export const CreateFoodItemHttpRequestConfig = (foodItem, meal_id, token) => {
  //create body for http request
  let body = {
    food_id: foodItem.id == null ? "dummy" : foodItem.id,
    new_food_type: foodItem.id == null ? foodItem.name : null,
    volume_consumed: foodItem.volume_consumed,
    per_unit_measurement: foodItem.quantity,
    measurement_suffix: foodItem.measurement.value,
  };

  return new Config(
    Constant.METHOD.POST,
    Constant.URL.MEAL + meal_id + "/" + Constant.URL.FOODITEM,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};
export const UpdateBloodGlucoseHttpRequestConfig = (blood, meal_id, token) => {
  //create body for http request
  let body = {
    blood_glucose: blood,
  };

  return new Config(
    Constant.METHOD.PUT,
    Constant.URL.MEAL + meal_id + "/" + Constant.URL.BLOODGLUCOSE,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};
export const UpdateFoodItemHttpRequestConfig = (
  foodItemId,
  foodItem,
  token
) => {
  //create body for http request
  let body = {
    food_id: foodItem.id == null ? "dummy" : foodItem.id,
    new_food_type: foodItem.id == null ? foodItem.name : null,
    volume_consumed: foodItem.volume_consumed,
    per_unit_measurement: foodItem.quantity,
    measurement_suffix: foodItem.measurement.value,
  };

  return new Config(
    Constant.METHOD.PUT,
    Constant.URL.FOODITEM + foodItemId,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};
export const GetFoodsHttpRequestConfig = (skip) => {
  //create body for http request
  const params = {
    skip: skip,
  };
  //assign method to http request config
  return new Config(
    Constant.METHOD.GET,
    Constant.URL.FOOD,
    Constant.CONTENT_TYPE.JSON,
    null,
    null,
    params
  );
};

export const GetFoodIdsStringHttpRequestConfig = () =>
  //create body for http request
  new Config(
    Constant.METHOD.GET,
    Constant.URL.GETFOODIDS,
    Constant.CONTENT_TYPE.JSON
  );

export const GetPredictionsIdHttpRequestConfig = (id, token) =>
  //assign method to http request config
  new Config(
    Constant.METHOD.GET,
    Constant.URL.MEAL + id,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const GetCliniciansHttpRequestConfig = (token) =>
  //assign method to http request config
  new Config(
    Constant.METHOD.GET,
    Constant.URL.USER + "/" + Constant.URL.CLINICIAN,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const GetAssignedCliniciansHttpRequestConfig = (token) =>
  //assign method to http request config
  new Config(
    Constant.METHOD.GET,
    Constant.URL.ASSIGNED_CLINICIAN,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

// Gets all the user assigned to this clinician
export const GetClinicianAssignmentsHttpRequestConfig = (token) =>
  new Config(
    Constant.METHOD.GET,
    Constant.URL.CLINICIAN_ASSIGNMENTS,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

// Get configuration to accept clinician assignment
export const GetClinicianAcceptAssignmentHttpRequestConfig = (
  assignmentid,
  token
) => {
  const url = `${Constant.URL.CLINICIAN_ASSIGNMENTS}${assignmentid}/accept`;
  return new Config(
    Constant.METHOD.GET,
    url,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );
};

// Get configuration to delete clinician assignment
export const GetClinicianDeleteAssignmentHttpRequestConfig = (
  assignmentid,
  token
) => {
  const url = `${Constant.URL.CLINICIAN_ASSIGNMENTS}${assignmentid}/decline`;
  return new Config(
    Constant.METHOD.GET,
    url,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );
};

// Get configuration to retrieve user Health Profile
export const GetClinicianAssignedUserHealthProfileHttpRequestConfig = (
  userid,
  token
) => {
  const url = `${Constant.URL.CLINICIAN_ASSIGNED_USERS}${userid}/health-profile/`;
  return new Config(
    Constant.METHOD.GET,
    url,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );
};

// Get configuration to retrieve user Health Records
export const GetClinicianAssignedUserHealthRecordsHttpRequestConfig = (
  userid,
  token
) => {
  const url = `${Constant.URL.CLINICIAN_ASSIGNED_USERS}${userid}/health-records/`;
  return new Config(
    Constant.METHOD.GET,
    url,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );
};

// Get configuration to retrieve user Meal Records
export const GetClinicianAssignedUserMealRecordsHttpRequestConfig = (
  userid,
  token
) => {
  const url = `${Constant.URL.CLINICIAN_ASSIGNED_USERS}${userid}/meals/`;
  return new Config(
    Constant.METHOD.GET,
    url,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );
};

// Get configuration to retrieve user single Health Records
export const GetClinicianAssignedUserViewHealthRecordHttpRequestConfig = (
  recordid,
  token
) => {
  const url = `${Constant.URL.CLINICIAN_VIEW_HEALTH_RECORD}${recordid}`;
  return new Config(
    Constant.METHOD.GET,
    url,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );
};

// Get configuration to retrieve user single Meal Records
export const GetClinicianAssignedUserViewMealRecordHttpRequestConfig = (
  mealid,
  token
) => {
  const url = `${Constant.URL.CLINICIAN_VIEW_MEAL_RECORD}${mealid}`;
  return new Config(
    Constant.METHOD.GET,
    url,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );
};

/**
 * Http Configuration for Profile operations, One function based on request method
 * @param {*} profile pass json data
 * @param {*} token authentication token
 * @param {*} method Pass appropriate constant to perform, POST: Create, PUT: Update, GET: Retrieve data
 */
export const ProfileHttpRequestConfig = (profile, token, method) => {
  //create body for http request
  let body = null;
  if (profile && method != Constant.METHOD.GET) {
    body = {
      date_of_birth: profile.date_of_birth,
      gender: profile.gender,
      height: profile.height,
      ethnicity: profile.ethnicity,
      family_history_diabetes_non_immediate:
        profile.family_history_diabetes_non_immediate,
      family_history_diabetes_parents: profile.family_history_diabetes_parents,
      family_history_diabetes_siblings:
        profile.family_history_diabetes_siblings,
      family_history_diabetes_children:
        profile.family_history_diabetes_children,
      high_blood_glucose_history: profile.high_blood_glucose_history,
      high_blood_pressure_medication_history:
        profile.high_blood_pressure_medication_history,
    };
  }

  return new Config(
    method,
    Constant.URL.PROFILE,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};

export const GetMealsHttpRequestConfig = (token) =>
  //assign method to http request config
  new Config(
    Constant.METHOD.GET,
    Constant.URL.MEAL,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const CreateGetHealthRecordsHttpRequestConfig = (
  token,
  method,
  record = undefined
) => {
  let body = null;
  if (record && method === Constant.METHOD.POST) {
    console.info("Adding Health Record data");
    body = {
      waist_circumference: record.waist_circumference,
      weight: record.weight,
      blood_pressure_medication: record.blood_pressure_medication,
      physical_exercise_hours: record.physical_exercise_hours,
      physical_exercise_minutes: record.physical_exercise_minutes,
      smoking: record.smoking,
      vegetable_fruit_berries_consumption:
        record.vegetable_fruit_berries_consumption,
      systolic_pressure: record.systolic_pressure,
      fasting_blood_glucose: record.fasting_blood_glucose,
      hdl_cholesterol: record.hdl_cholesterol,
      triglycerides: record.triglycerides,
    };
  }

  return new Config(
    method,
    Constant.URL.HEALTHRECORD,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};

export const GetMealByIdHttpRequestConfig = (mealId, token) =>
  //assign method to http request config
  new Config(
    Constant.METHOD.GET,
    Constant.URL.MEAL + mealId,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const DeleteFoodItemHttpRequestConfig = (mealId, foodItemId, token) =>
  //assign method to http request config
  new Config(
    Constant.METHOD.DELETE,
    Constant.URL.MEAL + mealId + "/" + Constant.URL.FOODITEM + foodItemId,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const UpdateHealthRecordsHttpRequestConfig = (
  record,
  record_id,
  token
) => {
  let body = {
    waist_circumference: record.waist_circumference,
    weight: record.weight,
    blood_pressure_medication: record.blood_pressure_medication,
    physical_exercise_hours: record.physical_exercise_hours,
    physical_exercise_minutes: record.physical_exercise_minutes,
    smoking: record.smoking,
    vegetable_fruit_berries_consumption:
      record.vegetable_fruit_berries_consumption,
    systolic_pressure: record.systolic_pressure,
    fasting_blood_glucose: record.fasting_blood_glucose,
    hdl_cholesterol: record.hdl_cholesterol,
    triglycerides: record.triglycerides,
  };
  //assign data to http request config

  return new Config(
    Constant.METHOD.PUT,
    `${Constant.URL.HEALTHRECORD}${record_id}`,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};

export const DeleteMealHttpRequestConfig = (mealId, token) =>
  //assign method to http request config
  new Config(
    Constant.METHOD.DELETE,
    Constant.URL.MEAL + mealId,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const DeleteHealthRecordHttpRequestConfig = (record_id, token) =>
  //assign method to http request config
  new Config(
    Constant.METHOD.DELETE,
    `${Constant.URL.HEALTHRECORD}${record_id}`,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const GetUserDetailsMeHttpRequestConfig = (token) =>
  //assign method to http request config
  new Config(
    Constant.METHOD.GET,
    `${Constant.URL.USER}/me`,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const UpdateUserDetailsHttpRequestConfig = (data, token) => {
  let body = {
    name: data.name,
    contact_information: data.contact_information,
  };

  return new Config(
    Constant.METHOD.PUT,
    `${Constant.URL.USER}/me`,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};

export const ChangePasswordHttpRequestConfig = (data, token) => {
  let body = {
    current_password: data.oldpassword,
    new_password: data.newpassword,
  };

  return new Config(
    Constant.METHOD.POST,
    Constant.URL.PASSWORDCHANGE,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};

export const GetLatestHealthRecordHttpRequestConfig = (token) =>
  new Config(
    Constant.METHOD.GET,
    `${Constant.URL.HEALTHRECORD}latest`,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const GetUserByIdHttpRequestConfig = (token, userid) =>
  new Config(
    Constant.METHOD.GET,
    `${Constant.URL.USER}/${userid}`,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );

export const AssignClinicianHttpRequestConfig = (clinician_id, token) => {
  let body = {
    clinician_id: clinician_id,
  };
  return new Config(
    Constant.METHOD.POST,
    `${Constant.URL.USER}/${Constant.URL.CLINICIAN}`,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};

export const CancelClinicianAssignmentHttpRequestConfig = (
  clinician_assignment_id,
  token
) => {
  return new Config(
    Constant.METHOD.DELETE,
    `${Constant.URL.USER}/${Constant.URL.CLINICIAN}${clinician_assignment_id}`,
    Constant.CONTENT_TYPE.JSON,
    null,
    token
  );
};

export const ClinicianGetTrendAnalyserFeatures = () =>
  new Config(
    Constant.METHOD.GET,
    `${Constant.URL.TREND_ANALYSER}features/`,
    Constant.CONTENT_TYPE.JSON
  );

export const ClinicianPostTrendAnalyserGenerateReport = (params, token) => {
  let body = {
    selected_features: params.selected_features || [],
    ranking_type_top_n: params.ranking_type_top_n || true,
    ranking_ascending: params.ranking_ascending || true,
    threshold: params.threshold || 0,
  };
  return new Config(
    Constant.METHOD.POST,
    `${Constant.URL.TREND_ANALYSER}generate-report/`,
    Constant.CONTENT_TYPE.JSON,
    body,
    token
  );
};

export const UpdateExpoPushToken = (push_token, auth_token) => {
  let body = {
    token: push_token,
  };
  return new Config(
    Constant.METHOD.POST,
    Constant.URL.PUSHTOKEN,
    Constant.CONTENT_TYPE.JSON,
    body,
    auth_token
  );
};
