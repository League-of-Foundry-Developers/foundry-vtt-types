import { afterAll, describe, expect, expectTypeOf, test } from "vitest";
import type { InterfaceToObject, AnyMutableObject, EmptyObject } from "fvtt-types/utils";
import { cleanupDocuments, currentUser, database, testID } from "../../../utils.ts";
import * as itemHelpers from "./item.test-d.ts";

import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import DataModel = foundry.abstract.DataModel;
import Document = foundry.abstract.Document;
import fields = foundry.data.fields;
import EmbeddedCollection = foundry.abstract.EmbeddedCollection;

const documentName = "ActiveEffect";
const DocCls = ActiveEffect.implementation;
type SubType = ActiveEffect.SubType;
type Implementation = ActiveEffect.Implementation;
type ImplementationClass = ActiveEffect.ImplementationClass;
type OfType<Type extends SubType = SubType> = ActiveEffect.OfType<Type>;
type Stored<Type extends SubType = SubType> = ActiveEffect.Stored<Type>;
type Parent = ActiveEffect.Parent;
type Source = ActiveEffect.Source;
type Schema = ActiveEffect.Schema;
type CreateData<Type extends SubType = SubType> = ActiveEffect.CreateData<Type>;
type CreateInput = ActiveEffect.CreateInput;
type UpdateData = ActiveEffect.UpdateData;
type UpdateInput = ActiveEffect.UpdateInput;
type ConstructionContext = ActiveEffect.ConstructionContext;
type ParentCollectionName = ActiveEffect.ParentCollectionName;

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
    pack: null,
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

const update = {
  tint: "#146328",
} satisfies UpdateData;

const update2 = {
  tint: "#391463",
} satisfies UpdateData;

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

  // TODO: remove in v14
  onCreateDocumentsOperation: ({ data, parent = null }: { data: Implementation[]; parent?: Parent }) =>
    ({
      ...database.onCreateDocumentsOperationBase,
      ...docCreateOpProps,
      data,
      parent,
      // eslint-disable-next-line @typescript-eslint/no-deprecated
    }) satisfies ActiveEffect.Database.OnCreateDocumentsOperation,

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

  // TODO: remove in v14
  onUpdateDocumentsOperation: ({ parent = null, updates }: { parent?: Parent; updates: UpdateData[] }) =>
    ({
      ...database.onUpdateDocumentsOperationBase,
      ...docCreateOpProps,
      parent,
      updates,
      // eslint-disable-next-line @typescript-eslint/no-deprecated
    }) satisfies ActiveEffect.Database.OnUpdateDocumentsOperation,

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

