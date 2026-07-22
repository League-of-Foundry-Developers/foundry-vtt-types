import type HTMLStringTagsElement from "./string-tags.d.mts";

/**
 * A custom HTMLElement used to render a tagged set of 2D grid offsets.
 */
export declare class HTMLGridOffset2DTagsElement extends HTMLStringTagsElement {
  /** @defaultValue `"grid-offset-2d-tags"` */
  static override tagName: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   add: "fa-solid fa-square-plus",
   *   remove: "fa-solid fa-square-minus"
   * }
   * ```
   */
  static override icons: HTMLStringTagsElement.Icons;

  /**
   * @defaultValue
   * ```js
   * {
   *   add: "ELEMENTS.TAGS.AddGridOffset",
   *   remove: "ELEMENTS.TAGS.RemoveGridOffset",
   *   placeholder: "i.j"
   * }
   * ```
   */
  static override labels: HTMLStringTagsElement.Labels;

  /**
   * @throws If the tag does not match the pattern `i.j` (e.g. `"1.-2"`)
   */
  protected override _validateTag(tag: string): void;
}

/**
 * A custom HTMLElement used to render a tagged set of 3D grid offsets.
 */
export declare class HTMLGridOffset3DTagsElement extends HTMLStringTagsElement {
  /** @defaultValue `"grid-offset-3d-tags"` */
  static override tagName: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   add: "fa-solid fa-square-plus",
   *   remove: "fa-solid fa-square-minus"
   * }
   * ```
   */
  static override icons: HTMLStringTagsElement.Icons;

  /**
   * @defaultValue
   * ```js
   * {
   *   add: "ELEMENTS.TAGS.AddGridOffset",
   *   remove: "ELEMENTS.TAGS.RemoveGridOffset",
   *   placeholder: "i.j.k"
   * }
   * ```
   */
  static override labels: HTMLStringTagsElement.Labels;

  /**
   * @throws If the tag does not match the pattern `i.j.k` (e.g. `"1.-2.0"`)
   */
  protected override _validateTag(tag: string): void;
}
