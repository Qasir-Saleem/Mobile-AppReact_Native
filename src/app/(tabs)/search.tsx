import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Property } from "../../../types";
import { useLocalSearchParams } from "expo-router";
import { useFilterStore } from "../../../store/FilterStore";
import { Ionicons } from "@expo/vector-icons";
import FilterModel from "@/components/FilterModel";

export default function search() {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFIlters, setShowFIlters] = useState(false);

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters === "true") {
      setShowFIlters(true);
    }
  }, [openFilters]);

  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
  } = useFilterStore();

  const activeFiltersCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;
  return (
    <View className="px-5 bg-white h-full">
      <Text className="text-xl py-5 font-bold">Find Property</Text>

      <View className="flex-row items-center gap-3">
        <View
          className="flex-1 flex-row items-center bg-white rounded-2xl px-4 gap-3"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Ionicons name="search-outline" size={18} color={"#9CA3AF"} />
          <TextInput
            className="flex-1 py-3 text-gray"
            placeholder="search by title or city..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => setShowFIlters(true)}
          className={` w-12 h-12 rounded-2xl items-center justify-center ${activeFiltersCount > 0 ? "bg-blue-600" : "bg-white"}`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFiltersCount > 0 ? "#fff" : "#374151"}
          />
          {activeFiltersCount > 0 && (
            <View className="absolute -top-1 -right-1 size-4 bg-red rounded-full items-center justify-center">
              <Text className="text-white text-[9px] font-bold">
                {activeFiltersCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
      <FilterModel
        visible={showFIlters}
        onClose={() => setShowFIlters(false)}
      />
    </View>
  );
}
