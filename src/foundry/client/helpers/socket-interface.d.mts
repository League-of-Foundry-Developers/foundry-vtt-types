import type { AnyObject, Identity } from "#utils";
import type { DatabaseOperationMap, DocumentSocketRequest } from "#common/abstract/_types.d.mts";

/**
 * A standardized way socket messages are dispatched and their responses are handled
 */
declare class SocketInterface {
  /**
   * Standardize the way that socket messages are dispatched and their results are handled
   * @param eventName - The socket event name being handled
   * @param request   - Request data provided to the Socket event
   * @returns A Promise which resolves to the SocketResponse
   */
  static dispatch<DatabaseAction extends keyof DatabaseOperationMap>(
    eventName: string,
    request:
      | DocumentSocketRequest<DatabaseAction>
      | foundry.documents.collections.CompendiumCollection.ManageCompendiumRequest,
  ): Promise<SocketInterface.SocketResponse>;
}

declare namespace SocketInterface {
  interface Any extends AnySocketInterface {}
  interface AnyConstructor extends Identity<typeof AnySocketInterface> {}

  /** @remarks Copied from `resources/app/common/types.mjs` */
  type RequestData = AnyObject | AnyObject[] | string | readonly string[];

  /** @remarks Copied from `resources/app/common/types.mjs` */
  interface SocketRequest {
    /** Additional options applied to the request */
    options?: AnyObject | undefined;
    broadcast?: boolean | undefined;
  }

  /** @remarks Copied from `resources/app/common/types.mjs` */
  interface SocketResponse {
    /**
     * The initial request
     */
    request: SocketRequest;

    /**
     * An error, if one occurred
     */
    error?: Error | undefined;

    /**
     * The status of the request
     */
    status?: string | undefined;

    /**
     * The ID of the requesting User
     */
    userId?: string | undefined;

    /**
     * Data returned as a result of the request
     */
    data?: RequestData | undefined;

    /**
     * An Array of created data objects
     */
    result?: AnyObject[] | readonly string[] | undefined;
  }
}

export default SocketInterface;

declare abstract class AnySocketInterface extends SocketInterface {
  constructor(...args: never);
}
