import type { DeepPartial, Identity, MaybePromise } from "#utils";
import type CategoryBrowser from "../../api/category-browser.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

import ClientKeybindings = foundry.helpers.interaction.ClientKeybindings;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ControlsConfig: ControlsConfig.Any;
    }
  }
}

/**
 * View and edit keybinding and (readonly) mouse actions.
 */
declare class ControlsConfig<
  Entry extends ControlsConfig.Entry = ControlsConfig.Entry,
  RenderContext extends ControlsConfig.RenderContext<Entry> = ControlsConfig.RenderContext<Entry>,
  Configuration extends ControlsConfig.Configuration = ControlsConfig.Configuration,
  RenderOptions extends ControlsConfig.RenderOptions = ControlsConfig.RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: ControlsConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Faux "pointer bindings" for displaying as a readonly category
   */
  static readonly POINTER_CONTROLS: readonly ControlsConfig.PointerControl[];

  /**
   * Transform an action binding into a human-readable string representation.
   */
  static humanizeBinding(binding: ClientKeybindings.KeybindingActionBinding): string;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * @remarks Categorized by the action's namespace, plus `core-pointer` for the readonly mouse actions and
   * `unmapped` for a namespace matching no installed package. Skips GM-restricted actions for a non-GM user.
   *
   * @privateRemarks Synchronous at runtime; kept at the base's {@linkcode MaybePromise} width.
   */
  protected override _prepareCategoryData(): MaybePromise<Record<string, CategoryBrowser.CategoryData<Entry>>>;

  /** @remarks Orders `core`, then `core-pointer`, then the active system, then defers to the base. */
  protected override _sortCategories(
    a: CategoryBrowser.CategoryData<Entry>,
    b: CategoryBrowser.CategoryData<Entry>,
  ): number;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  #ControlsConfig: true;

  static #ControlsConfigStatic: true;
}

declare namespace ControlsConfig {
  interface Any extends AnyControlsConfig {}
  interface AnyConstructor extends Identity<typeof AnyControlsConfig> {}

  /**
   * A readonly mouse action shown alongside the configurable keybindings.
   *
   * @remarks `parts` are localization suffixes under `CONTROLS`, joined with `+` for display. The final element
   * marks the action as GM-only and is omitted when it is not.
   */
  type PointerControl = [id: string, name: string, parts: string[], gmOnly?: boolean];

  interface Entry {
    /** The action's fully-qualified identifier, `<namespace>.<action>`. */
    id: string;

    precedence: number;

    /** The registration order of the action. */
    order: number;

    label: string;

    /** The reserved-modifier notice, the restriction notice and the action hint, joined by `<br>`. */
    hint: string;

    /** The bindings that can never be changed nor removed. */
    uneditable: ClientKeybindings.KeybindingActionBinding[];

    bindings: BindingContext[];
  }

  interface BindingContext {
    /** The binding's identifier, `<actionId>.binding.<index>`. */
    id: string;

    /** The binding rendered for display, e.g. `Control + A`. */
    display: string;

    editable: boolean;

    /** A localized list of the actions this binding collides with, or `null` when there are none. */
    conflicts: string | null;
  }

  interface RenderContext<Entry> extends CategoryBrowser.RenderContext<Entry> {}

  interface Configuration<
    ControlsConfig extends ControlsConfig.Any = ControlsConfig.Any,
  > extends CategoryBrowser.Configuration<ControlsConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ControlsConfig extends ControlsConfig.Any = ControlsConfig.Any> = DeepPartial<
    Configuration<ControlsConfig>
  > &
    object;

  interface RenderOptions extends CategoryBrowser.RenderOptions {}
}

declare abstract class AnyControlsConfig extends ControlsConfig<
  ControlsConfig.Entry,
  ControlsConfig.RenderContext<ControlsConfig.Entry>,
  ControlsConfig.Configuration,
  ControlsConfig.RenderOptions
> {
  constructor(...args: never);
}

export default ControlsConfig;
