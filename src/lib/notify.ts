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
