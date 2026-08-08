import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import World = foundry.packages.World;
import WorldConfig = foundry.applications.sidebar.apps.WorldConfig;

declare const world: World;

// `world` is required, and stays un-partialed, so the ordinary construction call compiles.
const worldConfig = new WorldConfig({ world });

expectTypeOf(worldConfig).toExtend<ApplicationV2.Any>();

expectTypeOf(WorldConfig.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

expectTypeOf(worldConfig.world).toEqualTypeOf<World>();
expectTypeOf(worldConfig.title).toBeString();

declare const formConfig: ApplicationV2.FormConfiguration;
declare const event: Event;
expectTypeOf(worldConfig["_onChangeForm"](formConfig, event)).toBeVoid();

declare const options: DeepPartial<WorldConfig.RenderOptions> & { isFirstRender: boolean };
expectTypeOf(worldConfig["_prepareContext"](options)).toEqualTypeOf<Promise<WorldConfig.RenderContext>>();

expectTypeOf<WorldConfig.RenderContext["themes"]>().toEqualTypeOf<Record<string, string>>();
expectTypeOf<WorldConfig.RenderContext["systems"]>().toEqualTypeOf<Record<string, string>>();
expectTypeOf<WorldConfig.RenderContext["nextSession"]>().toBeString();
expectTypeOf<WorldConfig.RenderContext["inWorld"]>().toBeBoolean();
expectTypeOf<WorldConfig.RenderContext["showEditFields"]>().toBeBoolean();
expectTypeOf<WorldConfig.RenderContext["buttons"]>().toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

expectTypeOf<WorldConfig.Configuration["world"]>().toEqualTypeOf<World>();
expectTypeOf<WorldConfig.Configuration["tour"]>().toEqualTypeOf<boolean | undefined>();
