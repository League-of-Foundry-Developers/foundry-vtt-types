import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ChatLog = foundry.applications.sidebar.tabs.ChatLog;
import ContextMenu = foundry.applications.ux.ContextMenu;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

const chatLog = new ChatLog();

expectTypeOf(ChatLog.DEFAULT_OPTIONS).toEqualTypeOf<ChatLog.DefaultOptions>();
expectTypeOf(ChatLog.tabName).toEqualTypeOf<"chat">();
expectTypeOf(ChatLog.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();
expectTypeOf(ChatLog.CHAT_COMMANDS).toEqualTypeOf<Record<string, ChatLog.ChatCommandPattern>>();
expectTypeOf(ChatLog.MAX_MESSAGE_HISTORY).toEqualTypeOf<number>();
expectTypeOf(ChatLog.NOTIFY_DURATION).toEqualTypeOf<number>();
expectTypeOf(ChatLog.NOTIFY_TICKER).toEqualTypeOf<number>();
expectTypeOf(ChatLog.NOTIFY_UNPAUSE).toEqualTypeOf<number>();
expectTypeOf(ChatLog.PIP_DURATION).toEqualTypeOf<number>();
expectTypeOf(ChatLog.UPDATE_TIMESTAMP_FREQUENCY).toEqualTypeOf<number>();

const [parsedCommand, parsedMatch, parsedFn] = ChatLog.parse("/roll 1d20");
expectTypeOf(parsedCommand).toEqualTypeOf<string>();
expectTypeOf(parsedMatch).toEqualTypeOf<string[] | RegExpMatchArray | RegExpMatchArray[]>();
expectTypeOf(parsedFn).toEqualTypeOf<ChatLog.ChatCommandCallback | undefined>();

declare const message: ChatMessage.Implementation;
expectTypeOf(ChatLog.renderMessage(message)).toEqualTypeOf<Promise<HTMLElement>>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(ChatLog.MESSAGE_PATTERNS).toEqualTypeOf<Record<string, RegExp>>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(ChatLog.MULTILINE_COMMANDS).toEqualTypeOf<Set<string>>();

expectTypeOf(chatLog.collection).toEqualTypeOf<foundry.documents.collections.ChatMessages.Implementation>();
expectTypeOf(chatLog.history).toEqualTypeOf<{ index: number; pending: string; queue: string[] }>();
expectTypeOf(chatLog.isAtBottom).toEqualTypeOf<boolean>();

expectTypeOf(chatLog.processMessage("hello")).toEqualTypeOf<Promise<ChatMessage.Implementation | undefined>>();
expectTypeOf(chatLog.deleteMessage("messageId")).toEqualTypeOf<Promise<void>>();
expectTypeOf(chatLog.notify(message)).toEqualTypeOf<void>();
expectTypeOf(chatLog.postOne(message)).toEqualTypeOf<Promise<void>>();
expectTypeOf(chatLog.postOne(message, { scroll: true })).toEqualTypeOf<Promise<void>>();
expectTypeOf(chatLog.renderBatch(20)).toEqualTypeOf<Promise<void>>();
expectTypeOf(chatLog.scrollBottom()).toEqualTypeOf<Promise<void>>();
expectTypeOf(chatLog.updateMessage(message)).toEqualTypeOf<Promise<void>>();
expectTypeOf(chatLog.updateTimestamps()).toEqualTypeOf<void>();
expectTypeOf(chatLog._toggleNotifications()).toEqualTypeOf<void>();
expectTypeOf(chatLog._toggleNotifications({ closing: true })).toEqualTypeOf<void>();
expectTypeOf(chatLog["_refit"]()).toEqualTypeOf<void>();
expectTypeOf(chatLog._updateMessageMode()).toEqualTypeOf<void>();

declare class _TestChatLogSubclass extends ChatLog {
  protected override _configureRenderOptions(options: DeepPartial<ChatLog.RenderOptions>): void;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _onFirstRender(
    context: DeepPartial<ChatLog.RenderContext>,
    options: DeepPartial<ChatLog.RenderOptions>,
  ): Promise<void>;

  protected override _onRender(
    context: DeepPartial<ChatLog.RenderContext>,
    options: DeepPartial<ChatLog.RenderOptions>,
  ): Promise<void>;

  protected override _postRender(
    context: DeepPartial<ChatLog.RenderContext>,
    options: DeepPartial<ChatLog.RenderOptions>,
  ): Promise<void>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<ChatLog.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _prepareInputContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<ChatLog.RenderOptions>,
  ): Promise<void>;

  protected override _renderHTML(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
  ): Promise<Record<string, HTMLElement>>;

  protected override _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected override _preSyncInputState(
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected override _syncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected override _syncInputState(
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected override _attachPartListeners(
    partId: string,
    htmlElement: HTMLElement,
    options: DeepPartial<ChatLog.RenderOptions>,
  ): void;

  protected override _attachLogListeners(element: HTMLElement, options: DeepPartial<ChatLog.RenderOptions>): void;

  protected override _onActivate(): void;

  protected override _onClickNotification(event: PointerEvent): void;

  protected override _onClose(options: DeepPartial<ChatLog.RenderOptions>): void;

  protected override _onConfigurePlugins(event: Event): void;

  protected override _onDeactivate(): void;

  protected override _preClose(options: DeepPartial<ChatLog.RenderOptions>): Promise<void>;

  protected override _shouldShowNotifications(options?: ChatLog.ShouldShowNotificationsOptions): boolean;
}

expectTypeOf(chatLog).toEqualTypeOf<ChatLog>();
