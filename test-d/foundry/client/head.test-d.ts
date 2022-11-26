import { expectType } from "tsd";

expectType<Game | {}>(game);
expectType<MainMenu | undefined>(ui.menu);