describe("ActiveEffect Tests", async () => {
  test("Construction", async () => {
    // @ts-expect-error AEs require a `name`
    expect(() => new DocCls()).toThrow("may not be undefined");

    const mcdAETemp = new DocCls(minimalCreateData);
    expectTypeOf(mcdAETemp).toEqualTypeOf<Implementation>();
    expect(mcdAETemp).toBeInstanceOf(DocCls);
    expect(mcdAETemp.id).toBeNull();

    const ncdAETemp = new DocCls(nullishCreateData);
    expectTypeOf(ncdAETemp).toEqualTypeOf<Implementation>();
    expect(ncdAETemp).toBeInstanceOf(DocCls);
    expect(ncdAETemp.id).toBeNull();

    const fullSourceAETemp = new DocCls(source);
    expectTypeOf(fullSourceAETemp).toEqualTypeOf<OfType<"base">>();
    expect(fullSourceAETemp).toBeInstanceOf(DocCls);
    // Construction with an `_id` does use that value without requiring anything special in the context
    // (unlike creation, which requires `keepId`)
    expect(fullSourceAETemp.id).toBe(source._id);

    // Test with a full construction context, including a parent
    const tempAEWithContext = new DocCls(source, constructionContext({ parent }));
    expectTypeOf(tempAEWithContext).toEqualTypeOf<OfType<"base">>();
    expect(tempAEWithContext).toBeInstanceOf(DocCls);
    expect(tempAEWithContext.parent).toBe(parent);

    // strict: false in the construction context allows invalid input at runtime; we don't currently model this in types
    // @ts-expect-error Empty object is not valid CreateData
    const invalidTempAE = new DocCls({}, { strict: false });
    expect(invalidTempAE).toBeInstanceOf(DocCls);
    expect(invalidTempAE.name).toBeUndefined();
  });

  const tempDoc = new DocCls(source);

  test("Creation", async () => {
    // Note: unlike construction, static `create`/`createDocuments` are not wired to infer subtype, as they can both take arrays of input
    // and return arrays of documents, potentially of different types.

    // Actual creation requires a `parent` in the operation context
    expect(async () => await DocCls.create(source)).toThrow();

    // Actual creation requires *only* a `parent`
    const minimalCreation = await DocCls.create(source, { parent });
    expectTypeOf(minimalCreation).toEqualTypeOf<Stored | undefined>();
    if (!minimalCreation) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(minimalCreation);

    // creation with a complete (all keys, default values) operation object
    const fullCreateOperation = await DocCls.create(source, operations.createDocumentsOperation({ parent }));
    expectTypeOf(fullCreateOperation).toEqualTypeOf<Stored | undefined>();
    if (!fullCreateOperation) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(fullCreateOperation);

    // .create can take an array of inputs, and returns an array if so
    const createArray = await DocCls.create([source, source], { parent });
    expectTypeOf(createArray).toEqualTypeOf<Stored[]>();
    createArray.forEach((ae) => docsToCleanUp.add(ae));
    if (createArray.length !== 2)
      throw new Error(`At least one ${documentName} creation failed in \`.createDocuments\` test.`);
    expect(createArray[0]).toBeInstanceOf(DocCls);
    expect(createArray[1]).toBeInstanceOf(DocCls);

    // `.createDocuments` doesn't have any extra functionality over `.create`, but it always takes and returns an array
    const createDocumentsArray = await DocCls.createDocuments(
      [source, minimalCreateData, nullishCreateData],
      operations.createDocumentsOperation({ parent }),
    );
    expectTypeOf(createDocumentsArray).toEqualTypeOf<Stored[]>();
    createDocumentsArray.forEach((ae) => docsToCleanUp.add(ae));
    if (createDocumentsArray.length !== 3)
      throw new Error(`At least one ${documentName} creation failed in \`.createDocuments\` test.`);
    const [one, two, three] = createDocumentsArray;
    // created with full source
    expect(one).toBeInstanceOf(DocCls);
    expect(one!.tint.css).toBe(source.tint);

    // created with minimal CreateData; everything but `name` is using `initial`s
    expect(two).toBeInstanceOf(DocCls);
    expect(two!.name).toBe(minimalCreateData.name);
    expect(two!.tint.css).toBe(DocCls.schema.fields.tint.initial);
    expect(two!.duration.startRound).toBeUndefined();

    // almost everything is explicitly `null`, except where that's disallowed and `initial` takes over
    expect(three).toBeInstanceOf(DocCls);
    expect(three!.duration.startRound).toBeNull();
  });

  // TODO: remove in v14
  test(`Temporary "creation"`, async () => {
    // `temporary` testing: If it's even possible `temporary` is true, returns an `Implementation` instead of `Stored`

    // temporary: true, no persistence
    const tempTestTrue = await DocCls.create(source, {
      ...operations.createDocumentsOperation({ parent }),
      temporary: true,
    });
    expectTypeOf(tempTestTrue).toEqualTypeOf<Implementation | undefined>();
    if (!tempTestTrue) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(tempTestTrue);
    expect(tempTestTrue).toBeInstanceOf(DocCls);
    expect(tempTestTrue.id).toBeNull();

    // temporary: false, guaranteed persistence
    const tempTestFalse = await DocCls.create(source, {
      ...operations.createDocumentsOperation({ parent }),
      temporary: false,
    });
    if (!tempTestFalse) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(tempTestFalse);
    expectTypeOf(tempTestFalse).toEqualTypeOf<Stored>();
    expect(tempTestFalse).toBeInstanceOf(DocCls);
    expect(tempTestFalse.id).not.toBeNull();

    // temporary: undefined, guaranteed persistence
    const tempTestUndefined = await DocCls.create(source, {
      ...operations.createDocumentsOperation({ parent }),
      temporary: undefined,
    });
    if (!tempTestUndefined) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(tempTestUndefined);
    expectTypeOf(tempTestUndefined).toEqualTypeOf<Stored>();
    expect(tempTestUndefined).toBeInstanceOf(DocCls);
    expect(tempTestUndefined.id).not.toBeNull();
  });

  const doc = await DocCls.create(source, operations.createDocumentsOperation({ parent }));
  if (!doc) throw new Error(`Could not create test ${documentName}`);
  docsToCleanUp.add(doc);

  test("Cloning", async () => {
    // trying to clone with `save: true` on a temporary document *without* a parent fails, as `#clone` does `operation.parent = this.parent`
    expect(() => tempDoc.clone({}, { save: true })).toThrow();

    // no override data, no persistence
    const tempClone1 = tempDoc.clone();
    expectTypeOf(tempClone1).toEqualTypeOf<OfType<typeof source.type>>();
    expect(tempClone1.tint.css).toBe(source.tint);

    // override data
    const tempClone2 = tempDoc.clone(update);
    expectTypeOf(tempClone2).toEqualTypeOf<OfType<typeof source.type>>();
    expect(tempClone2.tint.css).toBe(update.tint);

    // clone context is most of the union of the construction context and a generic `CreateDocumentsOperation`
    // plus the `save` and `addSource` keys. `parent`, `pack`, and `strict` are enforced by `#clone`, so they
    // are not included.
    const maximalCloneContext = {
      save: undefined,
      addSource: false,
      keepId: false,
      broadcast: true,
      dropInvalidEmbedded: true,
      fallback: false,
      keepEmbeddedIds: false,
      noHook: false,
      pack: null,
      parentCollection: "effects",
      parentUuid: null,
      render: true,
      renderSheet: false,
    } satisfies Document.CloneContext;

    expectTypeOf(tempDoc.clone({}, maximalCloneContext)).toEqualTypeOf<OfType<typeof source.type>>();

    const tempClone3 = tempDoc.clone({}, { keepId: true });
    expect(tempClone3.id).toBe(source._id);

    const savedClone = await doc.clone({}, { save: true });
    if (!savedClone) throw new Error(`Failed to clone ${documentName} in test.`);
    docsToCleanUp.add(savedClone);
    expectTypeOf(savedClone).toEqualTypeOf<Stored>();
    expect(savedClone).toBeInstanceOf(DocCls);
  });

  test("Updating", async () => {
    // Instance:

    // Can't update temporary docs
    expect(async () => await tempDoc.update(update)).toThrow();

    // no operation
    const updated = await doc.update(update);
    if (!updated) throw new Error(`Could not update ${documentName} in test.`);
    expectTypeOf(updated).toEqualTypeOf<Stored>();
    expect(doc.tint.css).toBe(update.tint);

    // empty operation
    const updated2 = await doc.update(update2, {});
    if (!updated2) throw new Error(`Could not update ${documentName} in test.`);
    expectTypeOf(updated2).toEqualTypeOf<Stored>();
    expect(doc.tint.css).toBe(update2.tint);

    // all-keys operation (defaults)
    const updated3 = await doc.update(update, operations.updateOneDocumentsOperation());
    if (!updated3) throw new Error(`Could not update ${documentName} in test.`);

    // Static:

    // every update going through `.updateDocuments` requires an `_id`
    expect(async () => await DocCls.updateDocuments([update2], { parent })).toThrow();

    // documents without a world collection must specify `parent` or `parentUuid` (or `pack` for `Adventure`s)
    expect(async () => await DocCls.updateDocuments([{ _id: doc.id, ...update }])).toThrow();

    // actual updating via the static requires an `_id` per update, and a parent for always-embedded docs
    const updatedArray = await DocCls.updateDocuments([{ _id: doc.id, ...update2 }], { parent });
    if (!updatedArray.length) throw new Error(`Could not update ${documentName} in test.`);
    const updated4 = updatedArray[0]!;
    expectTypeOf(updated4).toEqualTypeOf<Stored>();
    expect(updated4.tint.css).toBe(update2.tint);

    // full operation object
    const updatedArray2 = await DocCls.updateDocuments(
      [{ _id: doc.id, ...update }],
      operations.updateManyDocumentsOperation({ parent }),
    );
    if (!updatedArray2.length) throw new Error(`Could not update ${documentName} in test.`);
    const updated5 = updatedArray2[0]!;
    expectTypeOf(updated5).toEqualTypeOf<Stored>();
    expect(updated5.tint.css).toBe(update.tint);
  });

  test("Deleting", async () => {
    const toBeDeletedArray = await DocCls.createDocuments([source, source, source, source], { parent });
    toBeDeletedArray.forEach((doc) => docsToCleanUp.add(doc)); // just in case
    const [one, two, three, four] = toBeDeletedArray;
    if (!one || !two || !three || !four) throw new Error(`Creation for at least one test ${documentName} failed.`);

    const deletedOne = await one.delete();
    if (!deletedOne) throw new Error(`Test ${documentName} deletion blocked`);
    expectTypeOf(deletedOne).toEqualTypeOf<Stored>();
    expect(deletedOne).toBeInstanceOf(DocCls);
    expect(deletedOne.parent.collections[deletedOne.parentCollection].has(deletedOne.id)).toBe(false);

    // once deleted, can't be deleted again (errors because parent collection lacks specified ID)
    expect(async () => await deletedOne.delete()).toThrow();

    const deletedTwo = await two.delete(operations.deleteOneDocumentOperation());
    if (!deletedTwo) throw new Error(`Test ${documentName} deletion blocked`);
    expectTypeOf(deletedTwo).toEqualTypeOf<Stored>();
    expect(deletedTwo).toBeInstanceOf(DocCls);
    expect(deletedTwo.parent.collections[deletedTwo.parentCollection].has(deletedTwo.id)).toBe(false);

    const [deletedThree] = await DocCls.deleteDocuments([three.id], { parent });
    if (!deletedThree) throw new Error(`Test ${documentName} deletion blocked`);
    expectTypeOf(deletedThree).toEqualTypeOf<Stored>();
    expect(deletedThree).toBeInstanceOf(DocCls);
    expect(deletedThree.parent.collections[deletedThree.parentCollection].has(deletedThree.id)).toBe(false);

    const [deletedFour] = await DocCls.deleteDocuments([four.id], operations.deleteManyDocumentsOperation({ parent }));
    if (!deletedFour) throw new Error(`Test ${documentName} deletion blocked`);
    expectTypeOf(deletedFour).toEqualTypeOf<Stored>();
    expect(deletedFour).toBeInstanceOf(DocCls);
    expect(deletedFour.parent.collections[deletedFour.parentCollection].has(deletedFour.id)).toBe(false);
  });

  test("Getting", () => {
    // TODO: add get tests in v14 when AEs are primary
    // `Document.get` is only relevant for Compendium or World documents
  });

  test("Initialized Fields", () => {
    expectTypeOf(doc.name).toBeString();
    expect(doc.name).toBe(source.name);

    // names are guaranteed on valid AEs, even if not persisted
    expectTypeOf(tempDoc.name).toBeString();
    expect(tempDoc.name).toBe(source.name);

    expectTypeOf(doc.img).toEqualTypeOf<string | null>();
    expect(doc.img).toBe(source.img);

    expectTypeOf(doc.type).toEqualTypeOf<SubType>();
    expect(doc.type).toBe(source.type);

    // `system` tests will have to wait for when we have a canonical test system

    // changes:
    expectTypeOf(doc.changes).toEqualTypeOf<ActiveEffect.ChangeData[]>();
    const firstChange = doc.changes[0];
    if (!firstChange) throw new Error("ActiveEffect has no changes somehow");
    expectTypeOf(firstChange.key).toBeString();
    expect(firstChange.key).toBe(source.changes[0].key);

    expectTypeOf(firstChange.value).toBeString();
    expect(firstChange.value).toBe(source.changes[0].value);

    expectTypeOf(firstChange.mode).toEqualTypeOf<CONST.ACTIVE_EFFECT_MODES>();
    expect(firstChange.mode).toBe(source.changes[0].mode);

    expectTypeOf(firstChange.priority).toEqualTypeOf<number | null | undefined>();
    expect(firstChange.priority).toBe(source.changes[0].priority);

    expectTypeOf(doc.disabled).toBeBoolean();
    expect(doc.disabled).toBe(source.disabled);

    // duration:
    expectTypeOf(doc.duration.startTime).toEqualTypeOf<number | null>();
    expect(doc.duration.startTime).toBe(source.duration.startTime);

    expectTypeOf(doc.duration.seconds).toEqualTypeOf<number | null | undefined>();
    expect(doc.duration.seconds).toBe(source.duration.seconds);

    expectTypeOf(doc.duration.combat).toEqualTypeOf<Combat.Stored | null>();
    expect(doc.duration.combat).toBeNull(); // Can't provide a real combat yet

    expectTypeOf(doc.duration.rounds).toEqualTypeOf<number | null | undefined>();
    expect(doc.duration.rounds).toBe(source.duration.rounds);

    expectTypeOf(doc.duration.turns).toEqualTypeOf<number | null | undefined>();
    expect(doc.duration.turns).toBe(source.duration.turns);

    expectTypeOf(doc.duration.startRound).toEqualTypeOf<number | null | undefined>();
    expect(doc.duration.startRound).toBe(source.duration.startRound);

    expectTypeOf(doc.duration.startTurn).toEqualTypeOf<number | null | undefined>();
    expect(doc.duration.startTurn).toBe(source.duration.startTurn);

    expectTypeOf(doc.description).toBeString();
    expect(doc.description).toBe(source.description);

    expectTypeOf(doc.origin).toEqualTypeOf<string | null>();
    expect(doc.origin).toBe(source.origin);

    expectTypeOf(doc.tint).toEqualTypeOf<Color>();
    expect(doc.tint.css).toBe(source.tint.toLowerCase());

    expectTypeOf(doc.transfer).toBeBoolean();
    expect(doc.transfer).toBe(source.transfer);

    expectTypeOf(doc.statuses).toEqualTypeOf<Set<string>>();
    expect(doc.statuses).toEqual(source.statuses);

    expectTypeOf(doc.sort).toBeNumber();
    expect(doc.sort).toBe(source.sort);

    expectTypeOf(doc.flags).toEqualTypeOf<
      fields.DocumentFlagsField.InitializedType<
        "ActiveEffect",
        InterfaceToObject<ActiveEffect.CoreFlags>,
        fields.DocumentFlagsField.DefaultOptions
      >
    >();
    expect(doc.flags.core?.overlay).toBe(source.flags.core.overlay);

    // _stats:
    expectTypeOf(doc._stats.coreVersion).toEqualTypeOf<string | null>();
    expect(doc._stats.coreVersion).toBe(game.version);

    expectTypeOf(doc._stats.systemId).toEqualTypeOf<string | null>();
    expect(doc._stats.systemId).toBe(game.system?.id);

    expectTypeOf(doc._stats.systemVersion).toEqualTypeOf<string | null>();
    expect(doc._stats.systemVersion).toBe(game.system?.version);

    expectTypeOf(doc._stats.createdTime).toEqualTypeOf<number | null | undefined>();
    expectTypeOf(doc._stats.modifiedTime).toEqualTypeOf<number | null | undefined>();

    expectTypeOf(doc._stats.lastModifiedBy).toEqualTypeOf<string | null>();
    expect(doc._stats.lastModifiedBy).toBe(game.user?.id);

    expectTypeOf(doc._stats.compendiumSource).toEqualTypeOf<string | null>();
    expect(doc._stats.compendiumSource).toBe(source._stats.compendiumSource);

    expectTypeOf(doc._stats.duplicateSource).toEqualTypeOf<string | null>();
    expect(doc._stats.duplicateSource).toBe(source._stats.duplicateSource);

    // exportSource:
    expectTypeOf(
      doc._stats.exportSource,
    ).toEqualTypeOf<fields.SchemaField.InitializedData<fields.DocumentStatsField.ExportSourceSchema> | null>();
    expect(doc._stats.exportSource).toBeNull();

    if (doc._stats.exportSource) {
      // this is just null in the test source, so type tests only for now
      const es = doc._stats.exportSource;
      expectTypeOf(es.worldId).toEqualTypeOf<string | null>();
      expectTypeOf(es.uuid).toEqualTypeOf<string | undefined>();
      expectTypeOf(es.coreVersion).toEqualTypeOf<string | null>();
      expectTypeOf(es.systemId).toEqualTypeOf<string | null>();
      expectTypeOf(es.systemVersion).toEqualTypeOf<string | null>();
    }
  });

  test("Shimmed Fields", () => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(doc.icon).toEqualTypeOf<string | null>();
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expect(doc.icon).toBe(source.img);
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    doc.icon = null; // Getter
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    doc.icon = source.img;
  });

  test("`preCreate`(`Operation`)", async () => {
    // For integrity of other tests; some documents may modify themselves in lifecycle methods
    const sacrificialDoc = await DocCls.create(source, { parent });
    if (!sacrificialDoc) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(sacrificialDoc);

    const preCreateMinimal = await sacrificialDoc["_preCreate"](
      source,
      operations.minimalPreCreateOptions(),
      currentUser,
    );
    expectTypeOf(preCreateMinimal).toEqualTypeOf<boolean | void>();
    expect(preCreateMinimal).toBeUndefined();

    const preCreate = await sacrificialDoc["_preCreate"](source, operations.preCreateOptions(), currentUser);
    expectTypeOf(preCreate).toEqualTypeOf<boolean | void>();
    expect(preCreate).toBeUndefined();

    const preCreateOperationMinimal = await DocCls["_preCreateOperation"](
      [tempDoc],
      operations.minimalPreCreateOperation({ data: [source], parent }),
      currentUser,
    );
    expectTypeOf(preCreateOperationMinimal).toEqualTypeOf<boolean | void>();
    expect(preCreateOperationMinimal).toBeUndefined();

    const preCreateOperation = await DocCls["_preCreateOperation"](
      [tempDoc],
      operations.preCreateOperation({ data: [source], parent }),
      currentUser,
    );
    expectTypeOf(preCreateOperation).toEqualTypeOf<boolean | void>();
    expect(preCreateOperation).toBeUndefined();
  });

  // TODO: Deprecated; remove in v14
  test(`onCreateDocuments`, async () => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const onCreateDocuments = await DocCls["_onCreateDocuments"](
      [tempDoc],
      operations.onCreateDocumentsOperation({ data: [tempDoc], parent }),
    );
    expectTypeOf(onCreateDocuments).toBeVoid();
    expect(onCreateDocuments).toBeUndefined();
  });

  test("`onCreate`(`Operation`)", async () => {
    // For integrity of other tests; some documents may modify themselves in lifecycle methods
    const sacrificialDoc = await DocCls.create(source, { parent });
    if (!sacrificialDoc) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(sacrificialDoc);

    const onCreateMinimal = sacrificialDoc["_onCreate"](source, operations.minimalOnCreateOptions(), currentUser.id);
    expectTypeOf(onCreateMinimal).toEqualTypeOf<void>();
    expect(onCreateMinimal).toBeUndefined();

    const onCreate = sacrificialDoc["_onCreate"](source, operations.onCreateOptions(), currentUser.id);
    expectTypeOf(onCreate).toEqualTypeOf<void>();
    expect(onCreate).toBeUndefined();

    const onCreateOperationMinimal = await DocCls["_onCreateOperation"](
      [doc],
      operations.minimalOnCreateOperation({ data: [source], parent }),
      currentUser,
    );
    expectTypeOf(onCreateOperationMinimal).toEqualTypeOf<void>();
    expect(onCreateOperationMinimal).toBeUndefined();

    const onCreateOperation = await DocCls["_onCreateOperation"](
      [doc],
      operations.onCreateOperation({ data: [source], parent }),
      currentUser,
    );
    expectTypeOf(onCreateOperation).toEqualTypeOf<void>();
    expect(onCreateOperation).toBeUndefined();
  });

  test("`preUpdate`(`Operation`)", async () => {
    // For integrity of other tests; some documents may modify themselves in lifecycle methods
    const sacrificialDoc = await DocCls.create(source, { parent });
    if (!sacrificialDoc) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(sacrificialDoc);

    const preUpdateMinimal = await sacrificialDoc["_preUpdate"](
      update,
      operations.minimalPreUpdateOptions(),
      currentUser,
    );
    expectTypeOf(preUpdateMinimal).toEqualTypeOf<boolean | void>();
    expect(preUpdateMinimal).toBeUndefined();

    const preUpdate = await sacrificialDoc["_preUpdate"](update, operations.preUpdateOptions(), currentUser);
    expectTypeOf(preUpdate).toEqualTypeOf<boolean | void>();
    expect(preUpdate).toBeUndefined();

    const preUpdateOperationMinimal = await DocCls["_preUpdateOperation"](
      [sacrificialDoc],
      operations.minimalPreUpdateOperation({ updates: [update], parent }),
      currentUser,
    );
    expectTypeOf(preUpdateOperationMinimal).toEqualTypeOf<boolean | void>();
    expect(preUpdateOperationMinimal).toBeUndefined();

    const preUpdateOperation = await DocCls["_preUpdateOperation"](
      [sacrificialDoc],
      operations.preUpdateOperation({ updates: [update], parent }),
      currentUser,
    );
    expectTypeOf(preUpdateOperation).toEqualTypeOf<boolean | void>();
    expect(preUpdateOperation).toBeUndefined();
  });

  // TODO: Deprecated; remove in v14
  test(`onUpdateDocuments`, async () => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const onUpdateDocuments = await DocCls["_onUpdateDocuments"](
      [doc],
      operations.onUpdateDocumentsOperation({ updates: [update], parent }),
    );
    expectTypeOf(onUpdateDocuments).toBeVoid();
    expect(onUpdateDocuments).toBeUndefined();
  });

  test("`onUpdate`(`Operation`)", async () => {
    // For integrity of other tests; some documents may modify themselves in lifecycle methods
    const sacrificialDoc = await DocCls.create(source, { parent });
    if (!sacrificialDoc) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(sacrificialDoc);

    const onUpdateMinimal = sacrificialDoc["_onUpdate"](source, operations.minimalOnUpdateOptions(), currentUser.id);
    expectTypeOf(onUpdateMinimal).toEqualTypeOf<void>();
    expect(onUpdateMinimal).toBeUndefined();

    const onUpdate = sacrificialDoc["_onUpdate"](source, operations.onUpdateOptions({ parent }), currentUser.id);
    expectTypeOf(onUpdate).toEqualTypeOf<void>();
    expect(onUpdate).toBeUndefined();

    const onUpdateOperationMinimal = await DocCls["_onUpdateOperation"](
      [doc],
      operations.minimalOnUpdateOperation({ updates: [update], parent }),
      currentUser,
    );
    expectTypeOf(onUpdateOperationMinimal).toEqualTypeOf<void>();
    expect(onUpdateOperationMinimal).toBeUndefined();

    const onUpdateOperation = await DocCls["_onUpdateOperation"](
      [doc],
      operations.onUpdateOperation({ updates: [update], parent }),
      currentUser,
    );
    expectTypeOf(onUpdateOperation).toEqualTypeOf<void>();
    expect(onUpdateOperation).toBeUndefined();
  });

  test("`preDelete`(`Operation`)", async () => {
    // For integrity of other tests; some documents may modify themselves in lifecycle methods
    const sacrificialDoc = await DocCls.create(source, { parent });
    if (!sacrificialDoc) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(sacrificialDoc);

    const preDeleteMinimal = await sacrificialDoc["_preDelete"](operations.minimalPreDeleteOptions(), currentUser);
    expectTypeOf(preDeleteMinimal).toEqualTypeOf<boolean | void>();
    expect(preDeleteMinimal).toBeUndefined();

    const preDelete = await sacrificialDoc["_preDelete"](operations.preDeleteOptions(), currentUser);
    expectTypeOf(preDelete).toEqualTypeOf<boolean | void>();
    expect(preDelete).toBeUndefined();

    const preDeleteOperationMinimal = await DocCls["_preDeleteOperation"](
      [sacrificialDoc],
      operations.minimalPreDeleteOperation({ ids: [testID], parent }),
      currentUser,
    );
    expectTypeOf(preDeleteOperationMinimal).toEqualTypeOf<boolean | void>();
    expect(preDeleteOperationMinimal).toBeUndefined();

    const preDeleteOperation = await DocCls["_preDeleteOperation"](
      [sacrificialDoc],
      operations.preDeleteOperation({ ids: [testID], parent }),
      currentUser,
    );
    expectTypeOf(preDeleteOperation).toEqualTypeOf<boolean | void>();
    expect(preDeleteOperation).toBeUndefined();
  });

  // TODO: Deprecated; remove in v14
  test(`onDeleteDocuments`, async () => {
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    const onDeleteDocuments = await DocCls["_onDeleteDocuments"](
      [doc],
      operations.onDeleteDocumentsOperation({ ids: [testID], parent }),
    );
    expectTypeOf(onDeleteDocuments).toBeVoid();
    expect(onDeleteDocuments).toBeUndefined();
  });

  test("`onDelete`(`Operation`)", async () => {
    // For integrity of other tests; some documents may modify themselves in lifecycle methods
    const sacrificialDoc = await DocCls.create(source, { parent });
    if (!sacrificialDoc) throw new Error(`Couldn't create test ${documentName}`);
    docsToCleanUp.add(sacrificialDoc);

    const onDeleteMinimal = sacrificialDoc["_onDelete"](operations.minimalOnDeleteOptions({ parent }), currentUser.id);
    expectTypeOf(onDeleteMinimal).toEqualTypeOf<void>();
    expect(onDeleteMinimal).toBeUndefined();

    const onDelete = sacrificialDoc["_onDelete"](operations.onDeleteOptions({ parent }), currentUser.id);
    expectTypeOf(onDelete).toEqualTypeOf<void>();
    expect(onDelete).toBeUndefined();

    const onDeleteOperationMinimal = await DocCls["_onDeleteOperation"](
      [doc],
      operations.minimalOnDeleteOperation({ ids: [testID], parent }),
      currentUser,
    );
    expectTypeOf(onDeleteOperationMinimal).toEqualTypeOf<void>();
    expect(onDeleteOperationMinimal).toBeUndefined();

    const onDeleteOperation = await DocCls["_onDeleteOperation"](
      [doc],
      operations.onDeleteOperation({ ids: [testID], parent }),
      currentUser,
    );
    expectTypeOf(onDeleteOperation).toEqualTypeOf<void>();
    expect(onDeleteOperation).toBeUndefined();
  });

  test("Flags", async () => {
    // TODO: Add configured flags & tests for them

    // Core all-document flags
    const sheetLock = doc.getFlag("core", "sheetLock");
    expectTypeOf(sheetLock).toEqualTypeOf<NonNullable<Document.CoreFlags["core"]>["sheetLock"]>();
    const sheetClass = doc.getFlag("core", "sheetClass");
    expectTypeOf(sheetClass).toEqualTypeOf<NonNullable<Document.CoreFlags["core"]>["sheetClass"]>();

    // Core document-specific flags
    const overlay = doc.getFlag("core", "overlay");
    expectTypeOf(overlay).toEqualTypeOf<NonNullable<ActiveEffect.CoreFlags["core"]>["overlay"]>();

    // Setting
    const docWithFlag = await doc.setFlag("core", "overlay", true);
    expectTypeOf(docWithFlag).toEqualTypeOf<Stored | undefined>();
    if (!docWithFlag) throw new Error(`Failed to update ${documentName} flag in test.`);
    expect(doc.flags.core?.overlay).toBe(true);

    // Unsetting
    const docWithoutFlag = await doc.unsetFlag("core", "overlay");
    expectTypeOf(docWithoutFlag).toEqualTypeOf<Stored | undefined>();
    if (!docWithoutFlag) throw new Error(`Failed to update ${documentName} flag in test.`);
    expect.assert(!("overlay" in (doc.flags.core ?? {})));
    expect(doc.flags.core).toEqual({});
  });

  test("Parent Collection", () => {
    expectTypeOf(DocCls.collectionName).toEqualTypeOf<"effects">();
    expect(DocCls.collectionName).toBe("effects");

    expectTypeOf(doc.collectionName).toEqualTypeOf<"effects">();
    expect(doc.collectionName).toBe("effects");

    expectTypeOf(doc._getParentCollection()).toEqualTypeOf<string | null>();
    expectTypeOf(doc._getParentCollection("foo")).toEqualTypeOf<string | null>();
    expectTypeOf(doc._getParentCollection(null)).toEqualTypeOf<string | null>();
    expect(doc._getParentCollection()).toBe("effects");
    expect(tempDoc._getParentCollection()).toBeNull();
    expect(doc._getParentCollection("foo")).toBe("foo");
    expect(doc._getParentCollection(null)).toBeNull();

    expectTypeOf(tempDoc.parentCollection).toEqualTypeOf<ParentCollectionName | null>();
    expectTypeOf(doc.parentCollection).toEqualTypeOf<ParentCollectionName>();
    expect(tempDoc.parentCollection).toBeNull();
    expect(doc.parentCollection).toBe("effects");

    expectTypeOf(tempDoc.collection).toEqualTypeOf<EmbeddedCollection<
      ActiveEffect.Stored,
      Actor.Implementation | Item.Implementation
    > | null>();
    expectTypeOf(doc.collection).toEqualTypeOf<
      EmbeddedCollection<ActiveEffect.Stored, Actor.Implementation | Item.Implementation>
    >();
  });

  test("Embedded Documents and Collections", async () => {
    expectTypeOf(DocCls.getCollectionName("foo")).toBeNull();
    expect(DocCls.getCollectionName("foo")).toBeNull();

    // This document type has no embedded collections
    expectTypeOf(doc.collections).toExtend<EmptyObject>();
    expect(doc.collections).toBe({});

    // @ts-expect-error This document type has no embedded collections, so this method is not in its template, and still takes `never`
    expect(() => doc.getEmbeddedCollection("foo")).toThrow();

    // @ts-expect-error This document type has no embedded collections, so this method is not in its template, and still takes `never`
    expect(() => doc.createEmbeddedDocuments()).toThrow();

    // @ts-expect-error This document type has no embedded collections, so this method is not in its template, and still takes `never`
    expect(() => doc.updateEmbeddedDocuments()).toThrow();

    // @ts-expect-error This document type has no embedded collections, so this method is not in its template, and still takes `never`
    expect(() => doc.deleteEmbeddedDocuments()).toThrow();

    const embeddedTraversalGenerator = doc.traverseEmbeddedDocuments();
    const embeddedDocs = [...embeddedTraversalGenerator];
    expectTypeOf(embeddedTraversalGenerator).toEqualTypeOf<Generator<[string, Document.Any], void, undefined>>();
    // This document type has no embedded collections, so it will never have embedded docs to traverse
    expect(embeddedDocs).toEqual([]);
  });

  test("Non-overridden Document properties and methods.", () => {
    expectTypeOf(() => doc["_configure"]()).returns.toEqualTypeOf<void>();
  });

  test("`Document` overrides: `#type`", () => {
    expectTypeOf(tempDoc.type).toEqualTypeOf<"base">();
    expect(tempDoc.type).toBe("base");

    // creation doesn't infer type
    expectTypeOf(doc.type).toEqualTypeOf<SubType>();
    if (isOfType(doc, "base")) {
      expectTypeOf(doc.type).toEqualTypeOf<"base">();
      expect(doc.type).toBe("base");
    }
  });

  test("`Document` overrides: `#parent`", () => {
    // Temporary AEs can exist without parents
    expectTypeOf(tempDoc.parent).toEqualTypeOf<Parent>();
    expectTypeOf(tempDoc.parent).extract<null>().toBeNull();

    expect(tempDoc.parent).toBeNull();

    // TODO: revisit in v14 when AEs are primary docs
    // AEs are embedded, non-primary documents, so they will always have a parent when persisted
    expectTypeOf(doc.parent).extract<null>().toBeNever();

    expect(doc.parent).toBe(parent);

    if (!(doc.parent instanceof Item.implementation)) {
      expectTypeOf(doc.parent).toEqualTypeOf<Actor.Implementation>();
    }
  });

  test("`Document` overrides: `#pack`", () => {
    // TODO: get runtime compendium testing sorted before trying to test creating in packs
    expectTypeOf(doc.pack).toEqualTypeOf<string | null>();
    expect(doc.pack).toBeNull();
  });

  test("`Document` overrides: other static getters", () => {
    expectTypeOf(DocCls).toEqualTypeOf<ImplementationClass>();
    expect(DocCls).toBe(foundry.documents.ActiveEffect);

    expectTypeOf(DocCls.baseDocument).toEqualTypeOf<typeof foundry.documents.BaseActiveEffect>();
    expect(DocCls.baseDocument).toBe(foundry.documents.BaseActiveEffect);

    expectTypeOf(DocCls.documentName).toEqualTypeOf<"ActiveEffect">();
    expect(DocCls.documentName).toBe("ActiveEffect");

    expectTypeOf(DocCls.TYPES).toEqualTypeOf<SubType[]>();
    // TODO: further testing with configured types
    expect(DocCls.TYPES).toContain("base");

    expectTypeOf(DocCls.hasTypeData).toEqualTypeOf<true>();
    expect(DocCls.hasTypeData).toBe(true);

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    expectTypeOf(DocCls.hierarchy).toEqualTypeOf<{}>();
    expect(DocCls.hierarchy).toBe({});
  });

  test("`DataModel` overrides: schema statics", () => {
    expectTypeOf(DocCls["_schema"]).toEqualTypeOf<fields.SchemaField<Schema>>();
    expect(DocCls["_schema"]).toBeInstanceOf(fields.SchemaField);

    expectTypeOf(DocCls.schema).toEqualTypeOf<fields.SchemaField<Schema>>();
    expect(DocCls.schema).toBeInstanceOf(fields.SchemaField);
    expect(DocCls.schema).toBe(DocCls["_schema"]);

    expect(DocCls.defineSchema()._id).toBeInstanceOf(fields.DocumentIdField);
  });

  test("`DataModel` overrides: `.validateJoint`", () => {
    expectTypeOf(DocCls.validateJoint(source)).toBeVoid();
    expect(DocCls.validateJoint(source)).toBeUndefined();
  });

  test("`DataModel` overrides: `.fromSource` & `.fromJSON`", () => {
    const tempFromSource = DocCls.fromSource(source);
    expectTypeOf(tempFromSource).toEqualTypeOf<Implementation>();
    expect(tempFromSource).toBeInstanceOf(DocCls);

    // @ts-expect-error Types don't currently allow invalid input with `strict: false`, which is the default in `fromSource`,
    // but it's valid at runtime.
    const invalidFromSource = DocCls.fromSource({});
    expect(invalidFromSource).toBeInstanceOf(DocCls);
    expect(invalidFromSource.name).toBeUndefined();

    // @ts-expect-error CreateData must include `name`
    const failedConstructionWithStrict = () => DocCls.fromSource({}, { strict: true });
    expect(failedConstructionWithStrict).toThrow();

    // `fromJSON` simply forwards data to `fromSource`, without any way to pass a construction context.
    // We currently type its only parameter as simply `string`, but it must still be valid JSON
    expect(() => DocCls.fromJSON("")).toThrow();

    const invalidFromJSON = DocCls.fromJSON("{}");
    expect(invalidFromJSON).toBeInstanceOf(DocCls);
    expect(invalidFromJSON.name).toBeUndefined();

    const validFromJSON = DocCls.fromJSON(JSON.stringify(source));
    expectTypeOf(validFromJSON).toEqualTypeOf<Implementation>();
    expect(validFromJSON).toBeInstanceOf(DocCls);
    expect(validFromJSON.name).toBe(source.name);
  });

  test("`DataModel` methods not overridden: `TODO`", () => {
    // TODO: add these tests after DataModel is updated to v13 at least
  });

  afterAll(async () => {
    await cleanupDocuments(docsToCleanUp);
  });
});

