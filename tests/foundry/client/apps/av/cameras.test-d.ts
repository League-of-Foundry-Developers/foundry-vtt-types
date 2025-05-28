import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

import Game = foundry.Game;

const view = ui.webrtc!;

expectTypeOf(CameraViews.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(view.render(true)).toEqualTypeOf<CameraViews>();
expectTypeOf(view.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<CameraViews.CameraViewsData>>>();

expectTypeOf(view.getUserCameraView("123")).toEqualTypeOf<HTMLElement | null>();
expectTypeOf(view.getUserVideoElement("123")).toEqualTypeOf<HTMLVideoElement | null>();
expectTypeOf(view.webrtc).toEqualTypeOf<Game["webrtc"]>();
expectTypeOf(view.maxZ).toEqualTypeOf<number | undefined>();
expectTypeOf(view.hidden).toEqualTypeOf<boolean>();
