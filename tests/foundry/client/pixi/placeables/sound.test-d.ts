import { expectTypeOf } from "vitest";
import Sound = foundry.audio.Sound;

expectTypeOf(AmbientSound.embeddedName).toEqualTypeOf<"AmbientSound">();
expectTypeOf(AmbientSound.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  Array<"redraw" | "refresh" | "refreshField" | "refreshPosition" | "refreshState" | "refreshElevation"> | undefined
>();

declare const doc: AmbientSoundDocument.Stored;
const sound = new CONFIG.AmbientSound.objectClass(doc);

expectTypeOf(sound.controlIcon).toEqualTypeOf<ControlIcon | null>();
expectTypeOf(sound.sound).toEqualTypeOf<Sound | null | undefined>();
expectTypeOf(sound.source).toEqualTypeOf<foundry.canvas.sources.PointSoundSource.ConfiguredInstance | undefined>();
expectTypeOf(sound.field).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(sound["_createSound"]()).toEqualTypeOf<Sound | null>();

expectTypeOf(sound.applyEffects()).toBeVoid();
expectTypeOf(sound.applyEffects({})).toBeVoid();
expectTypeOf(sound.applyEffects({ muffled: true })).toBeVoid();
expectTypeOf(sound.applyEffects({ muffled: null })).toBeVoid();

expectTypeOf(sound.isAudible).toEqualTypeOf<boolean>();
expectTypeOf(sound.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(sound.radius).toEqualTypeOf<number>();

expectTypeOf(sound.sync(true, 10)).toEqualTypeOf<void>();
expectTypeOf(sound.sync(true, 10, {})).toEqualTypeOf<void>();
expectTypeOf(sound.sync(true, 10, { fade: 250 })).toEqualTypeOf<void>();

expectTypeOf(sound.clear()).toEqualTypeOf<AmbientSound.Object>();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(sound["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(sound["_draw"]({})).toEqualTypeOf<Promise<void>>();

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
expectTypeOf(sound["_applyRenderFlags"]({ refreshElevation: null, refreshPosition: undefined })).toBeVoid();
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
expectTypeOf(sound["_refreshState"]()).toBeVoid();
expectTypeOf(sound.refreshControl()).toBeVoid();
expectTypeOf(sound["_refreshElevation"]()).toBeVoid();

expectTypeOf(
  sound["_onCreate"](doc.toObject(), { modifiedTime: 7, render: true, renderSheet: false }, "XXXXXSomeIDXXXXX"),
).toBeVoid();

expectTypeOf(
  sound["_onUpdate"](
    // partial source data
    { easing: true, path: "path/to/sound.ogg", repeat: true, flags: { core: { sheetLock: true } } },
    { modifiedTime: 7, render: true, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(sound["_onDelete"]({ modifiedTime: 7, render: true }, "XXXXXSomeIDXXXXX")).toBeVoid();

expectTypeOf(sound.initializeSoundSource()).toBeVoid();
expectTypeOf(sound.initializeSoundSource({})).toBeVoid();
expectTypeOf(sound.initializeSoundSource({ deleted: true })).toBeVoid();
expectTypeOf(sound.initializeSoundSource({ deleted: null })).toBeVoid();
expectTypeOf(sound["_getSoundSourceData"]()).toEqualTypeOf<AmbientSound.SoundSourceData>();

declare const someUser: User.Implementation;
declare const someEvent: PIXI.FederatedEvent;
expectTypeOf(sound["_canHUD"](someUser, someEvent)).toBeBoolean();
expectTypeOf(sound["_canConfigure"](someUser, someEvent)).toBeBoolean();

expectTypeOf(sound["_onHoverIn"](someEvent)).toBeVoid();
expectTypeOf(sound["_onHoverIn"](someEvent, {})).toBeVoid();
expectTypeOf(sound["_onHoverIn"](someEvent, { hoverOutOthers: true })).toBeVoid();
expectTypeOf(sound["_onHoverIn"](someEvent, { hoverOutOthers: null })).toBeVoid();

expectTypeOf(sound["_onClickRight"](someEvent)).toBeVoid();
expectTypeOf(sound["_onDragLeftMove"](someEvent)).toBeVoid();
expectTypeOf(sound["_onDragEnd"]()).toBeVoid();
expectTypeOf(sound["_prepareDragLeftDropUpdates"](someEvent)).toEqualTypeOf<PlaceableObject.DragLeftDropUpdate[]>();

// deprecated since v12, until v14
expectTypeOf(sound.updateSource()).toBeVoid();
expectTypeOf(sound.updateSource({})).toBeVoid();
expectTypeOf(sound.updateSource({ deleted: true })).toBeVoid();
expectTypeOf(sound.updateSource({ deleted: null })).toBeVoid();