// @ts-expect-error ActiveEffect requires name.
new ActiveEffect.implementation();

// @ts-expect-error ActiveEffect requires name.
new ActiveEffect.implementation({});

declare const model: DataModel.Any;
declare const change: ActiveEffect.ChangeData;
declare const aeContext: Document.ConstructionContext<Parent>;

// Static methods native to this Document

expectTypeOf(ActiveEffect.fromStatusEffect("flying")).toEqualTypeOf<Promise<Implementation>>();
expectTypeOf(ActiveEffect.fromStatusEffect("flying", {})).toEqualTypeOf<Promise<Implementation>>();
expectTypeOf(ActiveEffect.fromStatusEffect("flying", aeContext)).toEqualTypeOf<Promise<Implementation>>();

const createData = {
  name: "foo",
  changes: [{ key: "system.foo.bar", mode: CONST.ACTIVE_EFFECT_MODES.UPGRADE, value: "7", priority: 42 }],
};

expectTypeOf(ActiveEffect["_fromStatusEffect"]("flying", createData)).toEqualTypeOf<Promise<Implementation>>();
expectTypeOf(ActiveEffect["_fromStatusEffect"]("flying", createData, {})).toEqualTypeOf<Promise<Implementation>>();
expectTypeOf(ActiveEffect["_fromStatusEffect"]("flying", createData, aeContext)).toEqualTypeOf<
  Promise<Implementation>
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

