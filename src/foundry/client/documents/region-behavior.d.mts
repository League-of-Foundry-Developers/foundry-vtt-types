import type { ConfiguredRegionBehavior } from "fvtt-types/configuration";
import type Document from "#common/abstract/document.d.mts";
import type BaseRegionBehavior from "#common/documents/region-behavior.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { InexactPartial, Merge } from "#utils";

import fields = foundry.data.fields;

declare namespace RegionBehavior {
  /**
   * The document's name.
   */
  type Name = "RegionBehavior";

  /**
   * The context used to create a `RegionBehavior`.
   */
  interface ConstructionContext extends Document.ConstructionContext<Parent> {}

  /**
   * The documents embedded within `RegionBehavior`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `RegionBehavior` document instance configured through `CONFIG.RegionBehavior.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredRegionBehavior | `fvtt-types/configuration/ConfiguredRegionBehavior`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `RegionBehavior` document configured through `CONFIG.RegionBehavior.documentClass` in Foundry and
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
        name: "RegionBehavior";
        collection: "behaviors";
        label: string;
        labelPlural: string;
        coreTypes: [
          "adjustDarknessLevel",
          "displayScrollingText",
          "executeMacro",
          "executeScript",
          "modifyMovementCost",
          "pauseGame",
          "suppressWeather",
          "teleportToken",
          "toggleBehavior",
        ];
        hasTypeData: true;
        isEmbedded: true;
        permissions: Metadata.Permissions;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation): boolean;
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
    }
  }

  /**
   * Allowed subtypes of `RegionBehavior`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.RegionBehavior.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"RegionBehavior">;

  /**
   * `ConfiguredSubTypes` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"RegionBehavior">;

  /**
   * `Known` represents the types of `RegionBehavior` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubTypes} for more information.
   */
  type Known = RegionBehavior.OfType<RegionBehavior.ConfiguredSubTypes>;

  /**
   * `OfType` returns an instance of `RegionBehavior` with the corresponding type. This works with both the
   * builtin `RegionBehavior` class or a custom subclass if that is set up in
   * {@link ConfiguredRegionBehavior | `fvtt-types/configuration/ConfiguredRegionBehavior`}.
   */
  type OfType<Type extends SubType> = Document.Internal.OfType<
    ConfiguredRegionBehavior<Type>,
    // eslint-disable-next-line @typescript-eslint/no-restricted-types
    () => RegionBehavior<Type>
  >;

  /**
   * `SystemOfType` returns the system property for a specific `RegionBehavior` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<_SystemMap, Type>;

  /**
   * @internal
   */
  interface _ModelMap extends Document.Internal.ModelMap<Name> {}

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<Name> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `RegionBehavior` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = RegionDocument.Implementation | null;

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
   * An instance of `RegionBehavior` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid extends Document.Internal.Invalid<Implementation> {}

  /**
   * An instance of `RegionBehavior` that comes from the database.
   */
  type Stored<SubType extends RegionBehavior.SubType = RegionBehavior.SubType> = Document.Internal.Stored<
    OfType<SubType>
  >;

  /**
   * The data put in {@link RegionBehavior._source | `RegionBehavior#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode RegionBehavior.create}
   * and {@link RegionBehavior | `new RegionBehavior(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link RegionBehavior.name | `RegionBehavior#name`}.
   *
   * This is data transformed from {@linkcode RegionBehavior.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link RegionBehavior.update | `RegionBehavior#update`}.
   * It is a distinct type from {@link RegionBehavior.CreateData | `DeepPartial<RegionBehavior.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode RegionBehavior}. This is the source of truth for how an RegionBehavior document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode RegionBehavior}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this RegionBehavior document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name used to describe the RegionBehavior
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: true; textSearch: true }>;

    /**
     * An RegionBehavior subtype which configures the system data model applied
     */
    type: fields.DocumentTypeField<
      typeof BaseRegionBehavior,
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      {},
      RegionBehavior.SubType,
      RegionBehavior.SubType,
      RegionBehavior.SubType
    >;

    /**
     * Data for a RegionBehavior subtype, defined by a System or Module
     */
    system: fields.TypeDataField<typeof BaseRegionBehavior>;

    /**
     * Is the RegionBehavior currently disabled?
     * @defaultValue `false`
     */
    disabled: fields.BooleanField;

