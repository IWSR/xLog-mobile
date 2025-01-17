import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { SizableText, Stack, Text, XStack, YStack } from "tamagui";

import { Avatar } from "@/components/Avatar";
import { FillSpinner } from "@/components/FillSpinner";
import { useDate } from "@/hooks/use-date";
import { useGetLikes } from "@/queries/page";
import type { ExpandedNote } from "@/types/crossbell";

export const BottomSheetLikeList: FC<{
  note: ExpandedNote
}> = ({
  note,
}) => {
  const date = useDate();
  const i18nC = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const [data, mutation] = useGetLikes({
    characterId: note.characterId,
    noteId: note.noteId,
  });

  return (
    <Stack flex={1}>
      <BottomSheetFlatList
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!mutation.hasNextPage || mutation.isFetchingNextPage) {
            return;
          }

          mutation.fetchNextPage();
        }}
        contentContainerStyle={{ padding: 20, paddingBottom: bottom }}
        data={data}
        keyExtractor={item => item?.transactionHash?.toString()}
        ListEmptyComponent={(
          <Stack height={300}>
            {
              mutation.isFetching
                ? <FillSpinner/>
                : (
                  <YStack minHeight={300} alignItems="center" justifyContent="center" gap="$2">
                    <Image
                      source={require("../../assets/like-list-empty.png")}
                      style={{ width: 100, height: 100 }}
                      contentFit="contain"
                    />
                    <SizableText color={"$colorUnActive"} size="$5">
                      {i18nC.t("There are no comments yet.")}
                    </SizableText>
                  </YStack>
                )
            }
          </Stack>
        )}
        renderItem={({ item }) => {
          return (
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$5">
              <XStack alignItems="center" gap="$2">
                <Avatar size={32} character={item.character} useDefault/>
                <Text fontSize={"$7"}>{item?.character?.handle}</Text>
              </XStack>
              <Text color="#929190">{
                i18nC.t("ago", {
                  time: date.dayjs
                    .duration(
                      date.dayjs(item?.entity?.createdAt).diff(date.dayjs(), "minute"),
                      "minute",
                    )
                    .humanize(),
                })

              }</Text>
            </XStack>
          );
        }}
      />
    </Stack>
  );
};
