import type { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";

declare global {
  /**
   * The UI element which displays the Scene documents which are currently enabled for quick navigation.
   *
   * @typeParam Options - the type of the options object
   */
  class SceneNavigation<Options extends ApplicationOptions = ApplicationOptions> extends Application<Options> {
    constructor(options?: Partial<Options>);

    /**
     * Navigation collapsed state
     * @internal
     */
    protected _collapsed: boolean;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: "navigation",
     *   template: "templates/hud/navigation.html",
     *   popOut: false,
     *   dragDrop: [{ dragSelector: ".scene" }],
     * })
     * ```
     */
    static override get defaultOptions(): ApplicationOptions;

    /**
     * Return an Array of Scenes which are displayed in the Navigation bar
     */
    get scenes(): InstanceType<ConfiguredDocumentClassForName<"Scene">>[];

    override render(force?: boolean, context?: Application.RenderOptions<Options>): this | void;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    override getData(options?: Partial<ApplicationOptions>): MaybePromise<object>;

    /**
     * Expand the SceneNavigation menu, sliding it down if it is currently collapsed
     */
    expand(): Promise<boolean>;

    /**
     * Collapse the SceneNavigation menu, sliding it up if it is currently expanded
     */
    collapse(): Promise<boolean>;

    override activateListeners(html: JQuery): void;

    /**
     * Get the set of ContextMenu options which should be applied for Scenes in the menu
     * @returns The Array of context options passed to the ContextMenu instance
     * @internal
     */
    protected _getContextMenuOptions(): ContextMenuEntry[];

    /**
     * Handle left-click events on the scenes in the navigation menu
     * @internal
     */
    protected _onClickScene(event: JQuery.ClickEvent): void;

    protected override _onDragStart(event: DragEvent): void;

    protected override _onDrop(event: DragEvent): void;

    /**
     * Handle navigation menu toggle click events
     * @internal
     */
    protected _onToggleNav(event: JQuery.ClickEvent): void;

    /**
     * Display progress of some major operation like loading Scene textures.
     */
    static displayProgressBar(options: SceneNavigation.DisplayProgressBarOptions): void;
  }

  namespace SceneNavigation {
    interface DisplayProgressBarOptions {
      /**
       * A text label to display
       */
      label?: string | undefined;

      /**
       * A percentage of progress between 0 and 100
       */
      pct: number;
    }
  }
}
