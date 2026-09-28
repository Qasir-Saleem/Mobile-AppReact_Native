import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useFilterStore, PropertyType } from "../../store/FilterStore";
import { Ionicons } from "@expo/vector-icons";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

const chip = (active: boolean) =>
  `px-4 py-2 rounded-full ${
    active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
  }`;

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`;

export default function FilterModel({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
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
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");

  const activeCount = [type, bedrooms, minPrice, maxPrice].filter(
    (v) => v !== null,
  ).length;

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  };

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  const shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-slate-50">
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-lightGray">
          <Pressable onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color={"#374151"} />
          </Pressable>
          <Text className="text-lg font-bold text-darkGray ">Filters</Text>
          <Pressable onPress={handleReset}>
            <Text className="text-blue-500 font-semibold textsx">Reset </Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-base font-bold text-gray-800 mb-3">
            Property type
          </Text>

          <View className="flex-row flex-wrap justify-between gap-y-2 mb-6">
            {TYPES.map((item) => (
              <Pressable
                key={String(item.value)}
                onPress={() => setType(item.value)}
                className={`items-center py-3 px-1 rounded-2xl  ${
                  type === item.value
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-gray-200"
                }`}
                style={[shadow, { width: "24%" }]}
              >
                <Text
                  numberOfLines={1}
                  className={`text-xs font-bold ${chipText(type === item.value)}`}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="text-base font-bold text-gray-800 mb-3">
            Bedrooms
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {BEDS.map((item) => (
              <Pressable
                key={String(item.value)}
                onPress={() => setBedrooms(item.value)}
                className={`flex-1 items-center py-3 rounded-2xl ${chip(bedrooms === item.value)}`}
                style={shadow}
              >
                <Text
                  className={`text-sm font-bold ${chipText(bedrooms === item.value)}`}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-base font-bold text-gray-800 mb-3">
            Price Range (Rs)
          </Text>

          <View className="flex-row gap-3 mb-3">
            {[
              {
                label: "Min Price",
                value: localMin,
                onChange: setLocalMin,
                placeholder: "0",
              },
              {
                label: "Max Price",
                value: localMax,
                onChange: setLocalMax,
                placeholder: "Any",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label} className="flex-1">
                <Text className="text-xs text-gray mb-1.5 font-medium">
                  {label}
                </Text>
                <View
                  className="flex-row items-center bg-white rounded-2xl px-3 border border-gray-200"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 4,
                  }}
                >
                  <Text className="text-gray tex-sm mr-1">$</Text>
                  <TextInput
                    className="flex-1 py-3 text-gray"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  ></TextInput>
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {PRICE_PRESETS.map((p) => {
              const active = minPrice === p.min && maxPrice === p.max;

              return (
                <Pressable
                  key={p.label}
                  onPress={() => {
                    setLocalMin(p.min ? String(p.min) : "");
                    setLocalMax(p.max ? String(p.max) : "");
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  className={`px-3 py-1.5 rounded-full border ${
                    active
                      ? "bg-blue-400 border-blue-300"
                      : "bg-white border-gray-200"
                  }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 4,
                  }}
                >
                  <Text
                    className={`text-xs font-medium ${
                      active ? "text-blue-600" : "text-gray"
                    }`}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <View className="px-5 pb-8 pt-4 bg-white border- border-gray">
          <Pressable
            onPress={handleApply}
            className="bg-blue-600 rounded-2xl py-4 items-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <Text className="text-white font-bold text-base">
              Apply Filters {activeCount > 0 ? `(${activeCount})` : ""}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
