/**
 * An HTMLElement implementation which provides extra resilience when being adopted across Documents, working around a
 * Firefox bug that causes them to lose their custom prototypes.
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1502814
 */
declare abstract class AdoptableHTMLElement extends HTMLElement {
  /**
   * Called when the element is moved into a new Document.
   */
  adoptedCallback(): void;

  /**
   * Called when the element is first removed from a Document. In cases where it is then moved into another Document,
   * this callback is invoked before adoptedCallback, so we must also re-apply the prototype here so that subclasses
   * have any disconnectedCallback overrides invoked appropriately.
   */
  disconnectedCallback(): void;
}

export default AdoptableHTMLElement;
