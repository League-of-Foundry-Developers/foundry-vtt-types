import type { ConfiguredDocumentClassForName, FolderDocumentTypes } from "../../../../types/helperTypes.d.mts";
import type { InexactPartial } from "../../../../types/utils.d.mts";

declare global {
  namespace Adventure {
    type ConfiguredClass = ConfiguredDocumentClassForName<"Adventure">;
    type ConfiguredInstance = InstanceType<ConfiguredClass>;

    interface PrepareImportOptions {
      /**
       * A subset of adventure fields to import.
       */
      // TODO: This isn't *quite* right as the keyof is including all the nevers.
      importFields: Array<keyof typeof foundry.documents.BaseAdventure.contentFields | "all">;
    }

    interface ImportOptions extends PrepareImportOptions {
      /**
       * Display a warning dialog if existing documents would be overwritten
       * @defaultValue `true`
       */
      dialog: boolean;
    }
  }

  /**
   * The client-side Adventure document which extends the common {@link foundry.documents.BaseAdventure} model.
   */
  class Adventure extends ClientDocumentMixin(foundry.documents.BaseAdventure) {
    /**
     * Perform a full import workflow of this Adventure.
     * Create new and update existing documents within the World.
     * @param options - Options which configure and customize the import process
     * @returns The import result
     */
    import(options?: InexactPartial<Adventure.ImportOptions>): Promise<AdventureImportResult>;

    /**
     * Prepare Adventure data for import into the World.
     * @param options - Options passed in from the import dialog to configure the import behavior
     * @returns A subset of adventure fields to import.
     */
    prepareImport(options?: InexactPartial<Adventure.PrepareImportOptions>): Promise<AdventureImportData>;

    /**
     * Execute an Adventure import workflow, creating and updating documents in the World.
     */
    importContent(data?: InexactPartial<AdventureImportData>): Promise<AdventureImportResult>;
  }

  interface AdventureImportData {
    toCreate?: DocumentDataRecord;
    toUpdate?: DocumentDataRecord;
    documentCount: number;
  }

  interface AdventureImportResult {
    created: DocumentResult;
    updated: DocumentResult;
  }
}

type DocumentDataRecord = {
  [K in AdventureDocumentTypes]?: foundry.data.fields.SchemaField.InnerAssignmentType<
    ReturnType<ConfiguredDocumentClassForName<K>["defineSchema"]>
  >[];
};

type DocumentResult = {
  [K in AdventureDocumentTypes]?: InstanceType<ConfiguredDocumentClassForName<K>>[];
};

type AdventureDocumentTypes = Exclude<FolderDocumentTypes, "Adventure"> | "Folder";
