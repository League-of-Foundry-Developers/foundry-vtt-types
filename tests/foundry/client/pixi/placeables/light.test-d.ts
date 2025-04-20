import { expectTypeOf } from "vitest";
import type PointDarknessSource from "../../../../../src/foundry/client-esm/canvas/sources/point-darkness-source.d.mts";
import type PointLightSource from "../../../../../src/foundry/client-esm/canvas/sources/point-light-source.d.mts";

expectTypeOf(AmbientLight.embeddedName).toEqualTypeOf<"AmbientLight">();
expectTypeOf(AmbientLight.RENDER_FLAGS.redraw?.propagate).toEqualTypeOf<
  // undefined only from the optional chain, not underlying type
  Array<"redraw" | "refresh" | "refreshState" | "refreshField" | "refreshPosition" | "refreshElevation"> | undefined
>();

declare const doc: AmbientLightDocument.Stored;
const light = new CONFIG.AmbientLight.objectClass(doc);

expectTypeOf(light.field).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(light.lightSource);
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

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(light["_destroy"]()).toBeVoid();
expectTypeOf(light["_destroy"]({})).toBeVoid();
expectTypeOf(light["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(light["_destroy"](true)).toBeVoid();
expectTypeOf(light["_destroy"](undefined)).toBeVoid();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(light["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(light["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(light.clear()).toEqualTypeOf<AmbientLight.Object>();

// @ts-expect-error an object must be passed
expectTypeOf(light["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(light["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(light["_applyRenderFlags"]({ refreshElevation: null, refreshPosition: undefined })).toBeVoid();
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

expectTypeOf(light["_refreshField"]()).toBeVoid();
expectTypeOf(light["_refreshPosition"]()).toBeVoid();
expectTypeOf(light["_refreshElevation"]()).toBeVoid();
expectTypeOf(light["_refreshState"]()).toBeVoid();

expectTypeOf(
  light["_onCreate"](doc.toObject(), { modifiedTime: 7, render: true, renderSheet: false }, "XXXXXSomeIDXXXXX"),
).toBeVoid();

expectTypeOf(
  light["_onUpdate"](
    // partial source data
    { config: { bright: 20, dim: 50, color: "#AB9435" }, flags: { core: { sheetLock: true } } },
    { modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(light["_onDelete"]({ modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX")).toBeVoid();

expectTypeOf(light.refreshControl()).toBeVoid();

expectTypeOf(light.initializeLightSource()).toBeVoid();
expectTypeOf(light.initializeLightSource({})).toBeVoid();
expectTypeOf(light.initializeLightSource({ deleted: true })).toBeVoid();
expectTypeOf(light.initializeLightSource({ deleted: null })).toBeVoid();
expectTypeOf(light["_getLightSourceData"]()).toEqualTypeOf<AmbientLight.LightSourceData>();

declare const someUser: User.Implementation;
declare const someEvent: PIXI.FederatedEvent;
declare const dragEvent: DragEvent;
expectTypeOf(light["_canHUD"](someUser, someEvent)).toBeBoolean();
expectTypeOf(light["_canConfigure"](someUser, someEvent)).toBeBoolean();
expectTypeOf(light["_canDragLeftStart"](someUser, dragEvent)).toBeBoolean();
expectTypeOf(light["_onHoverIn"](someEvent)).toBeVoid();
expectTypeOf(light["_onClickRight"](someEvent)).toBeVoid();
expectTypeOf(light["_onDragLeftMove"](someEvent)).toBeVoid();
expectTypeOf(light["_onDragEnd"]()).toBeVoid();
expectTypeOf(light["_prepareDragLeftDropUpdates"](someEvent)).toEqualTypeOf<PlaceableObject.DragLeftDropUpdate[]>();

// deprecated since v12, until v14
expectTypeOf(light.updateSource()).toBeVoid();
expectTypeOf(light.updateSource({})).toBeVoid();
expectTypeOf(light.updateSource({ deleted: true })).toBeVoid();
expectTypeOf(light.updateSource({ deleted: null })).toBeVoid();
expectTypeOf(light.source).toEqualTypeOf<
  PointLightSource.ConfiguredInstance | PointDarknessSource.ConfiguredInstance | undefined
>();
