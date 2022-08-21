import { expectType } from "tsd";

expectType<Game | {}>(game);
expectType<io.Socket | null>(socket);
expectType<MainMenu | undefined>(ui.menu);
