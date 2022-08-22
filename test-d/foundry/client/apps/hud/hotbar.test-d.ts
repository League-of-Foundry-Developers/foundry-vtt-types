import { expectType } from "tsd";

const hotbar = new Hotbar();
expectType<number>(hotbar.page);
expectType<Macro[]>(hotbar.macros);
expectType<MaybePromise<object>>(hotbar.getData());

expectType<Promise<boolean>>(hotbar.collapse());
expectType<Promise<boolean>>(hotbar.expand());
expectType<void>(hotbar.changePage());
expectType<void>(hotbar.changePage(5));
expectType<void>(hotbar.cyclePage());
expectType<void>(hotbar.cyclePage(1));
expectType<void>(hotbar.cyclePage(-1));
