import { expectType } from 'tsd';

expectType<Token | null>(_token);
expectType<Game | {}>(game);
expectType<MainMenu | undefined>(ui.menu);
expectType<io.Socket | null>(socket);
expectType<Canvas | undefined>(canvas);
