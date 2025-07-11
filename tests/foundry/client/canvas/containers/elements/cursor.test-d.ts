import { expectTypeOf } from "vitest";

import Cursor = foundry.canvas.containers.Cursor;

declare const user: User.Implementation;

const cursor = new Cursor(user);

expectTypeOf(cursor.target).toEqualTypeOf<PIXI.IPointData>();
expectTypeOf(cursor["_updatePosition"]).toBeBoolean();
expectTypeOf(cursor.updateTransform()).toBeVoid();
expectTypeOf(cursor.refreshVisibility(user)).toBeVoid();
expectTypeOf(cursor.draw(user)).toEqualTypeOf<void>();
expectTypeOf(cursor.destroy()).toEqualTypeOf<void>();
expectTypeOf(cursor.destroy({})).toEqualTypeOf<void>();
expectTypeOf(cursor.destroy({ children: true, texture: true, baseTexture: true })).toEqualTypeOf<void>();
