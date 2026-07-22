import type { DeepPartial, Identity } from "#utils";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type CategoryBrowser from "../../api/category-browser.d.mts";

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
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "controls-config",
   *   window: {
   *     title: "KEYBINDINGS.Title",
   *     icon: "fa-solid fa-gamepad",
   *     resizable: true
   *   },
   *   position: {
   *     width: 780,
   *     height: 680
   *   },
   *   actions: {
   *     addBinding: ControlsConfig.#onAddBinding,
   *     cancelEdit: ControlsConfig.#onCancelEdit,
   *     deleteBinding: ControlsConfig.#onDeleteBinding,
   *     editBinding: ControlsConfig.#onEditBinding,
   *     resetDefaults: ControlsConfig.#onResetDefaults,
   *     saveBinding: ControlsConfig.#onSaveBinding
   *   },
   *   subtemplates: {
   *     category: "templates/sidebar/apps/controls/category.hbs",
   *     sidebarFooter: "templates/category-browser/reset.hbs"
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: ControlsConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Faux "pointer bindings" for displaying as a readonly category
   */
  static POINTER_CONTROLS: readonly (readonly [id: string, name: string, parts: string[], gmOnly?: boolean])[];

  /**
   * Transform an action binding into a human-readable string representation.
   */
  static humanizeBinding(binding: ClientKeybindings.KeybindingActionBinding): string;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;

  protected override _sortCategories(
    a: CategoryBrowser.CategoryData<Entry>,
    b: CategoryBrowser.CategoryData<Entry>,
  ): number;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  #ControlsConfig: true;
}

declare namespace ControlsConfig {
  interface Any extends AnyControlsConfig {}
  interface AnyConstructor extends Identity<typeof AnyControlsConfig> {}

  interface EntryBinding {
    id: string;
    display: string;
    editable: boolean;
    conflicts: string | null;
  }

  interface Entry {
    id: string;
    precedence: number;
    order: number;
    label: string;
    hint: string;
    uneditable: ClientKeybindings.KeybindingActionBinding[];
    bindings: EntryBinding[];
  }

  interface RenderContext<Entry> extends CategoryBrowser.RenderContext<Entry> {}

  interface Configuration extends CategoryBrowser.Configuration {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

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
