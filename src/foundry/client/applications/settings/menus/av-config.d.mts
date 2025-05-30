import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { Identity } from "#utils";

import AVMaster = foundry.av.AVMaster;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AVConfig: AVConfig.Any;
    }
  }
}

/**
 * Audio/Video Conferencing Configuration Sheet
 * @remarks TODO: Stub
 */
declare class AVConfig<
  RenderContext extends AVConfig.RenderContext = AVConfig.RenderContext,
  Configuration extends AVConfig.Configuration = AVConfig.Configuration,
  RenderOptions extends AVConfig.RenderOptions = AVConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace AVConfig {
  interface Any extends AnyAVConfig {}
  interface AnyConstructor extends Identity<typeof AnyAVConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration {
    /**
     * The AVMaster instance being configured
     * @defaultValue `game.webrtc`
     */
    webrtc?: AVMaster;
  }

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyAVConfig extends AVConfig<
  AVConfig.RenderContext,
  AVConfig.Configuration,
  AVConfig.RenderOptions
> {
  constructor(...args: never);
}

export default AVConfig;
