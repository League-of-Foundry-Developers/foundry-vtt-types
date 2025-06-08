import type Document from "#common/abstract/document.d.mts";

/**
 * A composable class for managing functionality for secret blocks within DocumentSheets.
 * @see {@link foundry.applications.api.DocumentSheet}
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
declare class HTMLSecret<ConcreteDocument extends Document.Any = Document.Any> {
  /**
   * @param config - Configuration options.
   */
  constructor(config: HTMLSecret.Configuration<ConcreteDocument>);

  /** The CSS selector used to target secret blocks. */
  readonly parentSelector: string;

  /** An object of callback functions for each operation. */
  readonly callbacks: Readonly<HTMLSecret.Callbacks<ConcreteDocument>>;

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

declare namespace HTMLSecret {
  /**
   * @param secret - The secret element whose surrounding content we wish to retrieve.
   * @returns The content where the secret is housed.
   */
  type ContentCallback = (secret: HTMLElement) => string;

  /**
   * @param secret  - The secret element that is being manipulated.
   * @param content - The content block containing the updated secret element.
   * @returns The updated Document.
   */
  type UpdateCallback<ConcreteDocument extends Document.Any = Document.Any> = (
    secret: HTMLElement,
    content: string,
  ) => Promise<ConcreteDocument>;

  interface Configuration<ConcreteDocument extends Document.Any = Document.Any> {
    /** The CSS selector used to target content that contains secret blocks. */
    parentSelector: string;

    /** An object of callback functions for each operation. */
    callbacks?: Callbacks<ConcreteDocument> | undefined;
  }

  interface Callbacks<ConcreteDocument extends Document.Any = Document.Any> {
    content: HTMLSecret.ContentCallback;
    update: HTMLSecret.UpdateCallback<ConcreteDocument>;
  }
}

export default HTMLSecret;
