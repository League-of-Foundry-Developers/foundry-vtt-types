import type { Identity } from "#utils";
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
 * @remarks TODO: Stub
 */
declare class SceneControls<
  RenderContext extends SceneControls.RenderContext = SceneControls.RenderContext,
  Configuration extends SceneControls.Configuration = SceneControls.Configuration,
  RenderOptions extends SceneControls.RenderOptions = SceneControls.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace SceneControls {
  interface Any extends AnySceneControls {}
  interface AnyConstructor extends Identity<typeof AnySceneControls> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    controls: Control[];
    tools: Tool[];
  }

  /**
   * The data structure for a set of controls in the {@link SceneControls#controls} record.
   */
  interface Control {
    name: string;
    order: number;
    title: string;
    icon: string;
    visible?: boolean | undefined;
    tools: Record<string, Tool>;

    /**
     * @remarks Should be an key in {@linkcode Control.tools | this.tools}.
     */
    activeTool: string;

    /** A callback invoked when control set is activated or deactivated */
    onChange?: ((event: Event, active: boolean) => void) | undefined;

    /** A callback invoked when the active tool changes */
    onToolChange?: ((event: Event, tool: Tool) => void) | undefined;
  }

  /**
   * The data structure for a single tool in the {@link Control#tools} record.
   */
  interface Tool {
    name: string;
    order: number;
    title: string;
    icon: string;

    visible?: boolean | undefined;
    toggle?: boolean | undefined;
    active?: boolean | undefined;
    button?: boolean | undefined;

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
    paragraph: string;

    /** A heading for the item. */
    heading: string;

    /** Content for the item. */
    content: string;

    /** If the item is a single key reference, use this instead of content. */
    reference: string;
  }

  interface Configuration extends ApplicationV2.Configuration {}
  interface RenderOptions extends ApplicationV2.RenderOptions {}
}

declare abstract class AnySceneControls extends SceneControls<
  SceneControls.RenderContext,
  SceneControls.Configuration,
  SceneControls.RenderOptions
> {
  constructor(...args: never);
}

export default SceneControls;
