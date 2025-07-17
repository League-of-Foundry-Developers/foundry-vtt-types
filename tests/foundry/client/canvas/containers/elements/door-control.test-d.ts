import { describe, expectTypeOf, test } from "vitest";

import DoorControl = foundry.canvas.containers.DoorControl;
import Wall = foundry.canvas.placeables.Wall;

declare const wall: Wall.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;

describe("DoorControl Tests", () => {
  test("Construction", () => {
    // @ts-expect-error - A DoorControl requires a wall.
    new DoorControl();
    new DoorControl(wall);
  });

  const control = new DoorControl(wall);

  test("Uncategorized", () => {
    expectTypeOf(control.wall).toEqualTypeOf<Wall.Implementation>();
    expectTypeOf(control.visible).toEqualTypeOf<boolean>();
    expectTypeOf(control.center).toEqualTypeOf<PIXI.Point>();

    expectTypeOf(control.draw()).toEqualTypeOf<Promise<DoorControl.Implementation>>();

    expectTypeOf(control.bg).toEqualTypeOf<PIXI.Graphics | undefined>();
    expectTypeOf(control.icon).toEqualTypeOf<PIXI.Sprite | undefined>();
    expectTypeOf(control.border).toEqualTypeOf<PIXI.Graphics | undefined>();

    expectTypeOf(control["_getTexture"]()).toEqualTypeOf<foundry.canvas.loadTexture.Return>();

    expectTypeOf(control.reposition()).toEqualTypeOf<void>();
    expectTypeOf(control.isVisible).toEqualTypeOf<boolean>();
  });

  test("Event Callbacks", () => {
    expectTypeOf(control["_onMouseOver"](pointerEvent)).toEqualTypeOf<false | void>();
    expectTypeOf(control["_onMouseOut"](pointerEvent)).toEqualTypeOf<false | void>();
    expectTypeOf(control["_onMouseDown"](pointerEvent)).toEqualTypeOf<
      Promise<WallDocument.Implementation> | false | void
    >();
    expectTypeOf(control["_onRightDown"](pointerEvent)).toEqualTypeOf<Promise<WallDocument.Implementation> | void>();
  });
});
