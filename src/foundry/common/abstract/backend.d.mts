import type { InexactPartial, FixedInstanceType, LoggingLevels } from "../../../utils/index.d.mts";
import type Document from "./document.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseGetOperation,
  DatabaseOperation,
  DatabaseUpdateOperation,
} from "./_types.d.mts";

/**
 * An abstract base class extended on both the client and server which defines how Documents are retrieved, created,
 * updated, and deleted.
 */
declare abstract class DatabaseBackend {
  /**
   * Retrieve Documents based on provided query parameters.
   * @param documentClass - The Document definition
   * @param operation     - Parameters of the get operation
   * @param user          - The requesting User
   * @returns An array of retrieved Document instances or index objects
   */
  get<T extends Document.AnyConstructor>(
    documentClass: T,
    operation: DatabaseGetOperation,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<T>>[];

  /**
   * Retrieve Document instances using the specified operation parameters.
   * @param documentClass  - The Document class definition
   * @param operation      - Parameters of the get operation
   * @param user           - The requesting User
   * @returns An array of retrieved Document instances or index objects
   */
  protected abstract _getDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    operation: DatabaseGetOperation,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  /**
   * Create new Documents using provided data and context.
   * It is recommended to use {@link Document.createDocuments} or {@link Document.create} rather than calling this
   * method directly.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the create operation
   * @param user          - The requesting User
   * @returns An array of created Document instances
   */
  create<T extends Document.AnyConstructor>(
    documentClass: T,
    operation: DatabaseBackend.CreateOperation<T>,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  /**
   * Create Document instances using provided data and operation parameters.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the create operation
   * @param user          - The requesting User
   * @returns An array of created Document instances
   */
  protected abstract _createDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    operation: DatabaseCreateOperation<FixedInstanceType<T>>,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  /**
   * Update Documents using provided data and context.
   * It is recommended to use {@link Document.updateDocuments} or {@link Document#update} rather than calling this
   * method directly.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the update operation
   * @param user          - The requesting User
   * @returns  An array of updated Document instances
   */
  update<T extends Document.AnyConstructor>(
    documentClass: T,
    operation: DatabaseBackend.UpdateOperation<T>,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  /**
   * Update Document instances using provided data and operation parameters.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the update operation
   * @param user          - The requesting User
   * @returns  An array of updated Document instances
   */
  protected abstract _updateDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    operation: DatabaseUpdateOperation<FixedInstanceType<T>>,
    user: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  /**
   * Delete Documents using provided ids and context.
   * It is recommended to use {@link foundry.abstract.Document.deleteDocuments} or
   * {@link foundry.abstract.Document#delete} rather than calling this method directly.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the delete operation
   * @param user          - The requesting User
   * @returns The deleted Document instances
   */
  delete<T extends Document.AnyConstructor>(
    documentClass: T,
    operation: DatabaseBackend.DeleteOperation,
    user?: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  /**
   * Delete Document instances using provided ids and operation parameters.
   * @param documentClass - The Document class definition
   * @param operation     - Parameters of the delete operation
   * @param user          - The requesting User
   */
  protected abstract _deleteDocuments<T extends Document.AnyConstructor>(
    documentClass: T,
    operation: DatabaseDeleteOperation,
    user: User.Implementation,
  ): Promise<FixedInstanceType<T>[]>;

  /**
   * Get the parent Document (if any) associated with a request context.
   * @param operation - The requested database operation
   * @returns The parent Document, or null
   */
  _getParent(operation: DatabaseOperation): Promise<Document.Any | null>;

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   */
  getFlagScopes(): string[];

  /**
   * Describe the scopes which are suitable as the namespace for a flag key
   */
  getCompendiumScopes(): string[];

  /**
   * Log a database operations message.
   * @param level   - The logging level
   * @param message - The message
   */
  protected _log(level: LoggingLevels, message: string): void;

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
    }?: InexactPartial<{
      /** A parent document */
      parent: Document.Any;

      /** A compendium pack within which the operation occurred */
      pack: string;

      /**
       * The logging level
       * @defaultValue `"info"`
       */
      level: LoggingLevels;
    }>,
  ): void;

  /**
   * Construct a standardized error message given the context of an attempted operation
   */
  protected _logError(
    user: User.Implementation,
    action: string,
    { parent, pack }?: { parent?: Document.Any; pack?: string },
  ): string;
}

declare namespace DatabaseBackend {
  type CreateOperation<T extends Document.AnyConstructor> = Document.Database.CreateOperation<DatabaseCreateOperation<FixedInstanceType<T>>> & { data: FixedInstanceType<T>[] };
  type UpdateOperation<T extends Document.AnyConstructor> = Document.Database.UpdateOperation<DatabaseUpdateOperation<FixedInstanceType<T>>> & { data: FixedInstanceType<T>[] };
  type DeleteOperation = Document.Database.DeleteOperation<DatabaseDeleteOperation> & { ids: string[] };
}

export default DatabaseBackend;
