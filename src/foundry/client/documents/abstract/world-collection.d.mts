import type { DeepPartial, GetKey, Identity, InexactPartial } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { AbstractSidebarTab, DocumentDirectory } from "#client/applications/sidebar/_module.mjs";
import type { Application } from "#client/appv1/api/_module.d.mts";
import type { ApplicationV2 } from "#client/applications/api/_module.d.mts";
import type { DocumentSheetConfig } from "#client/applications/apps/_module.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * A collection of world-level Document objects with a singleton instance per primary Document type.
 * Each primary Document type has an associated subclass of WorldCollection which contains them.
 * @see {@linkcode foundry.Game.collections | Game#collections}
 */
declare abstract class WorldCollection<
  DocumentName extends Document.WorldType,
  Name extends string,
> extends foundry.documents.abstract.DirectoryCollectionMixin(
  foundry.documents.abstract.DocumentCollection,
)<DocumentName> {
  // Note: This isn't a real override but it's here to make the type more specific.
  override get name(): Name;

  /**
   * Reference the set of Folders which contain documents in this collection
   */
  get folders(): WorldCollection.Folders<DocumentName>;

  /**
   * Return a reference to the SidebarDirectory application for this WorldCollection.
   * @remarks
   * In the case where `Lowercase<Name>` is not a property of {@linkcode ui}, this actually always returns `undefined`,
   * but {@linkcode RollTables} overrides this, so we need to allow a wider return type.
   */
  get directory(): WorldCollection.Directory<DocumentName, Name>;

  /**
   * Return a reference to the singleton instance of this WorldCollection, or null if it has not yet been created.
   */
  static get instance(): WorldCollection<Document.WorldType, any>; // TODO: Find a way to type this more concretely. One option would be to separate the static and non static side of this class, which allows accessing the the static this type to use the `documentName`.

  protected override _getVisibleTreeContents(): this["contents"];

  /**
   * Import a Document from a Compendium collection, adding it to the current World.
   * @param pack       - The CompendiumCollection instance from which to import
   * @param id         - The ID of the compendium entry to import
   * @param updateData - Optional additional data used to modify the imported Document before it is created (default: `{}`)
   * @param options    - Optional arguments passed to the {@linkcode WorldCollection.fromCompendium | WorldCollection#fromCompendium} and
   * {@linkcode Document.create} methods (default: `{}`)
   * @returns The imported Document instance
   * @remarks The `updateData` parameter is {@link foundry.utils.mergeObject | merged} with the return of `WorldCollection#fromCompendium`,
   * before being passed to `.create`, making the `DeepPartial<CreateData>` more correct than `UpdateData`.
   *
   * As noted in the parameter description, `options` is passed to both methods without alteration, and thus is typed as an intersection of
   * the relevant interfaces.
   *
   * The returned document might not be stored if `temporary: true` is passed in `options`
   * TODO: Change return type to Document.Stored in v14
   * TODO: Infer Document subtype from `updateData` if possible
   */
  importFromCompendium<Temporary extends boolean | undefined = boolean | undefined>(
    pack: WorldCollection.Pack<DocumentName>,
    id: string,
    updateData?: DeepPartial<Document.CreateDataForName<DocumentName>>,
    options?: WorldCollection.ImportFromCompendiumOptions<DocumentName, Temporary>,
  ): Promise<Document.TemporaryIfForName<DocumentName, Temporary>>;

  /**
   * Apply data transformations when importing a Document from a Compendium pack
   * @param document - The source Document, or a plain data object
   * @param options  - Additional options which modify how the document is imported (default: `{}`)
   * @returns The processed data ready for world Document creation
   * @remarks FromCompendiumOptions is inflated to account for expanded downstream use
   */
  fromCompendium<Options extends WorldCollection.FromCompendiumOptions | undefined>(
    document: Document.ImplementationFor<DocumentName> | Document.CreateDataForName<DocumentName>,
    options?: Options,
  ): WorldCollection.FromCompendiumReturnType<DocumentName, Options>;

  /**
   * Register a Document sheet class as a candidate which can be used to display Documents of a given type.
   * See {@linkcode DocumentSheetConfig.registerSheet} for details.
   * @see {@linkcode DocumentSheetConfig.registerSheet}
   *
   * @example
   * Register a new ActorSheet subclass for use with certain Actor types.
   * ```ts
   * foundry.documents.collections.Actors.registerSheet("dnd5e", ActorSheet5eCharacter, {
   *   types: ["character"],
   *   makeDefault: true
   * });
   * ```
   */
  static registerSheet(
    scope: string,
    sheetClass: Application.Any | ApplicationV2.Any,
    options?: DocumentSheetConfig.SheetRegistrationOptions,
  ): void;

  /**
   * Unregister a Document sheet class, removing it from the list of available sheet Applications to use.
   * See {@linkcode DocumentSheetConfig.unregisterSheet} for details.
   * @see {@linkcode DocumentSheetConfig.unregisterSheet}
   *
   * @example
   * Deregister the default ActorSheet subclass to replace it with others.
   * ```ts
   * foundry.documents.collections.Actors.unregisterSheet("core", ActorSheet);
   * ```
   */
  static unregisterSheet(
    scope: string,
    sheetClass: Application.AnyConstructor | ApplicationV2.AnyConstructor,
    options?: DocumentSheetConfig.UnregisterSheetOptions,
  ): void;

  /**
   * Return an array of currently registered sheet classes for this Document type.
   */
  static get registeredSheets(): (Application.AnyConstructor | ApplicationV2.AnyConstructor)[];
}

declare namespace WorldCollection {
  interface Any extends AnyWorldCollection {}
  interface AnyConstructor extends Identity<typeof AnyWorldCollection> {}

  /**
   * This type exists because there are {@link Document.WorldType | world documents}
   * that are not valid {@linkcode CONST.FOLDER_DOCUMENT_TYPES}.
   */
  type Folders<DocumentName extends Document.WorldType> = Collection<
    DocumentName extends Folder.DocumentType ? Folder.Stored<DocumentName> : never
  >;

  type Directory<DocumentName extends Document.WorldType, Name extends string> =
    Lowercase<Name> extends keyof typeof ui
      ? (typeof ui)[Lowercase<Name>]
      :
          | (DocumentName extends CONST.FOLDER_DOCUMENT_TYPES
              ? DocumentDirectory<Document.ImplementationClassFor<DocumentName>>
              : never)
          | AbstractSidebarTab.Any
          | undefined
          | null;

  /** @internal */
  type _FromCompendiumOptions = InexactPartial<{
    /**
     * Clear the currently assigned folder.
     * @defaultValue `false`
     */
    clearFolder: boolean;

    /**
     * Clear the currently sort order.
     * @defaultValue `true`
     * @remarks Also sets `data.navigation = false` and deletes `navOrder` when passed to
     * {@linkcode foundry.documents.collections.Scenes.fromCompendium | Scenes#fromCompendium}
     */
    clearSort: boolean;

    /**
     * Clear Document ownership (recursive).
     * @defaultValue `true`
     */
    clearOwnership: boolean;

    /**
     * Retain the Document ID from the source Compendium.
     * @defaultValue `false`
     */
    keepId: boolean;

    /**
     * Clear fields which store Document state.
     * @defaultValue `true`
     */
    clearState: boolean;
  }>;

  interface FromCompendiumOptions extends _FromCompendiumOptions {
    /**
     * @deprecated "The `addFlags` option for {@linkcode WorldCollection.fromCompendium | WorldCollection#fromCompendium}
     * has been removed." (since v12, until v14)
     */
    addFlags?: never;
  }

  // TODO: Ownership is removed recursively
  // TODO: why are both the `keepId` branches `never`
  type FromCompendiumReturnType<
    DocumentType extends Document.WorldType,
    Options extends FromCompendiumOptions | undefined,
  > = Omit<
    Document.SourceForName<DocumentType>,
    | ClientDocument._OmitProperty<GetKey<Options, "clearFolder", undefined>, false, "folder">
    | ClientDocument._OmitProperty<GetKey<Options, "clearSort", undefined>, true, "sort" | "navOrder">
    | ClientDocument._OmitProperty<GetKey<Options, "clearOwnership", undefined>, true, "ownership">
    | ClientDocument._OmitProperty<GetKey<Options, "clearState", undefined>, true, "active">
    | (GetKey<Options, "keepId", undefined> extends true ? never : never)
  >;

  /**
   * @remarks {@linkcode WorldCollection.importFromCompendium | WorldCollection#importFromCompendium} passes the same options object
   * to both {@linkcode WorldCollection.fromCompendium | WorldCollection#fromCompendium} and {@linkcode Document.create}.
   */
  type ImportFromCompendiumOptions<
    DocumentName extends Document.WorldType,
    Temporary extends boolean | undefined = boolean | undefined,
  > = Document.Database2.CreateDocumentsOperation<Document.Database2.CreateOperationForName<DocumentName, Temporary>> &
    FromCompendiumOptions;

  type Pack<DocumentName extends Document.WorldType> = DocumentName extends CompendiumCollection.DocumentName
    ? CompendiumCollection<DocumentName>
    : never;
}

declare abstract class AnyWorldCollection extends WorldCollection<Document.WorldType, string> {
  constructor(...args: never[]);
}

export default WorldCollection;