    /**
     * An object of optional key/value flags
     */
    flags: fields.DocumentFlagsField<Name>;

    /**
     * An object of creation and access information
     * @defaultValue see {@linkcode fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }

  namespace Database {
    /** Options passed along in Get operations for RegionBehaviors */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<RegionBehavior.Parent> {}

    /** Options passed along in Create operations for RegionBehaviors */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<
        RegionBehavior.CreateData,
        RegionBehavior.Parent,
        Temporary
      > {}

    /** Options passed along in Delete operations for RegionBehaviors */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<RegionBehavior.Parent> {}

    /** Options passed along in Update operations for RegionBehaviors */
    interface Update
      extends foundry.abstract.types.DatabaseUpdateOperation<RegionBehavior.UpdateData, RegionBehavior.Parent> {}

    /** Operation for {@linkcode RegionBehavior.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<RegionBehavior.Database.Create<Temporary>> {}

    /** Operation for {@linkcode RegionBehavior.updateDocuments} */
    interface UpdateDocumentsOperation
      extends Document.Database.UpdateDocumentsOperation<RegionBehavior.Database.Update> {}

    /** Operation for {@linkcode RegionBehavior.deleteDocuments} */
    interface DeleteDocumentsOperation
      extends Document.Database.DeleteDocumentsOperation<RegionBehavior.Database.Delete> {}

    /** Operation for {@linkcode RegionBehavior.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<RegionBehavior.Database.Create<Temporary>> {}

    /** Operation for {@link RegionBehavior.update | `RegionBehavior#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode RegionBehavior.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link RegionBehavior._preCreate | `RegionBehavior#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link RegionBehavior._onCreate | `RegionBehavior#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode RegionBehavior._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<RegionBehavior.Database.Create> {}

    /** Operation for {@link RegionBehavior._onCreateOperation | `RegionBehavior#_onCreateOperation`} */
    interface OnCreateOperation extends RegionBehavior.Database.Create {}

    /** Options for {@link RegionBehavior._preUpdate | `RegionBehavior#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link RegionBehavior._onUpdate | `RegionBehavior#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode RegionBehavior._preUpdateOperation} */
    interface PreUpdateOperation extends RegionBehavior.Database.Update {}

    /** Operation for {@link RegionBehavior._onUpdateOperation | `RegionBehavior._preUpdateOperation`} */
    interface OnUpdateOperation extends RegionBehavior.Database.Update {}

    /** Options for {@link RegionBehavior._preDelete | `RegionBehavior#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link RegionBehavior._onDelete | `RegionBehavior#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link RegionBehavior._preDeleteOperation | `RegionBehavior#_preDeleteOperation`} */
    interface PreDeleteOperation extends RegionBehavior.Database.Delete {}

    /** Options for {@link RegionBehavior._onDeleteOperation | `RegionBehavior#_onDeleteOperation`} */
    interface OnDeleteOperation extends RegionBehavior.Database.Delete {}

