import { expectTypeOf } from "vitest";
import type { AnyMutableObject, EmptyObject } from "fvtt-types/utils";
import type { EditorState } from "prosemirror-state";

import Token = foundry.canvas.placeables.Token;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

Hooks.on("canvasTearDown", (canvas, options) => {
  expectTypeOf(canvas).toEqualTypeOf<foundry.canvas.Canvas>();
  expectTypeOf(options).toEqualTypeOf<foundry.canvas.Canvas.TearDownOptions>();
});

Hooks.on("tearDownTokenLayer", (layer, options) => {
  expectTypeOf(layer).toEqualTypeOf<foundry.canvas.layers.TokenLayer.Implementation>();
  expectTypeOf(options).toEqualTypeOf<foundry.canvas.layers.CanvasLayer.TearDownOptions>();
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
  expectTypeOf(application).toEqualTypeOf<foundry.applications.sidebar.tabs.PlaceableTab.Any>();
  expectTypeOf(menuItems).toEqualTypeOf<foundry.applications.ux.ContextMenu.Entry<HTMLElement>[]>();
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

Hooks.on("modifyTokenAttribute", (_data, _updates, actor) => {
  expectTypeOf(actor).toEqualTypeOf<Actor.Implementation>();
});

Hooks.on("refreshToken", (token, flags) => {
  expectTypeOf(token).toEqualTypeOf<Token.Implementation>();
  expectTypeOf(flags.refreshPosition).toEqualTypeOf<boolean | undefined>();
  // @ts-expect-error Unknown render flags are not accepted.
  flags.nonexistentFlag;
});

Hooks.on("pasteToken", (_objects, data, options) => {
  expectTypeOf(data).toEqualTypeOf<TokenDocument.Source[]>();
  expectTypeOf(options.cut).toEqualTypeOf<boolean>();
});

Hooks.on("getHeaderControlsApplicationV2", (_app, controls) => {
  expectTypeOf(controls).toEqualTypeOf<ApplicationV2.HeaderControlsEntry[]>();
});

Hooks.on("activateNote", () => {});
Hooks.on("applyActiveEffect", (model) => {
  expectTypeOf(model).toEqualTypeOf<foundry.abstract.DataModel.Any>();
});

Hooks.on("dropItemSheetData", (item, sheet, data) => {
  expectTypeOf(item).toEqualTypeOf<Item.Implementation>();
  expectTypeOf(sheet).toEqualTypeOf<foundry.applications.sheets.ItemSheetV2.Any>();
  expectTypeOf(data).toEqualTypeOf<AnyMutableObject>();
  return false;
});

Hooks.on("getCompendiumContextOptions", (app, entries) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.sidebar.tabs.CompendiumDirectory.Any>();
  expectTypeOf(entries).toEqualTypeOf<foundry.applications.ux.ContextMenu.Entry<HTMLElement>[]>();
});

Hooks.on("getAdventureContextOptions", (app) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.sidebar.apps.Compendium.Any>();
});

Hooks.on("getActiveEffectContextOptions", (app) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.sidebar.apps.Compendium.Any>();
});

Hooks.on("getLevelContextOptions", (app) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.sheets.SceneConfig.Any>();
});

Hooks.on("activateSceneControls", (app, change) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.ui.SceneControls.Any>();
  expectTypeOf(change).toEqualTypeOf<foundry.applications.ui.SceneControls.ActivationChange>();
});

Hooks.on("activateChatLog", (app) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.sidebar.tabs.ChatLog.Any>();
});
Hooks.on("deactivateChatLog", () => {});
Hooks.on("closeViewJournalEntryPageSheet", (app) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.sheets.journal.JournalEntryPageSheet.Any>();
});

Hooks.on("initializePointLightSourceShaders", (source) => {
  expectTypeOf(source).toEqualTypeOf<foundry.canvas.sources.PointLightSource>();
});
Hooks.on("initializePointVisionSourceShaders", () => {});
Hooks.on("initializePointDarknessSourceShaders", () => {});
Hooks.on("initializeGlobalLightSourceShaders", () => {});

Hooks.on("hotbarDrop", (_app, _data, slot) => {
  expectTypeOf(slot).toEqualTypeOf<string>();
});

Hooks.on("error", (...args) => {
  if (args[0] === "ClientDocumentMixin#_initialize") {
    expectTypeOf(args[2].uuid).toEqualTypeOf<string>();
    // @ts-expect-error Preparation errors carry uuid, not id.
    args[2].id;
  }
  if (args[0] === "Actors#_initialize") {
    expectTypeOf(args[2].id).toEqualTypeOf<string | null | undefined>();
    expectTypeOf(args[2].documentName).toEqualTypeOf<"Actor">();
  }
  if (args[0] === "ClientDatabaseBackend##preCreateDocumentArray") {
    expectTypeOf(args[2].id).toEqualTypeOf<string | null | undefined>();
  }
});

