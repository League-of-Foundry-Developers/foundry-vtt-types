/**
 * @typeParam P - the type of the options object
 */
declare class ChatPopout<P extends Application.Options = Application.Options> extends Application<P> {
  constructor(message: ChatPopout['message'], options?: Partial<P>);

  /**
   * The displayed Chat Message entity
   */
  message: ChatMessage;

  /**
   * @override
   * @defaultValue
   * ```typescript
   * mergeObject(super.defaultOptions, {
   *   width: 300,
   *   height: "auto",
   *   classes: ["chat-popout"]
   * })
   * ```
   */
  static get defaultOptions(): typeof Application['defaultOptions'];

  /** @override */
  get id(): string;

  /** @override */
  get title(): string;

  /**
   * @param data    - (unused)
   * @param options - (unused)
   * @override
   */
  protected _renderInner(data?: any, options?: any): ReturnType<this['message']['render']>;
}
