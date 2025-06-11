import { expectTypeOf } from "vitest";
import { SoundsLayer } from "#client/canvas/layers/_module.mjs";
import type { AmbientSound } from "#client/canvas/placeables/_module.d.mts";

expectTypeOf(SoundsLayer.documentName).toEqualTypeOf<"AmbientSound">();
expectTypeOf(SoundsLayer.instance).toEqualTypeOf<SoundsLayer | undefined>();
expectTypeOf(SoundsLayer.layerOptions).toEqualTypeOf<SoundsLayer.LayerOptions>();
expectTypeOf(SoundsLayer.layerOptions.name).toEqualTypeOf<"sounds">();
expectTypeOf(SoundsLayer.layerOptions.objectClass).toEqualTypeOf<AmbientSound.ImplementationClass>();

const layer = new SoundsLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<AmbientSound.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<SoundsLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"sounds">();

expectTypeOf(layer.livePreview).toBeBoolean();
expectTypeOf(layer.sources).toEqualTypeOf<foundry.utils.Collection<foundry.canvas.sources.PointSoundSource.Any>>();
expectTypeOf(layer.hookName).toEqualTypeOf<"SoundsLayer">();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_activate"]()).toBeVoid();

expectTypeOf(layer.initializeSources()).toBeVoid();

expectTypeOf(layer.refresh()).toEqualTypeOf<number | void>();
expectTypeOf(layer.refresh({ fade: null })).toEqualTypeOf<number | void>();
expectTypeOf(layer.refresh({ fade: 500 })).toEqualTypeOf<number | void>();

expectTypeOf(layer.previewSound({ x: 500, y: 500 })).toBeVoid();
expectTypeOf(layer.stopAll()).toBeVoid();
expectTypeOf(layer.getListenerPositions()).toEqualTypeOf<PIXI.Point[]>();
declare const somePoint: PIXI.Point;
expectTypeOf(layer["_syncPositions"]([somePoint])).toBeVoid();
expectTypeOf(layer["_syncPositions"]([somePoint], {})).toBeVoid();
expectTypeOf(layer["_syncPositions"]([somePoint], { fade: 100 })).toBeVoid();
declare const somePSS: foundry.canvas.sources.PointSoundSource;
expectTypeOf(
  layer["_configurePlayback"]({
    source: somePSS, // only actually required property
    listener: somePoint, // not technically required but will cause 0 volume/playback failure if omitted
    walls: false,
    // all other parts of the AmbientSoundPlaybackConfig are unused in this, the one place its used as a parameter
  }),
).toBeVoid();

const filledInPlayAtPositionOptions = {
  baseEffect: { type: "reverb", intensity: 3 },
  easing: true,
  gmAlways: false,
  muffledEffect: { type: "lowPass", intensity: 7 },
  playbackOptions: { delay: 1, duration: 3, fade: 200 },
  sourceData: { elevation: 20, radius: 500 },
  walls: true,
  volume: 2.3,
} satisfies SoundsLayer.PlayAtPositionOptions;
const mostNullishPlayAtPositionOptions = {
  baseEffect: null,
  easing: null,
  gmAlways: null,
  muffledEffect: null,
  playbackOptions: null,
  sourceData: null,
  walls: undefined,
  volume: undefined,
} satisfies SoundsLayer.PlayAtPositionOptions;

expectTypeOf(layer.playAtPosition("path/to/file.ogg", { x: 50, y: 50 }, 200)).toEqualTypeOf<
  Promise<foundry.audio.Sound | null>
>();
expectTypeOf(layer.playAtPosition("path/to/file.ogg", { x: 50, y: 50 }, 200, {})).toEqualTypeOf<
  Promise<foundry.audio.Sound | null>
>();
expectTypeOf(
  layer.playAtPosition("path/to/file.ogg", { x: 50, y: 50 }, 200, filledInPlayAtPositionOptions),
).toEqualTypeOf<Promise<foundry.audio.Sound | null>>();
expectTypeOf(
  layer.playAtPosition("path/to/file.ogg", { x: 50, y: 50 }, 200, mostNullishPlayAtPositionOptions),
).toEqualTypeOf<Promise<foundry.audio.Sound | null>>();

expectTypeOf(layer.emitAtPosition("path/to/file.ogg", { x: 50, y: 50 }, 200)).toEqualTypeOf<
  Promise<foundry.audio.Sound | null>
>();
expectTypeOf(layer.emitAtPosition("path/to/file.ogg", { x: 50, y: 50 }, 200, {})).toEqualTypeOf<
  Promise<foundry.audio.Sound | null>
>();
expectTypeOf(
  layer.emitAtPosition("path/to/file.ogg", { x: 50, y: 50 }, 200, filledInPlayAtPositionOptions),
).toEqualTypeOf<Promise<foundry.audio.Sound | null>>();
expectTypeOf(
  layer.emitAtPosition("path/to/file.ogg", { x: 50, y: 50 }, 200, mostNullishPlayAtPositionOptions),
).toEqualTypeOf<Promise<foundry.audio.Sound | null>>();

declare const someEvent: PIXI.FederatedEvent;
declare const somePointerEvent: PointerEvent;
declare const someDragEvent: DragEvent;
expectTypeOf(layer["_onDarknessChange"](someEvent)).toBeVoid();
expectTypeOf(layer["_onMouseMove"]()).toBeVoid();
expectTypeOf(layer["_onDragLeftStart"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](somePointerEvent)).toBeVoid();

expectTypeOf(
  layer["_onDropData"](someDragEvent, {
    type: "PlaylistSound",
    uuid: "some UUID",
    x: 500,
    y: 500,
  }),
).toEqualTypeOf<Promise<AmbientSound.Implementation | false>>();
