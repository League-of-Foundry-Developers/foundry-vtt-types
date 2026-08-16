import { expectTypeOf } from "vitest";
import type { DeepPartial, MaybePromise } from "fvtt-types/utils";

import UIConfig = foundry.applications.settings.menus.UIConfig;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

const app = new UIConfig();

expectTypeOf(UIConfig.DEFAULT_OPTIONS).toEqualTypeOf<UIConfig.DefaultOptions>();
expectTypeOf(UIConfig.schema).toEqualTypeOf<UIConfig.SettingField>();
expectTypeOf(UIConfig.schema.fields.uiScale).toEqualTypeOf<UIConfig.Schema["uiScale"]>();
expectTypeOf(UIConfig.schema.fields.chatBackground).toEqualTypeOf<
  foundry.data.fields.BooleanField<{ required: true }>
>();

declare const setting: UIConfig.GameUIConfiguration;

// `null` is included because neither field passes `nullable`, and `NumberField` defaults it to `true`.
// Foundry's own `@typedef` says plain `number`; the schema disagrees with it.
expectTypeOf(setting.uiScale).toEqualTypeOf<number | null>();
expectTypeOf(setting.fontScale).toEqualTypeOf<number | null>();
expectTypeOf(setting.colorScheme.applications).toEqualTypeOf<"" | "dark" | "light">();
expectTypeOf(setting.colorScheme.interface).toEqualTypeOf<"" | "dark" | "light">();
expectTypeOf(setting.chatBackground).toEqualTypeOf<boolean>();
expectTypeOf(setting.chatNotifications).toEqualTypeOf<"cards" | "pip">();
expectTypeOf(setting.fade.opacity).toEqualTypeOf<number>();

declare const context: UIConfig.RenderContext;
expectTypeOf(context.setting).toEqualTypeOf<UIConfig.GameUIConfiguration>();
expectTypeOf(context.fields).toEqualTypeOf<UIConfig.Schema>();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

// `game` is only initialized after the `init` hook, so assert the method off the class.
expectTypeOf<foundry.Game["configureUI"]>().toEqualTypeOf<
  (config?: DeepPartial<UIConfig.GameUIConfiguration>) => void
>();

class CustomUIConfig extends UIConfig {
  protected override async _prepareContext(
    options: DeepPartial<UIConfig.RenderOptions> & { isFirstRender: boolean },
  ): Promise<UIConfig.RenderContext> {
    return super._prepareContext(options);
  }

  testProtected(formConfig: ApplicationV2.FormConfiguration, event: Event): void {
    expectTypeOf(this._onChangeForm(formConfig, event)).toEqualTypeOf<MaybePromise<void>>();
  }
}

expectTypeOf(new CustomUIConfig()).toEqualTypeOf<CustomUIConfig>();
expectTypeOf(app.render()).toEqualTypeOf<Promise<UIConfig>>();
