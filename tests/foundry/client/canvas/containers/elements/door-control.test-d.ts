import { expectTypeOf } from "vitest";
import { DoorControl } from "#client/canvas/containers/_module.mjs";
import type { Wall } from "#client/canvas/placeables/_module.d.mts";

declare const wall: Wall.Implementation;

// @ts-expect-error - A DoorControl requires a wall.
new DoorControl();
const control = new DoorControl(wall);

expectTypeOf(control.wall).toEqualTypeOf<Wall.Implementation>();
expectTypeOf(control.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(control.isVisible).toEqualTypeOf<boolean>();

expectTypeOf(control.draw()).toEqualTypeOf<Promise<DoorControl.ConfiguredInstance>>();

expectTypeOf(control.bg).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(control.icon).toEqualTypeOf<PIXI.Sprite | undefined>();
expectTypeOf(control.border).toEqualTypeOf<PIXI.Graphics | undefined>();

expectTypeOf(control["_getTexture"]()).toEqualTypeOf<foundry.canvas.loadTexture.Return>();

expectTypeOf(control.reposition()).toEqualTypeOf<void>();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(control["_onMouseOver"](pointerEvent)).toEqualTypeOf<false | void>();
expectTypeOf(control["_onMouseOut"](pointerEvent)).toEqualTypeOf<false | void>();
expectTypeOf(control["_onMouseDown"](pointerEvent)).toEqualTypeOf<
  Promise<WallDocument.Implementation> | false | void
>();
expectTypeOf(control["_onRightDown"](pointerEvent)).toEqualTypeOf<Promise<WallDocument.Implementation> | void>();
