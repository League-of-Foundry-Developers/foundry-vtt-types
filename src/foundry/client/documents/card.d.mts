import type { ConfiguredCard } from "fvtt-types/configuration";
import type { AnyObject, DeepPartial, Merge } from "#utils";
import type { documents } from "#client/client.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type BaseCard from "#common/documents/card.d.mts";

import fields = foundry.data.fields;

declare namespace Card {
  /**
   * The document's name.
   */
  type Name = "Card";

  /**
   * The arguments to construct the document.
   */
  type ConstructorArgs = Document.ConstructorParameters<CreateData, Parent>;

  /**
   * The documents embedded within `Card`.
   */
  type Hierarchy = Readonly<Document.HierarchyOf<Schema>>;

  /**
   * The implementation of the `Card` document instance configured through `CONFIG.Card.documentClass` in Foundry and
   * {@linkcode DocumentClassConfig} or {@link ConfiguredCard | `fvtt-types/configuration/ConfiguredCard`} in fvtt-types.
   */
  type Implementation = Document.ImplementationFor<Name>;

  /**
   * The implementation of the `Card` document configured through `CONFIG.Card.documentClass` in Foundry and
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
        name: "Card";
        collection: "cards";
        hasTypeData: true;
        indexed: true;
        label: string;
        labelPlural: string;
        permissions: Metadata.Permissions;
        compendiumIndexFields: ["name", "type", "suit", "sort"];
        schemaVersion: string;
      }>
    > {}

  namespace Metadata {
    /**
     * The permissions for whether a certain user can create, update, or delete this document.
     */
    interface Permissions {
      create(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      update(user: User.Internal.Implementation, doc: Implementation, data: UpdateData): boolean;
      delete: "OWNER";
    }
  }

  /**
   * Allowed subtypes of `Card`. This is configured through various methods. Modern Foundry
   * recommends registering using [Data Models](https://foundryvtt.com/article/system-data-models/)
   * under {@linkcode CONFIG.Card.dataModels}. This corresponds to
   * fvtt-type's {@linkcode DataModelConfig}.
   *
   * Subtypes can also be registered through a `template.json` though this is discouraged.
   * The corresponding fvtt-type configs are {@linkcode SourceConfig} and
   * {@linkcode DataConfig}.
   */
  type SubType = foundry.Game.Model.TypeNames<"Card">;

  /**
   * `ConfiguredSubTypes` represents the subtypes a user explicitly registered. This excludes
   * subtypes like the Foundry builtin subtype `"base"` and the catch-all subtype for arbitrary
   * module subtypes `${string}.${string}`.
   *
   * @see {@link SubType} for more information.
   */
  type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"Card">;

  /**
   * `Known` represents the types of `Card` that a user explicitly registered.
   *
   * @see {@link ConfiguredSubTypes} for more information.
   */
  type Known = Card.OfType<Card.ConfiguredSubTypes>;

  /**
   * `OfType` returns an instance of `Card` with the corresponding type. This works with both the
   * builtin `Card` class or a custom subclass if that is set up in
   * {@link ConfiguredCard | `fvtt-types/configuration/ConfiguredCard`}.
   */
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredCard<Type>, () => Card<Type>>;

  /**
   * `SystemOfType` returns the system property for a specific `Card` subtype.
   */
  type SystemOfType<Type extends SubType> = Document.Internal.SystemOfType<_SystemMap, Type>;

  /**
   * @internal
   */
  interface _SystemMap extends Document.Internal.SystemMap<"Card"> {}

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Cards.Implementation | null;

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
  type Pack = foundry.documents.collections.CompendiumCollection.ForDocument<"Cards">;

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
   * An instance of `Card` that comes from the database but failed validation meaning that
   * its `system` and `_source` could theoretically be anything.
   */
  interface Invalid<out SubType extends Card.SubType = Card.SubType>
    extends Document.Internal.Invalid<OfType<SubType>> {}

  /**
   * An instance of `Card` that comes from the database.
   */
  interface Stored<out SubType extends Card.SubType = Card.SubType> extends Document.Internal.Stored<OfType<SubType>> {}

  /**
   * The data put in {@link Card._source | `Card#_source`}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a document. Used in places like {@linkcode Card.create}
   * and {@link Card | `new Card(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@link foundry.abstract.Document | `Document`} has been initialized, for example
   * {@link Card.name | `Card#name`}.
   *
   * This is data transformed from {@linkcode Card.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link Card.update | `Card#update`}.
   * It is a distinct type from {@link Card.CreateData | `DeepPartial<Card.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode Card}. This is the source of truth for how an Card document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Card}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Card document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The text name of this card */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * A text description of this card which applies to all faces
     * @defaultValue `""`
     */
    description: fields.HTMLField;

