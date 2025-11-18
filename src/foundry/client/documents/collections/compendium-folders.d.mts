import type { DocumentCollection } from "#client/documents/abstract/_module.d.mts";
import type { CompendiumCollection } from "#client/documents/collections/_module.d.mts";
import type Document from "#common/abstract/document.mjs";
import type { Identity } from "#utils";

/**
 * A Collection of Folder documents within a Compendium pack.
 */
// TODO: find a way to allow specifying that this can contain `Folder.Stored<DocumentName>`s only
declare class CompendiumFolderCollection<
  DocumentName extends CompendiumCollection.DocumentName,
> extends DocumentCollection<"Folder"> {
  constructor(pack: CompendiumCollection<DocumentName>, data?: Folder.CreateData[]);

  pack: CompendiumCollection<DocumentName>;

  get documentName(): "Folder";

  /** @remarks Forwards to {@linkcode CompendiumCollection.render | this.pack.render} */
  override render(force?: boolean, options?: DocumentCollection.RenderOptions): void;

  override updateAll( // TODO: StoredOfType
    transformation: DocumentCollection.Transformation<"Folder">,
    condition?: ((doc: Folder.Stored<DocumentName>) => boolean) | null,
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

export default CompendiumFolderCollection;

declare abstract class AnyCompendiumFolderCollection extends CompendiumFolderCollection<CompendiumCollection.DocumentName> {
  constructor(...args: never);
}
