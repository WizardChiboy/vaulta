import { Redirect } from 'expo-router';

// The app opens on the welcome screen until the signed-in area exists.
export default function Index() {
  return <Redirect href="/welcome" />;
}
