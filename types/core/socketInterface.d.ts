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
   *                  (originally documented as type `SocketRequest`)
   * @returns A Promise which resolves to the SocketResponse
   *          (originally documented as type `SocketResponse`)
   */
  static dispatch (
    eventName: string,
    request: any
  ): Promise<any>
}
