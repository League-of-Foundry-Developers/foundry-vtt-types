import type { FixedInstanceType, LoggingLevels } from "fvtt-types/utils";
import type Document from "../../common/abstract/document.d.mts";
import type {
  DatabaseGetOperation,
  DatabaseCreateOperation,
  DatabaseUpdateOperation,
  DatabaseDeleteOperation,
} from "../../common/abstract/_types.d.mts";

/**
 * The client-side database backend implementation which handles Document modification operations.
 */
declare class ClientDatabaseBackend extends foundry.abstract.DatabaseBackend {
  protected override _getDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    request: DatabaseGetOperation,
    user: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  protected override _createDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    request: DatabaseCreateOperation<FixedInstanceType<T>>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  protected override _updateDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    request: DatabaseUpdateOperation<FixedInstanceType<T>>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  protected override _deleteDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    request: DatabaseDeleteOperation,
    user: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  /**
   * Activate the Socket event listeners used to receive responses from events which modify database documents
   * @param socket - The active game socket
   */
  activateSocketListeners(socket: Game["socket"]): void;

  override getFlagScopes(): string[];

  override getCompendiumScopes(): string[];

  protected override _log(level: LoggingLevels, message: string): void;
}

export default ClientDatabaseBackend;
