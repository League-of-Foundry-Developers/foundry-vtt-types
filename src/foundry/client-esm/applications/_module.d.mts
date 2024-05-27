export * as types from "./_types.mts";
export * as api from "./api/_module.mts";
export * as dice from "./dice/_module.mts";
export * as elements from "./elements/_module.mts";
export * as fields from "./forms/fields.mts";
export * as apps from "./apps/_module.mts";
export * as sheets from "./sheets/_module.mts";
export * as ui from "./ui/_module.mts";

/**
 * A registry of currently rendered ApplicationV2 instances.
 */
export const instances: Map<number, foundry.applications.api.ApplicationV2>;

/**
 * Parse an HTML string, returning a processed HTMLElement or HTMLCollection.
 * A single HTMLElement is returned if the provided string contains only a single top-level element.
 * An HTMLCollection is returned if the provided string contains multiple top-level elements.
 */
export function parseHTML(htmlString: string): HTMLCollection | HTMLElement;