    /**
     * A category of card (for example, a suit) to which this card belongs
     * @defaultValue `"base"`
     */
    type: fields.DocumentTypeField<typeof BaseCard, { initial: typeof CONST.BASE_DOCUMENT_TYPE }>;

    /**
     * Game system data which is defined by the system template.json model
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseCard>;

    /**
     * An optional suit designation which is used by default sorting
     * @defaultValue `undefined`
     */
    suit: fields.StringField<{ required: true }>;

    /**
     * An optional numeric value of the card which is used by default sorting
     * @defaultValue `null`
     */
    value: fields.NumberField<{ required: true }>;

    /**
     * An object of face data which describes the back of this card
     */
    back: fields.SchemaField<{
      /**
       * A name for this card face
       * @defaultValue `undefined`
       */
      name: fields.StringField;

      /**
       * Displayed text that belongs to this face
       * @defaultValue `""`
       */
      text: fields.HTMLField;

      /**
       * A displayed image or video file which depicts the face
       * @defaultValue `null`
       */
      img: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;
    }>;

    /**
     * An array of face data which represent displayable faces of this card
     * @defaultValue `[]`
     */
    faces: fields.ArrayField<fields.SchemaField<Card.FaceSchema>>;

    /**
     * The index of the currently displayed face, or null if the card is face-down
     * @defaultValue `null`
     */
    face: fields.NumberField<{ required: true; initial: null; integer: true; min: 0 }>;

    /**
     * Whether this card is currently drawn from its source deck
     * @defaultValue `false`
     */
    drawn: fields.BooleanField;

    /**
     * The document ID of the origin deck to which this card belongs
     * @defaultValue `null`
     */
    origin: fields.ForeignDocumentField<typeof documents.BaseCards>;

    /**
     * The visible width of this card
     * @defaultValue `null`
     */
    width: fields.NumberField<{ integer: true; positive: true }>;

    /**
     * The visible height of this card
     * @defaultValue `null`
     */
    height: fields.NumberField<{ integer: true; positive: true }>;

    /**
     * The angle of rotation of this card
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * The sort order of this card relative to others in the same stack
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    // TODO: retype this to `DocumentFlagsField`
    flags: fields.ObjectField.FlagsField<Name>;

    _stats: fields.DocumentStatsField;
  }

  interface FaceSchema extends DataSchema {
    /**
     * A name for this card face
     * @defaultValue `undefined`
     */
    name: fields.StringField;

    /**
     * Displayed text that belongs to this face
     * @defaultValue `""`
     */
    text: fields.HTMLField;

    /**
     * A displayed image or video file which depicts the face
     * @defaultValue `BaseCard.DEFAULT_ICON`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE", "VIDEO"];
      initial: () => typeof BaseCard.DEFAULT_ICON;
    }>;
  }

  interface FaceData extends fields.SchemaField.InitializedData<FaceSchema> {}

  namespace Database {
    /** Options passed along in Get operations for Card Documents */
    interface Get extends foundry.abstract.types.DatabaseGetOperation<Card.Parent> {}

    /** Options passed along in Create operations for Card Documents */
    interface Create<Temporary extends boolean | undefined = boolean | undefined>
      extends foundry.abstract.types.DatabaseCreateOperation<Card.CreateData, Card.Parent, Temporary> {}

    /** Options passed along in Delete operations for Card Documents */
    interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Card.Parent> {}

    /** Options passed along in Update operations for Card Documents */
    interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Card.UpdateData, Card.Parent> {}

    /** Operation for {@linkcode Card.createDocuments} */
    interface CreateDocumentsOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Card.Database.Create<Temporary>> {}

    /** Operation for {@linkcode Card.updateDocuments} */
    interface UpdateDocumentsOperation extends Document.Database.UpdateDocumentsOperation<Card.Database.Update> {}

    /** Operation for {@linkcode Card.deleteDocuments} */
    interface DeleteDocumentsOperation extends Document.Database.DeleteDocumentsOperation<Card.Database.Delete> {}

    /** Operation for {@linkcode Card.create} */
    interface CreateOperation<Temporary extends boolean | undefined>
      extends Document.Database.CreateOperation<Card.Database.Create<Temporary>> {}

    /** Operation for {@link Card.update | `Card#update`} */
    interface UpdateOperation extends Document.Database.UpdateOperation<Update> {}

    interface DeleteOperation extends Document.Database.DeleteOperation<Delete> {}