// @ts-expect-error Paste hooks receive an array of document sources.
Hooks.call("pasteToken", [], {}, { cut: false });
// @ts-expect-error Header controls are an array.
Hooks.callAll("getHeaderControlsApplicationV2", {} as ApplicationV2.Any, {});

class HookLightSource extends foundry.canvas.sources.PointLightSource {
  hookSourceMarker = true;
}

declare module "fvtt-types/configuration" {
  namespace Hooks {
    interface RenderedEffectSourceConfig {
      HookLightSource: HookLightSource;
    }
    interface DocumentCollectionConfig {
      HookActors: "Actor";
    }
  }
}

Hooks.on("initializeHookLightSourceShaders", (source) => {
  expectTypeOf(source).toEqualTypeOf<HookLightSource>();
  expectTypeOf(source.hookSourceMarker).toEqualTypeOf<boolean>();
});

Hooks.on("error", (location, _error, data) => {
  if (location === "HookActors#_initialize") {
    expectTypeOf(data.documentName).toEqualTypeOf<"Actor">();
  }
});

Hooks.on("applyCompendiumArt", (documentClass, source) => {
  expectTypeOf(documentClass).toEqualTypeOf<Actor.ImplementationClass | Item.ImplementationClass>();
  expectTypeOf(source).toEqualTypeOf<Actor.Source | Item.Source>();
});

Hooks.on("drawEffectsCanvasGroup", (_group, options) => {
  expectTypeOf(options).toEqualTypeOf<EmptyObject | undefined>();
});

Hooks.on("dropCanvasData", (_canvas, data) => {
  expectTypeOf(data.x).toEqualTypeOf<number>();
  expectTypeOf(data.y).toEqualTypeOf<number>();
  data["customDrop"] = true;
});

Hooks.on("createProseMirrorEditor", (_uuid, _plugins, options) => {
  expectTypeOf(options.state).toEqualTypeOf<EditorState>();
});

Hooks.on("getProseMirrorMenuDropDowns", (menu, config) => {
  expectTypeOf(menu).toEqualTypeOf<foundry.prosemirror.ProseMirrorMenu>();
  expectTypeOf(config).toEqualTypeOf<foundry.prosemirror.ProseMirrorMenu.DropDowns>();
  expectTypeOf(config.format.entries).toEqualTypeOf<foundry.prosemirror.ProseMirrorDropDown.Entry[]>();
  expectTypeOf(config.sizes.weight).toEqualTypeOf<number | undefined>();
  config["customDropDown"] = { title: "Custom", cssClass: "custom", entries: [] };
});

// eslint-disable-next-line @typescript-eslint/no-deprecated -- V14 still emits this compatibility hook.
Hooks.on("renderChatMessage", () => {});
// eslint-disable-next-line @typescript-eslint/no-deprecated -- V14 still emits this compatibility hook.
Hooks.on("chatBubble", () => false);

// @ts-expect-error Refresh hooks require the cleared flags argument.
Hooks.callAll("refreshToken", {} as Token.Implementation);
// @ts-expect-error Hotbar slots are read from dataset as strings.
Hooks.call("hotbarDrop", {} as foundry.applications.ui.Hotbar.Any, {}, 1);
// @ts-expect-error Shader initialization hooks are registered by source class name.
Hooks.on("initializeUnknownSourceShaders", () => {});

Hooks.on("activateEditorLegacy", (editor, options) => {
  expectTypeOf(editor).toEqualTypeOf<foundry.appv1.api.FormApplication.FormApplicationEditor>();
  expectTypeOf(options).toEqualTypeOf<foundry.applications.ux.TextEditor.Options>();
});

Hooks.on("error", (location, _err, data) => {
  if (location === "EmbeddedCollection#_initializeDocument") {
    expectTypeOf(data.uuid).toEqualTypeOf<string>();
  }
});

Hooks.on("renderHandlebarsApplication", (app) => {
  expectTypeOf(app).toExtend<ApplicationV2.Any>();
});
Hooks.on("activateHandlebarsApplication", (_app, change) => {
  expectTypeOf(change).toEqualTypeOf<foundry.applications.ui.SceneControls.ActivationChange | undefined>();
});
Hooks.on("deactivateHandlebarsApplication", () => {});
Hooks.on("closeViewHandlebarsApplication", () => {});
Hooks.on("renderTokenApplication", () => {});
Hooks.on("renderPlaceablePalette", () => {});

Hooks.on("canvasConfig", (config) => {
  expectTypeOf(config.width).toEqualTypeOf<number>();
  config.width += 100;
});
// @ts-expect-error Canvas configuration is always an object.
Hooks.callAll("canvasConfig", undefined);
