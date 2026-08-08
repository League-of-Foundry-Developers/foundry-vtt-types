import { expectTypeOf } from "vitest";

import CameraViews = foundry.applications.apps.av.CameraViews;
import CameraPopout = foundry.applications.apps.av.CameraPopout;
import AVSettings = foundry.av.AVSettings;

const cameraViews = new CameraViews();

expectTypeOf(CameraViews.DEFAULT_OPTIONS).toEqualTypeOf<CameraViews.DefaultOptions>();
expectTypeOf(cameraViews.DOCK_ICONS).toEqualTypeOf<Record<AVSettings.DOCK_POSITIONS, [string, string]>>();
expectTypeOf(cameraViews.hidden).toEqualTypeOf<boolean>();
expectTypeOf(cameraViews.isHorizontal).toEqualTypeOf<boolean>();
expectTypeOf(cameraViews.isVertical).toEqualTypeOf<boolean>();
expectTypeOf(cameraViews.popouts).toEqualTypeOf<CameraPopout.Any[]>();
expectTypeOf(cameraViews.users).toEqualTypeOf<Record<string, CameraViews.UserContext>>();

expectTypeOf(cameraViews.getUserCameraView("someUserId")).toEqualTypeOf<HTMLElement | null>();
expectTypeOf(cameraViews.getUserVideoElement("someUserId")).toEqualTypeOf<HTMLVideoElement | null>();
expectTypeOf(cameraViews.setUserIsSpeaking("someUserId", true)).toEqualTypeOf<void>();
expectTypeOf(cameraViews._prepareUserContext("someUserId")).toEqualTypeOf<CameraViews.UserContext | undefined>();

declare const event: PointerEvent;
declare const target: HTMLElement;
expectTypeOf(cameraViews._onBlockAudio(event, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(cameraViews._onBlockVideo(event, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(cameraViews._onDisableVideo(event, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(cameraViews._onHideUser(event, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(cameraViews._onMutePeers(event, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(cameraViews._onToggleAudio(event, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(cameraViews._onToggleVideo(event, target)).toEqualTypeOf<Promise<void>>();

declare const userContext: CameraViews.UserContext;
expectTypeOf(userContext.user).toEqualTypeOf<User.Stored>();
expectTypeOf(userContext.settings).toEqualTypeOf<AVSettings.UserSettings>();
expectTypeOf(userContext.nameplates.playerName).toEqualTypeOf<boolean>();
expectTypeOf(userContext.nameplates.charname).toEqualTypeOf<boolean>();
expectTypeOf(userContext.volume.field).toEqualTypeOf<foundry.data.fields.NumberField>();
expectTypeOf(userContext.volume.aria).toEqualTypeOf<{ label: string }>();
expectTypeOf(userContext.controls).toEqualTypeOf<Record<string, CameraViews.ControlContext>>();

// New protected surface is reachable from a subclass.
class CustomCameraViews extends CameraViews {
  protected override _onVolumeChange(event: Event): void {
    super._onVolumeChange(event);
  }

  protected override _attachFrameListeners(): void {
    super._attachFrameListeners();
  }
}
void CustomCameraViews;
