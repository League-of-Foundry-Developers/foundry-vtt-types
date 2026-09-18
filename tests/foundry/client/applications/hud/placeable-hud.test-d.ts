import { expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import BasePlaceableHUD = foundry.applications.hud.BasePlaceableHUD;
import Token = foundry.canvas.placeables.Token;

declare class TestHUD extends BasePlaceableHUD<Token.Implementation> {}
declare const hud: TestHUD;

declare const token: Token.Implementation;

declare const parsed: BasePlaceableHUD.ParsedAttributeInput;

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

  // `_insertElement` is synchronous at runtime, so a `void`-returning override must remain assignable.
  protected override _insertElement(element: HTMLElement): void;
}

test("foundry/client/applications/hud/placeable-hud", () => {
  expectTypeOf(hud.object).toEqualTypeOf<Token.Implementation | undefined>();
  expectTypeOf(hud.document).toEqualTypeOf<Token.Implementation["document"] | undefined>();
  expectTypeOf(hud.layer).toEqualTypeOf<Token.Implementation["layer"] | undefined>();
  expectTypeOf(hud.activePalette).toEqualTypeOf<string | null>();
  expectTypeOf(hud.bind(token)).toEqualTypeOf<Promise<void>>();
  expectTypeOf(hud.togglePalette("effects")).toBeVoid();
  expectTypeOf(hud.togglePalette(null, true)).toBeVoid();

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  expectTypeOf(hud.clear()).toBeVoid();
  expectTypeOf(parsed.attribute).toBeString();
  expectTypeOf(parsed.value).toBeNumber();
  expectTypeOf(parsed.delta).toEqualTypeOf<number | undefined>();
  expectTypeOf(parsed.isDelta).toBeBoolean();
  expectTypeOf(parsed.isBar).toBeBoolean();

  expectTypeOf(BasePlaceableHUD.DEFAULT_OPTIONS).toEqualTypeOf<BasePlaceableHUD.DefaultOptions>();
  expectTypeOf(BasePlaceableHUD.BASE_APPLICATION).toEqualTypeOf<typeof foundry.applications.api.ApplicationV2>();
});
