import type { Identity } from "#utils";
import type { DocumentCollection } from "#client/documents/abstract/_module.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";

/**
 * A Collection of Folder documents within a Compendium pack.
 */
declare class CompendiumFolderCollection<
  DocumentName extends CompendiumCollection.DocumentName,
> extends DocumentCollection<"Folder"> {
  constructor(pack: CompendiumCollection<DocumentName>, data?: Folder.CreateData[]);

  pack: CompendiumCollection<DocumentName>;

  get documentName(): "Folder";

  override render(force?: boolean, options?: DocumentCollection.RenderOptions): void;

  // TODO: `updateAll` and `_onModifyContents` are done on the db-ops branch
}

declare namespace CompendiumFolderCollection {
  interface Any extends AnyCompendiumFolderCollection {}
  interface AnyConstructor extends Identity<typeof AnyCompendiumFolderCollection> {}
}

export default CompendiumFolderCollection;

declare abstract class AnyCompendiumFolderCollection extends CompendiumFolderCollection<CompendiumCollection.DocumentName> {
  constructor(...args: never);
}
