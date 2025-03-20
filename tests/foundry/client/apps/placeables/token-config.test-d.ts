import { expectTypeOf } from "vitest";

declare const tokenDoc: TokenDocument;
const tokenConfig = new TokenConfig(tokenDoc);

expectTypeOf(tokenConfig.object).toEqualTypeOf<TokenDocument | Actor>();
expectTypeOf(tokenConfig.document).toEqualTypeOf<TokenDocument | Actor>();
expectTypeOf(TokenConfig.defaultOptions).toEqualTypeOf<DocumentSheet.Options<TokenDocument.Implementation>>();
expectTypeOf(tokenConfig.options).toEqualTypeOf<DocumentSheet.Options<TokenDocument.Implementation>>();
expectTypeOf(tokenConfig.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(tokenConfig.render(true)).toEqualTypeOf<TokenConfig>();

expectTypeOf(tokenConfig.token).toEqualTypeOf<TokenDocument.Implementation | foundry.data.PrototypeToken>();
expectTypeOf(tokenConfig.actor).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(tokenConfig.preview).toEqualTypeOf<TokenDocument.Implementation | foundry.data.PrototypeToken>();
