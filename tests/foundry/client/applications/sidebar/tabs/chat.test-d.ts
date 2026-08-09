import { expectTypeOf } from "vitest";
import type { DeepPartial, MaybePromise } from "fvtt-types/utils";

import AbstractSidebarTab = foundry.applications.sidebar.AbstractSidebarTab;
import ChatLog = foundry.applications.sidebar.tabs.ChatLog;
import ChatMessages = foundry.documents.collections.ChatMessages;
import ContextMenu = foundry.applications.ux.ContextMenu;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

declare const chat: ChatLog;

expectTypeOf(chat).toExtend<AbstractSidebarTab.Any>();

// Widened from the `"chat"` literal so a subclass can occupy its own sidebar tab.
expectTypeOf(ChatLog.tabName).toBeString();
expectTypeOf(ChatLog.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();
expectTypeOf(ChatLog.CHAT_COMMANDS).toEqualTypeOf<Record<string, ChatLog.ChatCommandPattern>>();
expectTypeOf(ChatLog.MAX_MESSAGE_HISTORY).toBeNumber();
expectTypeOf(ChatLog.NOTIFY_DURATION).toBeNumber();
expectTypeOf(ChatLog.NOTIFY_TICKER).toBeNumber();
expectTypeOf(ChatLog.NOTIFY_UNPAUSE).toBeNumber();
expectTypeOf(ChatLog.PIP_DURATION).toBeNumber();
expectTypeOf(ChatLog.UPDATE_TIMESTAMP_FREQUENCY).toBeNumber();

expectTypeOf(chat.collection).toEqualTypeOf<ChatMessages.Implementation>();
expectTypeOf(chat.history).toEqualTypeOf<ChatLog.History>();
expectTypeOf(chat.isAtBottom).toBeBoolean();

expectTypeOf(chat["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();

declare const context: DeepPartial<ChatLog.RenderContext>;
declare const options: DeepPartial<ChatLog.RenderOptions>;
expectTypeOf(chat["_configureRenderOptions"](options)).toBeVoid();
expectTypeOf(chat["_onFirstRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat["_onRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat["_postRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat["_preClose"](options)).toEqualTypeOf<Promise<void>>();
// Synchronous at runtime, kept at the base's width so an async override still fits.
expectTypeOf(chat["_onClose"](options)).toEqualTypeOf<MaybePromise<void>>();

declare const partContext: ChatLog.RenderContext;
expectTypeOf(chat["_prepareInputContext"](partContext, options)).toEqualTypeOf<Promise<void>>();

declare const element: HTMLElement;
declare const state: ChatLog.InputPartState;
expectTypeOf(chat["_preSyncInputState"](element, element, state)).toBeVoid();
expectTypeOf(chat["_syncInputState"](element, element, state)).toBeVoid();

declare const partOptions: DeepPartial<HandlebarsApplicationMixin.RenderOptions>;
expectTypeOf(chat["_attachPartListeners"]("log", element, partOptions)).toBeVoid();
expectTypeOf(chat["_attachLogListeners"](element, options)).toBeVoid();

expectTypeOf(chat["_onActivate"]()).toBeVoid();
expectTypeOf(chat["_onDeactivate"]()).toBeVoid();

declare const pointerEvent: PointerEvent;
expectTypeOf(chat["_onClickNotification"](pointerEvent)).toBeVoid();

declare const pluginsEvent: foundry.applications.elements.HTMLProseMirrorElement.ProseMirrorPluginsEvent;
expectTypeOf(chat["_onConfigurePlugins"](pluginsEvent)).toBeVoid();

// `"invalid"` and `"none"` come back without a handler, so the third element is optional.
expectTypeOf(ChatLog.parse("/roll 1d20")).toEqualTypeOf<ChatLog.ParseResult>();
expectTypeOf<ChatLog.ParseResult[2]>().toEqualTypeOf<ChatLog.ChatCommandCallback | undefined>();

declare const message: ChatMessage.Implementation;
expectTypeOf(chat.processMessage("hello")).toEqualTypeOf<Promise<ChatMessage.Implementation | void>>();
expectTypeOf(chat.processMessage("hello", { speaker: ChatMessage.getSpeaker() })).toEqualTypeOf<
  Promise<ChatMessage.Implementation | void>
>();

expectTypeOf(chat.deleteMessage("messageId")).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat.deleteMessage("messageId", { deleteAll: true })).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat.notify(message)).toBeVoid();
expectTypeOf(chat.notify(message, { newMessage: true })).toBeVoid();
expectTypeOf(chat.postOne(message)).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat.postOne(message, { before: "messageId", notify: true, scroll: false })).toEqualTypeOf<
  Promise<void>
>();
expectTypeOf(chat.renderBatch(100)).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat.scrollBottom()).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat.scrollBottom({ popout: true, waitImages: true })).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat.updateMessage(message)).toEqualTypeOf<Promise<void>>();
expectTypeOf(chat.updateTimestamps()).toBeVoid();

expectTypeOf(ChatLog.renderMessage(message)).toEqualTypeOf<Promise<HTMLElement>>();
expectTypeOf(ChatLog.renderMessage(message, { canDelete: false })).toEqualTypeOf<Promise<HTMLElement>>();

expectTypeOf(chat["_shouldShowNotifications"]()).toBeBoolean();
expectTypeOf(chat["_shouldShowNotifications"]({ closing: true })).toBeBoolean();
expectTypeOf(chat._toggleNotifications()).toBeVoid();
expectTypeOf(chat._toggleNotifications({ closing: true })).toBeVoid();
expectTypeOf(chat._updateMessageMode()).toBeVoid();

// A command's enforced mode is keyed off the registry, so a module that registers its own mode can use it.
expectTypeOf<ChatLog.ChatCommandPattern["mode"]>().toEqualTypeOf<keyof CONFIG.ChatMessage.Modes | undefined>();
expectTypeOf<CONFIG.ChatMessage.Modes["public"]>().toEqualTypeOf<CONFIG.ChatMessage.ModeConfig>();
// Optional despite Foundry's typedef; no built-in mode defines one.
expectTypeOf<CONFIG.ChatMessage.ModeConfig["handler"]>().toEqualTypeOf<
  ((data: CONFIG.ChatMessage.ModeData) => void) | undefined
>();
expectTypeOf<CONFIG.ChatMessage.ModeData>().toExtend<Partial<ChatMessage.CreateData>>();

// A multi-line command gets one entry per line, and an unmatched line is `null` rather than dropped.
expectTypeOf<ChatLog.ParseMatch>().toEqualTypeOf<string[] | RegExpMatchArray | (RegExpMatchArray | null)[]>();

expectTypeOf<ChatLog.History["queue"]>().toEqualTypeOf<string[]>();
expectTypeOf<ChatLog.History["index"]>().toBeNumber();
expectTypeOf<ChatLog.History["pending"]>().toBeString();

// Added by the input part.
expectTypeOf<ChatLog.RenderContext["isAtBottom"]>().toEqualTypeOf<boolean | undefined>();

// Deprecated since v14, until v16.
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(ChatLog.MESSAGE_PATTERNS).toEqualTypeOf<Record<string, RegExp>>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(ChatLog.MULTILINE_COMMANDS).toEqualTypeOf<Set<string>>();
