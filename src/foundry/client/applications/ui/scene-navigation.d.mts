import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SceneNavigation: SceneNavigation.Any;
    }
  }
}

/**
 * The Scene Navigation UI element.
 */
declare class SceneNavigation<
  RenderContext extends SceneNavigation.RenderContext = SceneNavigation.RenderContext,
  Configuration extends SceneNavigation.Configuration = SceneNavigation.Configuration,
  RenderOptions extends SceneNavigation.RenderOptions = SceneNavigation.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: SceneNavigation.DefaultOptions;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Whether the scene navigation is currently expanded.
   */
  get expanded(): boolean;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Get the set of ContextMenu options which should be applied for Scenes in the menu.
   * @returns The Array of context options passed to the ContextMenu instance
   */
  protected _getContextMenuOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  /**
   * Expand Scene Navigation, displaying inactive Scenes.
   */
  expand(): void;

  /**
   * Collapse Scene Navigation, hiding inactive Scenes.
   */
  collapse(): Promise<void>;

  /**
   * Toggle the expanded state of scene navigation.
   * @param expanded - Force the expanded state to the provided value, otherwise toggle the state.
   */
  toggleExpanded(expanded?: boolean): void;

  /**
   * @deprecated "{@linkcode SceneNavigation.displayProgressBar} is deprecated in favor of {@linkcode Notifications#notify} using the `{progress: true}` option" (since v13, until v15)
   */
  static displayProgressBar({ label, pct }?: SceneNavigation.DisplayProgressBarOptions): void;

  static #SceneNavigationStatic: true;
  #SceneNavigation: true;
}

declare namespace SceneNavigation {
  interface Any extends AnySceneNavigation {}
  interface AnyConstructor extends Identity<typeof AnySceneNavigation> {}

  /**
   * @remarks A user shown as a pip on a scene or level entry. `color` is a CSS string, but `border`
   * is the {@linkcode Color} itself.
   */
  interface UserPipContext {
    name: string;

    /** @remarks The first character of the user's name. */
    letter: string;

    color: string;

    border: Color;
  }

  interface SceneIcon {
    /** @remarks Rendered as the Font Awesome suffix in `fa-solid fa-${class}`. */
    class: string;

    /** @remarks Localized; rendered as the icon's `aria-label`. */
    tooltip: string;
  }

  interface SceneContext {
    id: string;

    active: boolean;

    isView: boolean;

    /**
     * @remarks Foundry adds `eye` while the scene is being viewed, `bullseye` while it is active,
     * and `eye-slash` when a GM sees a non-active scene players cannot.
     */
    icons: SceneIcon[];

    navOrder: number;

    /** @remarks The scene's `navName`, falling back to its `name`. */
    name: string;

    /** @remarks The scene's `name` when a GM is viewing a scene that has a `navName`, otherwise blank. */
    tooltip: string;

    /** @remarks Absent when no active user is viewing this scene. */
    users?: UserPipContext[] | undefined;
  }

  interface LevelContext {
    id: string;

    sceneId: string;

    name: string;

    css: string;

    /** @remarks Absent when no active user is viewing this level. */
    users?: UserPipContext[] | undefined;
  }

  interface ScenesContext {
    inactive: SceneContext[];

    active: SceneContext[];

    /** @remarks Only set when one of the navigable scenes is the currently viewed one. */
    viewed?: SceneContext | undefined;

    /**
     * @remarks Only set when one of the navigable scenes is the currently viewed one, and `null`
     * when that scene has fewer than two available levels.
     */
    levels?: LevelContext[] | null | undefined;
  }

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    scenes: ScenesContext;

    canExpand: number;
  }

  interface DisplayProgressBarOptions {
    label?: string | undefined;
    pct?: number | undefined;
  }

  interface Configuration<SceneNavigation extends SceneNavigation.Any = SceneNavigation.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<SceneNavigation> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SceneNavigation extends SceneNavigation.Any = SceneNavigation.Any> = DeepPartial<
    Configuration<SceneNavigation>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {
    /**
     * @remarks Scrolls the active level into view after rendering.
     */
    scrollToActiveLevel?: boolean | undefined;
  }
}

declare abstract class AnySceneNavigation extends SceneNavigation<
  SceneNavigation.RenderContext,
  SceneNavigation.Configuration,
  SceneNavigation.RenderOptions
> {
  constructor(...args: never);
}

export default SceneNavigation;
