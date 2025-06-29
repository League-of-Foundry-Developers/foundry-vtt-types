import type { InexactPartial, InterfaceToObject, Merge } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { LightData } from "#common/data/data.mjs";
import type BaseAmbientLight from "#common/documents/ambient-light.mjs";

import fields = foundry.data.fields;

declare namespace AmbientLightDocument {
  /**
   * The document's name.
   */
  type Name = "AmbientLight";

  /**
   * The context used to create an `AmbientLightDocument`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `AmbientLight`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `AmbientLightDocument` document instance configured through `CONFIG.AmbientLight.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `AmbientLightDocument` document configured through `CONFIG.AmbientLight.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} in fvtt-types.
   */
  type ImplementationClass = Document.ImplementationClassFor<Name>;

  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  interface Metadata
    extends Merge<
      Document.Metadata.Default,
      Readonly<{
        name: "AmbientLight";
        collection: "lights";
        label: string;
        labelPlural: string;
        schemaVersion: string;
      }>
    > {}

  // No need for Metadata namespace

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Scene.Implementation | null;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all instances, or never if the document doesn't have any descendants.
   */
  type Descendant = never;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = never;

  /**
   * Types of `CompendiumCollection` this document might be contained in.
   * Note that `this.pack` will always return a string; this is the type for `game.packs.get(this.pack)`
   *
   * Will be `never` if cannot be contained in a `CompendiumCollection`.
   */
  // Note: Takes any document in the heritage chain (i.e. itself or any parent, transitive or not) that can be contained in a compendium.
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Scene">;

  /**
   * An embedded document is a document contained in another.
   * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
   *
   * If this is `never` it is because there are no embeddable documents (or there's a bug!).
   */
  type Embedded = never;

  /**
   * The name of the world or embedded collection this document can find itself in.
   * For example an `Item` is always going to be inside a collection with a key of `items`.
   * This is a fixed string per document type and is primarily useful for {@link ClientDocumentMixin | `Descendant Document Events`}.
   */
  type ParentCollectionName = Metadata["collection"];

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type CollectionClass = never;

  /**
   * The world collection that contains this document type. Will be `never` if none exists.
   */
  type Collection = never;

  /**
   * An instance of `AmbientLightDocument` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid extends Document.Internal.Invalid<AmbientLightDocument.Implementation> {}

  /**
   * An instance of `AmbientLightDocument` that comes from the database.
   */
  type Stored = Document.Internal.Stored<AmbientLightDocument.Implementation>;

  /**
   * The data put in {@link AmbientLightDocument._source | `AmbientLightDocument#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode AmbientLightDocument.create}
   * and {@link AmbientLightDocument | `new AmbientLightDocument(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link AmbientLightDocument.name | `AmbientLightDocument#name`}.
   *
   * This is data transformed from {@linkcode AmbientLightDocument.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link AmbientLightDocument.update | `AmbientLightDocument#update`}.
   * It is a distinct type from {@link AmbientLightDocument.CreateData | `DeepPartial<AmbientLightDocument.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode AmbientLightDocument}. This is the source of truth for how an AmbientLightDocument document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode AmbientLightDocument}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseAmbientLight embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The x-coordinate position of the origin of the light
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The y-coordinate position of the origin of the light
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0 }>;

    /**
     * The elevation of the sound
     * @defaultValue `0`
     */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /**
     * The angle of rotation for the tile between 0 and 360
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * Whether or not this light source is constrained by Walls
     * @defaultValue `true`
     */
    walls: fields.BooleanField<{ initial: true }>;

    /**
     * Whether or not this light source provides a source of vision
     * @defaultValue `false`
     */
    vision: fields.BooleanField;

    /**
     * Light configuration data
     * @defaultValue see {@linkcode LightData}
     */
    config: fields.EmbeddedDataField<typeof LightData>;

    /**
     * Is the light source currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.DocumentFlagsField<Name, InterfaceToObject<CoreFlags>>;
  }

  namespace Database {
    /** Options passed along in Get operations for AmbientLightDocuments */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<AmbientLightDocument.Parent> {}

    /** Options passed along in Create operations for AmbientLightDocuments */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<
        AmbientLightDocument.CreateData,
        AmbientLightDocument.Parent,
        Temporary
      > {}

    /** Options passed along in Delete operations for AmbientLightDocuments */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<AmbientLightDocument.Parent> {}

    /** Options passed along in Update operations for AmbientLightDocuments */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<
        AmbientLightDocument.UpdateData,
        AmbientLightDocument.Parent
      > {
      animate?: boolean;
    }

    /** Operation for {@linkcode AmbientLightDocument.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<AmbientLightDocument.Database.Create<Temporary>> {}

    /** Operation for {@linkcode AmbientLightDocument.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<AmbientLightDocument.Database.Update> {}

    /** Operation for {@linkcode AmbientLightDocument.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<AmbientLightDocument.Database.Delete> {}

    /** Operation for {@linkcode AmbientLightDocument.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<AmbientLightDocument.Database.Create<Temporary>> {}

    /** Operation for {@link AmbientLightDocument.update | `AmbientLightDocument#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode AmbientLightDocument.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link AmbientLightDocument._preCreate | `AmbientLightDocument#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link AmbientLightDocument._onCreate | `AmbientLightDocument#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode AmbientLightDocument._preCreateOperation} */
    interface PreCreateOperation
      extends Document.Database.PreCreateOperationStatic<AmbientLightDocument.Database.Create> {}

