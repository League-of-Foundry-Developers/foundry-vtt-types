import { expectTypeOf } from "vitest";

expectTypeOf(game).toEqualTypeOf<Game | {}>();
expectTypeOf(ui.menu).toEqualTypeOf<MainMenu>();

const myColor = Color.from("foobar");

expectTypeOf(myColor).toEqualTypeOf<number | Color>();
