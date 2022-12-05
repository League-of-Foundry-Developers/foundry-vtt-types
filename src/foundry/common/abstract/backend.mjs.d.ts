import { BaseUser } from "../documents.mjs";
import { AnyDocumentData } from "./data.mjs";
import Document from "./document.mjs";

/**
 * An interface shared by both the client and server-side which defines how creation, update, and deletion operations are transacted.
 */
declare abstract class DatabaseBackend {
  /**
   * Retrieve Documents based on provided query parameters
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The created Document instances
   */
  get<T extends Document<any, any>>(documentClass: ConstructorOf<T>, request: Request, user?: BaseUser): Promise<T>[];

  /**
   * Validate the arguments passed to the get operation
   */
  protected _getArgs({ query, options, pack }?: Request): { query: object; options: RequestOptions; pack?: string };

  /**
   * Get primary Document instances
   * @remarks
   * foundry actually declares this function to take parameters `documentClass`, `query`, `options`, and `user` but
   * that's not how it is called and also not how the subclasses implement it.
   * See https://gitlab.com/foundrynet/foundryvtt/-/issues/6177
   */
  protected abstract _getDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user: BaseUser
  ): Promise<T[]>;

  /**
   * Get embedded Document instances
   * @remarks
   * foundry actually declares this function to take parameters `documentClass`, `parent`, `query`, `options`, and
   * `user` but that's not how it is called and also not how the subclasses implement it.
   * See https://gitlab.com/foundrynet/foundryvtt/-/issues/6177
   */
  protected abstract _getEmbeddedDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    parent: T extends Document<any, infer U> ? U : never,
    request: Request,
    user: BaseUser
  ): Promise<T[]>;

  /**
   * Get the parent Document (if any) associated with a request
   * @param request - The requested operation
   * @returns The parent Document, or null
   *
   * @remarks Actually, this returns `undefined` if  there is no parent, the JSDoc is incorrect.
   */
  protected _getParent(request: Request): Promise<Document<any, any> | undefined>;

  /**
   * Perform document creation operations
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The created Document instances
   */
  create<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user?: BaseUser
  ): Promise<T[]>;

  /**
   * Validate the arguments passed to the create operation
   */
  protected _createArgs({ data, options, pack }?: Request): {
    data: AnyDocumentData[];
    options: RequestOptions;
    pack?: string;
  };

  /**
   * Create primary Document instances
   */
  protected abstract _createDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user: BaseUser
  ): Promise<T[]>;

  /**
   * Create embedded Document instances
   */
  protected abstract _createEmbeddedDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    parent: T extends Document<any, infer U> ? U : never,
    request: Request,
    user: BaseUser
  ): Promise<T[]>;

  /**
   * Perform document update operations
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The updated Document instances
   */
  update<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user?: BaseUser
  ): Promise<T[]>;

  /**
   * Validate the arguments passed to the update operation
   */
  protected _updateArgs({ updates, options, pack }?: Request): {
    updates: AnyDocumentData[];
    options: RequestOptions;
    pack?: string;
  };

  /**
   * Update primary Document instances
   */
  protected abstract _updateDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user: BaseUser
  ): Promise<T[]>;

  /**
   * Update embedded Document instances
   */
  protected abstract _updateEmbeddedDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    parent: T extends Document<any, infer U> ? U : never,
    request: Request,
    user: BaseUser
  ): Promise<T[]>;

  /**
   * Perform document deletion operations
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The deleted Document instances
   */
  delete<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user?: BaseUser
  ): Promise<T[]>;

  /**
   * Validate the arguments passed to the delete operation
   * @param request - The requested operation
   */
  protected _deleteArgs({ ids, options, pack }?: Request): { ids: string[]; options: RequestOptions; pack?: string };

  /**
   * Delete primary Document instances
   */
  protected abstract _deleteDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user: BaseUser
  ): Promise<T[]>;

  /**
   * Delete embedded Document instances
   */
  protected abstract _deleteEmbeddedDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    parent: T extends Document<any, infer U> ? U : never,
    request: Request,
    user: BaseUser
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
    documents: Document<any, any>[],
    {
      parent,
      pack,
      level
    }?: {
      /** A parent document */
      parent?: Document<any, any>;

      /** A compendium pack within which the operation occurred */
      pack?: string;

      /**
       * The logging level
       * @defaultValue `"info"`
       */
      level?: string;
    }
  ): void;

  /**
   * Construct a standardized error message given the context of an attempted operation
   */
  protected _logError(
    user: BaseUser,
    action: string,
    subject: Document<any, any> | string,
    { parent, pack }?: { parent?: Document<any, any>; pack?: string }
  ): string;

  /**
   * Determine a string suffix for a log message based on the parent and/or compendium context.
   */
  protected _logContext({ parent, pack }?: { parent?: Document<any, any>; pack?: string }): string;
}

export interface Request {
  /** An array of document data */
  data?: AnyDocumentData[];

  /** An array of document data */
  updates?: AnyDocumentData[];

  /** An array of document ids */
  ids?: string[];

  parent?: Document<any, any>;

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
