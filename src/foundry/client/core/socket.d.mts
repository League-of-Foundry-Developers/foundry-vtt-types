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
    ): Promise<SocketResponse>;
  }
}
