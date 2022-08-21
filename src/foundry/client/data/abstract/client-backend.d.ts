import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import type { Request } from "../../../common/abstract/backend.mjs.js";
import type Document from "../../../common/abstract/document.mjs.js";

declare global {
  /**
   * The client-side database backend implementation which handles Document modification operations.
   */
  class ClientDatabaseBackend extends foundry.abstract.DatabaseBackend {
    /**
     * Activate the Socket event listeners used to receive responses from events which modify database documents
     * @param socket - The active game socket
     */
    activateSocketListeners(socket: io.Socket): void;

    protected override _getDocuments<T extends Document<any, any>>(
      documentClass: ConstructorOf<T>,
      request: Request,
      user: InstanceType<ConfiguredDocumentClassForName<"User">>
    ): Promise<T[]>;

    /**
     * @remarks
     * Get operations for embedded Documents are currently un-supported.
     * The returned promise always rejects.
     */
    protected override _getEmbeddedDocuments<T extends Document<any, any>>(
      documentClass: ConstructorOf<T>,
      parent: T extends Document<any, infer U> ? U : never,
      request: Request,
      user: InstanceType<ConfiguredDocumentClassForName<"User">>
    ): Promise<never>;

    protected override _createDocuments<T extends Document<any, any>>(
      documentClass: ConstructorOf<T>,
      request: Request,
      user: InstanceType<ConfiguredDocumentClassForName<"User">>
    ): Promise<T[]>;

    protected override _createEmbeddedDocuments<T extends Document<any, any>>(
      documentClass: ConstructorOf<T>,
      parent: T extends Document<any, infer U> ? U : never,
      request: Request,
      user: InstanceType<ConfiguredDocumentClassForName<"User">>
    ): Promise<T[]>;

    /**
     * Perform a standardized pre-creation workflow for all Document types. For internal use only.
     * @internal
     */
    protected _preCreateDocumentArray<T extends Document<any, any>>(
      documentClass: ConstructorOf<T>,
      {
        data,
        options,
        pack,
        parent,
        user
      }: Pick<Request, "data" | "pack" | "parent" | "options"> & {
        user: InstanceType<ConfiguredDocumentClassForName<"User">>;
      }
    ): Promise<T[]>;

    /**
     * Handle a SocketResponse from the server when one or multiple documents were created
     * @param response - The provided Socket response
     * @returns An Array of created Document instances
     * @internal
     */
    protected _handleCreateDocuments(response: SocketResponse): foundry.abstract.Document<any, any>[];

    /**
     * Handle a SocketResponse from the server when one or multiple documents were created
     * @param response - The provided Socket response
     * @returns An Array of created Document instances
     * @internal
     */
    protected _handleCreateEmbeddedDocuments(response: SocketResponse): foundry.abstract.Document<any, any>[];

    /**
     * Perform a standardized post-creation workflow for all Document types. For internal use only.
     * @returns An array of callback operations to perform once every Document is created
     * @internal
     */
    protected _postCreateDocumentCallbacks(
      type: string,
      collection: Collection<foundry.abstract.Document<any, any>>,
      result: object[],
      { options, userId, parent, pack }: Pick<Request, "options" | "parent" | "pack"> & { userId?: string }
    ): (() => void)[];

    protected override _updateDocuments<T extends Document<any, any>>(
      documentClass: ConstructorOf<T>,
      request: Request,
      user: InstanceType<ConfiguredDocumentClassForName<"User">>
    ): Promise<T[]>;

    protected override _updateEmbeddedDocuments<T extends Document<any, any>>(
      documentClass: ConstructorOf<T>,
      parent: T extends Document<any, infer U> ? U : never,
      request: Request,
      user: InstanceType<ConfiguredDocumentClassForName<"User">>
    ): Promise<T[]>;

    /**
     * Perform a standardized pre-update workflow for all Document types. For internal use only.
     * @internal
     */
    protected _preUpdateDocumentArray<T extends Document<any, any>>(
      collection: Collection<T>,
      {
        updates,
        options,
        user
      }: Pick<Request, "updates" | "options"> & {
        user: InstanceType<ConfiguredDocumentClassForName<"User">>;
      }
    ): Promise<T[]>;

    /**
     * Handle a SocketResponse from the server when one or multiple documents were updated
     * @param response - The provided Socket response
     * @returns An Array of updated Document instances
     * @internal
     */
    protected _handleUpdateDocuments(response: SocketResponse): foundry.abstract.Document<any, any>[];

    /**
     * Handle a SocketResponse from the server when embedded Documents are updated in a parent Document.
     * @param response - The provided Socket response
     * @returns An Array of updated Document instances
     * @internal
     */
    protected _handleUpdateEmbeddedDocuments(response: SocketResponse): foundry.abstract.Document<any, any>[];

    /**
     * Perform a standardized post-update workflow for all Document types. For internal use only.
     * @returns An array of callback operations to perform after every Document is updated
     * @internal
     */
    protected _postUpdateDocumentCallbacks(
      collection: Collection<foundry.abstract.Document<any, any>>,
      result: object[],
      { options, userId }: Pick<Request, "options"> & { userId?: string }
    ): () => void;

    protected override _deleteDocuments<T extends Document<any, any>>(
      documentClass: ConstructorOf<T>,
      request: Request,
      user: InstanceType<ConfiguredDocumentClassForName<"User">>
    ): Promise<T[]>;

    protected override _deleteEmbeddedDocuments<T extends Document<any, any>>(
      documentClass: ConstructorOf<T>,
      parent: T extends Document<any, infer U> ? U : never,
      request: Request,
      user: InstanceType<ConfiguredDocumentClassForName<"User">>
    ): Promise<T[]>;

    /**
     * Perform a standardized pre-delete workflow for all Document types. For internal use only.
     * @internal
     */
    protected _preDeleteDocumentArray<T extends Document<any, any>>(
      collection: Collection<T>,
      {
        ids,
        options,
        user
      }: Pick<Request, "ids" | "options"> & { user: InstanceType<ConfiguredDocumentClassForName<"User">> }
    ): Promise<T[]>;

    /**
     * Handle a SocketResponse from the server where Documents are deleted.
     * @param response - The provided Socket response
     * @returns An Array of deleted Document instances
     * @internal
     */
    protected _handleDeleteDocuments(response: SocketResponse): foundry.abstract.Document<any, any>[];

    /**
     * Handle a SocketResponse from the server when embedded Documents are deleted from a parent Document.
     * @param response - The provided Socket response
     * @returns An Array of deleted Document instances
     * @internal
     */
    protected _handleDeleteEmbeddedDocuments(response: SocketResponse): foundry.abstract.Document<any, any>[];

    /**
     * Perform a standardized post-deletion workflow for all Document types. For internal use only.
     * @returns An array of callback operations to perform after every Document is deleted
     * @internal
     */
    protected _postDeleteDocumentCallbacks(
      collection: Collection<foundry.abstract.Document<any, any>>,
      result: object[],
      { options, userId }: Pick<Request, "options"> & { userId?: string }
    ): (() => void)[];

    override getFlagScopes(): string[];

    override getCompendiumScopes(): string[];
  }
}

export {};
