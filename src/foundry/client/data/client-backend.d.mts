import type { FixedInstanceType, Identity, LoggingLevels } from "#utils";
import type { Document } from "#common/abstract/_module.d.mts";
import type { Game } from "#client/_module.d.mts";
import type {
  DatabaseGetOperation,
  DatabaseUpdateOperation,
  DatabaseDeleteOperation,
} from "#common/abstract/_types.d.mts";

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
    operation: Document.Database.CreateOperationForName<T["documentName"], boolean | undefined>,
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
   * @internal
   */
  activateSocketListeners(socket: Game["socket"]): void;

  override getFlagScopes(): ClientDatabaseBackend.FlagScope[];

  // TODO: consider adding configuration for pack names
  override getCompendiumScopes(): string[];

  protected override _log(level: LoggingLevels, message: string): void;

  #ClientDatabaseBackend: true;
}

declare namespace ClientDatabaseBackend {
  interface Any extends AnyClientDatabaseBackend {}
  interface AnyConstructor extends Identity<typeof AnyClientDatabaseBackend> {}

  type FlagScope =
    | "core"
    | "world"
    | (foundry.packages.System.Id & {})
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | keyof RequiredModules
    // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents, @typescript-eslint/no-redundant-type-constituents
    | keyof ModuleConfig
    // eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
    | (string & {});
}

export default ClientDatabaseBackend;

declare abstract class AnyClientDatabaseBackend extends ClientDatabaseBackend {
  constructor(...args: never);
}
