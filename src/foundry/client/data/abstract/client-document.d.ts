import { ContextType, DocumentModificationOptions } from "../../../common/abstract/document.mjs";
import { ConfiguredDocumentClass, ConstructorDataType, DocumentConstructor } from "../../../../types/helperTypes";

declare global {
  // TODO: Replace ConstructorOf<…> with DocumentConstructor once the problem with circular reference has been solved
  /**
   * A mixin which extends each Document definition with specialized client-side behaviors.
   * This mixin defines the client-side interface for database operations and common document behaviors.
   */
  const ClientDocumentMixin: <T extends ConstructorOf<foundry.abstract.Document<any, any>>>(
    Base: T
  ) => ClientDocumentConstructor<T>;

  namespace ClientDocumentMixin {
    interface CompendiumExportOptions {
      /**
       * Clear the flags object
       * @defaultValue `false`
       */
      clearFlags?: boolean | undefined;

      /**
       * Clear the currently assigned folder and sort order
       * @defaultValue `true`
       */
      clearSort?: boolean | undefined;

      /**
       * Clear document permissions
       * @defaultValue `true`
       */
      clearPermissions?: boolean | undefined;

      /**
       * Clear fields which store document state
       * @defaultValue `true`
       */
      clearState?: boolean | undefined;

      /**
       * Retain the current Document id
       * @defaultValue `false`
       */
      keepId?: boolean | undefined;
    }
  }
}

type ClientDocumentConstructor<T extends ConstructorOf<foundry.abstract.Document<any, any>>> = Pick<T, keyof T> &
  Pick<typeof ClientDocumentMixin, keyof typeof ClientDocumentMixin> & {
    new (...args: ConstructorParameters<T>): InstanceType<T> & ClientDocumentMixin<InstanceType<T>>;
  };

export declare class ClientDocumentMixin<T extends foundry.abstract.Document<any, any>> {
  constructor(data?: ConstructorDataType<T["data"]>, context?: ContextType<T>);

  /**
   * A collection of Application instances which should be re-rendered whenever this document is updated.
   * The keys of this object are the application ids and the values are Application instances. Each
   * Application in this object will have its render method called by {@link Document#render}.
   * @see {@link Document#render}
   */
  apps: Record<string, Application>;

  /**
   * A cached reference to the FormApplication instance used to configure this Document.
   * @defaultValue `null`
   */
  protected _sheet: FormApplication | null; // TODO: Replace with InstanceType<ConfiguredSheetClass<T>> once the circular reference problem has been solved

  /**
   * @see abstract.Document#_initialize
   */
  protected _initialize(): void;

  /**
   * Return a reference to the parent Collection instance which contains this Document.
   */
  get collection(): Collection<this>;

  /**
   * A reference to the Compendium Collection which contains this Document, if any, otherwise undefined.
   */
  get compendium(): any; // TODO: CompendiumCollection<this>

  /**
   * Return a reference to the Folder to which this Document belongs, if any.
   *
   * @example <caption>A Document may belong to a Folder</caption>
   * ```typescript
   * let folder = game.folders.contents[0];
   * let actor = await Actor.create({name: "New Actor", folder: folder.id});
   * console.log(actor.data.folder); // folder.id;
   * console.log(actor.folder); // folder;
   * ```
   */
  get folder(): Folder | null;

  /**
   * A boolean indicator for whether or not the current game User has ownership rights for this Document.
   * Different Document types may have more specialized rules for what constitutes ownership.
   */
  get isOwner(): boolean;

  /**
   * Test whether this Document is owned by any non-Gamemaster User.
   */
  get hasPlayerOwner(): boolean;

  /**
   * A boolean indicator for whether the current game User has exactly LIMITED visibility (and no greater).
   */
  get limited(): boolean;

  /**
   * Return a string which creates a dynamic link to this Document instance.
   */
  get link(): string;

  /**
   * Return the permission level that the current game User has over this Document.
   * See the CONST.DOCUMENT_OWNERSHIP_LEVELS object for an enumeration of these levels.
   *
   * @example
   * ```typescript
   * game.user.id; // "dkasjkkj23kjf"
   * actor.data.permission; // {default: 1, "dkasjkkj23kjf": 2};
   * actor.permission; // 2
   * ```
   */
  get permission(): ValueOf<typeof CONST.DOCUMENT_OWNERSHIP_LEVELS>;

  /**
   * Lazily obtain a FormApplication instance used to configure this Document, or null if no sheet is available.
   */
  get sheet(): FormApplication | null; // TODO: Replace mit InstanceType<ConfiguredSheetClass<T>> once the circular reference problem has been solved

  /**
   * A Universally Unique Identifier (uuid) for this Document instance.
   */
  get uuid(): string;

