import React from "react";
import { StyleSheet, TouchableNativeFeedback, View, Image } from "react-native";
import { Card, Title, Text } from "react-native-paper";
import * as helpers from "@utilities/helpers";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default CardItem = ({ source, title, paragraph, onPress }) => {
  return (
    <TouchableNativeFeedback onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.cardcontent}>
          <Card.Cover
            style={styles.cardimage}
            source={source}
            resizeMode="cover"
          />
          <Card.Content style={styles.cardcontent}>
            <Title style={styles.cardtitle}>{title}</Title>
            <Text style={styles.cardtext}>{paragraph}</Text>
          </Card.Content>
        </View>
      </Card>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    //height: helpers.actuatedNormalizeSize(190),
    width: "40%",
    height: hp("25%"),
    //width: wp("40%"),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    //padding: 8,
    padding: hp("1%"),
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardimage: {
    //height: helpers.actuatedNormalizeSize(95),
    padding: hp("1.0%"),
    backgroundColor: "transparent",
    height: hp("13%"),
    width: "100%",
    resizeMode: "contain",
  },
  cardcontent: {
    //marginTop: 10,
    marginTop: hp("0.7%"),
  },
  cardtitle: {
    fontWeight: "bold",
    //fontSize: helpers.actuatedNormalizeFontSize(15),
    fontSize: hp("1.9%"),
  },
  cardtext: {
    //fontSize: helpers.actuatedNormalizeFontSize(13),
    fontSize: hp("1.6%"),
  },
});
