import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type HandlebarsApplicationMixin from "#client/applications/api/handlebars-application.d.mts";

/**
 * An application that renders the floating setup menu buttons.
 */
declare class SetupMenu<
  RenderContext extends SetupMenu.RenderContext = SetupMenu.RenderContext,
  Configuration extends SetupMenu.Configuration = SetupMenu.Configuration,
  RenderOptions extends SetupMenu.RenderOptions = SetupMenu.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "setup-menu",
   *   tag: "nav",
   *   window: {
   *     frame: false,
   *     positioned: false
   *   },
   *   actions: {
   *     adminLogout: SetupMenu.#onClickAdminLogout,
   *     backups: SetupMenu.#onClickBackupManager,
   *     configure: SetupMenu.#onClickConfiguration,
   *     shutDown: SetupMenu.#onClickShutDownServer,
   *     update: SetupMenu.#onClickUpdate,
   *     viewWarnings: SetupMenu.#onClickViewWarnings
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: SetupMenu.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   buttons: {
   *     id: "buttons",
   *     template: "templates/setup/parts/setup-menu.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Does not call `super`; the context is only the menu buttons.
   */
  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Toggle the locked state of the interface.
   * @param locked - Is the interface locked?
   */
  toggleLock(locked: boolean): void;

  static #SetupMenu: true;
}

declare namespace SetupMenu {
  interface Any extends AnySetupMenu {}
  interface AnyConstructor extends Identity<typeof AnySetupMenu> {}

  type Action = "viewWarnings" | "configure" | "update" | "backups" | "adminLogout" | "shutDown";

  interface Pip {
    type: "error" | "warning";

    /** @remarks The issue count for `viewWarnings`, otherwise `"!"`. */
    label: number | "!";
  }

  interface Button {
    action: Action;

    /** @remarks A localization key. */
    tooltip: string;

    icon: string;

    /**
     * @remarks `null` when there is nothing to flag. Absent on the `backups`, `adminLogout` and `shutDown` buttons.
     */
    pip?: Pip | null | undefined;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    /**
     * @remarks `backups` is only included when backups are enabled; `adminLogout` and `shutDown` only when an
     * administrator password is set.
     */
    buttons: Button[];
  }

  interface Configuration<SetupMenu extends SetupMenu.Any = SetupMenu.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<SetupMenu> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<SetupMenu extends SetupMenu.Any = SetupMenu.Any> = DeepPartial<Configuration<SetupMenu>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnySetupMenu extends SetupMenu<
  SetupMenu.RenderContext,
  SetupMenu.Configuration,
  SetupMenu.RenderOptions
> {
  constructor(...args: never);
}

export default SetupMenu;
