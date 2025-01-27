import { expectTypeOf } from "vitest";
import type { default as HBMixinNamespace } from "../../../../../src/foundry/client-esm/applications/api/handlebars-application.d.mts";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

// Regression test for "Class static side 'typeof EnabledCompendiumsSettings' incorrectly extends base class static side 'typeof HandlebarsApplication & typeof ApplicationV2'."
// Reported by @denwav, see https://discord.com/channels/732325252788387980/803646399014109205/1259600593714937978
export class EnabledCompendiumsSettings extends HandlebarsApplicationMixin(ApplicationV2) {}

class HBMixinTest extends HandlebarsApplicationMixin(ApplicationV2) {}
const hbMixinTest = new HBMixinTest();

expectTypeOf(hbMixinTest.parts).toEqualTypeOf<Record<string, HTMLElement>>();
expectTypeOf(hbMixinTest.title).toEqualTypeOf<string>();

expectTypeOf(HBMixinTest.PARTS).toEqualTypeOf<Record<string, HBMixinNamespace.HandlebarsTemplatePart>>();
