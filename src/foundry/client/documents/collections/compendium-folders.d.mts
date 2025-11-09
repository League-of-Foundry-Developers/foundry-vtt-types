import type { DocumentCollection } from "#client/documents/abstract/_module.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";
import type { Identity } from "#utils";

/**
 * A Collection of Folder documents within a Compendium pack.
 */
declare class CompendiumFolderCollection<
  DocumentName extends CompendiumCollection.DocumentName,
> extends DocumentCollection<"Folder"> {
  constructor(pack: CompendiumCollection<DocumentName>, data?: Folder.CreateData[]);

  // TODO: overrides for everything enforcing this collection's `Folder`s are all of `Type` *and* Stored?

  pack: CompendiumCollection<DocumentName>;

  get documentName(): "Folder";

  override render(force?: boolean, options?: DocumentCollection.RenderOptions): void;

  // Possible this causes depth issues, this is just a small extension in the code with no meaningful transformations
  // override updateAll(
  //   transformation:
  //     | Document.UpdateDataForName<DocumentName>
  //     | ((doc: Document.StoredForName<DocumentName>) => Document.UpdateDataForName<DocumentName>),
  //   condition?: ((obj: Document.StoredForName<DocumentName>) => boolean) | null,
  //   options?: Document.Database.UpdateManyDocumentsOperationForName<DocumentName>,
  // ): Promise<Document.StoredForName<DocumentName>[]>;

  // Note(LukeAbby): The override for `_onModifyContents` becomes unreasonably long and doesn't add any changes and so has been omitted.
}

declare namespace CompendiumFolderCollection {
  interface Any extends AnyCompendiumFolderCollection {}
  interface AnyConstructor extends Identity<typeof AnyCompendiumFolderCollection> {}
}

declare abstract class AnyCompendiumFolderCollection extends CompendiumFolderCollection<CompendiumCollection.DocumentName> {
  constructor(...args: never);
}

export default CompendiumFolderCollection;
