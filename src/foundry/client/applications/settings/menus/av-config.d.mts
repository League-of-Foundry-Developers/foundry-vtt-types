import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

import AVMaster = foundry.av.AVMaster;

/**
 * Audio/Video Conferencing Configuration Sheet
 * @remarks TODO: Stub
 */
declare class AVConfig<
  RenderContext extends AVConfig.RenderContext = AVConfig.RenderContext,
  Configuration extends AVConfig.Configuration = AVConfig.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {}

declare namespace AVConfig {
  interface Configuration extends ApplicationV2.Configuration {
    /**
     * The AVMaster instance being configured
     * @defaultValue `game.webrtc`
     */
    webrtc?: AVMaster;
  }

  interface RenderContext extends ApplicationV2.RenderContext {}
}

export default AVConfig;
