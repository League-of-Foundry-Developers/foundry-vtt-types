// import Document = foundry.abstract.Document;

export const getOperationName = ["GetDocumentsOperation", "BackendGetOperation"] as const;

export const createOperationName = [
  "CreateDocumentsOperation",
  "CreateEmbeddedOperation",
  "BackendCreateOperation",
  "PreCreateOptions",
  "PreCreateOperation",
  "OnCreateDocumentsOperation",
  "OnCreateOptions",
  "OnCreateOperation",
] as const;

export const updateOperationName = [
  "UpdateOneDocumentOperation",
  "UpdateEmbeddedOperation",
  "UpdateManyDocumentsOperation",
  "BackendUpdateOperation",
  "PreUpdateOptions",
  "PreUpdateOperation",
  "OnUpdateDocumentsOperation",
  "OnUpdateOptions",
  "OnUpdateOperation",
] as const;

export const deleteOperationName = [
  "DeleteOneDocumentOperation",
  "DeleteEmbeddedOperation",
  "DeleteManyDocumentsOperation",
  "BackendDeleteOperation",
  "PreDeleteOptions",
  "PreDeleteOperation",
  "OnDeleteDocumentsOperation",
  "OnDeleteOptions",
  "OnDeleteOperation",
] as const;

export const operationName = [
  ...getOperationName,
  ...createOperationName,
  ...updateOperationName,
  ...deleteOperationName,
];

export const getDocumentsOperationBase = {
  action: "get" as const, // never actually required to be passed; included here for completeness, as there's no lifecycle methods for `get` that would actually have this property populated
  broadcast: false as const, // get operations are never broadcast, enforced in `DatabaseBackend##configureGet`
  index: false,
  indexFields: ["foo"], // paths that don't exist in the source are ignored
  query: {}, // an empty query gets all documents of the specified collection
  pack: null, // runtime, there would be no reason to ever not pass a pack, as all other documents are already loaded locally, but without one it *will* just re-pull world documents
  parent: null,
  parentUuid: null,
};

export const backendGetOperationBase = {
  ...getDocumentsOperationBase, // literally identical as of 13.351
};

const createOpPropsNeverOmitted = {
  broadcast: true,
  keepEmbeddedIds: false,
  keepId: false,
  render: true,
  renderSheet: false,
};

/** Keys all operation object types post-{@linkcode foundry.abstract.DatabaseBackend.create | DatabaseBackend#create} have. */
const postBackendCreateOpProperties = {
  action: "create",
  modifiedTime: Date.now(),
} as const; // as const required because `"create"` is a literal

const createOpPropsBeforeSocket = {
  temporary: undefined,
};

// creation via `#createEmbeddedDocuments` doesn't allow specifying pack or parent
export const createEmbeddedOperationBase = {
  ...createOpPropsBeforeSocket,
  ...createOpPropsNeverOmitted,
  noHook: false,
};

export const createDocumentsOperationBase = {
  ...createEmbeddedOperationBase,
  pack: null,
  parent: null,
  parentUuid: null,
};

export const minimalPreCreateOptionsBase = {
  ...postBackendCreateOpProperties,
  renderSheet: true,
};

export const preCreateOptionsBase = {
  ...createOpPropsBeforeSocket,
  ...createOpPropsNeverOmitted,
  ...minimalPreCreateOptionsBase,
  parentUuid: null,
};

export const minimalPreCreateOperationBase = {
  ...minimalPreCreateOptionsBase,
  // `parent` and `data` are always document-specific
};

export const preCreateOperationBase = {
  ...createOpPropsBeforeSocket,
  ...createOpPropsNeverOmitted,
  ...minimalPreCreateOperationBase,
  noHook: false,
  pack: null,
  parentUuid: null,
  // `parent` and `data` are always document-specific
};

export const onCreateDocumentsOperationBase = {
  ...createOpPropsNeverOmitted,
  ...createOpPropsBeforeSocket,
  ...postBackendCreateOpProperties,
  // `parent` and `data` are always document-specific
};

export const minimalOnCreateOptionsBase = {
  ...postBackendCreateOpProperties,
  renderSheet: false,
};

export const onCreateOptionsBase = {
  ...createOpPropsNeverOmitted,
  ...minimalOnCreateOptionsBase,
  noHook: false,
};

export const minimalOnCreateOperationBase = {
  ...minimalOnCreateOptionsBase,
  // `parent` and `data` are always document-specific
};

export const onCreateOperationBase = {
  ...createOpPropsNeverOmitted,
  ...minimalOnCreateOptionsBase,
  noHook: false,
  pack: null,
  parentUuid: null,
};

// -------------

const updateOpPropsNeverOmitted = {
  broadcast: true,
  diff: true,
  preview: false,
  recursive: true,
  render: true,
};

/** Keys all operation object types post-{@linkcode foundry.abstract.DatabaseBackend.update | DatabseBackend#update} have. */
const postBackendUpdateOpProperties = {
  action: "update",
  modifiedTime: Date.now(),
  diff: true,
  recursive: true,
} as const; // as const required because `"create"` is a literal

