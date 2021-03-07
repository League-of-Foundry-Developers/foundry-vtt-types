declare interface SceneControl {
  activeTool: string;
  icon: string;
  layer: string;
  name: string;
  title: string;
  tools: SceneControlTool[];
  visible: boolean;
}

declare interface SceneControlTool {
  active?: boolean;
  button?: boolean;
  icon: string;
  name: string;
  onClick?: () => void;
  title: string;
  toggle?: boolean;
  visible?: boolean;
}

/**
 * Scene controls navigation menu
 */
declare class SceneControls extends Application {
  constructor(options: Application.Options);

  /**
   * The name of the active Scene Control toolset
   * @defaultValue `"token"`
   */
  activeControl: string;

  /**
   * The Array of Scene Control buttons which are currently rendered
   */
  controls: SceneControl[];

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.defaultOptions, {
   *   width: 100,
   *   id: "controls",
   *   template: "templates/hud/controls.html",
   *   popOut: false,
   * })
   * ```
   */
  static get defaultOptions(): Application.Options;

  /**
   * Return the active control set
   */
  get control(): SceneControl | null;

  /**
   * Return the name of the active tool within the active control set
   */
  get activeTool(): string | null;

  /**
   * Return the actively controlled tool
   */
  get tool(): SceneControlTool | null;

  /**
   * A convenience reference for whether the currently active tool is a Ruler
   */
  get isRuler(): boolean;

  /**
   * Initialize the Scene Controls by obtaining the set of control buttons and rendering the HTML
   * @param control - An optional control set to set as active
   * @param layer   - An optional layer name to target as the active control
   * @param tool    - A specific named tool to set as active for the palette
   */
  initialize({ control, layer, tool }?: { control?: string; layer?: string; tool?: string }): void;

  /** @override */
  getData(
    options?: Application.RenderOptions
  ): { active: boolean; cssClass: '' | 'disabled'; controls: SceneControl[] };

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Handle click events on a Control set
   * @param event - A click event on a tool control
   */
  protected _onClickLayer(event: JQuery.Event): void;

  /**
   * Handle click events on Tool controls
   * @param event - A click event on a tool control
   */
  protected _onClickTool(event: JQuery.Event): void;

  /**
   * Get the set of Control sets and tools that are rendered as the Scene Controls.
   * These controls may be extended using the "getSceneControlButtons" Hook.
   */
  protected _getControlButtons(): SceneControl[];
}
