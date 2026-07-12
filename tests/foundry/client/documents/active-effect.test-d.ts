import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";
import { database, testID } from "../../../utils.ts";
import * as itemHelpers from "./item.test-d.ts";

import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import DataModel = foundry.abstract.DataModel;
import Document = foundry.abstract.Document;

const documentName = "ActiveEffect";
type SubType = ActiveEffect.SubType;
type Implementation = ActiveEffect.Implementation;
type OfType<Type extends SubType = SubType> = ActiveEffect.OfType<Type>;
type Stored<Type extends SubType = SubType> = ActiveEffect.Stored<Type>;
type Parent = ActiveEffect.Parent;
type Source = ActiveEffect.Source;
type CreateData<Type extends SubType = SubType> = ActiveEffect.CreateData<Type>;
type CreateInput = ActiveEffect.CreateInput;
type UpdateData = ActiveEffect.UpdateData;
type UpdateInput = ActiveEffect.UpdateInput;
type ConstructionContext = ActiveEffect.ConstructionContext;

const docsToCleanUp = new Set<foundry.documents.abstract.ClientDocumentMixin.AnyMixed>();

/** The parent document that runtime tests in this file will use. */
const parent = await Item.create(itemHelpers.source);
if (!parent) throw new Error("Couldn't create test Item");
expectTypeOf(parent).toEqualTypeOf<Item.Stored>();
docsToCleanUp.add(parent);

export function isStored<Type extends SubType>(doc: OfType<Type> | Stored<Type>): doc is Stored<Type> {
  if (!doc.id) return false;
  if (!doc.collection) return false;
  if (doc.collection instanceof Document) return doc.collection.id === doc.id;
  if (doc.collection instanceof CompendiumCollection) return doc.collection.index.has(doc.id);
  return doc.collection.has(doc.id);
}

export function isOfType<Type extends SubType>(doc: Implementation, type: Type): doc is OfType<Type> {
  return doc.type === type;
}

export const source = {
  _id: testID,
  name: "Add Suffix", // necessary for construction
  img: "icons/magic/symbols/star-yellow.webp",
  type: "base",
  system: {},
  changes: [
    {
      key: "name",
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      priority: 60,
      value: " the Suffix",
    },
  ],
  disabled: true,
  duration: {
    startTime: 1700000,
    seconds: 300,
    combat: null, // TODO: make this the canonical test Combat ID eventually
    rounds: 20,
    turns: 3,
    startRound: 1,
    startTurn: 3,
  },
  description: "Add a suffix to your name",
  origin: null, // TODO: possibly give this a real UUID in future
  tint: "#C8888C",
  transfer: true,
  statuses: ["invisible", "flying"],
  sort: 7,
  flags: {
    core: {
      overlay: true,
    },
  },
  _stats: {
    coreVersion: "13.348",
    systemId: "universal-tabletop-system",
    systemVersion: "1.0.1",
    createdTime: null,
    modifiedTime: null,
    lastModifiedBy: null,
    compendiumSource: "Compendium.mysystem.pack-id.Item.YYYYYSomeIDYYYYY.ActiveEffect.ZZZZZSomeIDZZZZZ",
    duplicateSource: "Item.WWWWWSomeIDWWWWW.ActiveEffect.VVVVVSomeIDVVVVV",
    exportSource: null,
  },
} as const satisfies Source;

export const minimalCreateData = {
  name: `FVTT-Types Test ${documentName}`,
} satisfies CreateData;

export const nullishCreateData = {
  _id: null,
  ...minimalCreateData, // necessary for construction
  img: null,
  type: null,
  system: null,
  changes: [
    {
      key: null,
      mode: null,
      priority: null,
      value: null,
    },
  ],
  disabled: null,
  duration: {
    startTime: null,
    seconds: null,
    combat: null,
    rounds: null,
    turns: null,
    startRound: null,
    startTurn: null,
  },
  description: null,
  origin: null,
  tint: null,
  transfer: null,
  statuses: null,
  sort: null,
  flags: null,
  _stats: {
    // coreVersion, systemId, systemVersion, createdTime, modifiedTime, and lastModifiedBy are managed by the server and ignored if passed
    compendiumSource: null,
    duplicateSource: null,
  },
} satisfies CreateData;