  /**
   * A boolean indicator for whether or not the current game User has at least limited visibility for this Document.
   * Different Document types may have more specialized rules for what determines visibility.
   */
  get visible(): boolean;

  /**
   * Obtain the FormApplication class constructor which should be used to configure this Document.
   */
  protected _getSheetClass(): ConstructorOf<FormApplication> | null; // TODO: Replace with ConfiguredSheetClass<T> once the circular reference problem has been solved

  /**
   * Prepare data for the Document.
   * Begin by resetting the prepared data back to its source state.
   * Next prepare any embedded Documents and compute any derived data elements.
   */
  prepareData(): void;

  /**
   * Prepare data related to this Document itself, before any embedded Documents or derived data is computed.
   */
  prepareBaseData(): void;

  /**
   * Prepare all embedded Document instances which exist within this primary Document.
   */
  prepareEmbeddedDocuments(): void;

  /**
   * Apply transformations or derivations to the values of the source data object.
   * Compute data fields whose values are not stored to the database.
   */
  prepareDerivedData(): void;

  /**
   * Render all of the Application instances which are connected to this document by calling their respective
   * @see Application#render
   * @param force   - Force rendering
   *                  (default: `false`)
   * @param context - Optional context
   *                  (default: `{}`)
   */
  render(force?: boolean, context?: Application.RenderOptions): void;

  /**
   * Determine the sort order for this Document by positioning it relative a target sibling.
   * See SortingHelper.performIntegerSort for more details
   * @param options - Sorting options provided to SortingHelper.performIntegerSort
   * @returns The Document after it has been re-sorted
   */
  sortRelative(options: SortOptions<this>): Promise<this>;

  /**
   * @see abstract.Document#_onCreate
   */
  protected _onCreate(data: T["data"]["_source"], options: DocumentModificationOptions, userId: string): void;

  /**
   * @see abstract.Document#_onUpdate
   */
  protected _onUpdate(
    data: DeepPartial<T["data"]["_source"]>,
    options: DocumentModificationOptions,
    userId: string
  ): void;

  /**
   * @see abstract.Document#_onDelete
   */
  protected _onDelete(options: DocumentModificationOptions, userId: string): void;

  /**
   * Preliminary actions taken before a set of embedded Documents in this parent Document are created.
   * @param embeddedName - The name of the embedded Document type
   * @param result       - An Array of created data objects
   * @param options      - Options which modified the creation operation
   * @param userId       - The ID of the User who triggered the operation
   */
  protected _preCreateEmbeddedDocuments(
    embeddedName: string,
    result: Record<string, unknown>[],
    options: DocumentModificationOptions,
    userId: string
  ): void;

  /**
   * Follow-up actions taken after a set of embedded Documents in this parent Document are created.
   * @param embeddedName - The name of the embedded Document type
   * @param documents    - An Array of created Documents
   * @param result       - An Array of created data objects
   * @param options      - Options which modified the creation operation
   * @param userId       - The ID of the User who triggered the operation
   */
  protected _onCreateEmbeddedDocuments(
    embeddedName: string,
    documents: foundry.abstract.Document<any, any>[],
    result: Record<string, unknown>[],
    options: DocumentModificationOptions,
    userId: string
  ): void;

  /**
   * Preliminary actions taken before a set of embedded Documents in this parent Document are updated.
   * @param embeddedName - The name of the embedded Document type
   * @param result       - An Array of incremental data objects
   * @param options      - Options which modified the update operation
   * @param userId       - The ID of the User who triggered the operation
   */
  protected _preUpdateEmbeddedDocuments(
    embeddedName: string,
    result: Record<string, unknown>[],
    options: DocumentModificationOptions,
    userId: string
  ): void;

  /**
   * Follow-up actions taken after a set of embedded Documents in this parent Document are updated.
   * @param embeddedName - The name of the embedded Document type
   * @param documents    - An Array of updated Documents
   * @param result       - An Array of incremental data objects
   * @param options      - Options which modified the update operation
   * @param userId       - The ID of the User who triggered the operation
   */
  protected _onUpdateEmbeddedDocuments(
    embeddedName: string,
    documents: foundry.abstract.Document<any, any>[],
    result: Record<string, unknown>[],
    options: DocumentModificationContext,
    userId: string
  ): void;

  /**
   * Preliminary actions taken before a set of embedded Documents in this parent Document are deleted.
   * @param embeddedName - The name of the embedded Document type
   * @param result       - An Array of document IDs being deleted
   * @param options      - Options which modified the deletion operation
   * @param userId       - The ID of the User who triggered the operation
   */
  protected _preDeleteEmbeddedDocuments(
    embeddedName: string,
    result: string[],
    options: DocumentModificationContext,
    userId: string
  ): void;

