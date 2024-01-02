export {};

declare global {
  /**
   * A simple application which supports popping a ChatMessage out to a separate UI window.
   * @typeParam Options - the type of the options object
   */
  class ChatPopout<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(message: InstanceType<ConfiguredChatMessage>, options?: Partial<Options>);

    /**
     * The displayed Chat Message document
     */
    message: InstanceType<ConfiguredChatMessage>;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   width: 300,
     *   height: "auto",
     *   classes: ["chat-popout"]
     * })
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    override get id(): string;

    override get title(): string;

    protected override _renderInner(data: object, options?: unknown): Promise<JQuery>;
  }
}
