import { describe, expectTypeOf, test } from "vitest";

import Ruler = foundry.canvas.interaction.Ruler;
import Canvas = foundry.canvas.Canvas;

declare const user: User.Implementation;
declare const event: PIXI.FederatedEvent;
declare const wheelEvent: WheelEvent;
declare const waypoint: Ruler.Waypoint;

// @ts-expect-error Ruler requires a passed user as of v13
new Ruler();
const ruler = new Ruler(user);

describe("BaseRuler tests", () => {
  test("Trivial methods, properties, getters, and setters", () => {
    expectTypeOf(Ruler.getSnappedPoint({ x: 50, y: 70 })).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(Ruler.RENDER_FLAGS.refresh).toEqualTypeOf<
      foundry.canvas.interaction.RenderFlag<Ruler.RENDER_FLAGS, "refresh">
    >();
    expectTypeOf(Ruler.canMeasure).toBeBoolean();

    expectTypeOf(ruler.user).toEqualTypeOf<User.Implementation>();
    expectTypeOf(ruler.active).toBeBoolean();
    expectTypeOf(ruler.visible).toBeBoolean();

    expectTypeOf(ruler.path).toEqualTypeOf<readonly Readonly<Canvas.ElevatedPoint>[]>();
    ruler.path = [
      { x: 200, y: 300, elevation: 0 },
      { x: 500, y: 300, elevation: 20 },
    ]; // Setter

    expectTypeOf(ruler.origin).toEqualTypeOf<Canvas.ElevatedPoint | undefined>();
    expectTypeOf(ruler.destination).toEqualTypeOf<Canvas.ElevatedPoint | undefined>();

    expectTypeOf(ruler.hidden).toBeBoolean();
    ruler.hidden = true; // Setter

    expectTypeOf(ruler["_onPathChange"]()).toBeVoid();
    expectTypeOf(ruler["_onHiddenChange"]()).toBeVoid();

    expectTypeOf(ruler.reset()).toBeVoid();
    // #draw and #destroy are abstract, tested with Ruler methods
    expectTypeOf(ruler.refresh()).toBeVoid();
    // #_refresh is abstract, tested with Ruler methods
    expectTypeOf(ruler.applyRenderFlags()).toBeVoid();

    expectTypeOf(ruler["_addDragWaypoint"]({ x: 222, y: 333 })).toBeVoid();
    expectTypeOf(ruler["_addDragWaypoint"]({ x: 222, y: 333 }, { snap: false })).toBeVoid();
    expectTypeOf(ruler["_addDragWaypoint"]({ x: 222, y: 333 }, { snap: undefined })).toBeVoid();
    expectTypeOf(ruler["_removeDragWaypoint"]()).toBeVoid();

    expectTypeOf(ruler["_changeDragElevation"](20)).toBeVoid();
    expectTypeOf(ruler["_changeDragElevation"](20, { precise: true })).toBeVoid();
    expectTypeOf(ruler["_changeDragElevation"](20, { precise: undefined })).toBeVoid();
  });

  test("Event callbacks", () => {
    expectTypeOf(ruler["_onDragStart"](event)).toBeVoid();
    expectTypeOf(ruler["_onDragCancel"](event)).toEqualTypeOf<boolean | void>();
    expectTypeOf(ruler["_onClickLeft"](event)).toBeVoid();
    expectTypeOf(ruler["_onClickRight"](event)).toBeVoid();
    expectTypeOf(ruler["_onMouseMove"](event)).toBeVoid();
    expectTypeOf(ruler["_onMouseUp"](event)).toBeVoid();
    expectTypeOf(ruler["_onMouseWheel"](wheelEvent)).toBeVoid();
  });

  test("Deprecated", () => {
    // deprecated since v13, until v15

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(ruler.clear()).toBeVoid();

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(ruler.update()).toBeVoid();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(ruler.update({ hidden: true, path: [{ x: 1, y: 2, elevation: 3 }] })).toBeVoid();
  });
});

describe("Ruler tests", () => {
  test("Trivial methods, properties, getters, and setters", () => {
    expectTypeOf(Ruler.WAYPOINT_LABEL_TEMPLATE).toBeString();

    const outlineConfig = ruler["_configureOutline"]();
    expectTypeOf(outlineConfig.thickness).toBeNumber();
    expectTypeOf(outlineConfig.color).toEqualTypeOf<PIXI.ColorSource>();

    expectTypeOf(ruler.draw()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(ruler.destroy()).toBeVoid();
    expectTypeOf(ruler["_refresh"]()).toBeVoid();

    expectTypeOf(ruler["_getWaypointLabelContext"](waypoint, {})).toEqualTypeOf<Ruler.WaypointContext | void>();
    expectTypeOf(
      ruler["_getWaypointLabelContext"](waypoint, { hasElevation: true }),
    ).toEqualTypeOf<Ruler.WaypointContext | void>();

    expectTypeOf(ruler["_getWaypointStyle"](waypoint)).toEqualTypeOf<Ruler.WaypointStyle>();
    expectTypeOf(ruler["_getSegmentStyle"](waypoint)).toEqualTypeOf<Ruler.SegmentStyle>();
  });

  test("Deprecated", () => {
    // deprecated since v13, until v15

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(ruler.color).toEqualTypeOf<Color>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(ruler.ruler).toEqualTypeOf<PIXI.Graphics>();
  });
});
