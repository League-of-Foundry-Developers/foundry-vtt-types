import { expectTypeOf } from "vitest";

declare const tokenDoc: TokenDocument;
const tokenConfig = new TokenConfig(tokenDoc);

expectTypeOf(tokenConfig.object).toEqualTypeOf<TokenDocument | Actor>();
expectTypeOf(tokenConfig.document).toEqualTypeOf<TokenDocument | Actor>();
expectTypeOf(TokenConfig.defaultOptions).toEqualTypeOf<DocumentSheetOptions<TokenDocument.ConfiguredInstance>>();
expectTypeOf(tokenConfig.options).toEqualTypeOf<DocumentSheetOptions<TokenDocument.ConfiguredInstance>>();
expectTypeOf(tokenConfig.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(tokenConfig.render(true)).toEqualTypeOf<TokenConfig>();

expectTypeOf(tokenConfig.token).toEqualTypeOf<TokenDocument.ConfiguredInstance | foundry.data.PrototypeToken>();
expectTypeOf(tokenConfig.actor).toEqualTypeOf<Actor.ConfiguredInstance>();
expectTypeOf(tokenConfig.preview).toEqualTypeOf<TokenDocument.ConfiguredInstance | foundry.data.PrototypeToken>();
