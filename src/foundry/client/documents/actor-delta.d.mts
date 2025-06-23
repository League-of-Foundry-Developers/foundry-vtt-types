import type { DataSchema } from "#common/data/fields.d.mts";
import type { BaseActorDelta } from "#common/documents/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { ConfiguredActorDelta } from "fvtt-types/configuration";
import type { Identity, Merge, NullishProps, RequiredProps } from "#utils";
import type DataModel from "#common/abstract/data.d.mts";

import fields = foundry.data.fields;

declare namespace ActorDelta {
  /**
   * The document's name.
   */
  type Name = "ActorDelta";

  /**
   * The arguments to construct the document.
   * @privateRemarks This is off-template, as ActorDelta throws if not provided a valid TokenDocument
   * parent in the construction context for any construction, not just `.create`ion
   */
  interface ConstructorArgs
    extends Identity<
      [
        data: CreateData | undefined,
        context: RequiredProps<Document.ConstructionContext<TokenDocument.Implementation>, "parent">,
      ]
    > {}

  /**
   * The documents embedded within `ActorDelta`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `ActorDelta` document instance configured through `CONFIG.ActorDelta.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredActorDelta | `fvtt-types/configuration/ConfiguredActorDelta`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `ActorDelta` document configured through `CONFIG.ActorDelta.documentClass` in Foundry and
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
        name: "ActorDelta";
        collection: "delta";
        label: string;
        labelPlural: string;
        isEmbedded: true;
        embedded: Metadata.Embedded;
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The embedded metadata
     */
    interface Embedded {
      Item: "items";
      ActiveEffect: "effects";
    }
  }

  /**
   * Allowed subtypes of `ActorDelta`. Due to the implementation of the `ActorDelta` document,
   * the SubType is the same as the `Actor`'s SubType.
   *
   * {@linkcode Actor.SubType}
   */
  type SubType = Actor.SubType;

  /**
   * `ConfiguredSubTypes` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@linkcode ActorDelta.SubType} for more information.
   */
  type ConfiguredSubTypes = Actor.SubType;

  /**
   * `Known` represents the types of `ActorDelta` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubTypes} for more information.
   */
  type Known = ActorDelta.OfType<ActorDelta.ConfiguredSubTypes>;

  /**
   * `OfType` returns an instance of `ActorDelta` with the corresponding type. This works with both the
   * builtin `ActorDelta` class or a custom subclass if that is set up in
   * {@link ConfiguredActorDelta | `fvtt-types/configuration/ConfiguredActorDelta`}.
   */
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredActorDelta<Type>, () => ActorDelta<Type>>;

  /**
   * `SystemOfType` returns the system property for a specific `ActorDelta` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<_SystemMap, Type>;

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<"ActorDelta"> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = TokenDocument.Implementation | null;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type DirectDescendant = Item.Stored | ActiveEffect.Stored;

  /**
   * A document's direct descendants are documents that are contained directly within its schema.
   * This is a union of all such classes, or never if the document doesn't have any descendants.
   */
  type DirectDescendantClass = Item.ImplementationClass | ActiveEffect.ImplementationClass;

  /**
   * A document's descendants are any documents that are contained within, either within its schema
   * or its descendant's schemas.
   * This is a union of all such instances, or never if the document doesn't have any descendants.
   */
  type Descendant = DirectDescendant | Item.Descendant;

  /**
   * A document's descendants are any child documents, grandchild documents, etc.
   * This is a union of all classes, or never if the document doesn't have any descendants.
   */
  type DescendantClass = DirectDescendantClass | Item.DescendantClass;

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
  type Embedded = Document.ImplementationFor<Embedded.Name>;

  namespace Embedded {
    /**
     * An embedded document is a document contained in another.
     * For example an `Item` can be contained by an `Actor` which means `Item` can be embedded in `Actor`.
     *
     * If this is `never` it is because there are no embeddable documents (or there's a bug!).
     */
    type Name = keyof Metadata.Embedded;

    /**
     * Gets the collection name for an embedded document.
     */
    type CollectionNameOf<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionNameFor<
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * Gets the collection document for an embedded document.
     */
    // TODO(LukeAbby): There's a circularity. Should be `Document.Embedded.CollectionDocumentFor<Metadata.Embedded, CollectionName>`
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type DocumentFor<CollectionName extends Embedded.CollectionName> = Document.Any;

    /**
     * Gets the collection for an embedded document.
     */
    type CollectionFor<CollectionName extends Embedded.CollectionName> = Document.Embedded.CollectionFor<
      // TODO(LukeAbby): This should be `TokenDocument.Implementation` but this causes a circularity.
      Document.Any,
      Metadata.Embedded,
      CollectionName
    >;

    /**
     * A valid name to refer to a collection embedded in this document. For example an `Actor`
     * has the key `"items"` which contains `Item` instance which would make both `"Item" | "Items"`
     * valid keys (amongst others).
     */
    type CollectionName = Document.Embedded.CollectionName<Metadata.Embedded>;
  }

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
   * An instance of `ActorDelta` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid extends Document.Internal.Invalid<ActorDelta.Implementation> {}

  /**
   * An instance of `ActorDelta` that comes from the database.
   */
  type Stored = Document.Internal.Stored<ActorDelta.Implementation>;

  /**
   * The data put in {@link ActorDelta._source | `ActorDelta#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode ActorDelta.create}
   * and {@link ActorDelta | `new ActorDelta(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link ActorDelta.name | `ActorDelta#name`}.
   *
   * This is data transformed from {@linkcode ActorDelta.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link ActorDelta.update | `ActorDelta#update`}.
   * It is a distinct type from {@link ActorDelta.CreateData | `DeepPartial<ActorDelta.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode ActorDelta}. This is the source of truth for how an ActorDelta document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode ActorDelta}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this ActorDelta document.
     */
    _id: fields.DocumentIdField;

    /**
     * The name override, if any.
     * @defaultValue `null`
     */
    name: fields.StringField<{ required: false; nullable: true; initial: null }>;

    /**
     * The type override, if any.
     * @defaultValue `null`
     */
    type: fields.StringField<{ required: false; nullable: true; initial: null }>;

    /**
     * The image override, if any.
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: ["IMAGE"]; nullable: true; initial: null; required: false }>;

    /**
     * The system data model override.
     */
    system: fields.ObjectField;

    /**
     * An array of embedded item data overrides.
     */
    items: fields.EmbeddedCollectionDeltaField<typeof foundry.documents.BaseItem, ActorDelta.Implementation>;

    /**
     * An array of embedded active effect data overrides.
     */
    effects: fields.EmbeddedCollectionDeltaField<typeof foundry.documents.BaseActiveEffect, ActorDelta.Implementation>;

    /**
     * Ownership overrides.
     * @defaultValue `null`
     */
    ownership: fields.DocumentOwnershipField<{ required: false; nullable: true; initial: null }>;

    /**
     * An object of actor flag overrides.
     */
    flags: fields.DocumentFlagsField<"Actor">;
  }

  namespace Database {
    /** Options passed along in Get operations for ActorDeltas */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<ActorDelta.Parent> {}

    /** Options passed along in Create operations for ActorDeltas */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<ActorDelta.CreateData, ActorDelta.Parent, Temporary> {}

    /** Options passed along in Delete operations for ActorDeltas */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<ActorDelta.Parent> {}

    /** Options passed along in Update operations for ActorDeltas */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<ActorDelta.UpdateData, ActorDelta.Parent> {}

    /** Operation for {@linkcode ActorDelta.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<ActorDelta.Database.Create<Temporary>> {}

    /** Operation for {@linkcode ActorDelta.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<ActorDelta.Database.Update> {}

    /** Operation for {@linkcode ActorDelta.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<ActorDelta.Database.Delete> {}

    /** Operation for {@linkcode ActorDelta.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<ActorDelta.Database.Create<Temporary>> {}

    /** Operation for {@link ActorDelta.update | `ActorDelta#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode ActorDelta.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link ActorDelta._preCreate | `ActorDelta#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link ActorDelta._onCreate | `ActorDelta#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode ActorDelta._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<ActorDelta.Database.Create> {}

    /** Operation for {@link ActorDelta._onCreateOperation | `ActorDelta#_onCreateOperation`} */
    interface OnCreateOperation extends ActorDelta.Database.Create {}

    /** Options for {@link ActorDelta._preUpdate | `ActorDelta#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link ActorDelta._onUpdate | `ActorDelta#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode ActorDelta._preUpdateOperation} */
    interface PreUpdateOperation extends ActorDelta.Database.Update {}

    /** Operation for {@link ActorDelta._onUpdateOperation | `ActorDelta._preUpdateOperation`} */
    interface OnUpdateOperation extends ActorDelta.Database.Update {}

    /** Options for {@link ActorDelta._preDelete | `ActorDelta#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link ActorDelta._onDelete | `ActorDelta#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link ActorDelta._preDeleteOperation | `ActorDelta#_preDeleteOperation`} */
    interface PreDeleteOperation extends ActorDelta.Database.Delete {}

    /** Options for {@link ActorDelta._onDeleteOperation | `ActorDelta#_onDeleteOperation`} */
    interface OnDeleteOperation extends ActorDelta.Database.Delete {}

    /** Context for {@linkcode ActorDelta._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<ActorDelta.Parent> {}

    /** Context for {@linkcode ActorDelta._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<ActorDelta.Parent> {}

    /** Context for {@linkcode ActorDelta._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<ActorDelta.Parent> {}

    /**
     * Options for {@link ActorDelta._preCreateDescendantDocuments | `ActorDelta#_preCreateDescendantDocuments`}
     * and {@link ActorDelta._onCreateDescendantDocuments | `ActorDelta#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<ActorDelta.Database.Create> {}

    /**
     * Options for {@link ActorDelta._preUpdateDescendantDocuments | `ActorDelta#_preUpdateDescendantDocuments`}
     * and {@link ActorDelta._onUpdateDescendantDocuments | `ActorDelta#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<ActorDelta.Database.Update> {}

    /**
     * Options for {@link ActorDelta._preDeleteDescendantDocuments | `ActorDelta#_preDeleteDescendantDocuments`}
     * and {@link ActorDelta._onDeleteDescendantDocuments | `ActorDelta#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<ActorDelta.Database.Delete> {}
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

  type PreCreateDescendantDocumentsArgs =
    | Document.PreCreateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendant,
        ActorDelta.Metadata.Embedded
      >
    | Item.PreCreateDescendantDocumentsArgs;

  type OnCreateDescendantDocumentsArgs =
    | Document.OnCreateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendant,
        ActorDelta.Metadata.Embedded
      >
    | Item.OnCreateDescendantDocumentsArgs;

  type PreUpdateDescendantDocumentsArgs =
    | Document.PreUpdateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendant,
        ActorDelta.Metadata.Embedded
      >
    | Item.PreUpdateDescendantDocumentsArgs;

  type OnUpdateDescendantDocumentsArgs =
    | Document.OnUpdateDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendant,
        ActorDelta.Metadata.Embedded
      >
    | Item.OnUpdateDescendantDocumentsArgs;

  type PreDeleteDescendantDocumentsArgs =
    | Document.PreDeleteDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendant,
        ActorDelta.Metadata.Embedded
      >
    | Item.PreDeleteDescendantDocumentsArgs;

  type OnDeleteDescendantDocumentsArgs =
    | Document.OnDeleteDescendantDocumentsArgs<
        ActorDelta.Stored,
        ActorDelta.DirectDescendant,
        ActorDelta.Metadata.Embedded
      >
    | Item.OnDeleteDescendantDocumentsArgs;

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  /** @internal */
  type _InitializeOptions = NullishProps<{
    /**
     * @remarks Is this initialization part of a {@link Scene.reset | `Scene#reset`} call? (skips further initialization if truthy)
     * @defaultValue `false`
     */
    sceneReset: boolean;
  }>;

  interface InitializeOptions extends Document.InitializeOptions, _InitializeOptions {}
}

