import { useAuth } from "@clerk/expo";
import { router } from "expo-router";

import { Pressable, Text, View } from "react-native";

export default function profile() {
  const { signOut } = useAuth();

  const HandleSignOut = async () => {
    try {
      await signOut();
      router.replace("/Auth/SignIn");
    } catch (error) {
      console.error("error signing out:", error);
    }
  };
  return (
    <View>
      <Text>profile</Text>

      <View>
        <Pressable onPress={HandleSignOut} className="bg-yellow rounded-lg">
          <Text className="text-black py-2 text-center t">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}
