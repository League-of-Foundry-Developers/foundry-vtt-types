// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export * as types from "./_types.mjs";
export * as api from "./api/_module.mjs";
export * as dice from "./dice/_module.mjs";
export * as elements from "./elements/_module.mjs";
export * as fields from "./forms/fields.mjs";
export * as apps from "./apps/_module.mjs";
export * as sheets from "./sheets/_module.mjs";
export * as ui from "./ui/_module.mjs";

/**
 * A registry of currently rendered ApplicationV2 instances.
 */
export const instances: Map<string, foundry.applications.api.ApplicationV2.Any>;

/**
 * Parse an HTML string, returning a processed HTMLElement or HTMLCollection.
 * A single HTMLElement is returned if the provided string contains only a single top-level element.
 * An HTMLCollection is returned if the provided string contains multiple top-level elements.
 */
export function parseHTML(htmlString: string): HTMLCollection | HTMLElement;
