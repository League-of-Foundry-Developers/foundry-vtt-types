import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;
import WallConfig = foundry.applications.sheets.WallConfig;

declare const doc: WallDocument.Implementation;
const wallConfig = new WallConfig({ document: doc });

expectTypeOf(wallConfig.document).toEqualTypeOf<WallDocument.Implementation>();

expectTypeOf(WallConfig.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableConfig.DefaultOptions>();

declare const context: WallConfig.RenderContext;
expectTypeOf(context.coordinates).toBeString();
expectTypeOf(context.thresholdFields).toEqualTypeOf<WallConfig.ThresholdField[]>();
expectTypeOf(context.thresholdFields[0]!.name).toEqualTypeOf<WallConfig.SenseType>();
expectTypeOf(context.animation).toEqualTypeOf<WallDocument.AnimationSource>();
expectTypeOf(context.animationDirections).toEqualTypeOf<WallConfig.AnimationDirectionChoice[]>();
expectTypeOf(context.animationFieldsetClass).toBeString();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();
