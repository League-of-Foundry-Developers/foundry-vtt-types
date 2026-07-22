import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { fields } from "#client/data/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      UIConfig: UIConfig.Any;
    }
  }
}

/**
 * A submenu that provides UI configuration settings.
 */
declare class UIConfig<
  RenderContext extends UIConfig.RenderContext = UIConfig.RenderContext,
  Configuration extends UIConfig.Configuration = UIConfig.Configuration,
  RenderOptions extends UIConfig.RenderOptions = UIConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "ui-config",
   *   tag: "form",
   *   window: {
   *     title: "SETTINGS.UI.MENU.name",
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-table-layout"
   *   },
   *   form: {
   *     closeOnSubmit: true,
   *     handler: UIConfig.#onSubmit
   *   },
   *   position: {width: 540},
   *   actions: {
   *     reset: UIConfig.#onReset
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: UIConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The data schema for the core.uiConfig setting.
   */
  static get schema(): UIConfig.SettingField;

  protected override _preFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  #UIConfig: true;
}

declare namespace UIConfig {
  interface Any extends AnyUIConfig {}
  interface AnyConstructor extends Identity<typeof AnyUIConfig> {}

  interface GameUIConfiguration {
    uiScale: number;
    fontScale: number;
    colorScheme: {
      applications: "" | "dark" | "light";
      interface: "" | "dark" | "light";
    };
    chatNotifications: "cards" | "pip";
    fade: {
      opacity: number;
      speed: number;
    };
  }

  interface Schema extends fields.DataSchema {
    uiScale: fields.NumberField<{ required: true; min: 0.5; max: 1.5; step: 0.05; initial: 1 }>;
    fontScale: fields.NumberField<{ required: true; min: 1; max: 10; step: 1; initial: 5 }>;
    colorScheme: fields.SchemaField<{
      applications: fields.StringField<{
        required: true;
        blank: true;
        initial: "dark";
        choices: {
          "": "SETTINGS.UI.FIELDS.colorScheme.choices.default";
          dark: "SETTINGS.UI.FIELDS.colorScheme.choices.dark";
          light: "SETTINGS.UI.FIELDS.colorScheme.choices.light";
        };
      }>;
      interface: fields.StringField<{
        required: true;
        blank: true;
        initial: "dark";
        choices: {
          "": "SETTINGS.UI.FIELDS.colorScheme.choices.default";
          dark: "SETTINGS.UI.FIELDS.colorScheme.choices.dark";
          light: "SETTINGS.UI.FIELDS.colorScheme.choices.light";
        };
      }>;
    }>;
    chatNotifications: fields.StringField<{
      required: true;
      blank: false;
      initial: "cards";
      choices: { cards: "SETTINGS.UI.FIELDS.chatNotifications.cards"; pip: "SETTINGS.UI.FIELDS.chatNotifications.pip" };
    }>;
    fade: fields.SchemaField<{
      opacity: fields.AlphaField<{ initial: 0.4; min: 0.05; step: 0.05 }>;
      speed: fields.NumberField<{ min: 0; max: 1000; initial: 500; step: 50 }>;
    }>;
  }

  type SettingField = fields.SchemaField<Schema>;

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    setting: GameUIConfiguration;
    fields: SettingField["fields"];
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<UIConfig extends UIConfig.Any = UIConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<UIConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<UIConfig extends UIConfig.Any = UIConfig.Any> = DeepPartial<Configuration<UIConfig>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyUIConfig extends UIConfig<
  UIConfig.RenderContext,
  UIConfig.Configuration,
  UIConfig.RenderOptions
> {
  constructor(...args: never);
}

export default UIConfig;
