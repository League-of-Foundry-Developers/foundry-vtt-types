declare class SocketInterface {
  /**
   * Standardize the way that socket messages are dispatched and their results are handled
   * @param eventName - The socket event name being handled
   * @param request   - Data provided to the Socket event
   * @returns A Promise which resolves to the SocketResponse
   */
  static dispatch(eventName: string, request: SocketInterface.Request): Promise<SocketInterface.Response>;

  /* -------------------------------------------- */

  /**
   * Handle an error returned from the database, displaying it on screen and in the console
   * @param err - The provided Error message
   */
  protected static _handleError(err: Error): Error;
}

declare namespace SocketInterface {
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
