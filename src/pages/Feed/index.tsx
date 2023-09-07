import type { FC } from "react";
import { useContext, useState } from "react";
import { StyleSheet } from "react-native";

import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "tamagui";

import { MasonryFeedList } from "@/components/FeedList";
import { GlobalAnimationContext } from "@/context/global-animation-context";
import { useColors } from "@/hooks/use-colors";

import type { FeedType } from "./feedTypes";
import { feedTypes } from "./feedTypes";
import { Header } from "./Header";

export interface Props {
  feedType?: FeedType
}

export const FeedPage: FC<Props> = (props) => {
  const { feedType: _feedType = feedTypes.LATEST } = props;
  const [currentFeedType, setCurrentFeedType] = useState<FeedType>(_feedType);
  const [daysInterval, setDaysInterval] = useState<number>(7);
  const { isExpandedAnimValue, onScroll } = useContext(GlobalAnimationContext).homeFeed;
  const { pick } = useColors();

  return (
    <Stack flex={1} >
      <LinearGradient
        colors={[pick("homeFeedBackgroundGradient_0"), pick("homeFeedBackgroundGradient_1")]}
        style={StyleSheet.absoluteFillObject}
        locations={[0, 0.35]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <Header
        type={currentFeedType}
        isExpandedAnimValue={isExpandedAnimValue}
        onDaysIntervalChange={(days) => {
          setDaysInterval(days);
        }}
        daysInterval={daysInterval}
        onFeedTypeChange={(type) => {
          setCurrentFeedType(type);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      />
      <Stack flex={1}>
        <MasonryFeedList
          daysInterval={daysInterval}
          type={currentFeedType}
          onScroll={onScroll}
        />
      </Stack>
    </Stack>
  );
};
