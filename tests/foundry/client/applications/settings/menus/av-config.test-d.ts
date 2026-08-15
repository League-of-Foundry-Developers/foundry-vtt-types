import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import AVConfig = foundry.applications.settings.menus.AVConfig;
import AVSettings = foundry.av.AVSettings;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import type { FormSelectOption } from "#client/applications/forms/fields.d.mts";

const app = new AVConfig();

expectTypeOf(AVConfig.DEFAULT_OPTIONS).toEqualTypeOf<AVConfig.DefaultOptions>();
expectTypeOf(AVConfig.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(app.webrtc).toEqualTypeOf<foundry.av.AVMaster>();
expectTypeOf(app.options.webrtc).toEqualTypeOf<foundry.av.AVMaster | undefined>();

declare const context: AVConfig.RenderContext;
expectTypeOf(context.tabClasses).toBeString();
expectTypeOf(context.rootId).toBeString();
expectTypeOf(context.settings).toEqualTypeOf<AVSettings.Settings>();
expectTypeOf(context.fields.world).toEqualTypeOf<AVSettings.WorldSchema>();
expectTypeOf(context.fields.client).toEqualTypeOf<AVSettings.ClientSchema>();
expectTypeOf(context.isSSL).toBeBoolean();

declare const partContext: AVConfig.PreparePartContext;
expectTypeOf(partContext.tab).toEqualTypeOf<ApplicationV2.Tab>();
expectTypeOf(partContext.canSelectMode).toBeBoolean();
expectTypeOf(partContext.modes).toEqualTypeOf<Record<AVSettings.AV_MODES, string>>();
expectTypeOf(partContext.voiceModes).toEqualTypeOf<Record<AVSettings.VOICE_MODES, string>>();
expectTypeOf(partContext.dockPositions).toEqualTypeOf<Record<AVSettings.DOCK_POSITIONS, string>>();
expectTypeOf(partContext.nameplates).toEqualTypeOf<Record<AVSettings.NAMEPLATE_MODES, string>>();
expectTypeOf(partContext.videoDevices).toEqualTypeOf<FormSelectOption[]>();
expectTypeOf(partContext.audioDevices).toEqualTypeOf<FormSelectOption[]>();
expectTypeOf(partContext.audioSinks).toEqualTypeOf<FormSelectOption[]>();
expectTypeOf(partContext.turnTypes).toEqualTypeOf<Record<string, string>>();
expectTypeOf(partContext.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

// A full render context has only the additions required by the part being rendered.
expectTypeOf(context.tab).toEqualTypeOf<ApplicationV2.Tab | undefined>();
expectTypeOf(context.canSelectMode).toEqualTypeOf<boolean | undefined>();
expectTypeOf(context.modes).toEqualTypeOf<Record<AVSettings.AV_MODES, string> | undefined>();
expectTypeOf(context.voiceModes).toEqualTypeOf<Record<AVSettings.VOICE_MODES, string> | undefined>();
expectTypeOf(context.dockPositions).toEqualTypeOf<Record<AVSettings.DOCK_POSITIONS, string> | undefined>();
expectTypeOf(context.nameplates).toEqualTypeOf<Record<AVSettings.NAMEPLATE_MODES, string> | undefined>();
expectTypeOf(context.videoDevices).toEqualTypeOf<FormSelectOption[] | undefined>();
expectTypeOf(context.audioDevices).toEqualTypeOf<FormSelectOption[] | undefined>();
expectTypeOf(context.audioSinks).toEqualTypeOf<FormSelectOption[] | undefined>();
expectTypeOf(context.turnTypes).toEqualTypeOf<Record<string, string> | undefined>();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[] | undefined>();

class CustomAVConfig extends AVConfig {
  protected override async _preparePartContext(
    partId: string,
    context: AVConfig.RenderContext,
    options: DeepPartial<AVConfig.RenderOptions>,
  ): Promise<AVConfig.RenderContext> {
    return super._preparePartContext(partId, context, options);
  }

  testProtected(options: AVConfig.RenderOptions): void {
    expectTypeOf(this._configureRenderParts(options)).toEqualTypeOf<
      Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
    >();
  }
}

declare const webrtc: foundry.av.AVMaster;
expectTypeOf(new CustomAVConfig({ webrtc })).toEqualTypeOf<CustomAVConfig>();
