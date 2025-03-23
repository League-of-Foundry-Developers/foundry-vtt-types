import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * Scene controls navigation menu
   * @typeParam Options - the type of the options object
   */
  class SceneControls<Options extends Application.Options = Application.Options> extends Application<Options> {
    constructor(options?: Partial<Options>);

    /**
     * The name of the active Scene Control toolset
     * @defaultValue `"token"`
     */
    activeControl: string;

    /**
     * The Array of Scene Control buttons which are currently rendered
     */
    controls: SceneControls.Control[];

    /**
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
    static override get defaultOptions(): Application.Options;

    /**
     * Return the active control set
     */
    get control(): SceneControls.Control | null;

    /**
     * Return the name of the active tool within the active control set
     */
    get activeTool(): string | null;

    /**
     * Return the actively controlled tool
     */
    get tool(): SceneControls.Tool | null;

    /**
     * A convenience reference for whether the currently active tool is a Ruler
     */
    get isRuler(): boolean;

    /**
     * Initialize the Scene Controls by obtaining the set of control buttons and rendering the HTML
     * @param options - Options which modify how the controls UI is initialized
     *                  (defaultValue: `{}`)
     */
    initialize(options?: SceneControls.InitializeOptions): void;

    override getData(options?: Partial<Options>): {
      controls: SceneControls.Control[];
      active: boolean;
      cssClass: "" | "disabled";
    };

    override activateListeners(html: JQuery): void;

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
    protected _getControlButtons(): SceneControls.Control[];
  }

  namespace SceneControls {
    interface Any extends AnySceneControls {}
    interface AnyConstructor extends Identity<typeof AnySceneControls> {}

    interface ToolBase {
      name: string;
      title: string;
      icon: string;
      visible?: boolean;
      active?: boolean;
      toolclip?: ToolclipConfiguration;
    }

    interface ToolToggle extends ToolBase {
      toggle: true;
      onClick?: (toggled: boolean) => void;
    }

    interface ToolNoToggle extends ToolBase {
      toggle?: false;
      button?: boolean;
      onClick?: () => void;
    }

    type Tool = ToolToggle | ToolNoToggle;

    interface Control {
      name: string;
      title: string;
      layer: string;
      icon: string;
      visible: boolean;
      tools: SceneControls.Tool[];
      activeTool: string;
    }

    interface ToolclipConfiguration {
      /** The filename of the toolclip video. */
      src: string;

      /** The heading string. */
      heading: string;

      /** The items in the toolclip body. */
      items: ToolclipConfigurationItem[];
    }

    interface ToolclipConfigurationItem {
      /** A plain paragraph of content for this item. */
      paragraph?: string;

      /** A heading for the item. */
      heading?: string;

      /** Content for the item. */
      content?: string;

      /** If the item is a single key reference, use this instead of content. */
      reference?: string;
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
  }

  /**
   * @deprecated {@link SceneControls.InitializeOptions | `SceneControls.InitializeOptions`}
   */
  type InitializeOptions = SceneControls.InitializeOptions;

  /**
   * @deprecated {@link SceneControls.ToolBase | `SceneControls.ToolBase`}
   */
  type SceneControlToolBase = SceneControls.ToolBase;

  /**
   * @deprecated {@link SceneControls.ToolToggle | `SceneControls.ToolToggle`}
   */
  type SceneControlToolToggle = SceneControls.ToolToggle;

  /**
   * @deprecated {@link SceneControls.ToolNoToggle | `SceneControls.ToolNoToggle`}
   */
  type SceneControlToolNoToggle = SceneControls.ToolNoToggle;

  /**
   * @deprecated {@link SceneControls.Tool | `SceneControls.Tool`}
   */
  type SceneControlTool = SceneControls.Tool;

  /**
   * @deprecated {@link SceneControls.Control | `SceneControls.Control`}
   */
  type SceneControl = SceneControls.Control;

  /**
   * @deprecated {@link SceneControls.ToolclipConfiguration | `SceneControls.ToolclipConfiguration`}
   */
  type ToolclipConfiguration = SceneControls.ToolclipConfiguration;

  /**
   * @deprecated {@link SceneControls.ToolclipConfigurationItem | `SceneControls.ToolclipConfigurationItem`}
   */
  type ToolclipConfigurationItem = SceneControls.ToolclipConfigurationItem;
}

declare abstract class AnySceneControls extends SceneControls<Application.Options> {
  constructor(...args: never);
}
