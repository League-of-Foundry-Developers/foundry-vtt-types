import { expectTypeOf } from "vitest";
import "youtube";

import VideoHelper = foundry.helpers.media.VideoHelper;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;

expectTypeOf(VideoHelper.hasVideoExtension("some.thing.webm")).toEqualTypeOf<boolean>();

const videoHelper = new VideoHelper();

expectTypeOf(videoHelper.pending).toEqualTypeOf<Set<HTMLVideoElement>>();
expectTypeOf(videoHelper.thumbs).toEqualTypeOf<Map<string, string>>();
expectTypeOf(videoHelper.locked).toEqualTypeOf<boolean>();

declare const sprite: PIXI.Sprite;
declare const mesh: SpriteMesh;
declare const texture: PIXI.Texture;
declare const videoElement: HTMLVideoElement;

expectTypeOf(videoHelper.getSourceElement(sprite)).toEqualTypeOf<HTMLImageElement | HTMLVideoElement | null>();
expectTypeOf(videoHelper.getSourceElement(mesh)).toEqualTypeOf<HTMLImageElement | HTMLVideoElement | null>();

expectTypeOf(videoHelper.getVideoSource(sprite)).toEqualTypeOf<HTMLVideoElement | null>();
expectTypeOf(videoHelper.getVideoSource(mesh)).toEqualTypeOf<HTMLVideoElement | null>();
expectTypeOf(videoHelper.getVideoSource(texture)).toEqualTypeOf<HTMLVideoElement | null>();

expectTypeOf(videoHelper.cloneTexture(videoElement)).toEqualTypeOf<Promise<PIXI.Texture>>();

expectTypeOf(videoHelper.play(videoElement)).toEqualTypeOf<void>();
expectTypeOf(videoHelper.play(videoElement, {})).toEqualTypeOf<void>();
expectTypeOf(
  videoHelper.play(videoElement, { loop: false, offset: 30, playing: true, volume: 0.36 }),
).toEqualTypeOf<void>();
expectTypeOf(
  videoHelper.play(videoElement, { loop: undefined, offset: undefined, playing: undefined, volume: undefined }),
).toEqualTypeOf<void>();

expectTypeOf(videoHelper.stop(videoElement)).toEqualTypeOf<void>();
expectTypeOf(videoHelper.awaitFirstGesture()).toEqualTypeOf<void>();

expectTypeOf(videoHelper.createThumbnail("some/path/image.webp")).toEqualTypeOf<Promise<string>>();
expectTypeOf(videoHelper.createThumbnail("some/path/image.webp", {})).toEqualTypeOf<Promise<string>>();
expectTypeOf(
  videoHelper.createThumbnail("some/path/image.webp", {
    center: false,
    height: 50,
    tx: 17,
    ty: 200,
    width: 50,
    quality: 0.83,
    format: "image/jpeg",
  }),
).toEqualTypeOf<Promise<string>>();
expectTypeOf(
  videoHelper.createThumbnail("some/path/image.webp", {
    center: undefined,
    height: undefined,
    tx: undefined,
    ty: undefined,
    width: undefined,
    quality: undefined,
    format: undefined,
  }),
).toEqualTypeOf<Promise<string>>();

expectTypeOf(videoHelper.getYouTubePlayer("#iframeID")).toEqualTypeOf<Promise<YT.Player>>();
expectTypeOf(videoHelper.getYouTubeId("https://youtube.com/watch?v=Tv_q0RMaV6Y")).toEqualTypeOf<string>();

expectTypeOf(videoHelper.getYouTubeEmbedURL("https://youtube.com/watch?v=Tv_q0RMaV6Y")).toEqualTypeOf<string>();
expectTypeOf(videoHelper.getYouTubeEmbedURL("https://youtube.com/watch?v=Tv_q0RMaV6Y", {})).toEqualTypeOf<string>();
expectTypeOf(
  videoHelper.getYouTubeEmbedURL("https://youtube.com/watch?v=Tv_q0RMaV6Y", {
    autohide: YT.AutoHide.AlwaysVisible,
    controls: YT.Controls.ShowLoadPlayer,
    // other YT.PlayerVars keys
  }),
).toEqualTypeOf<string>();

// not actually an error to call this with no URL, for some reason (it defaults to `""`)
expectTypeOf(videoHelper.isYouTubeURL()).toEqualTypeOf<boolean>();
expectTypeOf(videoHelper.isYouTubeURL("https://youtube.com/watch?v=Tv_q0RMaV6Y")).toEqualTypeOf<boolean>();