    /** Context for {@linkcode RegionBehavior._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<RegionBehavior.Parent> {}

    /** Context for {@linkcode RegionBehavior._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<RegionBehavior.Parent> {}

    /** Context for {@linkcode RegionBehavior._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<RegionBehavior.Parent> {}

    /**
     * Options for {@link RegionBehavior._preCreateDescendantDocuments | `RegionBehavior#_preCreateDescendantDocuments`}
     * and {@link RegionBehavior._onCreateDescendantDocuments | `RegionBehavior#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<RegionBehavior.Database.Create> {}

    /**
     * Options for {@link RegionBehavior._preUpdateDescendantDocuments | `RegionBehavior#_preUpdateDescendantDocuments`}
     * and {@link RegionBehavior._onUpdateDescendantDocuments | `RegionBehavior#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<RegionBehavior.Database.Update> {}

    /**
     * Options for {@link RegionBehavior._preDeleteDescendantDocuments | `RegionBehavior#_preDeleteDescendantDocuments`}
     * and {@link RegionBehavior._onDeleteDescendantDocuments | `RegionBehavior#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<RegionBehavior.Database.Delete> {}

    /**
     * Create options for {@linkcode RegionBehavior.createDialog}.
     */
    interface DialogCreateOptions extends InexactPartial<Create> {}
  }

  /**
   * If `Temporary` is true then `RegionBehavior.Implementation`, otherwise `RegionBehavior.Stored`.
   */
  type TemporaryIf<Temporary extends boolean | undefined> = true extends Temporary
    ? RegionBehavior.Implementation
    : RegionBehavior.Stored;

  /**
   * The flags that are available for this document in the form `{ [scope: string]: { [key: string]: unknown } }`.
   */
  interface Flags extends Document.Internal.ConfiguredFlagsForName<Name> {}

  namespace Flags {
    /**
     * The valid scopes for the flags on this document e.g. `"core"` or `"dnd5e"`.
     */
    type Scope = Document.Internal.FlagKeyOf<Flags>;

    /**
     * The valid keys for a certain scope for example if the scope is "core" then a valid key may be `"sheetLock"` or `"viewMode"`.
     */
    type Key<Scope extends Flags.Scope> = Document.Internal.FlagKeyOf<Document.Internal.FlagGetKey<Flags, Scope>>;

    /**
     * Gets the type of a particular flag given a `Scope` and a `Key`.
     */
    type Get<Scope extends Flags.Scope, Key extends Flags.Key<Scope>> = Document.Internal.GetFlag<Flags, Scope, Key>;
  }

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, NonNullable<Parent>> {}

  interface CreateDialogData extends Document.CreateDialogData<CreateData> {}
  interface CreateDialogOptions extends Document.CreateDialogOptions<Name> {}

  /**
   * The arguments to construct the document.
   *
   * @deprecated Writing the signature directly has helped reduce circularities and therefore is
   * now recommended.
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;
}

/**
 * The client-side RegionBehavior document which extends the common BaseRegionBehavior model.
 */
declare class RegionBehavior<
  out SubType extends RegionBehavior.SubType = RegionBehavior.SubType,
> extends BaseRegionBehavior.Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `RegionBehavior`
   * @param context - Construction context options
   */
  constructor(data: RegionBehavior.CreateData, context?: RegionBehavior.ConstructionContext);

  /** A convenience reference to the RegionDocument which contains this RegionBehavior. */
  get region(): RegionDocument.Implementation | null;

  /** A convenience reference to the Scene which contains this RegionBehavior. */
  get scene(): Scene.Implementation | null;

  /** A RegionBehavior is active if and only if it was created, hasn't been deleted yet, and isn't disabled. */
  get active(): boolean;

  /** A RegionBehavior is viewed if and only if it is active and the Scene of its Region is viewed. */
  get viewed(): boolean;

  override prepareBaseData(): void;

  /**
   * Does this RegionBehavior handle the Region events with the given name?
   * @param eventName - The Region event name
   */
  hasEvent(eventName: string): boolean;

  /**
   * Handle the Region Event.
   * @param event - The Region event
   * @internal
   */
  protected _handleRegionEvent(event: RegionDocument.RegionEvent): void;

  /**
   * @remarks `createOptions` must contain a `pack` or `parent`.
   *
   * Also this override removes `executeScript` from `options.types` if the user lacks the `MACRO_SCRIPT` permission
   */
  static override createDialog(
    data: RegionBehavior.CreateDialogData | undefined,
    createOptions: RegionBehavior.Database.DialogCreateOptions,
    dialogoptions?: RegionBehavior.CreateDialogOptions,
  ): Promise<RegionBehavior.Stored | null | undefined>;

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

  // Descendant Document operations have been left out because RegionBehavior does not have any descendant documents.

  /** @remarks `context` must contain a `pack` or `parent`. */
  static override defaultName(context: RegionBehavior.DefaultNameContext): string;

  override deleteDialog(
    options?: InexactPartial<foundry.applications.api.DialogV2.ConfirmConfig>,
    operation?: Document.Database.DeleteOperationForName<"RegionBehavior">,
  ): Promise<this | false | null | undefined>;

  static override fromDropData(
    data: RegionBehavior.DropData,
    options?: RegionBehavior.DropDataOptions,
  ): Promise<RegionBehavior.Implementation | undefined>;

  static override fromImport(
    source: RegionBehavior.Source,
    context?: Document.FromImportContext<RegionBehavior.Parent> | null,
  ): Promise<RegionBehavior.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;

  // Embedded document operations have been left out because RegionBehavior does not have any embedded documents.
}

export default RegionBehavior;
