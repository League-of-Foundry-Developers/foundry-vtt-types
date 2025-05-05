import { expectTypeOf } from "vitest";

import DataModel = foundry.abstract.DataModel;
import Document = foundry.abstract.Document;
import type { AnyMutableObject } from "../../../../../src/utils/index.d.mts";

// @ts-expect-error - ActiveEffect requires name.
new ActiveEffect.implementation();

// @ts-expect-error - ActiveEffect requires name.
new ActiveEffect.implementation({});

declare const model: DataModel.Any;
declare const change: ActiveEffect.EffectChangeData;
declare const aeContext: Document.ConstructionContext<ActiveEffect.Parent>;

expectTypeOf(ActiveEffect.fromStatusEffect("flying")).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(ActiveEffect.fromStatusEffect("flying", {})).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(ActiveEffect.fromStatusEffect("flying", aeContext)).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();

const createData = {
  name: "foo",
  changes: [{ key: "system.foo.bar", mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE, value: "7", priority: 42 }],
};

expectTypeOf(ActiveEffect["_fromStatusEffect"]("flying", createData)).toEqualTypeOf<
  Promise<ActiveEffect.Implementation>
>();
expectTypeOf(ActiveEffect["_fromStatusEffect"]("flying", createData, {})).toEqualTypeOf<
  Promise<ActiveEffect.Implementation>
>();
expectTypeOf(ActiveEffect["_fromStatusEffect"]("flying", createData, aeContext)).toEqualTypeOf<
  Promise<ActiveEffect.Implementation>
>();

declare const sf: foundry.data.fields.StringField;
declare const nf: foundry.data.fields.NumberField;
declare const edf: foundry.data.fields.EmbeddedDataField<typeof foundry.data.LightData>;
expectTypeOf(ActiveEffect.applyField(model, change)).toEqualTypeOf<unknown>();
expectTypeOf(ActiveEffect.applyField(model, change, null)).toEqualTypeOf<unknown>();
expectTypeOf(ActiveEffect.applyField(model, change, sf)).toEqualTypeOf<string | undefined>();
expectTypeOf(ActiveEffect.applyField(model, change, nf)).toEqualTypeOf<number | undefined | null>();
expectTypeOf(ActiveEffect.applyField(model, change, edf)).toEqualTypeOf<foundry.data.LightData>();

expectTypeOf(ActiveEffect.getInitialDuration()).toEqualTypeOf<ActiveEffect.GetInitialDurationReturn>();

// ClientDocument overrides

expectTypeOf(ActiveEffect.defaultName({}));

// @ts-expect-error - ActiveEffect.createDialog requires a parent
await ActiveEffect.createDialog({}, {});

declare const actor: Actor.Implementation;

await ActiveEffect.createDialog(
  {},
  {
    parent: actor,
  },
);

const effect = new ActiveEffect.implementation({ name: "My effect" });
expectTypeOf(effect).toEqualTypeOf<ActiveEffect.Implementation>();

expectTypeOf(effect.isSuppressed).toEqualTypeOf<boolean>();
// @ts-expect-error Only getter, no setter
effect.isSuppressed = false;

expectTypeOf(effect.target).toEqualTypeOf<Document.Any | null>();
// @ts-expect-error Only getter, no setter
effect.target = null;

expectTypeOf(effect.active).toEqualTypeOf<boolean>();
// @ts-expect-error Only getter, no setter
effect.active = false;

expectTypeOf(effect.modifiesActor).toEqualTypeOf<boolean>();
// @ts-expect-error Only getter, no setter
effect.modifiesActor = false;

expectTypeOf(effect.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(effect.prepareDerivedData()).toEqualTypeOf<void>();

expectTypeOf(effect.updateDuration()).toEqualTypeOf<ActiveEffect.Duration>();
expectTypeOf(effect["_requiresDurationUpdate"]()).toBeBoolean();
expectTypeOf(effect["_prepareDuration"]()).toEqualTypeOf<ActiveEffect.PrepareDurationReturn>();

expectTypeOf(effect["_getCombatTime"](0, 3)).toBeNumber();
expectTypeOf(effect["_getCombatTime"](0, 7, 3)).toBeNumber();

expectTypeOf(effect["_getDurationLabel"](2, 4)).toBeString();

expectTypeOf(effect.isTemporary).toEqualTypeOf<boolean>();
// @ts-expect-error Only getter, no setter
effect.isTemporary = false;

expectTypeOf(effect.sourceName).toEqualTypeOf<string>();
// @ts-expect-error Only getter, no setter
effect.sourceName = "foo";

expectTypeOf(effect.apply(actor, change)).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(effect["_applyLegacy"](actor, change, {})).toBeVoid();

expectTypeOf(effect["_castDelta"]("7", "number")).toEqualTypeOf<boolean | number | string | object>();
expectTypeOf(effect["_castArray"](`["foo", 7, "bar"]`, "string")).toEqualTypeOf<
  Array<boolean | number | string | object>
>();
expectTypeOf(effect["_parseOrString"](`{ "foo": undefined, "bar": "invalidJSON", }`)).toEqualTypeOf<string | object>();

expectTypeOf(effect["_applyAdd"](actor, change, 5, 1, {})).toBeVoid();
expectTypeOf(effect["_applyMultiply"](actor, change, 2, 4, {})).toBeVoid();
expectTypeOf(effect["_applyOverride"](actor, change, "foo", "bar", {})).toBeVoid();
expectTypeOf(effect["_applyUpgrade"](actor, change, 5, 9, {})).toBeVoid();
expectTypeOf(effect["_applyCustom"](actor, change, { baz: 17 }, { fizz: false }, {})).toBeVoid();

// getFlag override has no type changes, handled in BaseActiveEffect tests

expectTypeOf(effect["_displayScrollingStatus"](true)).toBeVoid();

// deprecated since v11 until v13
expectTypeOf(effect._getSourceName()).toEqualTypeOf<Promise<string>>();
