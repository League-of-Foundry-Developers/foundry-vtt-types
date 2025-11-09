import type { Identity } from "#utils";
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

  override _onModifyContents<Action extends Document.Database2.OperationAction>(
    action: Action,
    documents: Folder.Stored[],
    result: Collection.OnModifyContentsResult<"Folder", Action>,
    operation: Collection.OnModifyContentsOperation<"Folder", Action>,
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
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyFolders {}
    interface AnyConstructor extends Identity<typeof AnyFolders> {}
  }

  interface ImplementationClass extends Document.Internal.ConfiguredCollectionClass<"Folder"> {}
  interface Implementation extends Document.Internal.ConfiguredCollection<"Folder"> {}

  /**
   * @deprecated Replaced by {@linkcode Folders.ImplementationClass}.
   */
  type ConfiguredClass = ImplementationClass;

  /**
   * @deprecated Replaced by {@linkcode Folders.Implementation}.
   */
  type Configured = Implementation;
}

declare abstract class AnyFolders extends Folders {
  constructor(...args: never);
}

export default Folders;