/**
 * The client-side ActorDelta embedded document which extends the common BaseActorDelta document model.
 * @see {@linkcode TokenDocument}  The TokenDocument document type which contains ActorDelta embedded documents.
 */
declare class ActorDelta<out SubType extends ActorDelta.SubType = ActorDelta.SubType> extends BaseActorDelta.Internal
  .ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `ActorDelta`
   * @param context - Construction context options
   */
  constructor(...args: ActorDelta.ConstructorArgs);

  // options: not null (parameter default only, destructured in super)
  protected override _configure(options?: Document.ConfigureOptions): void;

  // options: not null (destructured)
  protected override _initialize(options?: ActorDelta.InitializeOptions): void;

  /** Pass-through the type from the synthetic Actor, if it exists. */
  _type: string;

  /**
   * Apply this ActorDelta to the base Actor and return a synthetic Actor.
   * @param context - Context to supply to synthetic Actor instantiation.
   * @remarks Forwards `context` to {@link BaseActorDelta.applyDelta | `this.constructor.applyDelta(this, this.parent.baseActor, context)`}
   */
  apply(context?: BaseActorDelta.ApplyDeltaContext | null): Actor.Implementation | null;

  /** @remarks `"The synthetic actor prepares its items in the appropriate context of an actor. The actor delta does not need to prepare its items, and would do so in the incorrect context."` */
  override prepareEmbeddedDocuments(): void;

  // TODO: accurately type changes and return type
  // changes, options: not null (parameter default only)
  override updateSource(
    // Note(LukeAbby): This must be valid for both `new ActorDelta.implementation(actorChanges, { parent: this.parent });` and `super.updateSource`.
    // However it's likely the overlap between these two types is pretty high.
    changes?: ActorDelta.Source,
    options?: DataModel.UpdateOptions,
  ): object;

  override reset(): void;

  /**
   * Generate a synthetic Actor instance when constructed, or when the represented Actor, or actorLink status changes.
   */
  protected _createSyntheticActor(options?: {
    /**
     * Whether to fully re-initialize this ActorDelta's collections in
     * order to re-retrieve embedded Documents from the synthetic
     * Actor.
     */
    reinitializeCollections: boolean;
  }): void;

  /**
   * Update the synthetic Actor instance with changes from the delta or the base Actor.
   */
  updateSyntheticActor(): void;

  /**
   * Restore this delta to empty, inheriting all its properties from the base actor.
   * @returns The restored synthetic Actor.
   */
  restore(): Promise<Actor.Implementation>;

  /**
   * Ensure that the embedded collection delta is managing any entries that have had their descendants updated.
   * @param doc - The parent whose immediate children have been modified.
   */
  _handleDeltaCollectionUpdates(doc: Document.Any): void;

  // _onUpdate and _onDelete are all overridden but with no signature changes from BaseActorDelta.

  protected override _dispatchDescendantDocumentEvents(
    event: ClientDocument.LifeCycleEventName,
    collection: string,
    args: unknown[],
    _parent: ClientDocument,
  ): void;

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

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class SwadeActorDelta extends ActorDelta {
   *   protected override _preCreateDescendantDocuments(...args: ActorDelta.PreCreateDescendantDocumentsArgs) {
   *     super._preCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, data, options, userId] = args;
   *     if (collection === "items") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preCreateDescendantDocuments(...args: ActorDelta.PreCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class GurpsActorDelta extends ActorDelta {
   *   protected override _onCreateDescendantDocuments(...args: ActorDelta.OnCreateDescendantDocumentsArgs) {
   *     super._onCreateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, data, options, userId] = args;
   *     if (collection === "items") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onCreateDescendantDocuments(...args: ActorDelta.OnCreateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class LancerActorDelta extends ActorDelta {
   *   protected override _preUpdateDescendantDocuments(...args: ActorDelta.OnUpdateDescendantDocuments) {
   *     super._preUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, changes, options, userId] = args;
   *     if (collection === "items") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preUpdateDescendantDocuments(...args: ActorDelta.PreUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class Ptr2eActorDelta extends ActorDelta {
   *   protected override _onUpdateDescendantDocuments(...args: ActorDelta.OnUpdateDescendantDocumentsArgs) {
   *     super._onUpdateDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, changes, options, userId] = args;
   *     if (collection === "items") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onUpdateDescendantDocuments(...args: ActorDelta.OnUpdateDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class KultActorDelta extends ActorDelta {
   *   protected override _preDeleteDescendantDocuments(...args: ActorDelta.PreDeleteDescendantDocumentsArgs) {
   *     super._preDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, ids, options, userId] = args;
   *     if (collection === "items") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _preDeleteDescendantDocuments(...args: ActorDelta.PreDeleteDescendantDocumentsArgs): void;

  /**
   * @remarks To make it possible for narrowing one parameter to jointly narrow other parameters
   * this method must be overridden like so:
   * ```typescript
   * class BladesActorDelta extends ActorDelta {
   *   protected override _onDeleteDescendantDocuments(...args: ActorDelta.OnUpdateDescendantDocuments) {
   *     super._onDeleteDescendantDocuments(...args);
   *
   *     const [parent, collection, documents, ids, options, userId] = args;
   *     if (collection === "items") {
   *         options; // Will be narrowed.
   *     }
   *   }
   * }
   * ```
   */
  protected override _onDeleteDescendantDocuments(...args: ActorDelta.OnDeleteDescendantDocumentsArgs): void;

  // context: not null (destructured)
  static override defaultName(
    context?: Document.DefaultNameContext<"ActorDelta", NonNullable<ActorDelta.Parent>>,
  ): string;

  /** @remarks `context.parent` is required as creation requires one */
  static override createDialog(
    data: Document.CreateDialogData<ActorDelta.CreateData> | undefined,
    context: Document.CreateDialogContext<"ActorDelta", NonNullable<ActorDelta.Parent>>,
  ): Promise<ActorDelta.Stored | null | undefined>;

  // options: not null (parameter default only)
  static override fromDropData(
    data: ActorDelta.DropData,
    options?: ActorDelta.DropDataOptions,
  ): Promise<ActorDelta.Implementation | undefined>;

  static override fromImport(
    source: ActorDelta.Source,
    context?: Document.FromImportContext<ActorDelta.Parent> | null,
  ): Promise<ActorDelta.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default ActorDelta;