export const constructionContext = ({ parent = null }: { parent?: Parent } = {}) =>
  ({
    dropInvalidEmbedded: false,
    fallback: false,
    pack: undefined,
    parentCollection: "effects",
    strict: true,
    parent,
  }) satisfies ConstructionContext;

/** Keys added to this Document's base `CreateOperation`. */
const docCreateOpProps = {
  animate: true,
  restoreDelta: false,
};

/** The update props are composed like this because `PreUpdateOptions` explicitly omits `restoreDelta` */
const _docUpdateProps = {
  animate: true,
};

const docUpdateOpProps = {
  ..._docUpdateProps,
  restoreDelta: false,
};

const docDeleteOpProps = {
  animate: true,
};

export const operations = {
  getDocumentsOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.getDocumentsOperationBase,
      parent,
    }) satisfies ActiveEffect.Database.GetDocumentsOperation,

  backendGetOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.backendGetOperationBase,
      parent,
    }) satisfies ActiveEffect.Database.BackendGetOperation,

  // -----------------

  createEmbeddedOperation: () =>
    ({
      ...database.createEmbeddedOperationBase,
      ...docCreateOpProps,
    }) satisfies ActiveEffect.Database.CreateEmbeddedOperation,

  createDocumentsOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.createDocumentsOperationBase,
      ...docCreateOpProps,
      parent, // actual creation requires a parent on v13, where AEs are not yet primary documents
    }) satisfies ActiveEffect.Database.CreateDocumentsOperation,

  minimalBackendCreateOperation: ({ data, parent = null }: { data: CreateInput[]; parent?: Parent }) =>
    ({
      data,
      parent,
    }) satisfies ActiveEffect.Database.BackendCreateOperation,

  backendCreateOperation: ({ data, parent = null }: { data: CreateInput[]; parent?: Parent }) =>
    ({
      ...database.createDocumentsOperationBase,
      ...docCreateOpProps,
      data,
      parent,
    }) satisfies ActiveEffect.Database.BackendCreateOperation,

  minimalPreCreateOptions: () =>
    ({
      ...database.minimalPreCreateOptionsBase,
    }) satisfies ActiveEffect.Database.PreCreateOptions,

  preCreateOptions: () =>
    ({
      ...database.preCreateOptionsBase,
      ...docCreateOpProps,
    }) satisfies ActiveEffect.Database.PreCreateOptions,

  minimalPreCreateOperation: ({ data, parent = null }: { data: CreateData[]; parent?: Parent }) =>
    ({
      ...database.minimalPreCreateOperationBase,
      data,
      parent,
    }) satisfies ActiveEffect.Database.PreCreateOperation,

  preCreateOperation: ({ data, parent = null }: { data: CreateData[]; parent?: Parent }) =>
    ({
      ...database.preCreateOperationBase,
      ...docCreateOpProps,
      data,
      parent,
    }) satisfies ActiveEffect.Database.PreCreateOperation,

  minimalOnCreateOptions: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.minimalOnCreateOptionsBase,
      parent,
    }) satisfies ActiveEffect.Database.OnCreateOptions,

  onCreateOptions: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.onCreateOptionsBase,
      ...docCreateOpProps,
      parent,
    }) satisfies ActiveEffect.Database.OnCreateOptions,

  minimalOnCreateOperation: ({ data, parent = null }: { data: CreateData[]; parent?: Parent }) =>
    ({
      ...database.minimalOnCreateOperationBase,
      data,
      parent,
    }) satisfies ActiveEffect.Database.OnCreateOperation,

  onCreateOperation: ({ data, parent = null }: { data: CreateData[]; parent?: Parent }) =>
    ({
      ...docCreateOpProps,
      ...database.onCreateOperationBase,
      data,
      parent,
    }) satisfies ActiveEffect.Database.OnCreateOperation,

  // -----------------

  updateOneDocumentsOperation: () =>
    ({
      ...database.updateOneDocumentOperationBase,
      ...docUpdateOpProps,
    }) satisfies ActiveEffect.Database.UpdateOneDocumentOperation,

  updateEmbeddedOperation: () =>
    ({
      ...database.updateEmbeddedOperationBase,
      ...docUpdateOpProps,
    }) satisfies ActiveEffect.Database.UpdateEmbeddedOperation,

  updateManyDocumentsOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.updateManyDocumentsOperationBase,
      ...docUpdateOpProps,
      parent,
    }) satisfies ActiveEffect.Database.UpdateManyDocumentsOperation,

  minimalBackendUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateInput[] }) =>
    ({
      parent,
      updates,
    }) satisfies ActiveEffect.Database.BackendUpdateOperation,

  backendUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateInput[] }) =>
    ({
      ...database.updateManyDocumentsOperationBase,
      ...docUpdateOpProps,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.BackendUpdateOperation,

  minimalPreUpdateOptions: () =>
    ({ ...database.minimalPreUpdateOptionsBase }) satisfies ActiveEffect.Database.PreUpdateOptions,

  preUpdateOptions: () =>
    ({ ...database.preUpdateOptionsBase, ..._docUpdateProps }) satisfies ActiveEffect.Database.PreUpdateOptions,

  minimalPreUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateData[] }) =>
    ({
      ...database.minimalPreUpdateOperationBase,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.PreUpdateOperation,

  preUpdateOperation: ({ parent = null, updates }: { updates: UpdateData[]; parent?: Parent }) =>
    ({
      ...database.preUpdateOperationBase,
      ...docUpdateOpProps,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.PreUpdateOperation,

  minimalOnUpdateOptions: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.minimalOnUpdateOptionsBase,
      parent,
    }) satisfies ActiveEffect.Database.OnUpdateOptions,

  onUpdateOptions: ({ parent = null }: { parent?: Parent }) =>
    ({
      ...database.onUpdateOptionsBase,
      ...docUpdateOpProps,
      parent,
    }) satisfies ActiveEffect.Database.OnUpdateOptions,

  minimalOnUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateData[] }) =>
    ({
      ...database.minimalOnUpdateOperationBase,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.OnUpdateOperation,

  onUpdateOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateData[] }) =>
    ({
      ...database.onUpdateOperationBase,
      ...docUpdateOpProps,
      parent,
      updates,
    }) satisfies ActiveEffect.Database.OnUpdateOperation,

  // -----------------

  deleteOneDocumentOperation: () =>
    ({
      ...database.deleteOneDocumentOperationBase,
      ...docDeleteOpProps,
    }) satisfies ActiveEffect.Database.DeleteOneDocumentOperation,

  deleteEmbeddedOperation: () =>
    ({
      ...database.deleteEmbeddedOperationBase,
      ...docDeleteOpProps,
    }) satisfies ActiveEffect.Database.DeleteEmbeddedOperation,

  deleteManyDocumentsOperation: ({ parent = null }: { parent?: Parent } = {}) =>
    ({
      ...database.deleteManyDocumentsOperationBase,
      ...docDeleteOpProps,
      parent,
    }) satisfies ActiveEffect.Database.DeleteManyDocumentsOperation,

  minimalBackendDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ids,
      parent,
    }) satisfies ActiveEffect.Database.BackendDeleteOperation,

  backendDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.backendDeleteOperationBase,
      ...docDeleteOpProps,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.BackendDeleteOperation,

  minimalPreDeleteOptions: () =>
    ({
      ...database.minimalPreDeleteOptionsBase,
    }) satisfies ActiveEffect.Database.PreDeleteOptions,

  preDeleteOptions: () =>
    ({
      ...database.preDeleteOptionsBase,
      ...docDeleteOpProps,
    }) satisfies ActiveEffect.Database.PreDeleteOptions,

  minimalPreDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.minimalPreDeleteOperationBase,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.PreDeleteOperation,

  preDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.preDeleteOperationBase,
      ...docDeleteOpProps,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.PreDeleteOperation,

  // TODO: remove in v14
  onDeleteDocumentsOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.preDeleteOperationBase,
      ...docDeleteOpProps,
      ids,
      parent,
      // eslint-disable-next-line @typescript-eslint/no-deprecated
    }) satisfies ActiveEffect.Database.OnDeleteDocumentsOperation,

  minimalOnDeleteOptions: ({ parent = null }: { parent?: Parent }) =>
    ({
      ...database.minimalOnDeleteOptionsBase,
      parent,
    }) satisfies ActiveEffect.Database.OnDeleteOptions,

  onDeleteOptions: ({ parent = null }: { parent?: Parent }) =>
    ({
      ...database.onDeleteOptionsBase,
      ...docDeleteOpProps,
      parent,
    }) satisfies ActiveEffect.Database.OnDeleteOptions,

  minimalOnDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.minimalOnDeleteOperationBase,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.OnDeleteOperation,

  onDeleteOperation: ({ ids, parent = null }: { ids: string[]; parent?: Parent }) =>
    ({
      ...database.onDeleteDocumentsOperationBase,
      ...docDeleteOpProps,
      ids,
      parent,
    }) satisfies ActiveEffect.Database.OnDeleteOperation,
};

