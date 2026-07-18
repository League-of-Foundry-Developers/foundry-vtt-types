import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import BasePlaceableHUD = foundry.applications.hud.BasePlaceableHUD;
import Token = foundry.canvas.placeables.Token;

declare class TestHUD extends BasePlaceableHUD<Token.Implementation> {}
declare const hud: TestHUD;

expectTypeOf(hud.object).toEqualTypeOf<Token.Implementation>();
expectTypeOf(hud.document).toEqualTypeOf<Token.Implementation["document"]>();
expectTypeOf(hud.layer).toEqualTypeOf<Token.Implementation["layer"]>();
expectTypeOf(hud.activePalette).toEqualTypeOf<string | null>();

declare const token: Token.Implementation;
expectTypeOf(hud.bind(token)).toEqualTypeOf<Promise<void>>();
expectTypeOf(hud.togglePalette("effects")).toBeVoid();
expectTypeOf(hud.togglePalette(null, true)).toBeVoid();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(hud.clear()).toBeVoid();

expectTypeOf(BasePlaceableHUD.DEFAULT_OPTIONS).toEqualTypeOf<BasePlaceableHUD.DefaultOptions>();
expectTypeOf(BasePlaceableHUD.BASE_APPLICATION).toEqualTypeOf<typeof foundry.applications.api.ApplicationV2>();

declare class _TestHUDSubclass extends BasePlaceableHUD<Token.Implementation> {
  protected override _onSubmitElevation(
    event: SubmitEvent | Event,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
  ): Promise<void>;
  protected override _parseAttributeInput(
    name: string,
    attr: object | number,
    input: string,
  ): BasePlaceableHUD.ParsedAttributeInput;
  protected override _canRender(options: DeepPartial<BasePlaceableHUD.RenderOptions>): false | void;
}
