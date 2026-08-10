import { expectTypeOf } from "vitest";

import TokenHUD = foundry.applications.hud.TokenHUD;
import BasePlaceableHUD = foundry.applications.hud.BasePlaceableHUD;

expectTypeOf(TokenHUD.DEFAULT_OPTIONS).toEqualTypeOf<BasePlaceableHUD.DefaultOptions>();
expectTypeOf(TokenHUD.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare const hud: TokenHUD;
expectTypeOf(hud.actor).toEqualTypeOf<Actor.Implementation | null | undefined>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(hud.toggleStatusTray(true)).toBeVoid();

declare const context: TokenHUD.RenderContext;
expectTypeOf(context.displayBar1).toEqualTypeOf<boolean | null>();
expectTypeOf(context.bar1Data).toEqualTypeOf<TokenDocument.GetBarAttributeReturn>();
expectTypeOf(context.displayBar2).toEqualTypeOf<boolean | null>();
expectTypeOf(context.bar2Data).toEqualTypeOf<TokenDocument.GetBarAttributeReturn>();
expectTypeOf(context.movementActionsConfig).toEqualTypeOf<CONFIG.Token.Movement.ActionConfig>();

declare class _TestTokenHUDSubclass extends TokenHUD {
  protected override _getStatusEffectChoices(): Record<string, TokenHUD.StatusEffectChoice>;
  protected override _getMovementActionChoices(): Record<string, TokenHUD.MovementActionChoice>;
  protected override _getLevelChoices(): Record<string, TokenHUD.LevelChoice>;
  protected override _onPosition(position: foundry.applications.api.ApplicationV2.Position): void;
  protected override _onSubmitElevation(
    event: SubmitEvent | Event,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void>;
}
