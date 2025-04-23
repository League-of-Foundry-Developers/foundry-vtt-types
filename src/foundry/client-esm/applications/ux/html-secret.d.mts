/**
 * A composable class for managing functionality for secret blocks within DocumentSheets.
 * @see {@link foundry.applications.api.DocumentSheet}
 * @example Activate secret revealing functionality within a certain block of content.
 * ```js
 * const secrets = new HTMLSecret({
 *   selector: "section.secret[id]",
 *   callbacks: {
 *     content: this._getSecretContent.bind(this),
 *     update: this._updateSecret.bind(this)
 *   }
 * });
 * secrets.bind(html);
 * ```
 * @remarks TODO: Stub, copy from v12 implementation & update
 */
declare class HTMLSecret {}

declare namespace HTMLSecret {}

export default HTMLSecret;
