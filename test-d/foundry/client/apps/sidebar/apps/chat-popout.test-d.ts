import { expectType } from "tsd";

declare const message: ChatMessage;

const popout = new ChatPopout(message);
expectType<ChatMessage>(popout.message);
