/* eslint-disable @typescript-eslint/no-deprecated */
import { expectTypeOf, test } from "vitest";
import type { DeepPartial, MaybePromise } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import FrameViewer = foundry.applications.sidebar.apps.FrameViewer;

declare const options: DeepPartial<FrameViewer.RenderOptions>;
declare const context: FrameViewer.RenderContext;

declare const iframe: HTMLIFrameElement;
declare const element: HTMLElement;

test("foundry/client/applications/sidebar/apps/frame-viewer", () => {
  // Deprecated since v13, until v15 — the whole class, warned from its constructor.
  const viewer = new FrameViewer({ url: "https://foundryvtt.com/api/v14" });

  expectTypeOf(viewer).toExtend<ApplicationV2.Any>();

  expectTypeOf(viewer["_configureRenderOptions"](options)).toBeVoid();

  // The only synchronous `_renderHTML` in core, kept at the base's width so an async override still fits.
  expectTypeOf(viewer["_renderHTML"](context, options)).toEqualTypeOf<MaybePromise<HTMLIFrameElement>>();
  expectTypeOf(viewer["_replaceHTML"](iframe, element)).toBeVoid();

  // `DEFAULT_OPTIONS` sets the key to `undefined`, so it is always present but never required to be a string.
  expectTypeOf<FrameViewer.Configuration["url"]>().toEqualTypeOf<string | undefined>();
});
