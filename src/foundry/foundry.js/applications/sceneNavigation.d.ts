// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

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
  static get defaultOptions(): typeof Application['defaultOptions'];

  /**
   * Return an Array of Scenes which are displayed in the Navigation bar
   */
  get scenes(): Scene[];

  /** @override */
  render(force?: boolean, options?: Application.RenderOptions): this | undefined;

  /** @override */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /** @override */
  getData(options?: Partial<Application.Options>): SceneNavigation.Data | Promise<SceneNavigation.Data>;

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
  private _getContextMenuOptions(): ContextMenuEntry[];

  /**
   * Handle left-click events on the scenes in the navigation menu
   */
  private _onClickScene(event: JQuery.ClickEvent): void;

  /** @override */
  protected _onDragStart(event: DragEvent): void;

  /**
   * @override
   * @internal
   */
  protected _onDrop(event: DragEvent): void;

  /** @override */
  private _onToggleNav(event: JQuery.ClickEvent): void;

  /**
   * Updated the loading progress bar
   * @param context - The message to display in the progress back
   * @param pct     - The percentage the progress bar has completed
   */
  static _onLoadProgress(context: string, pct: number): void;
}

declare namespace SceneNavigation {
  interface Data {
    collapsed: boolean;
    scenes: (foundry.utils.Duplicated<Scene['data']> & {
      users: { letter: string; color: User['data']['color'] };
      visible: boolean;
      css: [string | null];
    })[];
  }
}
