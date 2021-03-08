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
  render(force?: boolean, options?: Application.RenderOptions): this;

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

  /**
   * Handle left-click events on the scenes in the navigation menu
   */
  private _onClickScene(event: Event): void;

  /** @override */
  protected _onDragStart(event: DragEvent): void;

  /** @override */
  protected _onDrop(event: DragEvent): Promise<boolean | undefined | void>;

  /** @override */
  private _onToggleNav(event: Event): void;

  /**
   * Updated the loading progress bar
   * @param context- The message to display in the progress back
   * @param pct- The percentage the progress bar has completed
   */
  static _onLoadProgress(context: string, pct: number): void;
}

declare namespace SceneNavigation {
  interface Data {
    collapsed: boolean;
    scenes: Scene[];
  }
}
