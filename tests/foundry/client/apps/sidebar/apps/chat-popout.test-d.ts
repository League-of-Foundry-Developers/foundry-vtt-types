import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const message: ChatMessage;

const popout = new ChatPopout(message);

expectTypeOf(popout.message).toEqualTypeOf<ChatMessage>();
expectTypeOf(ChatPopout.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(popout.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(popout.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(popout.render(true)).toEqualTypeOf<ChatPopout>();

expectTypeOf(popout.id).toEqualTypeOf<string>();
expectTypeOf(popout.title).toEqualTypeOf<string>();
