export {};

declare global {
  // Non-functional due to upstream
  // https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1379
  // Foundry deprecated its override in v14 in favour of the native `URL.parse`
  // (https://developer.mozilla.org/en-US/docs/Web/API/URL/parse_static), which is a drop-in replacement
  // const URL: {
  //   prototype: URL;
  //   new (url: string | URL, base?: string | URL): URL;
  //   createObjectURL(obj: Blob | MediaSource): string;
  //   revokeObjectURL(url: string): void;
  //   canParse(url: string | URL, base?: string | URL): boolean;
  //   parse(url: string | URL, base?: string | URL): URL | null;
  //   /**
  //    * Attempt to parse a URL without throwing an error.
  //    * @param url - The string to parse.
  //    * @returns The parsed URL if successful, otherwise null.
  //    * @deprecated "URL.parseSafe is deprecated. Please use the native URL.parse instead." (since v14, until v16)
  //    */
  //   parseSafe(url: string): URL | null;
  // };
}
