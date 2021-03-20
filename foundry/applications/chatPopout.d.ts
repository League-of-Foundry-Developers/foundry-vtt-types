declare class ChatPopout extends Application {
  constructor(message: ChatPopout['message'], options?: Partial<Application.Options>);

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
  static get defaultOptions(): Application.Options;

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
