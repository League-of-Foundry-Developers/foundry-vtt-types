import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

if (game instanceof Game) {
  game.settings.registerMenu("core", "webrtc", {
    name: "WEBRTC.Title",
    label: "WEBRTC.MenuLabel",
    hint: "WEBRTC.MenuHint",
    icon: "fas fa-headset",
    type: AVConfig,
    restricted: false,
  });
}

const avConfig = new AVConfig();

expectTypeOf(avConfig.object).toEqualTypeOf<AVMaster>();
expectTypeOf(AVConfig.defaultOptions).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(avConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<AVConfig.AVConfigData>>>();
expectTypeOf(avConfig.render(true)).toEqualTypeOf<AVConfig>();
