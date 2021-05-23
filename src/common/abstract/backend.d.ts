import { BaseUser } from '../documents';
import DocumentData from './data';
import Document from './document';

/**
 * An interface which is required by both client and server-side to provide implementations for document operations.
 */
declare abstract class DatabaseBackend {
  /**
   * Perform document creation operations
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The created Document instances
   */
  create<T extends Document<any, any>>(documentClass: ConstructorOf<T>, request: Request, user: BaseUser): Promise<T[]>;

  /**
   * Perform document deletion operations
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The deleted Document instances
   */
  delete<T extends Document<any, any>>(documentClass: ConstructorOf<T>, request: Request, user: BaseUser): Promise<T[]>;

  /**
   * Retrieve Documents based on provided query parameters
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The created Document instances
   */
  get<T extends Document<any, any>>(documentClass: ConstructorOf<T>, request: Request, user: BaseUser): T[];

  /**
   * Perform document update operations
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The updated Document instances
   */
  update<T extends Document<any, any>>(documentClass: ConstructorOf<T>, request: Request, user: BaseUser): Promise<T[]>;

  /**
   * Validate the arguments passed to the create operation
   * @param data    - An array of document data
   *                  (default: `[]`)
   * @param options - Operation options
   *                  (default: `{}`)
   * @param pack    - A Compendium pack identifier
   */
  protected _createArgs({
    data,
    options,
    pack
  }?: Request): { data: DocumentData<any, any, any>[]; options: RequestOptions; pack?: string };

  /**
   * Validate the arguments passed to the delete operation
   * @param request - The requested operation
   * @param ids     - An array of document ids
   *                  (default: `[]`)
   * @param options - Operation options
   *                  (default: `{}`)
   * @param pack    - A Compendium pack identifier
   */
  protected _deleteArgs({ ids, options, pack }?: Request): { ids: string[]; options: RequestOptions; pack?: string };

  /**
   * Validate the arguments passed to the get operation
   * @param query   - A document search query to execute
   *                  (default: `{}`)
   * @param options - Operation options
   *                  (default: `{}`)
   * @param pack    - A Compendium pack identifier
   */
  protected _getArgs({ query, options, pack }?: Request): { options: RequestOptions; pack?: string; query: object };

  /**
   * Provide the Logger implementation that should be used for database operations
   */
  protected _getLogger(): Logger | Console;

  /**
   * Get the parent Document (if any) associated with a request
   * @param request - The requested operation
   * @returns The parent Document, or null
   *
   * @remarks Actually, this returns `undefined` if  there is no parent, the JSDoc is incorrect.
   */
  protected _getParent(request: Request): Promise<Document<any, any> | undefined>;

  /**
   * Determine a string suffix for a log message based on the parent and/or compendium context.
   */
  protected _logContext({ parent, pack }?: { pack?: string; parent?: Document<any, any> }): string;

  /**
   * Construct a standardized error message given the context of an attempted operation
   */
  protected _logError(
    user: BaseUser,
    action: string,
    subject: Document<any, any> | string,
    { parent, pack }?: { pack?: string; parent?: Document<any, any> }
  ): string;

  /**
   * Log a database operation for an embedded document, capturing the action taken and relevant IDs
   * @param action    - The action performed
   * @param type      - The document type
   * @param documents - The documents modified
   * @param info      - The logging level
   * @param parent    - A parent document
   * @param pack      - A compendium pack within which the operation occurred
   */
  protected _logOperation(
    action: string,
    type: string,
    documents: Document<any, any>[],
    { parent, pack, level }?: { level?: string; pack?: string; parent?: Document<any, any> }
  ): void;

  /**
   * Validate the arguments passed to the update operation
   * @param updates - An array of document data
   *                  (default: `[]`)
   * @param options - Operation options
   *                  (default: `{}`)
   * @param pack    - A Compendium pack identifier
   */
  protected _updateArgs({
    updates,
    options,
    pack
  }?: Request): { options: RequestOptions; pack?: string; updates: DocumentData<any, any, any>[] };

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   */
  protected getCompendiumScopes(): string[];

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   */
  protected getFlagScopes(): string[];

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
   * Get primary Document instances
   */
  protected abstract _getDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    query: Request,
    options: RequestOptions,
    user: BaseUser
  ): Promise<T[]>;

  /**
   * Get embedded Document instances
   */
  protected abstract _getEmbeddedDocuments<T extends Document<any, any>>(
    documentClass: ConstructorOf<T>,
    parent: T extends Document<any, infer U> ? U : never,
    query: Request,
    options: RequestOptions,
    user: BaseUser
  ): Promise<T[]>;

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
}

interface Request {
  data?: DocumentData<any, any, any>[];
  ids?: string[];
  options?: RequestOptions;
  pack?: string;
  parent?: Document<any, any>;
  query?: object;
  updates?: DocumentData<any, any, any>[];
}

interface RequestOptions {
  [key: string]: unknown;
  broadcast?: boolean;
  index?: boolean;
  nohook?: boolean;
  temporary?: boolean;
}

export default DatabaseBackend;
