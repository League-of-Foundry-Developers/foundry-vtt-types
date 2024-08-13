export {};

declare global {
  /**
   * @param secret - The secret element whose surrounding content we wish to retrieve.
   * @returns The content where the secret is housed.
   */
  type HTMLSecretContentCallback = (secret: HTMLElement) => string;

  /**
   * @param secret  - The secret element that is being manipulated.
   * @param content - The content block containing the updated secret element.
   * @returns The updated Document.
   */
  type HTMLSecretUpdateCallback<
    ConcreteDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
  > = (secret: HTMLElement, content: string) => Promise<ConcreteDocument>;

  interface HTMLSecretConfiguration<
    ConcreteDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any,
  > {
    /** The CSS selector used to target content that contains secret blocks. */
    parentSelector: string;

    /** An object of callback functions for each operation. */
    callbacks: {
      content: HTMLSecretContentCallback;
      update: HTMLSecretUpdateCallback<ConcreteDocument>;
    };
  }

  /**
   * A composable class for managing functionality for secret blocks within DocumentSheets.
   * @see DocumentSheet
   * @example Activate secret revealing functionality within a certain block of content.
   * ```js
   * const secrets = new HTMLSecret({
   *   selector: "section.secret[id]",
   *   callbacks: {
   *     content: this._getSecretContent.bind(this),
   *     update: this._updateSecret.bind(this)
   *   }
   * });
   * secrets.bind(html);
   * ```
   */
  class HTMLSecret<ConcreteDocument extends foundry.abstract.Document.Any = foundry.abstract.Document.Any> {
    /**
     * @param config - Configuration options.
     */
    constructor(
      config: Omit<HTMLSecretConfiguration<ConcreteDocument>, "callbacks"> &
        Partial<Pick<HTMLSecretConfiguration<ConcreteDocument>, "callbacks">>,
    );

    /** The CSS selector used to target secret blocks. */
    readonly parentSelector: string;

    /** An object of callback functions for each operation. */
    readonly callbacks: Readonly<HTMLSecretConfiguration<ConcreteDocument>["callbacks"]>;

    /**
     * Add event listeners to the targeted secret blocks.
     * @param html - The HTML content to select secret blocks from.
     */
    bind(html: HTMLElement): void;

    /**
     * Handle toggling a secret's revealed state.
     * @param event - The triggering click event.
     * @returns The Document whose content was modified.
     */
    protected _onToggleSecret(event: MouseEvent): ConcreteDocument | void;
  }
}
