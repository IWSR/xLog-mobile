import type { FC } from "react";
import React, { useEffect } from "react";
import { useSharedValue, withSpring, withDelay } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Stack, YStack, Separator } from "tamagui";

import { DelayedRender } from "@/components/DelayRender";
import { ImageGallery } from "@/components/ImageGallery";
import { usePostWebViewLink } from "@/hooks/use-post-link";
import { useScrollVisibilityHandler } from "@/hooks/use-scroll-visibility-handler";
import { useThemeStore } from "@/hooks/use-theme-store";
import type { RootStackParamList } from "@/navigation/types";
import { Header as UserInfoHeader } from "@/pages/UserInfo/Header";
import { GA } from "@/utils/GA";

import { BottomSheetModal } from "./BottomSheetModal";
import type { PostDetailsContentInstance } from "./Content";
import { Content } from "./Content";
import { Header } from "./Header";
import { Navigator } from "./Navigator";

export interface Props {
  noteId: number
  characterId: number
  coverImage?: string
  placeholderCoverImageIndex?: number
}

const animationTimeout = 800;

export const PostDetailsPage: FC<NativeStackScreenProps<RootStackParamList, "PostDetails">> = (props) => {
  const { route, navigation } = props;
  const { params } = route;
  const [displayImageUris, setDisplayImageUris] = React.useState<string[]>([]);
  const { isDarkMode } = useThemeStore();
  const { bottom } = useSafeAreaInsets();
  const bottomBarHeight = bottom + 45;
  const headerContainerHeight = 45;
  const contentRef = React.useRef<PostDetailsContentInstance>(null);
  const followAnimValue = useSharedValue<number>(0);
  const scrollVisibilityHandler = useScrollVisibilityHandler({ scrollThreshold: 30 });
  const postUri = usePostWebViewLink(params);

  const closeModal = React.useCallback(() => {
    setDisplayImageUris([]);
  }, []);

  const onTakeScreenshot = React.useCallback(async (): Promise<string> => contentRef.current.takeScreenshot(), []);

  useEffect(() => {
    followAnimValue.value = withDelay(1500, withSpring(1));
    GA.logEvent("start_reading_post", {
      node_id: params.noteId,
      character_id: params.characterId,
    });
  }, []);

  return (
    <>
      <Stack flex={1} backgroundColor={isDarkMode ? "black" : "white"}>
        <Navigator
          onTakeScreenshot={onTakeScreenshot}
          isExpandedAnimValue={scrollVisibilityHandler.isExpandedAnimValue}
          characterId={params.characterId}
          noteId={params.noteId}
          postUri={postUri}
          headerContainerHeight={headerContainerHeight}
        />

        <Content
          ref={contentRef}
          postUri={postUri ? `${postUri}?only-content=true` : undefined}
          renderHeaderComponent={(isCapturing) => {
            return (
              <Header
                isCapturing={isCapturing}
                headerContainerHeight={headerContainerHeight}
                postUri={postUri}
                noteId={params.noteId}
                characterId={params.characterId}
                placeholderCoverImageIndex={params.placeholderCoverImageIndex}
                coverImage={params.coverImage}
              />
            );
          }}
          characterId={params.characterId}
          noteId={params.noteId}
          navigation={navigation}
          scrollEventHandler={scrollVisibilityHandler}
          bottomBarHeight={bottomBarHeight}
          headerContainerHeight={headerContainerHeight}
        />

        <DelayedRender timeout={animationTimeout}>
          <BottomSheetModal
            characterId={params.characterId}
            noteId={params.noteId}
            bottomBarHeight={bottomBarHeight}
          />
        </DelayedRender>
      </Stack>

      <ImageGallery
        isVisible={displayImageUris.length > 0}
        uris={displayImageUris}
        onClose={closeModal}
      />
    </>
  );
};
