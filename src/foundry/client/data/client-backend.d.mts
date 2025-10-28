import type { FixedInstanceType, Identity, LoggingLevels } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { Game } from "#client/_module.d.mts";

/**
 * The client-side database backend implementation which handles Document modification operations.
 */
declare class ClientDatabaseBackend extends foundry.abstract.DatabaseBackend {
  protected override _getDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    request: Document.Database2.GetOperationForName<DocClass["documentName"]>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  // TODO: possible improvements around Stored types and inferring type data
  protected override _createDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    operation: Document.Database2.CreateOperationForName<DocClass["documentName"]>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  protected override _updateDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    request: Document.Database2.UpdateOperationForName<DocClass["documentName"]>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  protected override _deleteDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
    request: Document.Database2.DeleteOperationForName<DocClass["documentName"]>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<DocClass>[]>;

  /**
   * Activate the Socket event listeners used to receive responses from events which modify database documents
   * @param socket - The active game socket
   * @internal
   */
  activateSocketListeners(socket: Game["socket"]): void;

  override getFlagScopes(): ClientDatabaseBackend.FlagScopes[];

  // TODO: consider adding configuration for pack names
  override getCompendiumScopes(): string[];

  protected override _log(level: LoggingLevels, message: string): void;

  #ClientDatabaseBackend: true;
}

declare namespace ClientDatabaseBackend {
  interface Any extends AnyClientDatabaseBackend {}
  interface AnyConstructor extends Identity<typeof AnyClientDatabaseBackend> {}

  type FlagScopes =
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
