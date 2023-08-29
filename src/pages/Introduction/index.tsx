import type { FC } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { Settings } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ScrollView, Stack, Text, XStack, YStack } from "tamagui";

import { Center } from "@/components/Base/Center";
import { LogoBlueResource } from "@/components/Logo";
import { useRootNavigation } from "@/hooks/use-navigation";

import { Background } from "./Background";

export interface Props {
}

export const IntroductionPage: FC<Props> = () => {
  const navigation = useRootNavigation();

  return (
    <ScrollView bounces={false}>
      <YStack>
        <SafeAreaView>
          <Background/>
          <YStack paddingHorizontal="$6">
            <XStack alignItems="flex-end" justifyContent="space-between" marginBottom="$5">
              <Image source={LogoBlueResource} w={48} height={48}/>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SettingsNavigator")}
              >
                <Settings/>
              </TouchableOpacity>
            </XStack>
            <Text marginBottom="$6" fontWeight={"500"} fontSize={37}>You’re using xLog on iOS</Text>
            {
              [
                {
                  img: require("../../assets/intro-01.png"),
                  title: "Slide into Smoothness",
                  description: "Welcome to the digital playground where your ideas glide like butter on a hot skillet",
                },
                {
                  img: require("../../assets/intro-02.png"),
                  title: "Chaining Up Your Data",
                  description: "Each blog post you pen is carefully chiseled into our digital marble",
                },
                {
                  img: require("../../assets/intro-03.png"),
                  title: "Join the Vibe Tribe, Dev Style",
                  description: "Plug into our jazzy developer community where collaboration is the new rock roll",
                },
              ].map(({ img, title, description }, index) => {
                return (
                  <XStack key={index} marginBottom="$6" alignItems="center" gap="$3" >
                    <Image source={img} w={42} height={42}/>
                    <YStack flex={1}>
                      <Text fontSize={16} fontWeight={"700"}>{title}</Text>
                      <Text fontSize={14}>{description}</Text>
                    </YStack>
                  </XStack>
                );
              })
            }
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Login")}
            >
              <Stack paddingVertical="$3" borderRadius={"$5"} overflow="hidden">
                <LinearGradient
                  colors={["#30a19b", "#2875bf"]}
                  style={{ position: "absolute", width: "100%", top: 0, bottom: 0 }}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                />
                <Center flex={1}>
                  <Text fontSize={"$5"}>Connect</Text>
                </Center>
              </Stack>
            </TouchableOpacity>
          </YStack>
        </SafeAreaView>
      </YStack>
    </ScrollView>
  );
};