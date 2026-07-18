import { expectTypeOf } from "vitest";

declare const doc: TokenDocument.Implementation;
const tokenConfig = new foundry.applications.sheets.TokenConfig({ document: doc });

expectTypeOf(tokenConfig.document).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(tokenConfig.token).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(tokenConfig.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(tokenConfig.isPrototype).toEqualTypeOf<false>();
expectTypeOf(tokenConfig.isVisible).toEqualTypeOf<boolean>();

expectTypeOf(foundry.applications.sheets.TokenConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.TokenConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();
expectTypeOf(foundry.applications.sheets.TokenConfig.DISPLAY_MODES).toEqualTypeOf<
  Record<CONST.TOKEN_DISPLAY_MODES, string>
>();
expectTypeOf(foundry.applications.sheets.TokenConfig.TOKEN_DISPOSITIONS).toEqualTypeOf<
  Record<CONST.TOKEN_DISPOSITIONS, string>
>();
expectTypeOf(foundry.applications.sheets.TokenConfig.TURN_MARKER_MODES).toEqualTypeOf<
  Record<CONST.TOKEN_TURN_MARKER_MODES, string>
>();
expectTypeOf(foundry.applications.sheets.TokenConfig.TOKEN_SHAPES).toEqualTypeOf<Record<CONST.TOKEN_SHAPES, string>>();

declare class _TestTokenConfigSubclass extends foundry.applications.sheets.TokenConfig {
  protected override _previewChanges(changes: foundry.documents.BaseToken.UpdateData): void;
  protected override _onChangeBar(event: Event): void;
}
