import type { ConstructorOf } from "../../../types/utils.d.mts";
import type BaseUser from "../documents/user.d.mts";
import type Document from "./document.d.mts";

/**
 * An interface shared by both the client and server-side which defines how creation, update, and deletion operations are transacted.
 */
declare abstract class DatabaseBackend {
  /**
   * Retrieve Documents based on provided query parameters
   * @param documentClass - The Document definition
   * @param context       - Context for the requested operation
   * @param user          - The requesting User
   * @returns The created Document instances
   */
  get<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    context: RequestContext<T>,
    user?: BaseUser,
  ): Promise<T>[];

  /**
   * Validate the arguments passed to the get operation
   * @param context - The requested operation
   */
  protected _getArgs<T extends Document.Any>(
    context?: RequestContext<T>,
  ): {
    query: object;
    options: RequestOptions;
    pack?: string;
    parent: ReturnType<DatabaseBackend["_getParent"]>;
    parentUuid: string | undefined;
  };

  /**
   * Get primary Document instances
   * @remarks
   * foundry actually declares this function to take parameters `documentClass`, `query`, `options`, and `user` but
   * that's not how it is called and also not how the subclasses implement it.
   * See https://gitlab.com/foundrynet/foundryvtt/-/issues/6177
   */
  protected abstract _getDocuments<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    request: RequestContext<T>,
    user: BaseUser,
  ): Promise<T[]>;

  /**
   * Get the parent Document (if any) associated with a request
   * @param context - The requested operation
   * @returns The parent Document, or null
   */
  protected _getParent<T extends Document.Any>(context: RequestContext<T>): Promise<Document.Any | undefined>;

  /**
   * Perform document creation operations
   * @param documentClass - The Document definition
   * @param context       - Context for the requested operation
   * @param user          - The requesting User
   * @returns The created Document instances
   */
  create<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    context: RequestContext<T>,
    user?: BaseUser,
  ): Promise<T[]>;

  /**
   * Validate the arguments passed to the create operation
   * @param context - The requested operation
   */
  protected _createArgs<T extends Document.Any>({
    data,
    options,
    pack,
    parentUuid,
  }?: RequestContext<T>): {
    data: T["_source"][];
    options: RequestOptions;
    pack?: string;
    parent: ReturnType<DatabaseBackend["_getParent"]>;
    parentUuid: string | undefined;
  };

  /**
   * Create primary Document instances
   */
  protected abstract _createDocuments<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    context: RequestContext<T>,
    user: BaseUser,
  ): Promise<T[]>;

  /**
   * Perform document update operations
   * @param documentClass - The Document definition
   * @param context       - Context for the requested operation
   * @param user          - The requesting User
   * @returns The updated Document instances
   */
  update<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    context: RequestContext<T>,
    user?: BaseUser,
  ): Promise<T[]>;

  /**
   * Validate the arguments passed to the update operation
   */
  protected _updateArgs<T extends Document.Any>({
    updates,
    options,
    pack,
    parentUuid,
  }?: RequestContext<T>): {
    updates: T["_source"][];
    options: RequestOptions;
    pack?: string;
    parent: ReturnType<DatabaseBackend["_getParent"]>;
    parentUuid: string | undefined;
  };

  /**
   * Update primary Document instances
   */
  protected abstract _updateDocuments<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    request: RequestContext<T>,
    user: BaseUser,
  ): Promise<T[]>;

  /**
   * Perform document deletion operations
   * @param documentClass - The Document definition
   * @param context       - Context for the requested operation
   * @param user          - The requesting User
   * @returns The deleted Document instances
   */
  delete<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    context: RequestContext<T>,
    user?: BaseUser,
  ): Promise<T[]>;

  /**
   * Validate the arguments passed to the delete operation
   * @param request - The requested operation
   */
  protected _deleteArgs<T extends Document.Any>(
    context?: RequestContext<T>,
  ): {
    ids: string[];
    options: RequestOptions;
    pack?: string;
    parent: ReturnType<DatabaseBackend["_getParent"]>;
    parentUuid: string | undefined;
  };

  /**
   * Delete primary Document instances
   */
  protected abstract _deleteDocuments<T extends Document.Any>(
    documentClass: ConstructorOf<T>,
    request: RequestContext<T>,
    user: BaseUser,
  ): Promise<T[]>;

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   */
  getFlagScopes(): string[];

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   */
  getCompendiumScopes(): string[];

  /**
   * Provide the Logger implementation that should be used for database operations
   */
  protected _getLogger(): Console;

  /**
   * Log a database operation for an embedded document, capturing the action taken and relevant IDs
   * @param action    - The action performed
   * @param type      - The document type
   * @param documents - The documents modified
   */
  protected _logOperation(
    action: string,
    type: string,
    documents: Document.Any[],
    {
      parent,
      pack,
      level,
    }?: {
      /** A parent document */
      parent?: Document.Any;

      /** A compendium pack within which the operation occurred */
      pack?: string;

      /**
       * The logging level
       * @defaultValue `"info"`
       */
      level?: string;
    },
  ): void;

  /**
   * Construct a standardized error message given the context of an attempted operation
   */
  protected _logError(
    user: BaseUser,
    action: string,
    subject: Document.Any | string,
    { parent, pack }?: { parent?: Document.Any; pack?: string },
  ): string;

  /**
   * Determine a string suffix for a log message based on the parent and/or compendium context.
   */
  protected _logContext({ parent, pack }?: { parent?: Document.Any; pack?: string }): string;
}

//TODO: Can improve the typing even further here by specifying the parent bit
export interface RequestContext<T extends Document.Any> {
  /** An array of document data */
  data?: T["_source"][];

  /** An array of document data */
  updates?: T["_source"][];

  /** An array of document ids */
  ids?: string[];

  parent?: Document.Any;

  parentUuid?: string;

  /**
   * A document search query to execute
   * @defaultValue `{}`
   */
  query?: Record<string, unknown>;

  /**
   * Operation options
   * @defaultValue `{}`
   */
  options?: RequestOptions;

  /** A Compendium pack identifier */
  pack?: string;
}

export interface RequestOptions {
  index?: boolean;
  broadcast?: boolean;
  temporary?: boolean;
  nohook?: boolean;
  [key: string]: unknown;
}

export default DatabaseBackend;
