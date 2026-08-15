import { expectTypeOf } from "vitest";

import FormDataExtended = foundry.applications.ux.FormDataExtended;
import RollResolver = foundry.applications.dice.RollResolver;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

const rollResolver = new RollResolver(new Roll("3d6"));

expectTypeOf(RollResolver.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

expectTypeOf(rollResolver.fulfillable).toEqualTypeOf<Map<string, RollResolver.DiceTermFulfillmentDescriptor>>();
expectTypeOf(rollResolver.roll).toEqualTypeOf<Roll>();
expectTypeOf(rollResolver.awaitFulfillment()).toEqualTypeOf<Promise<void>>();
expectTypeOf(rollResolver.registerResult("a", "a", 5)).toEqualTypeOf<boolean>();

expectTypeOf(rollResolver.close()).toEqualTypeOf<Promise<RollResolver | void>>();

declare const term: foundry.dice.terms.DiceTerm;
expectTypeOf(rollResolver.resolveResult(term, "a")).toEqualTypeOf<Promise<number | void>>();
expectTypeOf(rollResolver.resolveResult(term, "a", { reroll: true, explode: true })).toEqualTypeOf<
  Promise<number | void>
>();
expectTypeOf(rollResolver.addTerm(term)).toEqualTypeOf<Promise<void>>();

expectTypeOf(rollResolver["_prepareContext"]({ isFirstRender: true })).toEqualTypeOf<
  Promise<RollResolver.RenderContext>
>();

declare const formConfig: ApplicationV2.FormConfiguration;
declare const event: SubmitEvent;
expectTypeOf(rollResolver["_onSubmitForm"](formConfig, event)).toEqualTypeOf<Promise<void>>();

expectTypeOf(rollResolver["_checkDone"]()).toEqualTypeOf<void>();
expectTypeOf(rollResolver["_toggleSubmission"](true)).toEqualTypeOf<void>();

declare const form: HTMLFormElement;
declare const formData: FormDataExtended;
expectTypeOf(RollResolver["_fulfillRoll"].call(rollResolver, event, form, formData)).toEqualTypeOf<Promise<void>>();

// `close` flushes the form through the same handler with no originating event or form element.
expectTypeOf(RollResolver["_fulfillRoll"].call(rollResolver, null, null, formData)).toEqualTypeOf<Promise<void>>();

declare const context: RollResolver.RenderContext;
expectTypeOf(context.formula).toEqualTypeOf<string>();
expectTypeOf(context.groups).toEqualTypeOf<Record<string, RollResolver.Group>>();

declare const group: RollResolver.Group;
expectTypeOf(group.results).toEqualTypeOf<RollResolver.Result[]>();
expectTypeOf(group.label).toEqualTypeOf<string>();
expectTypeOf(group.icon).toEqualTypeOf<string>();
expectTypeOf(group.tooltip).toEqualTypeOf<string>();

declare const result: RollResolver.Result;
expectTypeOf(result.denomination).toEqualTypeOf<string>();
expectTypeOf(result.id).toEqualTypeOf<string>();
expectTypeOf(result.method).toEqualTypeOf<string>();
expectTypeOf(result.icon).toEqualTypeOf<string | undefined>();
expectTypeOf(result.exploded).toEqualTypeOf<boolean | undefined>();
expectTypeOf(result.rerolled).toEqualTypeOf<boolean | undefined>();
expectTypeOf(result.isNew).toEqualTypeOf<boolean | undefined>();
expectTypeOf(result.value).toEqualTypeOf<number | "">();
expectTypeOf(result.minValue).toEqualTypeOf<number>();
expectTypeOf(result.maxValue).toEqualTypeOf<number | undefined>();
expectTypeOf(result.readonly).toEqualTypeOf<boolean>();
expectTypeOf(result.disabled).toEqualTypeOf<boolean>();

declare const descriptor: RollResolver.DiceTermFulfillmentDescriptor;
expectTypeOf(descriptor.id).toEqualTypeOf<string>();
expectTypeOf(descriptor.term).toEqualTypeOf<foundry.dice.terms.DiceTerm>();
expectTypeOf(descriptor.method).toEqualTypeOf<string>();
expectTypeOf(descriptor.isNew).toEqualTypeOf<boolean | undefined>();
