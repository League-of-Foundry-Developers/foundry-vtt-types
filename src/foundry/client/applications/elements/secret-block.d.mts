import type AdoptableHTMLElement from "./adoptable-element.d.mts";

/**
 * A custom HTML element used to wrap secret blocks in HTML content in order to provide additional interactivity.
 * @remarks Fires change - A "change" event when the reveal button is clicked. The event only reports the click; the
 * element does not toggle itself, the listener is expected to call {@linkcode HTMLSecretBlockElement.toggleRevealed | #toggleRevealed}
 * and persist the result.
 */
declare class HTMLSecretBlockElement extends AdoptableHTMLElement {
  /** @defaultValue `"secret-block"` */
  static tagName: string;

  /**
   * The wrapped secret block.
   * @privateRemarks Foundry doesn't type the 'not found' `null` case
   */
  get secret(): HTMLElement | null;

  /**
   * The revealed state of the secret block.
   * @throws If this element has no `.secret` child; see {@linkcode HTMLSecretBlockElement.secret | #secret}.
   */
  get revealed(): boolean;

  /**
   * Show the button to toggle the revealed state?
   * @defaultValue `true`
   */
  get revealable(): boolean;

  set revealable(value: boolean);

  /**
   * @throws If this element has no `.secret` child, as the reveal button is inserted into it; see
   * {@linkcode HTMLSecretBlockElement.secret | #secret}.
   */
  connectedCallback(): void;

  /**
   * Toggle the secret revealed or hidden state in content that this secret block represents.
   * @param content - The raw string content for this secret.
   * @returns The modified raw content.
   * @throws If this element has no `.secret` child, whose `id` the replacement is keyed on; see
   * {@linkcode HTMLSecretBlockElement.secret | #secret}.
   * @remarks This works off a janky regex that requires no attributes that use the letter `i` between the `<section` and `id=` parts of the
   * passed markup. The replace it does will destroy any existing attributes on that `<section` other than `id`.
   */
  toggleRevealed(content: string): string;

  #HTMLSecretBlockElement: true;
}

export default HTMLSecretBlockElement;
