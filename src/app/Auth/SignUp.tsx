import { useAuth, useSignUp } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
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

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      alert(error.message);
      return;
    }
    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) alert(sendError.message);
  };

  // wapas form par jao taake email theek ki ja sake
  const onEditEmail = async () => {
    setCode("");
    await signUp.reset();
  };

  const onVerifyPress = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({
      code,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="flex-1">
        <Pressable onPress={onEditEmail} className="p-3">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>

        <View className="flex-1 gap-5 bg-white  px-3 pt-4">
          <Image
            source={require("../../../assets/images/logo.png")}
            className="size-24"
          />
          <Text className="text-lg font-bold text-left">
            Verify your account
          </Text>
          <Text className="text-left text-[13.5px] leading-5">
            we sent a code to{" "}
            <Text className="font-bold">{email}</Text>
          </Text>
          <Pressable onPress={onEditEmail}>
            <Text className="text-blue-600 font-bold">
              Wrong email? Change it
            </Text>
          </Pressable>
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
          <Pressable
            onPress={() => signUp.verifications.sendEmailCode()}
            className="py-1"
          >
            <Text className="text-blue-600 font-bold text-lg">
              i need a new code{" "}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View className="px-4 pt-4 flex gap-5 ">
        <View>
          <Text className="pb-1">First Name</Text>
          <TextInput
            className="border p-2 text-[13px] bg-white border-lightGray"
            placeholder="enter your name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="none"
          />

          {errors.fields.firstName && (
            <Text className="text-redError mb-4">
              {" "}
              {errors.fields.firstName.message}
            </Text>
          )}
        </View>

        <View>
          <Text className="pb-1">Last Name</Text>
          <TextInput
            className="border p-2 text-[13px] bg-white border-lightGray"
            placeholder="enter your last name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="none"
          />
          {errors.fields.lastName && (
            <Text className="text-redError mb-4">
              {" "}
              {errors.fields.lastName.message}
            </Text>
          )}
        </View>

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
          {errors.fields.emailAddress && (
            <Text className="text-redError mb-4">
              {" "}
              {errors.fields.emailAddress.message}
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
          onPress={onSignUpPress}
          className="bg-yellow p-4 rounded-full"
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text className="flex text-center font-bold border-x-slate-500">
              Sign Up
            </Text>
          )}
        </Pressable>
        <View className="flex-row justify-center">
          <Text className="flex text-center border-x-slate-500">
            already have an account?{" "}
            <Link href={"/Auth/SignIn"} className="font-bold text-red text-xl">
              Sign In
            </Link>
          </Text>
        </View>
        <View nativeID="clerk-captcha" />
      </View>
    </View>
  );
}
