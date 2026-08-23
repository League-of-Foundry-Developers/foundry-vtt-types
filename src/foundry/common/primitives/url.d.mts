/**
 * Attempt to parse a URL without throwing an error.
 * @param url - The string to parse.
 * @returns The parsed URL if successful, otherwise null.
 * @deprecated "URL.parseSafe is deprecated. Please use the native URL.parse instead." (since v14, until v16)
 *
 * @privateRemarks Assigned to `URL` by this module, but the global augmentation for it is non-functional
 * upstream, so this export is the only place the signature is reachable.
 */
export function parseSafe(url: string): URL | null;
