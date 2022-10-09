interface String {
  /**
   * Capitalize a string, transforming it's first character to a capital letter
   */
  capitalize<S extends string>(this: S): Capitalize<S>;

  /**
   * Convert a string to Title Case where the first letter of each word is capitalized
   */
  titleCase<S extends string>(this: S): Titlecase<S>;

  /**
   * Strip any <script> tags which were included within a provided string
   */
  stripScripts(): string;

  /**
   * Transform any string into a url-viable slug string
   * @param options - Optional arguments which customize how the slugify operation is performed
   * @returns The slugified input string
   */
  slugify(options?: String.SlugifyOptions): string;
}

declare namespace String {
  interface SlugifyOptions {
    /**
     * The replacement character to separate terms
     * @defaultValue `"-"`
     */
    replacement?: string;

    /**
     * Replace all non-alphanumeric characters, or allow them?
     * @defaultValue `false`
     */
    strict?: boolean;
  }
}
