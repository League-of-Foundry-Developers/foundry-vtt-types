// TODO: Transfer functions into this file

import type { AnyObject } from "../../../utils/index.d.mts";

/**
 * Get and render a template using provided data and handle the returned HTML
 * Support asynchronous file template file loading with a client-side caching layer
 *
 * Allow resolution of prototype methods and properties since this all occurs within the safety of the client.
 * @see {@link https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access}
 *
 * @param path - The file path to the target HTML template
 * @param data - A data object against which to compile the template
 *
 * @returns Returns the compiled and rendered template as a string
 */
// TODO(LukeAbby): Create a registry for templates or some abstraction to make this type safe.
export function renderTemplate(path: string, data: AnyObject): Promise<string>;
