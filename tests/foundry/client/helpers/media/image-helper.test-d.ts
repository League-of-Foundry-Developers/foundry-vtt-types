import { expectTypeOf } from "vitest";

import ImageHelper = foundry.helpers.media.ImageHelper;
import FilePicker = foundry.applications.apps.FilePicker;

declare const displayObject: PIXI.DisplayObject;
declare const texture: PIXI.Texture;
declare const htmlCanvas: HTMLCanvasElement;
declare const pixels: Uint8ClampedArray;

expectTypeOf(ImageHelper.createThumbnail("some/path/image.webp")).toEqualTypeOf<
  Promise<ImageHelper.ThumbnailReturn | null>
>();
expectTypeOf(ImageHelper.createThumbnail("some/path/image.webp", {})).toEqualTypeOf<
  Promise<ImageHelper.ThumbnailReturn | null>
>();
expectTypeOf(
  ImageHelper.createThumbnail("some/path/image.webp", {
    center: false,
    height: 50,
    tx: 17,
    ty: 200,
    width: 50,
    quality: 0.83,
    format: "image/jpeg",
  }),
).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn | null>>();
expectTypeOf(
  ImageHelper.createThumbnail("some/path/image.webp", {
    center: undefined,
    height: undefined,
    tx: undefined,
    ty: undefined,
    width: undefined,
    quality: undefined,
    format: undefined,
  }),
).toEqualTypeOf<Promise<ImageHelper.ThumbnailReturn | null>>();

expectTypeOf(ImageHelper.hasImageExtension("path/to/some.thing")).toEqualTypeOf<boolean>();

expectTypeOf(ImageHelper.compositeCanvasTexture(displayObject)).toEqualTypeOf<PIXI.Texture>();
expectTypeOf(ImageHelper.compositeCanvasTexture(displayObject, {})).toEqualTypeOf<PIXI.Texture>();
expectTypeOf(
  ImageHelper.compositeCanvasTexture(displayObject, {
    center: false,
    height: 50,
    tx: 17,
    ty: 200,
    width: 50,
  }),
).toEqualTypeOf<PIXI.Texture>();
expectTypeOf(
  ImageHelper.compositeCanvasTexture(displayObject, {
    center: undefined,
    height: undefined,
    tx: undefined,
    ty: undefined,
    width: undefined,
  }),
).toEqualTypeOf<PIXI.Texture>();

expectTypeOf(ImageHelper.textureToImage(texture)).toEqualTypeOf<Promise<string>>();
expectTypeOf(ImageHelper.textureToImage(texture, {})).toEqualTypeOf<Promise<string>>();
expectTypeOf(
  ImageHelper.textureToImage(texture, {
    quality: 0.83,
    format: "image/jpeg",
  }),
).toEqualTypeOf<Promise<string>>();
expectTypeOf(
  ImageHelper.textureToImage(texture, {
    quality: undefined,
    format: undefined,
  }),
).toEqualTypeOf<Promise<string>>();

expectTypeOf(ImageHelper.pixiToBase64(displayObject)).toEqualTypeOf<Promise<string>>();
expectTypeOf(ImageHelper.pixiToBase64(displayObject, "image/png")).toEqualTypeOf<Promise<string>>();
expectTypeOf(ImageHelper.pixiToBase64(displayObject, "image/webp", 0.97)).toEqualTypeOf<Promise<string>>();

expectTypeOf(ImageHelper.canvasToBase64(htmlCanvas)).toEqualTypeOf<Promise<string>>();
expectTypeOf(ImageHelper.canvasToBase64(htmlCanvas, "image/avif")).toEqualTypeOf<Promise<string>>();
expectTypeOf(ImageHelper.canvasToBase64(htmlCanvas, "image/jpeg", 0.91)).toEqualTypeOf<Promise<string>>();

expectTypeOf(ImageHelper.uploadBase64("someBase64String", "image.bmp", "some/path")).toEqualTypeOf<
  Promise<FilePicker.UploadReturn>
>();
expectTypeOf(ImageHelper.uploadBase64("someBase64String", "image.bmp", "some/path", {})).toEqualTypeOf<
  Promise<FilePicker.UploadReturn>
>();
expectTypeOf(
  ImageHelper.uploadBase64("someBase64String", "image.bmp", "some/path", {
    notify: false,
    storage: "data",
    type: "image/bmp",
  }),
).toEqualTypeOf<Promise<FilePicker.UploadReturn>>();
expectTypeOf(
  ImageHelper.uploadBase64("someBase64String", "image.bmp", "some/path", {
    notify: undefined,
    storage: undefined,
    type: undefined,
  }),
).toEqualTypeOf<Promise<FilePicker.UploadReturn>>();

expectTypeOf(ImageHelper.pixelsToCanvas(pixels, 50, 50)).toEqualTypeOf<HTMLCanvasElement>();
expectTypeOf(ImageHelper.pixelsToCanvas(pixels, 50, 50, {})).toEqualTypeOf<HTMLCanvasElement>();
expectTypeOf(
  ImageHelper.pixelsToCanvas(pixels, 0, 0, { element: htmlCanvas, eh: 7000, ew: 12000 }),
).toEqualTypeOf<HTMLCanvasElement>();
expectTypeOf(
  ImageHelper.pixelsToCanvas(pixels, 0, 0, { element: undefined, eh: undefined, ew: undefined }),
).toEqualTypeOf<HTMLCanvasElement>();