// @ts-expect-error `defaultName` requires a `parent`.
ActiveEffect.defaultName();

expectTypeOf(ActiveEffect.defaultName({ pack: "some.pack", parent: someItem, type: "base" })).toBeString();
expectTypeOf(ActiveEffect.defaultName({ pack: undefined, parent: undefined, type: undefined })).toBeString();
expectTypeOf(ActiveEffect.defaultName({ pack: null, parent: null, type: undefined })).toBeString();

// Note: this call will fail at runtime but a validator function to require `pack` or `parent` has not yet been written.
expectTypeOf(ActiveEffect.defaultName({})).toBeString();

// @ts-expect-error `ActiveEffect.createDialog` requires `createOptions` for parent information.
await ActiveEffect.createDialog({});

declare const someActor: Actor.Implementation;
expectTypeOf(
  ActiveEffect.createDialog(
    {},
    {
      parent: someActor,
    },
  ),
).toEqualTypeOf<Promise<Stored | null | "ok">>();
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
).toEqualTypeOf<Promise<Stored | null | "ok">>();
expectTypeOf(
  ActiveEffect.createDialog(
    {},
    {
      parent: someActor,
      pack: undefined,
    },
  ),
).toEqualTypeOf<Promise<Stored | null | "ok">>();
expectTypeOf(
  ActiveEffect.createDialog(createData, {
    parent: someActor,
    pack: null,
  }),
).toEqualTypeOf<Promise<Stored | null | "ok">>();

