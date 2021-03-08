/**
 * Top menu scene navigation
 */
declare class SceneNavigation extends Application {
  /**
   * Assign the default options which are supported by the SceneNavigation UI
   * @defaultValue
   * ```typescript
   * {
   *   ...super.defaultOptions,
   *   id: 'navigation',
   *   template: 'templates/hud/navigation.html',
   *   popOut: false,
   *   dragDrop: [{dragSelector: ".scene"}]
   * }
   * ```
   */
  static get defaultOptions(): Application.Options;

  /**
   * Return an Array of Scenes which are displayed in the Navigation bar
   */
  get scenes(): Scene[];

  /** @override */
  render(force?: boolean, options?: Application.RenderOptions): Application;

  /** @override */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /** @override */
  getData(options?: Application.RenderOptions): SceneNavigation.Data | Promise<SceneNavigation.Data>;

  /**
   * Expand the SceneNavigation menu, sliding it down if it is currently collapsed
   */
  expand(): Promise<boolean>;

  /**
   * Collapse the SceneNavigation menu, sliding it up if it is currently expanded
   */
  collapse(): Promise<boolean>;

  /**
   * Activate Scene Navigation event listeners
   */
  activateListeners(html: JQuery): void;

  /**
   * Get the set of ContextMenu options which should be applied for Scenes in the menu
   */
  private _getContextMenuOptions(): ContextMenu.Item[];
}

declare namespace SceneNavigation {
  interface Data {
    collapsed: boolean;
    scenes: Scene[];
  }
}
