import { expectTypeOf, test } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;
import WallConfig = foundry.applications.sheets.WallConfig;

declare const doc: WallDocument.Implementation;

declare const context: WallConfig.RenderContext;

test("foundry/client/applications/sheets/wall-config", () => {
  const wallConfig = new WallConfig({ document: doc });

  expectTypeOf(wallConfig.document).toEqualTypeOf<WallDocument.Implementation>();

  expectTypeOf(WallConfig.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableConfig.DefaultOptions>();
  expectTypeOf(context.coordinates).toEqualTypeOf<string | undefined>();
  expectTypeOf(context.thresholdFields).toEqualTypeOf<WallConfig.ThresholdField[]>();
  expectTypeOf(context.thresholdFields[0]!.name).toEqualTypeOf<WallConfig.SenseType>();
  expectTypeOf(context.animation).toEqualTypeOf<WallDocument.AnimationSource>();
  expectTypeOf(context.animationDirections).toEqualTypeOf<WallConfig.AnimationDirectionChoice[]>();
  expectTypeOf(context.animationFieldsetClass).toBeString();
  expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();
});
