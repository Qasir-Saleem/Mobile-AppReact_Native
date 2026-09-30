import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Property } from "../../../types";
import { useLocalSearchParams } from "expo-router";
import { useFilterStore } from "../../../store/FilterStore";
import { Ionicons } from "@expo/vector-icons";
import FilterModel from "@/components/FilterModel";
import { formatPrice } from "../../../lib/utils";
import { supabase } from "../../../lib/supabase";
import PropertyCard from "@/components/PropertyCard";

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

  useEffect(() => {
    fetchResults();
  }, [search, type, bedrooms, minPrice, maxPrice]);

  const fetchResults = async () => {
    setLoading(true);

    let query = supabase.from("properties").select("*");
    if (search) {
      query = query.or(`title.ilike.%${search}%, city.ilike%${search}%`);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (bedrooms) {
      query = query.eq("bedrooms", bedrooms);
    }

    if (minPrice) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    const { data } = await query.order("created_at", {
      ascending: false,
    });
    setResults(data ?? []);
    setLoading(false);
  };
  return (
    <View className="px-5 bg-white h-full">
      <Text className="text-xl py-5 font-bold">Find Property</Text>

      <View className="flex-1">
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
        {activeFiltersCount > 0 && (
          <View className="flex-row flex-wrap gap-3 mt-3">
            {type && (
              <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-2">
                <Text className="text-blue-700 text-sm font-bold capitalize">
                  {type}
                </Text>
                <Pressable onPress={() => setType(null)}>
                  <Ionicons name="close" size={12} color="#1D4ED8" />
                </Pressable>
              </View>
            )}

            {bedrooms !== null && (
              <View className="flex-row flex-wrap gap-3 mt-3">
                <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-2">
                  <Ionicons name="bed-outline" size={11} color="#1D4ED8" />
                  <Text className="text-blue-700 text-sm font-bold capitalize">
                    {bedrooms === 4
                      ? "4+ beds"
                      : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                  </Text>
                  <Pressable onPress={() => setBedrooms(null)}>
                    <Ionicons name="close" size={12} color="#1D4ED8" />
                  </Pressable>
                </View>
              </View>
            )}

            {(minPrice !== null || maxPrice !== null) && (
              <View className="flex-row flex-wrap gap-3 mt-3">
                <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-2">
                  <Ionicons name="bed-outline" size={11} color="#1D4ED8" />
                  <Text className="text-blue-700 text-sm font-bold capitalize">
                    {minPrice && maxPrice
                      ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                      : minPrice
                        ? `From ${formatPrice(minPrice)}`
                        : `Up to ${formatPrice(maxPrice!)}`}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setMinPrice(null);
                      setMaxPrice(null);
                    }}
                  >
                    <Ionicons name="close" size={12} color="#1D4ED8" />
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text className="text-sm text-gray-400 mt-4 mb-4">
              {loading ? "Searching..." : `${results.length} properties found`}
            </Text>
          }
          renderItem={({ item }) => <PropertyCard property={item} />}
          ListEmptyComponent={
            !loading ? (
              <View className="items-center py-10">
                <Text className="text-gray-400">No properties Founds</Text>
              </View>
            ) : (
              <ActivityIndicator
                size="large"
                color="#2563EB"
                className="py-20"
              />
            )
          }
        />
      </View>

      <FilterModel
        visible={showFIlters}
        onClose={() => setShowFIlters(false)}
      />
    </View>
  );
}
