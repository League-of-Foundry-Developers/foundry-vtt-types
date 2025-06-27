import type { Identity } from "#utils";
import type { DatabaseAction, DatabaseOperationMap } from "#common/abstract/_types.d.mts";
import type Document from "#common/abstract/document.d.mts";

/**
 * The singleton collection of Folder documents which exist within the active World.
 * This Collection is accessible within the Game object as game.fog.
 *
 * @see {@linkcode Folder} The Folder document
 */
declare class Folders extends foundry.documents.abstract.WorldCollection<"Folder", "Folders"> {
  static documentName: "Folder";

  /**
   * Track which Folders are currently expanded in the UI
   * @internal
   */
  protected _expanded: Partial<Record<string, boolean>>;

  _onModifyContents<A extends DatabaseAction>(
    action: A,
    documents: readonly Folder.Implementation[],
    result: readonly foundry.documents.BaseFolder.UpdateData[] | readonly string[],
    operation: DatabaseOperationMap[A],
    user: User.Implementation,
  ): void;

  /** @deprecated Foundry made this method truly private in v13 (this warning will be removed in v14) */
  protected _refreshJournalEntrySheets(): never;

  render(
    force?: boolean,
    context?: foundry.appv1.api.Application.Options | foundry.applications.api.ApplicationV2.RenderOptions,
  ): void;
}

declare namespace Folders {
  interface Any extends AnyFolders {}
  interface AnyConstructor extends Identity<typeof AnyFolders> {}

  interface ConfiguredClass extends Document.ConfiguredCollectionClass<"Folder"> {}
  interface Configured extends Document.ConfiguredCollection<"Folder"> {}
}

declare abstract class AnyFolders extends Folders {
  constructor(...args: never);
}

export default Folders;
