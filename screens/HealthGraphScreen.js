import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Text } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import { useHealthProvider } from "@config/HealthProvider";
import { useMealProvider } from "@config/MealProvider";
import { LineChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";
import { Svg, Text as TextSVG, Rect } from "react-native-svg";
import { MyContainer, RowWrapper, BackButton } from "@components";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const months = [
  { label: "January", value: 0 },
  { label: "February", value: 1 },
  { label: "March", value: 2 },
  { label: "April", value: 3 },
  { label: "May", value: 4 },
  { label: "June", value: 5 },
  { label: "July", value: 6 },
  { label: "August", value: 7 },
  { label: "September", value: 8 },
  { label: "October", value: 9 },
  { label: "November", value: 10 },
  { label: "December", value: 11 },
];

const metrics = [
  { label: "Weight", value: 0, suffix: "kg" },
  { label: "Waist Circm.", value: 1, suffix: "cm" },
  { label: "Blood Glucose", value: 2, suffix: "mmol/L" },
];

// Used to adapter to process the healthstate records to be usable for graph/chart
// TODO: May be potentially buggy in current implementation
const GraphDataHandler = (
  healthstate,
  month = new Date().getMonth(),
  year = new Date().getFullYear()
) => {
  let avg_weights = [];
  let avg_circumferences = [];
  let avg_blood = [];
  let weeks = [[], [], [], [], []];
  let date_labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

  // Check what type of array we are handling, healthstate from HealthProvider has records field
  const dataarray = healthstate?.records ?? healthstate;

  //convert the date
  const healthdate = dataarray.map((health) =>
    // Modified date usually is latest update, will be null if there is no modifications fallback to date created
    helpers.getDateObjFromISOString(health.date_modified ?? health.date_created)
  );

  //get all healthyears
  let healthyears = [];
  if (healthdate.length > 0) {
    healthdate.map((d) => {
      if (!healthyears.some((y) => y.label == d.year)) {
        healthyears.push({ label: d.year, value: parseInt(d.year) });
      }
    });
  } else {
    const currentDate = new Date();
    healthyears.push({
      label: currentDate.getFullYear().toString(),
      value: currentDate.getFullYear(),
    });
  }

  //filtered by month & year
  const filteredData = [
    ...healthdate.map((d) => {
      if (d.monthNum == month && d.year == year) {
        return d;
      }
    }),
  ];

  // console.log(filteredData);

  //populate the record to particular group of number of week
  filteredData.map((mydate, index) => {
    if (mydate != undefined) {
      weeks[mydate.numOfWeek - 1].push(dataarray[index]);
    }
  });

  //count the average of weight in each weeks of the month
  let NoRecordIndexes = [];
  const isHealthState = !!healthstate?.records;

  weeks.forEach((week, index) => {
    if (week.length > 0) {
      if (isHealthState) {
        // For calculating average weight
        let total_weight = week.reduce((sum, obj) => sum + obj.weight, 0);
        let avg_weight = total_weight / week.length;
        avg_weights.push(avg_weight);

        // For calculating average waist circumference
        let total_circum = week.reduce(
          (sum, obj) => sum + obj.waist_circumference,
          0
        );
        let avg_circum = total_circum / week.length;
        avg_circumferences.push(avg_circum);
      } else {
        let total_glucose = week.reduce(
          (sum, obj) => sum + obj.blood_glucose,
          0
        );
        let avg_glucose = total_glucose / week.length;
        avg_blood.push(avg_glucose);
      }
    } else {
      //avg_weights.push(0);
      NoRecordIndexes.push(index);
    }
  });

  if (NoRecordIndexes.length != date_labels.length) {
    NoRecordIndexes.map((i) => {
      date_labels[i] = "";
    });
    date_labels = date_labels.filter(Boolean);
  } else {
    avg_weights = [0];
    avg_circumferences = [0];
    avg_blood = [0];
  }

  // console.log(avg_weights);

  // If the current year is not in the array, default to the first year in the array
  let correctedyear;
  if (!healthyears.some((y) => y.value === year)) {
    correctedyear = healthyears[0]?.value;
  }

  //initialize object for return
  let obj = {
    labels: date_labels,
    data: [avg_weights, avg_circumferences, avg_blood],
    healthyears: healthyears,
    month: month,
    year: correctedyear ?? year,
  };
  return obj;
};

// Graph Configuration for Chart
const graphConfig = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#6C63FF",
  backgroundGradientTo: "#9D97FF",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 10,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "3",
    stroke: "#8074FF",
  },
};

