/**
 * A controller class for managing a text input widget that filters the contents of some other UI element
 * @see {@link Application}
 *
 */
declare class SearchFilter {
  /**
   * @param inputSelector   - The CSS selector used to target the text input element.
   * @param contentSelector - The CSS selector used to target the content container for these tabs.
   * @param initial         - The initial value of the search query.
   *                          (default: `''`)
   * @param callback        - A callback function which executes when the filter changes.
   * @param delay           - The number of milliseconds to wait for text input before processing.
   *                          (default: `100`)
   */
  constructor({
    inputSelector,
    contentSelector,
    initial,
    callback,
    delay
  }: {
    inputSelector: string;
    contentSelector: string;
    initial?: SearchFilter['query'];
    callback: SearchFilter['callback'];
    delay?: number;
  });

  /**
   * The value of the current query string
   */
  query: string;

  /**
   * A callback function to trigger when the tab is changed
   */
  callback: (event: KeyboardEvent, query: string, content: string) => void;

  /**
   * The CSS selector used to target the tab navigation element
   */
  protected _inputSelector: string;

  /**
   * A reference to the HTML navigation element the tab controller is bound to
   */
  protected _input: HTMLElement | null;

  /**
   * The CSS selector used to target the tab content element
   */
  protected _contentSelector: string;

  /**
   * A reference to the HTML container element of the tab content
   */
  protected _content: HTMLElement | null;

  /**
   * A debounced function which applies the search filtering
   */
  protected _filter: this['callback'];

  /**
   * Bind the SearchFilter controller to an HTML application
   */
  bind(html: HTMLElement): void;

  /**
   * Handle key-up events within the filter input field
   * @param event - The key-up event
   */
  protected _onKeyUp(event: KeyboardEvent): void;
}
