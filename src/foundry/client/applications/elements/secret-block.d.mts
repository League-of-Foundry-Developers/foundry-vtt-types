/**
 * A custom HTML element used to wrap secret blocks in HTML content in order to provide additional interactivity.
 * @privateRemarks TODO: Stub
 */
declare class HTMLSecretBlockElement extends HTMLElement {
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
