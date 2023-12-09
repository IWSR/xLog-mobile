import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Stack, Text, YStack } from "tamagui";

import { LinearGradientShadow } from "@/components/LinearGradientShadow";
import type { ExpandedNote } from "@/types/crossbell";
import { toIPFS } from "@/utils/ipfs-parser";

import { bottomSheetPadding } from "./constants";

const { width } = Dimensions.get("window");

export const BlockChainInfo: FC<{
  note: ExpandedNote
}> = ({
  note,
}) => {
  const i18nC = useTranslation("common");
  const i18nT = useTranslation("translation");
  const { bottom } = useSafeAreaInsets();

  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false} horizontal={false} style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradientShadow
        width={width}
        height={160}
        blur={18}
        contentContainerStyle={{
          padding: 20,
        }}
      >
        <Text color={"#161516"} textAlign="center" fontWeight={"600"}>
          {i18nT.t("Ownership of this post data is guaranteed by blockchain and smart contracts to the creator alone.")}
        </Text>
      </LinearGradientShadow>
      <YStack paddingHorizontal={bottomSheetPadding} gap="$7" paddingBottom={bottom}>
        {
          [
            {
              label: i18nC.t("Blockchain Number"),
              value: `#${note?.blockNumber}`,
            },
            {
              label: i18nC.t("Owner"),
              value: note?.owner,
            },
            {
              label: i18nC.t("Transaction Hash"),
              value: `${i18nC.t("Creation")}: ${note?.transactionHash}\n\n${i18nC.t("Last Update")}: ${note?.updatedTransactionHash}`,
            },
            {
              label: i18nC.t("IPFS Address"),
              value: toIPFS(note?.metadata?.uri),
            },
          ].map(({ label, value }, index) => {
            return (
              <YStack key={index} gap="$2">
                <Text fontWeight={"600"} fontSize={"$6"} color="$color">{label}</Text>
                <Text fontSize={"$5"} color="#929190">{value}</Text>
              </YStack>
            );
          })
        }
      </YStack>
    </BottomSheetScrollView>
  );
};
