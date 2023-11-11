import { expectTypeOf } from "vitest";

declare const wall: Wall;

// @ts-expect-error - A DoorControl requires a wall.
new DoorControl();

const control = new DoorControl(wall);
expectTypeOf(control.wall).toEqualTypeOf<Wall>();
expectTypeOf(control.draw()).toEqualTypeOf<Promise<DoorControl>>();
expectTypeOf(control.bg).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(control.icon).toEqualTypeOf<PIXI.Sprite | undefined>();
expectTypeOf(control.border).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(control.reposition()).toEqualTypeOf<void>();
expectTypeOf(control.isVisible).toEqualTypeOf<boolean>();
