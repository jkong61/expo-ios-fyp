import * as helpers from "./helpers";
import { Platform } from "react-native";

describe("Utilities ISO Time Helpers", () => {
  beforeAll(() => 
    Platform.OS = "default"
  );

  test("Getting date from valid ISO String", () => {
    const ISOString = "2020-10-10T09:24:43.287288";
    const dateObj = helpers.getDateObjFromISOString(ISOString);
    expect(dateObj).toBeTruthy();
  });

  test("Getting data from valid ISO String", () => {
    const ISOString = "2020-10-10T09:24:43.287288";
    const dateObj = helpers.getDateObjFromISOString(ISOString);
    expect(dateObj.year).toBe("2020");
    expect(dateObj.day).toBe("10");
    expect(dateObj.month).toBe("Oct");
  });

  test("Getting time from valid ISO String", () => {
    const ISOString = "2020-10-12T08:59:35Z";
    const dateObj = helpers.getDateObjFromISOString(ISOString);
    expect(dateObj.time).toMatch("08:59:35");
  });

  test("Getting time from valid ISO String", () => {
    const ISOString = "2020-10-12T08:59:35+02:00";
    const dateObj = helpers.getDateObjFromISOString(ISOString);
    expect(dateObj.time).toMatch("06:59:35");
  });

  // very reliant on device time location
  // test("Getting time from valid ISO String", () => {
  //   const ISOString = '2020-10-12T10:59:35';
  //   const dateObj = helpers.getDateObjFromISOString(ISOString);
  //   expect(dateObj.time).toMatch("02:59:35");
  // });

  test("Getting empty date from invalid ISO String", () => {
    const ISOString = "SomeRandomStringThatIsNotISOTime";
    const dateObj = helpers.getDateObjFromISOString(ISOString);

    // Checks if dateOBj is empty
    expect(Object.keys(dateObj).length === 0).toBeTruthy();
  });
});

describe("Other Utilities", () => {
  test("Splitting Email", () => {
    const email = "101101101@email.com";
    const username = helpers.getEmailUserName(email);
    expect(username).toMatch("101101101");
  });

  test("Splitting Email", () => {
    const email = "somegibberishwithoutalias";
    const username = helpers.getEmailUserName(email);
    expect(username).not.toMatch("somethingelse");
  });

  test("Empty String", () => {
    const emptystring = "";
    expect(helpers.stringIsNotEmpty(emptystring)).toBe(undefined);
  });

  test("Undefined String", () => {
    const emptystring = undefined;
    expect(helpers.stringIsNotEmpty(emptystring)).toBe(undefined);
  });

  test("Null String", () => {
    const emptystring = null;
    expect(helpers.stringIsNotEmpty(emptystring)).toBe(undefined);
  });

  test("Valid String", () => {
    const emptystring = "mystring";
    expect(helpers.stringIsNotEmpty(emptystring)).toBe(emptystring);
  });

  test("Mock Promise Resolved API", async () => {
    await expect(helpers.asyncDelay(1)).resolves.toBe("completed");
  });

  test("Mock Promise Rejected API", async () => {
    await expect(helpers.asyncDelay(1, true)).rejects.toThrow("failed");
  });

  test("Test Date Strings, 1990-05-09, should pass", () => {
    const datedata = helpers.getDatefromString("1990-05-09");
    expect(datedata.error).toBeFalsy();
    // error is false
  });

  test("Test Date Strings, 19900509, should fail", () => {
    const datedata = helpers.getDatefromString("19900509");
    expect(datedata.error).toBeTruthy();
    // error is true
  });

  test("Test Date Strings, 1990.05.09, should fail", () => {
    const datedata = helpers.getDatefromString("1990.05.09");
    expect(datedata.error).toBeTruthy();
    // error is true
  });

  test("Test Date Strings, 1990.05.310, should fail", () => {
    const datedata = helpers.getDatefromString("1990.05.310");
    expect(datedata.error).toBeTruthy();
    // error is true
  });
});
