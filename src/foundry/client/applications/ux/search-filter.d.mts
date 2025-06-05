import type { ValueOf } from "#utils";

/**
 * A controller class for managing a text input widget that filters the contents of some other UI element.
 */
declare class SearchFilter {
  /**
   * @param options - Options which customize the behavior of the filter
   */
  constructor(options: SearchFilter.Configuration);

  /**
   * The value of the current query string
   */
  query: string;

  /**
   * A callback function to trigger when the tab is changed
   */
  callback: SearchFilter.Callback;

  /**
   * The allowed Filter Operators which can be used to define a search filter
   */
  static OPERATORS: Readonly<SearchFilter.Operators>;

  /**
   * The regular expression corresponding to the query that should be matched against
   * @defaultValue `undefined`
   */
  rgx: RegExp | undefined;

  /**
   * A reference to the HTML navigation element the tab controller is bound to
   */
  _input: HTMLElement | null;

  /**
   * Bind the SearchFilter controller to an HTML application
   */
  bind(html: HTMLElement): void;

  /**
   * Release all bound HTML elements and reset the query.
   */
  unbind(): void;

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

  /**
   * A helper method to test a value against a precomposed regex pattern.
   * @param rgx   - The regular expression to test
   * @param value - THe value to test against
   * @returns Does the query match?
   */
  static testQuery(rgx: RegExp, value: string): boolean;

  /**
   * Test whether a given object matches a provided filter
   * @param obj    - An object to test against
   * @param filter - The filter to test
   * @returns Whether the object matches the filter
   * @remarks obj needs to work with both Document.Any *and* plain objects
   */
  static evaluateFilter(obj: object, filter: SearchFilter.FieldFilter): boolean;
}

declare namespace SearchFilter {
  type Callback = (event: KeyboardEvent | null, query: string, rgx: RegExp, content: HTMLElement | null) => void;

  interface Operators {
    EQUALS: "equals";
    CONTAINS: "contains";
    STARTS_WITH: "starts_with";
    ENDS_WITH: "ends_with";
    LESS_THAN: "lt";
    LESS_THAN_EQUAL: "lte";
    GREATER_THAN: "gt";
    GREATER_THAN_EQUAL: "gte";
    BETWEEN: "between";
    IS_EMPTY: "is_empty";
  }

  /** Options which customize the behavior of the filter */
  interface Configuration {
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
    callback?: Callback | undefined;

    /**
     * The initial value of the search query.
     * @defaultValue `""`
     */
    initial?: SearchFilter["query"] | undefined;

    /**
     * The number of milliseconds to wait for text input before processing.
     * @defaultValue `200`
     */
    delay?: number | undefined;
  }

  interface FieldFilter {
    /** The dot-delimited path to the field being filtered */
    field: string;

    /**
     * The search operator, from CONST.OPERATORS
     * @defaultValue `SearchFilter.OPERATORS.EQUALS`
     */
    operator?: ValueOf<typeof SearchFilter.OPERATORS> | undefined;

    /**
     * Negate the filter, returning results which do NOT match the filter criteria
     * @remarks Defaults to false because undefined is falsy
     */
    negate?: boolean | undefined;

    /** The value against which to test */
    value: any;
  }
}

export default SearchFilter;
