import type { AnyObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SceneControls: SceneControls.Any;
    }
  }
}

/**
 * The Scene Controls UI element.
 */
declare class SceneControls<
  RenderContext extends SceneControls.RenderContext = SceneControls.RenderContext,
  Configuration extends SceneControls.Configuration = SceneControls.Configuration,
  RenderOptions extends SceneControls.RenderOptions = SceneControls.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: SceneControls.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override readonly emittedEvents: string[];

  /**
   * Prepared data of available controls.
   */
  // TODO: Infer keys from InteractionLayer config and provide a method to register additions made via hook
  get controls(): Record<string, SceneControls.Control>;

  /**
   * The currently active control layer.
   */
  get control(): SceneControls.Control | null;

  /**
   * The tools which are available within the current control layer.
   */
  get tools(): Record<string, SceneControls.Tool>;

  /**
   * The currently active tool in the control palette.
   */
  get tool(): SceneControls.Tool | null;

  /**
   * Global palette state.
   */
  get paletteOpen(): boolean;

  /**
   * Activate a new control layer or tool.
   * This method is advantageous to use because it minimizes the amount of re-rendering necessary.
   */
  activate(options?: SceneControls.ActivateOptions): Promise<void>;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;
  protected override _preRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;
  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;
  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Update the class of the notes layer icon to reflect whether there are visible notes or not.
   * @internal
   */
  _updateNotesIcon(): void;

  /**
   * Update the active state of the preset pips.
   * @internal
   */
  _updatePresetPips(): void;

  override setPosition(position?: DeepPartial<ApplicationV2.Position>): ApplicationV2.Position | void;

  /**
   * Reusable toolclip items.
   */
  static COMMON_TOOLCLIP_ITEMS: Record<string, SceneControls.CommonToolclipItem>;

  /**
   * A helper function used to prepare an array of toolclip items.
   */
  static buildToolclipItems(
    items: Array<SceneControls.ToolclipConfigurationItem | string | null>,
  ): SceneControls.ToolclipConfigurationItem[];

  /**
   * Toggle the tool palette for the active tool.
   * @param toggle - Whether to toggle it on or off.
   */
  togglePlaceablePalette(toggle?: boolean): Promise<void>;

  /**
   * @deprecated "{@linkcode SceneControls#activeControl} is deprecated in favor of {@linkcode SceneControls#control#name}" (since v13, until v15)
   */
  get activeControl(): string;

  /**
   * @deprecated "{@linkcode SceneControls#activeTool} is deprecated in favor of {@linkcode SceneControls#tool#name}" (since v13, until v15)
   */
  get activeTool(): string | null | undefined;

  /**
   * @deprecated "{@linkcode SceneControls#initialize} is deprecated in favor of {@linkcode SceneControls#render} with `{controls, tool}` passed as render options." (since v13, until v15)
   */
  initialize(options?: SceneControls.InitializeOptions): Promise<this>;

  static #SceneControlsStatic: true;
  #SceneControls: true;
}

declare namespace SceneControls {
  interface Any extends AnySceneControls {}
  interface AnyConstructor extends Identity<typeof AnySceneControls> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    controls: ControlContext[];

    tools: ToolContext[];

    /** @remarks Whether the active tool of the active control is named `"select"`. */
    isSelect: boolean;

