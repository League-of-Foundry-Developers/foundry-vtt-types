import { expectTypeOf } from "vitest";

declare const wall: Wall;

// @ts-expect-error - A DoorControl requires a wall.
new DoorControl();

const control = new DoorControl(wall);

expectTypeOf(control.wall).toEqualTypeOf<Wall.ConfiguredInstance>();
expectTypeOf(control.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(control.isVisible).toEqualTypeOf<boolean>();

expectTypeOf(control.draw()).toEqualTypeOf<Promise<DoorControl>>();

expectTypeOf(control.bg).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(control.icon).toEqualTypeOf<PIXI.Sprite | undefined>();
expectTypeOf(control.border).toEqualTypeOf<PIXI.Graphics | undefined>();

expectTypeOf(control["_getTexture"]()).toEqualTypeOf<LoadTexture.Return>();

expectTypeOf(control.reposition()).toEqualTypeOf<void>();

declare const someEvent: PIXI.FederatedEvent;
expectTypeOf(control["_onMouseOver"](someEvent)).toEqualTypeOf<false | void>();
expectTypeOf(control["_onMouseOut"](someEvent)).toEqualTypeOf<false | void>();
expectTypeOf(control["_onMouseDown"](someEvent)).toEqualTypeOf<
  Promise<WallDocument.ConfiguredInstance> | false | void
>();
expectTypeOf(control["_onRightDown"](someEvent)).toEqualTypeOf<Promise<WallDocument.ConfiguredInstance> | void>();
