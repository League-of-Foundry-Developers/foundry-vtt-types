import { expectTypeOf } from "vitest";

type UninitializedGame = { [K in keyof Game]?: never };

expectTypeOf(game).toEqualTypeOf<UninitializedGame | I18nInitGame | InitGame | SetupGame | ReadyGame>();
expectTypeOf(ui.menu).toEqualTypeOf<MainMenu | undefined>();

const myColor = Color.from("foobar");

expectTypeOf(myColor).toEqualTypeOf<Color>();
