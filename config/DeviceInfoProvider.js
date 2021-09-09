import React, { useState, useEffect, createContext, useContext } from "react";
import * as Device from "expo-device";

export const defaultDeviceInfoState = { deviceType: null };

export const DeviceInfoContext = createContext(defaultDeviceInfoState);

export function useDeviceInfoProvider() {
  return useContext(DeviceInfoContext);
}

export const DeviceType = Device.DeviceType;

export function DeviceInfoProvider({ children }) {
  const [deviceInfo, setDeviceInfo] = useState(defaultDeviceInfoState);

  useEffect(() => {
    async function getDeviceType() {
      const type = await Device.getDeviceTypeAsync();
      setDeviceInfo({ deviceType: type });
    }
    getDeviceType();
  }, []);

  return (
    <DeviceInfoContext.Provider value={{ deviceInfo }}>
      {children}
    </DeviceInfoContext.Provider>
  );
}
