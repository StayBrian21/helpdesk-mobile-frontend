import { Barlow_400Regular, Barlow_600SemiBold } from "@expo-google-fonts/barlow";
import { BebasNeue_400Regular, useFonts } from "@expo-google-fonts/bebas-neue";
import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { colors } from "../constants/colors";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Barlow_400Regular,
    Barlow_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}