import { expectTypeOf } from "vitest";

import AmbientSound = foundry.canvas.placeables.AmbientSound;
import Sound = foundry.audio.Sound;
import ControlIcon = foundry.canvas.containers.ControlIcon;
import AmbientSoundShapeControls = foundry.canvas.placeables.sounds.AmbientSoundShapeControls;
import PreciseText = foundry.canvas.containers.PreciseText;

expectTypeOf(AmbientSound.implementation).toEqualTypeOf<AmbientSound.ImplementationClass>();
expectTypeOf(AmbientSound.embeddedName).toEqualTypeOf<"AmbientSound">();
expectTypeOf(AmbientSound.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<"refresh" | "refreshField" | "refreshPosition" | "refreshState" | "refreshVisibility" | "refreshElevation">
  | undefined
>();

declare const doc: AmbientSoundDocument.Stored;
declare const scene: Scene.Stored;
const sound = new CONFIG.AmbientSound.objectClass(doc);

expectTypeOf(sound.controlIcon).toEqualTypeOf<ControlIcon | null>();
expectTypeOf(sound.sound).toEqualTypeOf<Sound | null | undefined>();
expectTypeOf(sound.source).toEqualTypeOf<foundry.canvas.sources.PointSoundSource.Implementation | undefined>();
expectTypeOf(sound.field).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(sound.controls).toEqualTypeOf<AmbientSoundShapeControls | undefined>();
expectTypeOf(sound.tooltip).toEqualTypeOf<PreciseText | undefined>();
expectTypeOf(sound["_createSound"]()).toEqualTypeOf<Sound | null>();

expectTypeOf(sound.applyEffects()).toBeVoid();
expectTypeOf(sound.applyEffects({})).toBeVoid();
expectTypeOf(sound.applyEffects({ muffled: true })).toBeVoid();
expectTypeOf(sound.applyEffects({ muffled: undefined })).toBeVoid();

expectTypeOf(sound.isInteractable).toBeBoolean();
expectTypeOf(sound.isAudible).toEqualTypeOf<boolean>();
expectTypeOf(sound.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(sound.radius).toEqualTypeOf<number>();
expectTypeOf(sound["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();

expectTypeOf(sound.sync(true, 10)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.sync(true, 10, {})).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound.sync(true, 10, { fade: 250 })).toEqualTypeOf<Promise<void>>();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(sound["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(sound["_clear"]()).toBeVoid();

// @ts-expect-error _destroy always gets passed a value, even if that value is `undefined`
expectTypeOf(sound["_destroy"]()).toBeVoid();
expectTypeOf(sound["_destroy"]({})).toBeVoid();
expectTypeOf(sound["_destroy"]({ baseTexture: true, children: true, texture: true })).toBeVoid();
expectTypeOf(sound["_destroy"](true)).toBeVoid();
expectTypeOf(sound["_destroy"](undefined)).toBeVoid();

// @ts-expect-error an object must be passed
expectTypeOf(sound["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(sound["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(sound["_applyRenderFlags"]({ refreshElevation: false, refreshPosition: undefined })).toBeVoid();
expectTypeOf(
  sound["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshField: true,
    refreshPosition: true,
    refreshState: true,
    refreshElevation: true,
  }),
).toBeVoid();

expectTypeOf(sound["_refreshField"]()).toBeVoid();
expectTypeOf(sound["_refreshPosition"]()).toBeVoid();
expectTypeOf(sound["_refreshSize"]()).toBeVoid();
expectTypeOf(sound["_refreshState"]()).toBeVoid();
expectTypeOf(sound["_refreshTooltip"]()).toBeVoid();
expectTypeOf(sound["_getTooltipText"]()).toBeString();
expectTypeOf(sound["_getTextStyle"]()).toEqualTypeOf<PIXI.TextStyle>();
expectTypeOf(sound["_getMeasuredShapes"]()).toEqualTypeOf<foundry.data.BaseShapeData[]>();
expectTypeOf(
  sound["_onCreate"](
    doc.toObject(),
    {
      action: "create",
      documentName: "AmbientSound",
      parent: scene,
      modifiedTime: 7,
      render: true,
      renderSheet: false,
    },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  sound["_onUpdate"](
    // partial source data
    { easing: true, path: "path/to/sound.ogg", repeat: true, flags: { core: { sheetLock: true } } },
    {
      action: "update",
      documentName: "AmbientSound",
      parent: scene,
      modifiedTime: 7,
      render: true,
      diff: true,
      recursive: true,
    },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  sound["_onDelete"](
    { action: "delete", documentName: "AmbientSound", parent: scene, modifiedTime: 7, render: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(sound.initializeSoundSource()).toBeVoid();
expectTypeOf(sound.initializeSoundSource({})).toBeVoid();
expectTypeOf(sound.initializeSoundSource({ deleted: true })).toBeVoid();
expectTypeOf(sound.initializeSoundSource({ deleted: undefined })).toBeVoid();
expectTypeOf(sound["_getSoundSourceData"]()).toEqualTypeOf<AmbientSound.SoundSourceData>();

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(sound._hasShapeChanged({ radius: 20 })).toBeBoolean();

expectTypeOf(sound["_canHUD"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(sound["_canConfigure"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(sound["_onControl"]({})).toBeVoid();
expectTypeOf(sound["_onRelease"]({})).toBeVoid();

expectTypeOf(sound["_onClickRight"](pointerEvent)).toBeVoid();
expectTypeOf(sound["_updateDragPreviews"](pointerEvent)).toBeVoid();
