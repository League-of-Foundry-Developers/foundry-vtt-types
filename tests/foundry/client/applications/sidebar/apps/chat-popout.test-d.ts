import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ChatPopout = foundry.applications.sidebar.apps.ChatPopout;

declare const message: ChatMessage.Implementation;

const popout = new ChatPopout({ message });

expectTypeOf(ChatPopout.DEFAULT_OPTIONS).toEqualTypeOf<ChatPopout.DefaultOptions>();

expectTypeOf(popout.message).toEqualTypeOf<ChatMessage.Implementation>();
expectTypeOf(popout.title).toEqualTypeOf<string>();

declare class _TestChatPopoutSubclass extends ChatPopout {
  protected override _initializeApplicationOptions(
    options: DeepPartial<ChatPopout.Configuration>,
  ): ChatPopout.Configuration;

  protected override _onClose(options: DeepPartial<ChatPopout.RenderOptions>): void;

  protected override _onFirstRender(
    context: DeepPartial<ChatPopout.RenderContext>,
    options: DeepPartial<ChatPopout.RenderOptions>,
  ): Promise<void>;

  protected override _renderHTML(
    context: ChatPopout.RenderContext,
    options: DeepPartial<ChatPopout.RenderOptions>,
  ): Promise<HTMLElement>;

  protected override _replaceHTML(
    result: HTMLElement,
    content: HTMLElement,
    options: DeepPartial<ChatPopout.RenderOptions>,
  ): void;

  protected override _attachFrameListeners(): void;
}

expectTypeOf(popout).toEqualTypeOf<ChatPopout>();
