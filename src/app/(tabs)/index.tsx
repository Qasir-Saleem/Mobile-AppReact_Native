import { useUser } from "@clerk/expo";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import { Property } from "../../../types";
import { useSupabase } from "../../../hooks/useSupabase";
import { Ionicons } from "@expo/vector-icons";
import FeatureCard from "@/components/FeatureCard";
import PropertyCard from "@/components/PropertyCard";

export default function index() {
  const { user } = useUser();
  const router = useRouter();
  const supabase = useSupabase(); // Clerk ka token bhejta hai

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const FetchProperties = async () => {
    setLoading(true);

    const { data: featuredData, error: featuredError } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("created_at", { ascending: false });

    if (featuredError) console.warn("featured error:", featuredError.message);

    const { data: recommendedData, error: recommendedError } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .order("created_at", { ascending: false });

    if (recommendedError)
      console.warn("recommended error:", recommendedError.message);

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      FetchProperties();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return (
    <View className="flex-1 px-5">
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* header */}
            <View className="flex-row items-center justify-between  py-4 ">
              <Image
                source={require("@/assets/images/logo.png")}
                className="size-[80px]"
              />
              <View className="items-end">
                <Text>Good Morning </Text>
                <Text className="text-gray text-base font-bold">
                  {user?.firstName ?? "User"}
                </Text>
              </View>
            </View>
            {/* search bar */}
            <Pressable
              onPress={() => router.push("/(tabs)/search")}
              className="mb-6 flex-row items-center bg-white rounded-2xl px-4 py-3 gap-3"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Ionicons name="search-outline" size={18} color={"#9CA3AF"} />
              <Text className="text-gray text-sm flex-1">
                search properties, cities...
              </Text>

              <Pressable
                onPress={() => router.push("/(tabs)/search?openFilters=true")}
                className="w-8 h-8 bg-blue-600 rounded-xl justify-center items-center"
              >
                <Ionicons name="options-outline" size={15} color="white" />
              </Pressable>
            </Pressable>
            <View>
              <Text className="text-darkGray text-lg font-bold mb-4">
                Featured
              </Text>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  className="py-10"
                />
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <FeatureCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 1 }}
                />
              )}
            </View>

            {/* Featured section */}
            <Text className="text-lg font-bold py-3 ">Recommended</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="">
            <PropertyCard property={item} />
          </View>
        )}
      />
    </View>
  );
}
