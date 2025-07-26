import { assertType, expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;
import type { HandleEmptyObject } from "#utils";
import { PlaceableObject } from "#client/canvas/placeables/_module.mjs";

import Canvas = foundry.canvas.Canvas;
import ControlIcon = foundry.canvas.containers.ControlIcon;
import FormApplication = foundry.appv1.api.FormApplication;
import LightingLayer = foundry.canvas.layers.LightingLayer;
import MouseInteractionManager = foundry.canvas.interaction.MouseInteractionManager;

expectTypeOf(PlaceableObject.embeddedName).toBeString();

expectTypeOf(PlaceableObject.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  Array<"refresh" | "refreshState"> | undefined
>();

class FakeLight extends PlaceableObject<AmbientLightDocument.Implementation> {
  get bounds(): PIXI.Rectangle {
    return new PIXI.Rectangle();
  }

  protected async _draw(_options: HandleEmptyObject<PlaceableObject.DrawOptions>): Promise<void> {}
}

declare const someLightDoc: AmbientLightDocument.Stored;
const placeable = new FakeLight(someLightDoc);
assertType<Document.Any>(placeable.document);

expectTypeOf(placeable.scene).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(placeable.document).toEqualTypeOf<AmbientLightDocument.Implementation>();
expectTypeOf(placeable.controlIcon).toEqualTypeOf<ControlIcon | null>();
expectTypeOf(placeable.mouseInteractionManager).toEqualTypeOf<MouseInteractionManager<FakeLight> | null>();
expectTypeOf(placeable.cullable).toBeBoolean();
expectTypeOf(placeable._original).toEqualTypeOf<FakeLight | undefined>();
expectTypeOf(placeable.isOwner).toBeBoolean();
expectTypeOf(placeable.interactionState).toEqualTypeOf<MouseInteractionManager.INTERACTION_STATES | undefined>();
expectTypeOf(placeable.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(placeable.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(placeable.id).toBeString();
expectTypeOf(placeable.objectId).toBeString();
expectTypeOf(placeable.sourceId).toBeString();
expectTypeOf(placeable.isPreview).toBeBoolean();
expectTypeOf(placeable.hasPreview).toBeBoolean();
expectTypeOf(placeable.layer).toEqualTypeOf<LightingLayer.Any>();

// TODO: investigate AmbientLightDocument#sheet to see if this should be a more narrowed type
expectTypeOf(placeable.sheet).toEqualTypeOf<FormApplication.Any | foundry.applications.api.ApplicationV2.Any | null>();

expectTypeOf(placeable.controlled).toBeBoolean();
expectTypeOf(placeable.hover).toBeBoolean();
placeable.hover = false; // setter

expectTypeOf(placeable.getSnappedPosition()).toEqualTypeOf<Canvas.Point>();
// @ts-expect-error if passed an object, must be a valid point
expectTypeOf(placeable.getSnappedPosition({})).toEqualTypeOf<Canvas.Point>();
expectTypeOf(placeable.getSnappedPosition(null)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(placeable.getSnappedPosition({ x: 50, y: 70 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(placeable.getSnappedPosition(new PIXI.Point(5, 10))).toEqualTypeOf<Canvas.Point>();

expectTypeOf(placeable.applyRenderFlags()).toBeVoid();

// @ts-expect-error an object must be passed
expectTypeOf(placeable["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(placeable["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(placeable["_applyRenderFlags"]({ redraw: false, refresh: undefined })).toBeVoid();
expectTypeOf(placeable["_applyRenderFlags"]({ redraw: true, refresh: true, refreshState: true })).toBeVoid();

expectTypeOf(placeable.clear()).toEqualTypeOf<FakeLight | void>();

expectTypeOf(placeable.destroy()).toBeVoid();
expectTypeOf(placeable.destroy({})).toBeVoid();
expectTypeOf(placeable.destroy({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(placeable.destroy(true)).toBeVoid();

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(placeable["_destroy"]()).toBeVoid();
expectTypeOf(placeable["_destroy"]({})).toBeVoid();
expectTypeOf(placeable["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(placeable["_destroy"](true)).toBeVoid();
expectTypeOf(placeable["_destroy"](undefined)).toBeVoid();

expectTypeOf(placeable.draw()).toEqualTypeOf<Promise<FakeLight>>();
expectTypeOf(placeable.draw({})).toEqualTypeOf<Promise<FakeLight>>();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(placeable["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(placeable["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(placeable["_partialDraw"](async () => console.log("hello"))).toEqualTypeOf<Promise<FakeLight>>();

expectTypeOf(placeable.refresh()).toEqualTypeOf<FakeLight>();
expectTypeOf(placeable.refresh({})).toEqualTypeOf<FakeLight>();

expectTypeOf(placeable["_updateQuadtree"]()).toBeVoid();
expectTypeOf(placeable["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();
expectTypeOf(placeable["_getTargetAlpha"]()).toBeNumber();

// _onCreate, _onUpdate, and _onDelete are tested in specific placeable tests

expectTypeOf(placeable.control()).toBeBoolean();
expectTypeOf(placeable.control({})).toBeBoolean();
expectTypeOf(placeable.control({ releaseOthers: true })).toBeBoolean();
// @ts-expect-error releaseOthers is checked via `!== false` and can't be nullish
expectTypeOf(placeable.control({ releaseOthers: undefined })).toBeBoolean();

// @ts-expect-error _onControl is always passed a value
expectTypeOf(placeable["_onControl"]()).toBeVoid();
expectTypeOf(placeable["_onControl"]({})).toBeVoid();
expectTypeOf(placeable["_onControl"]({ releaseOthers: false })).toBeVoid();

expectTypeOf(placeable.release()).toBeBoolean();
expectTypeOf(placeable.release({})).toBeBoolean();

// @ts-expect-error _onRelease always gets passed a value
expectTypeOf(placeable["_onRelease"]()).toBeVoid();
expectTypeOf(placeable["_onRelease"]({})).toBeVoid();

expectTypeOf(placeable.clone()).toEqualTypeOf<FakeLight>();

expectTypeOf(placeable.rotate(72)).toEqualTypeOf<Promise<FakeLight>>();
expectTypeOf(placeable.rotate(27, 5)).toEqualTypeOf<Promise<FakeLight>>();

expectTypeOf(placeable["_updateRotation"]()).toBeNumber();
expectTypeOf(placeable["_updateRotation"]({})).toBeNumber();
expectTypeOf(placeable["_updateRotation"]({ angle: 90, snap: 7 })).toBeNumber();
expectTypeOf(placeable["_updateRotation"]({ delta: 25, snap: 3 })).toBeNumber();
// it would never make sense to pass both angle and delta as delta would be ignored but it is allowed
expectTypeOf(placeable["_updateRotation"]({ angle: null, delta: undefined, snap: undefined })).toBeNumber();

expectTypeOf(placeable["_getShiftedPosition"](-1, 1)).toEqualTypeOf<Canvas.Point>();
expectTypeOf(placeable.activateListeners()).toBeVoid();
expectTypeOf(placeable["_createInteractionManager"]()).toEqualTypeOf<MouseInteractionManager<FakeLight>>();

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;

// @ts-expect-error Arbitrary actions are not allowed based upon authorial intent. Even though
// subclasses might have new `_can*` methods Atropos has stated that they aren't meant to be
// user-extensible. See https://discord.com/channels/170995199584108546/811676497965613117/1363481705406533684
placeable.can(someUser, "asfs");

expectTypeOf(placeable.can(someUser, "control")).toBeBoolean();

// @ts-expect-error This doesn't actually work because HUD gets title cased to `Hud` and expects a
// method named `_canHud` which won't exsit.
// This means it's impossible to call `_canHUD` through `can`
placeable.can(someUser, "HUD");

expectTypeOf(placeable["_canHUD"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_canConfigure"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_canControl"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_canView"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_canCreate"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_canDrag"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_canHover"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_canUpdate"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_canDelete"](someUser, pointerEvent)).toBeBoolean();

expectTypeOf(placeable["_onHoverIn"](pointerEvent)).toEqualTypeOf<false | void>();
expectTypeOf(placeable["_onHoverIn"](pointerEvent, {})).toEqualTypeOf<false | void>();
expectTypeOf(placeable["_onHoverIn"](pointerEvent, { hoverOutOthers: true })).toEqualTypeOf<false | void>();
expectTypeOf(placeable["_onHoverIn"](pointerEvent, { hoverOutOthers: null })).toEqualTypeOf<false | void>();

expectTypeOf(placeable["_onHoverOut"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_propagateLeftClick"](pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_onClickLeft"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onUnclickLeft"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onClickLeft2"](pointerEvent)).toBeVoid();

expectTypeOf(placeable["_propagateRightClick"](pointerEvent)).toBeBoolean();
expectTypeOf(placeable["_onClickRight"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onUnclickRight"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onClickRight2"](pointerEvent)).toBeVoid();

expectTypeOf(placeable["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onDragStart"]()).toBeVoid();
expectTypeOf(placeable["_onDragEnd"]()).toBeVoid();
expectTypeOf(placeable["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onDragLeftDrop"](pointerEvent)).toBeVoid();

expectTypeOf(placeable["_prepareDragLeftDropUpdates"](pointerEvent)).toEqualTypeOf<
  PlaceableObject.AnyDragLeftDropUpdate[] | null
>();

expectTypeOf(placeable["_onDragLeftCancel"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onDragRightStart"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onDragRightMove"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onDragRightDrop"](pointerEvent)).toBeVoid();
expectTypeOf(placeable["_onDragRightCancel"](pointerEvent)).toBeVoid();

expectTypeOf(placeable["_onLongPress"](pointerEvent, placeable.center)).toBeVoid();
