// eslint-disable-next-line @typescript-eslint/no-extraneous-class
declare class SocketInterface {
  /**
   * Handle an error returned from the database, displaying it on screen and in
   * the console
   * @param err - The provided Error message
   * @internal
   */
  static _handleError (err: Error): Error

  /**
   * Standardize the way that socket messages are dispatched and their results
   * are handled
   * @param eventName - The socket event name being handled
   * @param request - Data provided to the Socket event
   * @returns A Promise which resolves to the SocketResponse
   */
  static dispatch (
    eventName: string,
    request: SocketInterface.Request
  ): Promise<SocketInterface.Response>
}

declare namespace SocketInterface {
  namespace Requests {
    interface ModifyEmbeddedDocument {
      action: Action.Create | Action.Update | Action.Delete
      data: any // TODO: add generics to this
      options: Entity.CreateOptions
      parentId: string
      parentType: string
      type: string
    }

    // TODO: add remaining actions
    enum Action {
      Create = 'create',
      Update = 'update',
      Delete = 'delete'
    }
  }

  namespace Responses {
    interface ModifyEmbeddedDocument {
      request: Requests.ModifyEmbeddedDocument
      result: any[] // TODO
      userId: string
    }
  }

  // TODO: go through all SocketInterface.dispatch calls and collect requests
  type Request = Requests.ModifyEmbeddedDocument

  type Response = Responses.ModifyEmbeddedDocument
}
