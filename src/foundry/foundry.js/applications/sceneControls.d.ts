declare interface SceneControlTool {
  name: string;
  title: string;
  icon: string;
  visible?: boolean;
  toggle?: boolean;
  active?: boolean;
  button?: boolean;
  onClick?: () => void;
}

declare interface SceneControl {
  name: string;
  title: string;
  layer: string;
  icon: string;
  visible: boolean;
  tools: SceneControlTool[];
  activeTool: string;
}

/**
 * Scene controls navigation menu
 * @typeParam Options - the type of the options object
 */
declare class SceneControls<Options extends Application.Options = Application.Options> extends Application<Options> {
  constructor(options?: Partial<Options>);

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
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   width: 100,
   *   id: "controls",
   *   template: "templates/hud/controls.html",
   *   popOut: false,
   * })
   * ```
   */
  static get defaultOptions(): SceneControls.Options;

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
   * @param options - Options which modify how the controls UI is initialized
   *                  (defaultValue: `{}`)
   */
  initialize(options?: InitializeOptions): void;

  /** @override */
  getData(options?: Partial<Options>): {
    active: boolean;
    cssClass: '' | 'disabled';
    controls: SceneControl[];
  };

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Handle click events on a Control set
   * @param event - A click event on a tool control
   */
  protected _onClickLayer(event: JQuery.ClickEvent): void;

  /**
   * Handle click events on Tool controls
   * @param event - A click event on a tool control
   */
  protected _onClickTool(event: JQuery.ClickEvent): void;

  /**
   * Get the set of Control sets and tools that are rendered as the Scene Controls.
   * These controls may be extended using the "getSceneControlButtons" Hook.
   */
  protected _getControlButtons(): SceneControl[];
}

declare namespace SceneControls {
  export interface Options extends Application.Options {
    /**
     * @defaultValue `100`
     */
    width: number;

    /**
     * @defaultValue `"controls"`
     */
    id: string;

    /**
     * @defaultValue `"templates/hud/controls.html"`
     */
    template: string;

    /**
     * @defaultValue `false`
     */
    popOut: boolean;
  }
}

interface InitializeOptions {
  /**
   * An optional control set to set as active
   */
  control?: string;

  /**
   * An optional layer name to target as the active control
   */
  layer?: string;

  /**
   * A specific named tool to set as active for the palette
   */
  tool?: string;
}