    /** Operation for {@link AmbientLightDocument._onCreateOperation | `AmbientLightDocument#_onCreateOperation`} */
    interface OnCreateOperation extends AmbientLightDocument.Database.Create {}

    /** Options for {@link AmbientLightDocument._preUpdate | `AmbientLightDocument#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link AmbientLightDocument._onUpdate | `AmbientLightDocument#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode AmbientLightDocument._preUpdateOperation} */
    interface PreUpdateOperation extends AmbientLightDocument.Database.Update {}

    /** Operation for {@link AmbientLightDocument._onUpdateOperation | `AmbientLightDocument._preUpdateOperation`} */
    interface OnUpdateOperation extends AmbientLightDocument.Database.Update {}

    /** Options for {@link AmbientLightDocument._preDelete | `AmbientLightDocument#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link AmbientLightDocument._onDelete | `AmbientLightDocument#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link AmbientLightDocument._preDeleteOperation | `AmbientLightDocument#_preDeleteOperation`} */
    interface PreDeleteOperation extends AmbientLightDocument.Database.Delete {}

    /** Options for {@link AmbientLightDocument._onDeleteOperation | `AmbientLightDocument#_onDeleteOperation`} */
    interface OnDeleteOperation extends AmbientLightDocument.Database.Delete {}

    /** Context for {@linkcode AmbientLightDocument._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<AmbientLightDocument.Parent> {}

    /** Context for {@linkcode AmbientLightDocument._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<AmbientLightDocument.Parent> {}

    /** Context for {@linkcode AmbientLightDocument._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<AmbientLightDocument.Parent> {}

    /**
     * Options for {@link AmbientLightDocument._preCreateDescendantDocuments | `AmbientLightDocument#_preCreateDescendantDocuments`}
     * and {@link AmbientLightDocument._onCreateDescendantDocuments | `AmbientLightDocument#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<AmbientLightDocument.Database.Create> {}

    /**
     * Options for {@link AmbientLightDocument._preUpdateDescendantDocuments | `AmbientLightDocument#_preUpdateDescendantDocuments`}
     * and {@link AmbientLightDocument._onUpdateDescendantDocuments | `AmbientLightDocument#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<AmbientLightDocument.Database.Update> {}

    /**
     * Options for {@link AmbientLightDocument._preDeleteDescendantDocuments | `AmbientLightDocument#_preDeleteDescendantDocuments`}
     * and {@link AmbientLightDocument._onDeleteDescendantDocuments | `AmbientLightDocument#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<AmbientLightDocument.Database.Delete> {}
  }

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.FlagKeyOf<Document.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.GetFlag<Name, Scope, Key>;
  }

  interface CoreFlags {
    core?: {
      /** @remarks If provided, will be used for any light animations emanating from this token */
      animationSeed?: number;
    };
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, NonNullable<Parent>> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated - Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side AmbientLight document which extends the common BaseAmbientLight model.
 *
 * @see {@linkcode Scene}                     The Scene document type which contains AmbientLight documents
 * @see {@linkcode AmbientLightConfig}        The AmbientLight configuration application
 */
declare class AmbientLightDocument extends BaseAmbientLight.Internal.CanvasDocument {
  /**
   * @param data    - Initial data from which to construct the `AmbientLightDocument`
   * @param context - Construction context options
   */
  constructor(
    // Note(LukeAbby): Optional as there are currently no required properties on `CreateData`.
    data?: AmbientLightDocument.CreateData,
    context?: AmbientLightDocument.ConstructionContext,
  );

  // _onUpdate is overridden but with no signature changes from its implementation in BaseAmbientLight.

  /**
   * Is this ambient light source global in nature?
   */
  get isGlobal(): boolean;

  /*
   * After this point these are not really overridden methods.
   * They are here because Foundry's documents are complex and have lots of edge cases.
   * There are DRY ways of representing this but this ends up being harder to understand
   * for end users extending these functions, especially for static methods. There are also a
   * number of methods that don't make sense to call directly on `Document` like `createDocuments`,
   * as there is no data that can safely construct every possible document. Finally keeping definitions
   * separate like this helps against circularities.
   */

  // ClientDocument overrides

  // Descendant Document operations have been left out because AmbientLight does not have any descendant documents.

  // context: not null (destructured)
  static override defaultName(
    context?: AmbientLightDocument.DefaultNameContext,
  ): string;

  /** @remarks `context.parent` is required as creation requires one */
  static override createDialog(
    data: AmbientLightDocument.CreateDialogData | undefined,
    createOptions?: AmbientLightDocument.Database.CreateOptions,
    options?: AmbientLightDocument.CreateDialogOptions,
  ): Promise<AmbientLightDocument.Stored | null | undefined>;

  override deleteDialog(
      options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
      operation?: Document.Database.DeleteOperationForName<"AmbientLight">
    ): Promise<this | false | null | undefined>;

  // options: not null (parameter default only)
  static override fromDropData(
    data: AmbientLightDocument.DropData,
    options?: AmbientLightDocument.DropDataOptions,
  ): Promise<AmbientLightDocument.Implementation | undefined>;

  static override fromImport(
    source: AmbientLightDocument.Source,
    context?: Document.FromImportContext<AmbientLightDocument.Parent> | null,
  ): Promise<AmbientLightDocument.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default AmbientLightDocument;
