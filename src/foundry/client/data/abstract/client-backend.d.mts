import type { ConstructorOf } from "../../../../types/utils.d.mts";
import type { RequestContext } from "../../../common/abstract/backend.d.mts";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * The client-side database backend implementation which handles Document modification operations.
   */
  class ClientDatabaseBackend extends foundry.abstract.DatabaseBackend {
    protected override _getDocuments<T extends Document.Any>(
      documentClass: ConstructorOf<T>,
      request: RequestContext<T>,
      user: User.ConfiguredInstance,
    ): Promise<T[]>;

    protected override _createDocuments<T extends Document.Any>(
      documentClass: ConstructorOf<T>,
      request: RequestContext<T>,
      user: User.ConfiguredInstance,
    ): Promise<T[]>;

    protected override _updateDocuments<T extends Document.Any>(
      documentClass: ConstructorOf<T>,
      request: RequestContext<T>,
      user: User.ConfiguredInstance,
    ): Promise<T[]>;

    protected override _deleteDocuments<T extends Document.Any>(
      documentClass: ConstructorOf<T>,
      request: RequestContext<T>,
      user: User.ConfiguredInstance,
    ): Promise<T[]>;

    /**
     * Activate the Socket event listeners used to receive responses from events which modify database documents
     * @param socket - The active game socket
     */
    activateSocketListeners(socket: Game["socket"]): void;

    override getFlagScopes(): string[];

    override getCompendiumScopes(): string[];
  }
}

export {};
