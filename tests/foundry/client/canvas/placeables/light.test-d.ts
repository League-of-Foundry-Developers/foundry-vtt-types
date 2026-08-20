import { expectTypeOf } from "vitest";

import AmbientLight = foundry.canvas.placeables.AmbientLight;
import AmbientLightShapeControls = foundry.canvas.placeables.lights.AmbientLightShapeControls;
import PreciseText = foundry.canvas.containers.PreciseText;

expectTypeOf(AmbientLight.implementation).toEqualTypeOf<AmbientLight.ImplementationClass>();
expectTypeOf(AmbientLight.embeddedName).toEqualTypeOf<"AmbientLight">();
expectTypeOf(AmbientLight.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  // undefined only from the optional chain, not underlying type
  | Array<"refresh" | "refreshState" | "refreshVisibility" | "refreshField" | "refreshPosition" | "refreshElevation">
  | undefined
>();

declare const doc: AmbientLightDocument.Stored;
declare const scene: Scene.Stored;

const light = new CONFIG.AmbientLight.objectClass(doc);

expectTypeOf(light.field).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(light.lightSource);
expectTypeOf(light.controls).toEqualTypeOf<AmbientLightShapeControls | undefined>();
expectTypeOf(light.tooltip).toEqualTypeOf<PreciseText | undefined>();
expectTypeOf(light.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(light.sourceId).toBeString();
expectTypeOf(light.config).toEqualTypeOf<foundry.data.LightData>();
expectTypeOf(light.global).toBeBoolean();
expectTypeOf(light.radius).toBeNumber();
expectTypeOf(light.dimRadius).toBeNumber();
expectTypeOf(light.brightRadius).toBeNumber();
expectTypeOf(light.isVisible).toBeBoolean();
expectTypeOf(light.isLightSource).toBeBoolean();
expectTypeOf(light.isDarknessSource).toBeBoolean();
expectTypeOf(light["_isLightSourceDisabled"]()).toBeBoolean();
expectTypeOf(light.emitsDarkness).toBeBoolean();
expectTypeOf(light.emitsLight).toBeBoolean();
expectTypeOf(light.isInteractable).toBeBoolean();

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(light["_destroy"]()).toBeVoid();
expectTypeOf(light["_destroy"]({})).toBeVoid();
expectTypeOf(light["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(light["_destroy"](true)).toBeVoid();
expectTypeOf(light["_destroy"](undefined)).toBeVoid();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(light["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(light["_draw"]({})).toEqualTypeOf<Promise<void>>();

// @ts-expect-error an object must be passed
expectTypeOf(light["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(light["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(light["_applyRenderFlags"]({ refreshElevation: false, refreshPosition: undefined })).toBeVoid();
expectTypeOf(
  light["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshField: true,
    refreshPosition: true,
    refreshState: true,
    refreshElevation: true,
  }),
).toBeVoid();

expectTypeOf(light["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();

expectTypeOf(light["_refreshPosition"]()).toBeVoid();
expectTypeOf(light["_refreshRotation"]()).toBeVoid();
expectTypeOf(light["_refreshSize"]()).toBeVoid();
expectTypeOf(light["_refreshField"]()).toBeVoid();
expectTypeOf(light["_refreshTooltip"]()).toBeVoid();
expectTypeOf(light["_getTooltipText"]()).toBeString();
expectTypeOf(light["_getTextStyle"]()).toEqualTypeOf<PIXI.TextStyle>();
expectTypeOf(light["_getMeasuredShapes"]()).toEqualTypeOf<foundry.data.BaseShapeData[]>();
expectTypeOf(light["_refreshState"]()).toBeVoid();

expectTypeOf(
  light["_onCreate"](
    doc.toObject(),
    { action: "create", parent: scene, modifiedTime: 7, render: true, renderSheet: false },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  light["_onUpdate"](
    // partial source data
    { config: { bright: 20, dim: 50, color: "#AB9435" }, flags: { core: { sheetLock: true } } },
    { action: "update", parent: scene, modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  light["_onDelete"]({ action: "delete", parent: scene, modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX"),
).toBeVoid();

expectTypeOf(light.initializeLightSource()).toBeVoid();
expectTypeOf(light.initializeLightSource({})).toBeVoid();
expectTypeOf(light.initializeLightSource({ deleted: true })).toBeVoid();
expectTypeOf(light.initializeLightSource({ deleted: undefined })).toBeVoid();
expectTypeOf(light["_getLightSourceData"]()).toEqualTypeOf<AmbientLight.LightSourceData>();

// TODO: _onCreate, _onUpdate, _onDelete tests after document test helpers are done

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(light._hasShapeChanged({ rotation: 45 })).toBeBoolean();

expectTypeOf(light["_canHUD"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(light["_canConfigure"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(light["_onControl"]({})).toBeVoid();
expectTypeOf(light["_onRelease"]({})).toBeVoid();
expectTypeOf(light["_onClickRight"](pointerEvent)).toBeVoid();
expectTypeOf(light["_updateDragPreviews"](pointerEvent)).toBeVoid();
