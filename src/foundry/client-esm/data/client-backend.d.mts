import type { ConstructorOf } from "../../../types/utils.d.mts";
import type Document from "../../common/abstract/document.d.mts";
import type {
  DatabaseGetOperation,
  DatabaseCreateOperation,
  DatabaseUpdateOperation,
  DatabaseDeleteOperation,
} from "../../common/abstract/_types.d.mts";
import type { LoggingLevels } from "../../../types/helperTypes.d.mts";

/**
 * The client-side database backend implementation which handles Document modification operations.
 */
declare class ClientDatabaseBackend extends foundry.abstract.DatabaseBackend {
  protected override _getDocuments<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    request: DatabaseGetOperation,
    user: User.ConfiguredInstance,
  ): Promise<T[]>;

  protected override _createDocuments<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    request: DatabaseCreateOperation<T>,
    user: User.ConfiguredInstance,
  ): Promise<T[]>;

  protected override _updateDocuments<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    request: DatabaseUpdateOperation<T>,
    user: User.ConfiguredInstance,
  ): Promise<T[]>;

  protected override _deleteDocuments<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    request: DatabaseDeleteOperation,
    user: User.ConfiguredInstance,
  ): Promise<T[]>;

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