    /** Options for {@linkcode Card.get} */
    interface GetOptions extends Document.Database.GetOptions {}

    /** Options for {@link Card._preCreate | `Card#_preCreate`} */
    interface PreCreateOptions extends Document.Database.PreCreateOptions<Create> {}

    /** Options for {@link Card._onCreate | `Card#_onCreate`} */
    interface OnCreateOptions extends Document.Database.CreateOptions<Create> {}

    /** Operation for {@linkcode Card._preCreateOperation} */
    interface PreCreateOperation extends Document.Database.PreCreateOperationStatic<Card.Database.Create> {}

    /** Operation for {@link Card._onCreateOperation | `Card#_onCreateOperation`} */
    interface OnCreateOperation extends Card.Database.Create {}

    /** Options for {@link Card._preUpdate | `Card#_preUpdate`} */
    interface PreUpdateOptions extends Document.Database.PreUpdateOptions<Update> {}

    /** Options for {@link Card._onUpdate | `Card#_onUpdate`} */
    interface OnUpdateOptions extends Document.Database.UpdateOptions<Update> {}

    /** Operation for {@linkcode Card._preUpdateOperation} */
    interface PreUpdateOperation extends Card.Database.Update {}

    /** Operation for {@link Card._onUpdateOperation | `Card._preUpdateOperation`} */
    interface OnUpdateOperation extends Card.Database.Update {}

    /** Options for {@link Card._preDelete | `Card#_preDelete`} */
    interface PreDeleteOptions extends Document.Database.PreDeleteOperationInstance<Delete> {}

    /** Options for {@link Card._onDelete | `Card#_onDelete`} */
    interface OnDeleteOptions extends Document.Database.DeleteOptions<Delete> {}

    /** Options for {@link Card._preDeleteOperation | `Card#_preDeleteOperation`} */
    interface PreDeleteOperation extends Card.Database.Delete {}

    /** Options for {@link Card._onDeleteOperation | `Card#_onDeleteOperation`} */
    interface OnDeleteOperation extends Card.Database.Delete {}

    /** Context for {@linkcode Card._onDeleteOperation} */
    interface OnDeleteDocumentsContext extends Document.ModificationContext<Card.Parent> {}

    /** Context for {@linkcode Card._onCreateDocuments} */
    interface OnCreateDocumentsContext extends Document.ModificationContext<Card.Parent> {}

    /** Context for {@linkcode Card._onUpdateDocuments} */
    interface OnUpdateDocumentsContext extends Document.ModificationContext<Card.Parent> {}

    /**
     * Options for {@link Card._preCreateDescendantDocuments | `Card#_preCreateDescendantDocuments`}
     * and {@link Card._onCreateDescendantDocuments | `Card#_onCreateDescendantDocuments`}
     */
    interface CreateOptions extends Document.Database.CreateOptions<Card.Database.Create> {}

    /**
     * Options for {@link Card._preUpdateDescendantDocuments | `Card#_preUpdateDescendantDocuments`}
     * and {@link Card._onUpdateDescendantDocuments | `Card#_onUpdateDescendantDocuments`}
     */
    interface UpdateOptions extends Document.Database.UpdateOptions<Card.Database.Update> {}

    /**
     * Options for {@link Card._preDeleteDescendantDocuments | `Card#_preDeleteDescendantDocuments`}
     * and {@link Card._onDeleteDescendantDocuments | `Card#_onDeleteDescendantDocuments`}
     */
    interface DeleteOptions extends Document.Database.DeleteOptions<Card.Database.Delete> {}
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

  interface DropData extends Document.Internal.DropData<Name> {}
  interface DropDataOptions extends Document.DropDataOptions {}

  /**
   * @remarks {@link Card.pass | `Card#pass`} calls {@link Cards.pass | `this.parent.pass`} with `action: "pass"` provided
   */
  interface PassOptions extends Omit<Cards.PassOptions, "action"> {}

  /**
   * @remarks {@link Card.play | `Card#play`} calls {@link Cards.pass | `this.parent.pass`} with `action: "play"` provided
   */
  interface PlayOptions extends PassOptions {}

  /**
   * @remarks {@link Card.discard | `Card#discard`} calls {@link Cards.pass | `this.parent.pass`} with `action: "discard"` provided
   */
  interface DiscardOptions extends PassOptions {}

  interface DefaultNameContext extends Document.DefaultNameContext<Name, NonNullable<Parent>> {}
}

/**
 * The client-side Card document which extends the common BaseCard document model.
 *
 * @see {@linkcode Cards}                    The Cards document type which contains Card embedded documents
 */
