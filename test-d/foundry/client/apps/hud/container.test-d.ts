import { expectType } from "tsd";

const display = new HeadsUpDisplay();
expectType<TokenHUD>(display.token);
expectType<TileHUD>(display.tile);
expectType<DrawingHUD>(display.drawing);
expectType<ChatBubbles>(display.bubbles);
expectType<MaybePromise<object>>(display.getData());
expectType<void>(display.align());