export const realSource = {
  _id: "R5ro4AuNjcdWD56O",
  changes: [
    {
      key: "system.attributes.ac.calc",
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
      value: "unarmoredMonk",
      priority: null,
    },
  ],
  disabled: false,
  duration: {
    startTime: 0,
    seconds: null,
    combat: null,
    rounds: null,
    turns: null,
    startRound: null,
    startTurn: null,
  },
  origin: "Item.cOdcNWy4hII029DT",
  transfer: true,
  flags: {},
  tint: "#ffffff",
  name: "Unarmored Defense",
  description: "",
  statuses: [],
  _stats: {
    createdTime: 1252345,
    modifiedTime: 13245234623624,
    compendiumSource: null,
    duplicateSource: null,
    exportSource: null,
    coreVersion: "13.348",
    systemId: "dnd5e",
    systemVersion: "5.2.3",
    lastModifiedBy: null,
  },
  img: "icons/magic/control/silhouette-hold-change-blue.webp",
  type: "base",
  system: {},
  sort: 0,
} as const satisfies Source;

export const maximumSource = {
  _id: "R5ro4AuNjcdWD56O",
  changes: [
    {
      key: "system.attributes.ac.calc",
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
      value: "unarmoredMonk",
      priority: 70,
    },
  ],
  disabled: false,
  duration: {
    startTime: 0,
    seconds: 12,
    combat: "XXXXCOMBATIDXXXX",
    rounds: 2,
    turns: 7,
    startRound: 1,
    startTurn: 3,
  },
  origin: "Item.cOdcNWy4hII029DT",
  transfer: true,
  flags: {
    core: {
      overlay: true,
    },
  },
  tint: "#FEDCBA",
  name: "A Name",
  description: "Some Text",
  _stats: {
    systemVersion: null,
    compendiumSource: null,
    coreVersion: null,
    createdTime: 0,
    modifiedTime: 1,
    duplicateSource: null,
    exportSource: null,
    lastModifiedBy: "UserID",
    systemId: null,
  },
  img: null,
  sort: 0,
  statuses: [],
  system: {},
  type: "base",
} as const satisfies Source;

