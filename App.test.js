import React from "react";
import renderer from "react-test-renderer";
import MainApplication from "./main/MainApplication";

jest.useFakeTimers();

describe("<MainApplication />", () => {
  it("App renders without crashing", () => {
    const rendered = renderer.create(<MainApplication />).toJSON();
    expect(rendered).toBeTruthy();
  });
});
