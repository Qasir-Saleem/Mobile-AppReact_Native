import { View, Text, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import { useFilterStore } from "../../store/FilterStore";
import { Ionicons } from "@expo/vector-icons";

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
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-lightGray ">
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-lightGray">
          <Pressable onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color={"374151"} />
          </Pressable>
          <Text className="text-lg font-bold text-darkGray ">Filters</Text>
          <Pressable onPress={handleReset}>
            <Text className="text-blue-500 font-semibold textsx">Reset</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
