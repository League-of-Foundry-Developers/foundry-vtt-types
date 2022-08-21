/** Options which customize the behavior of the filter */
interface SearchFilterConfiguration {
  /**
   * The CSS selector used to target the text input element.
   */
  inputSelector: string;

  /**
   * The CSS selector used to target the content container for these tabs.
   */
  contentSelector: string;

  /**
   * A callback function which executes when the filter changes.
   */
  callback?: SearchFilter["callback"];

  /**
   * The initial value of the search query.
   * @defaultValue `""`
   */
  initial?: SearchFilter["query"] | undefined;

  /**
   * The number of milliseconds to wait for text input before processing.
   * @defaultValue `100`
   */
  delay?: number;
}

/**
 * A controller class for managing a text input widget that filters the contents of some other UI element
 * @see {@link Application}
 */
declare class SearchFilter {
  /**
   * @param options - Options which customize the behavior of the filter
   */
  constructor(options: SearchFilterConfiguration);

  /**
   * The value of the current query string
   */
  query: string;

  /**
   * A callback function to trigger when the tab is changed
   */
  callback: (event: KeyboardEvent, query: string, rgx: RegExp, content: string) => void;

  /**
   * The regular expression corresponding to the query that should be matched against
   * @defaultValue `undefined`
   */
  rgx: RegExp | undefined;

  /**
   * The CSS selector used to target the tab navigation element
   * @internal
   */
  protected _inputSelector: string;

  /**
   * A reference to the HTML navigation element the tab controller is bound to
   * @internal
   */
  protected _input: HTMLElement | null;

  /**
   * The CSS selector used to target the tab content element
   * @internal
   */
  protected _contentSelector: string;

  /**
   * A reference to the HTML container element of the tab content
   * @internal
   */
  protected _content: HTMLElement | null;

  /**
   * A debounced function which applies the search filtering
   * @internal
   */
  protected _filter: (...args: Parameters<this["callback"]>) => void;

  /**
   * Bind the SearchFilter controller to an HTML application
   */
  bind(html: HTMLElement): void;

  /**
   * Perform a filtering of the content by invoking the callback function
   * @param event - The triggering keyboard event
   * @param query - The input search string
   */
  filter(event: KeyboardEvent, query: string): void;

  /**
   * Clean a query term to standardize it for matching.
   * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
   * @param query - An input string which may contain leading/trailing spaces or diacritics
   * @returns A cleaned string of ASCII characters for comparison
   */
  static cleanQuery(query: string): string;
}
