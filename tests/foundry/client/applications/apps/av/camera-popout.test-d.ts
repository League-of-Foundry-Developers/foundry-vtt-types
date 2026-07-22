import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import CameraPopout = foundry.applications.apps.av.CameraPopout;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

declare const user: User.Stored;

const popout = new CameraPopout({ user });

expectTypeOf(CameraPopout.DEFAULT_OPTIONS).toEqualTypeOf<CameraPopout.DefaultOptions>();
expectTypeOf(CameraPopout.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

expectTypeOf(popout.user).toEqualTypeOf<User.Stored>();

declare class _TestCameraPopoutSubclass extends CameraPopout {
  protected override _initializeApplicationOptions(
    options: DeepPartial<CameraPopout.Configuration>,
  ): CameraPopout.Configuration;

  protected override _onFirstRender(
    context: DeepPartial<CameraPopout.RenderContext>,
    options: DeepPartial<CameraPopout.RenderOptions>,
  ): Promise<void>;

  protected override _onRender(
    context: DeepPartial<CameraPopout.RenderContext>,
    options: DeepPartial<CameraPopout.RenderOptions>,
  ): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<CameraPopout.RenderOptions> & { isFirstRender: boolean },
  ): Promise<CameraPopout.RenderContext>;

  protected override _replaceHTML(
    result: Record<string, HTMLElement>,
    content: HTMLElement,
    options: DeepPartial<CameraPopout.RenderOptions>,
  ): void;

  protected override _prePosition(position: ApplicationV2.Position): void;

  override setPosition(position?: DeepPartial<ApplicationV2.Position>): ApplicationV2.Position | void;

  protected override _onClickAction(event: PointerEvent, target: ApplicationV2.ActionTarget): void;
}

expectTypeOf(popout).toEqualTypeOf<CameraPopout>();
