import { expectTypeOf } from "vitest";
import type { AnyMutableObject, GetKey, JSONValue } from "../../../../../src/utils/index.d.mts";

import DataModel = foundry.abstract.DataModel;
import Document = foundry.abstract.Document;

// @ts-expect-error - ActiveEffect requires name.
new ActiveEffect.implementation();

// @ts-expect-error - ActiveEffect requires name.
new ActiveEffect.implementation({});

declare const model: DataModel.Any;
declare const change: ActiveEffect.ChangeData;
declare const aeContext: Document.ConstructionContext<ActiveEffect.Parent>;

// Static methods native to this Document

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

// ClientDocument static overrides

declare const someItem: Item.Implementation;
expectTypeOf(ActiveEffect.defaultName()).toBeString();
expectTypeOf(ActiveEffect.defaultName({})).toBeString();
expectTypeOf(ActiveEffect.defaultName({ pack: "some.pack", parent: someItem, type: "base" })).toBeString();
expectTypeOf(ActiveEffect.defaultName({ pack: undefined, parent: undefined, type: undefined })).toBeString();
expectTypeOf(ActiveEffect.defaultName({ pack: null, parent: null, type: null })).toBeString();

// @ts-expect-error - ActiveEffect.createDialog requires a parent
await ActiveEffect.createDialog({}, {});

declare const someActor: Actor.Implementation;
expectTypeOf(
  ActiveEffect.createDialog(
    {},
    {
      parent: someActor,
    },
  ),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null | undefined>>();
declare const x: GetKey<Document.MetadataFor<"ActiveEffect">, "hasTypeData">;
expectTypeOf(
  ActiveEffect.createDialog(createData, {
    parent: someActor,
    pack: "some.pack",
    // TODO: add mock subtypes so this has valid values to test ("base" is excluded)
    //types: [],
  }),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null | undefined>>();
expectTypeOf(
  ActiveEffect.createDialog(
    {},
    {
      parent: someActor,
      pack: undefined,
    },
  ),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null | undefined>>();
expectTypeOf(
  ActiveEffect.createDialog(createData, {
    parent: someActor,
    pack: null,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null | undefined>>();

declare const aeSource: ActiveEffect.Source;
expectTypeOf(
  ActiveEffect.fromDropData({
    data: aeSource,
    type: "ActiveEffect",
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation | undefined>>();
expectTypeOf(
  ActiveEffect.fromDropData({
    type: "ActiveEffect",
    uuid: "someUUID", // TODO: This should be allowed
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation | undefined>>();
expectTypeOf(
  ActiveEffect.fromDropData(
    {
      data: aeSource,
      type: "ActiveEffect",
    },
    {}, // options is vestigial, this is AnyObject
  ),
).toEqualTypeOf<Promise<ActiveEffect.Implementation | undefined>>();

expectTypeOf(ActiveEffect.fromImport(aeSource)).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(ActiveEffect.fromImport(aeSource, {})).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(
  ActiveEffect.fromImport(aeSource, {
    dropInvalidEmbedded: true,
    fallback: true,
    pack: "some.pack",
    parent: someItem,
    parentCollection: "effects",
    strict: true,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(
  ActiveEffect.fromImport(aeSource, {
    dropInvalidEmbedded: undefined,
    fallback: undefined,
    pack: undefined,
    parent: undefined,
    parentCollection: undefined,
    // strict not allowed to be undefined,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();
expectTypeOf(
  ActiveEffect.fromImport(aeSource, {
    dropInvalidEmbedded: null,
    fallback: null,
    pack: null,
    parent: null,
    parentCollection: null,
    strict: null,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation>>();

// Instance methods native to this Document

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

expectTypeOf(effect.apply(someActor, change)).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(effect["_applyLegacy"](someActor, change, {})).toBeVoid();

expectTypeOf(effect["_castDelta"]("7", "number")).toEqualTypeOf<JSONValue>();
expectTypeOf(effect["_castArray"](`["foo", 7, "bar"]`, "string")).toEqualTypeOf<Array<JSONValue>>();
expectTypeOf(effect["_parseOrString"](`{ "foo": undefined, "bar": "invalidJSON", }`)).toEqualTypeOf<JSONValue>();

expectTypeOf(effect["_applyAdd"](someActor, change, 5, 1, {})).toBeVoid();
expectTypeOf(effect["_applyMultiply"](someActor, change, 2, 4, {})).toBeVoid();
expectTypeOf(effect["_applyOverride"](someActor, change, "foo", "bar", {})).toBeVoid();
expectTypeOf(effect["_applyUpgrade"](someActor, change, 5, 9, {})).toBeVoid();
expectTypeOf(effect["_applyCustom"](someActor, change, { baz: 17 }, { fizz: false }, {})).toBeVoid();

// getFlag override has no type changes, handled in BaseActiveEffect tests

expectTypeOf(effect["_displayScrollingStatus"](true)).toBeVoid();

// deprecated since v11 until v13
expectTypeOf(effect._getSourceName()).toEqualTypeOf<Promise<string>>();

// ClientDocument instance override(s)

declare const mEvent: MouseEvent;
expectTypeOf(effect._onClickDocumentLink(mEvent)).toEqualTypeOf<ClientDocument.OnClickDocumentLinkReturn>();
