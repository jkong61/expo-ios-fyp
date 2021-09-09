import React from "react";
//import { NotificationProvider } from "@config/NotificationProvider";
import { MealProvider } from "@config/MealProvider";
import { HealthProvider } from "@config/HealthProvider";
import { ClinicianListProvider } from "@config/ClinicianListProvider";
import { AssignedClinicianProvider } from "@config/AssignedClinicianProvider";
import { UserProvider } from "@config/UserDetailsProvider";
import { InputModalProvider } from "@components/InputModalProvider";
import { ClinicianProvider } from "@config/ClinicianProvider";
import { NutritionProvider } from "@config/NutritionProvider";

export default function DataProviders({ children }) {
  return (
    <UserProvider>
      <NutritionProvider>
        <ClinicianProvider>
          <InputModalProvider>
            <MealProvider>
              <ClinicianListProvider>
                <AssignedClinicianProvider>
                  <HealthProvider>{children}</HealthProvider>
                </AssignedClinicianProvider>
              </ClinicianListProvider>
            </MealProvider>
          </InputModalProvider>
        </ClinicianProvider>
      </NutritionProvider>
    </UserProvider>
  );
}
