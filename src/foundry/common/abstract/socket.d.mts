import type { AnyObject } from "../../../utils/index.d.mts";
import type { DatabaseAction, DatabaseOperation, DocumentSocketRequest } from "./_types.d.mts";

/**
 * The data structure of a modifyDocument socket response.
 */
declare class DocumentSocketResponse<Action extends DatabaseAction> {
  /**
   * Prepare a response for an incoming request.
   * @param request - The incoming request that is being responded to
   */
  constructor(request: DocumentSocketRequest<Action>);

  /** The type of Document being transacted. */
  type: foundry.abstract.Document.Type | undefined;

  /** The database action that was performed. */
  action: Action | undefined;

  /** Was this response broadcast to other connected clients? */
  broadcast: boolean | undefined;

  /** The database operation that was requested. */
  operation: DatabaseOperation | undefined;

  /** The identifier of the requesting user. */
  userId: string | undefined;

  /** The result of the request. Present if successful */
  result: AnyObject[] | readonly string[] | undefined;

  /** An error that occurred. Present if unsuccessful */
  error: Error | undefined;
}

export default DocumentSocketResponse;