// @ts-expect-error ActiveEffect requires name.
new ActiveEffect.implementation();

// @ts-expect-error ActiveEffect requires name.
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
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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
expectTypeOf(ActiveEffect.applyField(model, change, undefined)).toEqualTypeOf<unknown>();
expectTypeOf(ActiveEffect.applyField(model, change, sf)).toEqualTypeOf<string | undefined>();
expectTypeOf(ActiveEffect.applyField(model, change, nf)).toEqualTypeOf<number | undefined | null>();
expectTypeOf(ActiveEffect.applyField(model, change, edf)).toEqualTypeOf<foundry.data.LightData>();

expectTypeOf(ActiveEffect.getInitialDuration()).toEqualTypeOf<ActiveEffect.GetInitialDurationReturn>();

// ClientDocument static overrides

declare const someItem: Item.Implementation;

// @ts-expect-error `defaultName` requires a `pack` or `parent`.
ActiveEffect.defaultName();

expectTypeOf(ActiveEffect.defaultName({ pack: "some.pack", parent: someItem, type: "base" })).toBeString();
expectTypeOf(ActiveEffect.defaultName({ pack: undefined, parent: undefined, type: undefined })).toBeString();
expectTypeOf(ActiveEffect.defaultName({ pack: null, parent: null, type: undefined })).toBeString();

