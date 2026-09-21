import { View, Image, Text, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Property } from "../../types";
import { Ionicons } from "@expo/vector-icons";
import { formatPrice } from "../../lib/utils";

export default function PropertyCard({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();
  const isSave = true;
  return (
    <Pressable
      onPress={() => router.push(`/property/${property.id}` as any)}
      className="w-full mb-4 mr-2 rounded-3xl overflow-hidden bg-white"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        opacity: property.is_sold ? 0.5 : 1,
      }}
    >
      <View className="flex-row ">
        <Image
          source={{ uri: property.images?.[0] }}
          className="w-28 h-28"
          resizeMode="cover"
        />
        <View className="p-3 flex-1 justify-between">
          <View>
            <View className="flex-row items-center justify-between">
              <Text
                className="text-base font-bold text-gray-800 mb-1"
                numberOfLines={1}
              >
                {property.title}
              </Text>
              <Text>
                <Ionicons
                  name={isSave ? "heart" : "heart-outline"}
                  size={18}
                  color={isSave ? "#EF4444" : "#9CA3AF"}
                />
              </Text>
            </View>

            <View className="flex-row items-center gap-1 mb-3">
              <Ionicons name="location-outline" size={13} color={"#6B7280"} />
              <Text className="text-sx text-gray" numberOfLines={1}>
                {property.city}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-blue-500 font-bold">
              {formatPrice(property.price)}
            </Text>

            <View className="flex-row items-center px-6 gap-3">
              <View className="flex-row items-center gap-1">
                <Ionicons name="bed-outline" size={13} color={"#6B7280"} />
                <Text className="text-[12px] text-lightGray ">
                  {property.bedrooms} bd
                </Text>
              </View>

              <View className="flex-row items-center gap-1">
                <Ionicons name="expand-outline" size={11} color={"#6B7280"} />
                <Text className="text-[12px] text-lightGray ">
                  {property.area_sqft} ft
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
