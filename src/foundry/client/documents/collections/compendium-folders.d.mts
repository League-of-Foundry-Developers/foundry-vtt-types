import type { DocumentCollection } from "#client/documents/abstract/_module.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";
import type Document from "#common/abstract/document.mjs";
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

  override updateAll( // TODO: StoredOfType
    transformation: Folder.UpdateData | ((doc: Folder.Stored) => Folder.UpdateData),
    condition?: ((doc: Folder.Stored) => boolean) | null,
    options?: DocumentCollection.UpdateAllOperation<"Folder">,
  ): Promise<Folder.Stored[]>;

  override _onModifyContents<Action extends Document.Database2.OperationAction>(
    action: Action,
    documents: Folder.Stored[], // TODO: StoredOfType
    result: Collection.OnModifyContentsResult<"Folder", Action>,
    operation: Collection.OnModifyContentsOperation<"Folder", Action>,
    user: User.Stored,
  ): void;
}

declare namespace CompendiumFolderCollection {
  interface Any extends AnyCompendiumFolderCollection {}
  interface AnyConstructor extends Identity<typeof AnyCompendiumFolderCollection> {}
}

declare abstract class AnyCompendiumFolderCollection extends CompendiumFolderCollection<CompendiumCollection.DocumentName> {
  constructor(...args: never);
}

export default CompendiumFolderCollection;
