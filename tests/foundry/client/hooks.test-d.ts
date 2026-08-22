import { expectTypeOf } from "vitest";
import type { EmptyObject } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

Hooks.on("canvasTearDown", (canvas, options) => {
  expectTypeOf(canvas).toEqualTypeOf<foundry.canvas.Canvas>();
  expectTypeOf(options).toEqualTypeOf<foundry.canvas.Canvas.TearDownOptions>();
});

Hooks.on("tearDownTokenLayer", (layer, options) => {
  expectTypeOf(layer).toEqualTypeOf<foundry.canvas.layers.TokenLayer.Implementation>();
  expectTypeOf(options).toEqualTypeOf<EmptyObject>();
});

Hooks.on("initializeEdges", (scene) => {
  expectTypeOf(scene).toEqualTypeOf<foundry.documents.Scene.Implementation>();
});

Hooks.on("preRenderApplicationV2", (application, context, options) => {
  expectTypeOf(application).toEqualTypeOf<ApplicationV2.Any>();
  expectTypeOf(context).toEqualTypeOf<ApplicationV2.RenderContextOf<ApplicationV2.Any>>();
  expectTypeOf(options).toEqualTypeOf<ApplicationV2.RenderOptionsOf<ApplicationV2.Any>>();
});

Hooks.on("getTokenPlaceableContextOptions", (application, menuItems) => {
  expectTypeOf(application).toEqualTypeOf<ApplicationV2.Any>();
  expectTypeOf(menuItems).toEqualTypeOf<foundry.applications.ux.ContextMenu.Entry<JQuery | HTMLElement>[]>();
});

Hooks.on("planToken", (document) => {
  expectTypeOf(document).toEqualTypeOf<TokenDocument.Implementation>();
});

Hooks.on("moveToken", (_document, movement) => {
  expectTypeOf(movement).toEqualTypeOf<TokenDocument.MovementOperation>();
});

Hooks.on("chatInput", (event, options) => {
  expectTypeOf(event).toEqualTypeOf<KeyboardEvent>();
  expectTypeOf(options.recordPending).toEqualTypeOf<boolean>();
});

Hooks.on("renderChatInput", (_app, elements, context, options) => {
  expectTypeOf(elements).toEqualTypeOf<Record<string, HTMLElement>>();
  expectTypeOf(context.previousParent).toEqualTypeOf<HTMLElement>();
  expectTypeOf(options.closing).toEqualTypeOf<boolean | undefined>();
});

Hooks.on("renderChatMessageHTML", (_message, _html, context) => {
  expectTypeOf(context).toEqualTypeOf<foundry.documents.ChatMessage.MessageData | undefined>();
});

Hooks.on("openDetachedWindow", (id, win) => {
  expectTypeOf(id).toEqualTypeOf<string>();
  expectTypeOf(win).toEqualTypeOf<WindowProxy>();
});

Hooks.on("activateEditorLegacy", (_editor, _options, initialContent) => {
  expectTypeOf(initialContent).toEqualTypeOf<string>();
});
