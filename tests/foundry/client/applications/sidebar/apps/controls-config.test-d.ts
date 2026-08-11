import { expectTypeOf } from "vitest";
import type { DeepPartial, MaybePromise } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import CategoryBrowser = foundry.applications.api.CategoryBrowser;
import ClientKeybindings = foundry.helpers.interaction.ClientKeybindings;
import ControlsConfig = foundry.applications.sidebar.apps.ControlsConfig;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

declare const controlsConfig: ControlsConfig;

expectTypeOf(controlsConfig).toExtend<ApplicationV2.Any>();
expectTypeOf(controlsConfig).toExtend<CategoryBrowser.Any>();

expectTypeOf(ControlsConfig.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();
expectTypeOf(ControlsConfig.POINTER_CONTROLS).toEqualTypeOf<readonly ControlsConfig.PointerControl[]>();

// The trailing GM-only flag is genuinely optional: most rows omit it.
declare const pointerControl: ControlsConfig.PointerControl;
expectTypeOf(pointerControl[3]).toEqualTypeOf<boolean | undefined>();
const gmOnlyControl: ControlsConfig.PointerControl = ["place-hidden-token", "CONTROLS.TokenPlaceHidden", ["Alt"], true];
const plainControl: ControlsConfig.PointerControl = ["canvas-zoom", "CONTROLS.CanvasZoom", ["MouseWheel"]];
expectTypeOf(gmOnlyControl).toEqualTypeOf<ControlsConfig.PointerControl>();
expectTypeOf(plainControl).toEqualTypeOf<ControlsConfig.PointerControl>();

// `humanizeBinding` is called both with stored bindings and with a bare `{ key, modifiers }` literal.
declare const storedBinding: ClientKeybindings.StoredKeybindingActionBinding;
expectTypeOf(ControlsConfig.humanizeBinding(storedBinding)).toBeString();
expectTypeOf(ControlsConfig.humanizeBinding({ key: "Digit1", modifiers: [] })).toBeString();

declare const renderOptions: DeepPartial<ControlsConfig.RenderOptions>;
expectTypeOf(controlsConfig["_configureRenderOptions"](renderOptions)).toBeVoid();

// Synchronous at runtime; declared at the base's widened type so an async override still fits.
expectTypeOf(controlsConfig["_prepareCategoryData"]()).toEqualTypeOf<
  MaybePromise<Record<string, CategoryBrowser.CategoryData<ControlsConfig.Entry>>>
>();

declare const categoryA: CategoryBrowser.CategoryData<ControlsConfig.Entry>;
declare const categoryB: CategoryBrowser.CategoryData<ControlsConfig.Entry>;
expectTypeOf(controlsConfig["_sortCategories"](categoryA, categoryB)).toBeNumber();

declare const renderContext: DeepPartial<ControlsConfig.RenderContext<ControlsConfig.Entry>>;
expectTypeOf(controlsConfig["_onFirstRender"](renderContext, renderOptions)).toEqualTypeOf<Promise<void>>();

expectTypeOf<ControlsConfig.Entry["id"]>().toBeString();
expectTypeOf<ControlsConfig.Entry["precedence"]>().toBeNumber();
expectTypeOf<ControlsConfig.Entry["order"]>().toBeNumber();
expectTypeOf<ControlsConfig.Entry["hint"]>().toBeString();
expectTypeOf<ControlsConfig.Entry["uneditable"]>().toEqualTypeOf<ClientKeybindings.KeybindingActionBinding[]>();
expectTypeOf<ControlsConfig.Entry["bindings"]>().toEqualTypeOf<ControlsConfig.BindingContext[]>();

// `null` rather than an absent key when a binding collides with nothing.
expectTypeOf<ControlsConfig.BindingContext["conflicts"]>().toEqualTypeOf<string | null>();
expectTypeOf<ControlsConfig.BindingContext["editable"]>().toBeBoolean();
