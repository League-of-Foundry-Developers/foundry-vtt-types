import { expectTypeOf } from "vitest";

expectTypeOf(TokenLayer.instance).toEqualTypeOf<TokenLayer | undefined>();
expectTypeOf(TokenLayer.layerOptions.objectClass).toEqualTypeOf<typeof Token>();

const layer = new TokenLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof Token>();
expectTypeOf(layer.options).toEqualTypeOf<TokenLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"tokens">();

// This is testing the `ArrayOverlaps` constraint.

// _getMovableObjects asks for a `string[]`
layer["_getMovableObjects"](["foo", "bar"]);

// @ts-expect-error - `1` is statically known not to be a `string[]`.
layer["_getMovableObjects"](1);

// This is allowed because both `["foo", "bar"]` and `1` are valid at runtime.
// The only reason why `1` was disallowed above is because it's _never_ a `string[]` and therefore always is useless.
layer["_getMovableObjects"](Math.random() > 0.5 ? ["foo", "bar"] : 1);

// @ts-expect-error - A `string[]` would error at runtime so has to be disallowed.
layer["_getMovableObjects"](Math.random() > 0.5 ? ["foo", "bar"] : [1, 2]);