declare const aeSource: ActiveEffect.Source;
expectTypeOf(
  ActiveEffect.fromDropData({
    data: aeSource,
  }),
).toEqualTypeOf<Promise<Implementation | undefined>>();
expectTypeOf(
  ActiveEffect.fromDropData({
    uuid: "someUUID", // TODO: This should be allowed
  }),
).toEqualTypeOf<Promise<Implementation | undefined>>();
expectTypeOf(
  ActiveEffect.fromDropData({
    data: aeSource,
  }),
).toEqualTypeOf<Promise<Implementation | undefined>>();

expectTypeOf(ActiveEffect.fromImport(aeSource)).toEqualTypeOf<Promise<Implementation>>();
expectTypeOf(ActiveEffect.fromImport(aeSource, {})).toEqualTypeOf<Promise<Implementation>>();
expectTypeOf(
  ActiveEffect.fromImport(aeSource, {
    dropInvalidEmbedded: true,
    fallback: true,
    pack: "some.pack",
    parent: someItem,
    parentCollection: "effects",
    strict: true,
  }),
).toEqualTypeOf<Promise<Implementation>>();
expectTypeOf(
  ActiveEffect.fromImport(aeSource, {
    dropInvalidEmbedded: undefined,
    fallback: undefined,
    pack: undefined,
    parent: undefined,
    parentCollection: undefined,
    // strict not allowed to be undefined,
  }),
).toEqualTypeOf<Promise<Implementation>>();
expectTypeOf(
  ActiveEffect.fromImport(aeSource, {
    dropInvalidEmbedded: null,
    fallback: null,
    pack: null,
    parent: null,
    parentCollection: null,
    strict: false,
  }),
).toEqualTypeOf<Promise<Implementation>>();

// Instance methods native to this Document

const effect = new ActiveEffect.implementation({ name: "My effect" });
expectTypeOf(effect).toEqualTypeOf<Implementation>();

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
