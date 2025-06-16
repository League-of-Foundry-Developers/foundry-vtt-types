import { expectTypeOf } from "vitest";

import ImageHelper = foundry.helpers.media.ImageHelper;
import FilePicker = foundry.applications.apps.FilePicker.implementation;

declare const displayObject: PIXI.DisplayObject;
declare const texture: PIXI.Texture;
declare const htmlCanvas: HTMLCanvasElement;
declare const pixels: Uint8ClampedArray;
declare const pixelOptions: ImageHelper.PixelsToCanvasOptions;

expectTypeOf(ImageHelper.createThumbnail("")).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn> | null>();
expectTypeOf(ImageHelper.hasImageExtension("")).toEqualTypeOf<boolean>();
expectTypeOf(ImageHelper.compositeCanvasTexture(displayObject)).toEqualTypeOf<PIXI.Texture>();
expectTypeOf(ImageHelper.textureToImage(texture)).toEqualTypeOf<Promise<string>>();
expectTypeOf(ImageHelper.pixiToBase64(displayObject)).toEqualTypeOf<Promise<string>>();
expectTypeOf(ImageHelper.canvasToBase64(htmlCanvas)).toEqualTypeOf<Promise<string>>();
expectTypeOf(ImageHelper.uploadBase64("", "", "")).toEqualTypeOf<Promise<ReturnType<typeof FilePicker.upload>>>();
expectTypeOf(ImageHelper.pixelsToCanvas(pixels, 0, 0, pixelOptions)).toEqualTypeOf<HTMLCanvasElement>();
