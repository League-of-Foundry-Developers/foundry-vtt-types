import { expectTypeOf } from "vitest";

expectTypeOf(await Folder.createDialog()).toEqualTypeOf<Folder | undefined | null>();
