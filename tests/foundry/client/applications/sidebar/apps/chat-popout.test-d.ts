import { expectTypeOf } from "vitest";
import type { DeepPartial, MaybePromise } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import ChatPopout = foundry.applications.sidebar.apps.ChatPopout;

declare const message: ChatMessage.Implementation;

const popout = new ChatPopout({ message });

expectTypeOf(popout).toExtend<ApplicationV2.Any>();

expectTypeOf(popout.message).toEqualTypeOf<ChatMessage.Implementation>();

// Empty when the message content is hidden, so this stays a plain string rather than gaining `null`.
expectTypeOf(popout.title).toBeString();

declare const configuration: DeepPartial<ChatPopout.Configuration>;
declare const context: DeepPartial<ChatPopout.RenderContext>;
declare const options: DeepPartial<ChatPopout.RenderOptions>;

expectTypeOf(popout["_initializeApplicationOptions"](configuration)).toEqualTypeOf<ChatPopout.Configuration>();

// Synchronous at runtime, but kept at the base's width so async overrides still fit.
expectTypeOf(popout["_onClose"](options)).toEqualTypeOf<MaybePromise<void>>();
expectTypeOf(popout["_onFirstRender"](context, options)).toEqualTypeOf<Promise<void>>();

declare const renderContext: ChatPopout.RenderContext;
expectTypeOf(popout["_renderHTML"](renderContext, options)).toEqualTypeOf<Promise<HTMLElement>>();

declare const element: HTMLElement;
expectTypeOf(popout["_replaceHTML"](element, element, options)).toBeVoid();
expectTypeOf(popout["_attachFrameListeners"]()).toBeVoid();

expectTypeOf<ChatPopout.Configuration["message"]>().toEqualTypeOf<ChatMessage.Implementation>();
