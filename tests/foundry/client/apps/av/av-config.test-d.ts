import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

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

const avMaster = game.webrtc;
const avConfig = new AVConfig(avMaster);

expectTypeOf(avConfig.object).toEqualTypeOf<AVMaster>();
expectTypeOf(AVConfig.defaultOptions).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(avConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<AVConfig.AVConfigData>>>();
expectTypeOf(avConfig.render(true)).toEqualTypeOf<AVConfig>();
