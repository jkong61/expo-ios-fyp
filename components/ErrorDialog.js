import React from "react";
import {
  Dialog,
  Portal,
  Paragraph,
  Button,
} from "react-native-paper";

const ErrorDialog = ({
  visible,
  title,
  content,
  onPress,
  onDismiss = undefined,
  optionalCallback = undefined
}) => (
  <Portal>
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Paragraph>{content}</Paragraph>
      </Dialog.Content>
      <Dialog.Actions style={{ justifyContent: "center" }}>
        <Button labelStyle={{ fontSize: 18 }} onPress={() => {
          onPress();
          optionalCallback ? optionalCallback() : undefined;
        }}>
            OK
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default ErrorDialog;