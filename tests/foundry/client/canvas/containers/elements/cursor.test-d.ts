import { expectTypeOf } from "vitest";
import { Cursor } from "#client/canvas/containers/_module.mjs";

declare const user: User.Implementation;

const cursor = new Cursor(user);

expectTypeOf(cursor.target).toEqualTypeOf<PIXI.IPointData>();
expectTypeOf(cursor.refreshVisibility(user)).toBeVoid();
expectTypeOf(cursor.draw(user)).toEqualTypeOf<void>();
expectTypeOf(cursor.destroy()).toEqualTypeOf<void>();
expectTypeOf(cursor.destroy({})).toEqualTypeOf<void>();
expectTypeOf(cursor.destroy({ children: true, texture: true, baseTexture: true })).toEqualTypeOf<void>();
