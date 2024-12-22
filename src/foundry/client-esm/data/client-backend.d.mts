import type { LoggingLevels } from "../../../utils/index.d.mts";
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
    user: User.ConfiguredInstance,
  ): Promise<InstanceType<T>[]>;

  protected override _createDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    request: DatabaseCreateOperation<InstanceType<T>>,
    user: User.ConfiguredInstance,
  ): Promise<InstanceType<T>[]>;

  protected override _updateDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    request: DatabaseUpdateOperation<InstanceType<T>>,
    user: User.ConfiguredInstance,
  ): Promise<InstanceType<T>[]>;

  protected override _deleteDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    request: DatabaseDeleteOperation,
    user: User.ConfiguredInstance,
  ): Promise<InstanceType<T>[]>;

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