// Note: this call will fail at runtime but a validator function to require `pack` or `parent` has not yet been written.
expectTypeOf(ActiveEffect.defaultName({})).toBeString();

// @ts-expect-error `ActiveEffect.createDialog` requires `createOptions` for pack information.
await ActiveEffect.createDialog({});

declare const someActor: Actor.Implementation;
expectTypeOf(
  ActiveEffect.createDialog(
    {},
    {
      parent: someActor,
    },
  ),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
expectTypeOf(
  ActiveEffect.createDialog(
    createData,
    {
      parent: someActor,
      pack: "some.pack",
    },
    {
      // TODO: add mock subtypes so this has valid values to test ("base" is excluded)
      //types: [],
    },
  ),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
expectTypeOf(
  ActiveEffect.createDialog(
    {},
    {
      parent: someActor,
      pack: undefined,
    },
  ),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
expectTypeOf(
  ActiveEffect.createDialog(createData, {
    parent: someActor,
    pack: null,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();

declare const aeSource: ActiveEffect.Source;
expectTypeOf(
  ActiveEffect.fromDropData({
    data: aeSource,
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation | undefined>>();
expectTypeOf(
  ActiveEffect.fromDropData({
    uuid: "someUUID", // TODO: This should be allowed
  }),
).toEqualTypeOf<Promise<ActiveEffect.Implementation | undefined>>();
expectTypeOf(
  ActiveEffect.fromDropData({
    data: aeSource,
  }),
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

expectTypeOf(effect._getCombatTime(0, 3)).toBeNumber();
expectTypeOf(effect._getCombatTime(0, 7, 3)).toBeNumber();

expectTypeOf(effect._getDurationLabel(2, 4)).toBeString();

expectTypeOf(effect.isTemporary).toEqualTypeOf<boolean>();
// @ts-expect-error Only getter, no setter
effect.isTemporary = false;

expectTypeOf(effect.sourceName).toEqualTypeOf<string>();
// @ts-expect-error Only getter, no setter
effect.sourceName = "foo";

expectTypeOf(effect.apply(someActor, change)).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(effect["_applyLegacy"](someActor, change, {})).toBeVoid();

expectTypeOf(effect["_applyAdd"](someActor, change, 5, 1, {})).toBeVoid();
expectTypeOf(effect["_applyMultiply"](someActor, change, 2, 4, {})).toBeVoid();
expectTypeOf(effect["_applyOverride"](someActor, change, "foo", "bar", {})).toBeVoid();
expectTypeOf(effect["_applyUpgrade"](someActor, change, 5, 9, {})).toBeVoid();
expectTypeOf(effect["_applyCustom"](someActor, change, { baz: 17 }, { fizz: false }, {})).toBeVoid();

// getFlag override has no type changes, handled in BaseActiveEffect tests

expectTypeOf(effect["_displayScrollingStatus"](true)).toBeVoid();

// ClientDocument instance override(s)

declare const mEvent: MouseEvent;
expectTypeOf(effect._onClickDocumentLink(mEvent)).toEqualTypeOf<ClientDocument.OnClickDocumentLinkReturn>();
