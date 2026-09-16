import WelcomeImage from "@/assets/images/welcome.png";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, Text, View } from "react-native";

export default function Welcome() {
  const goNext = () => router.replace("/Auth/SignUp");
  const goSkip = () => router.replace("/Auth/SignIn");

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Upar image */}
      <View className="h-[62%] w-full">
        <Image
          source={WelcomeImage}
          className="h-full w-full"
          resizeMode="cover"
        />

        {/* Gradient image ke UPAR: transparent se kaala */}
        <View
          className="absolute inset-0"
          style={{
            experimental_backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.6) 75%, #000000 100%)",
          }}
        />
      </View>

      {/* Neeche ka content */}
      <View className="flex-1 justify-between px-5 pb-16">
        <View>
          <Text className="text-2xl font-semibold leading-2xl text-yellow">
            Flexible &{"\n"}Pre-Booked Rides
          </Text>
          <Text className="mt-3 w-[75%] text-md leading-md text-lightGray">
            Reserve now or schedule for later with just a few clicks
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable onPress={goSkip} hitSlop={10}>
              <Text className="text-md font-semibold text-white">Skip</Text>
            </Pressable>

            {/* Pagination dots */}
            <View className="ml-3 flex-row items-center gap-1">
              <View className="h-1 w-4 rounded-full bg-yellow" />
              <View className="h-1 w-1 rounded-full bg-gray" />
              <View className="h-1 w-1 rounded-full bg-gray" />
            </View>
          </View>

          <Pressable
            onPress={goNext}
            className="h-12 w-[120px] items-center justify-center rounded-full"
            style={{
              experimental_backgroundImage:
                "linear-gradient(180deg, #E2BE4A 0%, #C99E22 100%)",
              boxShadow: "0px 4px 24px 0px rgba(213, 175, 52, 0.45)",
            }}
          >
            <Text className="text-md font-semibold text-black">Next</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