export const updateOneDocumentOperationBase = {
  ...updateOpPropsNeverOmitted,
  noHook: true,
};

export const updateEmbeddedOperationBase = {
  ...updateOneDocumentOperationBase,
};

export const updateManyDocumentsOperationBase = {
  ...updateOneDocumentOperationBase,
  pack: null,
  parentUuid: null,
  // `parent` is always document-specific
};

export const backendUpdateOperationBase = {
  ...updateManyDocumentsOperationBase,
};

export const minimalPreUpdateOptionsBase = {
  ...postBackendUpdateOpProperties,
};

export const preUpdateOptionsBase = {
  ...postBackendUpdateOpProperties,
  ...updateOpPropsNeverOmitted,
};

export const minimalPreUpdateOperationBase = {
  ...postBackendUpdateOpProperties,
  // `parent` and `updates` are always document-specific
};

export const preUpdateOperationBase = {
  ...minimalPreUpdateOperationBase,
  ...updateOpPropsNeverOmitted,
  noHook: false,
  pack: null,
  parentUuid: null,
  // `parent` and `updates` are always document-specific
};

export const onUpdateDocumentsOperationBase = {
  ...updateOpPropsNeverOmitted,
  ...postBackendUpdateOpProperties,
  // `parent` and `updates` are always document-specific
};

export const minimalOnUpdateOptionsBase = {
  ...postBackendUpdateOpProperties,
  // `parent` is always document-specific
};

export const onUpdateOptionsBase = {
  ...minimalOnUpdateOptionsBase,
  ...updateOpPropsNeverOmitted,
  noHook: false,
};

export const minimalOnUpdateOperationBase = {
  ...minimalOnUpdateOptionsBase,
  // `parent` and `updates` are always document-specific
};

export const onUpdateOperationBase = {
  ...minimalOnUpdateOperationBase,
  ...updateOpPropsNeverOmitted,
  noHook: false,
  pack: null,
  parentUuid: null,
  // `parent` and `updates` are always document-specific
};

/** Keys all operation object types post-{@linkcode foundry.abstract.DatabaseBackend.delete | DatabseBackend#delete} have. */
const postBackendDeleteOpProperties = {
  action: "delete",
  modifiedTime: Date.now(),
} as const; // as const required because `"create"` is a literal

const deleteOpPropsNeverOmitted = {
  broadcast: true,
  render: true,
  replacements: {},
};

export const deleteOneDocumentOperationBase = {
  ...deleteOpPropsNeverOmitted,
  noHook: false,
  deleteAll: false,
};

export const deleteEmbeddedOperationBase = {
  ...deleteOneDocumentOperationBase,
};

export const deleteManyDocumentsOperationBase = {
  ...deleteOneDocumentOperationBase,
  pack: null,
  parentUuid: null,
  // `parent` is always document-specific
};

export const backendDeleteOperationBase = {
  ...deleteManyDocumentsOperationBase,
};

export const minimalPreDeleteOptionsBase = {
  ...postBackendDeleteOpProperties,
};

export const preDeleteOptionsBase = {
  ...minimalPreDeleteOptionsBase,
  ...deleteOpPropsNeverOmitted,
  parentUuid: null,
};

export const minimalPreDeleteOperationBase = {
  ...postBackendDeleteOpProperties,
  deleteAll: false,
};

export const preDeleteOperationBase = {
  ...minimalPreDeleteOperationBase,
  ...deleteOpPropsNeverOmitted,
  noHook: false,
  pack: null,
  parentUuid: null,
};

export const onDeleteDocumentsOperationBase = {
  ...preDeleteOperationBase,
};

export const minimalOnDeleteOptionsBase = {
  ...postBackendDeleteOpProperties,
};

export const onDeleteOptionsBase = {
  ...minimalOnDeleteOptionsBase,
  ...deleteOpPropsNeverOmitted,
  noHook: false,
};

export const minimalOnDeleteOperationBase = {
  ...postBackendDeleteOpProperties,
  deleteAll: false,
};

export const onDeleteOperationBase = {
  ...minimalOnDeleteOperationBase,
  ...deleteOpPropsNeverOmitted,
};

// type Lookup<
//   OpName extends Document.Database.Internal.Operation,
//   DocName extends Document.Type,
//   Temporary extends boolean | undefined = boolean | undefined,
// > = Document.Database.Internal.Lookup<OpName, DocName, Temporary>;

// function buildCreateOperation<
//   DocName extends Document.Type,
//   OpName extends Document.Database.Internal.Operation,
//   Temporary extends boolean | undefined = boolean | undefined,
// >(
//   documentName: DocName,
//   operationName: OpName,
//   context: IntentionalPartial<Lookup<OpName, DocName, Temporary>>,
//   temporary: Temporary,
// ): Lookup<OpName, DocName, Temporary> {
//   const out = {};

//   return out as Lookup<OpName, DocName, Temporary>
// }