  /**
   * Follow-up actions taken after a set of embedded Documents in this parent Document are deleted.
   * @param embeddedName - The name of the embedded Document type
   * @param documents    - An Array of deleted Documents
   * @param result       - An Array of document IDs being deleted
   * @param options      - Options which modified the deletion operation
   * @param userId       - The ID of the User who triggered the operation
   */
  protected _onDeleteEmbeddedDocuments(
    embeddedName: string,
    documents: foundry.abstract.Document<any, any>[],
    result: string[],
    options: DocumentModificationContext,
    userId: string
  ): void;

  /**
   * Present a Dialog form to create a new Document of this type.
   * Choose a name and a type from a select menu of types.
   * @param data    - Initial data with which to populate the creation form
   *                  (default: `{}`)
   * @param context - Additional context options or dialog positioning options
   *                  (default: `{}`)
   * @returns A Promise which resolves to the created Document, or null if the dialog was
   *          closed.
   */
  static createDialog<T extends DocumentConstructor>(
    this: T,
    data?:
      | DeepPartial<
          | ConstructorDataType<InstanceType<T>["data"]>
          | (ConstructorDataType<InstanceType<T>["data"]> & Record<string, unknown>)
        >
      | undefined,
    context?: (Pick<DocumentModificationContext, "parent" | "pack"> & Partial<DialogOptions>) | undefined
  ): Promise<InstanceType<ConfiguredDocumentClass<T>> | null | undefined>;

  /**
   * Present a Dialog form to confirm deletion of this Document.
   * @param options - Positioning and sizing options for the resulting dialog
   *                  (default: `{}`)
   * @returns A Promise which resolves to the deleted Document
   */
  deleteDialog(options?: Partial<DialogOptions> | undefined): Promise<this | false | null | undefined>;

  /**
   * Export document data to a JSON file which can be saved by the client and later imported into a different session.
   * @param options - Additional options passed to the {@link ClientDocumentMixin#toCompendium} method
   */
  exportToJSON(options?: ClientDocumentMixin.CompendiumExportOptions): void;

  /**
   * A helper function to handle obtaining the relevant Document from dropped data provided via a DataTransfer event.
   * The dropped data could have:
   * 1. A compendium pack and entry id
   * 2. A World Document _id
   * 3. A data object explicitly provided
   *
   * @param data    - The data object extracted from a DataTransfer event
   * @param options - Additional options which configure data retrieval
   * @returns The Document data that should be handled by the drop handler
   */
  static fromDropData<T extends DocumentConstructor>(
    this: T,
    data: DropData<InstanceType<T>>,
    options?: FromDropDataOptions
  ): Promise<InstanceType<ConfiguredDocumentClass<T>> | undefined>;

  /**
   * Update this Document using a provided JSON string.
   * @param json - JSON data string
   * @returns The updated Document
   */
  importFromJSON(json: string): Promise<this>;

  /**
   * Render an import dialog for updating the data related to this Document through an exported JSON file
   */
  importFromJSONDialog(): Promise<void>;

  /**
   * Transform the Document data to be stored in a Compendium pack.
   * Remove any features of the data which are world-specific.
   * This function is asynchronous in case any complex operations are required prior to exporting.
   * @param pack    - A specific pack being exported to
   * @param options - Additional options which modify how the document is converted
   *                  (default: `{}`)
   * @returns A data object of cleaned data suitable for compendium import
   */
  toCompendium(
    pack?: CompendiumCollection<CompendiumCollection.Metadata> | null | undefined,
    options?: ClientDocumentMixin.CompendiumExportOptions | undefined
  ): Omit<T["data"]["_source"], "_id" | "folder" | "permission"> & {
    permission?: T["data"]["_source"]["permission"];
  };

  /**
   * @deprecated since v9 - Use prepareEmbeddedDocuments instead.
   */
  prepareEmbeddedEntities(): void;
}

interface SortOptions<T> {
  /**
   * @defaultValue `[]`
   */
  siblings?: T[];

  /**
   * @defaultValue `true`
   */
  sortBefore?: boolean;

  /**
   * @defaultValue `"sort"`
   */
  sortKey?: string;

  /**
   * @defaultValue `null`
   */
  target?: T | null;

  /**
   * @defaultValue `{}`
   */
  updateData?: any;
}

export type DropData<T extends foundry.abstract.Document<any, any>> = DropData.Data<T> | DropData.Pack | DropData.Id;

declare namespace DropData {
  interface Data<T extends foundry.abstract.Document<any, any>> {
    data: T["data"]["_source"];
  }

  interface Pack {
    pack: string;
  }

  interface Id {
    id: string;
  }
}

interface FromDropDataOptions {
  /**
   * Import the provided document data into the World, if it is not already a World-level Document reference
   * @defaultValue `false`
   */
  importWorld?: boolean;
}