// Default tooltip state
const defaultToolTipStructure = {
  x: 0,
  y: 0,
  visible: false,
  value: 0,
};

// Custom DropDownPicker component
function MyDropDownPicker({
  items,
  style = undefined,
  defaultValue = undefined,
  containerStyle = undefined,
  ...pickerprops
}) {
  const [listItems, setListItems] = useState([
    {
      label: "",
      value: "",
    },
  ]);
  const [thisDefaultValue, setDefaultValue] = useState("");

  useEffect(() => {
    setListItems(items);
    setDefaultValue(defaultValue);
  }, [items, defaultValue]);

  return (
    <>
      <DropDownPicker
        {...pickerprops}
        defaultValue={thisDefaultValue}
        items={listItems}
        containerStyle={
          containerStyle || {
            height: helpers.actuatedNormalizeSize(40),
            width: helpers.actuatedNormalizeSize(134),
            marginBottom: helpers.actuatedNormalizeSize(20),
          }
        }
        style={style || { backgroundColor: "#fafafa" }}
        itemStyle={{
          justifyContent: "flex-start",
        }}
        dropDownMaxHeight={helpers.actuatedNormalizeSize(300)}
        dropDownStyle={{ backgroundColor: "#fafafa" }}
      />
    </>
  );
}

const HealthGraphScreen = () => {
  const styles = StyleProvider();
  const [healthstate] = useHealthProvider();
  const [mealState] = useMealProvider();

  // Initialize the initial data repo for graph from health state
  const [dataRepo, setDataRepo] = useState(healthstate);
  const [graphObject, setGraphObject] = useState(GraphDataHandler(dataRepo));
  const [selectedMonth, setSelectedMonth] = useState(graphObject.month);
  const [selectedYear, setSelectedYear] = useState(graphObject.year);
  const [selectedMetric, setSelectedMetric] = useState(0);

  let [tooltipPos, setTooltipPos] = useState(defaultToolTipStructure);

  let monthController;
  let yearController;
  let metricsController;

  const changeMonth = (item) => {
    setSelectedMonth(item.value);
    setGraphObject(GraphDataHandler(dataRepo, item.value, selectedYear));
  };

  const changeYear = (item) => {
    setSelectedYear(item.value);
    setGraphObject(GraphDataHandler(dataRepo, selectedMonth, item.value));
  };

  const changeMetric = (item) => {
    setSelectedMetric(item.value);
    if ([0, 1].includes(item.value)) {
      setDataRepo(healthstate);
      setGraphObject(
        GraphDataHandler(healthstate, selectedMonth, selectedYear)
      );
    } else {
      setDataRepo(mealState);
      setGraphObject(GraphDataHandler(mealState, selectedMonth, selectedYear));
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        monthController?.close?.();
        yearController?.close?.();
        metricsController?.close?.();
        setTooltipPos(defaultToolTipStructure);
      }}
    >
      <SafeAreaView style={styles.container}>
        <BackButton />
        {/* Header and Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Health Trend</Text>
        </View>

        {/* Body */}

        <View style={styles.body}>
          <MyContainer>
            <Text style={styles.subtitle}>
              Please select a month/year to view.
            </Text>
          </MyContainer>
          <RowWrapper style={styles.droplistwrapper}>
            {/* For months dropdown */}
            <View style={Platform.OS === "ios" ? { zIndex: 10 } : {}}>
              <MyDropDownPicker
                items={months}
                defaultValue={selectedMonth}
                controller={(instance) => (monthController = instance)}
                onChangeItem={changeMonth}
                onOpen={() => {
                  yearController?.close?.();
                  metricsController?.close?.();
                  setTooltipPos(defaultToolTipStructure);
                }}
                containerStyle={styles.containerStyle}
              />
            </View>

            {/* For year dropdown */}
            <View style={Platform.OS === "ios" ? { zIndex: 9 } : {}}>
              <MyDropDownPicker
                items={graphObject.healthyears}
                defaultValue={selectedYear}
                controller={(instance) => (yearController = instance)}
                onChangeItem={changeYear}
                onOpen={() => {
                  monthController?.close?.();
                  metricsController?.close?.();
                  setTooltipPos(defaultToolTipStructure);
                }}
                containerStyle={styles.containerStyle}
              />
            </View>

            {/* For metric dropdown */}
            <View style={Platform.OS === "ios" ? { zIndex: 8 } : {}}>
              <MyDropDownPicker
                items={metrics}
                defaultValue={selectedMetric}
                controller={(instance) => (metricsController = instance)}
                onChangeItem={changeMetric}
                onOpen={() => {
                  monthController?.close?.();
                  yearController?.close?.();
                  setTooltipPos(defaultToolTipStructure);
                }}
                containerStyle={styles.containerStyle}
              />
            </View>
          </RowWrapper>
          <LineChart
            data={{
              labels: graphObject.labels,
              datasets: [
                {
                  data: graphObject.data[selectedMetric],
                },
              ],
            }}
            width={wp("90%")}
            height={hp("45%")}
            yAxisInterval={1} // optional, defaults to 1
            yLabelsOffset={5}
            fromZero={true}
            chartConfig={graphConfig}
            style={styles.graph}
            onDataPointClick={
              (data) => {
                // check if we have clicked on the same point again
                let isSamePoint =
                  tooltipPos.x === data.x && tooltipPos.y === data.y;

                // if clicked on the same point again toggle visibility
                // else, render tooltip to new position and update its value
                isSamePoint
                  ? setTooltipPos((previousState) => ({
                      ...previousState,
                      value: data.value,
                      visible: !previousState.visible,
                    }))
                  : setTooltipPos({
                      x: data.x,
                      value: data.value,
                      y: data.y,
                      visible: true,
                    });
              } // end function
            }
            decorator={() =>
              tooltipPos.visible ? (
                <View>
                  <Svg>
                    <Rect
                      x={tooltipPos.x - 15}
                      y={tooltipPos.y + 10}
                      width="40"
                      height="30"
                      fill="black"
                    />
                    <TextSVG
                      x={tooltipPos.x + 5}
                      y={tooltipPos.y + 30}
                      fill="white"
                      fontSize={helpers.actuatedNormalizeFontSize(15)}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {tooltipPos.value}
                    </TextSVG>
                  </Svg>
                </View>
              ) : null
            }
          />
          <View>
            <Text style={styles.bottomGraphText}>
              Weekly Average {metrics[selectedMetric].label} (
              {metrics[selectedMetric].suffix}) of {months[selectedMonth].label}
              , {selectedYear}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
function StyleProvider() {
  const { deviceInfo } = useDeviceInfoProvider();
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    containerStyle: {
      height: deviceInfo.deviceType === DeviceType.PHONE ? hp("5%") : hp("4%"),
      width: deviceInfo.deviceType === DeviceType.PHONE ? wp("40%") : wp("25%"),
      marginBottom: helpers.actuatedNormalizeSize(20),
    },
    subtitle: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
      fontWeight: "bold",
    },
    droplistwrapper:
      Platform.OS === "ios"
        ? {
            zIndex: 10,
            justifyContent: "space-evenly",
          }
        : { justifyContent: "space-evenly" },
    title: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
      marginTop:
        deviceInfo.deviceType === DeviceType.PHONE ? hp("4%") : hp("1%"),
      marginBottom: hp("2%"),
    },
    header: {
      justifyContent: "center",
      alignSelf: "center",
    },
    body: {
      paddingBottom: 25,
      paddingHorizontal: "5%",
      flexGrow: 1,
      alignItems: "center",
    },
    graph: {
      marginHorizontal: helpers.actuatedNormalizeSize(10),
      borderRadius: 12,
      zIndex: -1,
    },
    bottomGraphText: {
      alignSelf: "center",
      marginTop: helpers.actuatedNormalizeSize(9),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("3%"),
      fontWeight: "bold",
    },
  });
}
export default HealthGraphScreen;
