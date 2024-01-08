import { expectTypeOf } from "vitest";

expectTypeOf(TokenLayer.instance).toEqualTypeOf<TokenLayer | undefined>();
expectTypeOf(TokenLayer.layerOptions.objectClass).toEqualTypeOf<typeof Token>();

const layer = new TokenLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof Token>();
expectTypeOf(layer.options).toEqualTypeOf<TokenLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"tokens">();
