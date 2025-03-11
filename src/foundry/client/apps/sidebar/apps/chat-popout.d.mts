export {};

declare global {
  /**
   * A simple application which supports popping a ChatMessage out to a separate UI window.
   * @typeParam Options - the type of the options object
   */
  class ChatPopout<Options extends Application.Options = Application.Options> extends Application<Options> {
    constructor(message: ChatMessage.Implementation, options?: Partial<Options>);

    /**
     * The displayed Chat Message document
     */
    message: ChatMessage.Implementation;

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
    static override get defaultOptions(): Application.Options;

    override get id(): string;

    override get title(): string;

    /** @remarks Foundry references an options object as a second argument, but this is never used nor provided in the invocation */
    protected override _renderInner(data: ReturnType<this["getData"]>): Promise<JQuery>;
  }

  namespace ChatPopout {
    type Any = ChatPopout<any>;
  }
}
