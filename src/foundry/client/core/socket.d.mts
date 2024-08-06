export {};

declare global {
  class SocketInterface {
    /**
     * Standardize the way that socket messages are dispatched and their results are handled
     * @param eventName - The socket event name being handled
     * @param request   - Request data provided to the Socket event
     * @returns A Promise which resolves to the SocketResponse
     */
    static dispatch(
      eventName: string,
      request: SocketInterface.Request | Record<string, unknown> | number | string | boolean,
    ): Promise<SocketInterface.Response>;
  }

  namespace SocketInterface {
    namespace Requests {
      interface ModifyEmbeddedDocument {
        action: Action;
        data: any; // TODO: add generics to this
        options: any;
        parentId: string;
        parentType: string;
        type: string;
      }

      // TODO: add remaining actions
      type Action = "create" | "update" | "delete";
    }

    namespace Responses {
      interface ModifyEmbeddedDocument {
        request: Requests.ModifyEmbeddedDocument;
        result: any[]; // TODO
        userId: string;
      }
    }

    // TODO: go through all SocketInterface.dispatch calls and collect requests
    type Request = Requests.ModifyEmbeddedDocument;

    type Response = Responses.ModifyEmbeddedDocument;
  }
}
