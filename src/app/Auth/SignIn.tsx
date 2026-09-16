import Logo from "@/assets/images/logo.png";
import { useSignIn } from "@clerk/expo";
import { Link, router } from "expo-router";
import { useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
export default function index() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactori = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactori) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.log("sign in attempt not complete:", signIn);
    }
  };

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({
      code,
    });
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <View className="flex-1 gap-5 bg-white  px-3 pt-4">
        <Image
          source={require("../../../assets/images/logo.png")}
          className="size-24"
        />
        <Text className="text-lg font-bold text-left">Verify your account</Text>
        <Text className="text-left text-[13.5px] leading-5">
          we send a code to{" "}
        </Text>
        <View>
          <Text className="pb-1">code</Text>
          <TextInput
            className="border p-2 text-[13px] bg-white border-lightGray"
            placeholder="code"
            value={code}
            onChangeText={setCode}
            autoCapitalize="none"
            keyboardType="number-pad"
          />
          {errors.fields.code && (
            <Text className="text-redError mb-4">
              {" "}
              {errors.fields.code.message}
            </Text>
          )}
        </View>
        <Pressable
          disabled={isLoading}
          onPress={onVerifyPress}
          className="bg-yellow p-4 rounded-full"
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text className="flex text-center font-bold border-x-slate-500">
              Verify
            </Text>
          )}
        </Pressable>
        <Pressable onPress={() => signIn.mfa.sendEmailCode()} className="py-1">
          <Text className="text-blue-600 font-bold text-lg">
            i need a new code{" "}
          </Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white">
      <View className="items-center pt-10 justify-center gap-2 px-5">
        <Image source={Logo} className="size-24" />
        <Text className="text-lg font-bold">Welcome</Text>
        <Text className="text-center text-[13.5px] px-10 leading-5">
          Easily manage your ride bookings and stay updated on your journey
          status
        </Text>
      </View>
      <View className="px-5 pt-2 gap-3">
        <View>
          <Text className="pb-1">email address</Text>
          <TextInput
            className="border p-2 text-[13px] bg-white border-lightGray"
            placeholder="email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.fields.identifier && (
            <Text className="text-redError mb-4">
              {" "}
              {errors.fields.identifier.message}
            </Text>
          )}
        </View>

        <View>
          <Text className="pb-1">passoword</Text>
          <TextInput
            className="border p-2 text-[13px] bg-white border-lightGray"
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            secureTextEntry
          />
          {errors.fields.password && (
            <Text className="text-redError mb-4">
              {" "}
              {errors.fields.password.message}
            </Text>
          )}
        </View>
        <Pressable
          disabled={isLoading}
          onPress={onSignInPress}
          className="bg-yellow p-4 rounded-full"
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text className="flex text-center font-bold border-x-slate-500">
              LOGIN
            </Text>
          )}
        </Pressable>

        <View className="flex-row items-center justify-between">
          <View>
            <Pressable
              onPress={() => setIsChecked(!isChecked)}
              className="flex-row items-center"
            >
              <View
                className={`size-5 justify-center items-center rounded-full border-2 
          ${isChecked ? "bg-yellow border-yellow" : "bg-transparent border-lightGray"}`}
              >
                {isChecked && (
                  <Text className="text-white text-sm font-bold">✓</Text>
                )}
              </View>

              <Text className="ml-3 text-base text-gray">Remember Me</Text>
            </Pressable>
          </View>

          <Pressable>
            <Text>Forgot Password?</Text>
          </Pressable>
        </View>

        <Text>
          I don't have an Acc{" "}
          <Link href={"/Auth/SignUp"} className="font-bold">
            Register Now
          </Link>
        </Text>
      </View>
    </View>
  );
}
