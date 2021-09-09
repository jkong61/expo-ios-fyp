import React from "react";
import {
  Dialog,
  Portal,
  Paragraph,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { actuatedNormalizeFontSize } from "@utilities/helpers"; 
import useLoading from "@utilities/customhooks/useLoading";

export default function ConfirmCancelDialog (
  {
    title,
    content,
    visible,
    onDismiss,
    onConfirm = undefined,
    onDecline = undefined,
    positiveText = undefined,
    neutralText = undefined,
    negativeText = undefined
  }
) {

  const [asyncConfirm, loadingConfirm] = useLoading(onConfirm);
  const [asyncDecline, loadingDecline] = useLoading(onDecline);
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>{title}</Dialog.Title>
        <View style={styles.dialogcontainer}>
          <Dialog.Content>
            {loadingConfirm || loadingDecline ? 
              <ActivityIndicator size={"large"}/> : 
              <Paragraph>{content}</Paragraph> 
            }
          </Dialog.Content>
          <Dialog.Actions style={styles.buttoncontainer}>
            <Button labelStyle={styles.buttonText} disabled={loadingConfirm || loadingDecline} onPress={asyncConfirm}>
              {positiveText || "OK"}
            </Button>
            <Button labelStyle={styles.buttonText} disabled={loadingConfirm || loadingDecline} onPress={onDismiss}>
              {neutralText || "Cancel"}
            </Button>
            {onDecline && <Button labelStyle={styles.buttonText} disabled={loadingConfirm || loadingDecline} onPress={asyncDecline}>
              {negativeText}
            </Button>}
          </Dialog.Actions>
        </View>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: actuatedNormalizeFontSize(16)
  },
  buttoncontainer: {
    justifyContent: "space-evenly"
  },
  dialogcontainer: {
    height: "auto"
  }
});