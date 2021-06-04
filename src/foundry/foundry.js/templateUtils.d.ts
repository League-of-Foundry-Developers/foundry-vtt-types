/**
 * Global template cache
 */
declare let _templateCache: Record<string, Handlebars.TemplateDelegate>;

/* -------------------------------------------- */
/*  HTML Template Loading                       */
/* -------------------------------------------- */

/**
 * Get a template from the server by fetch request and caching the retrieved result
 * @param path - The web-accessible HTML template URL
 * @returns A Promise which resolves to the compiled Handlebars template
 */
declare function getTemplate(path: string): Promise<Handlebars.TemplateDelegate>;

/* -------------------------------------------- */

/**
 * Load and cache a set of templates by providing an Array of paths
 * @param paths - An array of template file paths to load
 */
declare function loadTemplates(paths: string[]): Promise<Handlebars.TemplateDelegate[]>;

/* -------------------------------------------- */

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
 * @returns Returns the rendered HTML
 */
declare function renderTemplate(path: string, data: object): Promise<string>;
