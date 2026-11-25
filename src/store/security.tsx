import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { initialDevices } from '@/mock/profile';
import type { TrustedDevice } from '@/types/profile';

/**
 * Trusted devices and the new sign-in alert on Security (37). Shared with Profile (34),
 * which shows "1 alert" until the sign-in is reviewed. In memory only.
 */
type SecurityContextValue = {
  devices: TrustedDevice[];
  /** The unreviewed new sign-in, if any. */
  alertDevice: TrustedDevice | null;
  /** "It was me": keep the device, clear the alert. */
  dismissAlert: () => void;
  removeDevice: (id: string) => void;
  /** Signs out every device except this one. */
  removeOtherDevices: () => void;
};

const SecurityContext = createContext<SecurityContextValue | null>(null);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState(initialDevices);
  const [alertDeviceId, setAlertDeviceId] = useState<string | null>('dev_macbook');

  const dismissAlert = useCallback(() => setAlertDeviceId(null), []);

  const removeDevice = useCallback((id: string) => {
    setDevices((current) => current.filter((device) => device.current || device.id !== id));
    setAlertDeviceId((current) => (current === id ? null : current));
  }, []);

  const removeOtherDevices = useCallback(() => {
    setDevices((current) => current.filter((device) => device.current));
    setAlertDeviceId(null);
  }, []);

  const value = useMemo(
    () => ({
      devices,
      alertDevice: devices.find((device) => device.id === alertDeviceId) ?? null,
      dismissAlert,
      removeDevice,
      removeOtherDevices,
    }),
    [devices, alertDeviceId, dismissAlert, removeDevice, removeOtherDevices]
  );

  return <SecurityContext.Provider value={value}>{children}</SecurityContext.Provider>;
}

export function useSecurity() {
  const value = useContext(SecurityContext);
  if (!value) throw new Error('useSecurity must be used inside <SecurityProvider>');
  return value;
}
