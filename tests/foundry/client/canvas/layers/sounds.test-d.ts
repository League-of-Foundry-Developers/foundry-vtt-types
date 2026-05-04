import { expectTypeOf } from "vitest";

import SoundsLayer = foundry.canvas.layers.SoundsLayer;
import AmbientSound = foundry.canvas.placeables.AmbientSound;
import Canvas = foundry.canvas.Canvas;

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
expectTypeOf(layer.sources).toEqualTypeOf<Collection<foundry.canvas.sources.PointSoundSource.Internal.Any>>();
expectTypeOf(layer.hookName).toEqualTypeOf<"SoundsLayer">();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_activate"]()).toBeVoid();

expectTypeOf(layer.initializeSources()).toBeVoid();

expectTypeOf(layer.refresh()).toEqualTypeOf<number | void>();
expectTypeOf(layer.refresh({ fade: undefined })).toEqualTypeOf<number | void>();
expectTypeOf(layer.refresh({ fade: 500 })).toEqualTypeOf<number | void>();

expectTypeOf(layer.previewSound({ x: 500, y: 500 })).toBeVoid();
expectTypeOf(layer.stopAll()).toBeVoid();
expectTypeOf(layer.getListenerPositions()).toEqualTypeOf<Canvas.ElevatedPoint[]>();

declare const point: Canvas.Point;
declare const elevatedPoint: Canvas.ElevatedPoint;

// eslint-disable-next-line @typescript-eslint/no-deprecated -- actually deprecated
expectTypeOf(layer["_syncPositions"]([point])).toBeVoid();
// eslint-disable-next-line @typescript-eslint/no-deprecated -- actually deprecated
expectTypeOf(layer["_syncPositions"]([point], {})).toBeVoid();
// eslint-disable-next-line @typescript-eslint/no-deprecated -- actually deprecated
expectTypeOf(layer["_syncPositions"]([point], { fade: 100 })).toBeVoid();

// eslint-disable-next-line @typescript-eslint/no-deprecated -- not actually deprecated, eslint bug
expectTypeOf(layer["_syncPositions"]([elevatedPoint])).toBeVoid();
// eslint-disable-next-line @typescript-eslint/no-deprecated -- not actually deprecated, eslint bug
expectTypeOf(layer["_syncPositions"]([elevatedPoint], {})).toBeVoid();
// eslint-disable-next-line @typescript-eslint/no-deprecated -- not actually deprecated, eslint bug
expectTypeOf(layer["_syncPositions"]([elevatedPoint], { fade: 100 })).toBeVoid();

declare const somePSS: foundry.canvas.sources.PointSoundSource;
declare const sound: foundry.audio.Sound;
declare const ambientSound: AmbientSound.Implementation;
expectTypeOf(
  layer["_configurePlayback"]({
    source: somePSS, // only actually required property
    listener: elevatedPoint, // not technically required but will cause 0 volume/playback failure if omitted
    walls: false,
    sound,
    volume: 0.99,
    object: ambientSound,
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

declare const darknessEvent: foundry.canvas.Canvas.Event.DarknessChange;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const someDragEvent: DragEvent;
declare const pixiPoint: PIXI.Point;
expectTypeOf(layer["_onDarknessChange"](darknessEvent)).toBeVoid();
expectTypeOf(layer["_onMouseMove"](pixiPoint)).toBeVoid();
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();

expectTypeOf(
  layer["_onDropData"](someDragEvent, {
    type: "PlaylistSound",
    uuid: "some UUID",
    x: 500,
    y: 500,
  }),
).toEqualTypeOf<Promise<AmbientSound.Implementation | false>>();
