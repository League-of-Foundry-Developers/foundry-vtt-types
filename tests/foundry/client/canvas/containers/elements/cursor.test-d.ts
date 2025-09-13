import { describe, expectTypeOf, test } from "vitest";

import Cursor = foundry.canvas.containers.Cursor;

declare const user: User.Implementation;

describe("Cursor tests", () => {
  const cursor = new Cursor(user);

  test("Miscellaneous", () => {
    expectTypeOf(cursor.target).toEqualTypeOf<PIXI.IPointData>();
    expectTypeOf(cursor["_updatePosition"]).toBeBoolean();
    expectTypeOf(cursor.updateTransform()).toBeVoid();
    expectTypeOf(cursor.refreshVisibility(user)).toBeVoid();
    expectTypeOf(cursor.draw(user)).toEqualTypeOf<void>();
    expectTypeOf(cursor.destroy()).toEqualTypeOf<void>();
    expectTypeOf(cursor.destroy({})).toEqualTypeOf<void>();
    expectTypeOf(cursor.destroy({ children: true, texture: true, baseTexture: true })).toEqualTypeOf<void>();
  });
});
