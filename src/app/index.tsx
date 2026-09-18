import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { useUserSync } from "../../hooks/useUserSync";

export default function index() {
  const { isSignedIn, isLoaded } = useAuth();

  useUserSync();
  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(tabs)" />;
  return <Redirect href="/welcome" />;
}
