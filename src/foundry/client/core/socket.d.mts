import type { DatabaseOperationMap, DocumentSocketRequest } from "../../common/abstract/_types.d.mts";

declare global {
  class SocketInterface {
    /**
     * Standardize the way that socket messages are dispatched and their results are handled
     * @param eventName - The socket event name being handled
     * @param request   - Request data provided to the Socket event
     * @returns A Promise which resolves to the SocketResponse
     */
    static dispatch<DatabaseAction extends keyof DatabaseOperationMap>(
      eventName: string,
      request: DocumentSocketRequest<DatabaseAction> | ManageCompendiumRequest,
    ): Promise<SocketInterface.SocketResponse>;
  }

  namespace SocketInterface {
    /** @remarks Copied from `resources/app/common/types.mjs` */
    type RequestData = Record<string, unknown> | Record<string, unknown>[] | string | string[];

    /** @remarks Copied from `resources/app/common/types.mjs` */
    interface SocketRequest {
      /** Additional options applied to the request */
      options?: Record<string, unknown> | undefined;
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
      result?: Record<string, unknown>[] | string[] | undefined;
    }
  }
}
