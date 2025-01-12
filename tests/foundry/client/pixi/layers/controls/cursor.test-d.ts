import { expectTypeOf } from "vitest";

declare const user: User.ConfiguredInstance;

const cursor = new Cursor(user);
expectTypeOf(cursor.draw(user)).toEqualTypeOf<void>();
expectTypeOf(cursor.destroy()).toEqualTypeOf<void>();
expectTypeOf(cursor.destroy({})).toEqualTypeOf<void>();
expectTypeOf(cursor.destroy({ children: true, texture: true, baseTexture: true })).toEqualTypeOf<void>();
