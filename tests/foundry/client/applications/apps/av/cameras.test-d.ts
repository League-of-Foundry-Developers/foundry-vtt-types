import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import CameraViews = foundry.applications.apps.av.CameraViews;
import CameraPopout = foundry.applications.apps.av.CameraPopout;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

const cameraViews = new CameraViews();

expectTypeOf(CameraViews.DEFAULT_OPTIONS).toEqualTypeOf<CameraViews.DefaultOptions>();
expectTypeOf(CameraViews.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

expectTypeOf(cameraViews.DOCK_ICONS).toEqualTypeOf<Record<foundry.av.AVSettings.DOCK_POSITIONS, [string, string]>>();

expectTypeOf(cameraViews.hidden).toEqualTypeOf<boolean>();
expectTypeOf(cameraViews.isHorizontal).toEqualTypeOf<boolean>();
expectTypeOf(cameraViews.isVertical).toEqualTypeOf<boolean>();
expectTypeOf(cameraViews.popouts).toEqualTypeOf<CameraPopout.Any[]>();
expectTypeOf(cameraViews.users).toEqualTypeOf<Record<string, CameraViews.UserContext>>();

expectTypeOf(cameraViews.getUserCameraView("userId")).toEqualTypeOf<HTMLElement | null>();
expectTypeOf(cameraViews.getUserVideoElement("userId")).toEqualTypeOf<HTMLVideoElement | null>();
expectTypeOf(cameraViews.setUserIsSpeaking("userId", true)).toEqualTypeOf<void>();

expectTypeOf(cameraViews._prepareUserContext("userId")).toEqualTypeOf<CameraViews.UserContext | void>();

declare const clickEvent: PointerEvent;
declare const target: HTMLElement;

expectTypeOf(cameraViews._onBlockAudio(clickEvent, target)).toEqualTypeOf<Promise<CameraViews | void>>();
expectTypeOf(cameraViews._onBlockVideo(clickEvent, target)).toEqualTypeOf<Promise<CameraViews | void>>();
expectTypeOf(cameraViews._onConfigure(clickEvent, target)).toEqualTypeOf<
  Promise<foundry.applications.settings.menus.AVConfig>
>();
expectTypeOf(cameraViews._onDisableVideo(clickEvent, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(cameraViews._onHideUser(clickEvent, target)).toEqualTypeOf<Promise<CameraViews | void>>();
expectTypeOf(cameraViews._onMutePeers(clickEvent, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(cameraViews._onToggleAudio(clickEvent, target)).toEqualTypeOf<
  Promise<CameraViews | foundry.applications.ui.Notifications.Notification<"warning"> | void>
>();
expectTypeOf(cameraViews._onToggleVideo(clickEvent, target)).toEqualTypeOf<
  Promise<CameraViews | foundry.applications.ui.Notifications.Notification<"warning"> | void>
>();

declare class _TestCameraViewsSubclass extends CameraViews {
  protected override _canRender(options: DeepPartial<CameraViews.RenderOptions>): false | void;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _onRender(
    context: DeepPartial<CameraViews.RenderContext>,
    options: DeepPartial<CameraViews.RenderOptions>,
  ): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<CameraViews.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _prepareControlsContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<CameraViews.RenderOptions>,
  ): Promise<void>;

  protected override _replaceHTML(
    result: Record<string, HTMLElement>,
    content: HTMLElement,
    options: DeepPartial<CameraViews.RenderOptions>,
  ): void;

  protected override _attachFrameListeners(): void;

  protected override _onVolumeChange(event: Event): void;

  protected static override _sortUsers(a: CameraViews.UserContext, b: CameraViews.UserContext): number;
}

expectTypeOf(cameraViews).toEqualTypeOf<CameraViews>();
