import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
const { width } = Dimensions.get("window");

import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useUserStore } from "../../../store/userStore";
import { useSupabase } from "../../../hooks/useSupabase";
import { Property } from "../../../types";

export default function PropertyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const authSupabase = useSupabase();

  const fetchProperty = async () => {
    setLoading(true);

    const { data, error } = await authSupabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.warn("property fetch error:", error.message);

    setProperty(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text>Property not found</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ opacity: property.is_sold ? 0.5 : 1 }}>
            <FlatList
              data={property.images}
              keyExtractor={(_, i) => i.toString()}
              horizontal
              pagingEnabled
              scrollEventThrottle={16}
              onScroll={onScroll}
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) =>
                setActiveIndex(
                  Math.round(e.nativeEvent.contentOffset.x / width),
                )
              }
              renderItem={({ item }) => (
                <Pressable onPress={() => setImageViewerVisible(true)}>
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: 300 }}
                    resizeMode="cover"
                  />
                </Pressable>
              )}
            />
          </View>
          <View className="absolute bottom-2 right-4 bg-black/50 px-3 py-1 rounded-full">
            <text className="text-white text-xs font-medium">
              {activeIndex + 1}/{property.images.length}
            </text>
          </View>
        </View>
      </ScrollView>
      <Text>PropertyDetails</Text>
    </View>
  );
}
