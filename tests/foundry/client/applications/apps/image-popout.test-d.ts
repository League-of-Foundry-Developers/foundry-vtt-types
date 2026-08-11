import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ImagePopout = foundry.applications.apps.ImagePopout;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

const imagePopout = new ImagePopout({ src: "path/to/image.webp" });

// eslint-disable-next-line @typescript-eslint/no-deprecated
const fromPath = new ImagePopout("path/to/image.webp");
expectTypeOf(fromPath).toEqualTypeOf<ImagePopout>();

expectTypeOf(ImagePopout.DEFAULT_OPTIONS).toEqualTypeOf<ImagePopout.DefaultOptions>();
expectTypeOf(ImagePopout.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

expectTypeOf(imagePopout.title).toEqualTypeOf<string>();
expectTypeOf(imagePopout.isVideo).toEqualTypeOf<boolean>();
expectTypeOf(imagePopout.shareImage()).toEqualTypeOf<void>();
expectTypeOf(imagePopout.shareImage({ title: "Shared", users: ["userId"] })).toEqualTypeOf<void>();

declare const config: DeepPartial<ImagePopout.Configuration>;
expectTypeOf(imagePopout["_initializeApplicationOptions"](config)).toEqualTypeOf<ImagePopout.Configuration>();
expectTypeOf(imagePopout["_prepareContext"]({ isFirstRender: true })).toEqualTypeOf<
  Promise<ImagePopout.RenderContext>
>();

declare const context: DeepPartial<ImagePopout.RenderContext>;
expectTypeOf(imagePopout["_preFirstRender"](context, {})).toEqualTypeOf<Promise<void>>();

// `users` is the one member the socket handler never receives back.
expectTypeOf(
  ImagePopout._handleShareImage({ image: "path/to/image.webp", title: "Shared" }),
).toEqualTypeOf<ImagePopout.Any>();

// @ts-expect-error `_handleShareImage` reads no `users`, so passing one is a mistake.
ImagePopout._handleShareImage({ image: "path/to/image.webp", title: "Shared", users: ["userId"] });

declare const renderContext: ImagePopout.RenderContext;
expectTypeOf(renderContext.caption).toEqualTypeOf<string | undefined>();
expectTypeOf(renderContext.image).toEqualTypeOf<string>();
expectTypeOf(renderContext.isVideo).toEqualTypeOf<boolean>();
expectTypeOf(renderContext.title).toEqualTypeOf<string>();
expectTypeOf(renderContext.altText).toEqualTypeOf<string>();

declare const shareConfig: ImagePopout.ShareImageConfig;
expectTypeOf(shareConfig.image).toEqualTypeOf<string>();
expectTypeOf(shareConfig.title).toEqualTypeOf<string>();
expectTypeOf(shareConfig.caption).toEqualTypeOf<string | undefined>();
expectTypeOf(shareConfig.uuid).toEqualTypeOf<string | null | undefined>();
expectTypeOf(shareConfig.showTitle).toEqualTypeOf<boolean | undefined>();
expectTypeOf(shareConfig.users).toEqualTypeOf<string[] | undefined>();
