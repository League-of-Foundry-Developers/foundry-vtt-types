import type Document from "./document.d.mts";
import type { DatabaseBackend } from "#common/abstract/_module.d.mts";

/** @deprecated Use {@linkcode DatabaseBackend.GetOperation} instead. This type will cease being exported in v15. */
export type DatabaseGetOperation<Parent extends Document.Any | null = Document.Any | null> =
  DatabaseBackend.GetOperation<Parent>;

/** @deprecated Use {@linkcode DatabaseBackend.CreateOperation} instead. This type will cease being exported in v15. */
export type DatabaseCreateOperation<
  CreateData extends object = object,
  Parent extends Document.Any | null = Document.Any | null,
  Temporary extends boolean | undefined = boolean | undefined,
> = DatabaseBackend.CreateOperation<CreateData, Parent, Temporary>;

/** @deprecated Use {@linkcode DatabaseBackend.UpdateOperation} instead. This type will cease being exported in v15. */
export type DatabaseUpdateOperation<
  UpdateData extends object = object,
  Parent extends Document.Any | null = Document.Any | null,
> = DatabaseBackend.UpdateOperation<UpdateData, Parent>;

/** @deprecated Use {@linkcode DatabaseBackend.DeleteOperation} instead. This type will cease being exported in v15. */
export type DatabaseDeleteOperation<Parent extends Document.Any | null = Document.Any | null> =
  DatabaseBackend.DeleteOperation<Parent>;

/** @deprecated Use {@linkcode DatabaseBackend.DatabaseOperationMap} instead. This type will cease being exported in v15. */
export type DatabaseOperationMap = DatabaseBackend.DatabaseOperationMap;

/** @deprecated Use {@linkcode DatabaseBackend.DatabaseAction} instead. This type will cease being exported in v15. */
export type DatabaseAction = DatabaseBackend.DatabaseAction;

/** @deprecated Use {@linkcode DatabaseBackend.DatabaseAction} instead. This type will cease being exported in v15. */
export type DatabaseOperation = DatabaseBackend.DatabaseOperation;

export interface DocumentSocketRequest<Action extends DatabaseBackend.DatabaseAction> {
  /**
   * The type of Document being transacted
   */
  type: string;

  /**
   * The action of the request
   */
  action: Action;

  /**
   * Operation parameters for the request
   */
  operation: DatabaseBackend.DatabaseOperationMap[Action];

  /**
   * The id of the requesting User
   */
  userId: string;

  /**
   * Should the response be broadcast to other connected clients?
   */
  broadcast: boolean;
}
