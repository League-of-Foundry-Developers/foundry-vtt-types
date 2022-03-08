import type { ConfiguredDocumentClass } from '../../../types/helperTypes';

declare global {
  /**
   * A simple application which supports popping a ChatMessage out to a separate UI window.
   * @typeParam Options - the type of the options object
   */
  class ChatPopout<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(message: InstanceType<ConfiguredDocumentClass<typeof ChatMessage>>, options?: Partial<Options>);

    /**
     * The displayed Chat Message entity
     */
    message: InstanceType<ConfiguredDocumentClass<typeof ChatMessage>>;

    /**
     * @override
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   width: 300,
     *   height: "auto",
     *   classes: ["chat-popout"]
     * })
     * ```
     */
    static get defaultOptions(): ApplicationOptions;

    /** @override */
    get id(): string;

    /** @override */
    get title(): string;

    /**
     * @param data    - (unused)
     * @param options - (unused)
     * @override
     */
    protected _renderInner(data: object, options?: unknown): Promise<JQuery>;
  }
}
