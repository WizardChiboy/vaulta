import { Alert, Platform } from 'react-native';

/**
 * Shows a simple message — used for simulated actions that have no screen yet.
 * React Native's Alert is a no-op on web, so the browser alert is used there.
 */
export function showMessage(title: string, message?: string) {
  if (Platform.OS === 'web') {
    globalThis.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
}

export type ConfirmOptions = {
  title: string;
  message?: string | undefined;
  confirmLabel: string;
  cancelLabel?: string | undefined;
  /** Red confirm button on iOS (sign out, remove device). */
  destructive?: boolean | undefined;
};

/**
 * Asks the user to confirm an action. Resolves true for the confirm button, false for
 * cancel (or dismissing the dialog). Uses the browser's confirm dialog on web.
 */
export function confirmAction({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
}: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(globalThis.confirm(message ? `${title}\n\n${message}` : title));
  }
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: cancelLabel, style: 'cancel', onPress: () => resolve(false) },
        {
          text: confirmLabel,
          style: destructive ? 'destructive' : 'default',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}
