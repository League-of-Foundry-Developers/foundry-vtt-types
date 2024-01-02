import type { BaseUser } from '../documents/module.mjs';
import DataModel from './data.mjs';
import Document from './document.mjs';

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
  get<T extends AnyDocument>(documentClass: ConstructorOf<T>, request: Request, user: BaseUser): T[];

  /**
   * Validate the arguments passed to the get operation
   * @param query   - A document search query to execute
   *                  (default: `{}`)
   * @param options - Operation options
   *                  (default: `{}`)
   * @param pack    - A Compendium pack identifier
   */
  protected _getArgs({ query, options, pack }?: Request): { query: object; options: RequestOptions; pack?: string };

  /**
   * Get primary Document instances
   * @remarks
   * foundry actually declares this function to take parameters `documentClass`, `query`, `options`, and `user` but
   * that's not how it is called and also not how the subclasses implement it.
   * See https://gitlab.com/foundrynet/foundryvtt/-/issues/6177
   */
  protected abstract _getDocuments<T extends AnyDocument>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user: InstanceType<ConfiguredUser>
  ): Promise<T[]>;

  /**
   * Get embedded Document instances
   * @remarks
   * foundry actually declares this function to take parameters `documentClass`, `parent`, `query`, `options`, and
   * `user` but that's not how it is called and also not how the subclasses implement it.
   * See https://gitlab.com/foundrynet/foundryvtt/-/issues/6177
   */
  protected abstract _getEmbeddedDocuments<T extends AnyDocument>(
    documentClass: ConstructorOf<T>,
    parent: Document.ParentTypeFor<T>,
    request: Request,
    user: InstanceType<ConfiguredUser>
  ): Promise<T[]>;

  /**
   * Get the parent Document (if any) associated with a request
   * @param request - The requested operation
   * @returns The parent Document, or null
   *
   * @remarks Actually, this returns `undefined` if  there is no parent, the JSDoc is incorrect.
   */
  protected _getParent(request: Request): Promise<AnyDocument | undefined>;

  /**
   * Perform document creation operations
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The created Document instances
   */
  create<T extends AnyDocument>(documentClass: ConstructorOf<T>, request: Request, user: BaseUser): Promise<T[]>;

  /**
   * Validate the arguments passed to the create operation
   * @param data    - An array of document data
   *                  (default: `[]`)
   * @param options - Operation options
   *                  (default: `{}`)
   * @param pack    - A Compendium pack identifier
   */
  protected _createArgs({ data, options, pack }?: Request): {
    data: DataModel.Any[];
    options: RequestOptions;
    pack?: string;
  };

  /**
   * Create primary Document instances
   */
  protected abstract _createDocuments<T extends AnyDocument>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user: InstanceType<ConfiguredUser>
  ): Promise<T[]>;

  /**
   * Create embedded Document instances
   */
  protected abstract _createEmbeddedDocuments<T extends AnyDocument>(
    documentClass: ConstructorOf<T>,
    parent: Document.ParentTypeFor<T>,
    request: Request,
    user: InstanceType<ConfiguredUser>
  ): Promise<T[]>;

  /**
   * Perform document update operations
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The updated Document instances
   */
  update<T extends AnyDocument>(documentClass: ConstructorOf<T>, request: Request, user: BaseUser): Promise<T[]>;

  /**
   * Validate the arguments passed to the update operation
   * @param updates - An array of document data
   *                  (default: `[]`)
   * @param options - Operation options
   *                  (default: `{}`)
   * @param pack    - A Compendium pack identifier
   */
  protected _updateArgs({ updates, options, pack }?: Request): {
    updates: DataModel.Any[];
    options: RequestOptions;
    pack?: string;
  };

  /**
   * Update primary Document instances
   */
  protected abstract _updateDocuments<T extends AnyDocument>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user: InstanceType<ConfiguredUser>
  ): Promise<T[]>;

  /**
   * Update embedded Document instances
   */
  protected abstract _updateEmbeddedDocuments<T extends AnyDocument>(
    documentClass: ConstructorOf<T>,
    parent: Document.ParentTypeFor<T>,
    request: Request,
    user: InstanceType<ConfiguredUser>
  ): Promise<T[]>;

  /**
   * Perform document deletion operations
   * @param documentClass - The Document definition
   * @param request       - The requested operation
   * @param user          - The requesting User
   * @returns The deleted Document instances
   */
  delete<T extends AnyDocument>(documentClass: ConstructorOf<T>, request: Request, user: BaseUser): Promise<T[]>;

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
   * Delete primary Document instances
   */
  protected abstract _deleteDocuments<T extends AnyDocument>(
    documentClass: ConstructorOf<T>,
    request: Request,
    user: InstanceType<ConfiguredUser>
  ): Promise<T[]>;

  /**
   * Delete embedded Document instances
   */
  protected abstract _deleteEmbeddedDocuments<T extends AnyDocument>(
    documentClass: ConstructorOf<T>,
    parent: Document.ParentTypeFor<T>,
    request: Request,
    user: InstanceType<ConfiguredUser>
  ): Promise<T[]>;

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   */
  protected getFlagScopes(): string[];

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   */
  protected getCompendiumScopes(): string[];

  /**
   * Provide the Logger implementation that should be used for database operations
   */
  protected _getLogger(): Console;

  /**
   * Log a database operation for an embedded document, capturing the action taken and relevant IDs
   * @param action    - The action performed
   * @param type      - The document type
   * @param documents - The documents modified
   * @param level     - The logging level
   *                    (default: `'info'`)
   * @param parent    - A parent document
   * @param pack      - A compendium pack within which the operation occurred
   */
  protected _logOperation(
    action: string,
    type: string,
    documents: AnyDocument[],
    { parent, pack, level }?: { parent?: AnyDocument; pack?: string; level?: string }
  ): void;

  /**
   * Construct a standardized error message given the context of an attempted operation
   */
  protected _logError(
    user: BaseUser,
    action: string,
    subject: AnyDocument | string,
    { parent, pack }?: { parent?: AnyDocument; pack?: string }
  ): string;

  /**
   * Determine a string suffix for a log message based on the parent and/or compendium context.
   */
  protected _logContext({ parent, pack }?: { parent?: AnyDocument; pack?: string }): string;
}

export interface Request {
  data?: DataModel.Any[];
  updates?: DataModel.Any[];
  ids?: string[];
  parent?: AnyDocument;
  query?: Record<string, unknown>;
  options?: RequestOptions;
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
