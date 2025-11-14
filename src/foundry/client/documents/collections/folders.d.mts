import type { Identity } from "#utils";
import type { DatabaseAction, DatabaseOperationMap } from "#common/abstract/_types.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { DocumentCollection, WorldCollection } from "#client/documents/abstract/_module.d.mts";

/**
 * The singleton collection of Folder documents which exist within the active World.
 * This Collection is accessible within the Game object as {@linkcode foundry.Game.folders | game.folders}.
 *
 * @see {@link foundry.documents.Folder}: The Folder document
 */
declare class Folders extends WorldCollection<"Folder", "Folders"> {
  static override documentName: "Folder";

  /** @privateRemarks Fake type override */
  static override get instance(): Folders.Implementation;

  /**
   * Track which Folders are currently expanded in the UI
   * @internal
   */
  _expanded: Record<string, boolean>;

  // TODO: This is updated on the db-ops branch
  _onModifyContents<A extends DatabaseAction>(
    action: A,
    documents: Folder.Stored[],
    result: readonly foundry.documents.BaseFolder.UpdateData[] | readonly string[],
    operation: DatabaseOperationMap[A],
    user: User.Implementation,
  ): void;

  /** @remarks This is a no-op in {@linkcode Folders}, Foundry logs "The Folders collection is not directly rendered" as a warning.  */
  override render(force?: boolean, context?: DocumentCollection.RenderOptions): void;

  /** @deprecated Foundry made this method truly private in v13. This warning will be removed in v14. */
  protected _refreshJournalEntrySheets(): never;

  #Folders: true;
}

declare namespace Folders {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Folders.Implementation} instead. This will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Folders.ImplementationClass} instead. This will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyFolders {}
    interface AnyConstructor extends Identity<typeof AnyFolders> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Folder"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Folder"> {}

  /** @deprecated Replaced by {@linkcode Folders.ImplementationClass}. Will be removed in v15. */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Replaced by {@linkcode Folders.Implementation}. Will be removed in v15. */
  type Configured = Implementation;
}

export default Folders;

declare abstract class AnyFolders extends Folders {
  constructor(...args: never);
}
