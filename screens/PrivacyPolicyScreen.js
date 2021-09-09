import React from "react";
import { View, StyleSheet, Linking, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import { BackButton } from "@components";
import { useDeviceInfoProvider, DeviceType } from "@config/DeviceInfoProvider";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ListRender = (data) => {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={{ color: theme.colors.subtext }}>{"\u2022"}</Text>
      <Text style={{ flex: 1, paddingLeft: 5, color: theme.colors.subtext }}>
        {data}
      </Text>
    </View>
  );
};

const PrivacyPolicyScreen = () => {
  const theme = useTheme();
  const { deviceInfo } = useDeviceInfoProvider();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    title: {
      marginTop: hp("4%"),
      marginBottom: hp("2%"),
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("6%") : wp("4%"),
      alignSelf: "center",
    },
    body: {
      padding: wp("4.5%"),
    },
    section: {
      marginBottom: hp("3%"),
    },
    headerText: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.5%") : wp("3%"),
      fontWeight: "bold",
      marginBottom: hp("1%"),
    },
    headerText2: {
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4.2%") : wp("2.8%"),
      fontWeight: "500",
      marginVertical: hp("1%"),
    },
    bodyText: {
      marginBottom: hp("0.5%"),
      color: theme.colors.subtext,
      fontSize:
        deviceInfo.deviceType === DeviceType.PHONE ? wp("4%") : wp("2.5%"),
    },
  });

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Privacy Policy</Text>
      <ScrollView>
        <View style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.headerText}>Version Date: 1 December 2020</Text>
            <Text style={styles.bodyText}>
              This privacy policy governs your use of the software application
              HealthApp (“Application”) for mobile devices that was created by
              Jason Chew. The Application's primary purpose is to record and
              manage health and dietary information for diabetics.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>
              What information does the Application obtain and how is it used?
            </Text>
            <Text style={styles.headerText2}>User Provided Information</Text>
            <Text style={styles.bodyText}>
              The Application obtains the information you provide when you
              download and register for the Application. Registration is
              required to access the functionality offered by the Application.
            </Text>
            <Text style={styles.bodyText}>
              When you register and use the Application, you generally provide
              (a) your email address, name (optional), contact information
              (optional), and password; (b) information you enter into our
              system when using the Application, such as health record and
              dietary intake information.
            </Text>
            <Text style={styles.bodyText}>
              We may also use the information you provided us to contact you
              from time to time to provide you with important information and
              required notices.
            </Text>
            <Text style={styles.headerText2}>
              Automatically Collected Information
            </Text>
            <Text style={styles.bodyText}>
              In addition, the Application may collect certain information
              automatically, including, but not limited to, the type of mobile
              device you use, your mobile devices unique device ID, the IP
              address of your mobile device, your mobile operating system, the
              type of mobile Internet browsers you use, and information about
              the way you use the Application.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>
              Does the Application collect precise real time location
              information of the device?
            </Text>
            <Text style={styles.bodyText}>
              This Application does not collect precise information about the
              location of your mobile device.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>
              Do third parties see and/or have access to information obtained by
              the Application?
            </Text>
            <Text style={styles.bodyText}>
              Only aggregated, anonymized data is periodically transmitted to
              external services to help us improve the Application and our
              service. We will share your information with third parties only in
              the ways that are described in this privacy statement.
            </Text>
            <Text style={styles.bodyText}>
              We may disclose User Provided and Automatically Collected
              Information:
            </Text>
            {ListRender(
              `as required by law, such as to comply with a subpoena, or similar legal process.`
            )}
            {ListRender(
              `when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.`
            )}
            {ListRender(
              `with our trusted services providers who work on our behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.`
            )}
            {ListRender(
              `if HealthApp is involved in a merger, acquisition, or sale of all or a portion of its assets, you will be notified via email and/or a prominent notice on our Web site of any change in ownership or uses of this information, as well as any choices you may have regarding this information.`
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>What are my opt-out rights?</Text>
            <Text style={styles.bodyText}>
              You can stop all collection of information by the Application
              easily by uninstalling the Application. You may use the standard
              uninstall processes as may be available as part of your mobile
              device or via the mobile application marketplace or network. You
              can also request to opt-out via email, at{" "}
              <Text
                onPress={() =>
                  Linking.openURL("mailto:jtchew@swinburne.edu.my")
                }
                style={{ color: theme.colors.primary }}
              >
                jtchew@swinburne.edu.my
              </Text>
              .
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>
              Data Retention Policy, Managing Your Information
            </Text>
            <Text style={styles.bodyText}>
              We will retain User Provided data for as long as you use the
              Application and for a reasonable time thereafter. We will retain
              Automatically Collected information for up to 24 months and
              thereafter may store it in aggregate. If you’d like us to delete
              User Provided Data that you have provided via the Application,
              please contact us at{" "}
              <Text
                onPress={() =>
                  Linking.openURL("mailto:jtchew@swinburne.edu.my")
                }
                style={{ color: theme.colors.primary }}
              >
                jtchew@swinburne.edu.my
              </Text>{" "}
              and we will respond in a reasonable time. Please note that some or
              all of the User Provided Data may be required in order for the
              Application to function properly.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>Children</Text>
            <Text style={styles.bodyText}>
              We do not use the Application to knowingly solicit data from or
              market to children under the age of 13. If a parent or guardian
              becomes aware that his or her child has provided us with
              information without their consent, he or she should contact us at{" "}
              <Text
                onPress={() =>
                  Linking.openURL("mailto:jtchew@swinburne.edu.my")
                }
                style={{ color: theme.colors.primary }}
              >
                jtchew@swinburne.edu.my
              </Text>
              . We will delete such information from our files within a
              reasonable time.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>Security</Text>
            <Text style={styles.bodyText}>
              We are concerned about safeguarding the confidentiality of your
              information. We provide physical, electronic, and procedural
              safeguards to protect information we process and maintain. For
              example, we limit access to this information to authorized
              employees and contractors who need to know that information in
              order to operate, develop or improve our Application. Please be
              aware that, although we endeavor provide reasonable security for
              information we process and maintain, no security system can
              prevent all potential security breaches.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>Changes</Text>
            <Text style={styles.bodyText}>
              This Privacy Policy may be updated from time to time for any
              reason. We will notify you of any changes to our Privacy Policy by
              posting the new Privacy Policy at{" "}
              <Text
                onPress={() =>
                  Linking.openURL("https://www.healthapp.online/privacy-policy")
                }
                style={{ color: theme.colors.primary }}
              >
                https://www.healthapp.online/privacy-policy
              </Text>{" "}
              and informing you via email. You are advised to consult this
              Privacy Policy regularly for any changes, as continued use is
              deemed approval of all changes. You can check the history of this
              policy by viewing the{" "}
              <Text
                onPress={() =>
                  Linking.openURL(
                    "https://www.healthapp.online/privacy-policy/history"
                  )
                }
                style={{ color: theme.colors.primary }}
              >
                privacy policy version history
              </Text>
              .
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>Your Consent</Text>
            <Text style={styles.bodyText}>
              By using the Application, you are consenting to our processing of
              your information as set forth in this Privacy Policy now and as
              amended by us. "Processing,” means using cookies on a
              computer/hand held device or using or touching information in any
              way, including, but not limited to, collecting, storing, deleting,
              using, combining and disclosing information, all of which
              activities will take place in the Malaysia. If you reside outside
              the Malaysia your information will be transferred, processed and
              stored there under Malaysia privacy standards.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.headerText}>Contact us</Text>
            <Text style={styles.bodyText}>
              If you have any questions regarding privacy while using the
              Application, or have questions about our practices, please contact
              us via email at{" "}
              <Text
                onPress={() =>
                  Linking.openURL("mailto:jtchew@swinburne.edu.my")
                }
                style={{ color: theme.colors.primary }}
              >
                jtchew@swinburne.edu.my
              </Text>
              .
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;
