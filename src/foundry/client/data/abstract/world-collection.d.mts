import type { DeepPartial, DropFirst, FixedInstanceType, GetKey, InexactPartial } from "fvtt-types/utils";
import type Document from "#common/abstract/document.d.mts";
import type { DatabaseCreateOperation } from "#common/abstract/_types.d.mts";

declare global {
  /**
   * A collection of world-level Document objects with a singleton instance per primary Document type.
   * Each primary Document type has an associated subclass of WorldCollection which contains them.
   * @see {@link Game.collections | `Game#collections`}
   */
  abstract class WorldCollection<
    DocumentClass extends Document.AnyConstructor,
    Name extends string,
  > extends DirectoryCollectionMixin(DocumentCollection)<DocumentClass, Name> {
    /**
     * Reference the set of Folders which contain documents in this collection
     */
    get folders(): Collection<Folder.Stored>;

    /**
     * Return a reference to the SidebarDirectory application for this WorldCollection.
     * @remarks
     * In the case where `Lowercase<Name>` is not a property of {@linkcode ui}, this actually always returns `undefined`,
     * but {@linkcode RollTables} overrides this, so we need to allow a wider return type.
     */
    get directory(): Lowercase<Name> extends keyof typeof ui
      ? (typeof ui)[Lowercase<Name>]
      :
          | (DocumentClass["metadata"]["name"] extends foundry.CONST.FOLDER_DOCUMENT_TYPES
              ? DocumentDirectory<DocumentClass["metadata"]["name"]>
              : never)
          | SidebarTab
          | undefined
          | null;

    /**
     * Return a reference to the singleton instance of this WorldCollection, or null if it has not yet been created.
     */
    static get instance(): WorldCollection<Document.AnyConstructor, any>; // TODO: Find a way to type this more concretely. One option would be to separate the static and non static side of this class, which allows accessing the the static this type to use the `documentName`.

    // Note(LukeAbby): Due to the usage of `this["contents"]` in the parent class the override has
    // to stay like this.
    protected override _getVisibleTreeContents(): this["contents"];

    /**
     * Import a Document from a Compendium collection, adding it to the current World.
     * @param pack       - The CompendiumCollection instance from which to import
     * @param id         - The ID of the compendium entry to import
     * @param updateData - Optional additional data used to modify the imported Document before it is created
     *                     (default: `{}`)
     * @param options    - Optional arguments passed to the {@linkcode WorldCollection.fromCompendium} and {@linkcode Document.create} methods
     *                     (default: `{}`)
     * @returns The imported Document instance
     */

    /**
     * @privateRemarks We've added everything in WorldCollection.FromCompendiumOptions to DatabaseCreateOperation
     * because they get passed through to Document.create() by this function.  So the
     * union type isn't really needed.  Leaving it because it feels like foundry will pull
     * those back out in the future (and we could miss it because we added them to
     * DatabaseCreateOperation but the foundry typedef doesn't have them).
     */
    importFromCompendium(
      pack: CompendiumCollection<CompendiumCollection.Metadata & { type: DocumentClass["metadata"]["name"] }>,
      id: string,
      updateData?: DeepPartial<FixedInstanceType<DocumentClass>["_source"]>,
      options?: InexactPartial<
        Document.Database.CreateOperation<DatabaseCreateOperation> & WorldCollection.FromCompendiumOptions
      >,
    ): Promise<Document.ToStored<DocumentClass>>;

    /**
     * Apply data transformations when importing a Document from a Compendium pack
     * @param document - The source Document, or a plain data object
     * @param options  - Additional options which modify how the document is imported
     *                   (default: `{}`)
     * @returns The processed data ready for world Document creation
     * @remarks FromCompendiumOptions is inflated to account for expanded downstream use
     */
    fromCompendium<Options extends WorldCollection.FromCompendiumOptions | undefined>(
      document: FixedInstanceType<DocumentClass> | Document.CreateDataFor<DocumentClass>,
      options?: Options,
    ): WorldCollection.FromCompendiumReturnType<DocumentClass, Options>;

    /**
     * Register a Document sheet class as a candidate which can be used to display Documents of a given type.
     * See {@linkcode DocumentSheetConfig.registerSheet} for details.
     * @see {@linkcode DocumentSheetConfig.registerSheet}
     *
     * @example <caption>Register a new ActorSheet subclass for use with certain Actor types.</caption>
     * ```typescript
     * Actors.registerSheet("dnd5e", ActorSheet5eCharacter, { types: ["character], makeDefault: true });
     * ```
     */
    static registerSheet(...args: DropFirst<Parameters<typeof DocumentSheetConfig.registerSheet>>): void;

    /**
     * Unregister a Document sheet class, removing it from the list of available sheet Applications to use.
     * See {@linkcode DocumentSheetConfig.unregisterSheet} for details.
     * @see {@linkcode DocumentSheetConfig.unregisterSheet}
     *
     * @example <caption>Deregister the default ActorSheet subclass to replace it with others.</caption>
     * Actors.unregisterSheet("core", ActorSheet);
     */
    static unregisterSheet(...args: DropFirst<Parameters<typeof DocumentSheetConfig.unregisterSheet>>): void;

    /**
     * Return an array of currently registered sheet classes for this Document type.
     * @remarks
     * This is documented to return only {@linkcode DocumentSheet}s but {@linkcode DrawingConfig} is just a
     * {@linkcode FormApplication}. See https://gitlab.com/foundrynet/foundryvtt/-/issues/6454.
     */
    static get registeredSheets(): FormApplication.Any[];
  }

  namespace WorldCollection {
    interface FromCompendiumOptions {
      /**
       * Clear the currently assigned folder
       * @defaultValue `false`
       */
      clearFolder?: boolean | undefined;

      /**
       * Clear the currently sort order
       * @defaultValue `true`
       */
      clearSort?: boolean | undefined;

      /**
       * Clear Document ownership
       * @defaultValue `true`
       */
      clearOwnership?: boolean | undefined;

      /**
       * Retain the Document ID from the source Compendium
       * @defaultValue `false`
       */
      keepId?: boolean | undefined;

      /** @remarks used by Scenes#fromCompendium */
      clearState?: boolean | undefined;
    }

    type FromCompendiumReturnType<
      DocumentClass extends Document.AnyConstructor,
      Options extends FromCompendiumOptions | undefined,
    > = Omit<
      FixedInstanceType<DocumentClass>["_source"],
      | ClientDocument._OmitProperty<GetKey<Options, "clearFolder", undefined>, false, "folder">
      | ClientDocument._OmitProperty<GetKey<Options, "clearSort", undefined>, true, "sort" | "navigation" | "navOrder">
      | ClientDocument._OmitProperty<GetKey<Options, "clearOwnership", undefined>, true, "ownership">
      | (GetKey<Options, "keepId", undefined> extends true ? never : never)
    >;
  }
}
