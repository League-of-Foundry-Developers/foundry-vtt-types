import { expectTypeOf } from "vitest";

expectTypeOf(game).toEqualTypeOf<Game | {}>();
expectTypeOf(ui.menu).toEqualTypeOf<MainMenu | undefined>();
