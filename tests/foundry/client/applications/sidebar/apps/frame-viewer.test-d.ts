import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

// This entire file tests a single deprecated class, so every reference below is expected.
/* eslint-disable @typescript-eslint/no-deprecated */
import FrameViewer = foundry.applications.sidebar.apps.FrameViewer;

expectTypeOf(FrameViewer.DEFAULT_OPTIONS).toEqualTypeOf<FrameViewer.DefaultOptions>();

declare class _TestFrameViewer extends FrameViewer {
  protected override _configureRenderOptions(options: DeepPartial<FrameViewer.RenderOptions>): void;
  protected override _renderHTML(
    context: FrameViewer.RenderContext,
    options: DeepPartial<FrameViewer.RenderOptions>,
  ): Promise<HTMLIFrameElement>;
}
