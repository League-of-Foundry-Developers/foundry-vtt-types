import type AdoptableHTMLElement from "./adoptable-element.d.mts";

/**
 * A custom HTMLElement that is used to wrap enriched content that requires additional interactivity.
 */
export default class HTMLDocumentEmbedElement extends AdoptableHTMLElement {
  /**
   * The HTML tag named used by this element.
   * @defaultValue `"document-embed"`
   */
  static tagName: string;

  /**
   * Invoke the Document#onEmbed callback when it is added to the DOM.
   */
  connectedCallback(): void;
}
