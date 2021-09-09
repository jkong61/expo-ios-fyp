import React, { memo, useContext } from "react";
import { StyleSheet, View } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon2 from "react-native-vector-icons/Ionicons";
import { AuthContext } from "@config/ContextHelper";
import { useHealthProvider } from "@config/HealthProvider";
import { useTheme } from "react-native-paper";
import { AVATAR, AVATAR2 } from "@assets";
import { useUserProvider } from "@config/UserDetailsProvider";
import * as helpers from "@utilities/helpers";

function DrawerContent(props) {
  const [healthState] = useHealthProvider();
  const [userDetails] = useUserProvider();
  //get content
  const {
    authContext: { signOut, changeTheme },
  } = React.useContext(AuthContext);

  //get theme properties
  const theme = useTheme();

  //render
  return (
    <View style={{ flex: 1 }}>
      {console.log("drawer rendering!")}

      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                alignItems: "center",
              }}
            >
              <Avatar.Image
                source={
                  healthState.profile?.gender == "Female" ? AVATAR : AVATAR2
                }
                size={50}
              />
              <View style={{ marginLeft: 15 }}>
                <Title style={styles.title}>
                  {helpers.getFirstName(userDetails.name) ??
                    helpers.getEmailUserName(userDetails.email) ??
                    "User"}
                </Title>
                <Caption style={styles.caption}>
                  {userDetails.account_type
                    ? "Clinician"
                    : "Normal User | Patient"}
                </Caption>
              </View>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => {
                userDetails.account_type
                  ? props.navigation.navigate("Home")
                  : props.navigation.navigate("HomeTab", { screen: "Home" });
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                userDetails.account_type
                  ? props.navigation.navigate("Profile")
                  : props.navigation.navigate("HealthNavigator", {
                      screen: "HealthProfile",
                    });
              }}
            />
            {/* Render only if the user is a patient */}
            {/* {!userDetails.account_type && <DrawerItem
              icon={({ color, size }) => (
                <Icon name="doctor" color={color} size={size} />
              )}
              label="Clinician"
              onPress={() => props.navigation.navigate("ClinicianNavigator")}
            />} */}
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="lock-reset" color={color} size={size} />
              )}
              label="Change Password"
              onPress={() => props.navigation.navigate("Change")}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon2 name="settings-outline" color={color} size={size} />
              )}
              label="Settings"
              onPress={() => props.navigation.navigate("Setting")}
            />
          </Drawer.Section>
          {/* <Drawer.Section title="Preferences">
            <TouchableRipple onPress={() => changeTheme(!theme.dark)}>
              <View style={styles.preference}>
                <Text>Dark Theme</Text>
                <View pointerEvents="none">
                  <Switch value={theme.dark} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section> */}
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => signOut()}
        />
      </Drawer.Section>
    </View>
  );
}

//styles
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
});

export default memo(DrawerContent);
