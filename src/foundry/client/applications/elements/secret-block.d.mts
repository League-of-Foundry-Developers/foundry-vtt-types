import type AdoptableHTMLElement from "./adoptable-element.d.mts";

/**
 * A custom HTML element used to wrap secret blocks in HTML content in order to provide additional interactivity.
 */
declare class HTMLSecretBlockElement extends AdoptableHTMLElement {
  /** @defaultValue `"secret-block"` */
  static tagName: string;

  /**
   * The wrapped secret block
   * @privateRemarks Foundry doesn't type the 'not found' `null` case
   */
  get secret(): HTMLElement | null;

  /**
   * The revealed state of the secret block
   */
  get revealed(): boolean;

  /**
   * Show the button to toggle the revealed state?
   */
  get revealable(): boolean;

  set revealable(value: boolean);

  connectedCallback(): void;

  /**
   * Toggle the secret revealed or hidden state in content that this secret block represents.
   * @param content - The raw string content for this secret.
   * @returns The modified raw content.
   * @remarks This works off a janky regex that requires no attributes that use the letter `i` between the `<section` and `id=` parts of the
   * passed markup. The replace it does will destroy any existing attributes on that `<section` other than `id`.
   */
  toggleRevealed(content: string): string;

  #HTMLSecretBlockElement: true;
}

export default HTMLSecretBlockElement;
