import { expectTypeOf } from "vitest";

import VideoHelper = foundry.helpers.media.VideoHelper;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;

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
expectTypeOf(videoHelper.stop(videoElement)).toEqualTypeOf<void>();
expectTypeOf(videoHelper.awaitFirstGesture()).toEqualTypeOf<void>();
expectTypeOf(videoHelper.createThumbnail("", {})).toEqualTypeOf<Promise<string>>();
expectTypeOf(videoHelper.getYouTubePlayer("")).toEqualTypeOf<Promise<YT.Player>>();
expectTypeOf(videoHelper.getYouTubeId("")).toEqualTypeOf<string>();
expectTypeOf(videoHelper.getYouTubeEmbedURL("")).toEqualTypeOf<string>();
expectTypeOf(videoHelper.isYouTubeURL()).toEqualTypeOf<boolean>();

expectTypeOf(VideoHelper.hasVideoExtension("")).toEqualTypeOf<boolean>();
