export {};

declare global {
  /**
   * A simple application which supports popping a ChatMessage out to a separate UI window.
   * @typeParam Options - the type of the options object
   */
  class ChatPopout<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(message: ChatMessage.ConfiguredInstance, options?: Partial<Options>);

    /**
     * The displayed Chat Message document
     */
    message: ChatMessage.ConfiguredInstance;

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

    /** @remarks Foundry references an options object as a second argument, but this is never used nor provided in the invocation */
    protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery>;
  }

  namespace ChatPopout {
    interface Any extends ChatPopout<any> {}
  }
}