declare class Card<out SubType extends Card.SubType = Card.SubType> extends BaseCard.Internal.ClientDocument<SubType> {
  /**
   * @param data    - Initial data from which to construct the `Card`
   * @param context - Construction context options
   */
  constructor(...args: Card.ConstructorArgs);

  /**
   * The current card face
   */
  get currentFace(): Card.FaceData | null;

  /**
   * The image of the currently displayed card face or back
   * @remarks Falls back to {@linkcode Card.DEFAULT_ICON}
   */
  get img(): string;

  /**
   * A reference to the source Cards document which defines this Card.
   */
  get source(): Cards.Implementation | null;

  /**
   * A convenience property for whether or not the Card is within its source Cards stack. Cards in decks are always
   * considered home.
   */
  get isHome(): boolean;

  /**
   * Whether or not to display the face of this card?
   */
  get showFace(): boolean;

  /**
   * Does this Card have a next face available to flip to?
   */
  get hasNextFace(): boolean;

  /**
   * Does this Card have a previous face available to flip to?
   */
  get hasPreviousFace(): boolean;

  /** @remarks Provides fallback value for `back.img`, and overrides `name` with the face/back's name if appropriate */
  override prepareDerivedData(): void;

  /**
   * Flip this card to some other face. A specific face may be requested, otherwise:
   * If the card currently displays a face the card is flipped to the back.
   * If the card currently displays the back it is flipped to the first face.
   * @param face - A specific face to flip the card to
   * @returns A reference to this card after the flip operation is complete
   */
  flip(face?: number | null): Promise<Card.Implementation | undefined>;

  /**
   * Pass this Card to some other Cards document.
   * @param to      - A new Cards document this card should be passed to
   * @param options - Options which modify the pass operation (default: `{}`)
   * @returns A reference to this card after the it has been passed to another parent document
   */
  // options: not null (destructured)
  pass(to: Cards.Implementation, options?: Card.PassOptions): Promise<Card.Implementation | undefined>;

  /**
   * Play a specific card to some other Cards document.
   * @see {@link Card.pass | `Card#pass`}
   * @remarks This method is currently a more semantic alias for {@link Card.pass | `Card#pass`}.
   */
  // options: not null (destructured)
  play(to: Cards.Implementation, options?: Card.PlayOptions): Promise<Card.Implementation | undefined>;

  /**
   * Discard a specific card to some other Cards document.
   * @see {@link Card.pass | `Card#pass`}
   * @remarks This method is currently a more semantic alias for {@link Card.pass | `Card#pass`}.
   */
  // options: not null (destructured)
  discard(to: Cards.Implementation, options?: Card.DiscardOptions): Promise<Card.Implementation | undefined>;

  /**
   * Recall this Card to its original Cards parent.
   * @param options - Options which modify the recall operation (default: `{}`)
   * @returns A reference to the recalled card belonging to its original parent
   * @remarks Core's implementation doesn't use `options` at all
   */
  // options: not null (parameter default only)
  recall(options?: AnyObject): Promise<Card.Implementation | undefined>;

  /**
   * Create a chat message which displays this Card.
   * @param messageData - Additional data which becomes part of the created ChatMessageData (default: `{}`)
   * @param options     - Options which modify the message creation operation (default: `{}`)
   * @returns The created chat message
   */
  toMessage<Temporary extends boolean | undefined = false>(
    messageData?: DeepPartial<foundry.documents.BaseChatMessage.CreateData>,
    options?: ChatMessage.Database.CreateOperation<Temporary>,
  ): Promise<Document.TemporaryIf<ChatMessage.Implementation, Temporary> | undefined>;

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

  // Descendant Document operations have been left out because Card does not have any descendant documents.

  // context: not null (destructured)
  static override defaultName(context?: Card.DefaultNameContext): string;

  /** @remarks `context.parent` is required as creation requires one */
  static override createDialog(
    data: Document.CreateDialogData<Card.CreateData> | undefined,
    createOptions?: Document.Database.CreateOperationForName<"Card">,
    options?: Document.CreateDialogOptions<"Card">,
  ): Promise<Card.Stored | null | undefined>;

  // options: not null (parameter default only)
  static override fromDropData(
    data: Card.DropData,
    options?: Card.DropDataOptions,
  ): Promise<Card.Implementation | undefined>;

  static override fromImport(
    source: Card.Source,
    context?: Document.FromImportContext<Card.Parent> | null,
  ): Promise<Card.Implementation>;

  override _onClickDocumentLink(event: MouseEvent): ClientDocument.OnClickDocumentLinkReturn;
}

export default Card;
