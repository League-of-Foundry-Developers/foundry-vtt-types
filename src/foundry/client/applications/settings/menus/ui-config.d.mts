import type { DeepPartial, Identity, MaybePromise } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

import fields = foundry.data.fields;

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

  /**
   * @remarks Reverts the live UI to the stored setting unless the form was submitted.
   */
  protected override _onClose(options: DeepPartial<RenderOptions>): MaybePromise<void>;

  /**
   * @remarks Applies the pending configuration to the running UI immediately, before it is saved.
   */
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): MaybePromise<void>;

  #UIConfig: true;

  static #UIConfigStatic: true;
}

declare namespace UIConfig {
  interface Any extends AnyUIConfig {}
  interface AnyConstructor extends Identity<typeof AnyUIConfig> {}

  /** @internal */
  type _ColorSchemeField = fields.StringField<{
    required: true;
    blank: true;
    initial: "dark";
    choices: {
      "": "SETTINGS.UI.FIELDS.colorScheme.choices.default";
      dark: "SETTINGS.UI.FIELDS.colorScheme.choices.dark";
      light: "SETTINGS.UI.FIELDS.colorScheme.choices.light";
    };
  }>;

  interface ColorSchemeSchema extends fields.DataSchema {
    applications: _ColorSchemeField;
    interface: _ColorSchemeField;
  }

  interface FadeSchema extends fields.DataSchema {
    opacity: fields.AlphaField<{ initial: 0.4; min: 0.05; step: 0.05 }>;
    speed: fields.NumberField<{ min: 0; max: 1000; initial: 500; step: 50 }>;
  }

  interface Schema extends fields.DataSchema {
    uiScale: fields.NumberField<{ required: true; min: 0.5; max: 1.5; step: 0.05; initial: 1 }>;
    fontScale: fields.NumberField<{ required: true; min: 1; max: 10; step: 1; initial: 5 }>;
    colorScheme: fields.SchemaField<ColorSchemeSchema>;
    chatBackground: fields.BooleanField<{ required: true }>;
    chatNotifications: fields.StringField<{
      required: true;
      blank: false;
      initial: "cards";
      choices: {
        cards: "SETTINGS.UI.FIELDS.chatNotifications.cards";
        pip: "SETTINGS.UI.FIELDS.chatNotifications.pip";
      };
    }>;
    fade: fields.SchemaField<FadeSchema>;
  }

  type SettingField = fields.SchemaField<Schema>;

  /**
   * @privateRemarks Spelled out rather than derived from {@linkcode Schema}. Deriving it made
   * {@linkcode foundry.Game.configureUI | Game#configureUI} pull the schema in through `Game`, and the
   * fields resolved to their `null` defaults in whichever file asked first.
   */
  interface GameUIConfiguration {
    uiScale: number;

    fontScale: number;

    colorScheme: {
      applications: "" | "dark" | "light";
      interface: "" | "dark" | "light";
    };

    chatBackground: boolean;

    chatNotifications: "cards" | "pip";

    fade: {
      opacity: number;
      speed: number;
    };
  }

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    /**
     * @remarks The pending value, re-read from the setting only on a first render, so it survives
     * re-renders that follow a form change.
     */
    setting: GameUIConfiguration;

    fields: Schema;

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
