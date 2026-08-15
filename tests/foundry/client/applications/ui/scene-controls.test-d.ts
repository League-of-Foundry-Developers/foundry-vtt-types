import { expectTypeOf } from "vitest";
import type { AnyObject, DeepPartial } from "fvtt-types/utils";

import SceneControls = foundry.applications.ui.SceneControls;

const sceneControls = new SceneControls({});

expectTypeOf(SceneControls.DEFAULT_OPTIONS).toEqualTypeOf<
  DeepPartial<foundry.applications.api.ApplicationV2.Configuration> & object
>();
expectTypeOf(SceneControls.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(SceneControls.emittedEvents).toEqualTypeOf<string[]>();

// The runtime builds this as `[...super.emittedEvents, "activate"]`.
expectTypeOf<SceneControls.EmittedEvents>().toEqualTypeOf<
  [...foundry.applications.api.ApplicationV2.EmittedEvents, "activate"]
>();

expectTypeOf(sceneControls.controls).toEqualTypeOf<Record<string, SceneControls.Control>>();
expectTypeOf(sceneControls.tools).toEqualTypeOf<Record<string, SceneControls.Tool>>();

// Both getters fall back to `null` — `control` when the active control set is not in the record,
// `tool` when the active control has no active tool.
expectTypeOf(sceneControls.control).toEqualTypeOf<SceneControls.Control | null>();
expectTypeOf(sceneControls.tool).toEqualTypeOf<SceneControls.Tool | null>();
expectTypeOf(sceneControls.paletteOpen).toEqualTypeOf<boolean>();

expectTypeOf(sceneControls.activate()).toEqualTypeOf<Promise<void>>();
expectTypeOf(sceneControls.activate({ control: "tokens", tool: "select" })).toEqualTypeOf<Promise<void>>();
expectTypeOf(sceneControls.activate({ toggles: { snap: true } })).toEqualTypeOf<Promise<void>>();

expectTypeOf(sceneControls.togglePlaceablePalette()).toEqualTypeOf<Promise<void>>();
expectTypeOf(sceneControls.togglePlaceablePalette(true)).toEqualTypeOf<Promise<void>>();

expectTypeOf(sceneControls._updateNotesIcon()).toEqualTypeOf<void>();
expectTypeOf(sceneControls._updatePresetPips()).toEqualTypeOf<void>();

expectTypeOf(SceneControls.COMMON_TOOLCLIP_ITEMS).toEqualTypeOf<Record<string, SceneControls.CommonToolclipItem>>();
expectTypeOf(SceneControls.COMMON_TOOLCLIP_ITEMS["create"]!.heading).toEqualTypeOf<string>();
expectTypeOf(SceneControls.COMMON_TOOLCLIP_ITEMS["create"]!.content).toEqualTypeOf<string | undefined>();
expectTypeOf(SceneControls.COMMON_TOOLCLIP_ITEMS["create"]!.reference).toEqualTypeOf<string | undefined>();
// The `COMMON_TOOLCLIP_ITEMS` entries are themselves valid input, alongside their keys and `null`.
expectTypeOf(SceneControls.buildToolclipItems(["create", null, { heading: "H", reference: "R" }])).toEqualTypeOf<
  SceneControls.ToolclipConfigurationItem[]
>();

// A control set carries the canvas layer name whose palette class it drives; tokens has no palette,
// so the member is optional.
declare const control: SceneControls.Control;
expectTypeOf(control.layer).toEqualTypeOf<string | undefined>();
expectTypeOf(control.tools).toEqualTypeOf<Record<string, SceneControls.Tool> | undefined>();
expectTypeOf(control.activeTool).toEqualTypeOf<string | undefined>();
expectTypeOf(control.onToolChange).toEqualTypeOf<
  ((event: Event, tool: SceneControls.Tool, active: boolean) => void) | undefined
>();

declare const tool: SceneControls.Tool;
expectTypeOf(tool.interaction).toEqualTypeOf<boolean | undefined>();
expectTypeOf(tool.control).toEqualTypeOf<boolean | undefined>();
expectTypeOf(tool.creation).toEqualTypeOf<boolean | undefined>();
expectTypeOf(tool.createData).toEqualTypeOf<AnyObject | undefined>();
expectTypeOf(tool.shapeData).toEqualTypeOf<AnyObject | undefined>();

declare const context: SceneControls.RenderContext;
expectTypeOf(context.isSelect).toEqualTypeOf<boolean>();
expectTypeOf(context.controls).toEqualTypeOf<SceneControls.ControlContext[]>();
expectTypeOf(context.tools).toEqualTypeOf<SceneControls.ToolContext[]>();
expectTypeOf(context.activationChange).toEqualTypeOf<SceneControls.ActivationChange>();
expectTypeOf(context.controls[0]!.active).toEqualTypeOf<boolean>();
expectTypeOf(context.tools[0]!.showToolclip).toEqualTypeOf<boolean>();
expectTypeOf(context.tools[0]!.pip).toEqualTypeOf<boolean | undefined>();

// Each change field is `null` when that dimension did not change.
declare const activationChange: SceneControls.ActivationChange;
expectTypeOf(activationChange.controlChange).toEqualTypeOf<string | null>();
expectTypeOf(activationChange.toolChange).toEqualTypeOf<string | null>();
expectTypeOf(activationChange.toggleChanges).toEqualTypeOf<Record<string, boolean>>();

// Deprecated, but they return the control/tool name rather than nothing.
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(sceneControls.activeControl).toEqualTypeOf<string>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(sceneControls.activeTool).toEqualTypeOf<string | null | undefined>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(sceneControls.initialize()).toEqualTypeOf<Promise<SceneControls>>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(sceneControls.initialize({ layer: "tokens", tool: "select" })).toEqualTypeOf<Promise<SceneControls>>();
