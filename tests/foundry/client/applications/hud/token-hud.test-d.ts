import { expectTypeOf, test } from "vitest";

import TokenHUD = foundry.applications.hud.TokenHUD;
import BasePlaceableHUD = foundry.applications.hud.BasePlaceableHUD;

declare const hud: TokenHUD;

declare const context: TokenHUD.RenderContext;

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

test("foundry/client/applications/hud/token-hud", () => {
  expectTypeOf(TokenHUD.DEFAULT_OPTIONS).toEqualTypeOf<BasePlaceableHUD.DefaultOptions>();
  expectTypeOf(TokenHUD.PARTS).toEqualTypeOf<
    Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
  >();
  expectTypeOf(hud.actor).toEqualTypeOf<Actor.Implementation | null | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  expectTypeOf(hud.toggleStatusTray(true)).toBeVoid();
  expectTypeOf(context.displayBar1).toEqualTypeOf<boolean | null>();
  expectTypeOf(context.bar1Data).toEqualTypeOf<TokenDocument.GetBarAttributeReturn>();
  expectTypeOf(context.displayBar2).toEqualTypeOf<boolean | null>();
  expectTypeOf(context.bar2Data).toEqualTypeOf<TokenDocument.GetBarAttributeReturn>();
  expectTypeOf(context.movementActionsConfig).toEqualTypeOf<CONFIG.Token.Movement.ActionConfig>();
});