    /** @remarks Assigned by `_preRender` and consumed by `_onRender`. */
    activationChange: ActivationChange;
  }

  /** @remarks A {@linkcode Control} decorated by `_prepareContext` for rendering. */
  interface ControlContext extends Control {
    /** @remarks Whether this is the currently active control. */
    active: boolean;
  }

  /**
   * @remarks A {@linkcode Tool} decorated by `_prepareContext` for rendering. The tools are deep
   * cloned first, so these additions do not reach the {@linkcode SceneControls.controls} record.
   */
  interface ToolContext extends Tool {
    cssClass: string;

    showToolclip: boolean;

    /** @remarks Only set for a button tool with `createData`, while a palette class is available. */
    pip?: boolean | undefined;
  }

  /**
   * The data structure provided to the {@linkcode Control.onChange | SceneControl#onChange} callback.
   */
  interface ActivationChange {
    event: Event;

    /** @remarks `null` when the active control did not change. */
    controlChange: string | null;

    /** @remarks `null` when the active tool did not change. */
    toolChange: string | null;

    toggleChanges: Record<string, boolean>;
  }

  /**
   * The data structure for a set of controls in the {@linkcode SceneControls.controls | SceneControls#controls} record.
   */
  interface Control {
    /**
     * A unique identifier for the control
     */
    name: string;

    /**
     * An integer indicating the control's order, with 0 being at the top
     */
    order: number;

    /**
     * A title for the control: can be a localization path
     */
    title: string;

    /**
     * One or more icon classes for the control, typically Font Awesome classes such as `"fa-solid fa-face-smile"`
     */
    icon: string;

    /**
     * Whether the control should be visible to the current User
     */
    visible?: boolean | undefined;

    /** @remarks The `canvas` property name of the {@linkcode foundry.canvas.layers.PlaceablesLayer} this control set drives. */
    layer?: string | undefined;

    /** @remarks Defaulted to `{}` by `#prepareControls` when absent. */
    tools?: Record<string, Tool> | undefined;

    activeTool?: string | undefined;

    /** A callback invoked when control set is activated or deactivated */
    onChange?: ((event: Event, active: boolean) => void) | undefined;

    /** A callback invoked when a tool is activated or deactivated */
    onToolChange?: ((event: Event, tool: Tool, active: boolean) => void) | undefined;
  }

  /**
   * The data structure for a single tool in the {@linkcode Control.tools | Control#tools} record.
   */
  interface Tool {
    /**
     * An identifier for the tool, unique among the tools of its SceneControl
     */
    name: string;

    /**
     * An integer indicating the tool's order, with 0 being at the top
     */
    order: number;

    /**
     * A title for the tool: can be a localization path
     */
    title: string;

    /**
     * One or more icon classes for the tool, typically Font Awesome classes such as `"fa-solid fa-face-smile"`
     */
    icon: string;

    /**
     * Whether the tool should be visible to the current User
     */
    visible?: boolean | undefined;

    /**
     * Is the tool an on-or-off toggle?
     */
    toggle?: boolean | undefined;

    /**
     * Is the tool the currently the active one? Not applicable to toggles or buttons.
     */
    active?: boolean | undefined;

    /**
     * Is the tool a "button" in the sense of immediately resolving on click without becoming the active tool?
     */
    button?: boolean | undefined;

    /**
     * Does this tool allow interaction with placeables?
     */
    interaction?: boolean | undefined;

    /**
     * Does this tool allow placeables to be controlled?
     */
    control?: boolean | undefined;

    /**
     * Does this tool create placeables?
     */
    creation?: boolean | undefined;

    /**
     * Default creation data
     */
    createData?: AnyObject | undefined;

    /**
     * The data of the shape this tool creates
     */
    shapeData?: AnyObject | undefined;

    /** A callback invoked when the tool is activated or deactivated */
    onChange?: ((event: Event, active: boolean) => void) | undefined;

    /** Configuration for rendering the tool's toolclip */
    toolclip?: ToolclipConfiguration | undefined;
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
    paragraph?: string | undefined;

    /** A heading for the item. */
    heading?: string | undefined;

    /** Content for the item. */
    content?: string | undefined;

    /** If the item is a single key reference, use this instead of content. */
    reference?: string | undefined;
  }

  interface CommonToolclipItem {
    heading: string;

    content?: string | undefined;

    reference?: string | undefined;
  }

  interface Configuration<SceneControls extends SceneControls.Any = SceneControls.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<SceneControls> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SceneControls extends SceneControls.Any = SceneControls.Any> = DeepPartial<
    Configuration<SceneControls>
  > &
    object;

  interface _ActivateOptions {
    /** An event which prompted a re-render */
    event?: Event | undefined;

    /** The control set to activate. If undefined, the current control set remains active */
    control?: string | undefined;

    /** A specific tool to activate. If undefined the current tool or default tool for the control set becomes active */
    tool?: string | undefined;

    /** Changes to apply to toggles within the control set */
    toggles?: Record<string, boolean> | undefined;
  }

  interface RenderOptions
    extends ApplicationV2.RenderOptions, HandlebarsApplicationMixin.RenderOptions, _ActivateOptions {
    /** Re-prepare the possible list of controls */
    reset?: boolean | undefined;
  }

  type EmittedEvents = [...ApplicationV2.EmittedEvents, "activate"];

  interface ActivateOptions extends _ActivateOptions {}

  interface InitializeOptions {
    layer?: string | undefined;

    tool?: string | undefined;
  }
}

declare abstract class AnySceneControls extends SceneControls<
  SceneControls.RenderContext,
  SceneControls.Configuration,
  SceneControls.RenderOptions
> {
  constructor(...args: never);
}

export default SceneControls;
