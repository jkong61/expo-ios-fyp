import React from "react";
import { StyleSheet, TouchableNativeFeedback, Image, View } from "react-native";
import { Card, Title, Text } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default LargeCardItem = (props) => {
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      <Card style={styles.card}>
        <View style={styles.cardcontent}>
          <Image style={styles.cardimage} source={props.source} />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
            }}
          >
            <Title style={styles.cardtitle}>{props.title}</Title>
            <Text style={styles.cardtext}>{props.paragraph}</Text>
          </View>
        </View>
      </Card>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    //marginTop: helpers.actuatedNormalizeSize(35),
    marginTop: hp("6%"),
    //height: dimension.height * 0.18,
    //height: helpers.actuatedNormalizeSize(140),
    height: hp("17%"),
    //width: "86%",
    width: wp("86%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    //padding: 8,
    padding: wp("1%"),
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardimage: {
    //padding: 5,
    padding: wp("0.8%"),
    width: "50%",
    backgroundColor: "transparent",
    //height: helpers.actuatedNormalizeSize(110),
    height: hp("14%"),
    resizeMode: "contain",
    //backgroundColor: "yellow",
  },
  cardcontent: {
    //padding: 8,
    padding: wp("1%"),
    flexDirection: "row",
    alignItems: "center",
  },
  cardtitle: {
    //lineHeight: 20,
    flexShrink: 1,
    //marginLeft: helpers.actuatedNormalizeFontSize(20),
    marginLeft: wp("5%"),
    fontWeight: "bold",
    //fontSize: helpers.actuatedNormalizeFontSize(15),
    fontSize: hp("1.9%"),
  },
  cardtext: {
    //marginLeft: helpers.actuatedNormalizeFontSize(20),
    marginLeft: wp("5%"),
    //fontSize: helpers.actuatedNormalizeFontSize(13),
    fontSize: hp("1.6%"),
  },
});
